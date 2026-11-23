#!/usr/bin/env python3
"""CI137 — Transfer exactly 20 approved Equipo común WebP; no Items or packs.

Default: read-only preflight. --apply copies only approved bytes after every
source archive, identity, image and 9 existing staging assets passes verification.
Requires a full checkout, the two archived BBTECA ZIPs and nothing else.
"""
import argparse
import hashlib
import json
import os
import tempfile
from pathlib import Path
from zipfile import ZipFile, BadZipFile

APPROVED_SHA = "41d20db6e45894e1f00ad94a8fccce01e767567bd8d3401a58716a609f4e1a72"
OVERLAY_SHA = "867884cadc27b86216e5c8f91703a7d5c75c9bc2f6410e75db7fe605e8d54be6"
APPROVED_PREFIX = "FOUNDRY_WEBP_256/"
OVERLAY_PREFIX = "module/assets/equipo-comun/"
STAGING_PREFIX = "module/assets/_staging/equipo/webp256/"
MANIFEST = "manifests/equipo-comun-29-cruces-candidatos-20261121.json"
SELECTION = "manifests/ci137-selected-source-137-historical-ids.json"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def archive(path, sha):
    assert digest(path.read_bytes()) == sha, f"Archive SHA differs: {path}"
    z = ZipFile(path)
    assert z.testzip() is None, f"ZIP CRC differs: {path}"
    for name in z.namelist():
        assert not Path(name).is_absolute() and ".." not in Path(name).parts and "\\" not in name, f"Unsafe ZIP member: {name}"
    return z


def alpha_256(data):
    if not (len(data) >= 25 and data[:4] == b"RIFF" and data[8:16] == b"WEBPVP8L" and data[20] == 47):
        return False
    w = 1 + (data[21] | ((data[22] & 63) << 8))
    h = 1 + ((data[22] >> 6) | (data[23] << 2) | ((data[24] & 15) << 10))
    return w == h == 256 and bool(data[24] & 16)


def verify(repo, approved, overlay, apply):
    module = json.loads((repo / "module/module.json").read_text(encoding="utf-8"))
    assert module["id"] == "hiperaustralis-compendios-prototype", "Wrong module ID"
    assert [p["name"] for p in module["packs"]] == ["ha-proto-items", "ha-proto-actors", "ha-proto-journals"], "Compendium identity changed"
    m = json.loads((repo / MANIFEST).read_text(encoding="utf-8"))
    rows = m["items"]
    assert len(rows) == len({r["id"] for r in rows}) == 29, "29 unique IDs required"
    assert (m["historicalItemCount"], m["newArtApprovedCount"], m["stagingCandidateCount"], m["keptOnStockFoundryIcons"]) == (40, 20, 9, 11)
    source = json.loads((repo / SELECTION).read_text(encoding="utf-8"))
    historical = {r["id"] for r in source["entries"] if r["family"] == "Equipo común"}
    assert len(historical) == 40 and {r["id"] for r in rows} <= historical, "Item crosswalk differs from CI137"

    approved_rows = [r for r in rows if r["group"] == "L01_TO_L05_APPROVED_NEW_ART"]
    old_rows = [r for r in rows if r["group"] == "NOVEMBER_29_WEBP_STAGING"]
    assert len(approved_rows) == 20 and len(old_rows) == 9
    new_files = []
    with archive(approved, APPROVED_SHA) as za, archive(overlay, OVERLAY_SHA) as zo:
        names_a = {x for x in za.namelist() if x.startswith(APPROVED_PREFIX) and x.endswith(".webp")}
        names_o = {x for x in zo.namelist() if x.startswith(OVERLAY_PREFIX) and x.endswith(".webp")}
        assert len(names_a) == len(names_o) == 20
        qa = json.loads(zo.read("QA/manifest_29.json"))
        assert qa["moduleId"] == module["id"] and qa["candidateCount"] == 29
        by_id = {r["id"]: r for r in qa["items"]}
        assert len(by_id) == 29
        for row in rows:
            q = by_id[row["id"]]
            assert (q["name"], q["sha256"], q["bytes"]) == (row["name"], row["sha256"], row["bytes"]), "Identity/hash mismatch"
            if row in approved_rows:
                name = row["file"]
                assert Path(name).name == name, "Unsafe WebP name"
                a, b = APPROVED_PREFIX + name, OVERLAY_PREFIX + name
                assert a in names_a and b in names_o, f"Approved WebP missing: {name}"
                raw = za.read(a)
                assert raw == zo.read(b), f"Different bytes across archives: {name}"
                assert digest(raw) == row["sha256"] and len(raw) == row["bytes"] and alpha_256(raw), f"Invalid WebP: {name}"
                assert q["asset"] == "BUNDLED_IN_OVERLAY" and q["stagedPath"] == "assets/equipo-comun/" + name
                new_files.append((repo / b, raw))
            else:
                rel = row["file"]
                assert rel.startswith(STAGING_PREFIX) and q["asset"] == "EXISTING_GITHUB_BRANCH_NOT_BUNDLED", "Historical staging mismatch"
                assert q["stagedPath"] == rel.removeprefix("module/"), "Staging path mismatch"
                if apply:
                    old_file = repo / rel
                    assert old_file.is_file(), f"Missing existing staging: {rel}"
                    raw = old_file.read_bytes()
                    assert digest(raw) == row["sha256"] and len(raw) == row["bytes"], f"Staging hash mismatch: {rel}"
        assert names_a == {APPROVED_PREFIX + r["file"] for r in approved_rows}
        assert names_o == {OVERLAY_PREFIX + r["file"] for r in approved_rows}

    collisions = [str(p) for p, raw in new_files if p.exists() and digest(p.read_bytes()) != digest(raw)]
    assert not collisions, f"Refusing to overwrite different bytes: {collisions}"
    written = 0
    if apply:
        for p, raw in new_files:
            if p.is_file():
                continue
            p.parent.mkdir(parents=True, exist_ok=True)
            fd, tmp = tempfile.mkstemp(prefix=".ci137-", suffix=".webp", dir=p.parent)
            try:
                with os.fdopen(fd, "wb") as out:
                    out.write(raw)
                assert digest(Path(tmp).read_bytes()) == digest(raw)
                os.replace(tmp, p)
            finally:
                if os.path.exists(tmp):
                    os.unlink(tmp)
            written += 1
    return {"status": "PASS_BINARY_TRANSFER" if apply else "PASS_READ_ONLY",
            "approved": 20, "crosswalk": 29, "historical": 40,
            "keptStockIcons": 11, "existingNineVerified": apply,
            "newFilesWritten": written, "itemsChanged": 0, "packChanged": False,
            "releaseGenerated": False, "runtimeQa": "NOT_EXECUTED"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, type=Path)
    parser.add_argument("--approved-zip", required=True, type=Path)
    parser.add_argument("--overlay-zip", required=True, type=Path)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    try:
        outcome = verify(args.repo, args.approved_zip, args.overlay_zip, args.apply)
        print(json.dumps(outcome, ensure_ascii=False, sort_keys=True))
        return 0
    except (AssertionError, FileNotFoundError, KeyError, BadZipFile, ValueError) as ex:
        print(json.dumps({"status": "BLOCKED", "error": str(ex)}, ensure_ascii=False))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
