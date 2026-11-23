#!/usr/bin/env python3
"""Transfer 115 verified CI137 WebP from 11 Git blobs, preserving 137 Item sources.

Writes ONLY assets to existing module tree on isolated CI137 branch.
79 archived visual candidates go to _staging. 20 approved Equipo and 16
approved historical Reliquias go to their image paths; NO Item img changed.
No module.json, Compendium DB, runtime or production changes.
"""
import base64
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import sys
from urllib.request import Request, urlopen
from zipfile import ZipFile
from io import BytesIO

REPO = "ElIgnacioCampos/Hiperaustralis"
MODULE_ID = "hiperaustralis-compendios-prototype"
ARCHIVE_SHA256 = "84aa4402fd51c48e4f4a66d5dfb5d454708160cc3026cd3d5a7fc486815f3a52"
ARCHIVE_SIZE = 5269004
CHUNK_SHAS = [
    "e66d808f85c9f8c116669fc490cfe105aca2364d",
    "9c8518500b11ced8df6bc9b0d1c0efd8b0490348",
    "ac1eb74251ecef1504124b7f318747b872d638c1",
    "da47f96e8dbd3c06a7e62b8124bd7717e80d24ee",
    "4c020846ccbadfc96f2a1e18baab69b45fec26c0",
    "d9ec82d8920ac984eb2de179dc4517cbcd1f613f",
    "cecc76007d509c7273a9bdd41c75d01e1638ce0b",
    "24653635cdb6f80295a04be51d6832eba875fbf4",
    "b4246805901726c204544423fdc03042e16b5562",
    "ca73e63da839bd6d18edfab22b7ea55f96b41a3f",
    "dde5ab7383b3e53d03128c0fbac3cc2918b60636",
]

def sha256(raw):
    return hashlib.sha256(raw).hexdigest()

def sha_git(raw):
    return hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()

def download_archive():
    token = os.environ["GH_TOKEN"]
    assert os.environ.get("GITHUB_REPOSITORY", REPO) == REPO
    chunks = []
    for i, sha in enumerate(CHUNK_SHAS):
        req = Request(
            f"https://api.github.com/repos/{REPO}/git/blobs/{sha}",
            headers={"Authorization": f"Bearer {token}",
                     "Accept": "application/vnd.github+json",
                     "X-GitHub-Api-Version": "2022-11-28"})
        with urlopen(req, timeout=60) as reply:
            obj = json.load(reply)
        assert obj["sha"] == sha and obj["encoding"] == "base64", f"Blob {i} metadata invalid"
        raw = base64.b64decode(obj["content"])
        assert len(raw) == obj["size"] and sha_git(raw) == sha, f"Blob {i} bytes invalid"
        chunks.append(raw)
    entire = b"".join(chunks)
    assert len(entire) == ARCHIVE_SIZE and sha256(entire) == ARCHIVE_SHA256, "Archive hash mismatch"
    return entire

def target_path(row):
    old = row["repoPath"]
    assert old.startswith("module/assets/")
    if row["source"] == "STAGING_V02_HISTORICAL":
        return "module/assets/_staging/ci137_v02_historico/" + old.removeprefix("module/assets/")
    assert row["source"] in ("CI137_16_APPROVED_HISTORICAL_RELICS", "EQUIPO_COMUN_L01_L05_APPROVED")
    return old

def apply(repo, binary):
    module = json.loads((repo / "module/module.json").read_text(encoding="utf-8"))
    assert module["id"] == MODULE_ID
    assert [p["name"] for p in module["packs"]] == ["ha-proto-items", "ha-proto-actors", "ha-proto-journals"]
    assert module["version"] == "0.1.5", "Refuse to mutate unexpected prototype version"
    with ZipFile(BytesIO(binary)) as z:
        assert z.testzip() is None, "CRC ZIP failure"
        names = z.namelist()
        assert len(names) == len(set(names))
        m = json.loads(z.read("QA/manifest_transfer.json"))
        assert m["moduleId"] == MODULE_ID and m["authoritativeCorpus"] == 137
        assert m["filesIncluded"] == 115 and m["itemsOrPacksIncluded"] == 0
        assert m["sets"] == {"historic_graphics_79": 79, "approved_historic_relics": 16, "approved_equipo_l01_l05": 20}
        assert m["unresolvedLegacyPaths"] == ["modules/hiperaustralis-rituales/assets/armas/01_cuchillo_piedra.webp"]
        rows=m["immutableEntries"]
        assert len(rows) == 115
        assert {n for n in names if n.startswith("module/")} == {r["repoPath"] for r in rows}
        pending=[]
        categories={"STAGING_V02_HISTORICAL":0,"CI137_16_APPROVED_HISTORICAL_RELICS":0,"EQUIPO_COMUN_L01_L05_APPROVED":0}
        for row in rows:
            categories[row["source"]] += 1
            original=PurePosixPath(row["repoPath"])
            assert not original.is_absolute() and ".." not in original.parts and original.suffix==".webp"
            new=target_path(row)
            dest=PurePosixPath(new)
            assert not dest.is_absolute() and ".." not in dest.parts and new.startswith("module/assets/")
            data=z.read(row["repoPath"])
            assert len(data) == row["size"] and sha256(data) == row["sha256"],new
            assert len(data)>30 and data[:4]==b"RIFF" and data[8:12]==b"WEBP",new
            path=repo.joinpath(*dest.parts)
            if path.exists():
                assert path.is_file() and sha256(path.read_bytes())==row["sha256"],"REFUSE OVERWRITE: "+new
            else: pending.append((path,data))
        assert categories == {"STAGING_V02_HISTORICAL":79,"CI137_16_APPROVED_HISTORICAL_RELICS":16,"EQUIPO_COMUN_L01_L05_APPROVED":20}
        assert len({target_path(r) for r in rows}) == 115, "Target path collision"
        for path,raw in pending:
            path.parent.mkdir(parents=True,exist_ok=True)
            path.write_bytes(raw)
            assert sha256(path.read_bytes())==sha256(raw)
        report={"status":"PASS_BINARY_INTEGRATION_ONLY","module":MODULE_ID,"filesExpected":115,
                "newFilesWritten":len(pending),"alreadyIdentical":115-len(pending),"categories":categories,
                "historicalAssetsStagingOnly":79,"itemsEdited":0,"packsEdited":0,"moduleJsonEdited":False,
                "cuchilloPiedraStillMissing":True,"ARM11_13_not_promoted":True,"runtimeQA":"NOT_EXECUTED"}
        return report

if __name__=="__main__":
    root=Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
    if os.environ.get("GITHUB_REF", "refs/heads/work/ci137-ensayo-identidad-historica-20261121") != "refs/heads/work/ci137-ensayo-identidad-historica-20261121":
        raise SystemExit("ERROR: only CI137 branch permitted")
    report=apply(root,download_archive())
    out=Path(os.environ.get("RUNNER_TEMP", "/tmp"))/"ci137-assets-import-report.json"
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False))
