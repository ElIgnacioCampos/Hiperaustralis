#!/usr/bin/env python3
"""Build a safe *separately identified* MELIAZ LAB module from pinned 0.24.203.

Never edits the stable source module, persistent world files, or Forge.
The LAB runtime aborts its own initialization if meliaz-bridge is active.
Runtime D3 is NOT certified by this script.
"""
import argparse
import hashlib
import json
import re
import shutil
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "module/meliaz-bridge"
CANON = "meliaz-bridge"
LAB = "meliaz-bridge-lab"
VERSION = "0.24.204-lab.0"
SOURCE_JS = ("bridge.js", "kona-token-icons.js")
EXPECTED_COUNTS = {"bridge.js": 4, "kona-token-icons.js": 41}


def gate(ok, why):
    if not ok:
        raise AssertionError("MELIAZ_LAB_BUILD_BLOCKED: " + why)


def sha256(buf):
    return hashlib.sha256(buf).hexdigest()


def json_bytes(obj):
    return (json.dumps(obj, indent=2, ensure_ascii=False) + "\n").encode("utf-8")


def wrap_lab(code, original):
    gate(not re.search(r"^\s*(?:import|export)\s", code, re.M),
         "unexpected module import/export; review before wrapping")
    guard = f"""/* MELIAZ LAB D2 — compatibility guard; never run on a world with original module active. */
if (game.modules?.get("{CANON}")?.active) {{
  console.error("MELIAZ LAB: BLOQUEADO. Desactiva el Bridge original SOLO EN UNA COPIA DEL MUNDO. Ningún hook LAB se ha registrado.");
}} else {{
"""
    return (guard + code + "\n}\n").encode("utf-8")


