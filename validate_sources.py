#!/usr/bin/env python3
import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
EXPECTED={"ha-proto-items":("items","Item"),"ha-proto-actors":("actors","Actor"),"ha-proto-journals":("journals","JournalEntry")}
def fail(s):
 print("FAIL:",s,file=sys.stderr); raise SystemExit(1)
manifest=json.loads((ROOT/"module/module.json").read_text(encoding="utf-8"))
if manifest.get("id")!="hiperaustralis-compendios-prototype": fail("ID de módulo inesperado")
packs={p.get("name"):p for p in manifest.get("packs",[])}
if set(packs)!=set(EXPECTED): fail("Conjunto de packs inesperado")
summary=[]
for name,(folder,kind) in EXPECTED.items():
 p=packs[name]
 if p.get("type")!=kind or p.get("path")!=f"packs/{name}": fail(f"Manifest incorrecto: {name}")
 paths=sorted((ROOT/"source"/folder).glob("*.json"))
 if not paths: fail(f"Fuente vacía: {folder}")
 ids=set(); docs=[]
 for path in paths:
  d=json.loads(path.read_text(encoding="utf-8"))
  if not isinstance(d.get("_id"),str) or not d["_id"]: fail(f"ID ausente: {path}")
  if d["_id"] in ids: fail(f"ID duplicado: {d['_id']}")
  ids.add(d["_id"])
  if not d.get("name"): fail(f"Nombre ausente: {path}")
  if folder=="items":
   body=d.get("system",{}).get("body",{})
   fields=body.get("contents",[])
   keys=[x.get("key") for x in fields if isinstance(x,dict)]
   if "descripcion" not in keys: fail(f"Item Arma sin campo Descripción: {path}; campos={keys}")
   if body.get("cssClass")!="ha-arma-item-sheet": fail(f"Item Arma sin clase de hoja canónica: {path}")
  if folder=="actors":
   body=d.get("system",{}).get("body",{})
   fields=body.get("contents",[])
   keys=[x.get("key") for x in fields if isinstance(x,dict)]
   required={"peso","descripcion","en_escena"}
   if not required.issubset(set(keys)): fail(f"Actor sin estructura Rival completa: {path}; campos={keys}")
   if "nota_peso" in d.get("system",{}).get("props",{}): fail(f"Campo editorial obsoleto nota_peso: {path}")
  if folder=="journals":
   pages=d.get("pages")
   if not isinstance(pages,list): fail("JournalEntry sin pages[]")
   pids=set()
   for page in pages:
    pid=page.get("_id")
    if not isinstance(pid,str) or not pid or pid in pids: fail("ID de página ausente o duplicado")
    pids.add(pid)
  docs.append({"file":path.name,"id":d["_id"],"name":d["name"],"pages":len(d.get("pages",[]))})
 summary.append({"pack":name,"type":kind,"count":len(docs),"documents":docs})
print(json.dumps({"status":"SOURCE_PASS","module_id":manifest["id"],"packs":summary},ensure_ascii=False,indent=2))
