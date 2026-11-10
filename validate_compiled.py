#!/usr/bin/env python3
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
PAIRS={"ha-proto-items":("items","Item"),"ha-proto-actors":("actors","Actor"),"ha-proto-journals":("journals","JournalEntry")}
def fail(s):
 print("ROUNDTRIP FAIL:",s,file=sys.stderr); raise SystemExit(1)
if len(sys.argv)!=2: fail("Uso: validate_compiled.py <directorio>")
base=Path(sys.argv[1]); result=[]
for pack,(folder,kind) in PAIRS.items():
 src=ROOT/"source"/folder; out=base/pack
 if not out.is_dir(): fail(f"Salida ausente: {out}")
 expected={}
 for p in src.glob("*.json"):
  d=json.loads(p.read_text(encoding="utf-8")); expected[d["_id"]]=(d.get("name"),len(d.get("pages",[])))
 files=sorted(out.rglob("*.json"))
 actual={}
 for p in files:
  try: d=json.loads(p.read_text(encoding="utf-8"))
  except Exception as e: fail(f"JSON ilegible {p}: {e}")
  if isinstance(d,dict):
   docid=d.get("_id") or d.get("id")
   if isinstance(docid,str) and docid:
    if docid in actual: fail(f"ID duplicado en {pack}: {docid}")
    actual[docid]=(d.get("name"),len(d.get("pages",[])))
 if actual!=expected:
  sample=[]
  for p in files[:3]:
   try:
    d=json.loads(p.read_text(encoding="utf-8"))
    sample.append({"file":str(p.relative_to(out)),"keys":list(d)[:30] if isinstance(d,dict) else type(d).__name__,"id":d.get("_id",d.get("id")) if isinstance(d,dict) else None,"name":d.get("name") if isinstance(d,dict) else None})
   except Exception: sample.append({"file":str(p.relative_to(out)),"unreadable":True})
  fail(f"{pack}: IDs/nombres/páginas no coinciden. Esperado={expected}; actual={actual}; archivos={len(files)}; muestra={sample}")
 result.append({"pack":pack,"type":kind,"documents":len(actual),"ids_names_pages_match":True})
print(json.dumps({"status":"ROUNDTRIP_PASS","packs":result},ensure_ascii=False,indent=2))
