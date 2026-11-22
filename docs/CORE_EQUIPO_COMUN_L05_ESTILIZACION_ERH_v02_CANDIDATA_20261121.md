# HIPERAUSTRALIS RPG — CORE / Equipo Común
## L05 · Estilización ERH v02 — LÁMINA CANDIDATA, sin aprobación final
**Fecha de continuidad:** 2026-11-21/22 (Chile) · **Rama:** `work/native-compendia-pipeline`.

### Encargo y autoridad
El autor confirmó con «vamos, trabajando» el trabajo de estilización del Lote 05 anunciado en el checkpoint anterior. **Autoriza preparar y evaluar una candidata visual, no sustituir iconos en Foundry ni modificar el manual.**

**Cuatro identidades mantenidas:**
- Arriba izquierda: Mortero de piedra (Mapuche), ID `7y88F6dSJK7HvqrN`.
- Arriba derecha: Snælda · Huso (Nórdicos), ID `w9DvGQFnGfW8GsiW`.
- Abajo izquierda: Saba · Saco (Lickanantay), ID `89egEPGh4AtrOMS0`.
- Abajo derecha: Anzuelo y sedal (banco histórico Chinchorro), ID `3v9D425QdKOva3XV`.

### Resultado generado
Se ejecutó **una transformación pictórica** para reducir el acabado casi hiperrealista del L05 anterior. Se preservaron la selección, orden, funciones y composición general de los cuatro objetos, con variaciones de textura y detalles interiores propios del nuevo render. **No son píxeles idénticos al original ni se declara que la transformación conserve exactamente el contorno.**

La nueva imagen también llegó con **cuadrícula de transparencia dibujada**, en RGB. La cuadrícula se eliminó técnicamente mediante una máscara de crominancia aplicada a los cuatro componentes principales. Se creó una **lámina RGBA con alfa real**, sin volver a dibujar los objetos en esa etapa.

**Archivo candidato:** `EQ_COMUN_L05_LAMINA_ERH_ESTILIZADA_ALFA_REAL_v02_CANDIDATA.png`.
**SHA-256:** `d41c995cd7f110202f712d8ecb91f1fb2bac1fd5ec9b0c18ed9f1dca4dbf77dc`.
**Dimensiones:** 1254×1254, modo RGBA, canal alfa `0..255`.
**Respaldo BBTECA confirmado:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/EQ_COMUN_L05_LAMINA_ERH_ESTILIZADA_ALFA_REAL_v02_CANDIDATA.png`.

**Original v01 preservado (separado):** `HIPERA_EQUIPO_COMUN_L05_LAMINA_MORFOLOGIA_APROBADA_ESTILO_PENDIENTE_v01.png`, SHA-256 `15ec2ff55829691aa42cb0815cbbeb9e53aee884c177c343864597d45df88b89`.

### Examen de estilo y QA visual
- Se percibe **menos iluminación de estudio y menor hiperrealismo**, más superficie de gouache/pigmento mineral, con ocres, tierra tostada, carbón y color hueso.
- Siguen reconocibles las funciones de mortero/cavidad y mano, huso/tortera y lana, saco/costura reparada, anzuelo y sedal.
- **Inspección visual efectuada** sobre fondos claro y oscuro; contornos útiles y sin halo significativo visible en el conjunto.
- **Prueba visual a 64px:** las cuatro siluetas siguen reconocibles. En el saco, se aprecia la reparación; en el huso, tortera; en la pesca, anzuelo y rollo de cuerda.
- **Reserva:** el detalle interno sigue siendo relativamente alto, especialmente en piedra y fibras, en comparación con la síntesis máxima del ERH canonizado. Se entrega para juicio autoral; no se declara automáticamente **aprobado**.
- La máscara cromática de extracción del alfa es una solución técnica: no demuestra fidelidad literal de cada fibra separada ni cierre del QA de iconos por separado.

### Decisión de proceso
- **L05 v02:** una única lámina candidata para aprobación visual.
- **No se extrajeron** todavía cuatro maestros PNG individuales 512 ni cuatro WebP de Foundry 256 para evitar multiplicar variantes antes de aprobación.
- **No se cambió** `img` de ninguno de los Items del compendio; no se tocó el sistema CSB, Bridge, `main`, módulo estable, mundo Foundry productivo ni Estado Maestro.
- **L01–L04:** aprobados en su propia continuidad y no modificados durante esta revisión.
- **Pendiente:** decisión del autor sobre el equilibrio entre materialidad/legibilidad y simplificación de ERH; luego, únicamente si procede, derivación de imágenes y QA aislado de Foundry.

### Cierre
**Decisiones:** ejecutada estilización ERH; candidato original preservado y copia con alfa real respaldada. Ninguna promoción runtime.
**Pendientes:** ratificación visual de L05 v02, normalización a 512/256 si se aprueba y QA en Foundry aislado.
**Fuentes:** `CORE_EQUIPO_COMUN_L05_REVISION_INDIVIDUAL_Y_BALANCE_40_ITEMS_20261121_v02.md`, `CORE_EQUIPO_COMUN_L01_APROBADO_Y_L05_PENDIENTE_20261121_v05.md`, canon `Estilo_Rupestre_Hipera_Canonizado_v01.md`, fuente y candidata generadas en chat.
**Cambios al Estado Maestro:** ninguno.
