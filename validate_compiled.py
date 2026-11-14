#!/usr/bin/env python3
"""Round-trip validation for native documents and Item compendium folders."""
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

if len(sys.argv) != 3:
    fail("Uso: validate_compiled.py <directorio-verify> <directorio-pack-source>")
base, prepared = Path(sys.argv[1]), Path(sys.argv[2])
folder_manifest_path = prepared / "item-folder-manifest.json"
if not folder_manifest_path.is_file():
    fail(f"Manifiesto de carpetas ausente: {folder_manifest_path}")
folder_manifest = json.loads(folder_manifest_path.read_text(encoding="utf-8"))
expected_folders = {x["id"]: x for x in folder_manifest["folders"]}
expected_item_folders = folder_manifest["documents"]

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
    actual, actual_folders = {}, {}
    for path in files:
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            fail(f"JSON ilegible {path}: {exc}")
        if not isinstance(doc, dict):
            continue
        if path.name == "_Folder.json":
            actual_folders[doc.get("_id")] = {
                "id": doc.get("_id"), "name": doc.get("name"),
                "type": doc.get("type"), "parent": doc.get("folder")
            }
            continue
        doc_id = doc.get("_id") or doc.get("id")
        if isinstance(doc_id, str) and doc_id:
            if doc_id in actual:
                fail(f"ID duplicado en {pack}: {doc_id}")
            actual[doc_id] = {
                "name": doc.get("name"),
                "pages": len(doc.get("pages", [])),
                "folder": doc.get("folder")
            }
    actual_summary = {k: (v["name"], v["pages"]) for k, v in actual.items()}
    if actual_summary != expected:
        missing = sorted(set(expected) - set(actual_summary))
        extra = sorted(set(actual_summary) - set(expected))
        mismatched = sorted(k for k in set(expected) & set(actual_summary) if expected[k] != actual_summary[k])
        fail(f"{pack}: round-trip distinto; missing={missing[:10]}, extra={extra[:10]}, mismatched={mismatched[:10]}, files={len(files)}")
    if pack == "ha-proto-items":
        if set(actual_folders) != set(expected_folders):
            fail(f"Folders distintos; missing={sorted(set(expected_folders)-set(actual_folders))}, extra={sorted(set(actual_folders)-set(expected_folders))}")
        for folder_id, expected_folder in expected_folders.items():
            if actual_folders[folder_id] != expected_folder:
                fail(f"Folder alterada {folder_id}: expected={expected_folder}, actual={actual_folders[folder_id]}")
        for doc_id, folder_path in expected_item_folders.items():
            expected_folder_id = next(x["id"] for x in folder_manifest["folders"] if x["path"] == folder_path)
            if actual[doc_id]["folder"] != expected_folder_id:
                fail(f"Item {doc_id} perdió su carpeta: expected={expected_folder_id}, actual={actual[doc_id]['folder']}")
    elif actual_folders:
        fail(f"Se encontraron folders inesperadas en {pack}: {sorted(actual_folders)}")
    result.append({
        "pack": pack, "type": kind, "documents": len(actual),
        "folders": len(actual_folders), "ids_names_pages_match": True
    })
print(json.dumps({"status": "ROUNDTRIP_PASS", "packs": result},
                 ensure_ascii=False, indent=2))
