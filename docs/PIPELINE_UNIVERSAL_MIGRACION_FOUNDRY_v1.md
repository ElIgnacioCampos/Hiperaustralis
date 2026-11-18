# Pipeline universal de migración Foundry — v1

Estado: diseño ejecutable inicial en rama de trabajo.  
Rama: \`work/native-compendia-pipeline\`.  
Base verificada: \`d8b9d9f4c4a22dc7efb9208219e32de783a542bc\`.

## Objetivo

Convertir la migración de Foundry en un proceso repetible, basado en inventarios inmutables, reconciliación automática, manifiestos y validación por lotes. Este pipeline no autoriza por sí mismo cambios en producción ni decide equivalencias semánticas ambiguas.

## Arquitectura

1. **Exportación de sólo lectura:** conservar los JSON íntegros de Foundry, con metadatos de procedencia, ámbito, pack, UUID, ID, carpetas y payload.
2. **Reconciliación automática:** cruzar IDs exactos; comparar hash íntegro y hash funcional; detectar colisiones, duplicados y candidatos por nombre.
3. **Manifiesto de migración:** registrar por documento la fuente de autoridad, ID, tipo, ruta, carpeta, estado, transformaciones y recursos.
4. **Transformación determinista:** aplicar adaptadores por tipo documental. Los originales nunca se modifican; las salidas se generan en staging.
5. **Validación:** estructura, referencias, integridad de recursos, dependencias, rutas, IDs y round-trip.
6. **QA de excepciones:** revisión humana sólo para diferencias funcionales, conflictos de autoridad, assets no resueltos y comportamiento visual/runtime.

## Herramienta incorporada

\`tools/foundry/reconcile-inventory.py\`

Compara un export Foundry con fuentes versionadas. Es de sólo lectura y genera un JSON de reconciliación.

### Uso

\`\`\`bash
python tools/foundry/reconcile-inventory.py \
  --inventory /ruta/HIPERAUSTRALIS_FOUNDRY_ITEMS.json \
  --source-root source/items \
  --out reports/reconciliation-items.json
\`\`\`

Para Actors:

\`\`\`bash
python tools/foundry/reconcile-inventory.py \
  --inventory /ruta/HIPERAUSTRALIS_FOUNDRY_ACTORS.json \
  --source-root source/actors \
  --out reports/reconciliation-actors.json
\`\`\`

## Clasificación

- \`IDENTICAL\`: payload JSON idéntico.
- \`METADATA_ONLY\`: igualdad funcional tras excluir sólo \`_stats\`, \`folder\` y \`sort\` de la comparación. Los payloads originales se conservan.
- \`CONTENT_DIFFERENCE\`: mismo ID, diferencia en contenido funcional.
- \`NAME_ONLY_REVIEW_REQUIRED\`: mismo nombre normalizado, distinto ID; candidato manual, nunca fusión automática.
- \`exportOnly\` / \`sourceOnly\`: documentos presentes sólo en uno de los dos corpus.
- \`duplicateIds\`: IDs repetidos dentro de los conjuntos comparados; se mantienen separados por procedencia.

La herramienta no usa nombres para decidir equivalencia. No extrae Items embebidos de Actors ni los convierte en documentos autónomos.

## Límites v1

- La reconciliación por ID compara cada registro exportado contra cada fuente que comparte ese ID; conserva el ámbito mundo/compendio.
- La coincidencia por nombre es una pista editorial, no una prueba.
- La exclusión de metadatos es conservadora y explícita. No ignora \`flags\`, \`system\`, efectos, descripciones, imágenes ni referencias.
- Las rutas de assets no se reescriben en esta etapa.
- La herramienta no compila packs ni escribe en Foundry. La compilación continúa bajo el workflow CI existente.

## Próxima validación

Ejecutar la herramienta sobre los exports ya disponibles:
- Items: 593 registros del export, con el pack histórico de 135 como subconjunto relevante.
- Actors: 176 documentos, con 170 Items embebidos preservados dentro de sus Actors.

Luego revisar el resultado de Armas, Reliquias y Kren; ajustar reglas sólo si la evidencia lo exige. Después ampliar el mismo contrato a Scenes, Journals, RollTables, Playlists, Macros y recursos multimedia mediante adaptadores específicos.

## Salvaguardas

- Sólo rama \`work/native-compendia-pipeline\`.
- No modificar \`main\`, Estado Maestro, mundo Foundry productivo, Forge productivo, módulo estable ni MELIAZ Bridge.
- No deduplicar por nombre ni por ID sin revisar procedencia y contenido.
- No cambiar rutas runtime hasta verificar los binarios de destino.
- Los packs originales permanecen como respaldo hasta QA aislado y aprobación explícita.
