# MELIAZ Bridge — migración 0.24.201

Estado: rama de integración aislada; el paquete binario completo todavía no está incorporado a GitHub.

## Fuente validada
- Paquete de origen: `MELIAZ_BRIDGE_0.24.201_KONA_LEGACY_WRAPPERS_V14.zip`
- Versión declarada: `0.24.201`
- Identificador: `meliaz-bridge`
- Foundry mínimo: V14
- Dependencia: Custom System Builder >= 6.0.0
- Integridad ZIP y sintaxis JavaScript: PASS en auditoría local.
- Prueba de ejecución en Foundry V14 + CSB 6.x: pendiente.

## Flujo operativo elegido
- Forge sigue siendo el alojamiento y entorno de instalación/pruebas.
- GitHub conserva el código fuente, historial y versiones.
- No se requiere Git local ni PowerShell para operar Foundry.
- Para instalar un ZIP personalizado en Forge se usa Games Configuration → Summon Import Wizard.
- Import Wizard reemplaza el paquete instalado si coincide el mismo identificador. Por tanto, antes de importar 0.24.201 se debe respaldar la versión actualmente instalada y confirmar que se puede restaurar.
- No importar sobre la instalación activa sin ese respaldo. No cambiar el identificador del módulo a ciegas: primero habría que auditar referencias internas y dependencias.

## Reglas de integración
1. Mantener el módulo completo y autocontenido bajo `module/meliaz-bridge/`.
2. Conservar `module.json`, `bridge.js`, `kona-token-icons.js` y todos los recursos originales.
3. No incorporar exportaciones de actores (incluido MONO): son fixtures locales de QA.
4. No mezclar con `hiperaustralis-compendios-prototype` ni con `hiperaustralis-rituales`.
5. No modificar `main`, no hacer merge ni publicar release hasta completar transferencia del paquete y QA runtime.

## QA pendiente
- [ ] Transferir los 167 archivos del paquete 0.24.201 sin omisiones.
- [ ] Verificar hashes contra el manifiesto local de migración.
- [ ] Respaldar la versión activa del Bridge en Forge y confirmar restauración posible.
- [ ] Instalar la candidata de forma controlada en Forge.
- [ ] Comprobar carga y renderizado Kona en Foundry V14 + CSB 6.x.
- [ ] Confirmar ausencia de flicker, wrappers fantasma y tooltips residuales.
- [ ] Probar drag-and-drop de Cariños y Lenguas, Equipo, Ñeque, Sentir y Temple.
- [ ] Confirmar persistencia de Items, flags y propiedades CSB.
- [ ] Registrar resultados y sólo entonces preparar publicación/versionado.

Esta nota documenta el estado de staging. No representa una entrega funcional ni afirma que el módulo ya esté cargado en GitHub o probado en Forge.
