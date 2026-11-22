# HIPERAUSTRALIS RPG — CORE / IMPLEMENTACIÓN
## Cotejo Equipo Común 40 × 29 — checkpoint v02 (21-11-2026)
**Estado: auditoría documentada y propuesta de vinculación; sin escritura de datos de runtime ni aprobación editorial nueva.**

### Resultado comprobado
- 40 Items históricos de `world.hiperaustralis-rituales` localizados en el export Foundry 14.367, CSB 6.1.2, 19-11-2026. Se extrajeron sus IDs y seedIds del export; el CSV anexo conserva la lista completa.
- 29/29 WebP de Equipo en la rama de GitHub localizados con lectura binaria. Sus tamaños efectivos coinciden con los tamaños del manifiesto `TRANSFER_MANIFEST.json`. **No se recalcularon aún los SHA-256**, aunque los valores declarados siguen disponibles en el manifiesto.
- 9 cruces semánticos directos objeto–cultura–nombre de asset: siete del lote prioritario más `Qapu · Huso` y `Gancho de atalaje`. Se trata de **candidatos**, no de reemplazos aprobados.
- 7/7 WebP prioritarios abiertos y examinados visualmente: reconocibles como cuchillo, yesquero, aguja, punzón de hueso, desconchador, canasto y bolsa-red. Este examen de reconocimiento no sustituye cotejo de fidelidad arqueológica, masters originales ni visual QA en Foundry.
- 7/7 PNG maestros de esos objetos consultados en las rutas GitHub declaradas **no encontrados** (404). Su ausencia en esa ruta no implica pérdida del respaldo histórico.
- 31 Items sin cruce estricto con el lote WebP; 20 WebP sin cruce estricto al catálogo histórico. No supone falta ni exceso de contenido; son conjuntos con cobertura distinta.
- Caso especial: Q'urawa · Honda tenía WebP propio en el instalador legacy, pero el export Foundry actual (19-11) registra `img: icons/svg/item-bag.svg` (placeholder). Recuperar sin inventar ID ni alterar el origen sin validación.

### Nueve cruces directos propuestos — sin mutación runtime
| Nº | Item | ID compendio 19-11 | WebP en staging | Auditoría |
|---:|---|---|---|---|
| 13 | Qapu · Huso | `SbBJa9ACdFH2z86D` | `aymara_qapu_huso.webp` | Visual pendiente |
| 17 | Knífr · Cuchillo | `EPqXIQm8A38zvtXw` | `nordico_knifr_cuchillo.webp` | Reconocimiento visual: sí; arqueología pendiente |
| 20 | Eldjárn · Yesquero | `XhykrqOWzvB8abe9` | `nordico_eldjarn_yesquero.webp` | Reconocimiento visual: sí; arqueología pendiente |
| 22 | Saum-nál · Aguja de coser | `VOtfeqh5KvQw6eF1` | `nordico_saum_nal_aguja.webp` | Reconocimiento visual: sí; arqueología pendiente |
| 29 | Gancho de atalaje | `YuTiSkP9Mx7FvJy7` | `lickanantay_gancho_atalaje.webp` | Visual pendiente |
| 35 | Chinguillo · Bolsa-red | `CBIQgRyTGVMq6RCP` | `chinchorro_chinguillo.webp` | Reconocimiento visual: sí; arqueología pendiente |
| 36 | Chope · Desconchador | `Cal0I8l96tdRm1pR` | `chinchorro_chope.webp` | Reconocimiento visual: sí; arqueología pendiente |
| 38 | Canasto | `8a526Vqfx3hsafi3` | `chinchorro_canasto.webp` | Reconocimiento visual: sí; arqueología pendiente |
| 40 | Punzón de hueso | `MX9mAxfkdCwvEvkZ` | `chinchorro_punzon_hueso.webp` | Reconocimiento visual: sí; arqueología pendiente |

