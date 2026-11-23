#!/usr/bin/env python3
"""CI137: read-only, byte-level gate for the historical 0.4.75 source ZIP.

No installation, promotion, edits to Items or artwork. Historical audits are
evidence, not a substitute for this file's exact SHA256 and ZIP integrity.
"""
import argparse
import hashlib
import io
import json
import struct
import sys
import tempfile
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[2]
TERRITORIAL = ROOT / "manifests/ci137-iconos-territoriales.json"
PFRIT = ROOT / "manifests/ci137-parafernalia22-rituales8-recovery.json"
PREFIX = "hiperaustralis-rituales/"
FLORA = "assets/flora-y-funga/iconos/"
BACKGROUND = "assets/flora/biomas/"


class Blocked(Exception):
    pass


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def file_sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for part in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(part)
    return h.hexdigest()


def webp_dimensions(raw):
    """Check RIFF envelope and extract dimensions; not a visual approval."""
    if (len(raw) < 30 or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP"
            or struct.unpack_from("<I", raw, 4)[0] + 8 != len(raw)):
        raise Blocked("INVALID_WEBP_RIFF")
    offset = 12
    while offset + 8 <= len(raw):
        kind = raw[offset:offset + 4]
        length = struct.unpack_from("<I", raw, offset + 4)[0]
        chunk = raw[offset + 8:offset + 8 + length]
        if len(chunk) != length:
            raise Blocked("TRUNCATED_WEBP_CHUNK")
        if kind == b"VP8X" and length >= 10:
            return (1 + int.from_bytes(chunk[4:7], "little"),
                    1 + int.from_bytes(chunk[7:10], "little"))
        if kind == b"VP8L" and length >= 5 and chunk[0] == 0x2f:
            bits = int.from_bytes(chunk[1:5], "little")
            return ((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1)
        if kind == b"VP8 " and length >= 10 and chunk[3:6] == b"\x9d\x01\x2a":
            return (int.from_bytes(chunk[6:8], "little") & 0x3fff,
                    int.from_bytes(chunk[8:10], "little") & 0x3fff)
        offset += 8 + length + length % 2
    raise Blocked("WEBP_DIMENSIONS_UNREADABLE")


def inspect_members(archive, rows, expected_flora=40, expected_bgs=8):
    all_names = [info.filename for info in archive.infolist()]
    if len(set(all_names)) != len(all_names):
        raise Blocked("DUPLICATE_ZIP_MEMBER")
    if any(name.startswith("/") or "\\" in name or ".." in name.split("/")
           for name in all_names):
        raise Blocked("UNSAFE_ZIP_MEMBER")
    names = {name.removeprefix(PREFIX): name for name in all_names}
    if len(names) != len(all_names):
        raise Blocked("ZIP_MEMBER_ALIAS_COLLISION")
    if (bad := archive.testzip()) is not None:
        raise Blocked("ZIP_CRC_FAIL: " + bad)
    flora = sorted(p for p in names if p.startswith(FLORA) and p.lower().endswith(".webp"))
    backgrounds = sorted(p for p in names if p.startswith(BACKGROUND) and p.lower().endswith(".webp"))
    if len(flora) != expected_flora or len(backgrounds) != expected_bgs:
        raise Blocked(f"FLORA_COUNTS: icons={len(flora)} backgrounds={len(backgrounds)}")
    icons, bg = [], []
    for p in flora:
        raw = archive.read(names[p])
        dim = webp_dimensions(raw)
        if dim != (512, 512):
            raise Blocked(f"FLORA_DIMENSIONS {p}: {dim}")
        icons.append({"member": names[p], "bytes": len(raw), "sha256": sha256(raw),
                      "dimensions": list(dim)})
    for p in backgrounds:
        raw = archive.read(names[p])
        dim = webp_dimensions(raw)
        bg.append({"member": names[p], "bytes": len(raw), "sha256": sha256(raw),
                   "dimensions": list(dim)})
    pfrit = []
    for row in rows:
        path = row["archiveMember"]
        if path not in all_names:
            raise Blocked("PFRIT_MEMBER_MISSING: " + path)
        raw = archive.read(path)
        dim = webp_dimensions(raw)
        pfrit.append({"id": row["id"], "member": path, "bytes": len(raw),
                      "sha256": sha256(raw), "dimensions": list(dim),
                      "matches0472_0473": sha256(raw) == row["historicalCandidateSha256_0472_0473"]})
    fau003 = []
    for p in names:
        if "FAU-003" in p.upper() and p.lower().endswith(".webp"):
            raw = archive.read(names[p])
            fau003.append({"member": names[p], "bytes": len(raw),
                           "sha256": sha256(raw), "dimensions": list(webp_dimensions(raw)),
                           "identityApproved": False})
    return {
        "floraCount": len(icons), "floraTotalBytes": sum(x["bytes"] for x in icons),
        "flora": icons, "backgroundCount": len(bg), "backgrounds": bg,
        "pfritCount": len(pfrit),
        "pfritMatches0472_0473": sum(x["matches0472_0473"] for x in pfrit),
        "pfrit": pfrit, "fau003Candidates": fau003
    }


def inspect_archive(path, territorial, pfrit):
    reference = territorial["recoveryAudit20261123"]["optimizedFlora0475"]
    expected_sha = reference["sourceSHA256"]
    expected_size = reference["libraryMetadataDiscovery20261123"]["catalogSizeBytes"]
    if path.stat().st_size != expected_size:
        raise Blocked("ZIP_SIZE_MISMATCH")
    actual_sha = file_sha256(path)
    if actual_sha != expected_sha:
        raise Blocked("ZIP_SHA256_MISMATCH")
    with ZipFile(path) as archive:
        members = archive.infolist()
        if len(members) != 358:
            raise Blocked(f"ZIP_ENTRY_COUNT: {len(members)} != 358")
        result = inspect_members(archive, pfrit["rows"])
    prior = reference["historicalFlora0475ByteCountDisagreement"]
    result.update({
        "archive": path.name, "archiveBytes": expected_size, "archiveSHA256": actual_sha,
        "archiveEntries": 358, "zipCRC": "PASS",
        "historicalByteTotals": [prior["comparator40IconBytes"], prior["hashAudit40IconBytes"]],
        "matchesHistoricalByteTotals": [result["floraTotalBytes"] == prior["comparator40IconBytes"],
                                        result["floraTotalBytes"] == prior["hashAudit40IconBytes"]],
        "status": "SOURCE_BYTES_VERIFIED__NO_ASSET_APPROVAL_OR_TRANSPORT",
        "runtimeItemsModified": 0, "assetsPromoted": 0, "foundryQAAccomplished": False,
        "releaseAllowed": False
    })
    return result


def fake_webp():
    # Header-only RIFF fixture. Used to exercise preflight logic, never art.
    payload = b"\x00" * 4 + (511).to_bytes(3, "little") * 2
    chunk = b"VP8X" + struct.pack("<I", len(payload)) + payload
    riff = b"WEBP" + chunk
    return b"RIFF" + struct.pack("<I", len(riff)) + riff


def self_test():
    with tempfile.TemporaryDirectory() as temp:
        path = Path(temp) / "synthetic.zip"
        with ZipFile(path, "w", ZIP_DEFLATED) as z:
            for i in range(40):
                z.writestr(PREFIX + FLORA + f"FLO-{i + 1:03}.webp", fake_webp())
            for i in range(8):
                z.writestr(PREFIX + BACKGROUND + f"territory-{i + 1:02}.webp", fake_webp())
            z.writestr(PREFIX + "assets/rituales/test.webp", fake_webp())
        row = {"id": "TEST", "archiveMember": PREFIX + "assets/rituales/test.webp",
               "historicalCandidateSha256_0472_0473": sha256(fake_webp())}
        with ZipFile(path) as z:
            good = inspect_members(z, [row])
            assert good["floraCount"] == 40 and good["backgroundCount"] == 8
            assert good["pfritCount"] == 1 and good["pfritMatches0472_0473"] == 1
            assert good["floraTotalBytes"] == 40 * len(fake_webp())
            try:
                inspect_members(z, [dict(row, archiveMember="not-found.webp")])
            except Blocked as e:
                assert "PFRIT_MEMBER_MISSING" in str(e)
            else:
                raise AssertionError("MISSING_MEMBER_WAS_ACCEPTED")
        with ZipFile(path, "a") as z:
            z.writestr(PREFIX + FLORA + "FLO-041.webp", fake_webp())
        with ZipFile(path) as z:
            try:
                inspect_members(z, [row])
            except Blocked as e:
                assert "FLORA_COUNTS" in str(e)
            else:
                raise AssertionError("EXTRA_FLORA_WAS_ACCEPTED")
        assert webp_dimensions(fake_webp()) == (512, 512)
        try:
            webp_dimensions(b"")
        except Blocked:
            pass
        else:
            raise AssertionError("EMPTY_WEBP_WAS_ACCEPTED")
    print("CI137_075_SYNTHETIC_SELF_TEST: PASS; 40 flora, 8 backgrounds, PF/RIT, negative cases")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    if not args.archive:
        parser.error("--archive required unless --self-test")
    try:
        t = json.loads(TERRITORIAL.read_text(encoding="utf-8"))
        p = json.loads(PFRIT.read_text(encoding="utf-8"))
        result = inspect_archive(args.archive, t, p)
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n",
                                   encoding="utf-8")
        print(json.dumps({k: v for k, v in result.items() if k not in ("flora", "backgrounds", "pfrit")},
                         ensure_ascii=False))
        return 0
    except (Blocked, OSError, ValueError) as exc:
        print("CI137_075_BLOCKED: " + str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
