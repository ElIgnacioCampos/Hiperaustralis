#!/usr/bin/env python3
"""QA7 cumulative candidate: exact QA6 plus 20 approved common-equipment img fields.
No runtime promotion; the nine merely proposed matches remain untouched.
"""
import argparse, copy, hashlib, json, zipfile
from pathlib import Path
import ci137_qa6_erh4_isolated as qa6
from ci137_pipeline import FOLDERS

ROOT=qa6.ROOT
VERSION="0.1.7-ci137qa.7"
NAME="HIPERAUSTRALIS_CI137_QA7_ACUMULATIVO_LAB.zip"
qa6.QA6=VERSION
gate=qa6.gate
load=qa6.load
save=qa6.save
digest=qa6.digest

def overlay(prepared):
    before={iid:copy.deepcopy(doc) for iid,(_,doc) in qa6.runtime_items(prepared).items()}
    qa6.overlay(prepared)
    after6={iid:copy.deepcopy(doc) for iid,(_,doc) in qa6.runtime_items(prepared).items()}
    m=load(ROOT/"manifests/equipo-comun-29-cruces-candidatos-20261121.json")
    selection=load(qa6.SELECTION)
    rows={r["id"]:r for r in selection["entries"]}
    approved=[r for r in m["items"] if r["approval"]=="ART_APPROVED_NO_RUNTIME_QA" and r["group"]=="L01_TO_L05_APPROVED_NEW_ART"]
    pending=[r for r in m["items"] if r["approval"]=="DIRECT_CANDIDATE_WITH_INTEGRITY_QA"]
    gate(len(approved)==20 and len(pending)==9 and len({r["id"] for r in m["items"]})==29,"QA29 source split drift")
    gate(sum(r["family"]=="Equipo común" for r in rows.values())==40,"40 historical equipment identities")
    gate(m["physicalBackingVerifiedAt"]["approvedArchive"]["verifiedItems"]==20,"approved binary record missing")
    docs=qa6.runtime_items(prepared)
    changes=[]
    for row in approved:
        iid=row["id"]; selected=rows[iid]; path,doc=docs[iid]; source=load(ROOT/selected["source"])
        gate(selected["family"]=="Equipo común" and iid==source["_id"]==doc["_id"] and
             row["name"]==source["name"]==doc["name"] and source["type"]==doc["type"]=="equippableItem" and
             source["system"]==doc["system"] and source["system"]["template"]=="HipEquipTpl00001" and
             source["system"]["props"]["hipera_tipo"]=="equipo" and
             source["flags"]["meliaz-bridge"]["kind"]=="equipo" and
             doc["flags"]["meliaz-bridge"]["kind"]=="equipo" and
             doc["folder"]==FOLDERS["Equipo común"][0] and
             source["img"]==doc["img"]==before[iid]["img"] and doc["img"].startswith("icons/"),
             "historical equipment identity/type/folder/old img mismatch "+iid)
        filename=row["file"]
        gate(Path(filename).name==filename and filename.endswith(".webp"),"unsafe approved asset path")
        member="assets/equipo-comun/"+filename
        data=(ROOT/"module"/member).read_bytes()
        gate(len(data)==row["bytes"],"binary size "+iid)
        qa6.image_ok(data,row["sha256"],iid)
        changed=copy.deepcopy(doc)
        changed["img"]=qa6.MODULE_PREFIX+member
        save(path,changed)
        changes.append({"id":iid,"name":doc["name"],"oldImg":doc["img"],"newImg":changed["img"],"member":member,"sha256":row["sha256"],"bytes":row["bytes"]})
    after={iid:doc for iid,(_,doc) in qa6.runtime_items(prepared).items()}
    allowed=set(qa6.IDS)|{r["id"] for r in approved}
    gate(set(before)==set(after) and len(allowed)==24,"136 identities or overlap drift")
    gate({iid for iid in before if before[iid]!=after[iid]}==allowed,"exact 24 changed documents")
    for iid in before:
        gate({k:v for k,v in before[iid].items() if k!="img"}=={k:v for k,v in after[iid].items() if k!="img"},"non-img data changed "+iid)
    gate(all(after[r["id"]]==before[r["id"]] for r in pending),"unapproved 9 candidates modified")
    gate({iid for iid in after6 if after6[iid]!=after[iid]}=={r["id"] for r in approved},"QA6 compatibility")
    save(prepared/"ci137-qa7-cumulative.json",{"status":"ISOLATED_D2_CANDIDATE","version":VERSION,"base":"0.1.7-ci137qa.5","items":136,"imgOnlyChanges":24,"instrumentChanges":4,"equipmentChanges":20,"equipment":changes,"nineNotPromoted":[r["id"] for r in pending],"defensesNew":0,"legacyReferences":qa6.references(qa6.runtime_items(prepared)),"runtimeD3":False})

