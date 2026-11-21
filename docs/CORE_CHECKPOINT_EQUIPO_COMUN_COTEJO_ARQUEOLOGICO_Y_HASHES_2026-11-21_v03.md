# HIPERAUSTRALIS RPG — CORE / IMPLEMENTACIÓN
## Checkpoint v03 · Equipo común / cotejo arqueológico y validación de 9 WebP
**Fecha:** 2026-11-21
**Rama:** `work/native-compendia-pipeline`
**Carácter:** AUDITORÍA TÉCNICA Y DE FUENTES · sin promoción a runtime, sin edición de Items, sin aprobación editorial nueva.

### 1. Resultado verificado
- Se preservan los **40 Items históricos** de `world.hiperaustralis-rituales` (export de Foundry 14.367 / CSB 6.1.2, 2026-11-19).
- **9/9 WebP candidatos**: inspección visual directa, forma de objeto reconocible.
- **9/9 SHA-256**: recalculados a partir de bytes descargados mediante el conector GitHub y comparados con `TRANSFER_MANIFEST.json`; **nueve coincidencias**.
- **9/9 bytes**: tamaños acordes al manifiesto; cabecera `RIFF/WEBP` válida.
- **9/9 archivos**: codificación **VP8L**, dimensiones **256×256**, bandera alfa del encabezado **presente**. La bandera no demuestra por sí sola la ausencia de halos ni certifica la composición sobre todos los fondos.
- **9/9 PNG maestros**: las rutas declaradas en `module/assets/_staging/equipo/png512/` devuelven 404 en la rama. El manifiesto preserva nombres y SHA-256 de origen; la ausencia **en esta ruta** no significa destrucción de los originales.
- Los nueve cruces siguen siendo **candidatos**: concordancia semántica/visual ≠ aprobación de reemplazo `img` en Foundry.
- Ninguna evidencia prueba que los siete archivos inspeccionados antes y los dos actuales hayan sido instalados en Foundry. No se hizo QA funcional en cliente.

### 2. Matriz de nueve cruces cotejados
| Nº | Cultura | Item | ID histórico de compendio | WebP existente / inspeccionado | SHA-256 verificado | PNG maestro declarado, no localizado en ruta GitHub | Evaluación de fuente |
|---:|---|---|---|---|---|---|---|
| 13 | Aymara | Qapu · Huso | `SbBJa9ACdFH2z86D` | `aymara_qapu_huso.webp` | `ae70b4a74d0c1b8e198353364753ca55aae5f4cb4e01f65da75709e32506e4f6` | `AYMARA_KAPU_HUSO_MAESTRO_512.png` | Morfología y nombre respaldados; prueba temporal directa no completada [F1][F2] |
| 17 | Nórdicos | Knífr · Cuchillo | `EPqXIQm8A38zvtXw` | `nordico_knifr_cuchillo.webp` | `6f7605a5299dddff721b6273d168516d82d7d759862b16de0bb6f63e9ee5c46f` | `NORDICO_KNIFR_CUCHILLO_v02_APROBADO.png` | Cuchillo y cronología respaldados; no cotejado con una pieza precisa [F7] |
| 20 | Nórdicos | Eldjárn · Yesquero | `XhykrqOWzvB8abe9` | `nordico_eldjarn_yesquero.webp` | `b243d618ec3bd6734b8c75705fe2667c448076901b05f1db4cfeae3d59347de5` | `NORDICO_ELDJARN_YESQUERO_v01.png` | Tipología de yesquero respaldada; estilización del ejemplar pendiente [F6] |
| 22 | Nórdicos | Saum-nál · Aguja de coser | `VOtfeqh5KvQw6eF1` | `nordico_saum_nal_aguja.webp` | `e364160285fead6ae064dc863e313838b38781cf1e7e254bd5c4213d2c8e709e` | `NORDICO_SAUM_NAL_AGUJA_v01_APROBADA.png` | Uso de agujas/costureros respaldado; material preciso pendiente [F7][F8] |
| 29 | Lickanantay | Gancho de atalaje | `YuTiSkP9Mx7FvJy7` | `lickanantay_gancho_atalaje.webp` | `ca461dc79940bad5c080c73a27de2589b73d8b582367396fb1206ec070c0541d` | `LICKANANTAY_GANCHO_ATALAJE_MAESTRO_512.png` | Forma V de madera y función de carga respaldadas para región/época; no proveniencia específica [F3][F4] |
| 35 | Chinchorro | Chinguillo · Bolsa-red | `CBIQgRyTGVMq6RCP` | `chinchorro_chinguillo.webp` | `13f021d60722dc0ae814df4aac8d7926683af860dfd32d360f75dbdaf0e83058` | `CHINCHORRO_CHINGUILLO_v01.png` | Bolsa de red documentada; cronología Arcaica, no contemporánea a 1067 [F5] |
| 36 | Chinchorro | Chope · Desconchador | `Cal0I8l96tdRm1pR` | `chinchorro_chope.webp` | `86128383b0fd9cf02bc42e04636adb6d9a2f8b4e4f1be65c502006cbfde60658` | `CHINCHORRO_CHOPE_v01.png` | Instrumento de costilla de lobo marino documentado; cronología Arcaica [F5] |
| 38 | Chinchorro | Canasto | `8a526Vqfx3hsafi3` | `chinchorro_canasto.webp` | `b33486635fe8045393384d41c56b13b27651340eba7fca007df8983108cab17d` | `CHINCHORRO_CANASTO_v01.png` | Cestería documentada; diseño geométrico específico sin cotejo [F5] |
| 40 | Chinchorro | Punzón de hueso | `MX9mAxfkdCwvEvkZ` | `chinchorro_punzon_hueso.webp` | `e6f0bd65a66a9125973d07fe3b5a8a463af13bc7e68c7cf4db848d49ee031497` | `CHINCHORRO_PUNZON_HUESO_v01.png` | Punzones óseos documentados; forma exacta sin cotejo [F5] |

