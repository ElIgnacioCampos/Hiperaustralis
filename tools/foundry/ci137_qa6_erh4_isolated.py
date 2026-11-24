#!/usr/bin/env python3
"""CI137 ERH4 isolated QA6 — exact 4-img overlay on QA5's 136 canonical Item docs.

No source JSON changes, no web or Forge deployment, no Bridge changes.
The ZIP uses the *same existing module and pack IDs*; DO NOT install over QA5.
"""
import argparse
import copy
import hashlib
import io
import json
import zipfile
from pathlib import Path, PurePosixPath
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MODULE = "hiperaustralis-compendios-prototype"
QA5 = "0.1.7-ci137qa.5"
QA6 = "0.1.7-ci137qa.6"
NAME = "HIPERAUSTRALIS_CI137_QA6_ERH4_AISLADO_NO_INSTALAR.zip"
IDS = ("j7J6wcAttET8rJpB", "RzhInApxuwq1o651",
       "INdG4JndLBl0sWto", "YfFAFtBpsdyU2l9R")
APPROVAL = ROOT / "manifests/ci137-erh-cuatro-ambiguedades-aprobacion-20261124.json"
SELECTION = ROOT / "manifests/ci137-selected-source-137-historical-ids.json"
PACKS = (("ha-proto-items", "Item"),
         ("ha-proto-actors", "Actor"),
         ("ha-proto-journals", "JournalEntry"))
MODULE_PREFIX = "modules/" + MODULE + "/"


def gate(condition, reason):
    if not condition:
        raise ValueError("CI137_QA6_ERH4_BLOCKED: " + reason)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(binary):
    return hashlib.sha256(binary).hexdigest()


def save(path, document):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def runtime_items(prepared):
    docs = {}
    for path in sorted((prepared / "items").rglob("*.json")):
        if path.name == "_Folder.json":
            continue
        j = load(path)
        gate(j.get("_id") not in docs, "duplicate runtime Item _id")
        docs[j["_id"]] = (path, j)
    gate(len(docs) == 136, "baseline must have 136 complete Items")
    return docs


def references(docs):
    total = 0
    for _, j in docs.values():
        fields = (j.get("img"), j.get("flags", {}).get("hiperaustralis-sheet", {}).get("background"))
        total += sum(isinstance(x, str) and x.startswith("modules/hiperaustralis-rituales/")
                     for x in fields)
    return total


def image_ok(binary, expected, label):
    gate(digest(binary) == expected, "image SHA-256 mismatch " + label)
    gate(binary[:4] == b"RIFF" and binary[8:12] == b"WEBP" and
         int.from_bytes(binary[4:8], "little") + 8 == len(binary),
         "WebP RIFF/size failure " + label)
    with Image.open(io.BytesIO(binary)) as im:
        im.load()
        gate(im.format == "WEBP" and im.size == (256, 256) and im.mode == "RGBA",
             "approved ERH source must be unmodified 256x256 RGBA WebP: " + label)