def build(output, report):
    gate(SOURCE.is_dir() and not output.exists(), "source missing or output already exists")
    baseline = json.loads((SOURCE / "module.json").read_text(encoding="utf-8"))
    gate(baseline["id"] == CANON and baseline["version"] == "0.24.203",
         "stable base version changed; re-audit before deriving new LAB")
    gate(baseline["esmodules"] == ["kona-token-icons.js", "bridge.js"] and
         baseline["socket"] is True,
         "runtime entrypoints/socket contract changed")
    gate(baseline["relationships"]["requires"][0]["id"] == "socketlib" and
         baseline["relationships"]["systems"][0]["id"] == "custom-system-builder",
         "system or SocketLib dependencies changed")
    assets = sorted(p for p in SOURCE.rglob("*") if p.is_file())
    gate(len(assets) == 168, "reference inventory 168 source files changed")
    webps = [p for p in assets if p.suffix.lower() == ".webp"]
    gate(len([p for p in webps if p.parent.name == "kona-token-icons"]) == 40,
         "Kona 40 token WebP inventory changed")
    files = {}
    changes = []
    for p in assets:
        rel = p.relative_to(SOURCE).as_posix()
        raw = p.read_bytes()
        if rel in SOURCE_JS:
            text = raw.decode("utf-8")
            count = text.count(CANON)
            gate(count == EXPECTED_COUNTS[rel],
                 f"unexpected hardcoded module identifiers in {rel}: {count}")
            rewritten = text.replace(CANON, LAB)
            gate(not re.search(r"meliaz-bridge(?!-lab)", rewritten),
                 "source still contains a live original ID literal " + rel)
            patched = wrap_lab(rewritten, rel)
            files[rel] = patched
            changes.append({"path":rel,"originalIdReplacements":count,
                            "originalSHA256":sha256(raw),"labSHA256":sha256(patched),
                            "change":"LAB namespace + original-active runtime guard"})
        elif rel == "module.json":
            upgraded = json.loads(raw)
            upgraded["id"] = LAB
            upgraded["version"] = VERSION
            upgraded["title"] = "Hiperaustralis · MELIAZ Bridge LAB (NO H6/H7)"
            upgraded["description"] = (
                "LAB aislado desde 0.24.203. ID propio. NUNCA activar junto a meliaz-bridge. "
                "Sólo copia experimental del mundo; la primera carga puede escribir datos "
                "en Actors duplicados, igual que el Bridge original. D3 pendiente."
            )
            upgraded["compatibility"] = {"minimum":"14.370"}
            upgraded["relationships"]["systems"][0]["compatibility"] = {"minimum":"6.1.2"}
            # Foundry V14 relationship conflicts are advisory; runtime guard is
            # the fail-safe if both modules are accidentally enabled.
            upgraded["relationships"]["conflicts"] = [{"id": CANON, "type":"module"}]
            upgraded.pop("download", None)
            upgraded.pop("manifest", None)
            upgraded["manifestPlusVersion"] = None
            files[rel] = json_bytes(upgraded)
            changes.append({"path":rel,"originalSHA256":sha256(raw),
                            "labSHA256":sha256(files[rel]),
                            "change":"distinct LAB package ID; no updater; original conflict"})
        else:
            files[rel] = raw

    gate(len(files) == 168 and set(x["path"] for x in changes) ==
         {"module.json", "bridge.js", "kona-token-icons.js"},
         "only three runtime text files may change")
    for p in assets:
        rel = p.relative_to(SOURCE).as_posix()
        if rel not in ("module.json", *SOURCE_JS):
            gate(files[rel] == p.read_bytes(), "graphic or historic data altered " + rel)
    gate(not any(name.startswith("packs/") for name in files), "LAB must not ship any live compendia")
    manifest = json.loads(files["module.json"])
    gate(manifest["id"] == LAB and manifest["version"] == VERSION and
         manifest["relationships"]["conflicts"] == [{"id":CANON, "type":"module"}],
         "LAB manifest isolation failed")
    for js in SOURCE_JS:
        text = files[js].decode("utf-8")
        gate(f'game.modules?.get("{CANON}")?.active' in text and
             f"const MODULE_ID = \"{LAB}\";" in text if js == "bridge.js"
             else f'game.modules?.get("{CANON}")?.active' in text and
                  f'KONA_TOKEN_ICON_MODULE_ID = "{LAB}"' in text,
             "missing canonical-original conflict guard or lab namespace " + js)
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for name, content in sorted(files.items()):
            p = PurePosixPath(name)
            gate(not p.is_absolute() and ".." not in p.parts and
                 name == p.as_posix(), "unsafe member path " + name)
            info = zipfile.ZipInfo(name, date_time=(2026,11,24,0,0,0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, content)
    with zipfile.ZipFile(output) as z:
        gate(z.testzip() is None and len(z.namelist()) == 168,
             "generated module CRC / inventory changed")
        m = json.loads(z.read("module.json"))
        gate(m["id"] == LAB and m["version"] == VERSION and
             not any(x.endswith(".zip") for x in z.namelist()),
             "lab package validation failed")
    result={
        "status":"LAB_MODULE_DISTINCT_ID_D2_PASS__RUNTIME_NOT_TESTED",
        "moduleId":LAB,"baseModuleId":CANON,"version":VERSION,
        "sourceVersion":"0.24.203","modulesMustNotCoactivate":True,
        "conflictGuardInBothScripts":True,
        "manifestConflictsOriginal":True,
        "moduleMembers":len(files),
        "tokenImagesPreserved":40,
        "allNonJSAssetsPreservedByteIdentical":True,
        "textChanges":changes,
        "canInstallAlongsideOriginalWithoutReplacingOriginalId":True,
        "safeToActivateOnH6OrH7":False,
        "runtimeWritesPossibleInClonedWorld":True,
        "scriptSyntaxTested":False, # GitHub CI runs node --check separately
        "foundryRuntimeQA":False,
        "deployed":False,
        "zip":output.name,
        "bytes":output.stat().st_size,"sha256":sha256(output.read_bytes())
    }
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_bytes(json_bytes(result))
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out",type=Path,required=True)
    parser.add_argument("--report",type=Path,required=True)
    args=parser.parse_args()
    build(args.out,args.report)
