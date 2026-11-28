# MELIAZ LAB.6.18 — D3 runtime · Barra LVDM y marcador

**Fecha:** 2026-11-28  
**Estado:** D3 REAL EN CURSO / LVDM PASIVO PARCIALMENTE VALIDADO  
**Alcance:** barra LVDM (Combate, Descanso, Kawín), cierre de fases y marcador MELIAZ de cuatro rondas.  
**Entorno D3 confirmado por el usuario:** `hipera-7` es mundo de pruebas. No crear otro mundo ni abrir un frente de respaldos. Trabajar con el Bridge LAB activo y el código versionado en GitHub; no modificar Bridge estable, CI137, compendios ni Estado Maestro.

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

## 2. Entorno de pruebas y D3 — H7

**Destino confirmado por el usuario:** `hipera-7` es el mundo de pruebas del Bridge. No crear otro mundo ni convertir este trabajo en una tarea de respaldos. El ZIP de exportación de H7 recibido en este chat queda fuera del flujo de desarrollo y no genera pendientes de exportación de compendios/assets.

### 2.1 Runtime observado

| Componente | Valor |
|---|---|
| Mundo | `hipera-7` / Hipera 7 |
| Foundry | **14.370** |
| Custom System Builder | **6.1.2** |
| Bridge estable | `meliaz-bridge` **0.24.203**, inactivo |
| Bridge LAB | `meliaz-bridge-lab` **0.24.206-lab.6.17**, activo |
| SocketLib | **1.1.4**, activo |
| Actors / Scenes / Items | 97 / 3 / 320 |
| Journals / Macros | 4 / 5 |
| Compendios observados | Territorio, Objetos, Adversarios y Journals de prototipo |

Foundry y CSB cumplen los requisitos del candidato LAB.6.18. No actualizar Foundry ni sustituir módulos para probar LVDM.

### 2.2 Barra LVDM — inspección pasiva

El diagnóstico en H7 confirmó:
- Grupo **Voz del Mundo** registrado para GM.
- Tres controles visibles y en orden: Combate (0), Descanso (1), Kawín (2).
- Kawín y Descanso: `phase=closed`, cero participantes.
- Marcador MELIAZ presente en el Combat observado.

**D3-LVDM-01:** PASS parcial (registro, orden y visibilidad GM). Pendiente refresco y sesión jugador.

### 2.3 Cierre de combate — comportamiento confirmado

El Combat observado fue `vgRz61croGsmWvfo`, escena Bosque Turiano, con Eiríkr Þorsteinsson y Chope. Su flag indicaba `ended=true`, razón `Cerrado por Dirección`, `cleanupPending=[]`, mientras Foundry aún tenía `started=true`.

El usuario confirmó que al pulsar **End Combat** nativo el encuentro termina y el marcador desaparece. Ese comportamiento es correcto y no requiere cambios.

### 2.4 Cierre al completar cuatro rondas — implementación existente

La función fue solicitada e incorporada desde LAB.6.14. No hay que rediseñarla ni reimplementarla.

- `advance(s,c)` cierra el marcador con `Cuarta ronda completada` cuando todos los Kona activos registraron su acción en ronda 4.
- `updateEndAdvice` genera el aviso al GM; `render()` muestra **Terminar combate**.
- El GM pulsa el botón y confirma.
- `finishNative(c)` reconcilia, limpia Manifestaciones pendientes y elimina el documento Combat si la limpieza terminó.
- También se ofrece el aviso cuando todos los rivales identificados están incapacitados.

QA simulado previo: PASS. D3 real en Foundry: pendiente.

### 2.5 QA de código disponible

La suite local de LAB.6.17/6.18 se ejecutó de nuevo:
- LVDM: 9 PASS.
- Marcador: 28 PASS.
- Descanso: 6 PASS.
- Kawín colectivo: 7 PASS.
- La prueba de rondas confirma el aviso al completar la cuarta ronda, sin cierre silencioso ni quinta ronda.

La suite simula documentos/socket; no reemplaza la prueba de runtime en H7.

### 2.6 Siguiente ejecución D3 en H7

Orden de trabajo, sin reinstalar ni actualizar módulos:

1. Comprobar el estado de `game.combat` después del **End Combat** nativo. Determinar si Foundry deja seleccionado el Combat terminado o libera el actual.
2. Iniciar un encuentro nuevo desde **Voz del Mundo → Combate** y comprobar que el marcador nace en ronda 1/4, sin heredar `ended=true` del encuentro anterior.
3. Con los Kona del encuentro, usar **Actuar → Pasar turno** para registrar una acción por participante en cada ronda. Pasar turno no gasta recursos ni modifica atributos del Actor; sólo registra participación en el marcador.
4. Repetir hasta completar ronda 4. Comprobar aviso GM, botón **Terminar combate**, confirmación, limpieza de Manifestaciones y desaparición del marcador/encuentro.
5. Registrar resultado PASS/FAIL y cualquier incidencia reproducible. No cambiar código si el flujo funciona.

**Nota de riesgo funcional a verificar:** el código de `kawin.js` reutiliza `game.combat` cuando existe y no está iniciado. Si Foundry conserva como actual el Combat ya terminado, hay que verificar que el marcador se reinicie correctamente antes de usarlo como encuentro nuevo. No darlo por supuesto: es el primer punto de D3.

**No se trabaja en respaldos, exportación de compendios ni Asset Sync.** El frente activo es el Bridge: barra LVDM, fases y marcador de cuatro rondas.

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

**Siguiente paso autorizado por seguridad:** confirmar respaldo restaurable de H7 y localizar escena/actores de prueba. No actualizar Foundry ni instalar LAB.6.18. D3 se ejecutará en H7 con LAB.6.17 y datos de prueba aislados.
