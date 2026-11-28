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


### 2.3 Confirmación visual y semántica de cierre — captura 2026-11-28

El usuario aportó captura de Foundry en `hipera-7` que muestra el panel persistente:

- `MELIAZ · Combate cerrado`
- `Cerrado por Dirección`
- `Cierra el combate nativo en Foundry.`

En el tracker nativo sigue visible el control `End Combat`. La captura coincide con el estado leído por consola: `game.combat.started=true`, flag `roundMarkerV1.ended=true`, `reason='Cerrado por Dirección'`, `cleanupPending=[]`.

**No es un modal bloqueado ni un menú huérfano:** es la tarjeta de estado final del marcador, que permanece visible mientras el Combat nativo siga iniciado. En `round-marker.js`, `render()` conserva la tarjeta y muestra el mensaje de cierre nativo cuando `s.ended`; si `!game.combat.started`, restaura la UI nativa, elimina la tarjeta y cierra el menú.

**Tres acciones distintas que no deben confundirse:**

1. **Marcador MELIAZ → botón `Cerrar`:** pide confirmación y ejecuta `manual(c,'end')`. Cambia el marcador a `ended=true`, razón `Cerrado por Dirección`, y limpia Manifestaciones. No elimina el Combat nativo. La tarjeta permanece para informar el siguiente paso.
2. **Tracker nativo Foundry → `End Combat`:** es el cierre del encuentro nativo indicado por la tarjeta. Cuando Foundry deja `started=false`, el renderizador MELIAZ retira la tarjeta. Esta es la acción nativa a usar si se decide terminar ese encuentro.
3. **Barra LVDM → `Cerrar combate`:** es otra ruta. Pide confirmación, reconcilia y cierra el marcador; si no quedan pendientes, ejecuta `current.delete()`. **Elimina el documento Combat y sus Combatants.** No usar como equivalente inocuo del botón MELIAZ `Cerrar`.

El código inspeccionado confirma la distinción: `kawin.js` llama `current.delete()` en la ruta de la barra; `round-marker.js` mantiene la tarjeta mientras el encuentro siga iniciado y la quita cuando `!c.started`.

**Estado del encuentro de la captura:** escena `Bosque Turiano`; Combat ID `vgRz61croGsmWvfo`; Combatants Eiríkr Þorsteinsson y Chope. No se presume que sea un encuentro desechable. No pulsar ningún cierre ni borrar el Combat hasta que el usuario confirme que puede finalizar ese encuentro.

**Resultado QA:** D3-LVDM-01 PASS en registro/orden/visibilidad GM y tarjeta de estado observada. Cierre en dos etapas confirmado por captura + flags; falta probar refresco y sesión jugador. Ningún dato fue modificado durante la inspección.

**Propuesta UX para revisión, no implementada:** reemplazar el mensaje ambiguo por `MARCADOR CERRADO · Encuentro de Foundry aún activo`, manteniendo el aviso de que el siguiente paso se realiza en el tracker nativo. Mantener el botón de la barra claramente rotulado como cierre que elimina el documento Combat, o reconsiderar su comportamiento sólo mediante una decisión de diseño explícita.


### 2.2 Secuencia obligatoria antes de cualquier acción que escriba

1. Obtener respaldo completo del mundo, base de datos, archivos de usuario, módulos y compendios externos/prototipo.
2. Verificar que el respaldo puede restaurarse o duplicarse.
3. Crear un clon independiente y comprobar Actors, escenas, Journals, Items, macros, settings, permisos, carpetas, packs/compendios, IDs y rutas de assets.
4. Mantener intactos `hipera-7` y el respaldo de referencia.
5. Ejecutar D3 con actores de prueba en el clon. Descanso y Kawín modifican recursos/flags de Actors; Combate crea o elimina encuentros, Combatants, flags y mensajes.
6. Comparar inventarios antes/después. Ante cualquier alteración no prevista, detener y restaurar el clon.

**Prohibido:** actualizar Foundry en este mundo, instalar LAB.6.18 encima de LAB.6.17, sustituir el Bridge estable, reinstalar CI137 o reconstruir compendios como parte de esta prueba.
 
### 2.4 Aclaración del usuario: comportamiento final esperado — 2026-11-28

El usuario confirma que el comportamiento actual al pulsar **End Combat** en el tracker nativo es correcto: Foundry termina el encuentro y el marcador MELIAZ desaparece. También confirma que, si se completan cuatro rondas y aparece la opción **Terminar combate**, al confirmarla el encuentro debe terminar. No solicita cambiar estos flujos.

**Verificación del código fuente LAB.6.18 recuperado:**

- `round-marker.js` → `advance(s,c)`: cuando todos los Kona activos completan sus acciones en ronda 4, ejecuta `close(s,'Cuarta ronda completada')`. `updateEndAdvice` publica esa razón como `endAdvice`; `render()` muestra el botón **Terminar combate**.
- Ese botón llama `finishNative(c)`: solicita confirmación, reconcilia el marcador, comprueba que no queden Manifestaciones pendientes y termina el encuentro mediante `c.delete()`.
- Si se pulsa **End Combat** nativo, el hook `updateCombat` ejecuta `reconcile(c)`; al detectar `!c.started`, el marcador registra el cierre nativo, limpia las Manifestaciones pendientes y `render()` retira el panel porque el combate ya no está iniciado.
- Por tanto, ambos caminos terminan el combate y hacen desaparecer el marcador. La diferencia técnica es que el botón nativo deja el documento Combat finalizado en Foundry; la acción MELIAZ de cuatro rondas elimina el documento Combat después de comprobar la limpieza. No se cambia esta diferencia sin una decisión de diseño expresa.

