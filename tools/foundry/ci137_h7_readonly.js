/* Hiperaustralis H7 / CI137 — SOLO LECTURA. No instala, escribe ni migra. */
(async () => {
  const id = "hiperaustralis-compendios-prototype";
  const keys = ["ha-proto-items","ha-proto-actors","ha-proto-journals"];
  const report = {
    schema: "HA-H7-CI137-QA-136-v01",
    world: game.world?.id ?? null,
    foundry: game.version,
    csb: game.system?.version ?? null,
    module: {id, active: game.modules.get(id)?.active ?? false,
             version: game.modules.get(id)?.version ?? null},
    packs: [], errors: [], warnings: [], readonly: true,
    runtimeApproved: false,
    generated: new Date().toISOString(),
  };
  try {
    const response = await fetch("modules/" + id + "/QA/expected_136.json", {cache:"no-store"});
    if (!response.ok) throw Error("expected_136.json: HTTP " + response.status);
    const expected = await response.json();
    if (expected.module !== id || expected.items !== 136 ||
        expected.folders !== 9 || expected.templates !== 5)
      throw Error("Incompatible QA identity manifest");
    for (const name of keys) {
      const p = game.packs.get(id + "." + name);
      if (!p) { report.errors.push("Missing pack " + name); continue; }
      const docs = await p.getDocuments();
      report.packs.push({pack:name,kind:p.documentName,count:docs.length});
      if (name !== "ha-proto-items") continue;
      const byId = new Map(docs.map(x => [x.id,x]));
      const wanted = new Map(expected.expectedIds.map(x => [x.id,x]));
      const missing = [...wanted.keys()].filter(x => !byId.has(x));
      const extra = [...byId.keys()].filter(x => !wanted.has(x));
      const bad = [];
      for (const [itemId, info] of wanted) {
        const doc = byId.get(itemId);
        if (!doc) continue;
        if (doc.system?.template !== info.template) bad.push(itemId + ":template");
        if (doc.folder?.id !== info.folderId) bad.push(itemId + ":folder");
      }
      const links = [];
      for (const doc of docs) {
        if (doc.img) links.push(doc.img);
        const bg = doc.flags?.["hiperaustralis-sheet"]?.background;
        if (bg) links.push(bg);
      }
      const legacy = links.filter(x => x.startsWith("modules/hiperaustralis-rituales/"));
      const own = links.filter(x => x.startsWith("modules/" + id + "/"));
      report.items = {expected:136,count:docs.length,distinctIds:byId.size,
        missing,extra,identityMismatches:bad,
        folderCount:new Set(docs.map(x=>x.folder?.id).filter(Boolean)).size,
        templateCount:new Set(docs.map(x=>x.system?.template).filter(Boolean)).size,
        legacyReferences:legacy.length,ownReferences:own.length};
      if (docs.length !== 136 || byId.size !== 136 || missing.length || extra.length || bad.length)
        report.errors.push("Item identities/folders/templates mismatch");
      if (legacy.length !== 99) report.errors.push("Unexpected legacy refs: " + legacy.length);
      else report.warnings.push("99 historical image/background URLs depend on disabled legacy module");
    }
    if (report.packs.length !== 3) report.errors.push("Three expected packs not present");
    if (report.packs.find(x=>x.pack==="ha-proto-actors")?.count !== 1)
      report.errors.push("Actor pack count expected 1");
    if (report.packs.find(x=>x.pack==="ha-proto-journals")?.count !== 1)
      report.errors.push("Journal pack count expected 1");
    report.status = report.errors.length ? "BLOCKED" : "STRUCTURAL_PASS__RUNTIME_VISUAL_PENDING";
  } catch(e) {report.errors.push(String(e)); report.status="BLOCKED";}
  console.info("HIPERA7 CI137 QA SOLO LECTURA",report);
  if (typeof saveDataToFile === "function")
    saveDataToFile(JSON.stringify(report,null,2),"application/json",
      "HIPERA7_CI137_QA_" + report.generated.replace(/[:.]/g,"-") + ".json");
  ui.notifications?.info?.("H7/CI137: " + report.status + " — ver reporte.");
})();