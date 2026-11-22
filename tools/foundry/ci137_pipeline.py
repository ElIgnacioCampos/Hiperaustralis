#!/usr/bin/env python3
"""CI137: prepare/verify exactly 137 historical Items without editing source or runtime.

The only authority for selection is manifests/ci137-selected-source-137-historical-ids.json.
Outputs are temporary Foundry CLI transport. No asset replacement, UUID rewriting,
Forge deployment, or change to prototype packs.
"""
import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "manifests/ci137-selected-source-137-historical-ids.json"
FOLDERS = {
    "Armas": ("HAObjArmas0001", None),
    "Defensas": ("HAObjDefensa001", None),
    "Equipo común": ("HAObjEquipo0001", None),
    "Instrumentos musicales": ("HAObjInstrum001", None),
    "Parafernalia": ("HAObjParafer001", None),
    "Rituales": ("HAObjRitual0001", None),
    "Reliquias": ("HAObjReliq0001", None),
    "Reliquias/Cotidianas": ("HAObjRelCot001", "HAObjReliq0001"),
    "Reliquias/Legendarias": ("HAObjRelLeg001", "HAObjReliq0001"),
}
FAMILY_FOLDER = {
    "Armas": "Armas",
    "Defensas": "Defensas",
    "Equipo común": "Equipo común",
    "Instrumentos musicales": "Instrumentos musicales",
    "Parafernalia · sanación · cultura material": "Parafernalia",
    "Rituales": "Rituales",
    "Reliquias cotidianas": "Reliquias/Cotidianas",
    "Reliquias legendarias": "Reliquias/Legendarias",
    "Reliquias": "Reliquias/Legendarias",  # Tokicura; parent folder also generated.
}
EXPECTED_FAMILY_COUNTS = {
    "Armas": 21, "Defensas": 8, "Equipo común": 40,
    "Instrumentos musicales": 21,
    "Parafernalia · sanación · cultura material": 22,
    "Rituales": 8, "Reliquias cotidianas": 8,
    "Reliquias legendarias": 8, "Reliquias": 1,
}
TEMPLATE_IDS = {
    "HipArmaTpl000001", "HipEquipTpl00001", "HipInstrTpl00001",
    "HipRelqTpl000001", "HipRitualTpl0001",
}
PRESERVED_FIELDS = ("name", "type", "img", "system", "effects", "flags", "ownership")


def fail(message):
    raise ValueError("CI137_BLOCKED: " + message)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(data):
    return hashlib.sha256(data).hexdigest()


def validate_selection():
    m = read_json(MANIFEST)
    rows = m.get("entries", [])
    if m.get("targetCount") != 137 or len(rows) != 137:
        fail("expected 137 selected sources")
    ids = [r.get("id") for r in rows]
    paths = [r.get("source") for r in rows]
    if any(not isinstance(x, str) or not x for x in ids):
        fail("missing/invalid Item ID")
    if len(ids) != len(set(ids)) or len(paths) != len(set(paths)):
        fail("duplicate ID or source path")
    if Counter(r.get("family") for r in rows) != EXPECTED_FAMILY_COUNTS:
        fail("unexpected family counts")
    if len(set(v[0] for v in FOLDERS.values())) != 9:
        fail("duplicate folder IDs")
    relics = [r for r in rows if r["family"].startswith("Reliquias ")]
    if len(relics) != 16 or len([r for r in relics if r.get("prototypeAlias") and r.get("oldUuid")]) != 16:
        fail("historical relic identity mapping incomplete")
    if not all(r["source"].startswith("source-pending/ci137-reliquias-historicas-16/")
               for r in relics):
        fail("prototype relic source illegally selected")
    if set(r["id"] for r in rows if r["source"].startswith("source-pending/")) != (
            set(r["id"] for r in rows if r["family"] not in ("Armas", "Reliquias"))):
        fail("historical pending source scope inconsistent")
    return rows


def item_data(rows):
    fixtures = {}
    for path in (ROOT / "source-original/foundry-templates").glob("fvtt-Item-*.json"):
        doc = read_json(path)
        key = doc["system"].get("uniqueId") or doc["_id"]
        fixtures[key] = doc["system"].get("templateSystemUniqueVersion")
    missing_templates = TEMPLATE_IDS.difference(fixtures)
    if missing_templates:
        fail("missing CSB template fixtures: " + repr(sorted(missing_templates)))
    found_templates = set()
    for row in rows:
        rel = Path(row["source"])
        if rel.is_absolute() or ".." in rel.parts or rel.suffix != ".json":
            fail("unsafe source path " + str(rel))
        if not (rel.parts[:2] == ("source", "items") or
                rel.parts[:2] == ("source-pending", "ci137-historicos-99") or
                rel.parts[:2] == ("source-pending", "ci137-reliquias-historicas-16")):
            fail("source outside approved roots " + str(rel))
        path = ROOT / rel
        if not path.is_file():
            fail("missing selected source: " + str(rel))
        raw = path.read_bytes()
        doc = json.loads(raw)
        if doc.get("_id") != row["id"] or doc.get("type") != "equippableItem":
            fail("identity/type mismatch " + str(rel))
        system = doc.get("system", {})
        tid = system.get("template")
        if tid not in TEMPLATE_IDS:
            fail("unknown selected template " + str(tid) + " in " + str(rel))
        if system.get("templateSystemUniqueVersion") != fixtures[tid]:
            fail("CSB template version mismatch in " + str(rel))
        if not isinstance(system.get("props"), dict):
            fail("missing props in " + str(rel))
        found_templates.add(tid)
        yield row, doc, digest(raw), FAMILY_FOLDER[row["family"]]
    if found_templates != TEMPLATE_IDS:
        fail("not all five templates used: " + repr(sorted(found_templates)))


