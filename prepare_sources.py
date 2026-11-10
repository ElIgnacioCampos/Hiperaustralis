#!/usr/bin/env python3
"""Create temporary Foundry CLI sources with the required hierarchical _key fields.

Canonical source JSON remains untouched: _key is a CLI transport field, not Foundry document data.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
PAIRS={"items":"items","actors":"actors","journals":"journal"}
OUT=Path(__import__("sys").argv[1]) if len(__import__("sys").argv)>1 else ROOT/".build-source"
for folder,collection in PAIRS.items():
    src=ROOT/"source"/folder
    dest=OUT/folder
    dest.mkdir(parents=True,exist_ok=True)
    for path in sorted(src.glob("*.json")):
        doc=json.loads(path.read_text(encoding="utf-8"))
        doc["_key"]=f"!{collection}!{doc['_id']}"
        if folder=="journals":
            for page in doc.get("pages",[]):
                page["_key"]=f"!journal.pages!{doc['_id']}.{page['_id']}"
        target=dest/path.name
        target.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print(f"Prepared {folder}/{path.name}: {doc['_key']}")