def overlay(prepared):
    baseline = load(prepared / "ci137-preflight.json")
    gate(baseline["count"] == 136 and baseline["folders"] == 9 and
         len(baseline["legacyAssetReferences"]) == 99 and
         baseline["additionalApprovedAssetCount"] == 6,
         "must start with pristine QA5 baseline, not a previously altered copy")
    choices = load(APPROVAL)
    gate(choices.get("decision") == "La 2da opcion cada vez" and
         choices.get("invariants", {}).get("visualApprovedCount") == 4 and
         choices.get("invariants", {}).get("additionalApprovedRuntimeTransportCount") == 0,
         "author visual approval / prior transport claim drift")
    src = load(SELECTION)
    rows = {x["id"]: x for x in src["entries"]}
    approvals = {x["id"]: x for x in choices["selectedRows"]}
    gate(len(approvals) == 4 and set(approvals) == set(IDS),
         "no more or fewer than 4 approved IDs")
    before = runtime_items(prepared)
    gate(references(before) == 99, "baseline legacy img/background count is not 99")
    previous = {iid: copy.deepcopy(j) for iid, (_, j) in before.items()}
    applied = []
    destinations = set()
    for iid in IDS:
        row = rows[iid]
        choice = approvals[iid]
        editor = row.get("editorialCrosswalk", {})
        gate(row.get("family") == "Instrumentos musicales" and
             editor.get("status") == "VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECHNICAL_QA" and
             editor.get("approvedForTransport") is False and
             editor.get("visualIdentityVerified") is True and
             not row.get("approvedAssetTransport") and
             editor.get("approvedCandidateSHA256") == choice["sha256"] and
             editor.get("approvedCandidateStagedPath") == choice["source"],
             "approved visual selection not linked to protected historical Item: " + iid)
        itempath, original = before[iid]
        source = load(ROOT / row["source"])
        gate(original["_id"] == iid and source["_id"] == iid and
             original["name"] == source["name"] == choice["name"] and
             original["type"] == source["type"] == "equippableItem" and
             original["system"]["template"] == source["system"]["template"] == "HipInstrTpl00001" and
             original["system"]["props"] == source["system"]["props"] and
             original["system"]["props"]["hipera_tipo"] == "instrumento" and
             original["flags"]["meliaz-bridge"]["kind"] == "instrumento" and
             source["flags"]["meliaz-bridge"]["kind"] == "instrumento",
             "Item semantic/template/Kona marker mismatch: " + iid)
        old = row["archivedImage"]["originalPath"]
        gate(original["img"] == source["img"] == old and
             choice["approvedChoice"] == 2 and choice["notDeployed"] is True,
             "historical image/source or explicit choice mismatch: " + iid)
        histrel = old.removeprefix("modules/hiperaustralis-rituales/assets/")
        gate(histrel != old, "unexpected historical path prefix")
        historic = ROOT / "source-original/ci137-asset-staging/ci137_v02_historico" / histrel
        gate(historic.is_file() and
             digest(historic.read_bytes()) == choice["historicalSHA256"] and
             historic.stat().st_size == choice["historicalBytes"],
             "original archived picture no longer matches approved comparison: " + iid)
        assetpath = Path(choice["source"])
        gate(not assetpath.is_absolute() and ".." not in assetpath.parts and
             assetpath.as_posix().startswith(
                 "source-original/ci137-asset-staging/instrumentos-erh/webp_256/"),
             "ERH source path outside approved staging")
        binary = (ROOT / assetpath).read_bytes()
        gate(len(binary) == choice["bytes"], "ERH source byte count drift: " + iid)
        image_ok(binary, choice["sha256"], iid)
        member = "assets/instrumentos/" + assetpath.name
        gate(member not in destinations, "same asset used for multiple approved Items")
        destinations.add(member)
        out = prepared / member
        gate(not out.exists(), "refusing to overwrite an already-transported asset " + member)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(binary)
        mutated = copy.deepcopy(original)
        newurl = MODULE_PREFIX + member
        mutated["img"] = newurl
        gate({k: v for k, v in mutated.items() if k != "img"} ==
             {k: v for k, v in original.items() if k != "img"},
             "a protected Item field besides img changed: " + iid)
        save(itempath, mutated)
        applied.append({"_id": iid, "name": choice["name"], "oldImg": old,
                        "newImg": newurl, "source": choice["source"], "member": member,
                        "sha256": choice["sha256"], "bytes": len(binary),
                        "webp": "256x256 RGBA",
                        "originalSourceSha256": choice["historicalSHA256"],
                        "transportStage": "ISOLATED_D2_QA6_NOT_INSTALLED",
                        "runtimeD3": False})

    after = runtime_items(prepared)
    changed = []
    for iid, (_, item) in after.items():
        original = previous[iid]
        if item != original:
            gate({k: v for k, v in item.items() if k != "img"} ==
                 {k: v for k, v in original.items() if k != "img"},
                 "non-img field changed during overlay: " + iid)
            changed.append(iid)
    gate(set(changed) == set(IDS), "exactly 4 img fields, and no other Items, may change")
    gate(references(after) == 95, "expected 95 remaining legacy graphical refs")
    qa = {
        "schema": "ci137-qa6-erh4-overlay-v01",
        "status": "4_APPROVED_ERH_WEBP_PATCHED_D2_ONLY__NOT_INSTALLED",
        "moduleId": MODULE, "moduleVersionCandidate": QA6,
        "baseVersion": QA5, "sourceItemCount": 136, "folderCount": 9,
        "originalLegacyReferences": 99, "newLegacyReferences": 95,
        "expectedAssetTotal": 48, "baselineAssetsPreserved": 44,
        "expectedOnlyImgFieldsChanged": 4,
        "actualChangedItemIDs": sorted(changed),
        "approvedItems": applied,
        "arpa": {
            "sourceItemId": "j7J6wcAttET8rJpB",
            "csbItemTemplate": "HipInstrTpl00001",
            "kind": "instrumento",
            "staticStructure": "PASS",
            "webpDecodeAndRGBA": "PASS",
            "foundryActorDnDAndSheetOpen": "NOT_TESTED_RUNTIME_D3"
        },
        "unchanged": ["136 historical Items and IDs", "9 folder IDs and hierarchy",
                      "all system.props / templates", "all flags/ownership/effects",
                      "Actor and Journal sources", "Bridge", "H6 and H7 worlds"],
        "runtimeD3": False, "forgeInstalled": False
    }
    save(prepared / "ci137-qa6-erh4-overlay.json", qa)
    print(json.dumps({"status": qa["status"], "changed": len(changed),
                      "legacyRefs": 95, "ArpaD2": "PASS", "runtime": "NOT_TESTED"}))


