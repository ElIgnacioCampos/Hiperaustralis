#!/usr/bin/env python3
"""CI137: prepare/verify exactly 136 selected Items without editing source or runtime.

The only authority for selection is manifests/ci137-selected-source-137-historical-ids.json.
Outputs are temporary Foundry CLI transport. No asset replacement, UUID rewriting,
Forge deployment, or change to prototype packs.
"""
import argparse
import copy
import hashlib
import json
import re
import zipfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "manifests/ci137-selected-source-137-historical-ids.json"
# Foundry V14 requires EXACTLY 16 alphanumeric characters for all Document IDs.
# The previous transport used nine 14/15-char folder IDs: server rejected them.
# These replacements are isolated CI transport IDs; source/canon is not edited.
FOLDERS = {
    "Armas": ("HAObjArmas000100", None),
    "Defensas": ("HAObjDefensa0010", None),
    "Equipo común": ("HAObjEquipo00010", None),
    "Instrumentos musicales": ("HAObjInstrum0010", None),
    "Parafernalia": ("HAObjParafer0010", None),
    "Rituales": ("HAObjRitual00010", None),
    "Reliquias": ("HAObjReliq000100", None),
    "Reliquias/Cotidianas": ("HAObjRelCot00100", "HAObjReliq000100"),
    "Reliquias/Legendarias": ("HAObjRelLeg00100", "HAObjReliq000100"),
}
FOLDER_ID_CROSSWALK = {
    "HAObjArmas0001": "HAObjArmas000100",
    "HAObjDefensa001": "HAObjDefensa0010",
    "HAObjEquipo0001": "HAObjEquipo00010",
    "HAObjInstrum001": "HAObjInstrum0010",
    "HAObjParafer001": "HAObjParafer0010",
    "HAObjRitual0001": "HAObjRitual00010",
    "HAObjReliq0001": "HAObjReliq000100",
    "HAObjRelCot001": "HAObjRelCot00100",
    "HAObjRelLeg001": "HAObjRelLeg00100",
}
# Original Tokicura ID is 15 characters. Preserve original in source and
# an explicit provenance flag; use a valid 16-char ID only in CI transport.
ITEM_ID_CROSSWALK = {"TokicuraRel0001": "TokicuraRel00010"}
PACKAGE_ID = "hiperaustralis-compendios-prototype"


def valid_foundry_id(value):
    return isinstance(value, str) and re.fullmatch(r"[A-Za-z0-9]{16}", value) is not None

FAMILY_FOLDER = {
    "Armas": "Armas",
    "Defensas": "Defensas",
    "Equipo común": "Equipo común",
    "Instrumentos musicales": "Instrumentos musicales",
    "Parafernalia · sanación · cultura material": "Parafernalia",
    "Rituales": "Rituales",
    "Reliquias cotidianas": "Reliquias/Cotidianas",
    "Reliquias legendarias": "Reliquias/Legendarias",
    "Reliquias": "Reliquias/Legendarias",  # Tokicura; parent folder also generated.
}
EXPECTED_FAMILY_COUNTS = {
    "Armas": 20, "Defensas": 8, "Equipo común": 40,
    "Instrumentos musicales": 21,
    "Parafernalia · sanación · cultura material": 22,
    "Rituales": 8, "Reliquias cotidianas": 8,
    "Reliquias legendarias": 8, "Reliquias": 1,
}
TEMPLATE_IDS = {
    "HipArmaTpl000001", "HipEquipTpl00001", "HipInstrTpl00001",
    "HipRelqTpl000001", "HipRitualTpl0001",
}
PRESERVED_FIELDS = ("name", "type", "img", "system", "effects", "flags", "ownership")
SHARED_KNIFE_IDS = {"c2L6T5w4S9OcgkDt"}
EXCLUDED_PROTOTYPE_KNIFE_ID = "HipArm01PackA000"
EXCLUDED_PROTOTYPE_KNIFE_SOURCE = "source/items/01_cuchillo_piedra.json"
SHARED_KNIFE_MEMBER = "assets/armas/01_cuchillo_litico.webp"
SHARED_KNIFE_URL = "modules/hiperaustralis-compendios-prototype/" + SHARED_KNIFE_MEMBER
SHARED_KNIFE_SHA256 = "7ff631440c2a74d7ca25014ceb1c38024b14d3ebdb2f73a9bcc0be98ba7a8082"
SHARED_KNIFE_STAGE = "source-original/ci137-asset-staging/ci137_v02_historico/armas/01_cuchillo_litico.webp"



def fail(message):
    raise ValueError("CI137_BLOCKED: " + message)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(data):
    return hashlib.sha256(data).hexdigest()


def validate_selection():
    m = read_json(MANIFEST)
    rows = m.get("entries", [])
    if m.get("targetCount") != 136 or len(rows) != 136:
        fail("expected 136 selected sources")
    ids = [r.get("id") for r in rows]
    paths = [r.get("source") for r in rows]
    if any(not isinstance(x, str) or not x for x in ids):
        fail("missing/invalid Item ID")
    if len(ids) != len(set(ids)) or len(paths) != len(set(paths)):
        fail("duplicate ID or source path")
    if EXCLUDED_PROTOTYPE_KNIFE_ID in ids or SHARED_KNIFE_IDS.difference(ids):
        fail("editorial duplicate selected or historical knife missing")
    # One editorial name, on the retained historical identity; source names stay unchanged.
    name_overrides = [r for r in rows if "editorialName" in r]
    if (len(name_overrides) != 1
            or name_overrides[0]["id"] != "c2L6T5w4S9OcgkDt"
            or name_overrides[0]["editorialName"] != "Cuchillo de piedra"
            or name_overrides[0].get("sourceName") != "Cuchillo lítico"):
        fail("unexpected editorial Item name override")
    if Counter(r.get("family") for r in rows) != EXPECTED_FAMILY_COUNTS:
        fail("unexpected family counts")
    if len(set(v[0] for v in FOLDERS.values())) != 9:
        fail("duplicate folder IDs")
    all_folder_ids = {v[0] for v in FOLDERS.values()}
    if len(FOLDER_ID_CROSSWALK) != 9 or set(FOLDER_ID_CROSSWALK.values()) != all_folder_ids:
        fail("unapproved folder ID transport mapping")
    if any(not valid_foundry_id(x) for x in all_folder_ids):
        fail("invalid 16-char folder ID")
    if any(parent is not None and parent not in all_folder_ids for _, parent in FOLDERS.values()):
        fail("invalid folder ancestry")
    invalid_historical_ids = {x for x in ids if not valid_foundry_id(x)}
    if invalid_historical_ids != set(ITEM_ID_CROSSWALK):
        fail("new or missing invalid historical Item ID: " + repr(invalid_historical_ids))
    runtime_ids = [ITEM_ID_CROSSWALK.get(x, x) for x in ids]
    if (len(set(runtime_ids)) != 136 or
            any(not valid_foundry_id(x) for x in runtime_ids) or
            ITEM_ID_CROSSWALK != {"TokicuraRel0001": "TokicuraRel00010"}):
        fail("runtime ID mapping is not exactly one protected Tokicura alias")
    relics = [r for r in rows if r["family"].startswith("Reliquias ")]
    if len(relics) != 16 or len([r for r in relics if r.get("prototypeAlias") and r.get("oldUuid")]) != 16:
        fail("historical relic identity mapping incomplete")
    if not all(r["source"].startswith("source-pending/ci137-reliquias-historicas-16/")
               for r in relics):
        fail("prototype relic source illegally selected")
    if set(r["id"] for r in rows if r["source"].startswith("source-pending/")) != (
            set(r["id"] for r in rows if r["family"] not in ("Armas", "Reliquias"))):
        fail("historical pending source scope inconsistent")
    return rows


