# MELIAZ LAB.6.18 — D3 runtime · Barra LVDM y marcador

**Fecha:** 2026-11-28  
**Estado:** PAUSADO / LAB.6.18 NO RECUPERABLE / D3 NO EJECUTADO SOBRE EL CANDIDATO  
**Alcance:** barra LVDM (Combate, Descanso, Kawín), cierre de fases y marcador MELIAZ de cuatro rondas.  
**Entorno D3 confirmado por el usuario:** `hipera-7` es mundo de pruebas. No crear otro mundo ni abrir un frente de respaldos. Trabajar con el Bridge LAB activo y el código versionado en GitHub; no modificar Bridge estable, CI137, compendios ni Estado Maestro.

## 1. LAB.6.18 — antecedente no instalable

El paquete se registró históricamente como:
- Nombre: `MELIAZ_BRIDGE_LAB_0.24.206-lab.6.18_GALERIA256.zip`.
- SHA-256 registrado: `2e2a4ff8926cb69af30b32044a54e5b894ad4ad0e4b8cd659c783955e74ebc70`.
- Versión declarada: `0.24.206-lab.6.18`.
- Requisitos declarados: Foundry **14.370+**, CSB **6.1.2+**, SocketLib activo.

**Corrección posterior de continuidad (Biblioteca, 2026-11-28):** la fuente binaria exacta de LAB.6.18 fue declarada **NO RECUPERABLE** y se cerró su búsqueda. No solicitar de nuevo el ZIP, no reconstruir LAB.6.18 desde LAB.6.17/anteriores, Bridge estable 0.24.203 ni desde la rama GitHub desincronizada. El nombre, hash y resultados históricos se conservan sólo como registro; no autorizan instalación ni certificación actual.

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

**Reejecución local 2026-11-28 (fuentes del candidato LAB.6.18):**
- `test_lvdm.mjs`: 9 pruebas PASS.
- `test_round_marker.mjs`: 28 pruebas PASS.
- `test_rest_recovery.mjs`: 6 pruebas PASS (los errores de escritura/chat/cierre se inyectan deliberadamente y sus recuperaciones pasan).
- `test_kawin_collective.mjs`: 7 pruebas PASS (fallo de escritura inyectado deliberadamente; reintento idempotente PASS).
- SHA-256 `kawin.js`: `b2378806494a3f3d4195762b9403f2906cd7d36be246851531c71e553872dd1d`.
- SHA-256 `round-marker.js`: `56d2a955b536b0d63afb8f6b203ad27d26120b90454f5409dddc9d525978eeba`.
- Ambos archivos son idénticos en los paquetes recuperados LAB.6.17 y LAB.6.18.

Estas pruebas son unitarias/simuladas. No certifican runtime Foundry; D3 sigue siendo la validación pendiente.

### 2.6 Inspección accidental de LAB.6.17 — no cuenta como D3 de LAB.6.18

El 2026-11-28 se inspeccionó H7, donde estaba activo `meliaz-bridge-lab 0.24.206-lab.6.17`. El usuario pulsó **End Combat** nativo y luego inició manualmente otro encuentro. La lectura posterior mostró un Combat nuevo con marcador `ended=false`, ronda 1 y sin pendientes.

**Clasificación correcta:** observación de funcionamiento de LAB.6.17 únicamente. No valida LAB.6.18, no es D3 del candidato y no justifica seguir probando rondas sobre la versión anterior. Se detiene aquí la prueba de LAB.6.17.

### 2.7 Continuidad correcta del Bridge / LVDM

1. Recuperar e identificar el commit/artefacto exacto del último Bridge aprobado. No inferirlo desde la versión activa en H7 ni desde una rama documental.
2. Usar esa base aprobada para desarrollar un **candidato nuevo**, con identificador/versionado propio. No llamarlo LAB.6.18 ni atribuirle equivalencia.
3. Recuperar del registro funcional aprobado el alcance LVDM: barra GM Combate/Descanso/Kawín, marcador MELIAZ y cierre por cuarta ronda. Mantener las decisiones ya cerradas; no rediseñarlas.
4. Sincronizar en GitHub el código fuente completo del candidato, manifiesto, dependencias, pruebas y documentación. Verificar que la rama contiene los archivos realmente empaquetados.
5. Ejecutar QA local y generar ZIP reproducible con hash. Sólo entonces instalar ese candidato en H7.
6. Ejecutar D3 real sobre la versión efectivamente instalada: barra, permisos GM/jugador, Combate, Descanso, Kawín, marcador, cuarta ronda, persistencia y multicliente.
7. Registrar resultados por caso y promover sólo tras aprobación explícita.

**No continuar las pruebas de cuatro rondas en LAB.6.17 como sustituto de D3.18. No instalar ni reconstruir el paquete perdido.** El frente sigue siendo GitHub/Foundry: construir y verificar un candidato nuevo sobre la base aprobada, con LVDM como alcance.

## 3. Alineación GitHub / paquete

La rama documental `work/meliaz-lab618-lvdm-d3-20261128` no es fuente instalable de LAB.6.18: su árbol no está sincronizado con el paquete candidato y conserva un manifiesto antiguo. La fuente binaria exacta fue declarada NO RECUPERABLE en el replan posterior de Biblioteca. Esta rama se mantiene sólo como registro del análisis; no usarla para construir ni instalar módulos.

## 4. QA local ya ejecutado

Sobre el ZIP y sus fuentes recuperadas:

- 22 scripts Node ejecutados.
- **140 bloques PASS**.
- 6 comprobaciones `node --check` PASS.
- CRC del ZIP PASS y SHA-256 coincidente.
- Pruebas específicas: LVDM (9), Kawín colectivo (7), Descanso con recuperación (6), marcador (28), visual D3 simulado (4).

Estas cifras son un registro histórico de QA atribuido al paquete LAB.6.18 antes de declararse no recuperable. Las fuentes exactas no están disponibles para repetirlo; por tanto, no se presentan como QA reproducible del candidato actual ni sustituyen un build verificable.

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

D3 sólo puede comenzar cuando exista un candidato nuevo, reproducible y sincronizado con GitHub, instalado efectivamente en H7. La prueba debe registrar la versión/hash realmente cargados y cubrir evidencia GM/jugador, persistencia y todos los casos críticos.

No instalar en producción, no activar junto al Bridge estable, no modificar el Estado Maestro y no promover a estable sin aprobación expresa.

**Siguiente paso:** recuperar la base exacta del Bridge aprobado y construir el nuevo candidato LVDM. LAB.6.18 permanece no recuperable y no instalado; LAB.6.17 no sustituye su validación.
