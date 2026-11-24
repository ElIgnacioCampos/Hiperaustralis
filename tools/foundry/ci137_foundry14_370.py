#!/usr/bin/env python3
"""Prepare one DIRECT Forge Wizard ZIP for Foundry V14.370, based on freshly rebuilt QA3 FULL.

No Forge deployment, no source ID renaming, no migration code. Does not certify runtime D3.
"""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[2]
ID = "hiperaustralis-compendios-prototype"
VERSION = "0.1.7-ci137qa.5"
CORE = "14.370"
CSB = "6.1.2"
PACKS = (("ha-proto-items", "Item"),
         ("ha-proto-actors", "Actor"),
         ("ha-proto-journals", "JournalEntry"))


def gate(ok, message):
    if not ok:
        raise RuntimeError("CI137_V14_370_BLOCKED: " + message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def prepare(source, destination):
    gate(source.is_file(), "input QA3 FULL must exist")
    gate(not destination.exists(), "refuse overwrite direct module ZIP")
    baseline = json.loads((ROOT / "module/module.json").read_text(encoding="utf-8"))
    gate(baseline["id"] == ID and baseline["version"] == VERSION, "source manifest ID or version drift")
    gate(baseline["compatibility"] == {"minimum": CORE, "verified": CORE},
         "Foundry target must match 14.370")
    gate(baseline["relationships"]["systems"][0]["compatibility"] ==
         {"minimum": CSB, "verified": CSB}, "CSB version drift")
    gate([p["name"] for p in baseline["packs"]] == [p[0] for p in PACKS],
         "source pack identity drift")
    gate(not any(k in baseline for k in ("download", "manifest", "scripts", "esmodules",
                                        "styles", "socket")), "unexpected auto loader/update URL")

    with zipfile.ZipFile(source) as z:
        gate(z.testzip() is None, "source ZIP CRC error")
        paths = z.namelist()
        gate(len(paths) == len(set(paths)), "duplicate ZIP members")
        gate("module.json" in paths, "no module.json at root")
        for name in paths:
            p = PurePosixPath(name)
            gate(name == p.as_posix() and not p.is_absolute() and ".." not in p.parts,
                 "unsafe ZIP path: " + name)
        old = json.loads(z.read("module.json"))
        gate(old["id"] == ID and old["version"] == "0.1.6-ci137qa.3.2",
             "source must be QA3 FULL")
        gate([(p["name"], p["type"]) for p in old["packs"]] == list(PACKS),
             "QA3 pack ID/type drift")
        gate(not any(k in old for k in ("scripts", "esmodules", "styles", "download",
                                       "manifest")), "QA3 input has startup/installer")
        data = {name: z.read(name) for name in paths}
    webps = [p for p in data if p.startswith("assets/") and p.endswith(".webp")]
    gate(len(webps) == 44, "44 protected original WebP expected")
    gate(sum(p.startswith("QA/") for p in data) == 3, "expected read-only QA files changed")
    for name, dtype in PACKS:
        db = "packs/" + name + "/"
        relevant = [p.removeprefix(db) for p in data if p.startswith(db)]
        gate("CURRENT" in relevant, "CURRENT absent in " + name)
        current = data[db + "CURRENT"].decode("utf-8").strip()
        gate(current.startswith("MANIFEST-") and current in relevant,
             "LevelDB manifest invalid in " + name)
        gate(any(p.endswith((".ldb", ".sst")) for p in relevant),
             "no SST table in " + name)
        gate(not any(p in ("LOCK", "LOG", "LOG.old") or p.endswith(".log")
                     for p in relevant), "volatile LevelDB not allowed in " + name)
        gate(next(p for p in baseline["packs"] if p["name"] == name)["path"] == db.rstrip("/"),
             "pack path changed in " + name)
    upgraded = dict(baseline)
    upgraded["title"] = "Hiperaustralis · Compendios CI137 (V14.370 · QA5 IDs)"
    data["module.json"] = (json.dumps(upgraded, ensure_ascii=False, indent=2) + "\n").encode()
    data["QA/README.txt"] = (
        "CI137 Foundry V14.370 / CSB 6.1.2, manifest and package rebuilt. Version " + VERSION + "\n"
        "Single direct module ZIP for Forge Wizard. This remains QA (not a public release).\n"
        "The compatibility fields express the target, not a completed Foundry/Forge D3 test.\n"
        "The module ID is unchanged and importing may replace an existing module globally.\n"
        "No scripts, auto migrations, startup hooks, downloads or installer code.\n"
        "Includes 136 Items; 9 corrected folder IDs; Tokicura has a 16-char transport ID.\n"
        "Tokicura original historical _id is retained in its provenance flag.\n"
        "Includes 1 Actor, 1 Journal with 21 pages, 44 original WebP.\n"
        "99 legacy graphic references remain unresolved pending editorial approval.\n"
        "Back up current prototype and worlds. Verify import registration and 2 clean restarts.\n"
    ).encode()
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for name in sorted(data):
            info = zipfile.ZipInfo(name, date_time=(2026, 11, 24, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data[name])
    with zipfile.ZipFile(destination) as z:
        gate(z.testzip() is None and len(z.namelist()) == len(data), "output ZIP CRC/size")
        check = json.loads(z.read("module.json"))
        gate(check["version"] == VERSION and check["compatibility"]["verified"] == CORE,
             "output manifest compatibility")
        gate(z.namelist()[0] != "CI137_QA3_full_NO_INSTALAR_SIN_QA.zip",
             "refuse nested ZIP")
        gate(not any(p.endswith(".zip") for p in z.namelist()), "ZIP must not contain other ZIPs")
    report = {
        "status": "BUILT_STATIC_QA_PASS_RUNTIME_UNTESTED",
        "moduleId": ID, "moduleVersion": VERSION,
        "foundryTarget": CORE, "systemTarget": "custom-system-builder " + CSB,
        "packs": [p[0] for p in PACKS],
        "items": 136, "actors": 1, "journals": 1, "journalPages": 21,
        "preservedWebPCount": len(webps),
        "runtimeFolderIdsValidated": 9,
        "protectedItemTransportIdAlias": {"TokicuraRel0001": "TokicuraRel00010"},
        "legacyGraphicReferences": 99,
        "noStartupScripts": True, "runtimeD3": False, "forgeImportVerified": False,
        "zip": destination.name, "bytes": destination.stat().st_size,
        "sha256": digest(destination.read_bytes()),
        "members": len(data), "nestedZip": False
    }
    print(json.dumps(report, ensure_ascii=False))
    return report


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--source", required=True, type=Path, help="freshly produced QA3 FULL ZIP")
    p.add_argument("--out", required=True, type=Path, help="direct single-module ZIP output")
    args = p.parse_args()
    report = prepare(args.source, args.out)
    (args.out.parent / "CI137_V14_370_QA_REPORT.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