def item_data(rows):
    fixtures = {}
    for path in (ROOT / "source-original/foundry-templates").glob("fvtt-Item-*.json"):
        doc = read_json(path)
        key = doc["system"].get("uniqueId") or doc["_id"]
        fixtures[key] = doc["system"].get("templateSystemUniqueVersion")
    missing_templates = TEMPLATE_IDS.difference(fixtures)
    if missing_templates:
        fail("missing CSB template fixtures: " + repr(sorted(missing_templates)))
    found_templates = set()
    for row in rows:
        rel = Path(row["source"])
        if rel.is_absolute() or ".." in rel.parts or rel.suffix != ".json":
            fail("unsafe source path " + str(rel))
        if not (rel.parts[:2] == ("source", "items") or
                rel.parts[:2] == ("source-pending", "ci137-historicos-99") or
                rel.parts[:2] == ("source-pending", "ci137-reliquias-historicas-16")):
            fail("source outside approved roots " + str(rel))
        path = ROOT / rel
        if not path.is_file():
            fail("missing selected source: " + str(rel))
        raw = path.read_bytes()
        doc = json.loads(raw)
        if doc.get("_id") != row["id"] or doc.get("type") != "equippableItem":
            fail("identity/type mismatch " + str(rel))
        system = doc.get("system", {})
        tid = system.get("template")
        if tid not in TEMPLATE_IDS:
            fail("unknown selected template " + str(tid) + " in " + str(rel))
        if system.get("templateSystemUniqueVersion") != fixtures[tid]:
            fail("CSB template version mismatch in " + str(rel))
        if not isinstance(system.get("props"), dict):
            fail("missing props in " + str(rel))
        found_templates.add(tid)
        yield row, doc, digest(raw), FAMILY_FOLDER[row["family"]]
    if found_templates != TEMPLATE_IDS:
        fail("not all five templates used: " + repr(sorted(found_templates)))



def verified_relic_remaps(output):
    """Restore existing approved WebP bytes and map 16 exact historical identities.

    Not a matching-by-name operation: the historical and approved manifest must
    agree by prototype alias and original source img, then by source WebP SHA.
    """
    rel_manifest = read_json(ROOT / "source-pending/ci137-reliquias-historicas-16/manifest.json")
    approved = read_json(ROOT / "manifests/reliquias-assets.json")
    source_records = rel_manifest["sourceRecords"]
    source_assets = approved["records"]
    if len(source_records) != 16 or len(source_assets) != 16:
        fail("expected 16 historical relics and 16 approved relic assets")
    by_alias = {x["itemId"]: x for x in source_assets}
    if len(by_alias) != 16:
        fail("duplicate prototype relic alias in approved assets")
    maps, members = {}, {}
    for record in source_records:
        item_id = record["historicalId"]
        alias = record["prototypeId"]
        asset = by_alias.get(alias)
        if not asset or asset["sourceImg"] != record["originalImage"]:
            fail("relic crosswalk disagrees on identity and original image: " + item_id)
        group = asset["group"]
        if group not in ("cotidianas", "legendarias"):
            fail("invalid approved relic group: " + group)
        member = group + "/" + Path(record["originalImage"]).name
        new = ("modules/hiperaustralis-compendios-prototype/assets/reliquias/" + member)
        if item_id in maps or member in members:
            fail("relic asset collision: " + item_id)
        members[member] = asset["sha256"]
        maps[item_id] = {"old": record["originalImage"], "new": new,
                         "sha256": asset["sha256"], "member": member}
    zippath = ROOT / "source-original/HIPERAUSTRALIS_RELIQUIAS_ASSETS_16_WEBP_v01.zip"
    with zipfile.ZipFile(zippath) as archive:
        names = set(n for n in archive.namelist() if n.lower().endswith(".webp"))
        if names != set(members):
            fail("approved 16 WebP ZIP contents differ from manifest")
        for member, sha in members.items():
            raw = archive.read(member)
            if digest(raw) != sha:
                fail("approved relic asset SHA mismatch: " + member)
            dest = output / "assets/reliquias" / member
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(raw)
    return maps