### Catálogo completo de 40 (fuente del CSV)
| Nº | Nombre | Cultura | ID compendio | Cruce |
|---:|---|---|---|---|
| 01 | Challa · Olla | Mapuche | `9u2kj6J5jcbZiVP6` | Sin cruce estricto |
| 02 | Metawe · Jarro | Mapuche | `o1z5pPevd1NzySi6` | Sin cruce estricto |
| 03 | Rali · Plato | Mapuche | `MVaSt17DYFT5CP5R` | Sin cruce estricto |
| 04 | Witrü · Cuchara de madera | Mapuche | `5nFewbreKtldDFdL` | Sin cruce estricto |
| 05 | Toki · Hacha de piedra | Mapuche | `rZ5JztozLP6qqf7u` | Sin cruce estricto |
| 06 | Mortero de piedra | Mapuche | `7y88F6dSJK7HvqrN` | Sin cruce estricto |
| 07 | Paño tejido | Mapuche | `0AeK5B1RD2Z0xry7` | Sin cruce estricto |
| 08 | Külko · Canasto | Mapuche | `F8SYAQfuZnLiXCv6` | Sin cruce estricto |
| 09 | Ch'uspa · Bolsa pequeña | Aymara | `Y0QM677Ln8rfixg6` | Sin cruce estricto |
| 10 | Q'ipi · Bulto de carga | Aymara | `g2YB821BybKVvqgK` | Sin cruce estricto |
| 11 | Phala · Soga | Aymara | `8y3gYDMnZvALhlOn` | Sin cruce estricto |
| 12 | Q'urawa · Honda | Aymara | `Qbf0kVDqbeWvJ0ty` | Sin cruce estricto |
| 13 | Qapu · Huso | Aymara | `SbBJa9ACdFH2z86D` | WebP candidato: aymara_qapu_huso.webp |
| 14 | Phullu · Manta | Aymara | `rmS5WS3R6v1dapQ3` | Sin cruce estricto |
| 15 | Wakulla · Cántaro | Aymara | `iqLSPRD0g34ZMqTi` | Sin cruce estricto |
| 16 | Uysu · Arado de pie | Aymara | `tfOpt8w3B1dFl6qS` | Sin cruce estricto |
| 17 | Knífr · Cuchillo | Nórdicos | `EPqXIQm8A38zvtXw` | WebP candidato: nordico_knifr_cuchillo.webp |
| 18 | Øx · Hacha | Nórdicos | `UZCgOpwUoDoYPAME` | Sin cruce estricto |
| 19 | Poki · Bolsa | Nórdicos | `xE1erYosmiInLUpj` | Sin cruce estricto |
| 20 | Eldjárn · Yesquero | Nórdicos | `XhykrqOWzvB8abe9` | WebP candidato: nordico_eldjarn_yesquero.webp |
| 21 | Brýni · Piedra de afilar | Nórdicos | `kMqPL8yvZQIaZGmY` | Sin cruce estricto |
| 22 | Saum-nál · Aguja de coser | Nórdicos | `VOtfeqh5KvQw6eF1` | WebP candidato: nordico_saum_nal_aguja.webp |
| 23 | Snælda · Huso | Nórdicos | `w9DvGQFnGfW8GsiW` | Sin cruce estricto |
| 24 | Ketill · Caldero | Nórdicos | `PmTYfMVymolkOvkq` | Sin cruce estricto |
| 25 | Puco · Cuenco | Lickanantay | `yFT8cUZ71AOrxvN5` | Sin cruce estricto |
| 26 | Cuchara de madera | Lickanantay | `5mmFqPLbv3kcJcoj` | Sin cruce estricto |
| 27 | Hacha | Lickanantay | `V70OePeRN8xLcbuy` | Sin cruce estricto |
| 28 | Arco y flechas | Lickanantay | `E8964qw0yfQskaB6` | Sin cruce estricto |
| 29 | Gancho de atalaje | Lickanantay | `YuTiSkP9Mx7FvJy7` | WebP candidato: lickanantay_gancho_atalaje.webp |
| 30 | Canasto | Lickanantay | `em5ML5e9yQyQCH2o` | Sin cruce estricto |
| 31 | Saba · Saco | Lickanantay | `89egEPGh4AtrOMS0` | Sin cruce estricto |
| 32 | Ckarisur · Peine | Lickanantay | `xzRV37AjDu0WVuzh` | Sin cruce estricto |
| 33 | Anzuelo y sedal | Chinchorro | `3v9D425QdKOva3XV` | Sin cruce estricto |
| 34 | Arpón | Chinchorro | `U4ON2BsjM4Y0t5nD` | Sin cruce estricto |
| 35 | Chinguillo · Bolsa-red | Chinchorro | `CBIQgRyTGVMq6RCP` | WebP candidato: chinchorro_chinguillo.webp |
| 36 | Chope · Desconchador | Chinchorro | `Cal0I8l96tdRm1pR` | WebP candidato: chinchorro_chope.webp |
| 37 | Estera de fibra vegetal | Chinchorro | `WgYdtWEqZmWbZpuU` | Sin cruce estricto |
| 38 | Canasto | Chinchorro | `8a526Vqfx3hsafi3` | WebP candidato: chinchorro_canasto.webp |
| 39 | Cuchillo lítico | Chinchorro | `lvwNyb0lGRwb1Oxu` | Sin cruce estricto |
| 40 | Punzón de hueso | Chinchorro | `MX9mAxfkdCwvEvkZ` | WebP candidato: chinchorro_punzon_hueso.webp |

