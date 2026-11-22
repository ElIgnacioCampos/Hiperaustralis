# Hiperaustralis — CORE / Equipo Común
## L04 · Hacha de herramienta lickanantay · filo localizado v02
**Fecha:** 2026-11-21. **Estado:** CANDIDATO DE CORRECCIÓN, pendiente de aprobación visual y QA de Foundry. **Rama:** `work/native-compendia-pipeline`.

### Autoridad y alcance
El usuario autorizó con **«ok»** ejecutar la sugerencia de corregir **solo el filo romo** de la Hacha de trabajo lickanantay del Lote 04. No autorizó regenerar las cuatro piezas ni alterar iconos ya aprobados.

**Identidad del ítem:** `Hacha`, cultura Lickanantay, ID de compendio histórico `V70OePeRN8xLcbuy`, `world.hiperaustralis-rituales`. Es Equipo Común y una **herramienta**; no promoverla a Armas.

### Ejecución
- Se conserva **sin alteración** la lámina original 2×2, que había sido aprobada como base de examen individual.
- Un intento de edición con generación de imagen rehízo otras piezas de la lámina: **SE DESCARTÓ** y no se usó como fuente final.
- El resultado final se ejecutó sobre **el original** con tratamiento local del borde distal de la cabeza de piedra: bisel pictórico claro, relieve suave y borde interno de contraste. **No cambia la silueta exterior, el alfa ni la geometría**. Los rasgos del mango y amarras son píxel a píxel idénticos.
- Análisis de diferencia sobre la lámina 1254×1254: **8.834 píxeles RGB cambiados**, todos dentro del rectángulo `x=476..610, y=779..925` del hacha, **sin modificar el canal alfa en ningún píxel**. No hay cambios fuera de esa región.
- Se aisló el componente de hacha por máscara de opacidad, independiente de la estera, y se generó PNG maestro **512×512 RGBA** y WebP **256×256 lossless** con alfa.
- Revisión visual realizada sobre fondos claro y oscuro. El filo adquiere mayor lectura, pero el perfil sigue siendo redondeado; no declararlo como reconstrucción arqueológica exacta ni como mejora aprobada por el usuario.
- Ninguna escritura o vinculación en Foundry; el `img` original y el resto del documento fuente permanecen intactos.

### Artefactos verificados
**Archivo ZIP:** `HIPERA_EQUIPO_COMUN_L04_HACHA_FILO_v02_CANDIDATO.zip` — 5.211.671 bytes.
**SHA-256 ZIP:** `2c5fae72bc9eb88f87466502d370ec08761af1641dc318e125bec50ee4990446`.
**Respaldo BBTECA (verificado):** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L04_HACHA_FILO_v02_CANDIDATO.zip`.
**Archivo visual previo preservado:** `HIPERA_EQUIPO_COMUN_L04_BASE_2x2_EXAMEN_INDIVIDUAL_v01.png` en la misma carpeta.

**PNG maestro 512:** `MAESTROS_PNG_512/EQ_LICK_HACHA_HERRAMIENTA_L04_v02_FILO_DEFINIDO.png`
SHA-256 `25a83f4b5490364bf595b0e33e20c9115da5c5bf190fc6f4cac203d3d305bbcc`.

**WebP Foundry 256:** `FOUNDRY_WEBP_256/EQ_LICK_HACHA_HERRAMIENTA_L04_v02_FILO_DEFINIDO.webp`
SHA-256 `1a2c193f7443db9b5f66f0ee609e433e99ae9684d2c0febace7527abba8404f1`.

**Fuente original L04:** SHA-256 `420d1464ea3c8a5a91abc3c576245bd8a05802c3ee1aaab1940ba926f7b7702a`.

**Controles:** CRC ZIP PASS, tamaño 512/256 PASS, formato WebP lossless PASS, máscara de hacha aislada PASS, alfa original inalterado PASS, regiones no objetivo sin cambios PASS. No QA dentro de cliente Foundry todavía.

### Decisiones, pendientes y cierre
**Decisiones:** versión L04 v02 corregida exclusivamente en el filo, **CANDIDATA** para aprobación; conservar todos los testigos anteriores. No volver a generar Rali, Wakulla ni estera. Mantener hacha como herramienta.

**Pendientes:** aprobación visual de este bisel; si el filo sigue romo, corrección dirigida solo a la geometría del extremo de la piedra; derivación/QA de los otros tres objetos una vez estén listos; prueba de carga real en Foundry aislado; autorización explícita de promoción de rutas `img`.

**Fuentes:** lámina original L04 aprobada para examen individual, checkpoint `CORE_EQUIPO_COMUN_L04_EXAMEN_INDIVIDUAL_20261121_v01.md`, export Foundry del 19-11-2026, y este paquete.

**Cambios al Estado Maestro:** ninguno. **Sin cambios:** `main`, Bridge, mundo productivo, compendio, configuración de ítems.