def verified_shared_knife(rows, output):
    """Keep the single approved WebP for the retained historical knife; source JSON intact."""
    selected = {r["id"]: r for r in rows if r["id"] in SHARED_KNIFE_IDS}
    if set(selected) != SHARED_KNIFE_IDS or EXCLUDED_PROTOTYPE_KNIFE_ID in {r["id"] for r in rows}:
        fail("selected historical knife and excluded prototype duplicate mismatch")
    original = ROOT / SHARED_KNIFE_STAGE
    final = ROOT / "module" / SHARED_KNIFE_MEMBER
    if not original.is_file() or not final.is_file():
        fail("approved knife image is missing from staging or module assets")
    data = final.read_bytes()
    if original.read_bytes() != data or digest(data) != SHARED_KNIFE_SHA256:
        fail("approved historical knife image differs from original SHA")
    item_id = "c2L6T5w4S9OcgkDt"
    row = selected[item_id]
    source = read_json(ROOT / row["source"])
    duplicate = read_json(ROOT / EXCLUDED_PROTOTYPE_KNIFE_SOURCE)
    old = "modules/hiperaustralis-rituales/assets/armas/01_cuchillo_litico.webp"
    entry = row.get("sharedKnifeImage", {})
    bg = source.get("flags", {}).get("hiperaustralis-sheet", {}).get("background")
    if (entry.get("approvedForTransport") is not True
            or entry.get("originalPath") != old
            or entry.get("sharedTarget") != SHARED_KNIFE_URL
            or entry.get("sha256") != SHARED_KNIFE_SHA256
            or entry.get("sourceAsset") != SHARED_KNIFE_STAGE
            or source.get("_id") != item_id or source.get("img") != old or bg != old):
        fail("unapproved historical knife image mapping")
    if (duplicate.get("_id") != EXCLUDED_PROTOTYPE_KNIFE_ID
            or source["system"]["props"]["descripcion"] != duplicate["system"]["props"]["descripcion"]):
        fail("duplicate source identity or original editorial equivalence changed")
    dest = output / SHARED_KNIFE_MEMBER
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return {item_id: {"old": old, "new": SHARED_KNIFE_URL, "sha256": SHARED_KNIFE_SHA256}}

def verified_additional_approved_asset_remaps(rows, output):
    """Transport only exact, individually approved final images; source JSON stays immutable.

    A recovered historic image is NOT approval. No default remapping and no
    transformation, scaling, or new illustration is permitted here.
    """
    mapped = {}
    destinations = set()
    for row in rows:
        approved = row.get("approvedAssetTransport")
        if approved is None:
            continue
        item_id = row["id"]
        if (item_id in SHARED_KNIFE_IDS or row["family"].startswith("Reliquias")
                or row.get("archivedImage") is None):
            fail("asset approval applied outside unresolved historical Item scope " + item_id)
        if (approved.get("status") != "FINAL_ART_APPROVED_FOR_CI137"
                or approved.get("visualIdentityApproved") is not True
                or approved.get("approvedForTransport") is not True
                or not isinstance(approved.get("approvalReference"), str)
                or not approved["approvalReference"].strip()):
            fail("Item image lacks explicit final identity and transport approval " + item_id)
        source = read_json(ROOT / row["source"])
        original = row["archivedImage"]["originalPath"]
        if (approved.get("originalImg") != original
                or source.get("img") != original):
            fail("approved final image not tied to original Item identity " + item_id)
        staged = approved.get("sourcePath")
        member = approved.get("targetMember")
        sha = approved.get("sha256")
        if (not isinstance(staged, str) or
                not staged.startswith("source-original/ci137-asset-staging/") or
                not isinstance(member, str) or
                not member.startswith("assets/") or
                not isinstance(sha, str) or len(sha) != 64):
            fail("invalid approved final image source, target or hash " + item_id)
        source_rel = Path(staged)
        member_rel = Path(member)
        if (".." in source_rel.parts or ".." in member_rel.parts
                or len(member_rel.parts) != 3 or member_rel.parts[1] == "_staging"
                or source_rel.suffix.lower() != ".webp"
                or member_rel.suffix.lower() != ".webp"
                or str(member_rel) in destinations):
            fail("unsafe or duplicate approved artwork target " + item_id)
        if member_rel.parts[1] not in ("armas", "defensas", "instrumentos", "iconos_aprobados", "rituales"):
            fail("unexpected final art family directory " + item_id)
        destinations.add(str(member_rel))
        binary = ROOT / source_rel
        if not binary.is_file():
            fail("approved image not present in verified GitHub staging " + item_id)
        raw = binary.read_bytes()
        if (digest(raw) != sha or raw[:4] != b"RIFF"
                or raw[8:12] != b"WEBP"
                or int.from_bytes(raw[4:8], "little") + 8 != len(raw)):
            fail("approved final image bytes differ from SHA/RIFF " + item_id)
        destination = output / member_rel
        if destination.exists():
            fail("refusing overwrite of an existing approved graphic " + str(member_rel))
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(raw)
        bg = source.get("flags", {}).get("hiperaustralis-sheet", {}).get("background")
        if bg is not None and bg != original:
            fail("Item background does not match the original image " + item_id)
        if bool(approved.get("updateBackground")) != (bg == original):
            fail("Item background mapping approval does not match original " + item_id)
        mapped[item_id] = {"old": original,
                           "new": "modules/hiperaustralis-compendios-prototype/" + member,
                           "sha256": sha, "member": member,
                           "background": bg == original,
                           "approvalReference": approved["approvalReference"]}
    return mapped


