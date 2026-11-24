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
    gate(all(x["subfolders"] == ["Fauna", "Flora", "Funga", "Recetas"] for x in t),
         "territorial subfolders changed")
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
         "unapproved funga records introduced")
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
