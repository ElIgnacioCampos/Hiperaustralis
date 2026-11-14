#!/usr/bin/env python3
"""Prepare canonical Foundry sources and deterministic compendium folder structure."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAIRS = {"items": "items", "actors": "actors", "journals": "journal"}
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / ".build-source"

FOLDERS = {
    "Armas": {"id": "HAObjArmas0001", "parent": None},
    "Reliquias": {"id": "HAObjReliq0001", "parent": None},
    "Reliquias/Cotidianas": {"id": "HAObjRelCot001", "parent": "HAObjReliq0001"},
    "Reliquias/Legendarias": {"id": "HAObjRelLeg001", "parent": "HAObjReliq0001"},
}

def item_folder(path: Path, doc: dict) -> str:
    parts = path.relative_to(ROOT / "source" / "items").parts
    if parts[0] == "armas":
        return "Armas"
    if parts[0] == "reliquias-cotidianas":
        return "Reliquias/Cotidianas"
    if parts[0] == "reliquias-legendarias":
        return "Reliquias/Legendarias"
    if parts[0] == "reliquias":
        category = doc.get("flags", {}).get("hiperaustralis-reliquias", {}).get("categoria")
        if category == "cotidiana":
            return "Reliquias/Cotidianas"
        if category == "legendaria":
            return "Reliquias/Legendarias"
        raise SystemExit(f"Reliquia sin categoria reconocida: {path}")
    if len(parts) == 1 and doc.get("system", {}).get("props", {}).get("hipera_tipo") == "arma":
        return "Armas"
    raise SystemExit(f"Item sin regla de carpeta explícita: {path}")

def write_folder(base: Path, folder_path: str, meta: dict):
    target = base.joinpath(*folder_path.split("/"))
    target.mkdir(parents=True, exist_ok=True)
    parent = meta["parent"]
    folder_doc = {
        "_id": meta["id"],
        "name": folder_path.split("/")[-1],
        "type": "Item",
        "folder": parent,
        "sorting": "a",
        "sort": 0,
        "description": "",
        "flags": {},
        "_key": f"!folders!{meta['id']}",
    }
    (target / "_Folder.json").write_text(
        json.dumps(folder_doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

for folder, collection in PAIRS.items():
    src = ROOT / "source" / folder
    dest = OUT / folder
    dest.mkdir(parents=True, exist_ok=True)
    paths = sorted(src.rglob("*.json"))
    used_names = set()
    for path in paths:
        relative = path.relative_to(src)
        doc = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(doc, dict) or not isinstance(doc.get("_id"), str) or not doc["_id"]:
            raise SystemExit(f"Invalid Foundry document: {path}")
        if folder == "items":
            folder_path = item_folder(path, doc)
            folder_meta = FOLDERS[folder_path]
            doc["folder"] = folder_meta["id"]
            target_dir = dest.joinpath(*folder_path.split("/"))
            target_dir.mkdir(parents=True, exist_ok=True)
            write_folder(dest, folder_path, folder_meta)
            manifest_path = OUT / "item-folder-manifest.json"
            # The manifest is written once below from the complete deterministic map.
        else:
            target_dir = dest
        target = target_dir / path.name
        if target.name in used_names or target.exists():
            raise SystemExit(f"Transport filename collision in {folder}: {target}")
        used_names.add(target.name)
        doc["_key"] = f"!{collection}!{doc['_id']}"
        if folder == "journals":
            for page in doc.get("pages", []):
                page["_key"] = f"!journal.pages!{doc['_id']}.{page['_id']}"
        target.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Prepared {folder}/{relative.as_posix()} -> {target.relative_to(OUT).as_posix()}: {doc['_key']}")

if (ROOT / "source" / "items").exists():
    manifest = {
        "folders": [
            {"id": meta["id"], "path": folder_path, "name": folder_path.split("/")[-1],
             "parent": meta["parent"], "type": "Item"}
            for folder_path, meta in FOLDERS.items()
        ],
        "documents": {}
    }
    for path in sorted((ROOT / "source" / "items").rglob("*.json")):
        doc = json.loads(path.read_text(encoding="utf-8"))
        manifest["documents"][doc["_id"]] = item_folder(path, doc)
    (OUT / "item-folder-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
