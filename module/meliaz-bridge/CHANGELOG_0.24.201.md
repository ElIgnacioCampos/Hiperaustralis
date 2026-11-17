# MELIAZ Bridge 0.24.201

## Kona — ocultación de wrappers CSB heredados
- Oculta los contenedores visuales CSB de `equipo_1` a `equipo_7`, no sólo sus inputs.
- Evita que texto/labels de Items legacy aparezcan durante el primer pintado antes del montaje del Bridge.
- Refuerza la ocultación del wrapper del slot 7 y de sus interacciones.
- Conserva valores, Items, flags, propiedades y asignaciones históricas.
- No modifica los cuatro slots actuales, geometría, hitboxes ni drag-and-drop.

## Validación
- `node --check bridge.js`: pendiente de ejecutar en empaquetado.
- Integridad ZIP: pendiente de ejecutar en empaquetado.
- Foundry V14 + CSB 6.x runtime: pendiente.
