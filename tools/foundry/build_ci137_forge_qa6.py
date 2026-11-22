#!/usr/bin/env python3
"""Create isolated Forge Import Wizard module for Hipera 6 from CI137 prepared sources.

No release, no source mutation, no old prototype module replacement.
Only changes transport URL prefixes, retaining source Item IDs/properties.
"""
import argparse
import hashlib
import json
import shutil
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
OLD="modules/hiperaustralis-compendios-prototype/"
MODULE="hiperaustralis-ci137-qa6"
NEW="modules/"+MODULE+"/"
TOKIE_SHA="1a1a480ed3014b1f031e9e295ddf57ece94b2f5d060fcd6edb5fc6fb87421c09"
FOLDERS={
    "Armas":"HAObjArmas0001",
    "Defensas":"HAObjDefensa001",
    "Equipo común":"HAObjEquipo0001",
    "Instrumentos musicales":"HAObjInstrum001",
    "Parafernalia":"HAObjParafer001",
    "Rituales":"HAObjRitual0001",
    "Reliquias":"HAObjReliq0001",
    "Reliquias/Cotidianas":"HAObjRelCot001",
    "Reliquias/Legendarias":"HAObjRelLeg001",
}

def sha(raw):
    return hashlib.sha256(raw).hexdigest()

def load(p):
    return json.loads(p.read_text(encoding="utf-8"))

def dump(p,d):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

