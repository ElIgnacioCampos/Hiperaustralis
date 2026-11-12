#!/usr/bin/env python3
"""Prepare Foundry CLI sources without mutating canonical JSON.

Foundry CLI pack reads documents from the input directory root; it does not
recursively compile nested source directories. Canonical source subfolders are
therefore flattened into the temporary transport directory. Original folder
metadata inside each Foundry document is preserved unchanged.
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
    used_names = set()
    for path in paths:
        relative = path.relative_to(src)
        target = dest / path.name
        if target.name in used_names or target.exists():
            raise SystemExit(f"Transport filename collision in {folder}: {target.name}")
        used_names.add(target.name)
        doc = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(doc, dict) or not isinstance(doc.get("_id"), str) or not doc["_id"]:
            raise SystemExit(f"Invalid Foundry document: {path}")
        doc["_key"] = f"!{collection}!{doc['_id']}"
        if folder == "journals":
            for page in doc.get("pages", []):
                page["_key"] = f"!journal.pages!{doc['_id']}.{page['_id']}"
        target.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Prepared {folder}/{relative.as_posix()} -> {target.name}: {doc['_key']}")
