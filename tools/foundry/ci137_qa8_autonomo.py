#!/usr/bin/env python3
"""Autonomous CI137: retain all QA7 approved mappings and transport exact historical
bytes already referenced by the remaining Items. No editorial art promotion."""
import argparse, copy, io, json, zipfile
from pathlib import Path
from PIL import Image
import ci137_qa7_acumulativo as qa7
import ci137_qa6_erh4_isolated as qa6

ROOT=qa6.ROOT
VERSION="0.1.7-ci137qa.8"
PREFIX="modules/hiperaustralis-rituales/assets/"
LOCAL=qa6.MODULE_PREFIX
gate=qa6.gate
load=qa6.load
save=qa6.save
digest=qa6.digest

def slots(doc):
    yield "img",doc,doc.get("img")
    bg=doc.get("flags",{}).get("hiperaustralis-sheet",{})
    if isinstance(bg,dict):
        yield "background",bg,bg.get("background")

def overlay(prepared):
    qa7.overlay(prepared)
    docs=qa6.runtime_items(prepared)
    before={iid:copy.deepcopy(d) for iid,(_,d) in docs.items()}
    pre=load(prepared/"ci137-preflight.json")
    archival={r["legacyPath"]:r for r in pre["historicalStagingAssets"]}
    gate(len(archival)==79,"historical source inventory")
    rows=[]; assets={}
    for iid,(path,doc) in docs.items():
        changed=copy.deepcopy(doc)
        for field,container,old in slots(changed):
            if not isinstance(old,str) or not old.startswith(PREFIX):continue
            rec=archival.get(old)
            gate(rec is not None,"missing exact historical source "+iid+" "+old)
            rel=Path(old.removeprefix(PREFIX))
            gate(not rel.is_absolute() and ".." not in rel.parts and rel.suffix==".webp","unsafe historical path")
            data=(ROOT/rec["stagedPath"]).read_bytes()
            gate(digest(data)==rec["sha256"] and len(data)==rec["bytes"],"historical hash "+iid)
            with Image.open(io.BytesIO(data)) as im:
                im.load();gate(im.format=="WEBP","historical WebP "+iid)
            # Distinct path, exact original bytes, no visual substitution or re-encoding.
            member="assets/historico/"+rel.as_posix()
            if member in assets:gate(assets[member]["sha256"]==rec["sha256"],"historical collision")
            assets[member]={"member":member,"source":rec["stagedPath"],"sha256":rec["sha256"],"bytes":len(data),"status":"HISTORICAL_ORIGINAL_NOT_NEW_ART_APPROVAL"}
            container[field]=LOCAL+member
            rows.append({"id":iid,"name":doc["name"],"field":field,"old":old,"new":container[field],"sha256":rec["sha256"]})
        if changed!=doc:
            # Reverse exactly the allowed path edits to prove no other fields changed.
            restored=copy.deepcopy(changed)
            for field,c,v in slots(restored):
                old=next((x["old"] for x in rows if x["id"]==iid and x["field"]==field),None)
                if old is not None:c[field]=old
            gate(restored==before[iid],"non-path mutation "+iid)
            save(path,changed)
    after=qa6.runtime_items(prepared)
    gate(len(rows)==95 and len(assets)==68 and qa6.references(after)==0,"legacy counts not fully resolved")
    gate(set(after)==set(before),"ID drift")
    save(prepared/"ci137-autonomous.json",{"version":VERSION,"items":136,"historicalPathChanges":rows,"historicalAssets":list(assets.values()),"legacyReferences":0,"historicalArtNewApproval":False,"defensesNew":0,"runtimeD3":False})

