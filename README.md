# Hiperaustralis — implementación Foundry

Repositorio técnico para la migración declarativa del corpus de Hiperaustralis RPG y el prototipo independiente de compendios nativos.

## Estado actual

- Rama de trabajo: `work/native-compendia-pipeline`.
- Pull request #1 abierto hacia `main`, en draft y sin merge.
- `main`, MELIAZ Bridge y el módulo productivo permanecen fuera de este frente.
- Prototipo de compendios nativos: Foundry V14.367 + Custom System Builder 6.0.0 mínimo.
- Tres packs compilados: Item, Actor y JournalEntry.
- CI #98 verificó validación de fuentes, compilación y round-trip de los tres packs. Esto no equivale a instalación ni QA de runtime en Foundry/Forge.
- El prototipo sigue siendo fixture técnico; no es el corpus completo ni el módulo final.

## Estructura de fuentes y control

- `source/items/armas/`: lote de 20 Items Foundry preservados como JSON, con sus IDs y metadatos originales.
- `source/items/reliquias/tokicura.json`: fuente independiente de Tokicura, todavía en estado editorial draft.
- `source/actors/`: fuente Actor fixture.
- `source/journals/`: JournalEntry fixture, restaurado por el workflow desde su representación comprimida.
- `manifests/items-armas.json`: inventario de los 20 Items de armas y sus hashes.
- `manifests/reliquias-assets.json`: inventario y hashes de los 16 WebP de reliquias; Tokicura se documenta separadamente.
- `module/`: manifiesto y salida del módulo prototipo.
- `docs/AUDITORIA_CI104.md`: auditoría del ZIP CI104 recibido y límites de migración.
- `.github/workflows/`: pipeline de compilación cloud.

## Arquitectura y salvaguardas

- El nuevo módulo es independiente de `hiperaustralis-rituales`.
- No modificar MELIAZ Bridge ni el módulo estable.
- No migrar ni borrar compendios `world.*`.
- No desplegar sobre el mundo productivo.
- Mantener originales y referencias históricas hasta completar inventario y QA.
- Reconciliar documentos por `_id`; no colapsar registros sólo porque compartan nombres o seedId.
- No asignar IDs finales ni crear packs de producto antes de conocer el inventario.
- No promover recursos de staging a runtime sin vincularlos a su documento Foundry y auditar sus referencias.

## Paquete CI104

El ZIP recibido contiene tres clases de contenido que deben mantenerse separadas:
1. 69 assets de staging (defensas, equipo, instrumentos ERH y retratos turianos).
2. 17 copias runtime de reliquias, cuyos hashes fueron cotejados con el manifiesto.
3. Tres packs LevelDB compilados.

La auditoría confirma integridad del ZIP y correspondencia de hashes de reliquias. No acredita que los 69 recursos de staging hayan sido migrados al repositorio ni que el ZIP sea una fuente editable del corpus.

## Pipeline de prueba existente

El workflow:
1. restaura el Journal comprimido;
2. instala Foundry CLI 3.0.5;
3. valida los documentos fixture;
4. prepara campos temporales `_key`;
5. compila los tres packs LevelDB;
6. desempaqueta y compara IDs, nombres y cantidad de páginas;
7. empaqueta un ZIP y calcula SHA-256.

La validación actual no acredita igualdad semántica completa, integridad global de assets, ausencia de dependencias del módulo antiguo ni funcionamiento en Foundry.

## Siguiente hito

Construir el cruce declarativo entre cada asset de staging y su documento Foundry de origen: categoría, nombre visible, `_id`, ruta de imagen y procedencia. Después, migrar en lotes verificables con hashes y ampliar validadores. La instalación y QA visual/funcional del módulo siguen pendientes.