**Rutas WebP presentes:** `module/assets/_staging/equipo/webp256/<archivo>`.
**Rutas PNG declaradas, sin bytes en rama:** `module/assets/_staging/equipo/png512/<archivo>`.
El `sourcePackage` del manifiesto es `HIPERAUSTRALIS_EQUIPO_COMPLETO_INTEGRACION_v01.zip`; su ficha **no equivale** a lectura de sus bytes en este corte.
IDs de esta tabla: `documentId` de los **Items del compendio** en el export de 2026-11-19, no los IDs de duplicados del mundo ni de Items embebidos.

### 3. Conclusiones arqueológicas (nivel de evidencia)
1. **Qapu / huso:** el léxico y la manufactura textil aymara documentan un huso de madera. El arte de staging muestra un huso con fibra. Es equivalencia de **tipo funcional**, no una réplica de un hallazgo fechado en 1067. [F1][F2]
2. **Gancho de atalaje:** investigaciones arqueológicas del área de Atacama describen ganchos alisados de madera **en V** empleados para sujetar la carga de llamas y, en ciertos contextos, fardos funerarios. La iconografía staging presenta ese perfil. La fuente de 2021 considera contextos de **500–1500 d. C.**, que incluyen 1067, pero no prueba que el dibujo reproduzca un ejemplar específico del siglo XI. [F3][F4]
3. **Chinguillo, Chope, Canasto, Punzón:** los contextos funerarios Chinchorro de Morro 1 documentan bolsas-red, desconchadores óseos, cestería y punzones de hueso. El Chope se vincula a costillas de lobo marino. La lectura visual es compatible a nivel de categoría, **no a nivel de espécimen**; ornamentación, ataduras y forma específica deben contrastarse con los originales. [F5]
4. **Knífr, Eldjárn, Saum-nál:** colecciones museográficas nórdicas documentan cuchillos, yesqueros de hierro y agujas/costureros en época vikinga. Las tres imágenes identifican la función. No se infiere material, datación ni patrón ornamental preciso solamente por la ilustración. [F6][F7][F8]
5. **Alerta de escala temporal Chinchorro:** la cultura Chinchorro arqueológica pertenece al período Arcaico; sus artefactos no prueban una población Chinchorro contemporánea a la cronología narrativa de **1067**. Conservar el etiquetado histórico sin convertirlo automáticamente en cultura viva de la ambientación. [F5][F9]
6. **Fuente ≠ canon:** las correspondencias atestiguadas son insumos de compatibilidad cultural. No autorizan renombrar, reescribir o migrar el catálogo, menos aún convertir elementos de un banco histórico en CORE actual.

