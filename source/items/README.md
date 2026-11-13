# Pipeline de compendios y assets

Rama de trabajo: `work/native-compendia-pipeline`

## Lotes
- Items históricos: 135 documentos, ocho carpetas raíz; inventario en `docs/MIGRACION_ITEMS_PACK_AUTONOMO_v01.md`.
- Actualización de assets: inventario y reglas en `docs/ASSET_UPDATE_TURIANOS_INSTRUMENTOS_EQUIPO_TOKICURA_v01.md`.

## Separación de estados
- Documentación e inventarios: versionados.
- JSON canónicos de los 135 Items: pendientes de incorporación al árbol Git.
- Binarios Turianos / Instrumentos / Equipo / Tokicura: pendientes de incorporación al árbol Git.
- Build autónomo y QA Foundry aislado: pendientes.

No marcar como migrado ningún binario hasta verificar su presencia y SHA-256 en la rama. No modificar `main`, el módulo estable ni MELIAZ Bridge.
