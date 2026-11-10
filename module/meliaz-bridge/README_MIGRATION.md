# MELIAZ Bridge — migración 0.24.201

Estado: rama de integración aislada; código fuente todavía no incorporado.

## Fuente validada
- Paquete de origen: `MELIAZ_BRIDGE_0.24.201_KONA_LEGACY_WRAPPERS_V14.zip`
- Versión declarada: `0.24.201`
- Foundry mínimo: V14
- Dependencia: Custom System Builder >= 6.0.0
- Integridad ZIP y sintaxis JavaScript: PASS en auditoría local.
- Prueba de ejecución en Foundry V14 + CSB 6.x: pendiente.

## Reglas de integración
1. Mantener el módulo completo y autocontenido bajo `module/meliaz-bridge/`.
2. Conservar `module.json`, `bridge.js`, `kona-token-icons.js` y todos los recursos originales.
3. No incorporar exportaciones de actores (incluido MONO): son fixtures locales de QA.
4. No mezclar con `hiperaustralis-compendios-prototype` ni con `hiperaustralis-rituales`.
5. No modificar `main`, no hacer merge ni publicar release hasta completar transferencia del paquete y QA runtime.

## QA pendiente
- [ ] Transferir los 167 archivos del paquete 0.24.201 sin omisiones.
- [ ] Verificar hashes contra el manifiesto local de migración.
- [ ] Revisar rutas y carga de recursos desde la nueva ubicación.
- [ ] Instalar en Foundry V14 + CSB 6.x y probar renderizado Kona.
- [ ] Confirmar ausencia de flicker, wrappers fantasma y tooltips residuales.
- [ ] Probar drag-and-drop de Cariños y Lenguas, Equipo, Ñeque, Sentir y Temple.
- [ ] Confirmar persistencia de Items, flags y propiedades CSB.
- [ ] Abrir PR de revisión; no integrar automáticamente.

Esta nota documenta el estado de staging. No representa una entrega funcional ni afirma que el módulo ya esté cargado en GitHub.
