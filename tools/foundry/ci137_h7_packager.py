#!/usr/bin/env python3
"""Build isolated H7 QA archive for the EXISTING CI137 prototype, no install/release.

Source Item payload is generated only by ci137_pipeline.py (136 historical IDs).
Actor and Journal are copied from the existing, already versioned baseline sources.
No auto hooks, install script, renamed module IDs, or visual asset promotion.
"""
import argparse
import base64
import gzip
import hashlib
import json
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODULE_ID = "hiperaustralis-compendios-prototype"
VERSION = "0.1.6-ci137qa.1"
PACK_NAMES = ("ha-proto-items", "ha-proto-actors", "ha-proto-journals")
MODULE_PREFIX = "modules/" + MODULE_ID + "/"

def gate(ok, why):
    if not ok:
        raise RuntimeError("CI137_H7_QA_BLOCKED: " + why)

def load(path):
    return json.loads(path.read_text(encoding="utf-8"))

def sha(data):
    return hashlib.sha256(data).hexdigest()

def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def prepare_meta(out):
    gate(not out.exists() or not any(out.iterdir()), "metadata out is not empty")
    actors = sorted((ROOT / "source/actors").glob("*.json"))
    journals = sorted((ROOT / "source/journals").glob("*.json.gz.b64"))
    gate(len(actors) == 1 and len(journals) == 1, "expected one Actor and one Journal source")
    out.mkdir(parents=True, exist_ok=True)
    a = load(actors[0])
    gate(isinstance(a.get("_id"), str) and a.get("type"), "bad Actor source")
    a["_key"] = "!actors!" + a["_id"]
    write_json(out / "actors" / (a["_id"] + ".json"), a)
    raw = gzip.decompress(base64.b64decode(journals[0].read_text(encoding="utf-8")))
    j = json.loads(raw.decode("utf-8"))
    gate(isinstance(j.get("_id"), str), "bad Journal source ID")
    pages = j.get("pages", [])
    gate(len(pages) == 21, "Journal page count differs from 21")
    j["_key"] = "!journal!" + j["_id"]
    page_ids = set()
    for p in pages:
        pid = p.get("_id")
        gate(isinstance(pid, str) and pid not in page_ids, "invalid Journal page")
        page_ids.add(pid)
        p["_key"] = "!journal.pages!" + j["_id"] + "." + pid
    write_json(out / "journals" / (j["_id"] + ".json"), j)
    print(json.dumps({"status":"CI137_H7_ACTOR_JOURNAL_SOURCES_PASS",
        "actors":1,"journals":1,"journalPages":len(pages)}))

