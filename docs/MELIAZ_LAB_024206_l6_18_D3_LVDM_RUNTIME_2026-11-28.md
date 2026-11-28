# MELIAZ LAB.6.18 — D3 runtime · Barra LVDM y marcador

**Fecha:** 2026-11-28  
**Estado:** RUNBOOK PREPARADO / D3 REAL NO EJECUTADO  
**Alcance:** barra LVDM (Combate, Descanso, Kawín), cierre de fases y marcador MELIAZ de cuatro rondas.  
**No modifica:** Bridge estable, mundos H6/H7, compendios, CI137 ni Estado Maestro.

## 1. Candidato de referencia

- Paquete: `MELIAZ_BRIDGE_LAB_0.24.206-lab.6.18_GALERIA256.zip`
- SHA-256: `2e2a4ff8926cb69af30b32044a54e5b894ad4ad0e4b8cd659c783955e74ebc70`
- CRC: PASS
- Módulo: `meliaz-bridge-lab`
- Versión: `0.24.206-lab.6.18`
- Requisitos declarados: Foundry **14.370+**, Custom System Builder **6.1.2+**, SocketLib activo.
- Conflicto declarado: `meliaz-bridge` estable. Nunca activar ambos módulos en el mismo mundo.

## 2. Bloqueo de compatibilidad antes de D3

El último entorno de prueba documentado utiliza Foundry **14.367**, CSB **6.1.2** y Bridge estable **0.24.203**. CSB cumple; Foundry 14.367 no alcanza el mínimo 14.370 del candidato.

**D3 queda bloqueado** hasta actualizar una copia aislada del mundo a Foundry 14.370 o superior, o preparar y validar por separado una build cuya compatibilidad con 14.367 esté demostrada. No rebajar el mínimo del manifiesto sólo para forzar la instalación.

Preparación:
- Trabajar sobre clon aislado, nunca sobre producción ni H6/H7.
- Confirmar versión real de Foundry, CSB y SocketLib.
- Desactivar el Bridge estable sólo dentro del clon y activar únicamente `meliaz-bridge-lab`.
- Tomar snapshot de los Actors de prueba antes de la primera carga; el manifiesto advierte que el primer arranque puede escribir datos en Actors duplicados.
- Registrar consola limpia, ID y versión del módulo activo.

## 3. Alineación GitHub / paquete

