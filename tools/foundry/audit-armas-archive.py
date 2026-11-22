#!/usr/bin/env python3
"""Safely inventory and extract the archived weapon assets for audit only."""
import hashlib
import json
import sys
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[2]
ARCHIVE = ROOT / "source/items/SOURCE_ITEMS_ARMAS_CORTE1_GITHUB.zip"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist/armas-source-audit"

def fail(message):
    raise SystemExit(f"FAIL: {message}")

if not ARCHIVE.is_file():
    fail(f"Missing archive: {ARCHIVE}")

OUT.mkdir(parents=True, exist_ok=True)
records = []
seen = set()

with zipfile.ZipFile(ARCHIVE) as zf:
    bad = zf.testzip()
    if bad:
        fail(f"CRC failure: {bad}")
    for info in zf.infolist():
        raw = info.filename
        path = PurePosixPath(raw)
        if path.is_absolute() or ".." in path.parts:
            fail(f"Unsafe archive path: {raw}")
        if info.is_dir():
            continue
        normalized = path.as_posix()
        if normalized in seen:
            fail(f"Duplicate archive path: {normalized}")
        seen.add(normalized)
        data = zf.read(info)
        target = OUT.joinpath(*path.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        records.append({
            "path": normalized,
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "extension": target.suffix.lower(),
        })

manifest = {
    "archive": str(ARCHIVE.relative_to(ROOT)),
    "archive_bytes": ARCHIVE.stat().st_size,
    "archive_sha256": hashlib.sha256(ARCHIVE.read_bytes()).hexdigest(),
    "entry_count": len(records),
    "entries": records,
}
(OUT / "ARCHIVE_AUDIT.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps({
    "status": "ARMAS_ARCHIVE_AUDIT_PASS",
    "entries": len(records),
    "image_entries": sum(r["extension"] in {".png", ".jpg", ".jpeg", ".webp", ".avif"} for r in records),
    "output": str(OUT),
}, ensure_ascii=False))
