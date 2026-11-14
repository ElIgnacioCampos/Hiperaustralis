# Pipeline de compendios y assets

Rama de trabajo: `work/native-compendia-pipeline`

## Lotes
- Items históricos: 135 documentos, ocho carpetas raíz; inventario en `docs/MIGRACION_ITEMS_PACK_AUTONOMO_v01.md`.
- Reliquias recuperadas: 16 Items desde el JSON monolítico 0.4.76; auditoría y procedencia en `docs/RECUPERACION_RELIQUIAS_16_ITEMS_2026-11-14.md`.
- Actualización de assets: inventario y reglas en `docs/ASSET_UPDATE_TURIANOS_INSTRUMENTOS_EQUIPO_TOKICURA_v01.md`.

## Separación de estados
- Documentación e inventarios: versionados.
- JSON canónicos de los 135 Items: pendientes de incorporación completa al árbol Git.
- Binarios Turianos / Instrumentos / Equipo: pendientes de incorporación al árbol Git.
- Reliquias: 16 JSON individuales incorporados y verificados por hash; validación CI y round-trip aprobados.
- Assets de Reliquias: 16 WebP fuente identificados en el ZIP 0.4.76 y auditados en `manifests/reliquias-assets.json`; todavía no están copiados al módulo nuevo. Las referencias de imagen de los Items siguen apuntando a `modules/hiperaustralis-rituales/`; no reescribir hasta disponer de los binarios en destino y verificar sus hashes.
- Build autónomo y QA Foundry aislado: pendientes.

## Validación de Items con plantilla
El validador coteja cada Item con la exportación de plantilla correspondiente en `source-original/foundry-templates/`: ID, versión y claves de `system.props` frente a `system.body.contents[]`. `hipera_tipo` se trata como metadato de clasificación y no como campo editorial de plantilla. La ausencia de `system.body` en el Item no constituye por sí sola un error: los valores se almacenan en `system.props`.

No marcar como migrado ningún binario hasta verificar su presencia y SHA-256 en la rama. No modificar `main`, el módulo estable ni MELIAZ Bridge.
