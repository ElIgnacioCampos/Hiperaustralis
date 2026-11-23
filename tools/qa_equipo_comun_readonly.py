#!/usr/bin/env python3
"""Auditoria de SOLO LECTURA. No modifica assets ni Items de Foundry."""
from pathlib import Path
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
STAGING = "source-original/ci137-asset-staging/equipo/webp256/"
M = json.loads((ROOT / "TRANSFER_MANIFEST.json").read_text(encoding="utf-8"))
Q = json.loads((ROOT / "manifests/equipo-comun-qa9-20261121.json").read_text(encoding="utf-8"))
files = {record["path"]: record for record in M["physicalFiles"]}
issues = []
checked = []
for path, expected in sorted(files.items()):
    if not (path.startswith(STAGING) and path.endswith(".webp")):
        continue
    file = ROOT / path
    if not file.exists():
        issues.append("WebP missing: " + path)
        checked.append({"file": path, "ok": False})
        continue
    raw = file.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    riff = raw[:4] == b"RIFF" and raw[8:12] == b"WEBP"
    valid = (
        len(raw) == expected["bytes"]
        and digest == expected["sha256"]
        and riff
        and raw[12:16] == b"VP8L"
        and len(raw) >= 25
        and raw[20] == 47
    )
    if valid:
        width = 1 + (raw[21] | ((raw[22] & 63) << 8))
        height = 1 + ((raw[22] >> 6) | (raw[23] << 2) | ((raw[24] & 15) << 10))
        valid = width == height == 256 and bool(raw[24] & 16)
    if not valid:
        issues.append("Bad WebP bytes/sha/dimensions/alpha: " + path)
    checked.append({"file": path, "ok": bool(valid)})
if len(checked) != 29:
    issues.append("Expected 29 WebP, got " + str(len(checked)))

masters_missing = []
candidates = []
used_ids = set()
for item in Q["items"]:
    if item["documentId"] in used_ids:
        issues.append("Duplicate compendium Item ID: " + item["documentId"])
    used_ids.add(item["documentId"])
    image_path = item["webp"]["path"]
    if image_path not in files:
        issues.append("Unlisted candidate WebP: " + image_path)
    else:
        expected = files[image_path]
        if (expected["sha256"] != item["webp"]["sha256"]
                or expected["bytes"] != item["webp"]["bytes"]):
            issues.append("Candidate vs transfer manifest mismatch: " + image_path)
    master = item["master"]["declaredPath"]
    entry = files.get(master)
    if entry is None:
        issues.append("Unlisted master: " + master)
    elif not (ROOT / master).is_file():
        masters_missing.append(master)
    else:
        data = (ROOT / master).read_bytes()
        if len(data) != entry["bytes"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
            issues.append("Master bytes/hash mismatch: " + master)
    candidates.append({"number": item["index"], "id": item["documentId"],
                       "candidate": image_path, "master_present": master not in masters_missing})
if len(candidates) != 9:
    issues.append("Expected 9 candidate mappings")

summary = {
    "status": "FAIL" if issues else ("STAGING_OK_MASTERS_PENDING"
              if masters_missing else "STAGING_AND_MASTERS_OK_RUNTIME_QA_PENDING"),
    "read_only": True, "ready_for_runtime": False,
    "checked_webp": len(checked),
    "verified_webp": sum(item["ok"] for item in checked),
    "candidate_items": len(candidates),
    "missing_masters": masters_missing,
    "issues": issues,
    "next_step": "Foundry V14 isolated visual QA, then source Item JSON comparison."
}
print(json.dumps(summary, ensure_ascii=False, indent=2))
sys.exit(1 if issues else 0)