def verify_historical_staging(rows):
    """Audit 79 already recovered historical WebP files, without authorizing art promotion.

    Historical source images in the original module are archival CANDIDATES, not
    approved replacements. A SHA match proves bytes, not visual/editorial approval.
    """
    stage_root = ROOT / "source-original/ci137-asset-staging/ci137_v02_historico"
    records = []
    unique_paths = set()
    original_paths = set()
    for row in rows:
        candidate = row.get("archivedImage")
        if candidate is None:
            continue
        if row["family"] not in ("Armas", "Defensas", "Instrumentos musicales",
                                  "Parafernalia · sanación · cultura material", "Rituales"):
            fail("unexpected staged archive family for " + row["id"])
        if (candidate.get("finalArtApprovedForCI137") is not False
                or candidate.get("status") != "PHYSICALLY_RECOVERED_0472_0473_HISTORICAL_CANDIDATE_NOT_FINAL"):
            fail("historical candidate wrongly marked approved or changed: " + row["id"])
        old = candidate.get("originalPath")
        prefix = "modules/hiperaustralis-rituales/assets/"
        if not isinstance(old, str) or not old.startswith(prefix):
            fail("historical asset has unexpected original path " + row["id"])
        rel = Path(old[len(prefix):])
        if rel.is_absolute() or ".." in rel.parts or rel.suffix.lower() != ".webp":
            fail("invalid historical archive asset path " + row["id"])
        staged = stage_root / rel
        if not staged.is_file():
            fail("missing historical staging WebP " + str(staged))
        if rel.as_posix() in unique_paths or old in original_paths:
            fail("historical staging filename collision " + str(rel))
        unique_paths.add(rel.as_posix())
        original_paths.add(old)
        raw = staged.read_bytes()
        if len(raw) < 16 or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
            fail("invalid or incomplete historical WebP header " + str(rel))
        if int.from_bytes(raw[4:8], "little") + 8 != len(raw):
            fail("invalid historical WebP RIFF byte count " + str(rel))
        sha = digest(raw)
        expected_sha = candidate.get("sha256")
        if expected_sha is not None and (not isinstance(expected_sha, str)
                                          or len(expected_sha) != 64 or sha != expected_sha):
            fail("historical 0472/0473 SHA mismatch " + str(rel))
        records.append({
            "id": row["id"], "family": row["family"],
            "legacyPath": old,
            "stagedPath": "source-original/ci137-asset-staging/ci137_v02_historico/" + rel.as_posix(),
            "sha256": sha, "shaMatchedArchivalManifest": expected_sha is not None,
            "bytes": len(raw), "promotionAuthorized": False,
        })
    if (len(records) != 79 or len(unique_paths) != 79
            or len([r for r in records if r["shaMatchedArchivalManifest"]]) != 30):
        fail("historical staging expected 79 exact files, including 30 manifest SHA matches")
    if not any(r["id"] == "c2L6T5w4S9OcgkDt" for r in records):
        fail("historical knife staging record missing")
    return records


