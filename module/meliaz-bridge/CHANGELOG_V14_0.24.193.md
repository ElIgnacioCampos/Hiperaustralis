# MELIAZ Bridge 0.24.193
Fecha: 2026-11-09
Base técnica: 0.24.192 · Foundry VTT 14.

## Sincronización con Compendios 0.4.89
- Se registra compatibilidad de entrega con los seis iconos ERH de instrumentos actualizados en el compendio.
- La interfaz Sentir/Instrumentos consume los Items del compendio y sus datos (nombre e imagen); no mantiene una segunda copia local de esos seis iconos.
- No se modifican `bridge.js`, `kona-token-icons.js`, hoja Kona, geometría, hitboxes, drag-and-drop, sockets ni lógica de actores.
- No se agregan assets duplicados a Bridge.

## QA
- ZIP íntegro; archivos y código ejecutable idénticos a 0.24.192, excepto `module.json` y este changelog.
- La versión 0.24.193 es un release de sincronización/compatibilidad, no un cambio funcional de Bridge.
- Runtime Foundry V14 no probado en esta sesión.
