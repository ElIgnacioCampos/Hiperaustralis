#!/usr/bin/env python3
"""Validate the preserved 20-item Armas source set and its manifest.

This is a source-integrity gate, not an asset-presence gate. Historical image
paths remain untouched until the approved binaries are staged and hashed.
"""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source/items/armas"
MANIFEST = ROOT / "manifests/items-armas.json"
LEGACY_PREFIX = "modules/hiperaustralis-rituales/assets/armas/"

def fail(message):
    print(f"ARMS_SOURCE_FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)

def read_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"Invalid JSON {path.relative_to(ROOT)}: {exc}")

manifest = read_json(MANIFEST)
records = manifest.get("items")
if manifest.get("type") != "Item" or manifest.get("count") != 20:
    fail("Manifest must describe exactly 20 Foundry Item documents")
if not isinstance(records, list) or len(records) != 20:
    fail("Manifest items[] must contain exactly 20 records")

expected_files = {r.get("filename") for r in records}
if None in expected_files or len(expected_files) != 20:
    fail("Manifest filenames are missing or duplicated")

actual_files = {p.name for p in SOURCE.glob("*.json")}
if actual_files != expected_files:
    fail(f"Source/manifest mismatch: missing={sorted(expected_files-actual_files)}, "
         f"unlisted={sorted(actual_files-expected_files)}")

seen_ids, seen_names = set(), set()
legacy_refs = []
for record in records:
    path = SOURCE / record["filename"]
    raw = path.read_bytes()
    doc = read_json(path)
    digest = hashlib.sha256(raw).hexdigest()
    if digest != record.get("sha256"):
        fail(f"JSON SHA-256 mismatch: {record['filename']}")
    if doc.get("_id") != record.get("_id") or doc.get("name") != record.get("name"):
        fail(f"Identity mismatch against manifest: {record['filename']}")
    if doc.get("img") != record.get("img"):
        fail(f"Image reference differs from manifest: {record['filename']}")
    if doc["_id"] in seen_ids or doc["name"] in seen_names:
        fail(f"Duplicate Item identity: {record['filename']}")
    seen_ids.add(doc["_id"])
    seen_names.add(doc["name"])
    img = doc.get("img", "")
    if img.startswith(LEGACY_PREFIX):
        legacy_refs.append({"id": doc["_id"], "name": doc["name"], "img": img})
    elif img:
        fail(f"Unexpected image path before asset migration: {record['filename']}: {img}")

print(json.dumps({
    "status": "ARMS_SOURCE_PASS",
    "documents": len(records),
    "json_sha256_verified": len(records),
    "identity_and_img_manifest_verified": len(records),
    "legacy_asset_references_pending": len(legacy_refs),
    "legacy_asset_references": legacy_refs,
    "note": "JSON hashes are document hashes, not image hashes. No runtime image path was rewritten."
}, ensure_ascii=False, indent=2))
