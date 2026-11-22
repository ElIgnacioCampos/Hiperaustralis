# HIPERAUSTRALIS RPG — CORE / Equipo Común
## Cierre visual L01–L05 y conciliación 29 de 40 · Checkpoint v08
**Fecha:** 2026-11-21/22 (CL). **Rama documental:** `work/native-compendia-pipeline`.
**Estado:** ARTES APROBADOS + BINARIOS VERIFICADOS; QA FOUNDRY AISLADO AÚN PENDIENTE.

### 1. Decisiones autorales recuperadas
- L01 — **Külko, Uysu, Brýni, Ckarisur**: aprobados visualmente tras delta v02 de limpieza alfa. La descripción mínima de Ckarisur se aprobó editorialmente para aplicación futura, sin cambiar ahora documentos.
- L02 — **Challa, Ch'uspa, Øx como hacha de TRABAJO, Puco**: aprobados.
- L03 — **Witrü, Q'ipi, Ketill SIN PATAS v02, Canasto Lickanantay**: aprobados.
- L04 — **Rali, Wakulla, Hacha Lickanantay herramienta con FILO v02, Estera vegetal Chinchorro**: aprobados.
- L05 — **Mortero, Snælda, Saba, Anzuelo y sedal**: nueva variante de estética ERH v02 **aprobada** explícitamente («aprobados, continuemos»). No usar la versión previa casi hiperrealista ni eliminarla de los respaldos.
- Las fichas de Equipo Común son **40** y ya tienen rutas `icons/` de Foundry. No existe obligación de reemplazar 40 imágenes.

### 2. Ejecución L05
Sobre la lámina **ERH v02 aprobada**, preservando intacta su fuente original ya guardada:
- Se extrajeron cuatro objetos por sus canales alfa, sin generar imágenes adicionales ni inventar atributos culturales.
- Se normalizaron a cuatro **PNG 512×512 RGBA** con margen y cuatro **WebP 256×256 VP8L lossless** con alfa real.
- Validación de ida/vuelta: los píxeles visibles y el canal alfa del WebP coinciden exactamente con el PNG reducido, **4/4 PASS**.
- Se creó QA visual sobre fondo claro y oscuro, más controles de tamaño reducido. **No se realizó QA dentro del cliente Foundry.**
- Archivo entregado y verificado: `HIPERA_EQUIPO_COMUN_L05_APROBADOS_ERH_v02.zip`, **1.897.054 bytes**, SHA-256 `e9279aa1dea225842482c4620eb248b361d65caf967bbe1ceea5638be48a9267`.
- BBTECA: `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L05_APROBADOS_ERH_v02.zip`. El ZIP no duplica la lámina fuente maestra ya respaldada.

### 3. Consolidación de los cinco lotes
**Nueva entrega de QA para los 20 objetos:** `HIPERA_EQUIPO_COMUN_20_WEBP_APROBADOS_LOTES01_05_QA_v01.zip`
- 20 iconos WebP 256 lossless exclusivamente; **sin PNG maestros ni fuentes históricas duplicadas**.
- Un CSV de correspondencia, manifiesto JSON con hashes, culturas, IDs del compendio `world.hiperaustralis-rituales` y archivo de procedencia para cada icono, más instrucciones de continuidad.
- **20/20 hashes SHA-256** cotejados con los ZIP de lotes aprobados; **20 IDs únicos**. 23 miembros ZIP, prueba CRC completa PASS.
- **Tamaño:** 1.121.107 bytes. **SHA-256:** `41d20db6e45894e1f00ad94a8fccce01e767567bd8d3401a58716a609f4e1a72`.
- **BBTECA:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_20_WEBP_APROBADOS_LOTES01_05_QA_v01.zip`.
- Se distinguieron nombres exactos del compendio de nombres visuales: `Øx · Hacha` en ficha, icono herramienta; `Hacha` en ficha Lickanantay, icono de herramienta; `Ch'uspa · Bolsa pequeña` en ficha. **No renombrar Items.**
- Se preservan individualmente L01–L05 en BBTECA como referencias clave; ninguna fuente fue sobrescrita.

### 4. Matriz de cobertura real del Equipo Común
| Grupo | Ítems históricos | Estado |
|---|---:|---|
| WebP culturales **previos** de noviembre con asociación directa | **9** | Assets en GitHub staging; identidad técnica cotejada; cambio de `img` pendiente |
| WebP **nuevos** aprobados L01–L05 | **20** | Arte y hashes verificados, respaldados en BBTECA; aún no integrados al módulo |
| Ítems que pueden conservar iconos nativos Foundry | **11** | Ninguna necesidad demostrada de producir iconos nuevos |
| **TOTAL** | **40** | **29 asociaciones candidatas**, no 29 sustituciones ejecutadas |

**Matriz consolidada de 29 cruces:** `manifests/equipo-comun-29-cruces-candidatos-20261121.json` — incluye nueve anteriores y veinte nuevos, todos con ID, cultura, nombre, procedencia del binario, tamaño y SHA-256. La matriz fue verificada sin IDs repetidos (29 únicos). **No modificar automáticamente ningún campo `img` a partir de este manifiesto.**

**Los 11 que conservan imágenes Foundry:** Metawe, Toki, Paño tejido, Phala, Q'urawa, Phullu, Poki, Cuchara de madera lickanantay, Arco y flechas, Arpón, Cuchillo lítico. Algunos remiten a otros bancos (p. ej. Honda WebP legacy, COM Soga y Manta), o a **Armas**; no producir otra lámina por la sola existencia de estos registros.

### 5. Pendientes reales, orden propuesto
1. **QA Foundry V14 aislado**: preparar instalación de prueba de los nuevos WebP, verificar rutas de archivo, lectura en ficha y legibilidad, y no usar el mundo productivo. Los nueve assets previos están en `_staging` de GitHub, los veinte de L01–L05 están respaldados en BBTECA; no confundir ambos lugares.
2. **Conciliación de fuente JSON**: preservar `_id`, UUID, nombre, tipo, carpeta, `flags` y `system` de cada Item; registrar el `img` anterior y el nuevo en una lista de cambios reversibles.
3. **Ckarisur**: edición editorial aprobada en `system.props.descripcion` y no aplicada: «Peine pequeño, con dientes vegetales sujetos entre varillas de madera, para desenredar y cuidar el cabello.»
4. **Casos históricos singulares**: evaluar Toki como hacha utilitaria frente a emblema; verificar la imagen legacy de Honda; no regenerar ambos sin fuente. Los iconos nativos pueden permanecer.
5. **No iniciar L06** salvo que una necesidad funcional/cultural concreta justifique más arte. Prefiere cerrar QA y compendios sobre producir variantes de sobra.

### 6. Decisiones / Pendientes / Fuentes / Maestro
**Decisiones:** L01–L05 aprobados en arte; 20 recursos derivados consolidados; 29 cruces propuestos para 40 Items, 11 con Foundry; ninguna producción nueva necesaria por ahora.
**Pendientes:** carga y QA cliente Foundry aislado, posible promoción reversible de `img`, aplicación localizada del texto Ckarisur, singularidades Toki/Honda.
**Fuentes:** export Foundry 2026-11-19; manifiestos de cinco ZIP aprobados; `TRANSFER_MANIFEST.json`; canon `Estilo_Rupestre_Hipera_Canonizado_v01.md`; aprobación autoral y checkpoint L05 anterior.
**Cambios al Estado Maestro:** ninguno. **Sin cambios** a `main`, MELIAZ Bridge, mundo Foundry productivo ni compendio instalado.
