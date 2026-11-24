#!/usr/bin/env python3
"""Validate CI137 expansion staging against existing ID maps and approval gates.

This is a READ-ONLY CI preflight. It never generates Foundry documents or assets.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "manifests/ci137-expansion-territorios-habitantes-culturas-v01.json"
VALID = re.compile(r"^[A-Za-z0-9]{16}$")


def read(rel):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def gate(yes, message):
    if not yes:
        raise ValueError("CI137_EXPANSION_BLOCKED: " + message)


def main():
    m = read("manifests/ci137-expansion-territorios-habitantes-culturas-v01.json")
    gate(m["base"]["version"] == "0.1.7-ci137qa.5", "stable QA5 base changed")
    gate(m["base"]["moduleId"] == "hiperaustralis-compendios-prototype",
         "must preserve one module ID")
    gate(m["gates"]["noAutoInstall"] and m["gates"]["noNewModuleId"] and
         m["gates"]["noNewCompendiumPackId"] and not m["gates"]["runtimeD3"],
         "staging gate or runtime claim changed")
    gate(set(m["targetPacks"]) == {"ha-proto-items", "ha-proto-actors", "ha-proto-journals"},
         "three original native packs must remain")
    gate(m["targetPacks"]["ha-proto-actors"]["folders"] ==
         ["Habitantes/Amenyi", "Adversarios/Turianos"], "user-approved Actor destinations changed")
    gate(all(p["newItemDocsAuthorized"] == 0 if "newItemDocsAuthorized" in p else
             p.get("newActorDocsAuthorized", p.get("newJournalDocsAuthorized", 0)) == 0
             for p in m["targetPacks"].values()),
         "premature document promotion")

    t = m["territorialIndex"]["territories"]
    gate(len(t) == 9 and len({x["code"] for x in t}) == 9, "exact nine CORE territories")
    gate([x["code"] for x in t] == [
        "01_ATACAMA_LICKANANTAY", "02_PIKUNMAPU", "03_NGULUMAPU",
        "04_PEWENMAPU", "05_WILLIMAPU", "06_PATAGONIA_AUSTRAL",
        "07_TIERRA_DEL_FUEGO", "08_CANALES_AUSTRALES", "09_UMBRAL_POLAR"],
        "old eight-band geography or new unapproved TERRITORIOS")
    gate(all(x["subfolders"] == ["Flora", "Fauna", "Funga", "Recetas"] for x in t),
         "approved FFF and Recetas sibling folders changed")
    fff = m["territorialIndex"]["fffStandard"]
    quota = {"Flora": 4, "Fauna": 4, "Funga": 4}
    gate(fff["label"] == "FFF 4×4×4" and
         fff["targetPerTerritory"] == quota and
         fff["numberOfCoreTerritories"] == 9 and
         fff["totalTarget"] == {"Flora": 36, "Fauna": 36, "Funga": 36, "combined": 108} and
         fff["earlierEightTerritoryTarget"] == 96,
         "FFF target must be 9 × (4 Flora + 4 Fauna + 4 Funga) = 108")
    for x in t:
        actual = x["fff"]["assignedReferences"]
        gate(x["fff"]["target"] == quota and
             x["fff"]["recipeSlotsOutsideFFF"] is True and
             actual["Fauna"] == x["fauna"] and len(actual["Fauna"]) == 4 and
             actual["Flora"] == [] and actual["Funga"] == [],
             "incomplete FFF slots must remain explicit, not fabricated: " + x["code"])
    gate(sum(sum(x["fff"]["target"].values()) for x in t) == 108,
         "FFF allocation capacity total changed")
    codes = [c for x in t for c in x["fauna"]]
    gate(len(codes) == 36 and all(len(x["fauna"]) == 4 and len(set(x["fauna"])) == 4
                                 for x in t), "FAU 9x4 principal allocation drift")
    fau_map = read("source/territorios/fauna/foundry-id-map.json")
    flo_map = read("source/territorios/flora/foundry-id-map.json")
    faus = fau_map["items"]
    flos = flo_map["items"]
    gate(len(faus) == 50 and len(flos) == 40, "Foundry observed FAU/FLO inventory drift")
    fau_ids = [x["_id"] for x in faus]
    flo_ids = [x["foundryId"] for x in flos]
    gate(len(set(fau_ids)) == 50 and len(set(flo_ids)) == 40, "duplicate Foundry Item ID")
    gate(all(VALID.fullmatch(x) for x in fau_ids + flo_ids),
         "invalid Foundry V14 Item ID")
    fau_codes = {x["code"] for x in faus}
    flo_codes = {x["codigo"] for x in flos}
    gate(all(c in fau_codes for c in codes), "FAU principal reference absent in existing IDs")
    gate(flo_codes == {f"FLO-{i:03d}" for i in range(1, 41)},
         "Flora code set not 001-040")
    gate(m["families"]["fauna"]["active"] == 44 and
         m["families"]["fauna"]["legacyProtected"] == ["FAU-006"],
         "FAUNA_MAESTRO approved versus legacy status drift")
    gate(m["families"]["funga"]["independentlyApprovedItems"] == 0,
         "unverified Funga runtime records introduced")
    historical_funga = m["families"]["funga"]["priorApprovedHistoricalFunga"]
    gate(historical_funga["codes"] == ["FUN-01", "FUN-02", "FUN-03", "FUN-04"] and
         historical_funga["runtimePromotions"] == 0,
         "Tierra del Fuego Funga approvals are prior-source only, not installed")
    equipment = m["targetPacks"]["ha-proto-items"]["equipmentStructure"]
    gate(equipment["status"] ==
         "APPROVED_FUNCTIONAL_SEPARATION_PENDING_FOLDER_ID_CROSSWALK",
         "unverified equipment folder changes introduced")
    gate(equipment["transversal"]["folder"] == "Equipo común" and
         equipment["cultural"]["folder"] == "Equipo cultural" and
         equipment["musical"]["folder"] == "Instrumentos musicales",
         "common, culturally specific and musical equipment must remain distinct")
    culture_folders = ["Mapuche", "Aymara", "Nórdicos", "Lickanantay", "Chinchorro", "Selk’nam"]
    gate(equipment["cultural"]["subfolders"] == culture_folders,
         "six named equipment cultural groups changed")
    gate(equipment["historicalItemCount"] == 40 and
         equipment["imageCandidatesCrosswalkCount"] == 29 and
         m["families"]["equipo"]["newItemDocsAuthorized"] == 0 and
         m["families"]["equipo"]["newIconReplacementDocsAuthorized"] == 0,
         "40 historical Equipo Items do not become 69 new Items or auto image changes")
    # Explicitly preserve the instrument/relic identity counts already in QA5.
    selected = read("manifests/ci137-selected-source-137-historical-ids.json")
    by_family = {}
    for entry in selected["entries"]:
        by_family[entry["family"]] = by_family.get(entry["family"], 0) + 1
    gate(len(selected["entries"]) == 136 and
         by_family.get("Instrumentos musicales") == 21 and
         by_family.get("Reliquias legendarias") == 8 and
         by_family.get("Reliquias cotidianas") == 8 and
         by_family.get("Reliquias") == 1,
         "QA5 selected corpus 136/21/8+8/1 Tokicura drift")
    i = m["families"]["instrumentos"]
    relic = m["families"]["reliquias"]
    gate(i["historicalItemsInQA5"] == 21 and
         i["approvedERHVisualRemapsInQA5"] == 6 and
         i["otherHistoricalInstrumentRemapsPending"] == 15 and
         i["runtimeAddsAuthorized"] == 0 and
         i["itemDragAndDrop"] == "MUST_PASS_IN_REAL_CLIENT_NOT_YET_VALIDATED",
         "21 instrument records and actual 6/21 remaps must stay distinct")
    erh = read("manifests/instrumentos-erh-assets.json")
    gate(erh["ci137SixInstruments"]["approvedItemRemaps"] == 6 and
         erh["ci137SixInstruments"]["clientFoundryQA"] == "NOT_EXECUTED",
         "instrument ERH D2/D3 claim changed")
    src_relic = read("manifests/reliquias-assets.json")
    gate(len(src_relic["records"]) == 16 and
         relic["historicalItemsInQA5"] == 16 and relic["cotidianas"] == 8 and
         relic["legendarias"] == 8 and relic["tokicuraIndependent"] is True and
         relic["assetsIncludedInQA5"]["everyHistoricalRelicImage"] == 16 and
         relic["assetsIncludedInQA5"]["tokicuraSeparateImage"] == 1 and
         relic["runtimeAddsAuthorized"] == 0 and
         relic["itemDragAndDrop"] == "MUST_PASS_IN_REAL_CLIENT_NOT_YET_VALIDATED",
         "16 historic reliquias + one separate Tokicura image must remain intact")
    recipe = m["targetPacks"]["ha-proto-items"]["recipeContract"]
    recfam = m["families"]["recetas"]
    gate(recipe["documentType"] == "Item" and recipe["separateFromFFF"] is True and
         recipe["countedInFFF"] is False and
         recipe["dragAndDrop"]["required"] is True and
         "Kona" in recipe["dragAndDrop"]["target"] and
         recipe["approvedSourceRecordsConfirmed"] == 0 and
         recipe["itemRecordsCreated"] == 0,
         "recipes must not become non-draggable Journals or fabricated Items")
    gate(recfam["notFFF"] is True and
         recfam["typeRequirement"].startswith("Native Foundry Item") and
         recfam["installation"].startswith("BLOCKED_UNTIL"),
         "recipe drag and drop gate cannot be lifted by manifest text")
    for row in t:
        rr = row["fff"]["recipes"]
        gate(rr["sibling"] is True and rr["excludedFromQuota"] is True and
             rr["foundryDocumentType"] == "Item" and
             rr["dragDropRequired"] is True and
             rr["candidateItemIds"] == [] and
             rr["status"] == "PENDING_APPROVED_RECIPE_ITEMS",
             "territorial recipes must be real Item documents, not FFF slots")
    equipment_candidates = read("manifests/equipo-comun-29-cruces-candidatos-20261121.json")
    gate(equipment_candidates["historicalItemCount"] == 40 and
         len(equipment_candidates["items"]) == 29 and
         len({x["id"] for x in equipment_candidates["items"]}) == 29 and
         all(VALID.fullmatch(x["id"]) for x in equipment_candidates["items"]),
         "Equipo historical 40 / candidate 29 crosswalk mismatch")
    defenses = read("manifests/defensas-assets.json")
    newdef = m["families"]["newDefenses"]
    gate(len(defenses["items"]) == 9 and len(newdef["catalogCodes"]) == 9,
         "nine DEF candidates must remain separate from historical eight")
    gate({x["catalogCode"] for x in defenses["items"]} == set(newdef["catalogCodes"]),
         "DEF code mismatch")
    gate({x.get("assetCode") for x in defenses["items"] if x.get("files")} ==
         set(newdef["approvedGraphics"]), "approved COM hashes/code set changed")
    gate(any(x.get("assetCode") == "COM-09" and not x.get("files")
             for x in defenses["items"]), "Tañaña COM09 source status changed")
    tur = read("manifests/turianos-assets.json")
    gate({x["code"] for x in tur["actors"]} == set(m["families"]["adversarios"]["sourceCodes"]),
         "Turianos TUR01-06 codes changed")
    gate(m["families"]["adversarios"]["runtimeExcluded"] ==
         ["TUR-05 Sangu", "TUR-06 Popr"], "premature Turianos migration")
    gate(m["targetPacks"]["ha-proto-journals"]["candidatePages"] == 36 and
         m["families"]["culturas"]["sourcePersistentId"] == "NOT_PRESENT_IN_0_4_75",
         "Culture Journal identity unverified")
    # Gate the new 8+9 Defensas / 40 Flora crosswalk against actual repository sources.
    crosswalk = read("manifests/ci137-defensas-flora-crosswalk-20261124-v01.json")
    gate(crosswalk["status"] == "AUDIT_ONLY_NO_APPROVED_DOCUMENT_UPDATES", "crosswalk prematurely promoted")
    old_defenses = crosswalk["historicalDefenses"]
    new_defenses = crosswalk["newDefenses"]
    flora_records = crosswalk["flora"]
    gate(len(old_defenses) == 8 and len(new_defenses) == 9 and
         len(flora_records) == 40, "8+9+40 crosswalk cardinality drift")
    gate(len({x["id"] for x in old_defenses}) == 8 and
         all(VALID.fullmatch(x["id"]) for x in old_defenses),
         "invalid historical Defense runtime ID")
    gate(len({x["seedId"] for x in old_defenses}) == 8, "duplicate Defense source seed")
    gate({x["catalogCode"] for x in new_defenses} ==
         {x["catalogCode"] for x in defenses["items"]}, "catalog DEF codes mismatch")
    for new in new_defenses:
        source = next(x for x in defenses["items"] if x["catalogCode"] == new["catalogCode"])
        gate(new["catalogName"] == source["name"] and
             new["assetCode"] == source["assetCode"] and
             new["graphicStatus"] == source["status"] and
             new["runtimeId"] is None, "DEF entry promoted or altered: " + new["catalogCode"])
        gate(all(seed in {x["seedId"] for x in old_defenses}
                 for seed in new["possibleOverlapWithHistoricalSeeds"]),
             "DEF overlap points outside historical items")
    by_code = {x["codigo"]:x for x in flora_records}
    gate(len(by_code) == 40 and set(by_code) == flo_codes, "FLO code identity mismatch")
    for row in flos:
        x = by_code[row["codigo"]]
        gate(x["foundryId"] == row["foundryId"] and
             x["seedId"] == row["seedId"] and
             x["foundryName"] == row["nombre"] and
             x["sourceNameFromZip075"] == row["nombre"] and
             x["sourceUUID"] == row["uuid"],
             "FLO source/name/ID/UUID mismatch: " + row["codigo"])
        gate(x["sourceMatch"] == "NAME_CODE_SEED_MATCH_0_4_75" and
             x["territoryMigration"] == "REFERENCE_ONLY_PENDING_9_CORE_MAP",
             "FLO candidate status incorrectly promoted")
    gate(crosswalk["sourceAudit"]["floraIconsRecomputedHashMatchesEditorial"] == 0 and
         crosswalk["sourceAudit"]["floraBackgroundPathsHaveOnly8DistinctFiles"] is True and
         crosswalk["sourceAudit"]["legacyTotoraBackgroundRefs"] == 33,
         "historical binary audit status changed; inspect actual source ZIP first")
    binary = crosswalk["sourceAudit"]
    gate(binary["exactBinRescue48Of48"] and
         binary["floraRescuedImageFilesByteIdenticalTo075"] == 48 and
         binary["floraIcon512RGBA"] == 40 and
         binary["floraIconActualTotalBytes"] == 3641622 and
         binary["floraCatalogClaimedTotalBytes"] == 9107212 and
         binary["floraIconSourceDoesNotMatchClaimedHashCount"] == 40 and
         binary["sourceCatalogImageVersionUnknown"] and
         binary["assetReencodingNotAuthorized"],
         "Flora source binary audit or editorial gate drift")
    gate(crosswalk["gates"]["allRuntimeUpdatesBlocked"] and
         crosswalk["gates"]["noMutationsToQA5"],
         "runtime gate cannot be lifted by audit")
    report = {
        "status":"CI137_EXPANSION_STAGING_PREFLIGHT_PASS",
        "runtimeInstallation":False,
        "baseVersion":"0.1.7-ci137qa.5",
        "nativePacks":3,
        "territories":len(t),
        "faunaTerritorialReferences":len(codes),
        "fffSlotsPerTerritory":{"Flora":4,"Fauna":4,"Funga":4},
        "fffTargetTotal":108,
        "fffCurrentFloraAssignmentsInNineCore":0,
        "fffCurrentFungaAssignmentsInNineCore":0,
        "instrumentosHistoricalItems":21,
        "instrumentosERHApprovedRemaps":6,
        "reliquiasHistoricalItems":16,
        "reliquiasTokicuraIndependent":True,
        "recetasFolders":len(t),
        "recetasDraggableItemDocsInstalled":0,
        "recetasDragDropClientQA":"PENDING",
        "equipoHistoricalItems":40,
        "equipoImageCandidateCrosswalk":29,
        "equipoFunctionalSeparationPendingMigration":True,
        "uniqueFaunaCodesInSelections":len(set(codes)),
        "foundryFaunaIdentityRows":len(faus),
        "foundryFloraIdentityRows":len(flos),
        "newDefensaCatalogCandidates":9,
        "approvedDefensaImagesRecovered":8,
        "turianosCandidates":len(tur["actors"]),
        "amenyiFolder":"Habitantes/Amenyi",
        "turianosFolder":"Adversarios/Turianos",
        "newRuntimeDocumentsInstalled":0,
        "crosswalkDefensasHistorical":len(old_defenses),
        "crosswalkDefensasNewCatalog":len(new_defenses),
        "crosswalkFloraRecords":len(flora_records),
        "crosswalkFloraMatchedWithFoundryIds":len(flora_records),
        "sourceZipImageHashesDivergeFromEditorial":40
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