def verify_defensas_instrumentos_crosswalk(rows):
    """Verify six seed-approved ERH transport Items, eleven named candidates and eight COM bytes."""
    selected = [r for r in rows if r["family"] in ("Defensas", "Instrumentos musicales")]
    if len(selected) != 29:
        fail("Defensas/Instrumentos Item count changed")
    counts = Counter()
    unique_paths = set()
    candidate_ids = set()
    approved_seeds = {
        "K7d2oqF6P7DB0Kpt": "inst-01-kultrung",
        "IG8DW7Wr30mg1jqx": "inst-02-pifullka",
        "gp4b3XE6mJGvqE9X": "inst-03-waza",
        "KpK5mqDdleRnemjh": "inst-13-piloilo",
        "vr5gUbTNMU8tj3zL": "inst-14-kaskawilla",
        "JZUzx0bNMoDj6xs5": "inst-16-pututu",
    }
    approved_ids = set()
    approval_manifest = read_json(ROOT / "manifests/ci137-erh-cuatro-ambiguedades-aprobacion-20261124.json")
    if (approval_manifest.get("decision") != "La 2da opcion cada vez"
            or approval_manifest.get("invariants", {}).get("visualApprovedCount") != 4
            or approval_manifest.get("invariants", {}).get("additionalApprovedRuntimeTransportCount") != 0):
        fail("missing explicit 4-ERH visual-only source approval")
    selected_visual = {x["id"]: x for x in approval_manifest.get("selectedRows", [])}
    if len(selected_visual) != 4 or set(selected_visual) != {
            "j7J6wcAttET8rJpB", "RzhInApxuwq1o651",
            "INdG4JndLBl0sWto", "YfFAFtBpsdyU2l9R"}:
        fail("visual approval must be exactly the four shown historical Instrument IDs")
    visual_ids = set()
    for row in selected:
        entry = row.get("editorialCrosswalk", {})
        status = entry.get("status")
        approved_status = status == "APPROVED_ERH_SEED_RECONCILED_ISOLATED"
        if approved_status:
            if (row["id"] not in approved_seeds
                    or entry.get("scope") != "D2_APPROVED_VISUAL_SOURCE_ISOLATED_TRANSPORT_NO_DEPLOY"
                    or entry.get("visualIdentityVerified") is not True
                    or entry.get("approvedForTransport") is not True):
                fail("ERH approval not tied to one of six confirmed identities " + row["id"])
        elif status == "VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECHNICAL_QA":
            if (row["family"] != "Instrumentos musicales"
                    or row["id"] not in selected_visual
                    or entry.get("scope") != "EXPLICIT_AUTHOR_APPROVAL_VISUAL_ONLY_NO_RUNTIME_TRANSPORT"
                    or entry.get("visualIdentityVerified") is not True
                    or entry.get("approvedForTransport") is not False
                    or row.get("approvedAssetTransport")):
                fail("author-chosen 4 ERH images wrongly promoted to runtime " + row["id"])
        elif (entry.get("scope") != "D2_IDENTITY_TRIAGE_NO_IMAGE_PROMOTION"
                or entry.get("visualIdentityVerified") is not False
                or entry.get("approvedForTransport") is not False
                or row.get("approvedAssetTransport")):
            fail("unapproved graphics identity promoted: " + row["id"])
        original = read_json(ROOT / row["source"])
        if original.get("_id") != row["id"] or original.get("img") != row["archivedImage"]["originalPath"]:
            fail("source Item or image changed during identity audit " + row["id"])
        if status in ("ONE_TO_ONE_EDITORIAL_NAME_CANDIDATE", "APPROVED_ERH_SEED_RECONCILED_ISOLATED"):
            if row["family"] != "Instrumentos musicales":
                fail("only distinctive musical-name candidates are in scope")
            staged_path = entry.get("candidateStagedPath")
            prefix = "source-original/ci137-asset-staging/instrumentos-erh/webp_256/"
            if (not isinstance(staged_path, str) or not staged_path.startswith(prefix)
                    or ".." in Path(staged_path).parts or Path(staged_path).suffix.lower() != ".webp"):
                fail("invalid musical candidate staged path " + row["id"])
            target = ROOT / staged_path
            if not target.is_file() or staged_path in unique_paths:
                fail("missing/duplicated ERH named candidate " + row["id"])
            unique_paths.add(staged_path)
            raw = target.read_bytes()
            git_sha1 = hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()
            if (git_sha1 != entry.get("expectedGitBlobSha1")
                    or len(raw) != entry.get("expectedBytes")
                    or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP"
                    or int.from_bytes(raw[4:8], "little") + 8 != len(raw)):
                fail("candidate musical graphic differs from registered Git blob " + row["id"])
            candidate_ids.add(row["id"])
            if approved_status:
                decision = row.get("approvedAssetTransport", {})
                seed = original.get("flags", {}).get("hiperaustralis-instrumentos", {}).get("seedId")
                if (seed != approved_seeds[row["id"]]
                        or entry.get("historicalSeedId") != seed
                        or decision.get("historicalSeedId") != seed
                        or decision.get("isolatedD2Only") is not True
                        or decision.get("sourcePath") != staged_path
                        or decision.get("targetMember") != "assets/instrumentos/" + Path(staged_path).name
                        or decision.get("sha256") != digest(raw)
                        or entry.get("sha256") != digest(raw)):
                    fail("ERH visual approval missing exact seed, path or SHA256 " + row["id"])
                approved_ids.add(row["id"])
        elif status == "VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECHNICAL_QA":
            choice = selected_visual[row["id"]]
            staged_path = choice["source"]
            if (entry.get("approvedCandidateStagedPath") != staged_path
                    or entry.get("approvedCandidateSHA256") != choice["sha256"]
                    or entry.get("approvedCandidateBytes") != choice["bytes"]
                    or entry.get("approvalManifest") != "manifests/ci137-erh-cuatro-ambiguedades-aprobacion-20261124.json"
                    or entry.get("authorChoice") != "SECOND_ERH_FOR_EACH_2026_11_24"
                    or entry.get("transportStatus") != choice["technicalStatus"]
                    or entry.get("historicalAssetPreserved") is not True
                    or staged_path not in entry.get("relatedStagedPaths", [])
                    or choice.get("approvedChoice") != 2
                    or choice.get("visualApproval") != "EXPLICIT_USER_APPROVAL_OF_THIS_EXACT_ERH_BINARY"
                    or choice.get("notDeployed") is not True):
                fail("author-approved second image correspondence drift " + row["id"])
            target = ROOT / staged_path
            if (".." in Path(staged_path).parts
                    or not staged_path.startswith("source-original/ci137-asset-staging/instrumentos-erh/webp_256/")
                    or not target.is_file()):
                fail("missing exact user-selected ERH art " + row["id"])
            raw = target.read_bytes()
            if (digest(raw) != choice["sha256"] or len(raw) != choice["bytes"]
                    or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP"
                    or int.from_bytes(raw[4:8], "little") + 8 != len(raw)):
                fail("approved ERH image bytes no longer match displayed option 2 " + row["id"])
            visual_ids.add(row["id"])
        elif status == "AMBIGUOUS_NOT_MAPPED":
            if entry.get("candidateStagedPath") or not entry.get("reason"):
                fail("ambiguous candidate was mapped without approval " + row["id"])
            related = entry.get("relatedStagedPaths", [])
            if not isinstance(related, list) or not related or any(
                    not isinstance(q, str)
                    or not q.startswith("source-original/ci137-asset-staging/")
                    or ".." in Path(q).parts
                    or not (ROOT / q).is_file() for q in related):
                fail("ambiguous asset evidence missing " + row["id"])
        elif status == "NO_IDENTICAL_FINAL_ART_CANDIDATE":
            if row["family"] != "Defensas" or entry.get("candidateStagedPath") or not entry.get("reason"):
                fail("no-match artwork incorrectly mapped " + row["id"])
        else:
            fail("missing/invalid Defensas/Instrumentos crosswalk " + row["id"])
        counts[status] += 1
    if (counts != Counter({"ONE_TO_ONE_EDITORIAL_NAME_CANDIDATE": 11,
                          "APPROVED_ERH_SEED_RECONCILED_ISOLATED": 6,
                          "VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECHNICAL_QA": 4,
                          "AMBIGUOUS_NOT_MAPPED": 4,
                          "NO_IDENTICAL_FINAL_ART_CANDIDATE": 4})
            or len(candidate_ids) != 17 or len(unique_paths) != 17
            or approved_ids != set(approved_seeds)
            or visual_ids != set(selected_visual)):
        fail("Defensas/Instrumentos approved identity correspondence drift")
    # Existing COM catalog is approved artwork; approval never establishes
    # identity with eight different historical defense Items.
    catalog = read_json(ROOT / "manifests/defensas-assets.json")
    approved = [r for r in catalog.get("items", [])
                if r.get("status") == "approved_asset_present"]
    if len(approved) != 8:
        fail("expected exactly eight approved COM WebP sources")
    seen = set()
    for record in approved:
        found = [a for a in record["files"] if a["path"].endswith(".webp")]
        if len(found) != 1:
            fail("approved COM record lacks unique WebP " + record["name"])
        asset = found[0]
        source_path = ROOT / "source-original/ci137-asset-staging/defensas/webp256" / Path(asset["path"]).name
        if source_path.name in seen or not source_path.is_file():
            fail("approved COM WebP missing/duplicated " + str(source_path))
        seen.add(source_path.name)
        raw = source_path.read_bytes()
        if (digest(raw) != asset["sha256"] or len(raw) != asset["bytes"]
                or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP"
                or int.from_bytes(raw[4:8], "little") + 8 != len(raw)):
            fail("approved COM WebP SHA or RIFF changed: " + str(source_path))
    return {"itemsAudited": 29, "uniqueNamedCandidates": 17,
            "approvedERHSeedMatches": 6, "namedCandidatesRemaining": 11,
            "ambiguous": 8, "withoutIdenticalArt": 4,
            "comApprovedWebpsSha256Verified": len(approved),
            "approvedItemRemaps": 6}


