#!/usr/bin/env python3
"""Reconcile Foundry exports against versioned source documents without mutating either."""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any

DEFAULT_IGNORED = {"_stats", "folder", "sort"}

def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

def digest(value: Any) -> str:
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()

def without_paths(value: Any, ignored: set[str]) -> Any:
    if isinstance(value, dict):
        return {k: without_paths(v, ignored) for k, v in value.items() if k not in ignored}
    if isinstance(value, list):
        return [without_paths(v, ignored) for v in value]
    return value

def norm_name(value: Any) -> str:
    raw = unicodedata.normalize("NFKD", str(value or "").casefold())
    raw = "".join(c for c in raw if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", raw).strip()

def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"JSON inválido {path}: {exc}") from exc

def read_export(path: Path) -> tuple[dict, list[dict]]:
    payload = load_json(path)
    if not isinstance(payload, dict) or not isinstance(payload.get("documents"), list):
        raise ValueError("El export debe contener documents[]")
    records = []
    for index, row in enumerate(payload["documents"]):
        if not isinstance(row, dict) or not isinstance(row.get("document"), dict):
            raise ValueError(f"Registro export #{index} sin document object")
        doc = row["document"]
        doc_id = row.get("documentId") or doc.get("_id") or doc.get("id")
        records.append({
            "recordType": row.get("documentType") or payload.get("exportType"),
            "sourceScope": row.get("sourceScope"),
            "sourcePack": row.get("sourcePack"),
            "uuid": row.get("uuid"),
            "documentId": doc_id,
            "name": row.get("name") or doc.get("name"),
            "itemType": row.get("itemType") or row.get("actorType") or doc.get("type"),
            "folderPath": row.get("folderPath"),
            "payload": doc,
            "exportIndex": index,
        })
    return payload, records

