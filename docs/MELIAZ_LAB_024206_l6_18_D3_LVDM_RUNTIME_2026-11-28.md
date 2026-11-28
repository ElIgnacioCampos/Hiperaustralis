# MELIAZ LAB.6.18 — D3 runtime · Barra LVDM y marcador

**Fecha:** 2026-11-28  
**Estado:** RUNBOOK PREPARADO / D3 REAL NO EJECUTADO  
**Alcance:** barra LVDM (Combate, Descanso, Kawín), cierre de fases y marcador MELIAZ de cuatro rondas.  
**No modifica:** Bridge estable, mundos H6/H7, compendios, CI137 ni Estado Maestro.

## 1. Candidato de referencia

- Paquete: `MELIAZ_BRIDGE_LAB_0.24.206-lab.6.18_GALERIA256.zip`
- SHA-256: `2e2a4ff8926cb69af30b32044a54e5b894ad4ad0e4b8cd659c783955e74ebc70`
- CRC: PASS
- Contenido inspeccionado: 128 entradas de módulo, código, documentación, pruebas y assets. No contiene directorios `packs/`, `worlds/` ni bases de datos de compendios.
- Módulo: `meliaz-bridge-lab`
- Versión: `0.24.206-lab.6.18`
- Requisitos declarados: Foundry **14.370+**, Custom System Builder **6.1.2+**, SocketLib activo.
- Conflicto declarado: `meliaz-bridge` estable. Nunca activar ambos módulos en el mismo mundo.
- Advertencia explícita del manifiesto: el primer arranque puede escribir datos en Actors duplicados. Por eso no basta con que el ZIP no contenga compendios: el runtime debe probarse sólo sobre copia aislada.

## 2. Puerta de seguridad — no actualizar ni sustituir módulos en hipera-7

La referencia anterior de Foundry 14.367 queda superada por un inventario de consola aportado por el usuario el 2026-11-28 desde el mundo **hipera-7**:

| Componente | Valor observado |
|---|---|
| Mundo | `hipera-7` / Hipera 7 |
| Foundry | **14.370** |
| Sistema | Custom System Builder **6.1.2** |
| Bridge estable | `meliaz-bridge` **0.24.203**, inactivo |
| Bridge LAB | `meliaz-bridge-lab` **0.24.206-lab.6.17**, activo |
| SocketLib | **1.1.4**, activo |
| Actors / Scenes / Items | 97 / 3 / 320 |
| Journals / Macros | 4 / 5 |
| Compendios | Territorio, Objetos, Adversarios y Journals de prototipo |

Foundry **14.370** y CSB **6.1.2** ya cumplen los requisitos declarados. No hay motivo para actualizar Foundry.

El inventario no demuestra que `hipera-7` sea un clon desechable ni que exista un respaldo restaurable. Los compendios de Territorio, Objetos y Adversarios aparecen desbloqueados. Se considera un mundo con contenido de trabajo hasta demostrar lo contrario. No instalar, desinstalar ni sustituir módulos en él.

### 2.1 Decisión específica LVDM: probar primero con LAB.6.17

La comparación del parche `patch_618.py` contra LAB.6.17 muestra que el delta de LAB.6.18 se limita a la presentación de galerías de selección de Items/Territorio y al metadato de versión del módulo. No modifica los archivos separados `kawin.js` ni `round-marker.js`.

Por ello, las pruebas pasivas de la barra LVDM pueden comenzar sobre la versión **6.17 ya activa**, sin instalar LAB.6.18. No se debe sustituir el módulo sólo para probar Combate, Descanso o Kawín.

Las pruebas de acciones reales quedan bloqueadas hasta contar con un clon restaurable o actores de prueba aislados y un respaldo verificado. Primero se permite únicamente inspección de UI, estado de fase, permisos y presencia del marcador, en lectura.

### 2.2 Estado observado en hipera-7 — inspección pasiva 2026-11-28

El usuario ejecutó un diagnóstico de sólo lectura. Resultado:

