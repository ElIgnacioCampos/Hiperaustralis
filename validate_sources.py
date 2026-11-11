#!/usr/bin/env python3
"""Structural validation for canonical Foundry source documents."""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
EXPECTED = {
    "ha-proto-items": ("items", "Item"),
    "ha-proto-actors": ("actors", "Actor"),
    "ha-proto-journals": ("journals", "JournalEntry"),
}

def fail(message):
    print("FAIL:", message, file=sys.stderr)
    raise SystemExit(1)

manifest = json.loads((ROOT / "module/module.json").read_text(encoding="utf-8"))
if manifest.get("id") != "hiperaustralis-compendios-prototype":
    fail("ID de módulo inesperado")
packs = {p.get("name"): p for p in manifest.get("packs", [])}
if set(packs) != set(EXPECTED):
    fail("Conjunto de packs inesperado")

summary = []
for name, (folder, kind) in EXPECTED.items():
    pack = packs[name]
    if pack.get("type") != kind or pack.get("path") != f"packs/{name}":
        fail(f"Manifest incorrecto: {name}")
    paths = sorted((ROOT / "source" / folder).rglob("*.json"))
    if not paths:
        fail(f"Fuente vacía: {folder}")
    ids, docs = set(), []
    for path in paths:
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            fail(f"JSON ilegible {path}: {exc}")
        if not isinstance(doc, dict):
            fail(f"Documento no es objeto JSON: {path}")
        doc_id = doc.get("_id")
        if not isinstance(doc_id, str) or not doc_id:
            fail(f"ID ausente: {path}")
        if doc_id in ids:
            fail(f"ID duplicado en {folder}: {doc_id}")
        ids.add(doc_id)
        if not doc.get("name"):
            fail(f"Nombre ausente: {path}")
        if folder == "items":
            system = doc.get("system")
            if not isinstance(system, dict):
                fail(f"Item sin system object: {path}")
            if not isinstance(system.get("props"), dict):
                fail(f"Item sin system.props object: {path}")
            body = system.get("body")
            if not isinstance(body, dict) or not isinstance(body.get("contents"), list):
                fail(f"Item sin system.body.contents[]: {path}")
        if folder == "actors":
            body = doc.get("system", {}).get("body", {})
            fields = body.get("contents", [])
            keys = [x.get("key") for x in fields if isinstance(x, dict)]
            required = {"peso", "descripcion", "en_escena"}
            if not required.issubset(set(keys)):
                fail(f"Actor sin estructura Rival completa: {path}; campos={keys}")
            if "nota_peso" in doc.get("system", {}).get("props", {}):
                fail(f"Campo editorial obsoleto nota_peso: {path}")
        if folder == "journals":
            pages = doc.get("pages")
            if not isinstance(pages, list):
                fail(f"JournalEntry sin pages[]: {path}")
            page_ids = set()
            for page in pages:
                page_id = page.get("_id")
                if not isinstance(page_id, str) or not page_id or page_id in page_ids:
                    fail(f"ID de página ausente o duplicado: {path}")
                page_ids.add(page_id)
        docs.append({"file": path.relative_to(ROOT / "source" / folder).as_posix(),
                     "id": doc_id, "name": doc["name"], "pages": len(doc.get("pages", []))})
    summary.append({"pack": name, "type": kind, "count": len(docs), "documents": docs})
print(json.dumps({"status": "SOURCE_PASS", "module_id": manifest["id"], "packs": summary},
                 ensure_ascii=False, indent=2))
