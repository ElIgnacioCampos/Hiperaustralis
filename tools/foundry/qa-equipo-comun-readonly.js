/**
 * Hiperaustralis — auditoría de nueve Items de Equipo Común.
 * Foundry V14 + CSB 6.x; correr SOLO en mundo aislado.
 * NO crea, modifica, importa ni elimina documentos.
 * Verifica IDs históricos, nombre/tipo y carga de assets de staging.
 * La revisión visual humana sobre fondos claros/oscuros sigue pendiente.
 */
(async () => {
  const PACK_ID = "world.hiperaustralis-rituales";
  const MODULE_ID = "hiperaustralis-compendios-prototype";
  const base = "modules/" + MODULE_ID + "/assets/_staging/equipo/webp256/";
  const entries = [
    [13, "Qapu · Huso", "SbBJa9ACdFH2z86D", "aymara_qapu_huso.webp"],
    [17, "Knífr · Cuchillo", "EPqXIQm8A38zvtXw", "nordico_knifr_cuchillo.webp"],
    [20, "Eldjárn · Yesquero", "XhykrqOWzvB8abe9", "nordico_eldjarn_yesquero.webp"],
    [22, "Saum-nál · Aguja de coser", "VOtfeqh5KvQw6eF1", "nordico_saum_nal_aguja.webp"],
    [29, "Gancho de atalaje", "YuTiSkP9Mx7FvJy7", "lickanantay_gancho_atalaje.webp"],
    [35, "Chinguillo · Bolsa-red", "CBIQgRyTGVMq6RCP", "chinchorro_chinguillo.webp"],
    [36, "Chope · Desconchador", "Cal0I8l96tdRm1pR", "chinchorro_chope.webp"],
    [38, "Canasto", "8a526Vqfx3hsafi3", "chinchorro_canasto.webp"],
    [40, "Punzón de hueso", "MX9mAxfkdCwvEvkZ", "chinchorro_punzon_hueso.webp"]
  ];
  const pack = game.packs.get(PACK_ID);
  const report = {
    scope: "hiperaustralis-equipo-comun-readonly",
    timestamp: new Date().toISOString(),
    foundryVersion: game.version,
    csbVersion: game.system?.version ?? null,
    world: game.world?.id ?? null,
    readonly: true,
    sourcePackFound: Boolean(pack && pack.documentName === "Item"),
    prototypeModuleFound: Boolean(game.modules.get(MODULE_ID)),
    results: []
  };
  for (const [number, name, id, image] of entries) {
    const row = {number, name, id, asset: base + image, itemFound: false,
                 itemNameMatches: false, existingImg: null, assetLoaded: false,
                 dimensions: null, problems: []};
    if (!report.sourcePackFound) row.problems.push("El compendio histórico no está accesible");
    else {
      try {
        const item = await pack.getDocument(id);
        row.itemFound = Boolean(item);
        if (!item) row.problems.push("ID histórico no localizado");
        else {
          row.itemNameMatches = item.name === name;
          row.existingImg = item.img ?? null;
          if (!row.itemNameMatches) row.problems.push("Nombre distinto: " + item.name);
          if (item.system?.props?.hipera_tipo !== "equipo")
            row.problems.push("hipera_tipo distinto de equipo");
        }
      } catch (e) { row.problems.push("Lectura Item: " + String(e)); }
    }
    try {
      const response = await fetch(row.asset, {cache: "no-store"});
      if (!response.ok) throw new Error("HTTP " + response.status);
      const bitmap = await createImageBitmap(await response.blob());
      row.dimensions = [bitmap.width, bitmap.height];
      row.assetLoaded = bitmap.width === 256 && bitmap.height === 256;
      bitmap.close?.();
      if (!row.assetLoaded) row.problems.push("Asset no mide 256 × 256");
    } catch (e) { row.problems.push("Carga de WebP: " + String(e)); }
    report.results.push(row);
  }
  report.itemsVerified = report.results.filter(r => r.itemFound && r.itemNameMatches).length;
  report.assetsVerified = report.results.filter(r => r.assetLoaded).length;
  report.failures = report.results.reduce((n, r) => n + r.problems.length, 0);
  report.status = report.failures ? "INCOMPLETE" : "READONLY_PASS_VISUAL_QA_PENDING";
  console.info("Hiperaustralis Equipo Común — solo lectura", report);
  if (typeof globalThis.saveDataToFile === "function") {
    globalThis.saveDataToFile(JSON.stringify(report, null, 2), "application/json",
      "HIPERA_EQUIPO_QA_READONLY_" + report.timestamp.replace(/[:.]/g, "-") + ".json");
  }
  ui.notifications?.info?.("QA Equipo Común: " + report.itemsVerified + "/9 Items, " +
    report.assetsVerified + "/9 imágenes; " + report.failures +
    " observaciones. Sin cambios en el mundo.");
})();