- Mundo `hipera-7`, módulo `0.24.206-lab.6.17`, sesión GM.
- Barra `Voz del Mundo` registrada con tres herramientas visibles y orden 0/1/2: `combate`, `descanso`, `kawin`.
- El título de Combate es `Cerrar combate`; Descanso y Kawín aparecen en sus estados iniciales.
- Kawín y Descanso: `phase=closed`, cero participantes.
- Combat nativo: `started=true`, dos Combatants.
- Flag `roundMarkerV1`: presente, ronda 1, `ended=true`, `pending=0`, `cleanupPending=0`.
- Panel `#ha-meliaz-round-marker` presente.

**Interpretación de código (confirmada contra fuentes de LAB.6.17 y LAB.6.18 con SHA-256 idénticos para `kawin.js` y `round-marker.js`):** es el cierre en dos etapas previsto. El marcador ya terminó; el documento Combat nativo sigue iniciado y debe cerrarse por separado. El título `Cerrar combate` depende de `game.combat.started`, no de `marker.ended`. El panel, cuando `ended=true` y no quedan pendientes, indica que se cierre el combate nativo.

**Riesgo:** al pulsar la herramienta Combate, `kawin.js` pide confirmación, reconcilia/cierra el marcador y, si `ended=true` y `cleanupPending` está vacío, ejecuta `current.delete()`. Esto elimina el documento Combat nativo y sus Combatants. No pulsar hasta identificar el encuentro, escena y participantes y confirmar que no es un registro que deba conservarse.

**QA:** D3-LVDM-01 queda como PASS parcial (registro de grupo, tres herramientas, orden y visibilidad GM). Aún faltan comprobación tras refresco y sesión jugador. Estado de fase y marcador: observados, no modificados. No se ha ejecutado ninguna acción de Combate, Descanso o Kawín.

**Siguiente paso seguro:** diagnóstico de sólo lectura del nombre/ID/escena del Combat actual, Combatants, razón de cierre del marcador, participantes, acciones y otros encuentros iniciados. No pulsar botones ni alterar flags.


### 2.2 Secuencia obligatoria antes de cualquier acción que escriba

1. Obtener respaldo completo del mundo, base de datos, archivos de usuario, módulos y compendios externos/prototipo.
2. Verificar que el respaldo puede restaurarse o duplicarse.
3. Crear un clon independiente y comprobar Actors, escenas, Journals, Items, macros, settings, permisos, carpetas, packs/compendios, IDs y rutas de assets.
4. Mantener intactos `hipera-7` y el respaldo de referencia.
5. Ejecutar D3 con actores de prueba en el clon. Descanso y Kawín modifican recursos/flags de Actors; Combate crea o elimina encuentros, Combatants, flags y mensajes.
6. Comparar inventarios antes/después. Ante cualquier alteración no prevista, detener y restaurar el clon.

**Prohibido:** actualizar Foundry en este mundo, instalar LAB.6.18 encima de LAB.6.17, sustituir el Bridge estable, reinstalar CI137 o reconstruir compendios como parte de esta prueba.
 
## 3. Alineación GitHub / paquete

La rama documental anterior `work/meliaz-bridge-lab-0.24.204-20261124` contiene documentación hasta LAB.6.18, pero su árbol de código conserva `module.json` **0.24.203** y no incluye los módulos separados `kawin.js` y `round-marker.js`. El ZIP de referencia sí contiene `bridge.js`, `kawin.js`, `round-marker.js` y los importa desde `bridge.js`.

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
- Comparación de inventario de compendios y módulos antes/después.
- Resultado PASS/FAIL por ID, incidencia reproducible y acción tomada.

## 7. Criterio de cierre

D3 sólo queda aprobado cuando todos los casos críticos pasan en el clon desechable compatible, con evidencia GM/jugador, persistencia tras recarga y verificación de integridad del mundo y compendios.

No instalar en producción, no activar junto al Bridge estable, no modificar el Estado Maestro y no promover a estable sin aprobación expresa.

**Siguiente paso autorizado por seguridad:** ejecutar únicamente un diagnóstico de sólo lectura de la barra LVDM en `hipera-7` con LAB.6.17 activo. No actualizar Foundry, no instalar LAB.6.18 y no ejecutar acciones de fase hasta contar con respaldo/clon verificado.
