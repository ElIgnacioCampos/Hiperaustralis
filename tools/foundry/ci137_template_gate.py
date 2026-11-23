#!/usr/bin/env python3
"""CI137: read-only static check of 136 Items against the five archived CSB templates.

The fixtures are user-exported documents, not a runtime installation. Passing
this check NEVER certifies that Foundry loads, hydrates or saves an Item sheet.
"""
import argparse
from collections import Counter
import json
from pathlib import Path
import sys

TEMPLATES = {
    "HipArmaTpl000001": "fvtt-Item-_hiperaustralis-arma-HipArmaTpl000001.json",
    "HipEquipTpl00001": "fvtt-Item-_hiperaustralis-equipo-HipEquipTpl00001.json",
    "HipInstrTpl00001": "fvtt-Item-_hiperaustralis-instrumento-HipInstrTpl00001.json",
    "HipRelqTpl000001": "fvtt-Item-_hiperaustralis-reliquia-HipRelqTpl000001.json",
    "HipRitualTpl0001": "fvtt-Item-_hiperaustralis-ritual-HipRitualTpl0001.json",
}


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def check(repo, prepared):
    fixtures, problems = {}, []
    for tid, filename in TEMPLATES.items():
        path = repo / "source-original/foundry-templates" / filename
        template = read(path)
        body = template.get("system", {}).get("body", {})
        fields = [x["key"] for x in body.get("contents", []) if "key" in x]
        if (template.get("_id") != tid or template.get("type") != "_equippableItemTemplate"
            or template.get("system", {}).get("uniqueId") != tid
            or not isinstance(template.get("system", {}).get("templateSystemUniqueVersion"), int)
            or len(fields) != len(set(fields))):
            problems.append({"template": tid, "problem": "fixture_identity_or_fields_invalid"})
        fixtures[tid] = {"version": template["system"]["templateSystemUniqueVersion"],
                         "keys": fields, "csbFlag": template.get("flags", {}).get("custom-system-builder", {}).get("version")}

    paths = sorted(p for p in (prepared / "items").rglob("*.json") if p.name != "_Folder.json")
    assigned, flag_versions, missing_fields, ids = Counter(), Counter(), [], set()
    for path in paths:
        doc = read(path)
        ident = doc.get("_id")
        if not ident or ident in ids:
            problems.append({"file": str(path), "problem": "missing_or_duplicate_item_id"})
        ids.add(ident)
        if doc.get("type") != "equippableItem":
            problems.append({"id": ident, "problem": "unexpected_item_type", "actual": doc.get("type")})
        system = doc.get("system", {})
        tid = system.get("template")
        if tid not in fixtures:
            problems.append({"id": ident, "problem": "unresolved_csb_template", "actual": tid})
            continue
        assigned[tid] += 1
        required_version = fixtures[tid]["version"]
        if system.get("templateSystemUniqueVersion") != required_version:
            problems.append({"id": ident, "problem": "template_revision_differs",
                             "actual": system.get("templateSystemUniqueVersion"),
                             "expected": required_version})
        props = system.get("props", {})
        if not isinstance(props, dict):
            problems.append({"id": ident, "problem": "invalid_props"})
            continue
        absent = sorted(set(fixtures[tid]["keys"]) - set(props))
        if absent:
            # Editable fields can have defaults; retain report without rewriting source.
            missing_fields.append({"id": ident, "template": tid, "missing": absent})
        flag = doc.get("flags", {}).get("custom-system-builder", {}).get("version")
        flag_versions[str(flag) if flag is not None else "not_declared"] += 1

    if len(paths) != 136 or len(ids) != 136:
        problems.append({"problem": "wrong_corpus_count", "files": len(paths), "ids": len(ids)})
    if set(assigned) != set(fixtures):
        problems.append({"problem": "not_all_five_templates_used", "actual": sorted(assigned)})
    report = {
        "schema": "ci137-csb-static-gate-v01",
        "status": "PASS_STATIC_REFERENCES_NOT_RUNTIME" if not problems else "BLOCKED_STATIC_TEMPLATE_MISMATCH",
        "items": len(paths),
        "templateFixtures": {k: fixtures[k] for k in sorted(fixtures)},
        "itemsPerTemplate": dict(sorted(assigned.items())),
        "sourceCsbFlagVersions": dict(sorted(flag_versions.items())),
        "optionalTemplateFieldsAbsent": missing_fields,
        "problems": problems,
        "runtimeClientTest": "NOT_EXECUTED",
        "releaseAuthorized": False,
    }
    dest = prepared / "ci137-template-compatibility.json"
    dest.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": report["status"], "items": len(paths),
                      "templates": dict(sorted(assigned.items())),
                      "optionalFieldWarnings": len(missing_fields),
                      "csbFlags": dict(sorted(flag_versions.items())),
                      "problems": len(problems)}, ensure_ascii=False))
    return not problems


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--repo", required=True, type=Path)
    p.add_argument("--prepared", required=True, type=Path)
    args = p.parse_args()
    try:
        ok = check(args.repo, args.prepared)
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(json.dumps({"status": "BLOCKED", "error": str(exc)}, ensure_ascii=False))
        return 2
    return 0 if ok else 2


if __name__ == "__main__":
    sys.exit(main())
