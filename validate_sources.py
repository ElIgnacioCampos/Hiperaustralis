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
TEMPLATE_DIR = ROOT / "source-original" / "foundry-templates"
ITEM_META_PROP_KEYS = {"hipera_tipo"}

def fail(message):
    print("FAIL:", message, file=sys.stderr)
    raise SystemExit(1)

def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"JSON ilegible {path}: {exc}")

def load_item_templates():
    templates = {}
    for path in sorted(TEMPLATE_DIR.glob("fvtt-Item-*.json")):
        doc = load_json(path)
        system = doc.get("system", {})
        template_id = system.get("uniqueId") or doc.get("_id")
        version = system.get("templateSystemUniqueVersion")
        contents = system.get("body", {}).get("contents", [])
        if not isinstance(template_id, str) or not template_id:
            fail(f"Plantilla sin uniqueId/_id: {path}")
        if not isinstance(contents, list):
            fail(f"Plantilla sin system.body.contents[]: {path}")
        keys = {entry.get("key") for entry in contents
                if isinstance(entry, dict) and isinstance(entry.get("key"), str)}
        if template_id in templates:
            fail(f"ID de plantilla duplicado: {template_id}")
        templates[template_id] = {"version": version, "keys": keys, "file": path.name}
    return templates

ITEM_TEMPLATES = load_item_templates()

manifest = load_json(ROOT / "module/module.json")
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
        doc = load_json(path)
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
            props = system.get("props")
            if not isinstance(props, dict):
                fail(f"Item sin system.props object: {path}")
            template_id = system.get("template")
            template = ITEM_TEMPLATES.get(template_id)
            if not template:
                fail(f"Item referencia plantilla no disponible en fixtures: {path}; template={template_id}")
            if system.get("templateSystemUniqueVersion") != template["version"]:
                fail(f"Versión de plantilla no coincide: {path}; "
                     f"item={system.get('templateSystemUniqueVersion')} "
                     f"fixture={template['version']}")
            prop_keys = set(props) - ITEM_META_PROP_KEYS
            unknown = prop_keys - template["keys"]
            missing = template["keys"] - prop_keys
            if unknown:
                fail(f"Props no declaradas por plantilla {template_id}: {path}; campos={sorted(unknown)}")
            if missing:
                fail(f"Props requeridas por plantilla {template_id} ausentes: {path}; campos={sorted(missing)}")
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
