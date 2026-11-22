# CI137 — Auditoría de localización de recursos gráficos (lectura de GitHub)

**Fecha:** 2026-11-21. **Alcance:** rama `work/ci137-ensayo-identidad-historica-20261121`, commit `9bb838cde5949106807cff8aa5826a635f9d1148`.
**Estado:** INVENTARIO DOCUMENTAL / SIN REMAPEO / SIN COMPILACIÓN / SIN QA RUNTIME.

## Evidencia automatizada
- Árbol GitHub inspeccionado íntegramente: 376 entradas, sin truncamiento.
- Documentos históricos candidatos inspeccionados por manifiesto: 115 (99 + 16), sin contar los 20 Armas ni los 2 extras.
- WebP versionados bajo `module/assets/_staging/`: 69.
- WebP inventariados en `TRANSFER_MANIFEST.json`: 70; rutas ausentes del árbol: 0.
- Además se localizó el ZIP fuente `source-original/HIPERAUSTRALIS_RELIQUIAS_ASSETS_16_WEBP_v01.zip`, cuyos 16 recursos cuentan con inventario SHA en `manifests/reliquias-assets.json`; los binarios no se extrajeron ni recalcularon en esta pasada.
- `module/assets/reliquias/tokicura_256.webp` está versionado.

## Distribución gráfica en staging
- `module/assets/_staging/defensas/`: 8 WebP
- `module/assets/_staging/equipo/`: 29 WebP
- `module/assets/_staging/instrumentos-erh/`: 28 WebP
- `module/assets/_staging/turianos/`: 4 WebP

## Restricciones
- La coincidencia entre catálogo y archivo no acredita igualdad visual, SHA o autorización editorial.
- No renombrar ni reusar IDs embebidos; los documentos históricos conservan sus `_id`.
- El número 95 de imágenes pendientes es el estado heredado del checkpoint anterior; **no** equivale automáticamente al número de WebP en staging.
- COM-09 Tañaña carece de binario final; Arpa de boca mantiene reserva técnica; ARM-11–13 y el Cuchillo de piedra requieren revisión específica.
- Los 16 recursos de Reliquias del prototipo tienen un pipeline ya acreditado, pero no se ha validado su reasignación a los 16 IDs históricos.

## Siguiente puerta verificable
1. Cruce por documento de `img` y `flags.*.background` de los 137 Items, incorporando los 20 Armas y los 2 extras.
2. Para cada candidato: ruta antigua, candidato nuevo, existencia, tamaño, SHA-256, estado visual/editorial, resultado de remapeo.
3. Mantener en staging los casos ambiguos. Recuperar Cuchillo de piedra y resolver ARM-11–13.
4. Solo tras cerrar esos controles, crear variante de compilación CI137 y ejecutar round-trip; QA Foundry separado.

## Cierre de bloque
**Decisiones:** conservar identidades históricas y del prototipo en paralelo; no promover archivos por coincidencia nominal.
**Pendientes:** matriz item↔asset exhaustiva, SHA binarios y aprobaciones, compilación CI137, pruebas Foundry.
**Fuentes:** dos manifiestos CI137, `TRANSFER_MANIFEST.json`, árbol GitHub, auditorías existentes.
**Estado Maestro / main / Bridge / Foundry / Forge:** sin cambios.
