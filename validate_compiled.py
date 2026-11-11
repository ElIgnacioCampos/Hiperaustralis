#!/usr/bin/env python3
"""Round-trip check: compiled Foundry packs must preserve IDs, names and Journal page counts."""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAIRS = {
    "ha-proto-items": ("items", "Item"),
    "ha-proto-actors": ("actors", "Actor"),
    "ha-proto-journals": ("journals", "JournalEntry"),
}

def fail(message):
    print("ROUNDTRIP FAIL:", message, file=sys.stderr)
    raise SystemExit(1)

if len(sys.argv) != 2:
    fail("Uso: validate_compiled.py <directorio>")
base = Path(sys.argv[1])
result = []
for pack, (folder, kind) in PAIRS.items():
    src, out = ROOT / "source" / folder, base / pack
    if not out.is_dir():
        fail(f"Salida ausente: {out}")
    expected = {}
    for path in src.rglob("*.json"):
        doc = json.loads(path.read_text(encoding="utf-8"))
        expected[doc["_id"]] = (doc.get("name"), len(doc.get("pages", [])))
    files = sorted(out.rglob("*.json"))
    actual = {}
    for path in files:
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            fail(f"JSON ilegible {path}: {exc}")
        if isinstance(doc, dict):
            doc_id = doc.get("_id") or doc.get("id")
            if isinstance(doc_id, str) and doc_id:
                if doc_id in actual:
                    fail(f"ID duplicado en {pack}: {doc_id}")
                actual[doc_id] = (doc.get("name"), len(doc.get("pages", [])))
    if actual != expected:
        missing = sorted(set(expected) - set(actual))
        extra = sorted(set(actual) - set(expected))
        mismatched = sorted(k for k in set(expected) & set(actual) if expected[k] != actual[k])
        fail(f"{pack}: round-trip distinto; missing={missing[:10]}, extra={extra[:10]}, mismatched={mismatched[:10]}, files={len(files)}")
    result.append({"pack": pack, "type": kind, "documents": len(actual),
                   "ids_names_pages_match": True})
print(json.dumps({"status": "ROUNDTRIP_PASS", "packs": result},
                 ensure_ascii=False, indent=2))