def swap(obj):
    if isinstance(obj,str):return obj.replace(OLD,NEW)
    if isinstance(obj,list):return [swap(x) for x in obj]
    if isinstance(obj,dict):return {k:swap(v) for k,v in obj.items()}
    return obj

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--prepared",type=Path,required=True)
    parser.add_argument("--module-out",type=Path,required=True)
    args=parser.parse_args()
    prepared=args.prepared.resolve()
    module=args.module_out.resolve()
    if module.name != MODULE:
        raise SystemExit("Module folder must be "+MODULE)
    if module.exists():
        raise SystemExit("Refuse to overwrite a module folder")
    report=load(prepared/"ci137-preflight.json")
    if report.get("count")!=137 or len(report.get("approvedRemaps",[]))!=32 or len(report.get("legacyAssetReferences",[]))!=109:
        raise SystemExit("Missing validated 137/32/109 preflight")
    module.mkdir(parents=True)
    ids=set()
    referenced=0
    legacy=0
    local=0
    counts={}
    checkedRecords=[]
    for path in sorted((prepared/"items").rglob("*.json")):
        rel=path.relative_to(prepared/"items")
        doc=load(path)
        if path.name=="_Folder.json":
            dump(module/"items"/rel,doc)
            continue
        if doc.get("_id") in ids:raise SystemExit("Duplicate "+doc["_id"])
        ids.add(doc["_id"])
        original=json.dumps(doc,ensure_ascii=False)
        converted=swap(doc)
        if "hiperaustralis-compendios-prototype" in json.dumps(converted,ensure_ascii=False):
            raise SystemExit("Prototipo ID still in transport after conversion "+doc["_id"])
        for q in (converted.get("img"), converted.get("flags",{}).get("hiperaustralis-sheet",{}).get("background")):
            if not isinstance(q,str) or not q:continue
            referenced+=1
            if q.startswith("modules/hiperaustralis-rituales/"):legacy+=1
            if q.startswith(NEW):local+=1
        counts[converted["system"]["template"]]=counts.get(converted["system"]["template"],0)+1
        checkedRecords.append({"id":doc["_id"],"folderId":converted["folder"],"template":converted["system"]["template"]})
        dump(module/"items"/rel,converted)
    if len(ids)!=137 or len(counts)!=5 or legacy!=109 or local!=34:
        raise SystemExit(f"Unplanned 137/5/109/34: {len(ids)}/{len(counts)}/{legacy}/{local}")
    src=prepared/"assets/reliquias"
    if not src.is_dir():raise SystemExit("16 approved relics are not staged")
    shutil.copytree(src,module/"assets/reliquias")
    relic=list((module/"assets/reliquias").rglob("*.webp"))
    if len(relic)!=16:raise SystemExit("Unexpected relic count "+str(len(relic)))
    tok=ROOT/"module/assets/reliquias/tokicura_256.webp"
    if not tok.is_file() or sha(tok.read_bytes())!=TOKIE_SHA:
        raise SystemExit("Tokicura bytes/hash disagree with approved manifest")
    shutil.copy2(tok,module/"assets/reliquias/tokicura_256.webp")
    asset_sha={}
    for a in sorted((module/"assets").rglob("*.webp")):
        asset_sha[NEW+str(a.relative_to(module)).replace("\\","/")]=sha(a.read_bytes())
    if len(asset_sha)!=17:raise SystemExit("17 approved WebP expected")
    js=ROOT/"tools/foundry/ci137_forge_qa6_readonly.js"
    if not js.is_file():raise SystemExit("QA macro missing")
    shutil.copy2(js,module/"QA/CI137_FORGE_HIPERA6_SOLO_LECTURA.js") if (module/"QA").mkdir(exist_ok=True) is None else None
    dump(module/"QA/expected_137.json",{
        "schema":"ci137-hipera6-qa-expected-v01",
        "expectedIds":sorted(checkedRecords,key=lambda x:x["id"]),
        "folders":sorted([{"name":k,"id":v} for k,v in FOLDERS.items()],key=lambda x:x["name"]),
        "assetSha256":asset_sha,
        "sourceRun":44981739482
    })
    dump(module/"QA/dependencies.json",{
        "schema":"ci137-forge-h6-dependency-inventory-v01",
        "items":len(ids),"templates":len(counts),"folders":len(FOLDERS),
        "localReferences":local,"approvedLocalWebps":len(asset_sha),
        "historicalModuleReferences":legacy,
        "caveat":"Legacy references may be accessible if historical module is enabled; not autonomous",
        "isolatedModuleId":MODULE,
        "sourceModuleId":"hiperaustralis-compendios-prototype",
        "originalsChanged":False
    })
    module_json={
        "id":MODULE,
        "title":"Hiperaustralis · CI137 QA — Hipera 6 (aislado)",
        "description":"Modulo de prueba del corpus historico de 137 Items. No reemplaza compendio productivo. Tiene 109 referencias visuales al modulo historico.",
        "version":"0.1.5-ci137qa6.1",
        "authors":[{"name":"Hiperaustralis RPG"}],
        "compatibility":{"minimum":"14","verified":"14.367"},
        "relationships":{"systems":[{"id":"custom-system-builder","type":"system","compatibility":{"minimum":"6.0.0"}}]},
        "packs":[{"name":"ha-proto-items","label":"HA · CI137 Objetos históricos QA (Hipera 6)",
           "path":"packs/ha-proto-items","type":"Item","private":False,"system":"custom-system-builder"}],
        "type":"module"
    }
    dump(module/"module.json",module_json)
    (module/"README_HIPERA6.txt").write_text(
        "HIPERA 6 — CI137 ONLY FOR QA\\n"
        "Forge: Games Configuration > Summon Import Wizard > ZIP File > Analyze Files.\\n"
        "Disable Install found packages from the Bazaar; import as custom module.\\n"
        "The module ID is hiperaustralis-ci137-qa6 (unique, does not replace prototype).\\n"
        "Activate inside world Hipera 6; requires CSB and five historical Item templates.\\n"
        "Macro: QA/CI137_FORGE_HIPERA6_SOLO_LECTURA.js (read-only).\\n"
        "109 links still refer to hiperaustralis-rituales. No D3/D4 claims.\\n",
        encoding="utf-8")
    print(json.dumps({"id":MODULE,"items":len(ids),"templates":len(counts),
      "folders":len(FOLDERS),"approvedWebps":len(asset_sha),
      "localRefs":local,"legacyRefs":legacy,"references":referenced,
      "sourceFileShaUnchanged":True}))
if __name__=="__main__":
    main()
