# HIPERAUSTRALIS RPG — CORE / IMPLEMENTACIÓN
## Equipo Común · L04 CERRADO — L05 PROMPT PREVIO 2×2
**Corte:** 2026-11-21 · **Rama:** `work/native-compendia-pipeline`
**Jerarquía:** APROBACIÓN AUTORAL DE ARTE > QA TÉCNICO DE DERIVADOS > CANDIDATOS DE INTEGRACIÓN.

### 1. Ratificación del Lote 04
La autorización del autor con **«ok»** ratifica el **retoque localizado del filo de la Hacha · Herramienta Lickanantay v02**. No autoriza cambio de imagen en el compendio ni afecta otras familias.

- Rali · Plato (Mapuche), ID `MVaSt17DYFT5CP5R`: APROBADO; **sin modificar el original**.
- Wakulla · Cántaro (Aymara), ID `iqLSPRD0g34ZMqTi`: APROBADO; sin cambios en la ornamentación original; atribución arqueológica específica de los motivos NO acreditada.
- Hacha · Herramienta (Lickanantay), ID `V70OePeRN8xLcbuy`: APROBADO v02, filo local mejorado; no se convierte en Arma.
- Estera de fibra vegetal (banco histórico Chinchorro), ID `WgYdtWEqZmWbZpuU`: APROBADO; sin modificar el original; la identidad arqueológica no implica continuidad cronológica a 1067.

**Verificación del retoque:** diferencia original↔v02 de exactamente 8834 píxeles RGB, restringidos a [476,779,610,925]; **ningún píxel de alfa cambiado**. Lámina original intacta.

