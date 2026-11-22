# CI137 — Rescate binario comparado 0.4.72 ↔ 0.4.73

**Estado:** 30 WebP RECUPERADOS EN COPIA LOCAL, CANDIDATOS HISTÓRICOS; NO PUBLICADOS NI APROBADOS COMO FINALES CI137.

## Fuentes leídas físicamente (Drive)

- `HIPERAUSTRALIS_COMPENDIOS_0.4.72_REPARACION_BIO_LAB.zip` — 45.575.174 bytes; SHA-256 `437b263f40c0c1e18cd24d0bcb996a4e1769a3830978133d0c839a0dbe1b228c`; 357 miembros ZIP, CRC PASS.
- `HIPERAUSTRALIS_COMPENDIOS_0.4.73_BIO_TEXTOS_LAB.zip` — 45.575.239 bytes; SHA-256 `2d8830d5a18b7d6ff7ba4eee469214fef7b7efdf7164b552464620a0580a5329`; 357 miembros ZIP, CRC PASS.

Se localizaron 22/22 rutas literales de `assets/iconos_aprobados/` y 8/8 rutas de `assets/rituales/`, exactamente como figuran en los 30 JSON históricos del export de Hipera 5 y en el manifiesto CI137.

**Comparación binaria 0.4.72 ↔ 0.4.73:** 30/30 SHA-256 individuales **idénticos**. Ningún recurso adicional o ausente en estas dos carpetas. El lote descomprimido suma **1.320.996 bytes**, 30 imágenes decodificables de **512 × 512 px**, y pasó comprobación CRC y decodificación WebP.

## Salida recuperada

- Copia de staging local no canónica: `CI137_CANDIDATO_0473_30_WEBP.zip`, con los 30 archivos y manifiesto interno.
- `CI137_CANDIDATO_0473_MANIFIESTO.json`: hashes SHA-256 y tamaño individual por ruta, del lote 0.4.73.
- Los binarios no están promovidos a GitHub por el presente commit. Los manifiestos locales son los insumos para un cotejo contra 0.4.75 si se recupera.

## Límite de autoridad

Que dos respaldos históricos sean idénticos **no demuestra** que coincidan con la selección editorial posterior ni con el staging 96 del 18–19/11. El checkpoint previo afirma 59 assets validados contra 0.4.75; falta comprobar los hashes de estos 30 con aquella fuente.

No usar 0.4.72/0.4.73 para reemplazar archivos finales aprobados sin el cotejo posterior. `main`, Foundry, Forge, Bridge y Estado Maestro no recibieron cambios.

## Decisiones / Pendientes / Fuentes / Maestro

**Decisiones:** se rescatan como candidatos sin regeneración gráfica; 30 rutas originales aseguradas; identidad confirmada en JSON; no promover.  
**Pendientes:** cotejo con backup SHA `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e` (0.4.75), decidir transferencia de estos mismos bytes sólo si coinciden, QA real CI137.  
**Fuentes:** ZIPs históricos 0.4.72 y 0.4.73, 30 JSON históricos, manifiesto de recuperación CI137, checkpoint 18–19/11.  
**Estado Maestro:** sin cambios.
