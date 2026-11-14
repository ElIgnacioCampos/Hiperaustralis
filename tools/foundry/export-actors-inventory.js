/**
 * Hiperaustralis — exportación de inventario de Actors Foundry
 * Compatibilidad objetivo: Foundry V14.
 * Sólo lectura. Incluye Items embebidos dentro de cada Actor.
 */
(async () => {
  const EXPORT_KIND = "hiperaustralis-foundry-actor-inventory";
  const errors = [];
  const recordsByUuid = new Map();
  const packCounts = {};
  const asArray = (c) => {
    if (!c) return [];
    if (Array.isArray(c)) return c;
    if (Array.isArray(c.contents)) return c.contents;
    if (typeof c.values === "function") return Array.from(c.values());
    return [];
  };
  const folderMap = new Map();
  for (const f of asArray(game.folders)) if (f.type === "Actor") folderMap.set(f.id, f);
  const folderPath = (folderId, localFolders = null) => {
    if (!folderId) return null;
    const map = localFolders ? new Map([...folderMap, ...localFolders]) : folderMap;
    const names = [], visited = new Set();
    let current = map.get(folderId);
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      names.unshift(current.name);
      const parent = current.folder;
      const parentId = typeof parent === "string" ? parent : parent?.id ?? null;
      current = parentId ? map.get(parentId) : null;
    }
    return names.length ? names.join("/") : null;
  };
  const addActor = (actor, sourceScope, sourcePack = null, localFolders = null) => {
    const object = actor.toObject();
    const folderId = typeof object.folder === "string" ? object.folder : object.folder?._id ?? object.folder?.id ?? null;
    const embeddedItems = Array.isArray(object.items) ? object.items : [];
    const record = {
      documentType: "Actor", sourceScope, sourcePack,
      uuid: actor.uuid ?? null, documentId: object._id ?? actor.id ?? null,
      name: object.name ?? actor.name ?? null, actorType: object.type ?? actor.type ?? null,
      folderId, folderPath: folderPath(folderId, localFolders),
      embeddedItemCount: embeddedItems.length, document: object
    };
    const key = record.uuid || [sourceScope, sourcePack, record.documentId].join(":");
    if (!recordsByUuid.has(key)) recordsByUuid.set(key, record);
  };
  for (const actor of asArray(game.actors)) addActor(actor, "world", null);
  for (const pack of asArray(game.packs)) {
    const collection = String(pack.collection ?? "");
    if (pack.documentName !== "Actor" || !collection.startsWith("world.")) continue;
    try {
      const localFolders = new Map(asArray(pack.folders).filter(f => f.type === "Actor").map(f => [f.id, f]));
      const actors = await pack.getDocuments();
      packCounts[collection] = actors.length;
      for (const actor of actors) addActor(actor, "world-compendium", collection, localFolders);
    } catch (error) {
      errors.push({ pack: collection, message: String(error?.message ?? error) });
    }
  }
  const folders = asArray(game.folders).filter(f => f.type === "Actor").map(f => {
    const parent = f.folder;
    const parentId = typeof parent === "string" ? parent : parent?.id ?? null;
    return { id: f.id, name: f.name, parentId, folderPath: folderPath(f.id), type: f.type, sorting: f.sorting ?? null, sort: f.sort ?? null };
  });
  const documents = Array.from(recordsByUuid.values()).sort((a, b) =>
    String(a.sourcePack ?? "").localeCompare(String(b.sourcePack ?? "")) ||
    String(a.folderPath ?? "").localeCompare(String(b.folderPath ?? "")) ||
    String(a.name ?? "").localeCompare(String(b.name ?? ""))
  );
  const byFolder = {}, byType = {};
  let embeddedItemTotal = 0;
  for (const r of documents) {
    const folder = r.folderPath ?? "(sin carpeta)";
    byFolder[folder] = (byFolder[folder] ?? 0) + 1;
    const type = r.actorType ?? "(sin tipo)";
    byType[type] = (byType[type] ?? 0) + 1;
    embeddedItemTotal += r.embeddedItemCount;
  }
  const payload = {
    schemaVersion: "1.0", exportType: EXPORT_KIND, exportedAt: new Date().toISOString(),
    foundry: { version: game.version ?? null, systemId: game.system?.id ?? null, systemVersion: game.system?.version ?? null, worldId: game.world?.id ?? null, worldTitle: game.world?.title ?? null },
    scope: { worldActors: true, worldActorCompendia: true, packsIncluded: Object.keys(packCounts) },
    summary: {
      totalUniqueActors: documents.length,
      worldActors: documents.filter(r => r.sourceScope === "world").length,
      compendiumActors: documents.filter(r => r.sourceScope === "world-compendium").length,
      embeddedItems: embeddedItemTotal, actorFolders: folders.length,
      byPack: packCounts, byFolder, byType, errors
    },
    folders, documents
  };
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `HIPERAUSTRALIS_FOUNDRY_ACTORS_${stamp}.json`;
  const json = JSON.stringify(payload, null, 2);
  if (typeof globalThis.saveDataToFile === "function") {
    globalThis.saveDataToFile(json, "application/json", filename);
  } else {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; anchor.click();
    URL.revokeObjectURL(url);
  }
  ui.notifications.info(`Inventario de Actors exportado: ${documents.length} Actors, ${embeddedItemTotal} Items embebidos. Errores: ${errors.length}.`);
  console.info("Hiperaustralis Actor inventory export", payload.summary);
})();