def package(prepared,compiled,out):
    evidence=load(prepared/"ci137-qa7-cumulative.json")
    qa6.package(prepared,compiled,out)
    with zipfile.ZipFile(out) as z:
        files={n:z.read(n) for n in z.namelist()}
    m=json.loads(files["module.json"])
    gate(m["version"]==VERSION and m["id"]==qa6.MODULE,"QA7 manifest ID/version")
    m["title"]="Hiperaustralis · CI137 QA7 acumulativo (LAB)"
    m["description"]="Candidato aislado QA5 + 4 instrumentos ERH + 20 iconos de Equipo común aprobados. 136 Items históricos, tres packs. D3 pendiente; no sustituir QA5 productivo."
    files["module.json"]=(json.dumps(m,ensure_ascii=False,indent=2)+"\n").encode()
    files["QA/CI137_QA7_ACUMULATIVO.json"]=(json.dumps(evidence,ensure_ascii=False,indent=2)+"\n").encode()
    files["QA/README.txt"]=("CI137 QA7 acumulativo — prueba aislada. Mismo ID: no sustituir módulo productivo. 24 cambios img respecto de QA5; 136 Items intactos en el resto de campos. 9 cruces de Equipo sin aprobación retenidos. Defensas nuevas no incluidas. D3 pendiente.").encode()
    for x in evidence["equipment"]:
        gate(digest(files[x["member"]])==x["sha256"],"exact approved package image "+x["id"])
    tmp=out.with_suffix(".tmp")
    with zipfile.ZipFile(tmp,"w",zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for n,b in sorted(files.items()):
            info=zipfile.ZipInfo(n,(2026,11,25,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,b)
    tmp.replace(out)
    with zipfile.ZipFile(out) as z:
        gate(z.testzip() is None and len(z.namelist())==len(files),"ZIP integrity")
    save(out.parent/"CI137_QA7_D2_REPORT.json",{**evidence,"sha256":digest(out.read_bytes()),"bytes":out.stat().st_size,"members":len(files),"webp":48,"actorCount":1,"journalCount":1,"journalPages":21,"noDeployment":True})
    (out.parent/"CI137_QA6_ERH4_D2_REPORT.json").unlink()

if __name__=="__main__":
    p=argparse.ArgumentParser();subs=p.add_subparsers(dest="action",required=True)
    a=subs.add_parser("overlay");a.add_argument("--prepared",type=Path,required=True)
    a=subs.add_parser("package");a.add_argument("--prepared",type=Path,required=True);a.add_argument("--compiled",type=Path,required=True);a.add_argument("--out",type=Path,required=True)
    a=subs.add_parser("check-final")
    for key in ["prepared","zip","unpacked-items","unpacked-actors","unpacked-journals"]:a.add_argument("--"+key,type=Path,required=True)
    a=p.parse_args()
    if a.action=="overlay":overlay(a.prepared)
    elif a.action=="package":package(a.prepared,a.compiled,a.out)
    else:
        qa6.check_final(a.prepared,a.zip,a.unpacked_items,a.unpacked_actors,a.unpacked_journals)
        print("PASS QA7: final pack readback against all 136 prepared docs including 24 img deltas")