La rama documental anterior `work/meliaz-bridge-lab-0.24.204-20261124` contiene documentación hasta LAB.6.18, pero su árbol de código conserva `module.json` **0.24.203** y no incluye los módulos separados `kawin.js` y `round-marker.js). El ZIP de referencia sí contiene `bridge.js`, `kawin.js`, `round-marker.js` y los importa desde `bridge.js`.

Por tanto, el ZIP verificado es la fuente exacta para este D3. No construir ni instalar una versión desde el árbol GitHub anterior hasta sincronizar el código de LAB.6.18.

## 4. QA local ya ejecutado

Sobre el ZIP y sus fuentes recuperadas:

- 22 scripts Node ejecutados.
- **140 bloques PASS**.
- 6 comprobaciones `node --check` PASS.
- CRC del ZIP PASS y SHA-256 coincidente.
- Pruebas específicas: LVDM (9), Kawín colectivo (7), Descanso con recuperación (6), marcador (28), visual D3 simulado (4).

Estas pruebas son simulaciones Node/mocks. **No sustituyen Foundry real, navegador ni sincronización multicliente.** Las trazas de error de Kawín/Descanso corresponden a fallos inyectados deliberadamente; sus pruebas de bloqueo, reintento e idempotencia pasan.

## 5. Matriz D3 — ejecución real

Marcar cada caso PASS/FAIL y adjuntar evidencia. No inferir PASS por la simulación.

| ID | Prueba | Criterio de aceptación |
|---|---|---|
| D3-LVDM-01 | Barra GM | En GM aparece el grupo nativo vertical **Voz del Mundo**, exactamente tres controles y en orden: Combate, Descanso, Kawín. Sin duplicados tras refrescar. |
| D3-LVDM-02 | Permisos | Un jugador no ve el grupo ni puede ejecutar sus acciones llamando los handlers. Confirmar con dos sesiones simultáneas. |
| D3-KAW-01 | Abrir Kawín | Selección explícita de Kona PJ; excluye Rivales y NPC. Texto aprobado. Icono/tooltip pasan a estado abierto. No se recuperan recursos al abrir. |
| D3-KAW-02 | Cerrar Kawín | Cancelar no modifica Actors. Al cerrar, sólo se recuperan participantes registrados y recursos válidos. Simular interrupción parcial: la fase queda bloqueada y el reintento no duplica recuperación ni resumen. |
| D3-REST-01 | Descanso normal | Selección explícita, confirmación de noche real; cancelar no escribe nada. Aguante hasta Ñeque y Newén según Arraigo. No se ejecuta durante Combate o Kawín. |
| D3-REST-02 | Descanso interrumpido | Interrumpir tras una escritura, recargar y reintentar. Conserva el roster original, omite recibos ya aplicados y emite un único resumen. No duplica recuperación. |
| D3-COM-01 | Combate LVDM | Un clic incorpora Kona PJ de la escena antes de iniciar; excluye NPC. Reutiliza encuentro preparado compatible. Doble clic no duplica Combat ni Combatants. |
| D3-COM-02 | Alta parcial | Simular/forzar fallo de alta: no inicia encuentro incompleto. Reintentar reutiliza el encuentro y completa sólo los Kona faltantes. |
| D3-COM-03 | Create Combat nativo | El acceso nativo converge en inicio directo, es start-only y nunca cierra un combate existente. Respeta GM y exclusión Kawín. |
| D3-COM-04 | Cierre seguro | Combate LVDM pide confirmación. No elimina el encuentro mientras el marcador siga abierto o haya limpieza de Manifestaciones pendiente. Permite cerrar cuando ambas condiciones están resueltas. |
| D3-MRK-01 | Posición y visibilidad | Marcador aparece al iniciar. Se acopla junto al listado nativo si el tracker está visible; si no, flota sin tapar controles. Colapsar/expandir y redimensionar no rompe el layout. |
| D3-MRK-02 | Rondas y acciones | Muestra ronda 1/4 y persiste por combate/Kona. Orden sugerido por Picardía sin bloquear intervención. Actuar/Prestar ropa sólo para participantes autorizados; corrección GM funciona. |
| D3-MRK-03 | Aviso y cierre | Aviso Terminar combate tras cuarta ronda o cuando los rivales identificados estén incapacitados. Acción administrativa sólo GM. Cierre y liberación de pendientes requieren confirmación. |
| D3-MULTI-01 | Sincronización | GM y jugador ven el mismo estado tras abrir/cerrar Kawín, Descanso y Combate; las acciones del jugador se reflejan sin refresco manual. Sin eventos, mensajes ni acciones duplicados. |
| D3-PERSIST-01 | Recarga | Recargar/reconectar y reiniciar el mundo no pierde fase, recibos, marcador ni acciones resueltas; no reinyecta hooks ni duplica resultados. |

## 6. Evidencia mínima por ejecución

- Versiones reales de Foundry, CSB, SocketLib y módulo activo.
- Captura GM de la barra y captura jugador sin barra.
- Capturas del marcador acoplado y flotante, y de sus estados de ronda.
- Consola del navegador antes/después; registrar errores nuevos.
- Snapshot de Actors participantes antes/después para Descanso y Kawín.
- Resultado PASS/FAIL por ID, incidencia reproducible y acción tomada.

## 7. Criterio de cierre

D3 sólo queda aprobado cuando todos los casos críticos pasan en el clon compatible, con evidencia GM/jugador y persistencia tras recarga. Ante un fallo, detener la promoción y aislar la incidencia.

No instalar en producción, no activar junto al Bridge estable, no modificar el Estado Maestro y no promover a estable sin aprobación expresa.

**Siguiente paso:** habilitar el clon con Foundry 14.370+ y ejecutar D3-LVDM-01.