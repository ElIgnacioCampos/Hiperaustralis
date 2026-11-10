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
 actual={}
 for p in out.rglob("*.json"):
  d=json.loads(p.read_text(encoding="utf-8"))
  if isinstance(d,dict) and isinstance(d.get("_id"),str):
   if d["_id"] in actual: fail(f"ID duplicado en {pack}: {d['_id']}")
   actual[d["_id"]]=(d.get("name"),len(d.get("pages",[])))
 if actual!=expected: fail(f"Round-trip alteró documentos/páginas de {pack}; esperado={expected}, actual={actual}")
 result.append({"pack":pack,"type":kind,"documents":len(actual),"ids_names_pages_match":True})
print(json.dumps({"status":"ROUNDTRIP_PASS","packs":result},ensure_ascii=False,indent=2))
