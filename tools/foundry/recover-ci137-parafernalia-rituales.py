#!/usr/bin/env python3
"""CI137: audit/recover Parafernalia (22) and Rituales (8) WebP from verified 0.4.75 archive.

Read-only by default. --stage is an explicit isolated destination.
Does not alter Foundry, git Items, runtime references, or approved artworks.
"""
import argparse
import hashlib
import io
import json
import sys
import zipfile
from pathlib import Path

def digest(data):
    return hashlib.sha256(data).hexdigest()

def audit(archive, manifest, stage=None):
    if not archive.is_file() or not manifest.is_file():
        raise ValueError("Archive and exact 30-record manifest must both exist")
    spec = json.loads(manifest.read_text(encoding="utf-8"))
    entries = spec.get("rows", [])
    if spec.get("count") != 30 or len(entries) != 30:
        raise ValueError("Expected 30 records exactly")
    if sum(x["family"] == "Rituales" for x in entries) != 8:
        raise ValueError("Expected eight ritual records")
    if sum(x["family"].startswith("Parafernalia") for x in entries) != 22:
        raise ValueError("Expected 22 parafernalia records")
    actual_zip_sha = digest(archive.read_bytes())
    if actual_zip_sha != spec["archiveSha256"]:
        raise ValueError("Historical archive SHA mismatch: " + actual_zip_sha)
    ids = [x["id"] for x in entries]
    source_paths = [x["archiveMember"] for x in entries]
    destination_paths = [x["stagedPath"] for x in entries]
    if len(set(source_paths)) != 30 or len(set(destination_paths)) != 30:
        raise ValueError("Expected 30 unique source and destination image paths")
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate historical Item IDs")
    if stage is not None and (stage.resolve() in [Path(".").resolve(), archive.parent.resolve()]):
        raise ValueError("Stage destination may not be repository root or source archive folder")
    report = {"schema": "ci137-30-assets-recovered-v01", "archiveSha256": actual_zip_sha,
              "status": "READ_ONLY_AUDIT", "items": []}
    try:
        from PIL import Image
    except ImportError as exc:
        raise ValueError("Pillow required for verified WebP decoding; no extraction performed") from exc
    planned = []
    with zipfile.ZipFile(archive) as z:
        if z.testzip():
            raise ValueError("ZIP CRC failure")
        members = z.namelist()
        if len(members) != len(set(members)):
            raise ValueError("Duplicate ZIP members")
        for row in entries:
            src = row["archiveMember"]
            dst = row["stagedPath"]
            if not src.startswith("hiperaustralis-rituales/assets/") or not src.endswith(".webp"):
                raise ValueError("Unsafe archive path: " + src)
            if not dst.startswith("module/assets/") or not dst.endswith(".webp"):
                raise ValueError("Unsafe destination: " + dst)
            if ".." in Path(src).parts or ".." in Path(dst).parts or "\\" in src + dst:
                raise ValueError("Path traversal forbidden")
            if src not in members:
                raise ValueError("Original WebP not found: " + src)
            binary = z.read(src)
            if binary[:4] != b"RIFF" or binary[8:12] != b"WEBP":
                raise ValueError("Invalid WebP header: " + src)
            try:
                with Image.open(io.BytesIO(binary)) as image:
                    if image.format != "WEBP":
                        raise ValueError("Not a decoded WebP")
                    width, height = image.size
                    image.verify()
                with Image.open(io.BytesIO(binary)) as image:
                    image.load()
            except Exception as exc:
                raise ValueError("WebP decode/verify failed: " + src) from exc
            observed = digest(binary)
            if row.get("assetSha256") and row["assetSha256"] != observed:
                raise ValueError("Declared asset SHA differs: " + src)
            target = stage / dst if stage is not None else None
            if target is not None and target.exists() and digest(target.read_bytes()) != observed:
                raise ValueError("Existing staged file has different bytes: " + str(target))
            planned.append((target, binary))
            report["items"].append({"id": row["id"], "name": row["name"], "family": row["family"],
                                    "archiveMember": src, "stagedPath": dst,
                                    "bytes": len(binary), "sha256": observed, "width": width, "height": height})
        if stage is not None:
            for target, binary in planned:
                if not target.exists():
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(binary)
                if digest(target.read_bytes()) != digest(binary):
                    raise ValueError("Post-write SHA mismatch: " + str(target))
            report["status"] = "STAGED_30_ASSETS_HASHED"
            out = stage / "manifests" / "ci137-pf22-rit08-assets-verified.json"
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--archive", required=True, type=Path)
    p.add_argument("--manifest", required=True, type=Path)
    p.add_argument("--stage", type=Path)
    p.add_argument("--report", type=Path, help="Optional text JSON report path for read-only audit")
    args = p.parse_args()
    try:
        result = audit(args.archive, args.manifest, args.stage)
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(json.dumps({"status": result["status"], "count": len(result["items"]), "sha256": result["archiveSha256"]}))
    except Exception as exc:
        print("BLOCKED: " + str(exc), file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
