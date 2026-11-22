# HIPERAUSTRALIS — CI137 / CHECKPOINT ÚNICO ACTUAL
**Fecha:** 2026-11-22  
**Frente:** CORE / Implementación — migración de 137 Items históricos a compendio nativo  
**Ámbito:** rama `work/ci137-ensayo-identidad-historica-20261121` exclusivamente  
**Estado:** IDENTIDADES Y FUENTES RECUPERADAS / ASSETS HISTÓRICOS RESCATADOS / NO PUBLICABLE

> **Este es el checkpoint operativo único del bloque CI137.** Las actas y matrices anteriores quedan como evidencia archivada, NO como tareas sucesivas. El Estado Maestro general no se modifica sin aprobación.

## 1. Resultado consolidado (sin volver a auditar)
| Unidad | Evidencia acreditada | Estado |
|---|---|---|
| 137 Items, nueve carpetas | staging histórico CI137 v02 y variante con 135 IDs históricos + 2 extras, PASS offline | **CERRADO estructuralmente; no runtime** |
| 99 Items de cinco familias | JSON originales recuperados de export real Hipera 5; incluidos en rama aislada | **CERRADO documentalmente** |
| 16 Reliquias históricas y 16 del prototipo | dos juegos de IDs preservados; equivalencias de contenido/imagen conocidas | **CERRADO el cotejo; PENDIENTE decidir autoridad/UUID** |
| 20 Armas históricas | JSON/IDs preservados; 20 WebP 512 recuperados desde 0.4.72/0.4.73 con SHA coincidentes | **CERRADO rescate histórico; no selección artística final** |
| 22 Parafernalia y ocho Rituales | 30 JSON cotejados 1:1 con rutas; 30 WebP recuperados y cotejados entre 0.4.72/0.4.73 | **CERRADO rescate histórico** |
| Ocho Defensas y 21 Instrumentos | 29 WebP recuperados de 0.4.72/0.4.73, con igualdad SHA entre versiones | **CERRADO rescate histórico; no sustitución de ERH finales** |
| 16 WebP Reliquias + Tokicura | ZIP de 16 y archivo Tokicura registrados en GitHub | **ACREDITADO por fuente anterior; sin repetir auditoría** |
| Recursos extra en staging GitHub | 69 WebP de Equipo/Defensas/ERH y ZIP Reliquias más Tokicura; son otro inventario | **NO fusionar por semejanza** |
| Cuchillo de piedra `HipArm01PackA000` | distinto de Cuchillo lítico; su `01_cuchillo_piedra.webp` no fue localizado | **BLOQUEO REAL** |
| Foundry CLI / QA V14.367 + CSB 6.1.2 | en los checkpoints no consta compilación/round-trip de variante 137, ni QA runtime | **BLOQUEO REAL** |

**Nota fundamental:** `79` WebP locales (20+30+29) recuperados de 0.4.72/0.4.73 **no son 79/96 hashes validados contra el staging previo**. Constituyen una copia histórica alternativa. Los **96** del staging v02 del 18–19/11 quedaron acreditados entonces, pero sus paquetes completos no fueron localizados ahora. No sumar ni reemplazar automáticamente ambas fuentes.

## 2. Lo que NO se hará de nuevo
- No reabrir búsqueda interminable de ZIP por el mismo nombre. Ya se comprobó que 0.4.75 no aparece por búsqueda de título en las fuentes consultadas.
- No volver a validar en bucle que 0.4.72 = 0.4.73: prueba realizada para **79 WebP**.
- No repetir clasificación léxica de los 137 Items: la matriz v05 sólo es evidencia de compatibilidad del árbol de GitHub, **no** criterio de existencia física ni autoridad visual.
- No producir un documento/commit por cada verificación menor.
- No volver a construir fuentes JSON, reimaginar 96 iconos, ni volver a comparar 16 Reliquias semánticamente.
- No bloquear **todo el proyecto** por la ausencia del ZIP 0.4.75: ese cotejo queda como **gate de procedencia sólo para una futura promoción de sus binarios**.