def package(prepared,compiled,out):
    ev=load(prepared/"ci137-autonomous.json")
    # Reuse exact existing durable pack assembly; only append exact historical files.
    qa7.package(prepared,compiled,out)
    with zipfile.ZipFile(out) as z:files={n:z.read(n) for n in z.namelist()}
    m=json.loads(files["module.json"])
    m.update(version=VERSION,title="Hiperaustralis · CI137 autónomo (LAB)",description="QA7 acumulativo + recuperación exacta de 68 imágenes históricas; 136 Items, 3 packs, sin referencias gráficas al módulo legado en Items. D3 pendiente.")
    files["module.json"]=(json.dumps(m,ensure_ascii=False,indent=2)+"\n").encode()
    for a in ev["historicalAssets"]:
        data=(ROOT/a["source"]).read_bytes()
        gate(a["member"] not in files and digest(data)==a["sha256"],"historic packaging collision/hash")
        files[a["member"]]=data
    files["QA/CI137_AUTONOMO.json"]=(json.dumps(ev,ensure_ascii=False,indent=2)+"\n").encode()
    files["QA/README.txt"]=("CI137 QA8 autonomous candidate; same module ID. QA7 approved art preserved; 68 original historical WebP transported byte-identically, not new visual approvals. All 95 legacy Item image/background refs relocated. No new Defenses. D3 pending.").encode()
    for iid,(_,doc) in qa6.runtime_items(prepared).items():
        for field,c,v in slots(doc):
            if isinstance(v,str) and v.startswith(LOCAL):gate(v.removeprefix(LOCAL) in files,"missing own resource "+iid)
            gate(not isinstance(v,str) or not v.startswith(PREFIX),"legacy ref "+iid)
    tmp=out.with_suffix(".tmp")
    with zipfile.ZipFile(tmp,"w",zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for n,data in sorted(files.items()):
            i=zipfile.ZipInfo(n,(2026,11,25,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;z.writestr(i,data)
    tmp.replace(out)
    with zipfile.ZipFile(out) as z:
        gate(z.testzip() is None and len(z.namelist())==len(set(z.namelist())),"zip integrity")
    save(out.parent/"CI137_QA8_D2_REPORT.json",{**ev,"historicalAssetCount":68,"webp":116,"sha256":digest(out.read_bytes()),"bytes":out.stat().st_size,"members":len(files),"noDeployment":True})
    (out.parent/"CI137_QA7_D2_REPORT.json").unlink()

def check(prepared,out,items,actors,journals):
    expected=qa6.runtime_items(prepared)
    actual={}
    for p in items.rglob("*.json"):
        if p.name=="_Folder.json":continue
        d=load(p);gate(d["_id"] not in actual,"duplicate Item");actual[d["_id"]]=d
    gate(set(actual)==set(expected),"final IDs")
    for iid,(_,src) in expected.items():
        for k in ("_id","name","type","img","system","flags","folder","ownership","effects"):
            gate(actual[iid].get(k,[] if k=="effects" else None)==src.get(k,[] if k=="effects" else None),"final roundtrip field "+iid+" "+k)
    gate(len(list(items.rglob("_Folder.json")))==9,"folders")
    aa=list(actors.rglob("*.json"));jj=list(journals.rglob("*.json"))
    gate(len(aa)==len(jj)==1 and len(load(jj[0])["pages"])==21,"metadata counts")
    ev=load(prepared/"ci137-autonomous.json")
    with zipfile.ZipFile(out) as z:
        gate(z.testzip() is None and len([n for n in z.namelist() if n.endswith(".webp")])==116,"final asset inventory")
        gate(json.loads(z.read("module.json"))["version"]==VERSION,"manifest version")
        for x in ev["historicalAssets"]:gate(digest(z.read(x["member"]))==x["sha256"],"final original SHA")
        for _,d in expected.values():
            for field,c,v in slots(d):
                if isinstance(v,str) and v.startswith(LOCAL):gate(v.removeprefix(LOCAL) in z.namelist(),"missing reference")
    print("PASS QA8: 136 Items, 9 folders, 1 Actor, 1 Journal/21 pages, 116 WebP, zero legacy Item img/background paths.")

if __name__=="__main__":
    p=argparse.ArgumentParser();s=p.add_subparsers(dest="action",required=True)
    a=s.add_parser("overlay");a.add_argument("--prepared",type=Path,required=True)
    a=s.add_parser("package");a.add_argument("--prepared",type=Path,required=True);a.add_argument("--compiled",type=Path,required=True);a.add_argument("--out",type=Path,required=True)
    a=s.add_parser("check-final")
    for k in ("prepared","zip","unpacked-items","unpacked-actors","unpacked-journals"):a.add_argument("--"+k,type=Path,required=True)
    a=p.parse_args()
    if a.action=="overlay":overlay(a.prepared)
    elif a.action=="package":package(a.prepared,a.compiled,a.out)
    else:check(a.prepared,a.zip,a.unpacked_items,a.unpacked_actors,a.unpacked_journals)