def package(prepared, compiled, dest):
    gate(not dest.exists(), "refuse overwrite output module")
    qa = load(prepared / "ci137-qa6-erh4-overlay.json")
    gate(qa["status"] == "4_APPROVED_ERH_WEBP_PATCHED_D2_ONLY__NOT_INSTALLED" and
         qa["sourceItemCount"] == 136 and qa["newLegacyReferences"] == 95 and
         len(qa["approvedItems"]) == 4, "missing author-approved exact four-Item overlay")
    base = load(ROOT / "module/module.json")
    gate(base["id"] == MODULE and base["version"] == QA5 and
         [(p["name"], p["type"]) for p in base["packs"]] == list(PACKS) and
         base["compatibility"] == {"minimum": "14.370", "verified": "14.370"} and
         base["relationships"]["systems"][0]["compatibility"] ==
         {"minimum": "6.1.2", "verified": "6.1.2"} and
         not any(k in base for k in ("scripts", "esmodules", "styles",
                                     "socket", "download", "manifest")),
         "not a safe QA5 module baseline")
    files = {}
    # Rebuild all three compendia from fresh canonical docs, no stale DB reuse.
    for name, dtype in PACKS:
        db = compiled / name
        gate((db / "CURRENT").is_file(), "missing compiled pack " + name)
        current = (db / "CURRENT").read_text(encoding="utf-8").strip()
        gate(current.startswith("MANIFEST-") and (db / current).is_file(),
             "invalid LevelDB CURRENT pointer " + name)
        members = {}
        for p in db.iterdir():
            if not p.is_file():
                gate(False, "nested LevelDB artifact " + str(p))
            n = p.name
            if n == "CURRENT" or n == current or p.suffix in (".ldb", ".sst"):
                members["packs/" + name + "/" + n] = p.read_bytes()
            elif n in ("LOCK", "LOG", "LOG.old") or p.suffix == ".log":
                # LevelDB LOG/LOG.old are mutable service diagnostics, often nonempty
                # immediately after successful CLI packing. Never include them.
                # Nonempty numbered .log files may carry unflushed transactions:
                # refuse those, as QA5's durable-pack sanitizer does.
                gate(not (p.suffix == ".log" and p.stat().st_size),
                     "nonempty transaction .log may contain unflushed data " + str(p))
            else:
                gate(False, "unexpected pack file " + str(p))
        gate(any(k.endswith((".ldb", ".sst")) for k in members), "empty SST " + name)
        files.update(members)
    old_assets = sorted((ROOT / "module/assets").rglob("*.webp"))
    gate(len(old_assets) == 44, "44 approved QA5 assets must be preserved unchanged")
    for p in old_assets:
        rel = "assets/" + p.relative_to(ROOT / "module/assets").as_posix()
        gate(rel not in files, "duplicate original asset")
        files[rel] = p.read_bytes()
    for x in qa["approvedItems"]:
        rel = x["member"]
        gate(rel not in files and rel.startswith("assets/instrumentos/"),
             "visual approval collided with QA5 asset: " + rel)
        raw = (prepared / rel).read_bytes()
        image_ok(raw, x["sha256"], x["_id"])
        files[rel] = raw
    gate(len([x for x in files if x.startswith("assets/")]) == 48,
         "48 WebP needed (44 protected + 4 approved ERH)")
    upgrade = copy.deepcopy(base)
    upgrade["version"] = QA6
    upgrade["title"] = "Hiperaustralis · CI137 QA6 ERH4 — aislada (NO INSTALAR)"
    upgrade["description"] = (
        "Solo diagnóstico D2: cuatro imágenes ERH aprobadas sustituyen exclusivamente "
        "las rutas img de Arpa de boca, Campana Lickanantay, Cuerno musical y Flauta de hueso. "
        "QA6 no ha sido probada ni autorizada en Forge; QA5 permanece estable."
    )
    files["module.json"] = (json.dumps(upgrade, indent=2, ensure_ascii=False) + "\n").encode()
    files["QA/CI137_QA6_ERH4_APROBACIONES_Y_CONTROL.json"] = (
        json.dumps(qa, ensure_ascii=False, indent=2) + "\n").encode()
    files["QA/README.txt"] = (
        "CI137 QA6 ERH4 — NO INSTALAR, NO PUBLICAR.\n"
        "Experimental direct package for diagnostic ONLY; installing replaces CI137 QA5 globally.\n"
        "4 approved ERH icon replacements only, no other Item edits.\n"
        "136 Items, 9 folders, 1 Actor, 1 Journal/21 pages, 48 WebP (44 baseline + 4 ERH).\n"
        "95 historical image references remain unchanged and unresolved.\n"
        "Arpa de boca passed JSON template + 256 RGBA WebP D2 checks; Foundry D3 NOT TESTED.\n"
        "No scripts, no migration hooks, no Bridge patch, no Forge deployment.\n"
    ).encode()
    gate(not any(p.endswith(".zip") for p in files), "nested ZIP forbidden")
    dest.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for n, data in sorted(files.items()):
            safe = PurePosixPath(n)
            gate(n == safe.as_posix() and not safe.is_absolute() and ".." not in safe.parts,
                 "unsafe package member " + n)
            member = zipfile.ZipInfo(n, date_time=(2026, 11, 24, 0, 0, 0))
            member.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(member, data)
    with zipfile.ZipFile(dest) as z:
        gate(z.testzip() is None and len(z.namelist()) == len(files), "ZIP corruption")
        manifest = json.loads(z.read("module.json"))
        gate(manifest["id"] == MODULE and manifest["version"] == QA6 and
             len(manifest["packs"]) == 3 and
             not any(k in manifest for k in ("download","manifest","scripts","esmodules")),
             "unsafe QA6 module declaration")
        gate(len([n for n in z.namelist() if n.startswith("assets/") and n.endswith(".webp")]) == 48,
             "final binary counts differ from approved 48")
    report = {
        "status": "QA6_ISOLATED_D2_PACKAGE_PASS__RUNTIME_NOT_TESTED",
        "module": MODULE, "version": QA6, "baseVersion": QA5,
        "items": 136, "folders": 9, "actors": 1, "journals": 1,
        "journalPages": 21, "webp": 48, "newApprovedERH": 4,
        "legacyGraphicReferences": 95, "runtimeD3": False,
        "ForgeDeployment": False, "originalQA5Intact": True,
        "memberCount": len(files), "zipFilename": dest.name, "bytes": dest.stat().st_size,
        "sha256": digest(dest.read_bytes())
    }
    save(dest.parent / "CI137_QA6_ERH4_D2_REPORT.json", report)
    print(json.dumps(report, ensure_ascii=False))


