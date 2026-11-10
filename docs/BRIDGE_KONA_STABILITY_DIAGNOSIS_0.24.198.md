# Diagnóstico técnico — Kona / MELIAZ Bridge 0.24.197

Fecha: 2026-11-10  
Base inspeccionada: `MELIAZ_BRIDGE_0.24.197_STANDARD_V14.zip`  
SHA-256 del ZIP: pendiente de registrar en esta rama; el archivo de referencia permanece intacto.  
Estado: diagnóstico estático; sin modificación del Bridge productivo ni prueba runtime.

## 1. Hallazgos confirmados en código

### 1.1 Reconstrucción completa de grids

`renderKonaItemGrid()` ejecuta `grid.replaceChildren()` en cada render. Después vuelve a crear todas las celdas, iconos y controles de incorporación. La misma estrategia aparece en `installHiperaEquipoSlotIcons()`.

Esto es un mecanismo técnicamente compatible con el parpadeo observado cuando se agrega un Item: el DOM visible se vacía y reconstruye incluso si sólo cambió un elemento. Es una causa candidata fuerte, no una causa runtime demostrada.

### 1.2 Mezcla de categorías en los cuatro slots de Equipo

`installHiperaEquipoSlotIcons()` filtra y representa conjuntamente los tipos `arma`, `equipo` y `defensa`, usando el mismo campo `flags.<MODULE_ID>.equipoSlot` (slots 1–4).

Por tanto, la ocupación cruzada no es un efecto incidental de CSS: está expresamente implementada en la lógica del Bridge.

### 1.3 El drop permite rutas alternativas hacia Equipo

En `installHiperaItemDrop()`:
- Arma: se asigna al slot dedicado de Ñeque si el drop cae allí; en caso contrario, puede enviarse a Equipo.
- Defensa: se asigna como armadura si cae en el área de armadura y el Oficio lo permite; en caso contrario, puede enviarse a Equipo.
- Equipo común: se envía a Equipo.

Esto explica por qué Armas y Defensas pueden terminar compartiendo los espacios de Equipo. No cambiar esta regla hasta cotejar el canon vigente de destinos y excepciones.

### 1.4 Normalización con escrituras persistentes al montar

`installHiperaEquipoSlotIcons()` dispara `normalizeHiperaEquipoSlots(actor)` en el primer montaje. La normalización puede:
- asignar `flags.<MODULE_ID>.equipoSlot` a Items sin slot;
- actualizar `system.props.equipo_1..4` del Actor cuando encuentra correspondencias.

La función declara una migración aditiva, pero sigue siendo una escritura persistente. La corrección visual no debe introducir ni repetir normalizaciones no autorizadas. Antes de cambiarla, revisar datos reales y conservar flags/slots existentes.

## 2. Hipótesis sobre el parpadeo

1. Principal candidata: `replaceChildren()` en los grids que se vuelven a renderizar después de cambios de Items.
2. Candidata secundaria: montaje diferido mediante dos `requestAnimationFrame` y `MutationObserver`, que vuelve a intentar instalar controles cuando detecta un montaje incompleto.
3. Pendiente: determinar qué hooks/eventos concretos provocan renders repetidos tras `createEmbeddedDocuments`, `updateEmbeddedDocuments` y `deleteEmbeddedDocuments`.

No se afirma que el observer sea la causa. Requiere reproducción en Foundry.

## 3. Restricciones de compatibilidad

- No rediseñar ni mover la hoja Kona.
- No alterar geometría, hitboxes, IDs, flags persistentes ni campos CSB aprobados.
- No tocar Cariños ni Lenguas; preservar sus posiciones e interacción drag-and-drop.
- No alterar Instrumentos, Territorio, Rituales ni Reliquias como efecto colateral.
- No eliminar ni reescribir Items existentes.
- No equiparar automáticamente `defensa` con `armadura`: el código los trata como conceptos relacionados, pero no idénticos.
- No modificar el Bridge productivo ni la rama de compendios.

## 4. Plan de corrección experimental

### A. Estabilidad DOM
- Sustituir la reconstrucción total por reconciliación incremental de celdas.
- Reutilizar nodos cuando coincidan slot e ID de Item.
- Actualizar sólo imagen, tooltip, atributos y estado que hayan cambiado.
- Mantener intactos los nodos sin cambios y todos los receptores/hitboxes.
- Aplicar la misma estrategia al grid de Equipo, sin alterar sus cuatro posiciones.

### B. Separación de destinos
- Definir y probar la matriz canónica de destinos antes de modificar el drop:
  - `arma` → destino dedicado de Ñeque o excepción expresamente autorizada.
  - `defensa` → destino de protección/armadura o excepción expresamente autorizada.
  - `equipo` → cuatro espacios de Equipo.
- No inferir que armas/defensas nunca pueden ir a Equipo hasta verificar el canon y sus excepciones.
- Evitar que categorías distintas compitan por el mismo `equipoSlot` si el canon las separa.

### C. Normalización
- Separar el render visual de cualquier migración/escritura persistente.
- No reasignar slots ya existentes.
- No completar campos CSB desde el montaje salvo migración explícita, idempotente y validada.
- Preparar respaldo y pruebas de no pérdida antes de habilitar escrituras.

## 5. Matriz mínima de regresión

- Agregar, abrir, retirar y reemplazar Item de Equipo.
- Agregar Arma y verificar que no invada Equipo salvo excepción canónica.
- Agregar Defensa y verificar destino según Oficio y regla canónica.
- Probar Instrumentos, Rituales, Reliquias y Territorio para detectar regresiones.
- Reabrir ficha y comprobar persistencia de IDs, flags y orden.
- Confirmar estabilidad visual sin parpadeo.
- Confirmar que Cariños/Lenguas no cambian de posición ni pierden drag-and-drop.
- Confirmar que no se producen escrituras inesperadas al abrir la hoja.

## 6. Estado de ejecución

- [x] ZIP 0.24.197 íntegro e inspeccionado.
- [x] Rama experimental aislada creada: `work/bridge-kona-stability-0.24.198`.
- [x] Diagnóstico estático de render, slots y rutas de drop.
- [ ] Recuperar regla canónica vigente de destinos y excepciones.
- [ ] Implementar patch incremental en la rama experimental.
- [ ] Pruebas automatizadas/estáticas del patch.
- [ ] Prueba runtime Foundry V14 + CSB 6.x.
- [ ] Entrega ZIP experimental y rollback documentado.

**No es una versión para instalar en producción.**
