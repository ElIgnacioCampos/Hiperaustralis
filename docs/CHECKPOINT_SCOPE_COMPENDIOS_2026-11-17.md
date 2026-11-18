# Checkpoint de alcance — Compendios nativos Foundry
Fecha: 2026-11-17
Rama: `work/native-compendia-pipeline`
PR: #1 — draft, abierto, sin merge.

## Decisiones de alcance

1. **Territorios queda fuera del lote de migración actual.** La nomenclatura anterior de Biomas fue sustituida por Territorios. Su estructura y contenidos están pendientes de resolución autoral por el usuario; no se completan, reinterpretan ni migran en este bloque.
2. No crear ni validar Journals de Territorios, Items territoriales, carpetas territoriales, ni relaciones territorio/procedencia como parte del cierre actual.
3. Conservar intactos los archivos existentes bajo `source/territorios/`, `manifests/territorios-migracion.json` y los documentos históricos relacionados. No eliminarlos ni convertirlos en especificación vigente.
4. El cierre actual se concentra en el corpus no territorial: Items/Objetos históricos, Armas, Defensas, Equipo común, Instrumentos, Parafernalia, Reliquias y Rituales; además de Actors/Bestiario y Journals no territoriales que se puedan acreditar con fuentes.
5. Mantener la separación de tipos Foundry y procedencias. No convertir automáticamente Journals en Items ni Items en Actors; no deduplicar por nombre; conservar IDs, UUID, flags, payloads y referencias.
6. El prototipo actual de 38 Items y tres packs sigue siendo fixture técnico, no migración integral.

## Evidencia recuperada

- Export Foundry V14.367 + CSB 6.0.2 de Items: 593 documentos exportados en cuatro ámbitos; el pack histórico `world.hiperaustralis-rituales` contiene 135 Items distribuidos en ocho carpetas.
- Export independiente de Actors: 176 documentos; 104 del mundo y 72 de compendios. Contiene 170 Items embebidos en 11 Actors; no convertirlos automáticamente en Items autónomos.
- Los 20 IDs de Armas coinciden con el manifiesto de armas; igualdad de ID no sustituye el cotejo del payload.
- Los 16 pares de Reliquias con nombre coincidente y distinto ID se conservan como versiones paralelas hasta comparación semántica.
- Kren presenta dos versiones no equivalentes entre mundo y compendio; permanece como conflicto.
- Los binarios del paquete 0.4.75 siguen sin estar disponibles como bytes inspeccionables en esta sesión. La ficha histórica registra su identidad y hash de respaldo, pero eso no equivale a haber abierto y cotejado el ZIP.

## Próxima secuencia de trabajo

1. Recuperar los bytes verificables del ZIP 0.4.75 y los exports de Items/Actors, o reexportarlos desde Hipera 5 si siguen disponibles.
2. Incorporar los 135 Items históricos como fuentes legibles, preservando IDs y carpetas, y generar manifiesto por documento.
3. Reconciliar Armas y Reliquias por payload, no sólo por nombre/ID.
4. Resolver y migrar las otras cinco familias del pack de 135 sin sustituir contenido ni inventar campos.
5. Resolver los binarios y rutas de imágenes documento por documento.
6. Reconciliar Actors y Journals no territoriales por ID, UUID, estructura y procedencia.
7. Extender validación automatizada a integridad semántica, referencias y assets; compilar y probar en mundo aislado Foundry V14 + CSB 6.0.2.

## Salvaguardas

- Sólo esta rama de trabajo.
- No modificar `main`, Forge productivo, MELIAZ Bridge ni el módulo estable.
- No mergear ni publicar release sin QA completo y aprobación explícita.
- No modificar el Estado Maestro.

## Cierre del bloque

**Decisiones:** Territorios aplazado por decisión autoral; migración actual enfocada en corpus no territorial y preservación exacta de fuentes.

**Pendientes:** recuperación de ZIP/export originales, migración completa de Items, reconciliación de Actors/Journals, assets, build y QA runtime.

**Fuentes:** PR #1, `docs/AUDITORIA_INVENTARIO_FOUNDRY_2026-11-14.md`, `docs/AUDITORIA_INVENTARIO_FOUNDRY_ACTORS_2026-11-14.md`, `docs/RECONCILIACION_ITEMS_HISTORICOS_2026-11-14.md`, `docs/CHECKPOINT_ASSET_CROSSWALK_2026-11-14.md`, inventario de recuperación 2026-11-10.

**Cambios al Estado Maestro:** ninguno.
