#!/usr/bin/env python3
"""CI137 Foundry V14 document-ID preflight: fail on any invalid runtime ID.

Only transport documents are checked. Canonical historical source files are untouched.
"""
import argparse
import json
import re
from pathlib import Path

VALID = re.compile(r"^[A-Za-z0-9]{16}$")
OLD_ITEM_ID = "TokicuraRel0001"
NEW_ITEM_ID = "TokicuraRel00010"
MODULE_ID = "hiperaustralis-compendios-prototype"


def gate(test, reason):
    if not test:
        raise ValueError("CI137_V14_ID_VALIDATION_FAILED: " + reason)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def good(value):
    return isinstance(value, str) and VALID.fullmatch(value) is not None


def check(prepared, metadata):
    pre = load(prepared / "ci137-preflight.json")
    folders = {}
    items = {}
    allfiles = sorted((prepared / "items").rglob("*.json"))
    for path in allfiles:
        obj = load(path)
        ident = obj.get("_id")
        gate(good(ident), f"invalid _id in {path}: {ident!r}")
        keykind = "folders" if path.name == "_Folder.json" else "items"
        gate(obj.get("_key") == f"!{keykind}!{ident}", f"wrong _key in {path}")
        store = folders if keykind == "folders" else items
        gate(ident not in store, f"duplicate {keykind} id {ident}")
        store[ident] = obj
    gate(len(folders) == 9, "expected 9 runtime folders")
    gate(len(items) == 136, "expected 136 Items")
    for fid, folder in folders.items():
        parent = folder.get("folder")
        gate(parent is None or (good(parent) and parent in folders),
             f"invalid parent folder reference {fid} -> {parent}")
        gate(folder.get("type") == "Item", "folder type drift")
    for iid, item in items.items():
        parent = item.get("folder")
        gate(good(parent) and parent in folders,
             f"invalid Item folder field {iid} -> {parent}")
    gate(OLD_ITEM_ID not in items and NEW_ITEM_ID in items, "Tokicura must have one valid runtime ID")
    flags = items[NEW_ITEM_ID].get("flags", {}).get(MODULE_ID, {})
    gate(flags.get("historicalSourceId") == OLD_ITEM_ID, "Tokicura historical ID provenance missing")
    source_crosswalk = pre.get("itemTransportIdCrosswalk")
    folder_crosswalk = pre.get("folderIdCrosswalk")
    gate(source_crosswalk == {OLD_ITEM_ID: NEW_ITEM_ID}, "unexpected historical Item ID mapping")
    gate(len(folder_crosswalk or {}) == 9
         and set(folder_crosswalk.values()) == set(folders), "folder ID crosswalk mismatch")
    gate(sum(r["id"] != r["historicalSourceId"] for r in pre["records"]) == 1,
         "exactly one runtime Item ID differs from historical source")
    gate({r["id"] for r in pre["records"]} == set(items), "preflight Item ID set mismatch")
    gate(any(r["historicalSourceId"] == OLD_ITEM_ID and r["id"] == NEW_ITEM_ID
             for r in pre["records"]), "Tokicura manifest alias missing")
    gate(all(good(r["id"]) for r in pre["records"]), "preflight includes invalid runtime ID")

    actor_paths = sorted((metadata / "actors").glob("*.json"))
    journal_paths = sorted((metadata / "journals").glob("*.json"))
    gate(len(actor_paths) == len(journal_paths) == 1, "Actor/Journal cardinality")
    actor = load(actor_paths[0])
    journal = load(journal_paths[0])
    gate(good(actor.get("_id")), "invalid actor _id")
    gate(good(journal.get("_id")), "invalid journal _id")
    for name, document in (("Actor", actor), ("Journal", journal)):
        parent = document.get("folder")
        gate(parent in (None, "") or good(parent), f"invalid {name} folder reference")
    pages = journal.get("pages", [])
    gate(len(pages) == 21, "journal page count drift")
    page_ids = [p.get("_id") for p in pages]
    gate(all(good(x) for x in page_ids) and len(set(page_ids)) == 21, "journal page ID validation")
    for p in pages:
        gate(p.get("_key") == "!journal.pages!" + journal["_id"] + "." + p["_id"],
             "journal page database key mismatch")
    for nested in actor.get("items", []) + actor.get("effects", []):
        gate(good(nested.get("_id")), "invalid Actor embedded document ID")
    report = {"result": "PASS_STATIC_V14_370_DOCUMENT_IDS", "items": 136, "folders": 9,
              "actors": 1, "journals": 1, "journalPages": 21,
              "itemSourceIdAlias": source_crosswalk, "folderIdAliases": folder_crosswalk,
              "allRuntimeIdsAre16CharAlphanumeric": True,
              "sourceFilesModified": False, "runtimeD3": False}
    print(json.dumps(report, ensure_ascii=False))
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prepared", type=Path, required=True)
    parser.add_argument("--metadata", type=Path, required=True)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    report = check(args.prepared, args.metadata)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