### 4. Fuentes identificadas y verificadas públicamente
- **[F1]** *Memory and Identity. The Aimara Textile Tradition in Northern Chile and the Built Space* (2020), artículo SciELO. Términos `Qapuña` y `Qapu`: https://scielo.conicyt.cl/scielo.php?pid=S0719-26812020000300091&script=sci_arttext_plus&tlng=es
- **[F2]** Pino Jordán, *Tradición textil aymara y modelo pedagógico andino*. Distingue `qapu` del quechua `phuska`: https://casadelcorregidor.pe/colaboraciones/_biblio_Adepijor-I-2.php
- **[F3]** *Práctica religiosa, especialización artesanal y estatus... salar de Atacama (500–1500 d. C.)* (2021), SciELO: https://www.scielo.cl/scielo.php?pid=S0718-10432021000100201&script=sci_arttext
- **[F4]** Raviña, Fernández y Capparelli (2007), *La relación de las tarabitas, horquetas o ganchos de atalaje...*, `Estudios Atacameños` 33: https://www.scielo.cl/scielo.php?pid=S0718-10432007000100006&script=sci_arttext
- **[F5]** *Bienes funerarios del cementerio Chinchorro Morro 1: descripción, análisis e interpretación* (2003), `Chungará`: https://www.scielo.cl/scielo.php?pid=S0717-73562003000200002&script=sci_arttext
- **[F6]** Historiska museet, *Fire steel*, objetos 107795_HST y 1183243_HST: https://vikingar.historiska.se/object_details.php?e=&l=en&object=E55D324C-018C-4B6D-8A64-4757B5DCDAE3
- **[F7]** Historiska museet, *The Birka Girl and other children of the Viking Age* (cuchillo, estuche de agujas): https://historiska.se/en/explore-history/history-hub/the-birka-girl-and-other-children-of-the-viking-age/
- **[F8]** Historiska museet, *Needle*, objeto 269703_HST: https://vikingar.historiska.se/object_details.php?e=no&l=en&object=AF13DC98-DC60-4FA8-9923-7593161A1132
- **[F9]** Chile Precolombino, *Ambiente y Localización — Chinchorro*: https://chileprecolombino.cl/prehistoria/culturas/norte-arido/chinchorro/ambiente-y-localizacion/

### 5. Pendientes, secuencia y límites
1. **Originales/maestros:** rastrear ZIP canónico `HIPERAUSTRALIS_EQUIPO_COMPLETO_INTEGRACION_v01.zip` y nueve PNG maestros con hash y bytes. No generarlos de nuevo ni sustituirlos por upscales.
2. **QA cultural final:** cotejar figuras y materiales contra imágenes de piezas arqueológicas específicas cuando existan, sin agregar elementos no documentados.
3. **QA de Foundry aislado:** vista de tarjeta/hoja sobre fondos claro y oscuro, contorno/alpha, escala real, contraste y carga por ruta.
4. **Migración:** antes de tocar `img`, recuperar la fuente JSON completa de cada Item, cotejar `_id`, `compendiumSource`, `flags`, `system` y carpeta; conservar el valor antiguo y registrar cambios por documento.
5. **Resto de catálogo:** 31 Items aún sin cruce estricto; 20 WebP sin cruce estricto. No inferir equivalencias por nombre aproximado ni por semejanza cultural.
6. **Q'urawa · Honda:** mantiene placeholder en export 19-11 y ruta legacy a WebP; resolver por trazabilidad, sin reutilizar arbitrariamente el asset de Armas.
7. **Control:** conservar `main`, MELIAZ Bridge, módulo y mundo productivos y Estado Maestro intactos. PR #1 sigue siendo prototipo, no autorización de despliegue.

### 6. Cierre
**Decisiones:** nueve WebP acreditados en integridad binaria, tamaño, formato y reconocimiento visual; nueve cruces arqueológicamente plausibles a nivel de tipo; ninguna vinculación runtime.
**Pendientes:** masters originales, cotejo de ejemplares precisos, JSON completos, QA real y migración de la colección.
**Fuentes:** export Foundry 2026-11-19, `TRANSFER_MANIFEST.json` (cotejo de bytes), `CORE_CHECKPOINT_EQUIPO_COMUN_FOUNDRY_2026-11-21_v02.md` y F1–F9.
**Estado Maestro:** no modificar. Históricos y propuestas permanecen fuera del canon explícito.

