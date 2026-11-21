# HIPERAUSTRALIS RPG — CORE / EQUIPO COMÚN
## Lote 02 · Aprobación autoral y entrega / Lote 03 · Prompt pendiente
**Fecha:** 2026-11-21 · **Rama:** `work/native-compendia-pipeline`.
**Regla:** no regenerar ítems ya ilustrados; nuevo lote siempre se describe en un prompt **antes** de generar.

### Lote 02 — APROBADO VISUALMENTE POR EL AUTOR
Aprobación expresa en el chat: **«aprobados»** (21-11-2026).

| Cuadrante | Item histórico / cultura | ID export Foundry 19-11 | Tratamiento aprobado |
|---|---|---|---|
| Superior izquierdo | Challa · Olla — Mapuche | `9u2kj6J5jcbZiVP6` | Olla de greda |
| Superior derecho | Ch'uspa · Bolsa pequeña — Aymara | `Y0QM677Ln8rfixg6` | Bolsa textil pequeña |
| Inferior izquierdo | Øx · Hacha — Nórdicos | `UZCgOpwUoDoYPAME` | **Hacha HERRAMIENTA**, no versión arma |
| Inferior derecho | Puco · Cuenco — Lickanantay | `yFT8cUZ71AOrxvN5` | Cuenco cerámico |

#### Entrega archivada
**ZIP:** `HIPERA_EQUIPO_COMUN_L02_APROBADOS_v02.zip`
**BBTECA:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L02_APROBADOS_v02.zip`
**Tamaño:** 4.592.840 bytes
**SHA-256 ZIP:** `1e7829b9512cd60f4a2da633c0a84bc6202d50f5fafa0ec8da4b4f0383ebc2ee`
**Contenido:** fuente 2×2 original sin modificación, cuatro PNG de 512px, cuatro WebP lossless de 256px, cotejo visual claro/oscuro, manifiesto con hashes y referencias al Item histórico, LEEME.
**Corrección técnica:** la lámina original RGB mostraba fondo cuadriculado incorporado, por lo que se extrajo el fondo de cada figura para obtener alfa real. Se mantuvo sin cambios el original aprobado.
**Verificaciones:** dimensiones, transparencia y empaquetado ZIP/CRC; contraste visual en fondo claro/oscuro inspeccionado. **NO comprobado**: visualización ni vinculación efectiva en cliente Foundry V14; no está promovido a `module/assets/` en runtime y no altera `img`.
**Estado:** APROBADO VISUAL, RESPALDADO EN BBTECA; PENDIENTE DE QA EN FOUNDRY AISLADO.
**Fuente aprobada:** `a_detailed_clean_illustration_on_a_transparent_ba.png` del chat 21-11 (preservada en ZIP como `LAMINA_2x2_ORIGINAL_APROBADA_SIN_MODIFICAR.png`).

### Lote 01 — estado no alterado
Külko, Uysu, Brýni y Ckarisur fueron generados antes como **CANDIDATOS** y no tienen en este chat una aprobación visual expresa. **No regenerarlos ni incluirlos en otro lote**. Deben volver a revisión de L01 como piezas independientes, con correcciones localizadas si se solicitan.

### Lote 03 — propuesta de cuatro ÍTEMS NO GENERADOS (PROMPT PREVIO; NO EJECUTAR AÚN)
Se comprobaron como no incluidos entre los 29 WebP del banco existente y distintos de los ítems producidos en L01 y L02:

1. **Witrü · Cuchara de madera — Mapuche** (`5nFewbreKtldDFdL`), una cuchara/utensilio de madera para servir o cocinar, no `mapuche_rufugue.webp` ni pieza ceremonial inventada.
2. **Q'ipi · Bulto de carga — Aymara** (`g2YB821BybKVvqgK`), bulto de textiles atado para transporte; no confundir con `aymara_wayaqa_talega.webp`, Ch'uspa ni bolsas de fuego.
3. **Ketill · Caldero — Nórdicos** (`PmTYfMVymolkOvkq`), recipiente de cocción de metal de época vikinga, de función doméstica; no vaso ceremonial ni arma.
4. **Canasto — Lickanantay** (`em5ML5e9yQyQCH2o`), cesto de fibra vegetal destinado a recolección/trasporte; diferenciar de `chinchorro_canasto.webp` y del Külko del L01. No atribuir patrón ornamental sin referencia.

#### Prompt de producción v01
**Crear una sola lámina cuadrada 2×2**, cuatro objetos aislados, cuadrantes ordenados según la enumeración anterior (arriba izquierda Witrü, arriba derecha Q'ipi, abajo izquierda Ketill, abajo derecha Canasto lickanantay). **NO comenzar hasta que el prompt haya sido presentado para revisión**.

Aplicar núcleo pictórico `Estilo_Rupestre_Hipera_Canonizado_v01.md`: paleta mineral mate (rojo hematita, ocre, tierra tostada, carbón y hueso), siluetas legibles, 3–7 masas visuales dominantes cuando proceda, desgaste localizado, contorno manual limpio y textura pictórica moderada. **Sin ilustración digital fotorrealista, brillo metálico, luces 3D o ruido excesivo.** Cuadrícula 2×2: 7% margen exterior, 12% separación central, ninguna pieza entre cuadrantes ni cortada.

**Fondo realmente transparente con alfa**, no dibujo de tablero de transparencia ni fondo blanco con cuadrados; sin etiquetas, leyendas, manos, personajes, soportes, sombreados sobre suelo, fondos de paisaje, símbolos inventados ni decoración indiscriminada. Para cada cultura usar morfologías plausibles sin fabricar continuidad cronológica o procedencia arqueológica de un artefacto específico. Cada pieza debe ser única, diferenciable de piezas ya generadas y reconocible a 64–128px.

**Control de salida:** lámina previa a revisión; no cortar ni convertir a WebP ni conectar a Foundry sin aprobación. El L02 aprobado debe preservarse intacto.

### Cierre
**Decisiones:** L02 aprobado por el usuario; mantener Øx como herramienta; normalizar y respaldar los cuatro recursos; no completar 40 iconos por obligación.
**Pendientes:** QA en Foundry aislado para L02, revisión L01, cotejo de tipologías del L03 y aprobación del prompt antes de nueva generación.
**Fuentes:** export Foundry 19-11; matriz de 40×29, checkpoint v07; manifiesto de L02; estándar ERH canonizado.
**Cambios al Estado Maestro:** ninguno. Ni `main`, Bridge, compendio histórico ni módulo productivo fueron alterados.
