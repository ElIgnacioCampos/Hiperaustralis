# HIPERAUSTRALIS — CORE / GitHub–Foundry · CHECKPOINT ÚNICO ACTUAL

**Corte:** 22-11-2026 · **Ámbito:** migración histórica del corpus no territorial · **Rama auditada:** `work/ci137-ensayo-identidad-historica-20261121` (`4282df2382e13e6b1e1de860a594fac7a51397d7` antes de este checkpoint).
**Dictamen:** **FUENTES RECUPERADAS / SELECCIÓN 137 VALIDADA / PIPELINE CI137 NO CONECTADO / NO PUBLICABLE**.

Este documento reemplaza operativamente los checkpoints CI137 anteriores, sin borrar su historial. **El único manifiesto activo de selección es `manifests/ci137-selected-source-137-historical-ids.json`.** Estado Maestro general sin cambios.

## 1. Diagnóstico central

El pipeline existente compila **38 Items de prototipo**, no los 137 históricos seleccionados. `prepare_sources.py` recorre sólo `source/items/`; **ignora `source-pending/` y el manifiesto CI137**. `validate_compiled.py` compara también contra `source/items/`. El workflow `.github/workflows/compile-native-packs.yml` sólo se dispara automáticamente mediante push sobre `work/native-compendia-pipeline` (además de permitir ejecución manual); **no hay run CI137 acreditado**.

Por tanto, no interpretar **SOURCE_PASS, ROUNDTRIP_PASS, Actions SUCCESS o ZIP v0.1.5** como validación de CI137. Los resultados son reales, pero se refieren al fixture de 38.

## 2. Inventario auditado en GitHub — qué existe de verdad

| Frente | Evidencia GitHub / histórica | Estado al corte |
|---|---|---|
| Selección CI137 | 137 registros, **137 IDs únicos, 137 rutas únicas, 137 archivos de origen presentes** en árbol de la rama | **CERRADO: selección de rutas**; no ejecución de los 137 JSON |
| Corpus original | 135 Items del pack `world.hiperaustralis-rituales` (export Hipera 5 de 593 Items): **99** de cinco familias + **20** Armas + **16** Reliquias | **RECUPERADO** documentalmente |
| Extras del prototipo | **Cuchillo de piedra** `HipArm01PackA000` y **Tokicura** `TokicuraRel0001` | Se incluyen en 137; no confundir con históricos |
| Estructura objetivo | 9 rutas de carpeta en manifiesto: Armas 21, Defensas 8, Equipo común 40, Instrumentos 21, Parafernalia 22, Rituales 8, Reliquias/Cotidianas 8, Reliquias/Legendarias 8, Reliquias raíz 1 | **DISEÑO DE SELECCIÓN**; no carpeta CI137 compilada |
| Reliquias | 16 IDs históricos y 16 alias del prototipo, cruce 1:1 en `source-pending/ci137-reliquias-historicas-16/manifest.json` | **DECISIÓN APROBADA:** IDs históricos; conservar alias, no duplicar pack |
| Pipeline nativo | Rama `work/native-compendia-pipeline`, HEAD `7e92f3b8`; run Actions `44961385066` SUCCESS | **CERRADO SÓLO PARA 38 FIXTURES**; PR #1 draft |
| Recursos visibles en la rama CI137 | 69 WebP en `_staging` (29 Equipo + 8 Defensas + 28 ERH + 4 Turianos), Tokicura WebP y ZIP de 16 Reliquias | **PRESENTES; NO EQUIVALENTES AUTOMÁTICOS** a 96 del staging histórico |
| Rescate histórico 18–22/11 | Checkpoint previo: 96 WebP staging y 141/143 referencias resueltas en **copia local v02**; nueva extracción: 79 WebP de backups v0.4.72/73 con SHA entre versiones | **EVIDENCIAS DISTINTAS**; 79 no son automáticamente 79/96 aprobados |
| Equipo común QA29 | Rama nativa: `manifests/equipo-comun-29-cruces-candidatos-20261121.json`; overlay en BBTECA: 20 WebP nuevos + nueve rutas de staging, 29 IDs candidatos; prueba real local 20/20 | **QA OFFLINE PARCIAL**; no QA en cliente Foundry, no replicado en CI137 |
| Actors históricos | Export 176 (104 mundo +72 compendios), 170 Items embebidos entre 11 Actors; Kren tiene dos versiones incompatibles | **INVENTARIADOS**; prototipo sólo compila un Actor fixture; migración pendiente |
| JournalEntry | Un Journal del prototipo con 21 páginas, restaurado desde fuente comprimida en CI | **FIXTURE COMPILADO**; no equivale a migración general de Journals |
| Territorios | Manifiestos/source preservados en GitHub y excluidos expresamente del lote no territorial | **FUERA DE ALCANCE** por decisión anterior; no incorporar ni rediseñar aquí |
| MELIAZ Bridge | Rama separada 0.24.203 con build de Actions SUCCESS | **BUILD** acreditado, QA en Forge no acreditado; no mezclar con CI137 |
| `main` y PR | `main` HEAD `7c54311`; PR #1 abierto, draft, **apunta a rama nativa, no a CI137** | **SIN MERGE / SIN DESPLIEGUE** |