def check_final(prepared, final_zip, unpacked_items, unpacked_actors, unpacked_journals):
    qa = load(prepared / "ci137-qa6-erh4-overlay.json")
    with zipfile.ZipFile(final_zip) as z:
        gate(z.testzip() is None, "final ZIP CRC")
        data = {name: z.read(name) for name in z.namelist()}
        gate(len([p for p in data if p.startswith("assets/") and p.endswith(".webp")]) == 48,
             "final ZIP missing 4 ERH or altered originals")
        for p in sorted((ROOT / "module/assets").rglob("*.webp")):
            rel = "assets/" + p.relative_to(ROOT / "module/assets").as_posix()
            gate(data[rel] == p.read_bytes(), "QA5 art was changed in QA6 " + rel)
        for x in qa["approvedItems"]:
            gate(data[x["member"]] == (prepared / x["member"]).read_bytes(),
                 "approved user ERH source changed in package " + x["_id"])
        gate(json.loads(data["module.json"])["version"] == QA6,
             "QA6 manifest version changed")
    src = runtime_items(prepared)
    actual = {}
    for p in unpacked_items.rglob("*.json"):
        if p.name == "_Folder.json":
            continue
        j = load(p)
        gate(j["_id"] not in actual, "duplicate unpacked runtime Item")
        actual[j["_id"]] = j
    gate(set(src) == set(actual), "136 Item ID set differs")
    for iid, (_, expected) in src.items():
        recovered = actual[iid]
        for key in ("_id","name","type","img","system","flags","folder","ownership"):
            gate(recovered.get(key) == expected.get(key),
                 "D2 unpack changed Item " + iid + "/" + key)
    folders = [p for p in unpacked_items.rglob("_Folder.json")]
    actors = [p for p in unpacked_actors.rglob("*.json")]
    journals = [p for p in unpacked_journals.rglob("*.json")]
    gate(len(folders) == 9 and len(actors) == 1 and len(journals) == 1,
         "unpack contains invalid folder/Actor/Journal inventory")
    gate(len(load(journals[0])["pages"]) == 21, "Journal page inventory changed")
    gate(references(src) == 95, "legacy references after approved replacement !=95")
    print(json.dumps({
        "status": "QA6_FINAL_CLI_READBACK_PASS__D3_PENDING",
        "items": 136,"folders":9,"actors":1,"journalPages":21,
        "only4ItemImgsChanged": True,"approvedERH":4,"remainingLegacyRefs":95,
        "runtimeD3": False}, ensure_ascii=False))


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="action", required=True)
    a = sub.add_parser("overlay")
    a.add_argument("--prepared", type=Path, required=True)
    a = sub.add_parser("package")
    a.add_argument("--prepared", type=Path, required=True)
    a.add_argument("--compiled", type=Path, required=True)
    a.add_argument("--out", type=Path, required=True)
    a = sub.add_parser("check-final")
    a.add_argument("--prepared", type=Path, required=True)
    a.add_argument("--zip", type=Path, required=True)
    a.add_argument("--unpacked-items", type=Path, required=True)
    a.add_argument("--unpacked-actors", type=Path, required=True)
    a.add_argument("--unpacked-journals", type=Path, required=True)
    args = p.parse_args()
    if args.action == "overlay":
        overlay(args.prepared)
    elif args.action == "package":
        package(args.prepared, args.compiled, args.out)
    else:
        check_final(args.prepared, args.zip, args.unpacked_items,
                    args.unpacked_actors, args.unpacked_journals)