**Corrección de interpretación:** la tarjeta persistente observada antes no era un menú sobrante ni un fallo. Era el estado intermedio posterior al cierre del marcador MELIAZ por Dirección, que indicaba cerrar el encuentro nativo en Foundry. Al ejecutar End Combat, el marcador se retira como corresponde.

**Decisión:** retirar la propuesta anterior de cambiar el texto de la tarjeta. No implementar cambios en este flujo. La UX observada coincide con la intención confirmada por el usuario.

**QA:** comportamiento de End Combat nativo observado por el usuario: PASS. Ruta de cuatro rondas y botón Terminar combate: verificada por inspección estática de código; pendiente ejecución real controlada. Ninguna acción fue ejecutada durante esta revisión.


### 2.5 Recuperación de la entrega anterior — cierre al completar cuatro rondas

**Confirmado: esta función ya fue solicitada e incorporada en LAB.6.14. No hay que volver a diseñarla ni implementarla.**

Evidencia recuperada del paquete fuente LAB.6.18:

- `QA_LAB6_14.json`: 18 scripts Node, 124 bloques PASS, sintaxis PASS; registra explícitamente el cambio **“GM combat end advisory, explicit confirmation”** y deja D3 pendiente.
- `module.json`: changelog LAB.6.14: **“aviso GM Terminar combate (cuarta ronda o rivales identificados fuera de combate)”**.
- `patch_618.py`: LAB.6.18 modifica únicamente `bridge.js` y `module.json`; no modifica `round-marker.js`. El módulo LAB.6.17 activo es la base declarada de LAB.6.18, por lo que conserva esta implementación.
- `round-marker.js`: lógica concreta inspeccionada:
  1. `advance(s,c)` cierra el marcador con razón `Cuarta ronda completada` cuando todos los Kona activos ya registraron su acción en la cuarta ronda.
  2. `updateEndAdvice(c,s)` genera el aviso al GM por cuarta ronda completada; también puede generarlo cuando todos los rivales identificados están incapacitados.
  3. `render()` muestra el botón **Terminar combate** al GM.
  4. `finishNative(c)` solicita confirmación, reconcilia el marcador, ejecuta la limpieza de Manifestaciones y, si no quedan pendientes, elimina el documento Combat nativo.

**Semántica:** no es un cierre automático silencioso al completar la cuarta ronda. Al completarla aparece el aviso y el GM debe pulsar **Terminar combate** y confirmar. Esa acción termina el encuentro y retira el marcador. Es exactamente el comportamiento pedido en LAB.6.14.

**Estado de validación:** implementación existente y confirmada por fuente; QA simulado previo PASS. La ruta de cuatro rondas aún necesita D3 real controlado en Foundry para verificar el aviso, la confirmación, la limpieza y la desaparición del marcador. No hacer cambios de código salvo que esa prueba revele un defecto.


### 2.6 Límite de entorno — no ejecutar D3 en hipera-7 ni H6/H7

Se recuperó la guía original `GUIA_D3_LAB_6_12.md`, incluida en el paquete de fuentes. Su instrucción explícita es: **respaldar el mundo experimental y la versión LAB instalada; no tocar H6/H7 ni el Bridge estable 0.24.203; activar LAB sólo en copia experimental**.

Por tanto:
- `hipera-7` queda en **sólo lectura** para este trabajo. El inventario de 97 Actors, 320 Items y cuatro compendios no demuestra que sea desechable ni que tenga respaldo restaurable.
- No se ejecuta D3 en `hipera-7`, H6 ni H7. No se crea un Combat de prueba, no se marcan rondas, no se ejecuta Kawín/Descanso y no se pulsa ningún cierre ahí.
- La mención de `hipera-6` en el checkpoint de Códigos v45 corresponde al diagnóstico de iconografía de Códigos y no autoriza usar ese mundo para D3/LVDM.
- En el historial se había aceptado la creación de un mundo nuevo `Hiperaustralis — LAB V14` (ID propuesto entonces: `hiperaustralis-lab-v14`), pero su existencia y estado actual no están confirmados. Se puede localizar en Setup como candidato; no asumir que existe ni que está vacío.
- El único destino válido para la prueba de cuatro rondas es un mundo experimental separado, identificado por su ID y con respaldo verificable. Si no existe, primero debe crearse/restaurarse una copia desechable; no duplicar ni migrar H6/H7 sin preservar íntegramente los originales.

**Próximo paso operativo:** localizar en Setup si existe `Hiperaustralis — LAB V14` / `hiperaustralis-lab-v14`. Si existe, abrirlo sólo para inventario de lectura (ID, Foundry, CSB, Bridge LAB, cantidades de documentos y lista de compendios). Si no existe, preparar un mundo experimental independiente. No realizar acciones de fase hasta confirmar ese destino y su respaldo.


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