### Nota crucial sobre los iconos

Los recursos gráficos **ya trabajados** no se vuelven a generar ni se rescatan por costumbre. El QA29 confirma que 20 iconos recientes están en un ZIP aprobado de BBTECA y que otros nueve ya están en staging GitHub. La ausencia de un recurso *en la rama CI137* no demuestra que falte en el proyecto. El paso útil es **referenciar correctamente los aprobados**, no inventariarlos otra vez. Los lotes históricos de 512 px no reemplazan las revisiones posteriores de 256 px.

## 3. Errores de diagnóstico anteriores — rectificación

1. Se presentó un preparador probado con **datos simulados** como paso hacia compilación real. **No constituye prueba CI137** ni sustituye el pipeline oficial; queda fuera de la autoridad de GitHub.
2. Se multiplicaron actas, manifests de rescate y búsquedas duplicadas de 0.4.75. Se **congelan como historial**; ninguna abre por sí misma un nuevo frente.
3. Se mezclaron tres contadores de imágenes: **69 en staging GitHub**, **79 históricos recuperados en ZIP locales** y **96 del checkpoint staging anterior**. Son conjuntos de distinta procedencia y validación; no se suman ni se reemplazan.
4. Se trató la falta de determinados iconos en la rama como falta de diseño. **Falso por alcance**: la línea visual posterior y el overlay QA29 existen en otros respaldos/ramas; sólo falta resolver su inclusión controlada.
5. El encabezado anterior «P2 propuesta no aprobada» era contradictorio con la decisión posterior del usuario. **P2 está APROBADO**.

## 4. Decisiones cerradas y barreras reales

**CERRADO / NO REABRIR:** 135 históricos + 2 extras; selección de 137 fuentes e IDs; decisión de 16 Reliquias históricas; distinción Cuchillo de piedra ≠ Cuchillo lítico; conservación de versiones de arte y del overlay QA29; Territorios fuera de este bloque; `main` y producción protegidos.

**GATE 1 — Conexión de fuentes (PRIORIDAD INMEDIATA):** adaptar el pipeline en la rama aislada para consumir **exactamente el manifiesto de 137**, elegir las Reliquias históricas en lugar de las 16 del prototipo y generar nueve carpetas sin alterar fuentes. El pipeline existente no lo hace. Encolar CI real sólo después de revisar fuentes y rutas.

**GATE 2 — Validador:** comparar el pack desempacado contra los **137 IDs del manifiesto** y nueve carpetas, no contra `source/items/` de 38. Verificar además cinco plantillas aplicables, igualdad de contenido sin transformaciones no autorizadas, UUID, imágenes y flags.

**GATE 3 — Assets:** resolver enlaces a iconos aprobados ya existentes usando manifiestos/QA29; no usar parecido de nombres ni sustituir archivos 256 por 512. Conservar pendiente específica del **Cuchillo de piedra** y cotejar autoridad de ARM-11–13 sólo cuando exista un binario final localizable. El backup 0.4.75 no es requisito para ejecutar **preflight estructural**, sí puede ser prueba de procedencia para la promoción de ciertos binarios.

**GATE 4 — Cliente:** instalar **sólo en mundo aislado** Foundry V14 + CSB compatible, abrir fichas, comprobar imágenes, carpetas, referencias antiguas, UUID y persistencia. Sin este QA no declarar módulo publicable.

**NO INCLUIR EN ESTE CICLO:** importación de 176 Actors, 170 Items embebidos, Territorios ni nuevas reglas. Son siguientes lotes con autoridad separada; Kren permanece conflicto no resuelto.

## 5. Paso siguiente único

**Implementar adaptador CI137 sobre el pipeline existente** y su validador, con entrada `manifests/ci137-selected-source-137-historical-ids.json` y salida en carpeta temporal. Debe fallar si no hay exactamente 137 documentos, si se duplican IDs, si alguna fuente falta, si se incorpora una Reliquia del prototipo en lugar de su identidad histórica o si faltan las nueve carpetas. Ejecutar preflight real y CI aislado; no generar iconos, ZIP de sustitución ni más actas. Publicación y migración de UUID siguen bloqueadas hasta QA.

## 6. Decisiones / Pendientes / Fuentes / Estado Maestro

**Decisiones:** conservar arte y fuentes; usar 16 IDs históricos; un solo checkpoint y un manifiesto; detener auditorías recurrentes; respetar PR draft y ramas separadas.
**Pendientes:** adaptador 137, validador/CI con datos reales, referencias gráficas aprobadas, QA cliente; luego Actors y resto de contenidos no territoriales en otro frente.
**Fuentes:** GitHub rama CI137 HEAD `4282df2`; rama nativa HEAD `7e92f3b`; workflow y tres validadores; manifiestos 99/16/137; QA29 v10; Actions `44961385066`; `docs/CHECKPOINT_SCOPE_COMPENDIOS_2026-11-17.md`; export y auditoría Actors 14/11; respaldo staging CI137 v02 y ZIPs históricos registrados.
**Cambios al Estado Maestro ACTUAL:** ninguno. **`main`, Foundry productivo, Forge y MELIAZ Bridge:** sin modificaciones.