def zip_files(output, base):
    with zipfile.ZipFile(output,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for path in sorted(base.rglob("*")):
            if not path.is_file(): continue
            rel=path.relative_to(base).as_posix()
            gate(not rel.startswith("/") and ".." not in Path(rel).parts, "unsafe output path")
            info=zipfile.ZipInfo(rel,date_time=(2026,11,24,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info,path.read_bytes())
    with zipfile.ZipFile(output) as z:
        gate(z.testzip() is None, "output ZIP bad CRC")
        names=z.namelist()
        gate(len(set(names))==len(names) and "module.json" in names, "archive contents malformed")
        js=json.loads(z.read("module.json"))
        gate(js["id"]==MODULE_ID and len(js["packs"])==3, "output manifest id/packs")
        gate(not any(k in js for k in ("scripts","esmodules","styles","download","manifest")),
            "unexpected autoload/update entrypoint")
    return sha(output.read_bytes())

def assemble(prepared, packed, out):
    gate(not out.exists(), "refuse overwrite " + str(out))
    pre=load(prepared/"ci137-preflight.json")
    gate((pre.get("count"),pre.get("folders"),pre.get("templates"))==(136,9,5),
        "CI137 expected 136 items / 9 folders / 5 CSB templates")
    gate(len(pre.get("records",[]))==136 and
        len({r["id"] for r in pre["records"]})==136, "Item ID cardinality")
    gate(len(pre.get("legacyAssetReferences",[]))==99,
         "unresolved historical image refs changed without approval")
    gate(pre.get("historicalStagingPromotedCount")==0,
         "archival candidate promotion occurred")
    gate(pre.get("additionalApprovedAssetCount")==6, "approved extra images changed")
    gate(pre.get("approvedAssetCount")==16, "relic approval changed")
    gate(not any(x.get("promotionAuthorized") for x in pre.get("historicalStagingAssets",[])),
         "unauthorized archival promotion")

    baseline=ROOT/"module"
    original=load(baseline/"module.json")
    gate(original["id"]==MODULE_ID and set(x["name"] for x in original["packs"])==set(PACK_NAMES),
         "baseline would produce another module/pack")
    gate(not any(k in original for k in ("scripts","esmodules","styles")),
         "module baseline has startup hooks; refuse build")
    working=out.parent/(out.stem+"_tree")
    gate(not working.exists(),"build tree exists")
    shutil.copytree(baseline,working)
    targets=working/"packs"
    gate(not targets.exists() or not any(targets.iterdir()),
         "refuse to reuse stale compiled LevelDB")
    targets.mkdir(exist_ok=True)
    for name in PACK_NAMES:
        source=packed/name
        gate((source/"CURRENT").is_file(),"missing LevelDB CURRENT: "+name)
        gate(any(f.suffix==".ldb" and f.stat().st_size>0 for f in source.rglob("*.ldb")),
             "missing nonempty LevelDB SST: "+name)
        shutil.copytree(source,targets/name)
    approved_root=prepared/"assets"
    gate(approved_root.is_dir(),"approved source assets absent")
    copied=0
    for source in sorted(approved_root.rglob("*")):
        if not source.is_file(): continue
        rel=source.relative_to(prepared)
        gate(rel.parts[0]=="assets" and source.suffix.lower()==".webp" and ".." not in rel.parts,
             "illegal asset promotion")
        target=working/rel
        target.parent.mkdir(parents=True,exist_ok=True)
        if target.exists():
            gate(target.read_bytes()==source.read_bytes(),"approved base image replaced: "+str(rel))
        else:
            shutil.copyfile(source,target)
            copied+=1

    remap=pre.get("approvedRemaps",[])+pre.get("sharedKnifeRemaps",[])+pre.get("additionalApprovedAssetRemaps",[])
    gate(len(pre.get("approvedRemaps",[]))==32 and len(pre.get("sharedKnifeRemaps",[]))==2,
         "relic/knife crosswalk drift")
    for r in remap:
        url=r["to"]
        gate(url.startswith(MODULE_PREFIX+"assets/"),"approved image URL outside existing module")
        asset=working/url.removeprefix(MODULE_PREFIX)
        gate(asset.is_file() and sha(asset.read_bytes())==r["sha256"],
             "approved image missing/hash mismatch "+asset.name)
    expected={
        "schema":"ci137-h7-isolated-readonly-qa-v01",
        "module":MODULE_ID,
        "pack":MODULE_ID+".ha-proto-items",
        "items":136,"folders":9,"templates":5,
        "legacyLinks":99,
        "expectedIds":[{"id":r["id"],"folder":r["folder"],
            "folderId":folder_id(r["folder"]),"template":r["template"]} for r in pre["records"]],
        "notes":["No auto installer","Historical artworks not approved for promotion remain untouched",
                 "Actual client visual QA still required"]
    }
    write_json(working/"QA"/"expected_136.json",expected)
    shutil.copyfile(ROOT/"tools/foundry/ci137_h7_readonly.js",
                    working/"QA"/"CI137_H7_READONLY_QA.js")
    (working/"QA"/"README.txt").write_text(
        "H7 CI137 QA v01: EXISTING module ID. Never install in active game without backup.\n"
        "This archive REPLACES the installed prototype globally in Forge, not only H7.\n"
        "3 packs: 136 historical Items, 1 Actor, 1 Journal (21 pages).\n"
        "99 image/background references still require the legacy module; do not auto-promote.\n"
        "No install.js, hooks, macros executed or data migration. Runtime D3 NOT APPROVED.\n"
        "Run QA/CI137_H7_READONLY_QA.js manually in an isolated test world only.\n",
        encoding="utf-8")
    updated=dict(original)
    updated["version"]=VERSION
    updated["title"]="Hiperaustralis · Compendios CI137 (QA aislado)"
    updated["description"]="Corpus CI137 (136 Items) para pruebas aisladas. NO PUBLICAR; D3 pendiente."
    updated.pop("manifest",None)
    updated.pop("download",None)
    gate(not any(k in updated for k in ("scripts","esmodules","styles","socket")),
         "startup code unexpectedly configured")
    write_json(working/"module.json",updated)
    out.parent.mkdir(parents=True,exist_ok=True)
    result_sha=zip_files(out,working)
    report={
        "schema":"CI137_H7_QA_BUNDLE_v01","status":"BUILT_FOR_ISOLATED_D3_QA_NOT_APPROVED_RELEASE",
        "filename":out.name,"sha256":result_sha,"bytes":out.stat().st_size,
        "moduleId":MODULE_ID,"moduleVersion":VERSION,"packs":list(PACK_NAMES),
        "items":136,"folders":9,"templates":5,"actors":1,"journals":1,
        "approvedAssetRemapsChecked":len(remap),"copiedApprovedWebp":copied,
        "legacyReferencesUnresolved":99,
        "replaceExistingPrototypeInForgeGlobally":True,
        "autoInstallOrMigration":False,"published":False,
        "foundryClientD3Approved":False,
        "instructions":"Install only in a disposable cloned world; never activate in H7 game before proof"
    }
    write_json(out.parent/"CI137_H7_QA_BUILD_MANIFEST.json",report)
    print(json.dumps(report,ensure_ascii=False))

def folder_id(folder):
    from ci137_pipeline import FOLDERS
    return FOLDERS[folder][0]

def main():
    p=argparse.ArgumentParser(description=__doc__)
    cmd=p.add_subparsers(dest="cmd",required=True)
    a=cmd.add_parser("prepare-meta")
    a.add_argument("--out",type=Path,required=True)
    b=cmd.add_parser("assemble")
    b.add_argument("--prepared",type=Path,required=True)
    b.add_argument("--packs",type=Path,required=True)
    b.add_argument("--out",type=Path,required=True)
    args=p.parse_args()
    try:
        if args.cmd=="prepare-meta":prepare_meta(args.out)
        else:assemble(args.prepared,args.packs,args.out)
    except (RuntimeError,ValueError,OSError,KeyError,zipfile.BadZipFile) as e:
        print(str(e),file=sys.stderr)
        return 2
    return 0

if __name__=="__main__":
    raise SystemExit(main())