def verify_pfrit_historical_manifest(rows):
    """Verify 30 old SHA values and recorded 0.4.75 external byte proof; no visual promotion."""
    m = read_json(ROOT / "manifests/ci137-parafernalia22-rituales8-recovery.json")
    if m.get("count") != 30 or len(m.get("rows", [])) != 30:
        fail("PF22/RIT08 manifest count changed")
    if (m.get("inventory075", {}).get("perImageSHAAvailable") is not False
            or m.get("physicalStaging", {}).get("approvedRemaps") != 0
            or m.get("physicalStaging", {}).get("ref075VerifiedSHA") is not True
            or m.get("physicalStaging", {}).get("transportApproved") is not False
            or m.get("actualArchive075Audit20261123", {}).get("matchingWebP") != 30
            or m.get("actualArchive075Audit20261123", {}).get("mismatchedSHA256") != 0
            or m.get("actualArchive075Audit20261123", {}).get("runtimeApproval") is not False
            or m.get("actualArchive075Audit20261123", {}).get("sourceSHA256") != m.get("archiveSha256")):
        fail("0.4.75 parity improperly claimed")
    chosen = {r["id"]: r for r in rows
              if r["family"] in ("Parafernalia · sanación · cultura material", "Rituales")}
    if len(chosen) != 30:
        fail("PF22/RIT08 selected IDs changed")
    found = set()
    family = Counter()
    backgrounds = 0
    for rec in m["rows"]:
        key = rec["id"]
        if key in found or key not in chosen:
            fail("PF22/RIT08 duplicate/missing ID " + key)
        found.add(key)
        entry = chosen[key]
        src = read_json(ROOT / entry["source"])
        if (entry["source"] != rec["itemJson"] or entry["family"] != rec["family"]
                or src.get("_id") != key or src.get("img") != rec["originalImg"]
                or src.get("system", {}).get("template") != rec["template"]
                or entry["archivedImage"]["originalPath"] != rec["originalImg"]):
            fail("PF22/RIT08 source/identity mismatch " + key)
        prefix = "modules/hiperaustralis-rituales/assets/"
        if not rec["originalImg"].startswith(prefix):
            fail("PF22/RIT08 unexpected legacy path " + key)
        suffix = Path(rec["originalImg"][len(prefix):])
        if suffix.is_absolute() or ".." in suffix.parts or suffix.suffix != ".webp":
            fail("PF22/RIT08 unsafe asset path " + key)
        physical = "source-original/ci137-asset-staging/ci137_v02_historico/" + suffix.as_posix()
        sha = rec["historicalCandidateSha256_0472_0473"]
        if (rec.get("currentPhysicalStagingPath") != physical
                or rec.get("currentPhysicalStagingSha256_0472_0473") != sha
                or rec.get("assetStatus") != "ARCHIVAL_0475_SHA_PARITY_PASS__NOT_RUNTIME_APPROVED"
                or rec.get("approvedForTransport") is not False
                or rec.get("archive075ByteEquality") != "SHA256_EQUAL_0472_0473_AND_0475"
                or rec.get("assetSha256") != sha or entry["archivedImage"].get("sha256") != sha):
            fail("PF22/RIT08 archive status/SHA mismatch " + key)
        binary = ROOT / physical
        if not binary.is_file():
            fail("PF22/RIT08 recovered WebP missing " + key)
        data = binary.read_bytes()
        if (digest(data) != sha or data[:4] != b"RIFF" or data[8:12] != b"WEBP"
                or int.from_bytes(data[4:8], "little") + 8 != len(data)):
            fail("PF22/RIT08 historic WebP bytes altered " + key)
        bg = src.get("flags", {}).get("hiperaustralis-sheet", {}).get("background")
        if rec["family"] == "Rituales":
            if bg != rec["originalImg"] or rec["expectedSheetBackground"] != bg:
                fail("Ritual background mismatch " + key)
            backgrounds += 1
        elif rec["backgroundPathFromSourceVerified"] is not False:
            fail("unverified PF background was promoted " + key)
        family[rec["family"]] += 1
    if (len(found) != 30 or family != Counter({"Parafernalia · sanación · cultura material": 22, "Rituales": 8})
            or backgrounds != 8):
        fail("PF22/RIT08 family/ritual counts changed")
    return {"items": 30, "parafernalia": 22, "rituales": 8, "historicShaMatches": 30,
            "ritualBackgroundMatches": 8, "inventory075RitualPresence": 8,
            "archive075ByteParity": True,
            "archive075VerificationScope": "EXTERNAL_EXACT_ZIP_AUDIT_AND_STAGED_SHA_MANIFEST_NOT_ZIP_REREAD_IN_CI",
            "approvedRemaps": 0}


def folder_doc(folder, folder_id, parent):
    return {
        "_id": folder_id, "name": folder.split("/")[-1], "type": "Item",
        "folder": parent, "sorting": "a", "sort": 0, "description": "",
        "flags": {}, "_key": "!folders!" + folder_id,
    }