def folder_doc(folder, folder_id, parent):
    return {
        "_id": folder_id, "name": folder.split("/")[-1], "type": "Item",
        "folder": parent, "sorting": "a", "sort": 0, "description": "",
        "flags": {}, "_key": "!folders!" + folder_id,
    }


def prepare(output):
    rows = validate_selection()
    if output.exists() and any(output.iterdir()):
        fail("refusing nonempty output directory: " + str(output))
    output.mkdir(parents=True, exist_ok=True)
    itemroot = output / "items"
    itemroot.mkdir()
    for folder, (folder_id, parent) in FOLDERS.items():
        target = itemroot.joinpath(*folder.split("/"))
        target.mkdir(parents=True, exist_ok=True)
        (target / "_Folder.json").write_text(
            json.dumps(folder_doc(folder, folder_id, parent), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    records = []
    legacy = []
    for row, doc, source_sha, folder in item_data(rows):
        folder_id = FOLDERS[folder][0]
        transport = dict(doc)
        transport["folder"] = folder_id
        transport["_key"] = "!items!" + row["id"]
        target = itemroot.joinpath(*folder.split("/"), row["id"] + ".json")
        target.write_text(
            json.dumps(transport, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        for field, value in (
            ("img", doc.get("img")),
            ("flags.hiperaustralis-sheet.background",
             doc.get("flags", {}).get("hiperaustralis-sheet", {}).get("background")),
        ):
            if isinstance(value, str) and value.startswith("modules/hiperaustralis-rituales/"):
                legacy.append({"id": row["id"], "field": field, "path": value})
        records.append({
            "id": row["id"], "source": row["source"], "sha256": source_sha,
            "folder": folder, "template": doc["system"]["template"],
        })
    report = {
        "schema": "ci137-transport-preflight-v01",
        "status": "137_REAL_SOURCES_PREPARED__ASSETS_NOT_PROMOTED",
        "count": len(records), "uniqueIds": len(set(r["id"] for r in records)),
        "folders": 9, "templates": 5,
        "legacyAssetReferences": legacy,
        "records": records,
    }
    (output / "ci137-preflight.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"status": report["status"], "items": len(records),
                      "folders": 9, "legacyRefs": len(legacy)}))


def verify(prepared, unpacked):
    manifest = read_json(prepared / "ci137-preflight.json")
    if manifest.get("count") != 137:
        fail("prepared corpus not 137")
    expected = {}
    for path in (prepared / "items").rglob("*.json"):
        if path.name != "_Folder.json":
            doc = read_json(path)
            expected[doc["_id"]] = doc
    actual, folders = {}, {}
    for path in unpacked.rglob("*.json"):
        doc = read_json(path)
        if not isinstance(doc, dict):
            fail("unpacked non-document")
        if path.name == "_Folder.json":
            if doc["_id"] in folders:
                fail("duplicate folder")
            folders[doc["_id"]] = doc
            continue
        key = doc.get("_id") or doc.get("id")
        if key in actual:
            fail("duplicate unpacked Item " + str(key))
        actual[key] = doc
    if len(expected) != 137 or set(actual) != set(expected):
        fail("roundtrip IDs differ: missing=" + repr(sorted(set(expected) - set(actual))) +
             " extra=" + repr(sorted(set(actual) - set(expected))))
    expected_folders = {v[0]: (k.split("/")[-1], v[1]) for k, v in FOLDERS.items()}
    if set(folders) != set(expected_folders):
        fail("roundtrip folder IDs differ")
    for folder_id, (name, parent) in expected_folders.items():
        if folders[folder_id].get("name") != name or folders[folder_id].get("folder") != parent:
            fail("folder hierarchy changed " + folder_id)
    for item_id, src in expected.items():
        dst = actual[item_id]
        if dst.get("folder") != src.get("folder"):
            fail("Item folder changed " + item_id)
        for field in PRESERVED_FIELDS:
            # Foundry CLI supplies the empty ActiveEffect array when the original
            # JSON omits it. This is a serialization default, not altered content.
            if field == "effects" and src.get("effects", []) == dst.get("effects", []) == []:
                continue
            if dst.get(field) != src.get(field):
                fail("Item semantic field changed " + item_id + "/" + field)
    result = {
        "status": "CI137_ROUNDTRIP_137_PASS__ASSETS_AND_RUNTIME_PENDING",
        "items": len(actual), "folders": len(folders),
        "semanticFieldsChecked": list(PRESERVED_FIELDS),
        "legacyReferenceCount": len(manifest["legacyAssetReferences"]),
        "note": "No icon/UUID promotion or Foundry client QA was performed",
    }
    (prepared / "ci137-roundtrip.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(result))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="action", required=True)
    a = sub.add_parser("prepare")
    a.add_argument("--out", type=Path, required=True)
    b = sub.add_parser("verify")
    b.add_argument("--prepared", type=Path, required=True)
    b.add_argument("--unpacked", type=Path, required=True)
    args = p.parse_args()
    try:
        if args.action == "prepare":
            prepare(args.out)
        else:
            verify(args.prepared, args.unpacked)
    except Exception as exc:
        p.exit(1, str(exc) + "\n")


if __name__ == "__main__":
    main()