## 3. Pendientes mínimos, en orden
**P1 — Arte aprobado:** localizar únicamente fuente final de ARM-11–13 (256 transparente; respaldo posterior) y recurso independiente de Cuchillo de piedra. Si no se encuentran, registrar incidencia y mantener placeholder/ruta original, sin suplantación.

**P2 — Destino de Reliquias: DECIDIDO.** Los 16 IDs históricos serán la identidad principal; 16 IDs de prototipo como alias documentales. La ejecución y los remapeos UUID siguen sujetos a QA.

**P3 — Transferencia binaria controlada (cuando se pueda):** usar el staging v02 de 96 archivos si reaparece, o comparar por SHA la fuente 0.4.75 con el lote histórico 0.4.72/73. No exige otro inventario general. Un solo manifiesto agregado de SHA y asignaciones definitivas; no subir recursos 512 antiguos encima de versiones editoriales 256.

**P4 — CI/QA nativo:** compilar y probar **una variante seleccionada** con las cinco plantillas CSB y 137 Items en mundo V14/CSB6.1.2 aislado; verificar UUID, imágenes y persistencia, sin modificar producción.

## 3A. P2 — Propuesta de autoridad de Reliquias (DECISIÓN PREPARADA, NO APROBADA)

**Propuesta recomendada:** conservar los **16 IDs históricos** de `world.hiperaustralis-rituales` en la variante de transporte CI137; tratar los 16 IDs del prototipo como **alias documentales** para diagnóstico y reversión, no como una segunda colección publicada de Reliquias. La candidata histórica mantiene **135/135 IDs originales** de Hipera 5 y dos Items adicionales hasta sumar 137.

**Evidencia de partida:** manifiesto `source-pending/ci137-reliquias-historicas-16/manifest.json` con correspondencia 16/16 entre `historicalId`, `prototypeId`, `sourceUuid` y `storedAt`; checkpoint del 18–19/11: 32 copias mundiales para esas 16, propiedades y contenido equivalentes, sin necesidad de reabrir el cotejo semántico.

**Contrato para futura integración, sujeto a aprobación:**
1. Preservar en origen ambas variantes de 16 JSON y sus hashes; seleccionar **una sola** para el pack resultante. No eliminar ni sobrescribir la alternativa.
2. Mantener en la seleccionada `_id` histórico, `system.props`, `_stats`, flags y relaciones originales, salvo remapeos explícitos de rutas gráficas comprobadas y `folder` de transporte.
3. Usar una tabla de `sourceUuid` → UUID nuevo del pack (también `prototypeId` → `historicalId`). No reescribir en masa `_stats.compendiumSource`: indica procedencia, no necesariamente un enlace runtime.
4. Aun conservando el ID, el UUID completo cambia de `Compendium.world.hiperaustralis-rituales.Item.<ID>` a `Compendium.hiperaustralis-compendios-prototype.ha-proto-items.Item.<ID>`. No afirmar preservación del vínculo por conservar solo `_id`.
5. Antes de activar la variante, comprobar con Foundry CLI y mundo V14/CSB6.1.2 aislado los documentos que referencian UUID antiguos, Items embebidos, Journals, macros, las cinco plantillas CSB y rutas gráficas.
6. Fallo de cualquier referencia o de QA ⇒ no promover; rollback por sustitución de variante completa, no edición fragmentaria del mundo.

**Decisión del usuario (22/11/2026): APROBADA la autoridad de los 16 IDs históricos y el uso de los IDs del prototipo como alias documentales.** Esto autoriza el **criterio de selección de la variante CI137**, NO su publicación, ni migración de UUID, ni mutación de Items del mundo. La aplicación técnica queda sujeta a los gates de QA y procedencia del mismo checkpoint.

---

## 3B. P1 — Resolución de estado gráfico (sin nueva auditoría general)

