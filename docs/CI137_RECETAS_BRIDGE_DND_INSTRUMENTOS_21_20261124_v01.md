# CI137 — Recetas drag-and-drop y clasificación real de Instrumentos ERH

**Fecha:** 24-11-2026 · **Rama:** `work/ci137-expansion-familias-20261124`  
**Resultado:** fuentes y Bridge cotejados; contrato editorial conservado; **Recetas DnD NO IMPLEMENTADAS** en Bridge 0.24.203; **ningún mundo ni módulo modificado**.

## 1. Evidencia del Bridge real 0.24.203

Se hizo checkout de la rama exacta `work/meliaz-bridge-0.24.203-clean`, archivo `module/meliaz-bridge/bridge.js` (~437 KB), en una acción aislada que **sólo lee y valida**. No se dedujo la función desde la apariencia de carpetas.

- `inferHiperaItemKind(item)`: clasifica `ritual`, `reliquia`, `arma`, `equipo`, `instrumento`, `defensa`, `armadura`, `flora`, `fauna`, `funga` y `bioma`, **no `receta`**. El Item debe ser de tipo CSB `equippableItem`.
- `KONA_COMPENDIUM_TARGETS.territorio.kinds`: **`flora`, `fauna`, `funga`, `bioma`**. Tampoco incluye `receta`.
- `hiperaNaturalezaItems(actor)` y `installHiperaBiomas(canvas,actor)`: cuentan/presentan Flora/Fauna/Funga/Bioma en la zona Territorio, omiten Receta. La caja de Territorio tiene **cuatro espacios de Kona**; no confundirlos con los 12 cupos 4×4×4 de selección editorial por Territorio.
- `installHiperaItemDrop`: acepta Instrumentos en **Sentir/Música**, Reliquias y Rituales en **Temple**, Flora/Fauna/Funga/Bioma en **Territorio**, Armas/Defensas en **Ñeque** y Equipo en sus cuatro espacios. Una Receta no reconocida no llega a esa lógica.
- El picker `Territorio` de JournalEntry/Biomas utiliza referencias `world.territorio` cuando son JournalEntry; ese recorrido **no convierte una Receta en Item arrastrable**.

**Dictamen:** crear carpetas `Territorio/<CORE>/Recetas/` en `ha-proto-items` es necesario pero insuficiente. **Sin Item fuente y un recorrido de Bridge específico, el drag-and-drop de Recetas no existe**. El destino exacto de Recetas en la hoja Kona no está acreditado por decisión anterior. Se necesitará determinar si reutiliza un espacio de Territorio o tiene otro destino **sin alterar geometría/casillas** por inferencia.

**Puertas para implementar** (en rama Bridge aislada y sólo después de una Receta aprobada de prueba): ID de 16 caracteres, Item CSB compatible, `hipera_tipo` específico validado, reconocimiento y picker, zona de drop acordada, visualización/remoción, cotejo de duplicados, preservación de procedencia y persistencia tras volver a abrir Actor/mundo. No reintroducir nombres BRP/Hybrid, no modificar Cariños/Lenguas ni las cuatro casillas Equipo.

## 2. Instrumentos musicales — conciliación de los 21 IDs

Fuente exacta: `manifests/ci137-selected-source-137-historical-ids.json` (21 JSON en `source-pending/ci137-historicos-99/instrumentos-musicales`). Cada ID tiene plantilla `HipInstrTpl00001`; QA5 contiene 21 Items y **6 WebP remapeados en CI137**. El resto mantiene ruta gráfica heredada. La clasificación no equivale a aprobar imágenes nuevas:

| Estatuto | Instrumentos | Resultado |
|---|---|---|
| **6 remapeos ERH aprobados** | Kaskawilla, Kultrung, Pifüllka, Piloilo, Pututu, Waza | ID/semilla y arte aprobados en fuente; transferencia ya representada en QA5 |
| **11 candidatos nominales 1:1** | Antara Lickanantay, Antara Tiwanaku, Flauta traversa de Coyo, Kakel-kultrung, Lira nórdica, Siku, Sonaja Aymara, Sonajero de hierro, Sonajero Lickanantay, Trompeta monóxila, Wankara | Hay WebP de staging y asociación por nombre/cultura, pero **no aprobación editorial de reemplazo** |
| **4 ambiguos** | Arpa de boca, Campana Lickanantay, Cuerno musical nórdico, Flauta de hueso | No sustituir: Arpa de boca pendiente técnico; las otras tres sin identidad visual exacta acreditada |

