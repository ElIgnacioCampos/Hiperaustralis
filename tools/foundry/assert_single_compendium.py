#!/usr/bin/env python3
"""CI137 guard: one existing prototype module, three existing packs; update only Objects.

This guard does not create packs, modules, images or manifests. It fails closed
on renamed/extra packs, a new module ID, obsolete QA6 generators and unsafe ZIPs.
"""
import argparse
import copy
import hashlib
import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODULE_ID = "hiperaustralis-compendios-prototype"
PACKS = {
    "ha-proto-items": ("packs/ha-proto-items", "Item", "HA · Prototipo · Objetos"),
    "ha-proto-actors": ("packs/ha-proto-actors", "Actor", "HA · Prototipo · Adversarios"),
    "ha-proto-journals": ("packs/ha-proto-journals", "JournalEntry", "HA · Prototipo · Journals"),
}
OBSOLETE_DUPLICATORS = (
    "tools/foundry/build_ci137_forge_qa6.py",
    "tools/foundry/ci137_forge_qa6_readonly.js",
    ".github/workflows/build-ci137-forge-hipera6.yml",
)


class Blocked(ValueError):
    pass


def check_manifest(obj):
    if not isinstance(obj, dict) or obj.get("id") != MODULE_ID:
        raise Blocked("Single module ID changed: only " + MODULE_ID + " permitted")
    packs = obj.get("packs")
    if not isinstance(packs, list) or len(packs) != 3:
        raise Blocked("Exactly 3 existing packs required; adding a fourth is forbidden")
    names = [p.get("name") for p in packs if isinstance(p, dict)]
    if len(names) != 3 or len(set(names)) != 3 or set(names) != set(PACKS):
        raise Blocked("Pack identities changed or duplicate Item compendium detected")
    for p in packs:
        path, typ, label = PACKS[p["name"]]
        if (p.get("path"), p.get("type"), p.get("label")) != (path, typ, label):
            raise Blocked("Pack path/type/label drift: " + p["name"])
    if sum(p.get("type") == "Item" for p in packs) != 1:
        raise Blocked("Exactly one Item compendium allowed")
    return obj


def check_repo():
    entries = list((ROOT / "module").rglob("module.json"))
    if len(entries) != 1 or entries[0] != ROOT / "module/module.json":
        raise Blocked("A second module.json exists under module/")
    for path in OBSOLETE_DUPLICATORS:
        if (ROOT / path).exists():
            raise Blocked("Obsolete duplicate-module generator remains: " + path)
    m = check_manifest(json.loads(entries[0].read_text(encoding="utf-8")))
    return {"moduleId": m["id"], "itemCompendium": MODULE_ID + ".ha-proto-items",
            "packs": [p["name"] for p in m["packs"]]}


def read_archive(path, require_no_remote_urls=True):
    with zipfile.ZipFile(path) as archive:
        bad = archive.testzip()
        if bad:
            raise Blocked("Bad ZIP CRC in " + bad)
        entries = [n for n in archive.namelist() if n.endswith("module.json") and not n.startswith("__MACOSX/")]
        if entries != ["module.json"]:
            raise Blocked("Module ZIP must contain exactly one module.json at its root")
        manifest = json.loads(archive.read("module.json"))
        check_manifest(manifest)
        # An old public URL would redirect to the 38-Item prototype.
        if require_no_remote_urls and (manifest.get("download") or manifest.get("manifest")):
            raise Blocked("QA ZIP must not reference a previously published remote download")
        members = {n: hashlib.sha256(archive.read(n)).hexdigest()
                   for n in archive.namelist() if not n.endswith("/")}
        pack_dirs = {n.split("/")[1] for n in members
                     if n.startswith("packs/") and len(n.split("/")) > 2}
        if pack_dirs != set(PACKS):
            raise Blocked("ZIP has extra or missing physical packs: " + repr(sorted(pack_dirs)))
    return members


def preserve_unchanged(base, candidate):
    # Baseline v0.1.5 is allowed to contain its original published URLs.
    # Only the new candidate must have no stale manifest/download URLs.
    a = read_archive(base, require_no_remote_urls=False)
    b = read_archive(candidate, require_no_remote_urls=True)
    for name in ("ha-proto-actors", "ha-proto-journals"):
        prefix = "packs/" + name + "/"
        left = {k:v for k,v in a.items() if k.startswith(prefix)}
        right = {k:v for k,v in b.items() if k.startswith(prefix)}
        if not left or left != right:
            raise Blocked("Pack " + name + " differs between baseline and updated module")
    return "Actor and Journal LevelDB files match baseline by SHA256"


def self_test():
    base = {
        "id": MODULE_ID,
        "packs": [{"name": n, "path": p, "type": t, "label": l}
                  for n, (p,t,l) in PACKS.items()]
    }
    check_manifest(base)
    failures = []
    for change in ("new-id", "fourth-pack", "duplicate-items", "rename-items", "delete-journals"):
        test = copy.deepcopy(base)
        if change == "new-id": test["id"] = "hiperaustralis-ci137-qa6"
        if change == "fourth-pack":
            test["packs"].append({"name":"ha-ci137-items", "type":"Item", "path":"packs/ha-ci137-items","label":"CI137"})
        if change == "duplicate-items":
            test["packs"][1]["name"] = "ha-proto-items"
        if change == "rename-items": test["packs"][0]["name"] = "ha-ci137-items"
        if change == "delete-journals": test["packs"].pop()
        try:
            check_manifest(test)
        except Blocked:
            failures.append(change)
        else:
            raise Blocked("Guard failed to reject unsafe mutation: " + change)
    if len(failures) != 5:
        raise Blocked("Incomplete negative tests")
    return failures


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--artifact", type=Path, help="Check a proposed module ZIP")
    parser.add_argument("--baseline", type=Path, help="Ensure existing Actor and Journal binaries are unchanged")
    args = parser.parse_args()
    if args.baseline and not args.artifact:
        raise Blocked("--baseline requires --artifact")
    result = {"status": "SINGLE_PROTOTYPE_3_PACKS_PASS", "repository": check_repo()}
    if args.self_test:
        result["rejectedUnsafeChanges"] = self_test()
    if args.artifact:
        result["artifactMembers"] = len(read_archive(args.artifact))
    if args.baseline:
        result["preserved"] = preserve_unchanged(args.baseline, args.artifact)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except (Blocked, OSError, ValueError, zipfile.BadZipFile) as err:
        sys.exit("BLOCKED_DUPLICATE_COMPENDIUM: " + str(err))
