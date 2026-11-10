# MELIAZ Bridge — migración a GitHub

Estado: migración de fuente en curso; el código completo del módulo todavía no está incorporado a GitHub.

## Base estable confirmada
- Identificador: `meliaz-bridge`
- Versión activa en Forge: `0.24.201`
- Foundry: V14, build 367
- Custom System Builder: 6.0.2
- La hoja Kona abre y funciona en el mundo `Hipera 5`.
- La exportación del mundo del 10-11-2026 fue recibida y validada como ZIP. Contiene datos del mundo y compendios, pero no incluye el directorio `modules/`; no sustituye un respaldo del código del Bridge.

## Resultado de la limpieza Kona
- 0.24.201 queda como base estable.
- 0.24.202 y 0.24.203 fueron probadas en Forge; no produjeron una mejora visual perceptible del texto fugaz durante drag-and-drop.
- No se observaron regresiones adicionales reportadas por el usuario.
- El defecto se clasifica como cosmético y de prioridad baja: texto heredado visible brevemente durante el arrastre.
- No seguir parcheando a ciegas ni borrar los campos CSB heredados.
- Conservar cuatro espacios de Equipo, sus posiciones y las asignaciones antiguas.
- No modificar Cariños, Lenguas, Ñeque, Sentir ni Temple como parte de esta corrección.

## Flujo operativo
- Forge es el alojamiento y entorno de ejecución/pruebas.
- GitHub conserva código fuente, historial y versiones.
- No se requiere Git local ni PowerShell para operar Foundry.
- No importar ZIPs experimentales sobre la instalación activa sin una copia restaurable del módulo.
- Import Wizard reemplaza el paquete instalado cuando coincide el identificador `meliaz-bridge`.
- No cambiar el identificador del módulo a ciegas.

## Reglas de integración
1. Mantener el módulo completo y autocontenido bajo `module/meliaz-bridge/`.
2. Conservar `module.json`, `bridge.js`, `kona-token-icons.js` y todos los recursos originales.
3. No incorporar exportaciones de actores (incluido MONO): son fixtures locales de QA.
4. No mezclar con `hiperaustralis-compendios-prototype` ni con `hiperaustralis-rituales`.
5. No modificar `main`, no hacer merge ni publicar release hasta completar transferencia del paquete y QA.

## Estado de transferencia
- Paquete fuente de origen: `MELIAZ_BRIDGE_0.24.201_KONA_LEGACY_WRAPPERS_V14.zip`
- Auditoría local previa: 167 archivos de módulo; ZIP íntegro y sintaxis JavaScript correcta.
- Rama de trabajo: `work/meliaz-bridge-0.24.201-migration`
- Esta rama contiene documentación de migración, no el código completo del módulo.
- La transferencia binaria completa sigue pendiente; no afirmar que el módulo fuente ya está en GitHub.

## Próximos pasos
- [ ] Transferir los 167 archivos del paquete 0.24.201 sin omisiones.
- [ ] Verificar hashes contra el manifiesto local.
- [ ] Incorporar un inventario de archivos y versiones al repositorio.
- [ ] Mantener la rama aislada y no tocar `main`.
- [ ] Tras completar transferencia, revisar diffs y preparar QA/runtime antes de cualquier release.

Esta nota documenta el estado real de la migración. No representa una entrega funcional ni afirma que el código completo ya esté cargado en GitHub.
