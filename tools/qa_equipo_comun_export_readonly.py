#!/usr/bin/env python3
"""Hiperaustralis Equipo Común: cotejo SOLO LECTURA export Foundry vs candidatos.

Uso: python3 tools/qa_equipo_comun_export_readonly.py /ruta/al/HIPERAUSTRALIS_FOUNDRY_ITEMS_*.json
No modifica el export, el módulo ni los compendios. No sube export privado.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANDIDATES = ROOT / "manifests" / "equipo-comun-candidatos-solo-img-20261121.json"
MANIFEST = ROOT / "TRANSFER_MANIFEST.json"

def validate(export, mapping, transfer):
    problems = []
    records = [r for r in export.get("documents", [])
               if r.get("sourceScope") == "world-compendium"
               and r.get("sourcePack") == "world.hiperaustralis-rituales"
               and r.get("folderPath") == "Equipo común"]
    by_id = {r.get("documentId"): r for r in records}
    files = {r["path"]: r for r in transfer.get("physicalFiles", [])}
    checked = []
    used = set()
    for cand in mapping.get("entries", []):
        id_ = cand["sourceId"]
        doc = by_id.get(id_)
        checks = {}
        checks["unique_mapping"] = id_ not in used
        used.add(id_)
        checks["document_exists"] = doc is not None
        if doc:
            raw = doc.get("document", {})
            checks["uuid"] = doc.get("uuid") == cand["sourceUuid"]
            checks["name"] = doc.get("name") == cand["name"] == raw.get("name")
            checks["type"] = doc.get("itemType") == cand["itemType"] == raw.get("type")
            checks["folder"] = (doc.get("folderId") == cand["folderId"]
                                and doc.get("folderPath") == cand["folderName"])
            checks["historical_img"] = raw.get("img") == cand["expectedCurrentImg"]
            checks["hipera_tipo"] = raw.get("system", {}).get("props", {}).get("hipera_tipo") == "equipo"
            checks["source_id"] = raw.get("_id") == id_
            checks["description_preserved"] = "descripcion" in raw.get("system", {}).get("props", {})
        p = cand["candidateStagingWebp"]
        f = files.get(p)
        checks["asset_in_manifest"] = (f is not None
                                       and f["sha256"] == cand["candidateSha256"]
                                       and f.get("status", "approved_runtime_derivative")
                                       in ("approved_runtime_derivative", "approved_master"))
        if not all(checks.values()):
            problems.append({"id": id_, "failed": [key for key, ok in checks.items() if not ok]})
        checked.append({"id": id_, "name": cand["name"], "checks": checks})
    if len(records) != mapping.get("totalHistoricalCommonItems", 40):
        problems.append({"issue": "historical_total_changed", "observed": len(records)})
    if len(checked) != mapping.get("candidateImageOnlyChanges", 9):
        problems.append({"issue": "candidate_total_changed", "observed": len(checked)})
    return {
        "status": "SOURCE_MATCH" if not problems else "BLOCKED_SOURCE_MISMATCH",
        "readOnly": True,
        "approvedForImageMutation": False,
        "historicalCommonRecords": len(records),
        "candidateChecks": len(checked),
        "matchedCandidates": len(checked)-sum(1 for row in problems if "id" in row),
        "problems": problems,
        "recommendation": "If SOURCE_MATCH, run asset and Foundry visual QA; do not update Items from this script."
    }

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("foundry_export", type=Path, help="Export original JSON 19-11; do not commit this file.")
    args = parser.parse_args()
    export = json.loads(args.foundry_export.read_text(encoding="utf-8"))
    mapping = json.loads(CANDIDATES.read_text(encoding="utf-8"))
    transfer = json.loads(MANIFEST.read_text(encoding="utf-8"))
    print(json.dumps(validate(export, mapping, transfer), ensure_ascii=False, indent=2))
    return 0 if not validate(export, mapping, transfer)["problems"] else 1

if __name__ == "__main__":
    raise SystemExit(main())
