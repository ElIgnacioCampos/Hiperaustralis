# CI137 — Estándar operativo de recursos Foundry · 24-11-2026

## Decisión autoral
Optimizar el conjunto para Foundry: WebP 256 px para iconos, tokens y retratos, sin redundancias. Corrección autoral posterior: fondos y mapas deben mantener una resolución mayor.

## Aplicación técnica
- Iconos, tokens y retratos: lado mayor máximo 256 px; cuadrado 256×256 cuando ya lo sea. Sin recorte, deformación ni ampliación.
- Conservar transparencia, silueta, composición y geometría. Redimensionar con Lanczos, WebP calidad 87, alfa exacto a resolución de destino. Conservar bytes de archivos ya conformes.
- Originales de respaldo fuera del módulo runtime.
- **Fondos y mapas: excluidos del límite de 256 px.** Conservar la resolución original útil, la relación de aspecto y la geometría del mapa; optimizar peso mediante WebP sin reducir dimensiones por defecto. Cualquier reducción debe justificarse por el uso real y comprobar legibilidad, detalles y escala de escena. No imponer una resolución fija sin cotejo.
- Imágenes documentales: resolución según legibilidad; 256 px sólo para miniaturas, no para material que necesite ampliación.
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
Los 27 recursos documentales Culturas y fotografías de fondo son previews 256; no promover fondos o mapas de este lote. Recuperar sus versiones de mayor resolución desde los originales preservados y comprobar legibilidad documental. El ahorro del ensayo no representa el tamaño final del módulo corregido.

## Pendientes
Recuperar 22 HAB, 5 FAU prehistóricos, EXO-009 y 4 Turiano Journal refs. Cotejar recursos restantes QA5 y QA6, normalización Turianos v06 y Bridge de forma separada. Integrar remapeos y auditar rutas completas, D2/D3.
QA5, Bridge, Forge y Estado Maestro intactos.

## Ensayo corregido v02 — resolución mixta (24-11-2026)
- 193 recursos; 126 iconos/tokens/retratos <=256 px, 67 fotografías documentales/fondos restaurados byte a byte desde 0.4.100 (27 Culturas, 32 Fauna fotográfica, 8 Flora de bioma). Los 17 candidatos siguen aislados.
- Todos WebP; CRC, decodificación, dimensiones y SHA256 de cada miembro comprobados. No se han alterado los 126 binarios pequeños del primer ensayo.
- 22.083.654 bytes originales -> 17.982.426 bytes operativos de staging (-18,57%).
- ZIP local CI137_ASSETS_OPTIMIZADOS_RESOLUCION_MIXTA_20261124_v02.zip, 18.204.828 bytes, SHA256 a5d6a0297e0e97b872ccf799a7790657f667533b01cb480d3f9e9c4e06a139a4. Sustituye al ensayo global 256 como candidato, no instalable. No subir ZIP duplicado al repositorio; originales ya respaldados en Biblioteca y manifiesto interno. No implica aprobación artística ni D3.
- QA5, Bridge, Forge y Estado Maestro intactos. Próximo frente: HAB, FAU prehistórica, EXO-009 y rutas Turiano Journal.
