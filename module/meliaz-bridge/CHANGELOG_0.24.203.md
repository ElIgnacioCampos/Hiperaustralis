# MELIAZ Bridge 0.24.203

## Kona — ocultación completa de wrappers CSB heredados de Equipo
- Oculta el wrapper visual de `equipo_1` a `equipo_4`, además del input, para impedir que el texto residual de los campos heredados reaparezca durante los refrescos de Actor provocados por drag-and-drop.
- Conserva intactos los valores `system.props.equipo_N` existentes.
- No elimina Items, no cambia flags ni asignaciones `equipoSlot`, y no altera la geometría de los cuatro espacios.
- Conserva todos los recursos gráficos y archivos del paquete 0.24.202.

## Validación
- ZIP original: íntegro, 169 entradas, CRC correcto.
- `bridge.js`: parche de 0.24.202 + 0.24.203 aplicado sobre la base 0.24.201.
- `node --check` de `bridge.js` y `kona-token-icons.js`: PASS en GitHub Actions.
- Inventario del módulo: 168 archivos; validación de estructura y versión: PASS.
- QA runtime en Forge: pendiente; esta compilación no equivale a prueba visual ni funcional.

<!-- import trigger -->
