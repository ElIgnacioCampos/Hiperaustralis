/**
 * Hiperaustralis — exportación de inventario de Items Foundry
 * Compatibilidad objetivo: Foundry V14.
 *
 * Sólo lectura:
 * - No crea, edita, mueve ni borra documentos.
 * - Exporta Items del mundo y de compendios world.* de tipo Item.
 * - Conserva _id, UUID, pack, folder, flags, payload y _stats.
 * - Incluye el árbol de carpetas Item del mundo.
 *
 * Uso: crear una Macro de tipo Script, pegar este archivo y ejecutarla
 * en el mundo de prueba/productivo que contiene los compendios de origen.
 */

(async () => {
  const EXPORT_KIND = "hiperaustralis-foundry-item-inventory";
  const errors = [];
  const recordsByUuid = new Map();
  const packCounts = {};

  const asArray = (collection) => {
    if (!collection) return [];
    if (Array.isArray(collection)) return collection;
    if (Array.isArray(collection.contents)) return collection.contents;
    if (typeof collection.values === "function") return Array.from(collection.values());
    return [];
  };

  const folderMap = new Map();
  for (const folder of asArray(game.folders)) {
    if (folder.type === "Item") folderMap.set(folder.id, folder);
  }

  const folderPath = (folderId, localFolders = null) => {
    if (!folderId) return null;
    const map = localFolders ? new Map([...folderMap, ...localFolders]) : folderMap;
    const names = [];
    const visited = new Set();
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

  const addDocument = (doc, sourceScope, sourcePack = null, localFolders = null) => {
    const uuid = doc.uuid ?? null;
    const object = doc.toObject();
    const folderId = typeof object.folder === "string"
      ? object.folder
      : object.folder?._id ?? object.folder?.id ?? null;

    const record = {
      documentType: "Item",
      sourceScope,
      sourcePack,
      uuid,
      documentId: object._id ?? doc.id ?? null,
      name: object.name ?? doc.name ?? null,
      itemType: object.type ?? doc.type ?? null,
      folderId,
      folderPath: folderPath(folderId, localFolders),
      document: object
    };

    const key = uuid || [sourceScope, sourcePack, record.documentId].join(":");
    if (!recordsByUuid.has(key)) recordsByUuid.set(key, record);
  };

  // Items directamente contenidos en el mundo.
  for (const doc of asArray(game.items)) {
    addDocument(doc, "world", null);
  }

  // Todos los compendios del mundo cuyo tipo nativo sea Item.
  for (const pack of asArray(game.packs)) {
    const collection = String(pack.collection ?? "");
    if (pack.documentName !== "Item" || !collection.startsWith("world.")) continue;

    try {
      const packFolders = asArray(pack.folders).filter(folder => folder.type === "Item");
      const localFolders = new Map(packFolders.map(folder => [folder.id, folder]));
      const documents = await pack.getDocuments();
      packCounts[collection] = documents.length;

      for (const doc of documents) {
        addDocument(doc, "world-compendium", collection, localFolders);
      }
    } catch (error) {
      errors.push({
        pack: collection,
        message: String(error?.message ?? error)
      });
    }
  }

  const folders = asArray(game.folders)
    .filter(folder => folder.type === "Item")
    .map(folder => {
      const parent = folder.folder;
      const parentId = typeof parent === "string" ? parent : parent?.id ?? null;
      return {
        id: folder.id,
        name: folder.name,
        parentId,
        folderPath: folderPath(folder.id),
        type: folder.type,
        sorting: folder.sorting ?? null,
        sort: folder.sort ?? null
      };
    });

  const documents = Array.from(recordsByUuid.values()).sort((a, b) => {
    const packCompare = String(a.sourcePack ?? "").localeCompare(String(b.sourcePack ?? ""));
    if (packCompare) return packCompare;
    const folderCompare = String(a.folderPath ?? "").localeCompare(String(b.folderPath ?? ""));
    if (folderCompare) return folderCompare;
    return String(a.name ?? "").localeCompare(String(b.name ?? ""));
  });

  const byFolder = {};
  for (const record of documents) {
    const key = record.folderPath ?? "(sin carpeta)";
    byFolder[key] = (byFolder[key] ?? 0) + 1;
  }

  const payload = {
    schemaVersion: "1.0",
    exportType: EXPORT_KIND,
    exportedAt: new Date().toISOString(),
    foundry: {
      version: game.version ?? null,
      systemId: game.system?.id ?? null,
      systemVersion: game.system?.version ?? null,
      worldId: game.world?.id ?? null,
      worldTitle: game.world?.title ?? null
    },
    scope: {
      worldItems: true,
      worldItemCompendia: true,
      actorDocuments: false,
      packsIncluded: Object.keys(packCounts)
    },
    summary: {
      totalUniqueItems: documents.length,
      worldItems: documents.filter(record => record.sourceScope === "world").length,
      compendiumItems: documents.filter(record => record.sourceScope === "world-compendium").length,
      itemFolders: folders.length,
      byPack: packCounts,
      byFolder,
      errors
    },
    folders,
    documents
  };

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `HIPERAUSTRALIS_FOUNDRY_ITEMS_${stamp}.json`;
  const json = JSON.stringify(payload, null, 2);

  if (typeof globalThis.saveDataToFile === "function") {
    globalThis.saveDataToFile(json, "application/json", filename);
  } else {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  ui.notifications.info(
    `Inventario exportado: ${documents.length} Items, ${folders.length} carpetas. ` +
    `Compendios con error: ${errors.length}.`
  );

  console.info("Hiperaustralis Item inventory export", payload.summary);
})();