### Rutas de PNG maestro no disponibles en GitHub
- `module/assets/_staging/equipo/png512/NORDICO_KNIFR_CUCHILLO_v02_APROBADO.png` — 404 en consulta directa del 21-11.
- `module/assets/_staging/equipo/png512/NORDICO_ELDJARN_YESQUERO_v01.png` — 404 en consulta directa del 21-11.
- `module/assets/_staging/equipo/png512/NORDICO_SAUM_NAL_AGUJA_v01_APROBADA.png` — 404 en consulta directa del 21-11.
- `module/assets/_staging/equipo/png512/CHINCHORRO_PUNZON_HUESO_v01.png` — 404 en consulta directa del 21-11.
- `module/assets/_staging/equipo/png512/CHINCHORRO_CHOPE_v01.png` — 404 en consulta directa del 21-11.
- `module/assets/_staging/equipo/png512/CHINCHORRO_CANASTO_v01.png` — 404 en consulta directa del 21-11.
- `module/assets/_staging/equipo/png512/CHINCHORRO_CHINGUILLO_v01.png` — 404 en consulta directa del 21-11.

### Ocho semejanzas por revisar, nunca vincular automáticamente
- `02` Metawe · Jarro: mapuche_alka_metawe.webp (variante alka; NO mismo Item).
- `08` Külko · Canasto: mapuche_pilwa.webp / mapuche_llepu.webp (otras cestas; NO equivalentes).
- `09` Ch'uspa · Bolsa pequeña: aymara_wayaqa_talega.webp (bolsa/talega distinta).
- `10` Q'ipi · Bulto de carga: aymara_wayaqa_talega.webp (bulto distinto).
- `11` Phala · Soga: com_01_foundry_256.webp (COM-01 Soga, identidad pendiente).
- `14` Phullu · Manta: com_03_foundry_256.webp (COM-03 Manta, identidad pendiente).
- `15` Wakulla · Cántaro: aymara_phuno_vasija.webp (vasija distinta).
- `31` Saba · Saco: lickanantay_red_de_carga.webp (objeto distinto).

### Guardarraíles y siguiente ejecución
1. No usar el instalador legacy como autoridad del nuevo compendio; usar el export 19-11 y preservar `_id`, UUID, flags, payload y carpeta por documento.
2. No confundir coincidencia gráfica con identidad del Item. No fusionar Canastos de culturas diferentes ni distintas copias de mundo/compendio.
3. Para los nueve cruces, completar cotejo cultural de cada pieza, recuperar original (Biblioteca/ZIP canónico) y examinar pixel/alpha en Foundry aislado antes de promover imágenes.
4. Recuperar Honda: cotejar ruta legacy `modules/hiperaustralis-rituales/assets/armas/18_honda.webp` y `Qbf0kVDqbeWvJ0ty`. No aplicar reemplazos antes de acreditar origen y equivalencia.
5. Próximo hito técnico: incorporar fuentes de los 40 Items históricos a la rama de prueba únicamente si están disponibles los JSON completos verificables; no reconstruir JSON desde esta matriz compacta.
6. Mantener intactos `main`, MELIAZ Bridge, módulo estable, mundo Foundry productivo y Estado Maestro hasta aprobación explícita.

### Decisiones / Pendientes / Fuentes / Estado Maestro
**Decisiones:** preservar los 40 registros; nueve cruces de trabajo; siete reconocimientos visuales no certifican fidelidad cultural; los maestros están no acreditados en GitHub.
**Pendientes:** recuperación masters y JSON íntegros, cotejo arqueológico, QA de imágenes sobre fondos claro/oscuro, resolver Honda y correlaciones sin cruce, migración declarativa de Items, verificación de hashes SHA-256 y runtime aislado.
**Fuentes:** `INVENTARIO_LEGACY_0.4.75.json` (legacy no canónico); `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`; rama `work/native-compendia-pipeline` — `README.md`, `TRANSFER_MANIFEST.json`, `docs/MATRIZ_CRUCE_ASSETS_FOUNDRY_v01.md`, `docs/CHECKPOINT_SCOPE_COMPENDIOS_2026-11-17.md`; lectura directa de 29 binarios WebP y 7 rutas PNG maestro en GitHub (21-11).
**Estado Maestro:** sin cambios. Tampoco hay cambios en el código de Foundry ni en el Bridge.

**Anexos:** `CORE_MATRIZ_EQUIPO_COMUN_40x29_2026-11-21_v02.csv` y `CORE_INVENTARIO_29_WEBP_STAGING_2026-11-21_v02.csv`.