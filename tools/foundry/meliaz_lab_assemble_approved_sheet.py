#!/usr/bin/env python3
"""Assemble exact approved Kona WEBP into a tested LAB archive; no deployment."""
import argparse, hashlib, io, json, zipfile
from pathlib import Path

BASE_SHA = "e972f99ce35ca2775a7ad57f534f6564be5b635671530eab0fa0362775ed5fd0"
ASSET_SHA = "fb9d84709b9303457f0c06efd6a9c8364c62fb2b03870358b3f73c940b9aeafe"
OLD_ASSET_SHA = "8c27fc45a9e1d8b0543099379419c90a2cb6e94e47562915a755528a112c8bd7"
ASSET = "assets/hoja-kona-experimental-v2.webp"
VERSION = "0.24.206-lab.1"
def digest(data):
    return hashlib.sha256(data).hexdigest()
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--base",type=Path,required=True,help="Inner installable ZIP from Actions 45546313921")
    p.add_argument("--approved-webp",type=Path,required=True)
    p.add_argument("--out",type=Path,required=True)
    p.add_argument("--report",type=Path,required=True)
    a=p.parse_args()
    base=a.base.read_bytes()
    approved=a.approved_webp.read_bytes()
    assert digest(base)==BASE_SHA,"Wrong D2 base archive"
    assert digest(approved)==ASSET_SHA,"Approved image must match exact SHA-256"
    with zipfile.ZipFile(io.BytesIO(base)) as z:
        assert z.testzip() is None and len(z.namelist())==63
        files={n:z.read(n) for n in z.namelist()}
    assert len(files)==63 and digest(files[ASSET])==OLD_ASSET_SHA
    old=files.copy()
    m=json.loads(files["module.json"])
    assert m["id"]=="meliaz-bridge-lab" and m["version"]=="0.24.206-lab.0"
    m["version"]=VERSION
    files["module.json"]=(json.dumps(m,ensure_ascii=False,indent=2)+"\n").encode()
    files[ASSET]=approved
    assert {n for n in files if files[n]!=old[n]}=={ASSET,"module.json"}
    with zipfile.ZipFile(a.out,"w",zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for n,b in sorted(files.items()):
            info=zipfile.ZipInfo(n,(2026,11,25,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info,b,compresslevel=6)
    with zipfile.ZipFile(a.out) as z:
        assert z.testzip() is None and len(z.namelist())==63
        assert all(z.read(n)==b for n,b in files.items())
    report={"status":"D2_CODE_PASS_LOCAL_ASSET_ASSEMBLY_PASS_D3_PENDING_NO_DEPLOY","baseRun":45546313921,"baseSha256":BASE_SHA,"approvedAssetSha256":ASSET_SHA,"moduleId":m["id"],"version":VERSION,"changed":[ASSET,"module.json: version only"],"entries":63,"bytes":a.out.stat().st_size,"sha256":digest(a.out.read_bytes()),"runtimeTested":False}
    a.report.write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,indent=2))
if __name__=="__main__":
    main()
