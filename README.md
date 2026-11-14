# Hiperaustralis — implementación Foundry

Repositorio técnico para la migración declarativa del corpus de Hiperaustralis RPG y el prototipo independiente de compendios nativos.

## Estado actual

- Rama de trabajo: `work/native-compendia-pipeline`.
- Pull request #1 abierto hacia `main`, en draft y sin merge.
- `main`, MELIAZ Bridge y el módulo productivo permanecen fuera de este frente.
- Prototipo de compendios nativos: Foundry V14.367 + Custom System Builder 6.0.0 mínimo.
- Tres packs fixture compilados: Item, Actor y JournalEntry.
- CI #105 verificó la jerarquía interna de carpetas del pack Item, compilación y round-trip. Esto no equivale a instalación ni QA visual en Foundry/Forge.
- El prototipo sigue siendo fixture técnico; no es el corpus completo ni el módulo final.

## Estructura de fuentes y control

- `source/items/armas/`: 20 Items Foundry preservados como JSON.
- `source/items/01_cuchillo_piedra.json`: Item independiente de referencia.
- `source/items/reliquias/` y familias de Reliquias: 16 registros recuperados más Tokicura como fuente independiente.
- Total actual en el árbol fuente: 38 Items; no representa el inventario histórico completo de 135.
- `source/actors/`: Actor fixture.
- `source/journals/`: JournalEntry fixture, restaurado por el workflow desde su representación comprimida.
- `manifests/items-armas.json`: inventario de los 20 Items de armas y sus hashes.
- `manifests/reliquias-assets.json`: inventario y hashes de los 16 WebP de reliquias; Tokicura se documenta separadamente.
- `TRANSFER_MANIFEST.json`: inventario declarativo del lote de assets, no certificado autónomo de presencia de cada ruta.
- `module/assets/_staging/`: derivados WebP de Equipo, Defensas, Instrumentos ERH y Turianos; permanecen en staging, sin referencias runtime nuevas.
- `docs/MATRIZ_CRUCE_ASSETS_FOUNDRY_v01.md`: cruce preliminar entre assets, Items/Actors históricos y límites de evidencia.
- `tools/foundry/export-items-inventory.js`: exportador de sólo lectura de Items del mundo y compendios `world.*`.
- `docs/EXPORT_INVENTARIO_FOUNDRY_ITEMS.md`: instrucciones de ejecución del exportador.
- `module/`: manifiesto y salida del módulo prototipo.
- `docs/`: arquitectura, auditorías y checkpoints.
- `.github/workflows/`: pipeline de compilación cloud.

## Arquitectura y salvaguardas

- El nuevo módulo es independiente de `hiperaustralis-rituales`.
- No modificar MELIAZ Bridge ni el módulo estable.
- No migrar ni borrar compendios `world.*`.
- No desplegar sobre el mundo productivo.
- Mantener originales y referencias históricas hasta completar inventario y QA.
- Reconciliar documentos por `_id`, UUID y `compendiumSource`; no colapsar registros sólo porque compartan nombres o seedId.
- No asignar IDs finales ni crear packs de producto antes de conocer el inventario.
- No promover recursos de staging a runtime sin vincularlos a su documento Foundry y auditar sus referencias.
- Distinguir binarios presentes, rutas declaradas en manifiestos y archivos aún no verificados.

## Paquete CI104 y transferencia de assets

El ZIP recibido contiene:
1. 69 recursos de staging: 29 WebP de Equipo, 8 WebP de Defensas, 28 WebP de Instrumentos ERH y 4 WebP Turianos.
2. 17 recursos de Reliquias bajo el paquete, incluidos los 16 cotejados con el manifiesto y Tokicura.
3. Tres packs LevelDB compilados.

`TRANSFER_MANIFEST.json` declara 108 registros físicos: los 69 derivados WebP, 37 PNG maestros de Equipo/Defensas, y los dos recursos de Tokicura. Las consultas directas confirmaron varias rutas WebP y los dos recursos de Tokicura. Cuatro rutas de PNG maestro comprobadas devolvieron 404; la presencia del conjunto de 37 masters no está acreditada. Ver `docs/MATRIZ_CRUCE_ASSETS_FOUNDRY_v01.md`.

Los assets de staging no están vinculados todavía a documentos fuente canónicos de todas sus familias. No se han actualizado rutas runtime de Equipo, Defensas o Instrumentos ni se han creado Items/Actors para rellenar el inventario.

## Pipeline de prueba existente

El workflow:
1. restaura el Journal comprimido;
2. instala Foundry CLI 3.0.5;
3. valida los documentos fixture;
4. prepara campos temporales `_key`;
5. compila los tres packs LevelDB;
6. desempaqueta y compara IDs, nombres, páginas y jerarquía de carpetas;
7. empaqueta un ZIP y calcula SHA-256.

La validación actual no acredita igualdad semántica completa, integridad global de assets, ausencia de dependencias del módulo antiguo ni funcionamiento en Foundry.

## Siguiente hito

Ejecutar el exportador de Items en el mundo de Foundry que contiene las fuentes históricas. Reconciliar los 135 Items con IDs, UUID, carpetas, payload y rutas reales. Después, incorporar fuentes por lotes verificables, resolver los PNG maestros pendientes y ampliar los validadores. La instalación y QA visual/funcional del módulo siguen pendientes.
