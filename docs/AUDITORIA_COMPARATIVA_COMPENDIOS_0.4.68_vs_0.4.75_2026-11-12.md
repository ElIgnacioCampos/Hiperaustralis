# Auditoría comparativa — Compendios 0.4.68 vs 0.4.75

Fecha: 2026-11-12  
Rama: `work/native-compendia-pipeline`  
Alcance: inspección estructural, integridad ZIP, comparación de rutas y hashes, datos territoriales y optimización de imágenes. No se instala ni publica el módulo.

## Identificación e integridad

| Dato | 0.4.68 FLORA 40 JOURNALS LAB | 0.4.75 OPTIMIZADO LAB |
|---|---:|---:|
| Tamaño | 45,404,885 bytes | 33,028,294 bytes |
| Entradas ZIP | 399 | 358 |
| Archivos (sin directorios) | 347 | 358 |
| SHA-256 | `cf522602cf16f7e272ba9cc62d6164d761318426398cd7717e41e0bf36bd1a61` | `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e` |
| CRC | Correcto | Correcto |

Los 347 archivos del paquete 0.4.68 siguen presentes en 0.4.75. El paquete 0.4.75 incorpora 11 archivos nuevos; no se detectaron archivos de contenido eliminados. Las diferencias restantes corresponden a contenidos modificados y entradas de directorio ZIP.

## Flora y Funga

- `data/flora_items.json`: 40 Items en ambos paquetes; contenido JSON idéntico.
- `data/flora_y_funga_40.json`: 40 registros en ambos paquetes; contenido JSON idéntico.
- Los 40 iconos FLO conservan sus rutas y códigos.
- Los 40 archivos son WEBP RGBA de 512 × 512.
- Peso conjunto de los 40 iconos: 9,107,212 → 3,641,622 bytes; reducción de 60.01%.
- No cambió el contenido de las fichas editoriales ni el estado de inclusión registrado en esos dos JSON.

## Journals

Los cuatro Journals principales y sus recuentos de páginas se conservan en ambos paquetes:

| Journal | Páginas |
|---|---:|
| Auspicios — Hiperaustralis | 21 |
| Hiperaustralis — Flora del Corredor Austral | 8 |
| Hiperaustralis · Fauna | 32 |
| Culturas — Hiperaustralis | 36 |

El Journal de Flora mantiene sus ocho páginas territoriales. No equivale al JournalEntry general de navegación territorial «Biomas → Territorios» definido para la migración: no renombrar ni fusionar estructuras por semejanza temática.

## Incorporación nueva en 0.4.75: Biomas

Archivos nuevos:
- `data/biomas_items.json`: 8 Items, uno por cada territorio.
- `data/biomas_journal.json`: 8 registros descriptivos territoriales.
- `assets/biomas/iconos/BIO-001.webp` a `BIO-008.webp`: ocho iconos.

Los ocho registros de `biomas_journal.json` llevan estado explícito `CANDIDATO / NO PUBLICAR`. Por tanto, se inventarían como material candidato, no como contenido aprobado ni publicable. La existencia de los ocho Items y sus iconos tampoco acredita aprobación editorial.

## Otras modificaciones detectadas

- Se modificó `data/journals.json`; los cuatro Journals y sus recuentos de páginas permanecen iguales. No se declara equivalencia textual completa de todas las páginas sin una auditoría semántica específica.
- Se modificó `scripts/install.js`; requiere revisión de diff y prueba aislada en Foundry antes de adoptar su comportamiento.
- Se modificó `module.json`.
- Varias familias de WEBP fueron recomprimidas o reemplazadas, incluidas fauna, presencias, instrumentos, culturas y adversarios. Hashes distintos significan bytes distintos; no prueban por sí solos un cambio visual/editorial.
- Se añadió `README_0474_BIOMAS_v36.md`, que describe el lote BIO como candidato v36 y declara que no altera textos, Journal ni estructura de compendios.

## Decisión de migración

1. Usar 0.4.75 como fuente candidata más reciente para inventariar las estructuras de Biomas y la versión optimizada de los assets.
2. Conservar 0.4.68 como respaldo comparativo; no concatenar paquetes ni reemplazarlo destructivamente.
3. Mantener separados:
   - JournalEntry general `Biomas → Territorios`;
   - carpeta de Items `Territorio` con sus subcarpetas Flora, Fauna, Funga y Recetas;
   - Journal `Hiperaustralis — Flora del Corredor Austral`;
   - Items de Flora FLO-001…040.
4. No promover BIO-001…008 a aprobados/publicables: su propio estado dice `CANDIDATO / NO PUBLICAR`.
5. Antes de migrar el instalador, revisar el diff de `scripts/install.js`, IDs/UUID, carpetas, referencias y efectos de importación. No ejecutar en mundo productivo.
6. Mantener PR aislado. No tocar `main`, módulo estable, Forge productivo, MELIAZ Bridge ni Estado Maestro.

## Pendientes

- Auditoría semántica de cambios en `data/journals.json`.
- Diff funcional de `scripts/install.js` y revisión de `module.json`.
- Verificación de dimensiones, alfa y hashes de los ocho iconos BIO.
- Cotejo visual de WEBP recomprimidos antes de sustituir assets editoriales.
- Inventario de IDs, UUID, carpetas y referencias runtime de Items y Journals.
- Confirmar que las rutas de los Items territoriales corresponden a la estructura destino sin fusionar el Journal de Flora con el Journal general.

## Cierre

**Verificado:** integridad ZIP, comparación de rutas, 40 Items de Flora, 40 fichas editoriales, 40 iconos optimizados y estructura general de Journals.  
**No realizado:** importación, instalación, publicación, aprobación editorial o modificación del Estado Maestro.
