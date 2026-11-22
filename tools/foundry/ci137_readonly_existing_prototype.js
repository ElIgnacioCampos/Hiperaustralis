/** Hiperaustralis CI137 — read-only QA on EXISTING HA Prototipo, not a new compendium. */
(async () => {
  const moduleId = "hiperaustralis-compendios-prototype";
  const packId = moduleId + ".ha-proto-items";
  const report = {
    schema: "ci137-existing-prototype-qa-v01",
    created: new Date().toISOString(),
    world: game.world?.id || null,
    foundryVersion: game.version,
    csbVersion: game.system?.version || null,
    moduleId, packId,
    readonly: true, errors: [], warnings: [], refs: {}, items: {},
  };
  try {
    const pack = game.packs.get(packId);
    if (!pack || pack.documentName !== "Item") throw Error("Missing existing Item compendium " + packId);
    const r = await fetch("modules/" + moduleId + "/QA/expected_137.json", { cache: "no-store" });
    if (!r.ok) throw Error("Expected ID inventory unavailable HTTP " + r.status);
    const expected = await r.json();
    if (expected.module !== moduleId || expected.pack !== packId ||
        expected.items !== 137 || expected.folders !== 9 || expected.templates !== 5)
      throw Error("QA expectations do not refer to the existing HA Prototipo");
    const docs = await pack.getDocuments();
    const byId = new Map(docs.map(d => [d.id, d]));
    const errors = [];
    for (const e of expected.expectedIds) {
      const d = byId.get(e.id);
      if (!d) { errors.push({id:e.id, error:"missing historical Item"}); continue; }
      if (d.type !== "equippableItem") errors.push({id:e.id, error:"wrong Item type"});
      if (d.system?.template !== e.template) errors.push({id:e.id, error:"wrong CSB template"});
      if (d.folder?.id !== e.folderId) errors.push({id:e.id, error:"wrong folder"});
    }
    report.items = {
      expected: 137, actual: docs.length, uniqueIds: byId.size,
      missing: expected.expectedIds.filter(e => !byId.has(e.id)).map(e => e.id),
      unexpected: docs.filter(d => !expected.expectedIds.some(e => e.id === d.id)).map(d => d.id),
      mismatches: errors,
      uniqueFolders: [...new Set(docs.map(d => d.folder?.id).filter(Boolean))].length,
      uniqueTemplates: [...new Set(docs.map(d => d.system?.template).filter(Boolean))].length
    };
    const classify = p => p.startsWith("modules/" + moduleId + "/") ? "own"
      : p.startsWith("modules/hiperaustralis-rituales/") ? "legacy"
      : p.startsWith("icons/") ? "foundry"
      : p.startsWith("systems/") ? "system" : "other";
    const refs = [];
    for (const d of docs) {
      if (d.img) refs.push({id:d.id, field:"img", path:d.img});
      const b = d.flags?.["hiperaustralis-sheet"]?.background;
      if (b) refs.push({id:d.id, field:"background", path:b});
    }
    const counts = {};
    for (const ref of refs) { const k = classify(ref.path); counts[k] = (counts[k] || 0) + 1; }
    report.refs = {total:refs.length, types:counts, distinctUrls:new Set(refs.map(x => x.path)).size};
    if (docs.length !== 137 || byId.size !== 137 || errors.length)
      report.errors.push("137 Item structures do not match");
    if (counts.legacy !== 109)
      report.warnings.push("Legacy image-link count differs from the expected 109: " + counts.legacy);
    if (counts.own === 0) report.errors.push("No images are linked to this module");
    const sets = [
      "ha-proto-items", "ha-proto-actors", "ha-proto-journals"
    ].map(name => moduleId + "." + name);
    report.packs = sets.map(key => ({key, present:Boolean(game.packs.get(key))}));
    if (report.packs.some(p => !p.present))
      report.errors.push("One existing prototype pack missing");
    report.status = report.errors.length ? "STRUCTURAL_FAIL" :
      "STRUCTURAL_PASS_RUNTIME_VISUAL_PENDING";
    report.note = "Structural read-only QA does not certify sheet rendering, missing art or Foundry installation autonomy";
  } catch (e) {
    report.errors.push(String(e));
    report.status = "BLOCKED";
  }
  console.info("Hiperaustralis CI137 existing prototype QA — READ ONLY", report);
  if (typeof globalThis.saveDataToFile === "function")
    globalThis.saveDataToFile(JSON.stringify(report, null, 2), "application/json",
       "HIPERA_CI137_EXISTING_PROTOTYPE_QA_" + report.created.replace(/[:.]/g,"-") + ".json");
  ui.notifications?.info?.("CI137: " + report.status + ". Ver consola / reporte JSON.");
})();
