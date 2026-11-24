#!/usr/bin/env python3
"""CI137 × MELIAZ Bridge 0.24.203 — read-only recipe DnD capability audit.

Operates on two checked-out GitHub branches in CI, NEVER changes Bridge/Forge/worlds.
Reports a blocked feature as factual status, NOT as an automated migration success.
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "manifests/ci137-instrumentos-recetas-dnd-qa-20261124-v01.json"
SELECTED = ROOT / "manifests/ci137-selected-source-137-historical-ids.json"


def require(ok, reason):
    if not ok:
        raise AssertionError("CI137_RECIPE_BRIDGE_AUDIT_FAIL: " + reason)


def json_at(path):
    return json.loads(path.read_text(encoding="utf-8"))


def slice_between(text, start, end, label):
    a = text.find(start)
    b = text.find(end, a + len(start)) if a >= 0 else -1
    require(a >= 0 and b > a, "cannot locate " + label + " in exact Bridge source")
    return text[a:b]


def inspect(bridge_js):
    cross = json_at(MANIFEST)
    selected = json_at(SELECTED)["entries"]
    source = bridge_js.read_text(encoding="utf-8")
    require("function inferHiperaItemKind(item)" in source, "missing kind classifier")
    require('source.type !== "equippableItem"' in source, "DnD input type guard changed")
    require('function installHiperaItemDrop(canvas, actor)' in source,
            "DnD source was replaced; inspect before authoring a patch")
    require('function installHiperaBiomas(canvas, actor)' in source,
            "existing territory item renderer not found")
    require("function attachHiperaInstrumentoToSentir(actor, source)" in source,
            "instrument drop path absent")
    require("function renderKonaReliquiaItems(canvas, actor)" in source,
            "relic drop renderer absent")
    require("function hiperaNaturalezaItems(actor)" in source,
            "territory item counter absent")

    classifier = slice_between(source,
                               "function inferHiperaItemKind(item)",
                               "const KONA_COMPENDIUM_TARGETS =",
                               "Item kind classifier")
    targets = slice_between(source,
                            "const KONA_COMPENDIUM_TARGETS =",
                            "function konaCompendiumPackLabel",
                            "compendium picker targets")
    nature = slice_between(source,
                           "function hiperaNaturalezaItems(actor)",
                           "function hiperaPlainFlags",
                           "nature item collector")
    renderer = slice_between(source,
                             "function installHiperaBiomas(canvas, actor)",
                             "function installHiperaItemDrop(canvas, actor)",
                             "Territorio UI drop renderer")
    drop = slice_between(source,
                         "function installHiperaItemDrop(canvas, actor)",
                         "function installKonaRitualItemPrototype",
                         "canvas native drop dispatcher")
    require('kinds: ["flora", "fauna", "funga", "bioma"]' in targets,
            "territory picker item kinds different; re-audit semantics")
    require('["flora","fauna","funga","bioma"]' in nature,
            "Territory Item list changed from FFF+bioma")
    require("kind === 'flora' || kind === 'fauna' || kind === 'funga' || kind === 'bioma'"
            in renderer, "Territory box Item d&d path changed")
    require('if (kind === "instrumento")' in drop and
            'if (kind === "equipo")' in drop and
            'if (kind === "arma")' in drop and
            'if (kind === "defensa")' in drop,
            "other working DnD destinations were changed")
    require('const field = hiperaDropFieldAtPointer(canvas, event)' in drop and
            'if (kind !== field)' in drop and
            'await embedHiperaItemFromDrop(canvas, actor, event)' in drop,
            "existing Temple Ritual/Reliquia drop gate changed")
    # Avoid falsely declaring recipe support just because the word appears in a comment.
    recipe_support = any("receta" in s.lower()
                         for s in (classifier, targets, nature, renderer, drop))
    require(recipe_support is False, "the pinned Bridge now mentions receta: re-audit!")
    require(cross["bridge"]["verifiedCurrentBehavior"]["recognizedKindsIncludesReceta"] is False and
            cross["recipes"]["currentBridgeRecognition"] is False and
            cross["recipes"]["clientQa"] == "BLOCKED_BY_SOURCE_AND_BRIDGE",
            "manifest incorrectly reports Recipe D3 available")

    instruments = cross["instruments"]["entries"]
    selected_instruments = [x for x in selected if x["family"] == "Instrumentos musicales"]
    require(len(instruments) == len(selected_instruments) == 21,
            "instrument corpus should be exactly 21")
    by_id = {x["id"]: x for x in instruments}
    require(len(by_id) == 21 and set(by_id) == {x["id"] for x in selected_instruments},
            "instrument IDs differ from historical source")
    for item in selected_instruments:
        candidate = by_id[item["id"]]
        source_status = item.get("editorialCrosswalk", {}).get("status")
        expected_status = (
            "APPROVED_ERH_REMAP" if item.get("approvedAssetTransport")
            else "AUTHOR_VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECH"
            if source_status == "VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECHNICAL_QA"
            else "NAME_MATCH_ONLY_CANDIDATE"
            if source_status == "ONE_TO_ONE_EDITORIAL_NAME_CANDIDATE"
            else "AMBIGUOUS_NOT_MAPPED"
        )
        require(candidate["approval"] == expected_status,
                "instrument status incorrectly promoted: " + item["id"])
        require(candidate["source"] == item["source"],
                "instrument source path drift: " + item["id"])
        require(candidate["approvedAsset"]
                == item.get("approvedAssetTransport", {}).get("targetMember"),
                "approved image path drift: " + item["id"])
        require(candidate["changeAuthorized"] is bool(item.get("approvedAssetTransport")),
                "unapproved instrument graphical replacement: " + item["id"])
    approval = json_at(ROOT / "manifests/ci137-erh-cuatro-ambiguedades-aprobacion-20261124.json")
    choices = {x["id"]: x for x in approval["selectedRows"]}
    require(len(choices) == 4 and
            set(choices) == {x["id"] for x in instruments
                            if x["approval"] == "AUTHOR_VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECH"},
            "the four new visual author approvals must match their exact 16-char IDs")
    for iid, choice in choices.items():
        row = by_id[iid]
        candidate_source = next(x for x in selected_instruments if x["id"] == iid)
        crosswalk = candidate_source["editorialCrosswalk"]
        require(row["approvedVisualSHA256"] == choice["sha256"] and
                row["approvedVisualAsset"] == choice["source"] and
                row["approvedVisualBytes"] == choice["bytes"] and
                crosswalk["approvedCandidateSHA256"] == choice["sha256"] and
                crosswalk["approvedCandidateStagedPath"] == choice["source"] and
                crosswalk["approvedForTransport"] is False and
                row["changeAuthorized"] is False and
                choice["notDeployed"] is True,
                "author choice is exact visual source ONLY, not released to Forge: " + iid)
    status_counts = {
        k: sum(x["approval"] == k for x in instruments)
        for k in ("APPROVED_ERH_REMAP", "NAME_MATCH_ONLY_CANDIDATE",
                  "AUTHOR_VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECH")
    }
    require(status_counts == {"APPROVED_ERH_REMAP": 6,
                              "NAME_MATCH_ONLY_CANDIDATE": 11,
                              "AUTHOR_VISUAL_APPROVED_ERH_OPTION_2_PENDING_TECH": 4},
            "approved/candidate/author visual selection triage changed")
    require(cross["instruments"]["authorVisualApprovedERHSecondOptions"] == 4 and
            cross["instruments"]["runtimeTransportApprovedAndPresentInQA5"] == 6 and
            cross["instruments"]["visualApprovalsNotYetTransported"] == 4,
            "visual approval incorrectly counted as delivered Item transport")
    reliq = [x for x in selected if x["family"].startswith("Reliquias")]
    require(len(reliq) == 17 and
            sum(x["family"] == "Reliquias cotidianas" for x in reliq) == 8 and
            sum(x["family"] == "Reliquias legendarias" for x in reliq) == 8 and
            sum(x["family"] == "Reliquias" for x in reliq) == 1,
            "historical relic identity split drift")
    require(cross["recipes"]["confirmedSourceItemsInGitHub"] == 0 and
            cross["recipes"]["confirmedSourceItemsInQA5"] == 0 and
            cross["recipes"]["approvedItemIds"] == [] and
            cross["recipes"]["dragDropRequired"] is True and
            cross["recipes"]["outsideFFF"] is True and
            cross["recipes"]["destinationInKona"]
                  == "NOT_EXPLICITLY_APPROVED_DO_NOT_DESIGN_NEW_SLOT" and
            cross["gates"]["noBridgeMutation"] is True,
            "recipe provenance and non-mutation gates changed")
    report = {
        "status": "D2_SOURCE_AUDIT_PASS__RECIPE_DND_BLOCKED",
        "bridgeVersionSource": "0.24.203", "bridgeCodeInspected": str(bridge_js),
        "sourceFamilies":{"Instrumentos":21,"Reliquias":16,"Tokicura":1},
        "instrumentImageRemaps": status_counts,
        "bridge": {
            "instrumentDnD":"IMPLEMENTED_TARGET_SENTIR_NOT_RUNTIME_TESTED",
            "relicDnD":"IMPLEMENTED_TARGET_TEMPLE_NOT_RUNTIME_TESTED",
            "natureDnD":"IMPLEMENTED_TARGET_TERRITORIO_NOT_RUNTIME_TESTED",
            "recipeKindRecognized": False,
            "recipeDnD":"UNSUPPORTED_IN_PINNED_BRIDGE",
        },
        "recipe": {
            "foundryItemSourcesVerified":0,
            "desiredTerritorialFolders":9,
            "targetNotApproved":True,
            "runtimeD3":False,
            "autoPatch":False,
            "zeroRuntimeMutations":True
        }
    }
    return report


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--bridge", required=True, type=Path)
    p.add_argument("--out", type=Path)
    args = p.parse_args()
    result = inspect(args.bridge)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n",
                            encoding="utf-8")
    print(json.dumps(result, indent=2, ensure_ascii=False))
