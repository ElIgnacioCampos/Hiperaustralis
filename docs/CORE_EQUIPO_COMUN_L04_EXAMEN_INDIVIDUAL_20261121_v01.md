# HIPERAUSTRALIS RPG — CORE / Equipo Común
## L04 · Examen individual de cuatro ilustraciones · v01
**Corte:** 2026-11-21 · **Rama:** `work/native-compendia-pipeline`.
**Estado:** BASE VISUAL APROBADA PARA EXAMEN INDIVIDUAL; NO RATIFICACIÓN FINAL POR FICHA, NO PROMOCIÓN RUNTIME.
**Autorización expresa:** «aprobados para ex. indv» (autor, en el chat del lote 04).

### 1. Fuente gráfica
- **Archivo original:** `a_clean_high_detail_illustration_on_a_transparent.png` (generado en el propio chat; fuente original no modificada).
- **Respaldo BBTECA verificado:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L04_BASE_2x2_EXAMEN_INDIVIDUAL_v01.png`.
- **SHA-256:** `420d1464ea3c8a5a91abc3c576245bd8a05802c3ee1aaab1940ba926f7b7702a`.
- **Dimensiones y modo:** 1254×1254 PNG RGBA, con alfa real; esto NO es una lámina final normalizada para Foundry.
- **Composición:** cuatro objetos distintos en 2×2. La estera y parte del hacha se acercan al eje central; no cortar ingenuamente por la división de cuadrantes al derivar iconos.

### 2. Cotejo con fichas Foundry (export 19-11-2026)
Todos son `equippableItem` en `world.hiperaustralis-rituales`, carpeta `Equipo común`, plantilla `HipEquipTpl00001`, `hipera_tipo=equipo`.

| Cuadrante | Ítem | ID histórico | Descripción relevante | Examen visual | Dictamen |
|---|---|---|---|---|---|
| Superior izquierda | **Rali · Plato (Mapuche)** | `MVaSt17DYFT5CP5R` | Plato abierto para servir y comer; madera, cerámica u otro material adecuado. Procedencia menciona marcas talladas en borde | La figura es un plato de madera bajo y abierto; marcas geométricas de borde son compatibles con singularidad del objeto, **no acreditadas como patrón ancestral específico** | **CONSERVAR** base aprobada; no atribuir simbolismo étnico a los motivos |
| Superior derecha | **Wakulla · Cántaro (Aymara)** | `iqLSPRD0g34ZMqTi` | Vasija grande cerámica para líquidos; pequeña marca de identificación antes de cocción | Cuerpo globular, cuello estrecho y dos asas corresponden a descripciones contemporáneas de wakulla. La banda escalonada extensa **excede** la pequeña marca de la ficha y no tiene filiación arqueológica demostrada para 1067 | **CONSERVAR COMO BASE**; reserva ornamental. Si se exige reproducción literal, corrección mínima de ornamentación; no rehacer cuerpo |
| Inferior izquierda | **Hacha (Lickanantay)** | `V70OePeRN8xLcbuy` | Hacha de trabajo con mango de madera y cabeza resistente para cortar/golpear/trabajar madera; la fuente no fija material del cabezal | Piedra, ligaduras y mango plausibles para herramienta genérica; el **filo derecho es romo** y puede leerse como maza. Hacha lítica con enmangue está documentada en otras regiones, no identificación específica lickanantay | **RETOQUE LOCAL RECOMENDADO**: precisar un solo filo/bisel, conservar todo lo demás. Material lítico PROVISIONAL |
| Inferior derecha | **Estera vegetal (banco histórico Chinchorro)** | `WgYdtWEqZmWbZpuU` | Superficie flexible tejida de fibras vegetales para sentarse/dormir/envolver/disponer objetos | Material y franjas sobrias plausibles; la técnica `twining` está documentada en Chinchorro, pero las puntadas exactas de esta imagen no han sido cotejadas con ejemplar específico | **CONSERVAR** con reserva de correspondencia arqueológica y cronológica |

### 3. Jerarquía de correcciones
**Prioridad 1:** Hacha lickanantay: resolver solo el filo romo (forma utilitaria, no un arma). No hay encargo de regenerar.
**Prioridad 2 / opcional:** Wakulla: la banda escalonada debe mantenerse como **ornamentación de fantasía/artística no acreditada** o reducirse localmente a la marca simple mencionada por la ficha, si el autor exige correspondencia literal. No inferir tradición aymara por patrón geométrico.
**Sin correcciones necesarias:** Rali y estera. Las marcas del Rali son particulares del objeto, no prueba de repertorio decorativo tradicional.
**No reabrir en bloque:** el usuario aprobó los cuatro para examen individual y debe mantenerse la lámina original como testigo.

### 4. Control técnico del alfa
Auditoría directa del PNG original:
- Tiene transparencia RGBA real, pero se identificaron 22.688 píxeles de rojo puro ajeno a las formas (`R≥245,G<20,B<20`) con **alfa máximo 3/255**; son residuos casi invisibles del generador, destacados por algunas vistas previas.
- Existen 124.177 píxeles con alfa residual de 1–8/255 en toda la lámina. El cuerpo de los objetos utiliza opacidades próximas a 251–253/255.
- **Corrección técnica recomendada al derivar:** limpiar residuos de muy baja opacidad, preservar bordes pictóricos reales y comprobar halos sobre fondos claros/oscuros. No limpiar ni sobrescribir la fuente original.
- Las piezas se deben **aislar por contorno**, no recortar rígidamente en cuatro áreas iguales: hacha y estera se acercan o invaden la línea del cuadrante.
- Aún no se han generado los PNG 512 ni WebP 256 del L04; aún no hay QA en cliente Foundry.

### 5. Evidencia externa y alcance
- **Rali de madera:** `https://www.museorancagua.gob.cl/galeria/un-conjunto-de-piezas-tradicionales-mapuche`, `https://artesaniasdechile.cl/tallado-en-madera-de-liquine/`.
- **Wakulla:** `https://cdn.www.gob.pe/uploads/document/file/4973488/item_55_vocabulario_aymara.pdf?v=1692022988`; explicación didáctica de forma y asas `https://educacioninterculturalbolivia.org.bo/wp-content/uploads/educacion-en-lengua-Ind%C3%ADgena/ENSE%C3%91ANZA%20DE%20AYMARA-PRIMARIA-comprimido.pdf`.
- **Hacha lítica:** fichas patrimoniales `https://www.chilepatrimonios.gob.cl/ficha?doi=05SDC-1-4047` (Norte Chico) y `https://www.chilepatrimonios.gob.cl/ficha?doi=05SDC-1-1369` (sin procedencia Lickanantay confirmada). Sobre emblemas metálicos en San Pedro, `https://www.scielo.cl/scielo.php?pid=S0718-10432020000300271&script=sci_arttext`; no son prueba del hacha lítica propuesta.
- **Estera:** `https://www.scielo.cl/scielo.php?pid=S0717-73562011000300009&script=sci_arttext`; `https://www.cambridge.org/core/journals/latin-american-antiquity/article/abs/el-temprano-arte-de-la-tradicion-de-tejer-esteras-en-fibra-vegetal-en-la-sociedad-chinchorro-100003500-ap-extremo-norte-de-chile/6D26B2BE1A6EFCA27F9FEE98F9B2C254`.
- **Alerta cronológica:** la tradición Chinchorro está fechada en milenios anteriores a 1067; el banco histórico no equivale a afirmar continuidad étnica hasta ese año.

Estas referencias validan categorías de objeto y algunas técnicas, **no una copia exacta ni la materialidad de una pieza del año 1067**.

### 6. Decisiones / Pendientes / Fuentes / Estado Maestro
**Decisiones:** cuatro figuras visualmente aceptadas para examen individual; conservar Rali y estera; recomendar solo filo de hacha como retoque; documentar límite de ornamentación de Wakulla.
**Pendientes:** decidir sobre retoque de hacha y eventual simplificación de Wakulla; luego derivados 512/256, QA de bordes y prueba Foundry aislada. No avanzar a L05 ni generar nueva imagen por inercia.
**Fuentes:** lámina fuente L04 de este chat, export del compendio de 19-11-2026, estándar ERH y bibliografía listada.
**Estado Maestro:** sin cambios. `main`, Bridge y Foundry productivo sin intervención.
