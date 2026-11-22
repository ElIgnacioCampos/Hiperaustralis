# HIPERAUSTRALIS · CORE / CI137 — CHECKPOINT ÚNICO ACTUAL
**Corte:** 22-11-2026. **Rama:** `work/ci137-ensayo-identidad-historica-20261121`.
**Estado:** **137/137 COMPILADOS, 16 WEBP APROBADOS INCORPORADOS AL STAGING, 109 REFERENCIAS HEREDADAS PENDIENTES. NO PUBLICABLE.**

Este archivo sustituye operativamente los checkpoints anteriores sin borrar antecedentes. Manifiesto único: `manifests/ci137-selected-source-137-historical-ids.json`.

## Resultado técnico probado (no simulado)
- **137 Items reales**, con **137 IDs únicos**, provenientes de **135 del export histórico + 2 adicionales** (Cuchillo de piedra y Tokicura); **9 carpetas**, **5 plantillas CSB**.
- Foundry CLI **3.0.5** compiló, desempaquetó y comparó nombre, tipo, imagen, sistema, efectos, flags, ownership y carpetas: **PASS**.
- Primer CI137 estructural: [Actions #44981432165](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44981432165).
- Segundo lote, **16 Reliquias históricas** mapeadas por **ID, alias, ruta original y SHA-256 de WebP** (no por nombre): [Actions #44981739482](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44981739482), **SUCCESS**.
- Los **16 WebP ya existentes** proceden de `source-original/HIPERAUSTRALIS_RELIQUIAS_ASSETS_16_WEBP_v01.zip` y `manifests/reliquias-assets.json`. El workflow verifica sus SHA y los entrega con el pack LevelDB en **un artefacto de prueba**. **32 referencias corregidas sólo en el transporte**: 16 campos `img` y 16 fondos de ficha. JSON históricos y originales intactos.
- Artefacto Actions **14738057398**, ZIP SHA-256 `3b3331152a8bad71f0f98f89c7a0a3cbfdeee9fdfeeda469bddc700fcfd7408b`; inspección física: **16 WebP, 137 Item round-trip PASS y CRC ZIP PASS**.
- **Antes:** 141 referencias heredadas. **Ahora:** 109 referencias heredadas (80 imágenes distintas); no autónomo todavía. La compilación no es prueba de funcionamiento de cliente Foundry.

## Cruce físico de 80 imágenes históricas

**79/80 archivos históricos localizados** en ZIPs 0.4.72/0.4.73 por ruta literal y con SHA coincidentes, cruzados con los documentos CI137. **Falta únicamente Cuchillo de piedra** (`armas/01_cuchillo_piedra.webp`). El manifiesto de 137 registra esos 79 por ID: 30 SHA publicados en GitHub y 49 hashes en manifiestos locales de rescate. **No implica aprobación editorial final, ni transferencia de archivos, ni remapeo de rutas.** Mantener ARM-11–13 posteriores como prioridad al recuperar sus binarios y no volver a auditar los 79 originales.

## Las 109 referencias restantes — segmentación sin nuevos inventarios
| Familia | Referencias heredadas | Distintas imágenes |
|---|---:|---:|
| Armas | 42 | 21 |
| Parafernalia | 22 | 22 |
| Instrumentos | 21 | 21 |
| Rituales | 16 | 8 |
| Defensas | 8 | 8 |
| **Total** | **109** | **80** |

**Regla:** no sustituir por parecido, no regenerar ilustraciones. Cotejar exclusivamente los binarios ya aprobados y sus manifiestos existentes. Los 79 WebP históricos 0.4.72/73, el staging previo de 96 y los 69 staging GitHub son inventarios **distintos**, no 79/96 imágenes aprobadas por equivalencia. El lote visual más reciente puede estar respaldado en BBTECA o en otra rama, no necesariamente en CI137.

## Continuidad de ramas y staging v02 — decisión operativa del 22-11-2026

**No volver a reconstruir 96 WebP ni interpretar 109 referencias de CI137 como 109 imágenes perdidas.** El staging anterior `CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip`, registrado en `docs/CI137_RECTIFICACION_CONTINUIDAD_ASSETS_2026-11-21.md`, ya había verificado **137 Items, nueve carpetas, 96 WebP y 141/143 referencias internas resueltas**. En la rama CI137 vigente sólo está integrado y probado el mapeo de las 16 Reliquias (32 referencias); **no constan los bytes ni las asignaciones completas de aquel staging v02 en esta rama**. Este es un desfase de continuidad entre artefactos y repositorio, NO una orden para repetir inventarios ni regenerar iconos.

**Consolidación transversal ejecutada:** de los 34 archivos exclusivos de `work/native-compendia-pipeline`, se incorporó a CI137 **sólo el corte vigente de Equipo común (QA29 v10), sus cuatro manifiestos de evidencia, dos CSV de cotejo, reporte QA offline y tres herramientas de sólo lectura (11 archivos)**, sin modificar su contenido ni trasladar 23 borradores intermedios. Estos ficheros son evidencia y herramientas, NO un segundo manifiesto operativo de selección CI137.

- **40 Items históricos de Equipo común**, 29 candidatos con identidad documentada, 20 WebP nuevos aprobados en BBTECA y nueve WebP en staging GitHub; QA binario local 20/20, **QA cliente Foundry no ejecutado**.
- **11 Items mantienen su iconografía de Foundry**; no se crean imágenes para cubrirlos.
- **No se aprobaron cambios runtime de `img` para los 29 candidatos**, aunque la creación de la ilustración y la integridad binaria estén documentadas.
- Los 34 archivos permanecen en la rama nativa. Se preserva el historial; sólo 11 archivos de continuidad se copian por SHA de blob **idéntico**.

**Puerta siguiente, única:** recuperar el *artefacto exacto del staging v02* o sus rutas/bytes desde su respaldo ya señalado y cotejarlo con el estado CI137. Si sus bytes no están disponibles, registrar **NO LOCALIZADO EN EL CHECKOUT**; no inferir que los iconos fueron perdidos ni retroceder al inventario 0.4.72/73. Preparar candidato instalable sólo con fuente y asset final acreditados. Luego QA real en Foundry aislado.

**Disciplina GitHub:** no modificar `manifests/ci137-selected-source-137-historical-ids.json` para registrar meros avances de auditoría; actualizar **únicamente este checkpoint**. Así las modificaciones documentales no disparan otra compilación de 137. El workflow vigente ya se ejecuta por cambios en fuentes, adaptador, selección o workflow, **no por cambios en este checkpoint ni en los manifiestos auxiliares de Equipo**. No crear nuevo PR ni fusionar PR #1; éste continúa en borrador sobre el prototipo de 38, no CI137.

## Estado transversal conservado
| Frente | Estado |
|---|---|
| 16 Reliquias | **Autoridad histórica APROBADA**; versiones del prototipo como alias documentales, sin duplicación |
| Armas ARM-11–13 | Arte posterior de 256 px documentado; no reemplazarlo con versiones 512 anteriores |
| Cuchillo de piedra | Item distinto de Cuchillo lítico; imagen propia no acreditada |
| Equipo común | **29 cruces candidatos** en la rama nativa; 20 WebP nuevos QA offline PASS en ZIP de BBTECA, nueve staged GitHub; **QA Foundry no ejecutado** |
| Pipeline prototipo | 38 Items compilados en rama `work/native-compendia-pipeline`; **PR #1 DRAFT** y sin merge |
| Actors | 176 documentos inventariados (104 mundo, 72 packs), 170 Items embebidos; Kren con versiones incompatibles; no migrado |
| Journals | Un fixture de 21 páginas compilado; no migración global |
| Territorios | Fuera del lote no territorial por decisión previa |
| Bridge | 0.24.203 compilado por CI en rama independiente; QA Forge separado |
| Main, Foundry, Forge | No modificados |

## Siguiente operación — una sola secuencia
1. **Recuperar el staging CI137 v02 ya integrado** (96 WebP y 141/143 referencias resueltas) a partir del respaldo exacto identificado en la rectificación 21/11. No reconstruir los 80 iconos históricos ni reusar 512 sobre 256 posteriores. Mantener separación de pendientes de ARM-11–13 y Cuchillo de piedra.
2. **Actualizar rutas sólo en transporte**, conservando ambos campos de Armas/Rituales cuando corresponda; fallar si un SHA o ruta de destino no coincide. Repetir CI137.
3. **QA en mundo aislado** Foundry V14/CSB sobre 137 fichas, carpetas, imágenes, UUID/compendiumSource y persistencia. No instalar en producción ni publicar sin aprobación.

## Fuentes / Decisiones / Pendientes / Estado Maestro
**Fuentes:** [Actions #44981739482](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44981739482), artefacto #14738057398, `tools/foundry/ci137_pipeline.py`, `manifests/reliquias-assets.json`, manifest CI137, QA29 v10 en rama nativa, checkpoints v02 de 18–19/11.
**Decisiones:** 16 IDs históricos, iconos aprobados existentes, ningún rediseño, un checkpoint y un manifiesto.
**Pendientes:** 109 referencias de imágenes, QA cliente, posterior publicación con autorización.
**Cambios al Estado Maestro:** ninguno. `main`, MELIAZ Bridge y producción intactos.