### 2. Entregable técnico y conservación
**ZIP final L04:** `HIPERA_EQUIPO_COMUN_L04_APROBADOS_v02.zip` — **7.910.467 bytes**, SHA-256 `7424f3d700e9307230b6405eb66306e75ce7bbe1715c4983063c9bab478c263f`.
**Biblioteca persistente (BBTECA):** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L04_APROBADOS_v02.zip`.

Incluye:
- Lámina 2×2 fuente aprobada intacta + lámina v02 con retoque exclusivo del filo.
- 4 × PNG 512×512 RGBA con transparencia real.
- 4 × WebP 256×256 **lossless** con canal alfa.
- Manifiesto de objetos, IDs, hashes y archivo QA sobre fondo claro/oscuro.
- Limpieza de residuos alfa casi invisibles sólo en derivados. Extracción por máscara de componente completo y caja de objeto, no corte rígido por línea central: evita amputar partes del hacha/estera.
- Relectura de ZIP y CRC PASS; dimensiones y formato probados. **No se ha ejecutado QA en Foundry aislado ni se ha promovido ningún archivo a runtime**.

La corrección aislada anterior `HIPERA_EQUIPO_COMUN_L04_HACHA_FILO_v02_CANDIDATO.zip` y la base L04 permanecen como testigos de versión; no eliminar respaldos históricos sin consolidación aprobada.

### 3. Inventario de producción: evitar duplicados
- Banco previo noviembre: **29 WebP Equipo** con trazabilidad, de los que 9 tienen cruce semántico estricto con el compendio histórico.
- L01: Külko, Uysu, Brýni, Ckarisur: **4 imágenes ya generadas**, todavía candidatas; no regenerarlas ni computarlas como faltantes.
- L02: Challa, Ch'uspa, Øx (versión herramienta), Puco: **4 aprobadas**.
- L03: Witrü, Q'ipi, Ketill v02 sin patas, Canasto Lickanantay: **4 aprobadas**.
- L04: Rali, Wakulla, Hacha Lickanantay v02 y Estera Chinchorro: **4 aprobadas**.
- No hay obligación de ilustrar 40/40 Items; se conserva el icono nativo de Foundry cuando resulte suficiente.
- No confundir los objetos de la familia Armas con las Hachas de trabajo de Equipo Común.

### 4. Selección L05 — cuatro ítems todavía sin ilustración propia exacta
**Primero presentar el prompt; NO generar sin la siguiente conformidad del autor.**

| Cuadrante | Identidad Foundry | ID histórico | Por qué no duplica |
|---|---|---|---|
| Superior izquierdo | **Mortero de piedra — Mapuche** | `7y88F6dSJK7HvqrN` | Ficha de mortero con cavidad, no es la piedra de moler aymara `aymara_kiana_piedra_moler.webp`. Pieza doméstica de ruka no transportada. |
| Superior derecho | **Snælda · Huso — Nórdicos** | `w9DvGQFnGfW8GsiW` | Huso nórdico de lana, distinto de `aymara_qapu_huso.webp`. No duplicar la geometría ni decoración del aymara. |
| Inferior izquierdo | **Saba · Saco — Lickanantay** | `89egEPGh4AtrOMS0` | Saco textil resistente de provisiones; no es la `lickanantay_red_de_carga.webp`, el `aymara_wayaqa_talega.webp` ni el Q'ipi del L03. |
| Inferior derecho | **Anzuelo y sedal — Chinchorro** | `3v9D425QdKOva3XV` | Herramienta sencilla de pesca costera con sedal de fibra; distinto del Chope y Chinguillo ya ilustrados y de Armas. |

Las cuatro **identidades y descripciones** fueron reabiertas en el export `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`, fuente primaria de esta selección. No hay nuevo canon arqueológico a partir de su literalidad.

### 5. Prompt previo L05 · 2×2
**Lámina cuadrada 2×2 con cuatro objetos aislados sobre fondo verdaderamente transparente** (canal alfa real; nunca fondo de cuadritos pintados). 7 % margen exterior, 12 % corredores centrales; no cortar objetos y mantener 3–7 masas de forma dominantes cuando proceda. **Sin texto, etiquetas, personajes, fondo, sombra de suelo, iconos de interfaz, decoración ritual inventada, brillos 3D o armas.** Estética aprobada de los lotes L02–04, dentro del canon `Estilo_Rupestre_Hipera_Canonizado_v01.md`: pigmento mineral mate, ocres/hematita/carbón/hueso, contorno de mano contenido, silueta funcional, textura moderada y fiel.

**Superior izquierdo — Mortero de piedra / Mapuche.** Piedra pesada y baja, cavidad cóncava perceptible desde arriba, interior pulido por uso, exterior irregular y mate. La ficha describe permanencia dentro de una ruka; **no poner bolsa de viaje**, ruedas, pedestal ni ornamentación ceremonial. No confundir con `Kiana` aymara de piedra de moler.

**Superior derecho — Snælda / Nórdicos.** Huso manual sencillo de madera de uso doméstico, con tortera/disco de peso claramente legible y pequeña cantidad de lana hilada, mango pulido. No reproducir la imagen Qapu aymara ni inventar runas o símbolos de culto. La ficha no fija diseño de tortera, por lo que evitar estampas históricas atribuidas.

**Inferior izquierdo — Saba / Lickanantay.** Saco portátil de fibras textiles resistentes, de forma alargada o tubular y cuerpo flexible, con cierre sencillo; **costura reparada distinta en la base** como rasgo de procedencia. Sin decoración étnica inventada ni nudos de fardo: debe leerse como recipiente, no como Q'ipi, talega Wayaqa ni red de carga.

**Inferior derecho — Anzuelo y sedal / Chinchorro.** Anzuelo plausible hecho de **espina, concha u otro material resistente** (la fuente admite alternativas), conectado con línea fina de fibra vegetal enrollada parcialmente; ambos deben leerse a 64 px. Evitar diseño industrial moderno, anzuelos triples metálicos, flotadores plásticos, arpón y aparejos de guerra. No asignar continuidad a la cultura Chinchorro en el año 1067 por el rótulo histórico del Item.

**QA luego de generar:** revisar morfología de los cuatro, legibilidad a 64/128, separar por máscaras completas, conservar fuente y extraer PNG 512/WebP 256 sólo tras aprobación. No hacer sustituciones automáticas de `img`.

### 6. Cierre
**Decisiones:** ratificado el hacha L04 v02, cierre visual y técnico fuera de runtime del L04, cuatro archivos derivados certificados técnicamente; selección L05 preliminar, con prompt **presentado pero no ejecutado**.
**Pendientes:** generar L05 tras aprobación del prompt; aprobación visual L01; QA de carga en Foundry aislado para todos los lotes; decidir integraciones del compendio histórico con trazabilidad de `img`.
**Fuentes:** export 19-11, matriz 40×29, banco de 29 WebP, láminas y manifiesto L04, canon visual rupestre.
**Cambios al Estado Maestro:** ninguno. Sin cambios en `main`, Bridge o Foundry productivo.