def read_sources(root: Path) -> list[dict]:
    records = []
    for path in sorted(root.rglob("*.json")):
        if path.name.startswith(".") or path.name == "README.json":
            continue
        try:
            doc = load_json(path)
        except ValueError:
            continue
        if not isinstance(doc, dict) or not (doc.get("_id") or doc.get("id")):
            continue
        records.append({
            "sourcePath": path.relative_to(root).as_posix(),
            "documentId": doc.get("_id") or doc.get("id"),
            "name": doc.get("name"),
            "itemType": doc.get("type"),
            "payload": doc,
        })
    return records

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--inventory", required=True, type=Path, help="Export JSON Foundry sin editar")
    ap.add_argument("--source-root", required=True, type=Path, help="Raíz de fuentes versionadas")
    ap.add_argument("--out", required=True, type=Path, help="JSON de salida")
    ap.add_argument("--ignore-field", action="append", default=[], help="Campo raíz adicional ignorado sólo en comparación funcional")
    args = ap.parse_args()

    meta, exported = read_export(args.inventory)
    sources = read_sources(args.source_root)
    ignored = DEFAULT_IGNORED | set(args.ignore_field)
    export_by_id: dict[str, list[dict]] = defaultdict(list)
    source_by_id: dict[str, list[dict]] = defaultdict(list)
    source_by_name: dict[str, list[dict]] = defaultdict(list)
    for row in exported:
        if row["documentId"]:
            export_by_id[str(row["documentId"])].append(row)
    for row in sources:
        source_by_id[str(row["documentId"])].append(row)
        if row["name"]:
            source_by_name[norm_name(row["name"])].append(row)

    report = []
    matched_source_ids = set()
    for doc_id, export_rows in sorted(export_by_id.items()):
        candidates = source_by_id.get(doc_id, [])
        if not candidates:
            continue
        matched_source_ids.add(doc_id)
        for old in export_rows:
            for new in candidates:
                old_payload, new_payload = old["payload"], new["payload"]
                exact = digest(old_payload) == digest(new_payload)
                functional = digest(without_paths(old_payload, ignored)) == digest(without_paths(new_payload, ignored))
                if exact:
                    status = "IDENTICAL"
                elif functional:
                    status = "METADATA_ONLY"
                else:
                    status = "CONTENT_DIFFERENCE"
                report.append({
                    "status": status,
                    "documentId": doc_id,
                    "export": {k: old.get(k) for k in ("sourceScope", "sourcePack", "uuid", "name", "itemType", "folderPath", "exportIndex")},
                    "source": {k: new.get(k) for k in ("sourcePath", "name", "itemType")},
                    "exportSha256": digest(old_payload),
                    "sourceSha256": digest(new_payload),
                    "functionalSha256Export": digest(without_paths(old_payload, ignored)),
                    "functionalSha256Source": digest(without_paths(new_payload, ignored)),
                })

    name_candidates = []
    for old in exported:
        if not old.get("name") or str(old.get("documentId")) in matched_source_ids:
            continue
        candidates = source_by_name.get(norm_name(old["name"]), [])
        if candidates:
            name_candidates.append({
                "status": "NAME_ONLY_REVIEW_REQUIRED",
                "documentId": old.get("documentId"),
                "export": {k: old.get(k) for k in ("sourceScope", "sourcePack", "uuid", "name", "itemType", "folderPath", "exportIndex")},
                "sourceCandidates": [{k: x.get(k) for k in ("sourcePath", "documentId", "name", "itemType")} for x in candidates],
                "warning": "La coincidencia de nombre no acredita identidad ni equivalencia; no fusionar automáticamente."
            })

    source_only = [
        {"documentId": row["documentId"], "name": row["name"], "sourcePath": row["sourcePath"]}
        for row in sources if str(row["documentId"]) not in export_by_id
    ]
    export_only = [
        {"documentId": row["documentId"], "name": row["name"], "sourceScope": row["sourceScope"],
         "sourcePack": row["sourcePack"], "uuid": row["uuid"], "exportIndex": row["exportIndex"]}
        for row in exported if str(row["documentId"]) not in source_by_id
    ]

    counts = defaultdict(int)
    for row in report:
        counts[row["status"]] += 1
    duplicates = {
        "exportDocumentIds": {k: len(v) for k, v in export_by_id.items() if len(v) > 1},
        "sourceDocumentIds": {k: len(v) for k, v in source_by_id.items() if len(v) > 1},
    }
    result = {
        "schemaVersion": "1.0",
        "tool": "hiperaustralis-foundry-reconcile",
        "status": "RECONCILIATION_COMPLETE_REVIEW_REQUIRED",
        "input": {
            "inventory": str(args.inventory),
            "inventorySha256": hashlib.sha256(args.inventory.read_bytes()).hexdigest(),
            "exportType": meta.get("exportType"),
            "exportedAt": meta.get("exportedAt"),
            "sourceRoot": str(args.source_root),
            "exportRecords": len(exported),
            "sourceDocuments": len(sources),
            "ignoredRootFieldsForFunctionalComparison": sorted(ignored),
        },
        "summary": {
            "matchedPairs": len(report),
            "byStatus": dict(sorted(counts.items())),
            "nameOnlyCandidates": len(name_candidates),
            "exportOnlyRecords": len(export_only),
            "sourceOnlyDocuments": len(source_only),
            "duplicateIds": duplicates,
        },
        "idMatches": report,
        "nameOnlyCandidates": name_candidates,
        "exportOnly": export_only,
        "sourceOnly": source_only,
        "safety": [
            "Sólo lectura: no modifica exports ni fuentes.",
            "Los IDs repetidos se informan por ámbito y no se deduplican.",
            "Las coincidencias de nombre se reportan como candidatos, nunca como equivalencias.",
            "Los campos ignorados sólo se excluyen del hash funcional; el payload original permanece intacto.",
            "Los Items embebidos dentro de Actors no se extraen ni migran como documentos autónomos."
        ],
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": result["status"], "summary": result["summary"], "output": str(args.out)}, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
