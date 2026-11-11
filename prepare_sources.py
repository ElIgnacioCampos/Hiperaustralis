#!/usr/bin/env python3
"""Prepare recursive Foundry CLI sources without mutating canonical JSON.

Folder paths are preserved so nested source directories become native pack folders.
The temporary _key field is transport metadata only.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAIRS = {"items": "items", "actors": "actors", "journals": "journal"}
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / ".build-source"

for folder, collection in PAIRS.items():
    src = ROOT / "source" / folder
    dest = OUT / folder
    dest.mkdir(parents=True, exist_ok=True)
    paths = sorted(src.rglob("*.json"))
    for path in paths:
        relative = path.relative_to(src)
        doc = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(doc, dict) or not isinstance(doc.get("_id"), str) or not doc["_id"]:
            raise SystemExit(f"Invalid Foundry document: {path}")
        doc["_key"] = f"!{collection}!{doc['_id']}"
        if folder == "journals":
            for page in doc.get("pages", []):
                page["_key"] = f"!journal.pages!{doc['_id']}.{page['_id']}"
        target = dest / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Prepared {folder}/{relative.as_posix()}: {doc['_key']}")
