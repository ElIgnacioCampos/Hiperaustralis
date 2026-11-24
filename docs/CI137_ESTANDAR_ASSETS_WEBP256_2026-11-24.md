# CI137 — Estándar operativo de recursos Foundry · 24-11-2026

## Decisión autoral
Optimizar el conjunto para Foundry: preferentemente WebP 256 px, sin redundancias.

## Aplicación técnica
- Iconos, tokens y retratos: lado mayor máximo 256 px; cuadrado 256×256 cuando ya lo sea. Sin recorte, deformación ni ampliación.
- Conservar transparencia, silueta, composición y geometría. Redimensionar con Lanczos, WebP calidad 87, alfa exacto a resolución de destino. Conservar bytes de archivos ya conformes.
- Originales de respaldo fuera del módulo runtime. Mapas, fondos y documentación: 256 px por defecto; excepción justificada si su legibilidad exige resolución superior.
- Una sola copia por recurso idéntico, referencias compartidas entre fichas. Comprobar hashes y píxeles exactos; no fusionar variantes por parecido, no mezclar candidatos con aprobados.
- Los 40 tokens Kona permanecen en Bridge; no duplicar.
- Remapear referencias sólo tras validar destino, procedencia y aprobación. No sustituir arte ni cambiar IDs por optimización.

## Primer ensayo físico
Fuente: 0.4.100, SHA256 14c674d3e0ea42ecda068e0bdf071d929a90d30c455b756a3cca3a573b2a81fd.
193 recursos recuperados; 176 rutas exactas y 17 candidatos de otra raíz aislados.
Originales 22.083.654 bytes; staging WebP256 4.434.816 bytes (-79,92%).
193 binarios únicos; no se encontraron duplicados exactos dentro de cada ámbito de procedencia. Archivos ya 256 conservados.
ZIP CI137_ASSETS_WEBP256_STAGING_20261124.zip, 4.655.032 bytes, SHA256 4a95bc340c81a7ef6d366ab79fb07044d0821757fac00ffe4d08fbc3faa04295. CRC, hashes, dimensiones y alfa comprobados; cotejo visual de siete ejemplos.
El ZIP contiene MANIFEST.json con rutas, transformaciones, hashes originales/destino y referencias pendientes. No instalable ni aprobación de arte.
Los 27 recursos documentales Culturas y fotografías de fondo son previews 256; revisar legibilidad antes de promover.

## Pendientes
Recuperar 22 HAB, 5 FAU prehistóricos, EXO-009 y 4 Turiano Journal refs. Cotejar recursos restantes QA5 y QA6, normalización Turianos v06 y Bridge de forma separada. Integrar remapeos y auditar rutas completas, D2/D3.
QA5, Bridge, Forge y Estado Maestro intactos.