def prepare(output):
    rows = validate_selection()
    historical_staging = verify_historical_staging(rows)
    crosswalk = verify_defensas_instrumentos_crosswalk(rows)
    pfrit = verify_pfrit_historical_manifest(rows)
    if output.exists() and any(output.iterdir()):
        fail("refusing nonempty output directory: " + str(output))
    output.mkdir(parents=True, exist_ok=True)
    itemroot = output / "items"
    itemroot.mkdir()
    for folder, (folder_id, parent) in FOLDERS.items():
        target = itemroot.joinpath(*folder.split("/"))
        target.mkdir(parents=True, exist_ok=True)
        (target / "_Folder.json").write_text(
            json.dumps(folder_doc(folder, folder_id, parent), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    approved_relics = verified_relic_remaps(output)
    shared_knives = verified_shared_knife(rows, output)
    extra_mappings = verified_additional_approved_asset_remaps(rows, output)
    records = []
    legacy = []
    remapped = []
    shared_remapped = []
    extra_remapped = []
    original_legacy_count = 0
    historic_by_id = {r["id"]: r for r in historical_staging}
    for row, doc, source_sha, folder in item_data(rows):
        if row["id"] in historic_by_id:
            expected_original = historic_by_id[row["id"]]["legacyPath"]
            if doc.get("img") != expected_original:
                fail("historical source img mismatch for " + row["id"])
        folder_id = FOLDERS[folder][0]
        transport = copy.deepcopy(doc)
        transport_id = ITEM_ID_CROSSWALK.get(row["id"], row["id"])
        if not valid_foundry_id(transport_id):
            fail("transport Item has invalid V14 ID: " + row["id"])
        if transport_id != row["id"]:
            provenance = transport.setdefault("flags", {}).setdefault(PACKAGE_ID, {})
            if "historicalSourceId" in provenance:
                fail("source already defines historicalSourceId flag")
            provenance["historicalSourceId"] = row["id"]
            transport["_id"] = transport_id
        if row.get("editorialName"):
            if row.get("sourceName") != doc.get("name"):
                fail("original historical source name changed: " + row["id"])
            transport["name"] = row["editorialName"]
        transport["folder"] = folder_id
        transport["_key"] = "!items!" + transport_id
        approved = approved_relics.get(row["id"])
        if approved is not None:
            if doc.get("img") != approved["old"]:
                fail("historical relic image differs: " + row["id"])
            original_background = doc.get("flags", {}).get("hiperaustralis-sheet", {}).get("background")
            if original_background != approved["old"]:
                fail("historical relic background differs: " + row["id"])
            transport["img"] = approved["new"]
            transport["flags"]["hiperaustralis-sheet"]["background"] = approved["new"]
            remapped.extend([
                {"id": row["id"], "field": "img", "from": approved["old"], "to": approved["new"], "sha256": approved["sha256"]},
                {"id": row["id"], "field": "flags.hiperaustralis-sheet.background", "from": approved["old"], "to": approved["new"], "sha256": approved["sha256"]},
            ])
        shared = shared_knives.get(row["id"])
        if shared is not None:
            transport["img"] = shared["new"]
            transport["flags"]["hiperaustralis-sheet"]["background"] = shared["new"]
            shared_remapped.extend([
                {"id": row["id"], "field": field, "from": shared["old"],
                 "to": shared["new"], "sha256": shared["sha256"]}
                for field in ("img", "flags.hiperaustralis-sheet.background")
            ])
        extra = extra_mappings.get(row["id"])
        if extra is not None:
            transport["img"] = extra["new"]
            extra_remapped.append({"id": row["id"], "field": "img",
                                   "from": extra["old"], "to": extra["new"], "sha256": extra["sha256"]})
            if extra["background"]:
                transport["flags"]["hiperaustralis-sheet"]["background"] = extra["new"]
                extra_remapped.append({"id": row["id"],
                                       "field": "flags.hiperaustralis-sheet.background",
                                       "from": extra["old"], "to": extra["new"],
                                       "sha256": extra["sha256"]})
        target = itemroot.joinpath(*folder.split("/"), transport_id + ".json")
        target.write_text(
            json.dumps(transport, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        for field, original, value in (
            ("img", doc.get("img"), transport.get("img")),
            ("flags.hiperaustralis-sheet.background",
             doc.get("flags", {}).get("hiperaustralis-sheet", {}).get("background"),
             transport.get("flags", {}).get("hiperaustralis-sheet", {}).get("background")),
        ):
            if isinstance(original, str) and original.startswith("modules/hiperaustralis-rituales/"):
                original_legacy_count += 1
            if isinstance(value, str) and value.startswith("modules/hiperaustralis-rituales/"):
                legacy.append({"id": row["id"], "field": field, "path": value})
        records.append({
            "id": transport_id, "historicalSourceId": row["id"],
            "source": row["source"], "sha256": source_sha,
            "name": transport["name"],
            "folder": folder, "template": doc["system"]["template"],
        })
    if len([r for r in records if r["name"] == "Cuchillo de piedra"]) != 1:
        fail("final editorial name is missing or duplicated")
    if (original_legacy_count != 139 or len(remapped) != 32
            or len(shared_remapped) != 2
            or len(legacy) + len(extra_remapped) != 105
            or len({x["path"] for x in legacy}) + len(extra_mappings) != 78):
        fail("unplanned approved remaps or unresolved historic image dependencies")
    report = {
        "schema": "ci137-transport-preflight-v04",
        "status": "136_REAL_SOURCES_PREPARED__16_RELIC_ASSETS__1_HISTORICAL_KNIFE__" + str(len(legacy)) + "_LEGACY_REFS",
        "count": len(records), "uniqueIds": len(set(r["id"] for r in records)),
        "folders": 9, "templates": 5,
        "folderIdCrosswalk": FOLDER_ID_CROSSWALK,
        "itemTransportIdCrosswalk": ITEM_ID_CROSSWALK,
        "originalLegacyReferences": original_legacy_count,
        "approvedRemaps": remapped, "approvedAssetCount": len(approved_relics),
        "sharedKnifeRemaps": shared_remapped, "sharedKnifeAssetCount": 1,
        "additionalApprovedAssetRemaps": extra_remapped,
        "additionalApprovedAssetCount": len(extra_mappings),
        "legacyAssetReferences": legacy,
        "historicalStagingAssets": historical_staging,
        "historicalStagingVerifiedCount": len(historical_staging),
        "historicalStagingShaMatched": sum(r["shaMatchedArchivalManifest"] for r in historical_staging),
        "historicalStagingPromotedCount": 0,
        "defensasInstrumentosCrosswalk": crosswalk,
        "parafernaliaRitualesCrosswalk": pfrit,
        "records": records,
    }
    (output / "ci137-preflight.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"status": report["status"], "items": len(records),
                      "folders": 9, "legacyRefs": len(legacy)}))


def verify(prepared, unpacked):
    manifest = read_json(prepared / "ci137-preflight.json")
    if manifest.get("count") != 136:
        fail("prepared corpus not 136")
    if (manifest.get("folderIdCrosswalk") != FOLDER_ID_CROSSWALK or
            manifest.get("itemTransportIdCrosswalk") != ITEM_ID_CROSSWALK):
        fail("explicit V14 legacy ID crosswalk changed")
    source_rows = validate_selection()
    stage_rows = verify_historical_staging(source_rows)
    crosswalk = verify_defensas_instrumentos_crosswalk(source_rows)
    pfrit = verify_pfrit_historical_manifest(source_rows)
    if manifest.get("parafernaliaRitualesCrosswalk") != pfrit:
        fail("PF22/RIT08 staging crosswalk changed during roundtrip")
    if manifest.get("defensasInstrumentosCrosswalk") != crosswalk:
        fail("crosswalk or final COM graphics changed across CI roundtrip")
    previous = manifest.get("historicalStagingAssets", [])
    if (len(previous) != 79 or stage_rows != previous
            or manifest.get("historicalStagingVerifiedCount") != 79
            or manifest.get("historicalStagingShaMatched") != 30
            or manifest.get("historicalStagingPromotedCount") != 0):
        fail("historical staging audit changed between prepare and verify")
    extra_rows = [row for row in source_rows if row.get("approvedAssetTransport")]
    extra_remaps = manifest.get("additionalApprovedAssetRemaps", [])
    if (len(manifest.get("approvedRemaps", [])) != 32
            or len(manifest.get("sharedKnifeRemaps", [])) != 2
            or manifest.get("additionalApprovedAssetCount") != len(extra_rows)
            or len(manifest.get("legacyAssetReferences", [])) + len(extra_remaps) != 105):
        fail("approved remap count does not reconcile with 105 original unresolved refs")
    for row in extra_rows:
        approved = row["approvedAssetTransport"]
        member = approved["targetMember"]
        path = prepared / member
        if (not path.is_file() or digest(path.read_bytes()) != approved["sha256"]
                or not any(x["id"] == row["id"] and x["to"].endswith("/" + member)
                           for x in extra_remaps)):
            fail("approved additional final WebP was not preserved in transport " + row["id"])
    knife_image = prepared / SHARED_KNIFE_MEMBER
    if (not knife_image.is_file() or digest(knife_image.read_bytes()) != SHARED_KNIFE_SHA256
            or {x["id"] for x in manifest["sharedKnifeRemaps"]} != SHARED_KNIFE_IDS
            or {x["to"] for x in manifest["sharedKnifeRemaps"]} != {SHARED_KNIFE_URL}):
        fail("the retained historical knife must have both img and background mapped to its approved WebP")
    for mapping in manifest["approvedRemaps"]:
        member = mapping["to"].split("/assets/reliquias/", 1)[-1]
        image = prepared / "assets/reliquias" / member
        if not image.is_file() or digest(image.read_bytes()) != mapping["sha256"]:
            fail("missing or modified staged approved relic asset: " + member)
    expected = {}
    for path in (prepared / "items").rglob("*.json"):
        if path.name != "_Folder.json":
            doc = read_json(path)
            expected[doc["_id"]] = doc
    actual, folders = {}, {}
    for path in unpacked.rglob("*.json"):
        doc = read_json(path)
        if not isinstance(doc, dict):
            fail("unpacked non-document")
        if path.name == "_Folder.json":
            if doc["_id"] in folders:
                fail("duplicate folder")
            folders[doc["_id"]] = doc
            continue
        key = doc.get("_id") or doc.get("id")
        if key in actual:
            fail("duplicate unpacked Item " + str(key))
        actual[key] = doc
    if ("c2L6T5w4S9OcgkDt" not in expected
            or expected["c2L6T5w4S9OcgkDt"].get("name") != "Cuchillo de piedra"
            or "HipArm01PackA000" in expected):
        fail("final editorial knife name or identity incorrect")
    if len(expected) != 136 or set(actual) != set(expected):
        fail("roundtrip IDs differ: missing=" + repr(sorted(set(expected) - set(actual))) +
             " extra=" + repr(sorted(set(actual) - set(expected))))
    if ("TokicuraRel00010" not in expected or
            expected["TokicuraRel00010"].get("flags", {})
            .get(PACKAGE_ID, {}).get("historicalSourceId") != "TokicuraRel0001"):
        fail("Tokicura provenance and runtime ID mismatch")
    if any(not valid_foundry_id(x) for x in actual):
        fail("invalid V14 runtime Item ID")

    expected_folders = {v[0]: (k.split("/")[-1], v[1]) for k, v in FOLDERS.items()}
    if set(folders) != set(expected_folders):
        fail("roundtrip folder IDs differ")
    for folder_id, (name, parent) in expected_folders.items():
        if folders[folder_id].get("name") != name or folders[folder_id].get("folder") != parent:
            fail("folder hierarchy changed " + folder_id)
    for item_id, src in expected.items():
        dst = actual[item_id]
        if dst.get("folder") != src.get("folder"):
            fail("Item folder changed " + item_id)
        for field in PRESERVED_FIELDS:
            # Foundry CLI supplies the empty ActiveEffect array when the original
            # JSON omits it. This is a serialization default, not altered content.
            if field == "effects" and src.get("effects", []) == dst.get("effects", []) == []:
                continue
            if dst.get(field) != src.get(field):
                fail("Item semantic field changed " + item_id + "/" + field)
    result = {
        "status": "CI137_ROUNDTRIP_136_PASS__ASSETS_AND_RUNTIME_PENDING",
        "items": len(actual), "folders": len(folders),
        "folderIdCrosswalk": FOLDER_ID_CROSSWALK,
        "itemTransportIdCrosswalk": ITEM_ID_CROSSWALK,
        "semanticFieldsChecked": list(PRESERVED_FIELDS),
        "legacyReferenceCount": len(manifest["legacyAssetReferences"]),
        "sharedKnifeReferencesRemapped": len(manifest["sharedKnifeRemaps"]),
        "additionalApprovedAssetRemaps": len(extra_remaps),
        "additionalApprovedAssetCount": manifest["additionalApprovedAssetCount"],
        "approvedRelicAssetCount": manifest["approvedAssetCount"],
        "archivalWebpsVerified": len(stage_rows),
        "archivalWebpsShaCompared": 30,
        "archivalWebpsPromoted": 0,
        "defensasInstrumentosCrosswalk": crosswalk,
        "parafernaliaRitualesCrosswalk": pfrit,
        "approvedRelicReferencesRemapped": len(manifest["approvedRemaps"]),
        "note": "16 historical relic WebP and one approved knife mapped; 79 historical WebP audited; 30 PF/RIT and 29 DEF/ERH crosswalks retained without default art substitutions; " + str(len(manifest["legacyAssetReferences"])) + " legacy references remain; no Foundry runtime QA",
    }
    (prepared / "ci137-roundtrip.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(result))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="action", required=True)
    a = sub.add_parser("prepare")
    a.add_argument("--out", type=Path, required=True)
    b = sub.add_parser("verify")
    b.add_argument("--prepared", type=Path, required=True)
    b.add_argument("--unpacked", type=Path, required=True)
    args = p.parse_args()
    try:
        if args.action == "prepare":
            prepare(args.out)
        else:
            verify(args.prepared, args.unpacked)
    except Exception as exc:
        p.exit(1, str(exc) + "\n")


if __name__ == "__main__":
    main()
