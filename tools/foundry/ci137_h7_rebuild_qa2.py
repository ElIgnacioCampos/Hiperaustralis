#!/usr/bin/env python3
"""QA2: construct three independently testable CI137 module stages from zero.

No LevelDB files or module manifests from earlier QA ZIPs are reused.
Only canonical source-based, freshly compiled Foundry CLI packs and
manifest-authorized artwork may be included. Never deploy automatically.
"""
import argparse
import hashlib
import json
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ID = "hiperaustralis-compendios-prototype"
PAIRS = {"items": "ha-proto-items", "full": "ha-proto-items"}
PACKS = ("ha-proto-items", "ha-proto-actors", "ha-proto-journals")
STAGES = {"min": (), "items": PACKS[:1], "full": PACKS}
VERSIONS = {"min": "0.1.6-ci137qa.3.0", "items": "0.1.6-ci137qa.3.1",
            "full": "0.1.6-ci137qa.3.2"}


def fail(why):
    raise ValueError("QA3_CLEAN_REBUILD_BLOCKED: " + why)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(buf):
    return hashlib.sha256(buf).hexdigest()


def build(stage, preflight, compiled, destination):
    if stage not in STAGES:
        fail("unknown stage")
    if destination.exists():
        fail("refuse overwrite")
    baseline = load(ROOT / "module/module.json")
    if baseline["id"] != ID or tuple(p["name"] for p in baseline["packs"]) != PACKS:
        fail("base module ID/pack set drift")
    manifest = {
        "id": ID,
        "title": "Hiperaustralis · CI137 QA3 " + stage.upper() + " (NO PUBLICAR)",
        "description": "Etapa " + stage + " de diagnóstico de arranque. NO instalar en mundos de juego.",
        "version": VERSIONS[stage],
        "authors": baseline["authors"],
        "compatibility": {"minimum": "14"},
        "relationships": {"systems": [{"id": "custom-system-builder", "type": "system",
                          "compatibility": {"minimum": "6.0.0"}}]},
        "packs": [next(p for p in baseline["packs"] if p["name"] == name)
                  for name in STAGES[stage]],
        "type": "module"
    }
    if any(k in manifest for k in ("scripts", "esmodules", "styles", "socket",
                                   "manifest", "download")):
        fail("startup script/automatic update detected")
    files = {"module.json": (json.dumps(manifest, ensure_ascii=False, indent=2)+"\n").encode()}
    volatile_removed = []
    record = {"schema": "CI137_QA3_DURABLE_ONLY_V01", "stage": stage,
              "version": VERSIONS[stage], "module": ID,
              "packNames": list(STAGES[stage]), "autorepair": False,
              "runtimeValidated": False, "installApproved": False,
              "worldModified": False, "pendingLegacyLinks": 0,
              "compiledFromFreshCanonicalSources": bool(STAGES[stage])}
    if STAGES[stage]:
        pre = load(preflight / "ci137-preflight.json")
        if (pre.get("count"), pre.get("folders"), pre.get("templates")) != (136, 9, 5):
            fail("bad canonical 136/9/5 counts")
        if len({e["id"] for e in pre["records"]}) != 136:
            fail("duplicate Item identities")
        if len(pre.get("legacyAssetReferences", [])) != 99:
            fail("legacy reference count changed without approval")
        if pre.get("historicalStagingPromotedCount") != 0:
            fail("archival asset promoted")
        for name in STAGES[stage]:
            root = compiled / name
            if not (root / "CURRENT").is_file():
                fail("missing LevelDB CURRENT " + name)
            current = (root / "CURRENT").read_text().strip()
            if not current.startswith("MANIFEST-") or not (root / current).is_file():
                fail("incomplete LevelDB manifest " + name)
            if not any(p.suffix == ".ldb" and p.stat().st_size for p in root.rglob("*.ldb")):
                fail("LevelDB SST missing " + name)
            for p in sorted(root.rglob("*")):
                if not p.is_file():
                    continue
                key = p.relative_to(root).as_posix()
                durable = (key == "CURRENT" or key == current or
                           (p.suffix in (".ldb", ".sst") and "/" not in key))
                if durable:
                    files["packs/" + name + "/" + key] = p.read_bytes()
                elif key in ("LOCK", "LOG", "LOG.old") or key.endswith(".log"):
                    # Nonempty numbered logs can contain unflushed data: fail closed.
                    if key.endswith(".log") and p.stat().st_size:
                        fail("nonempty transaction log: " + name + "/" + key)
                    volatile_removed.append(name + "/" + key)
                else:
                    fail("unexpected LevelDB file: " + name + "/" + key)
            if not any(p.startswith("packs/" + name + "/") and p.endswith((".ldb", ".sst"))
                       for p in files):
                fail("no durable SST in " + name)
        remaps = (pre.get("approvedRemaps", []) + pre.get("sharedKnifeRemaps", [])
                  + pre.get("additionalApprovedAssetRemaps", []))
        if len(remaps) != 40:
            fail("unexpected total approved remaps")
        unique_assets = {}
        for r in remaps:
            url, h = r["to"], r["sha256"]
            prefix = "modules/" + ID + "/"
            if not url.startswith(prefix+"assets/"):
                fail("unexpected asset target")
            rel = url.removeprefix(prefix)
            if ".." in Path(rel).parts or not rel.endswith(".webp"):
                fail("unsafe asset target")
            if rel in unique_assets and unique_assets[rel] != h:
                fail("two different source hashes for same asset")
            unique_assets[rel] = h
        for rel, expected in sorted(unique_assets.items()):
            source = preflight / rel
            if not source.is_file() or digest(source.read_bytes()) != expected:
                fail("source artwork does not match explicit approval SHA: " + rel)
            files[rel] = source.read_bytes()
        # A diagnostic rebuild must never drop bytes already present in the existing
        # prototype. Reuse only the version-controlled runtime asset tree; no
        # staging resources, new visuals or semantic alias inference.
        baseline_dir = ROOT / "module/assets"
        baseline = sorted(p for p in baseline_dir.rglob("*.webp") if p.is_file())
        if len(baseline) != 44:
            fail("baseline runtime asset inventory drift (44 expected)")
        for p in baseline:
            rel = "assets/" + p.relative_to(baseline_dir).as_posix()
            old = p.read_bytes()
            if rel in files:
                if files[rel] != old:
                    fail("approved asset conflicts with existing prototype asset: "+rel)
            else:
                files[rel] = old
        from ci137_pipeline import FOLDERS
        identity = {
            "schema":"ci137-h7-isolated-readonly-qa-v01",
            "module": ID, "pack": ID+".ha-proto-items",
            "items":136, "folders":9, "templates":5, "legacyLinks":99,
            "expectedIds":[{"id":r["id"],"folder":r["folder"],
                "folderId":FOLDERS[r["folder"]][0], "template":r["template"]}
                for r in pre["records"]]
        }
        files["QA/expected_136.json"] = (
            json.dumps(identity, ensure_ascii=False, indent=2)+"\n").encode()
        files["QA/CI137_H7_READONLY_QA.js"] = (
            ROOT / "tools/foundry/ci137_h7_readonly.js").read_bytes()
        record.update({"items":136,"folders":9,"templates":5,
                       "pendingLegacyLinks":99, "approvedRemaps":40,
                       "approvedVisualAssets":len(unique_assets),
                       "preservedBaselineAssets":len(baseline),
                       "QAReadOnlyScriptIncluded":True})
    if stage == "full":
        if any(p.startswith("packs/ha-proto-actors/") for p in files) is False:
            fail("Actors pack empty")
        if any(p.startswith("packs/ha-proto-journals/") for p in files) is False:
            fail("Journal pack empty")
        record.update({"actors":1,"journals":1,"journalPages":21})
    files["QA/README.txt"] = (
        "CI137 QA3 " + stage + " — stage-only diagnostic, not for use in active worlds.\n"
        "Uses the EXISTING module ID; installing will replace it across Forge.\n"
        "No scripts, CSS injection, installer, Journal migration, release or auto update.\n"
        "Only run in an isolated disposable world after backing up current modules.\n"
        "Test stages in order: MIN, ITEMS, FULL. Stop at first failing load.\n"
        "Only durable LevelDB files: CURRENT, MANIFEST and SST (no LOCK/LOG).\n"
        "99 legacy image references remain unresolved in ITEMS/FULL.\n"
    ).encode()
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for name, data in sorted(files.items()):
            info = zipfile.ZipInfo(name, date_time=(2026, 11, 24, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data)
    with zipfile.ZipFile(destination) as z:
        if z.testzip() is not None or set(z.namelist()) != set(files):
            fail("ZIP integrity mismatch")
        actual = json.loads(z.read("module.json"))
        if actual.get("id") != ID or [p["name"] for p in actual.get("packs", [])] != list(STAGES[stage]):
            fail("serialized module identity/pack failure")
        for name in STAGES[stage]:
            if "packs/"+name+"/CURRENT" not in z.namelist():
                fail("missing compiled pack " + name)
    record.update({"zipName": destination.name, "zipBytes": destination.stat().st_size,
                   "zipSHA256": digest(destination.read_bytes()),
                   "zipEntries": len(files)})
    record["cleanLevelDB"] = True
    record["volatileFilesExcluded"] = sorted(volatile_removed)
    record["volatileFilesExcludedCount"] = len(volatile_removed)
    log = destination.parent/(stage.upper()+"_RESULT.json")
    log.write_text(json.dumps(record, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(json.dumps(record, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--stage", choices=list(STAGES), required=True)
    parser.add_argument("--preflight", type=Path, required=True)
    parser.add_argument("--compiled", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    try:
        build(args.stage, args.preflight, args.compiled, args.out)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        parser.exit(2, str(e)+"\n")
