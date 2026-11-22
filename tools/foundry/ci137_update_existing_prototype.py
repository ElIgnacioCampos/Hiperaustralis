#!/usr/bin/env python3
"""CI137: update ONLY the existing HA Prototipo Objects pack; never create another compendium."""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path
from assert_single_compendium import check_manifest, preserve_unchanged
from ci137_pipeline import FOLDERS

PACK="ha-proto-items"
MODULE="hiperaustralis-compendios-prototype"

def fail(msg): raise ValueError("CI137_EXISTING_PROTOTYPE_BLOCKED: "+msg)
def sha(raw): return hashlib.sha256(raw).hexdigest()
def obj(raw): return json.loads(raw.decode("utf-8"))

def archive_map(path):
    with zipfile.ZipFile(path) as z:
        if z.testzip() is not None: fail("bad CRC: "+str(path))
        names=[n for n in z.namelist() if not n.endswith("/")]
        if len(names)!=len(set(names)) or "module.json" not in names: fail("duplicate ZIP entries/missing module")
        result={n:z.read(n) for n in names}
    check_manifest(obj(result["module.json"]))
    return result

def build(baseline, items_dir, preflight_path, macro_path, out):
    if out.exists(): fail("refuse overwrite")
    old=archive_map(baseline)
    if not (items_dir/"CURRENT").is_file(): fail("compiled Item pack missing")
    newitems={str(p.relative_to(items_dir)).replace("\\","/"):p.read_bytes()
              for p in items_dir.rglob("*") if p.is_file()}
    if not any(p.endswith(".ldb") for p in newitems): fail("no real LevelDB SST")
    pre=json.loads(preflight_path.read_text(encoding="utf-8"))
    rec=pre.get("records",[])
    if (pre.get("count"),len(rec),pre.get("folders"),pre.get("templates"))!=(137,137,9,5):
        fail("preflight not 137 / 9 / 5")
    if len({r["id"] for r in rec})!=137: fail("duplicate source IDs")
    if len(pre.get("approvedRemaps",[]))!=32 or len(pre.get("legacyAssetReferences",[]))!=109:
        fail("unapproved asset-count change")
    for row in pre["approvedRemaps"]:
        p=row["to"].removeprefix("modules/"+MODULE+"/")
        if not p.startswith("assets/reliquias/") or p not in old: fail("relic image absent from baseline: "+p)
        if sha(old[p])!=row["sha256"]: fail("relic asset changed: "+p)

    m=check_manifest(obj(old["module.json"]))
    m["version"]="0.1.6-ci137qa.1"
    m.pop("manifest",None)
    m.pop("download",None)

    outfiles={k:v for k,v in old.items() if not k.startswith("packs/"+PACK+"/")}
    outfiles.update({"packs/"+PACK+"/"+p:data for p,data in newitems.items()})
    outfiles["module.json"]=(json.dumps(m,ensure_ascii=False,indent=2)+"\n").encode()
    expected={"schema":"ci137-qa-single-existing-objects-v01",
              "module":MODULE,"pack":MODULE+"."+PACK,
              "expectedIds":[{"id":r["id"],"folder":r["folder"],
                              "folderId":FOLDERS[r["folder"]][0],
                              "template":r["template"]} for r in rec],
              "items":137,"folders":9,"templates":5,"legacyLinks":109}
    outfiles["QA/expected_137.json"]=(json.dumps(expected,ensure_ascii=False,indent=2)+"\n").encode()
    outfiles["QA/CI137_SOLO_LECTURA.js"]=macro_path.read_bytes()
    outfiles["QA/README.txt"]=(
        "CI137: update the EXISTING HA Prototipo only. One Objects pack, three packs total.\n"
        "Adversarios, Journals, and all existing art are preserved byte-for-byte.\n"
        "Importing into Forge replaces this module across the Forge account: QA separately first.\n"
        "109 visual links still depend on the legacy module. No D3/visual QA yet.\n"
    ).encode()

    actualpacks={k.split("/")[1] for k in outfiles if k.startswith("packs/") and len(k.split("/"))>2}
    if actualpacks!={"ha-proto-items","ha-proto-actors","ha-proto-journals"}:
        fail("unexpected fourth/missing pack")
    for prefix in ("packs/ha-proto-actors/","packs/ha-proto-journals/","assets/"):
        before={k:sha(v) for k,v in old.items() if k.startswith(prefix)}
        after={k:sha(v) for k,v in outfiles.items() if k.startswith(prefix)}
        if not before or before!=after: fail("unchanged baseline mutated: "+prefix)
    if {k:sha(v) for k,v in old.items() if k.startswith("packs/"+PACK+"/")}=={
        k:sha(v) for k,v in outfiles.items() if k.startswith("packs/"+PACK+"/")}:
        fail("Items pack did not change")
    out.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(out,"w",compression=zipfile.ZIP_DEFLATED) as z:
        for name in sorted(outfiles):
            info=zipfile.ZipInfo(name,date_time=(2026,11,22,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info,outfiles[name])
    if archive_map(out).keys()!=outfiles.keys(): fail("output files mismatch")
    preserve_unchanged(baseline,out)
    print(json.dumps({"result":"SINGLE_EXISTING_PROTOTYPE_PASS",
                      "module":MODULE,"updatedPack":PACK,"count":137,"packs":3,
                      "untouched":["ha-proto-actors","ha-proto-journals"],
                      "assetFilesUnchanged":len([k for k in old if k.startswith("assets/")]),
                      "legacyLinks":109,"sha256":sha(out.read_bytes()),"bytes":out.stat().st_size}))

if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--baseline",required=True,type=Path)
    ap.add_argument("--items",required=True,type=Path)
    ap.add_argument("--preflight",required=True,type=Path)
    ap.add_argument("--macro",required=True,type=Path)
    ap.add_argument("--out",required=True,type=Path)
    a=ap.parse_args()
    build(a.baseline,a.items,a.preflight,a.macro,a.out)