**ARM-11, ARM-12 y ARM-13:** la continuidad del 09/11 identifica una serie **posterior** de WebP 256×256 transparentes y dos respaldos `RESPALDO_ARM_11-13_WEBP256_transparente.zip` y `RESPALDO_ARM_11-13_PNG1024_WEBP256.zip`. Se registró aprobación de diseño parcial (ARM-11); normalización posterior para ARM-12 y producción de ARM-13. Las referencias a candidatos de compendio `0.4.85`, `0.4.86` y `0.4.87` **no implican** aprobación de carga/QA runtime. Los bytes finales 256 no están localizados en las fuentes actuales. Los WebP 512 de 0.4.72/73 permanecen archivados como históricos.

**Cuchillo de piedra:** `HipArm01PackA000`, con `01_cuchillo_piedra.webp`, requiere arte propio. Prohibido sustituirlo por `01_cuchillo_litico.webp`. Fuente histórica/asset independiente **no localizado**.

**Dictamen de P1:** investigación y estado documental consolidados; **bloqueo de binarios finales** para ARM-11–13 y Cuchillo de piedra. No volver a solicitar búsqueda idéntica sin una fuente nueva; no publicar ni asignar imágenes antiguas como finales. P1 sólo se reabre ante hallazgo concreto de ZIP/archivo o export verificable. No convertir este bloqueo de iconografía en rediseño del CORE ni en un ciclo de auditorías.

**Próxima acción permitida:** preparar un solo lote técnico CI137 conservador con manifiesto de dependencias y gates explícitos, sin compendio publicado y sin rellenar rutas faltantes.

---

## 4. Recomendación de flujo
1. **Congelar auditoría de rescate:** registrar el corpus como fuente recuperada, sin buscar más copias por inercia.
2. Resolver **P1 y P2** en una matriz breve de decisiones; mantener dudas sin inventar aprobación.
3. Hacer **un único lote de integración** bajo rama aislada; QA estructural + CI + QA runtime.
4. Publicar/actualizar Estado Maestro sólo tras revisión del resultado y aprobación expresa.

## 5. Referencias preservadas (históricas, no checkpoints activos)
- `CHECKPOINT_CORE_GITHUB_FOUNDRY_INVENTARIO_2026-11-18.md`: v04–v09, staging 137, 96 WebP, 141/143 referencias, gates y UUID.
- `docs/CI137_MATRIZ_ITEMS_ASSETS_2026-11-21_v05.json`: cruce léxico por rama, sólo diagnóstico.
- `docs/CI137_RESCATE_BINARIO_COMPARADO_0472_0473_2026-11-21.md`: rescate 30 Parafernalia/Rituales.
- `docs/CI137_ARMAS20_RESCATE_BINARIO_0472_0473_2026-11-22.md`: Armas 20.
- `docs/CI137_ARM_11_13_Y_RESCATE_DEF08_INS21_2026-11-22.md`: Defensas/Instrumentos y advertencia ARM.
- `docs/CI137_GATE_075_CIERRE_LOTE_PF22_RIT08_2026-11-22.md`: límite de cotejo con 0.4.75.
- Archivos locales: `CI137_CANDIDATO_0473_30_WEBP.zip`, `CI137_CANDIDATO_0473_ARMAS20_WEBP.zip`, `CI137_CANDIDATO_0473_DEF08_INS21_WEBP.zip` y sus manifiestos.

## 6. Decisiones / Pendientes / Fuentes / Cambios al Maestro
**Decisiones operativas:** se consolida un único checkpoint; se detienen búsquedas y auditorías redundantes; se mantiene archivada toda la evidencia sin borrados; no se promueven imágenes históricas por falta de prueba de autoridad final.  
**Pendientes:** P1–P4 exclusivamente.  
**Fuentes:** export Hipera 5 593, staging CI137 v02 y checkpoint 18–19/11, rama GitHub aislada, respaldos Drive v0.4.72/0.4.73 y actas de recuperación.  
**Cambios al Estado Maestro:** ninguno. **main, Bridge, Foundry y Forge:** intactos.