Los 15 no aprobados son **11 correspondencias candidatas + 4 ambiguas**, no 15 imágenes perdidas ni 15 nuevas fichas.

Matriz íntegra con 21 IDs, nombres, ruta de fuente, WebP candidato y dictamen:  
`manifests/ci137-instrumentos-recetas-dnd-qa-20261124-v01.json`.

## 3. Reliquias y Tokicura

`manifests/ci137-selected-source-137-historical-ids.json` / ZIP QA5 acreditan:
- **8 Reliquias Cotidianas** + **8 Legendarias**, 16 Items históricos y 16 WebP.
- **Tokicura** es un Item adicional e independiente, con alias técnico válido V14 `TokicuraRel00010` y procedencia del ID histórico `TokicuraRel0001`. Está ordenado en subcarpeta Legendarias por navegación, pero **no integra el lote de 16 Reliquias históricas**. Un WebP separado.
- El Bridge posee DnD de Reliquias en Temple y un flujo de creación de copia Item en el Actor; **no se ha ejecutado prueba en cliente D3 de arrastre y reapertura** para las 16.

## 4. Recetas — búsqueda y límites de la recuperación

Se inspeccionaron árbol CI137 vigente, el módulo QA5 físico, la fuente 0.4.75, el export Foundry 19-11 y búsquedas en archivos de Biblioteca/Notion/Drive; **ninguna ficha Item de Recetas, con ID, plantilla y payload recuperable, apareció en esas fuentes inspeccionadas**. No se afirma inexistencia en fuentes no accesibles ni se redacta una receta sustitutiva.

**Contrato autoral conservado:** `Territorio/<uno de 9 CORE>/Recetas`, cuarta carpeta al mismo nivel que Flora/Fauna/Funga, **fuera** del cupo FFF (4+4+4 por Territorio), y fichas **Item drag-and-drop** a Kona, no Journals de adorno. Si la receta pertenece a varios territorios, sólo una identidad Item canónica y referencias por el resto.

**Bloqueos actuales:** sin fuente de receta aprobada, sin tipo `receta` reconocido por Bridge, sin destino exacto en Kona documentado y sin prueba de arrastre. **No crear otro ZIP ni migración automática** hasta resolverlos.

## 5. Pruebas ejecutadas

- [GitHub Actions #45471624420](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45471624420): **PASS de auditoría fuente, no PASS de Recetas**. Hizo checkout de dos ramas independientes, pasó `node --check` a Bridge, validó 21 IDs e instrumentos 6/11/4, 16+Tokicura y comprobó estáticamente los cinco puntos de ausencia de soporte Recetas. Artefacto: `CI137-BRIDGE-RECETAS-READONLY-AUDIT` / reporte JSON `CI137_BRIDGE_RECETAS_DND_READONLY_REPORT.json`. Estado principal esperado: **`D2_SOURCE_AUDIT_PASS__RECIPE_DND_BLOCKED`**.
- [GitHub Actions #45471751251](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45471751251): **PASS de guard de la ampliación**; el manifiesto CI137 se ha corregido para bloquear la declaración de DnD mientras Bridge carezca de reconocimiento. Cero cambios runtime.

## 6. Cierre

**Decisiones:** conservar 21 Instrumentos históricos y sus 6 remapeos aprobados; mantener 11 candidatos y 4 ambiguos fuera de promoción; 16 Reliquias + Tokicura aislada; Recetas por Territorio como Items arrastrables, sin asignar slot aún.

**Pendientes:** recuperar **una** ficha Receta aprobada y su plantilla/ID; decidir el receptor exacto de Recetas sobre la hoja Kona, si el canon lo define en fuente que aún no se localiza; preparar y probar parche de Bridge en rama separada; D3 de Instrumentos y Reliquias; 99 referencias gráficas heredadas.

**Fuentes:** Bridge 0.24.203 limpio, manifiesto CI137 136 IDs, ZIP QA5, ERH auditoría 13-11, Reliquias checkpoint 14-11, catálogo de ampliación, Actions #45471624420. **Cambios al Estado Maestro, `main`, Bridge ejecutable, Forge, H6/H7:** ninguno.
