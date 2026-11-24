# CI137 — Auditoría de Instrumentos, Reliquias y Recetas drag-and-drop

**Corte:** 24-11-2026 · **Rama:** `work/ci137-expansion-familias-20261124` · **Estado:** fuentes recuperadas / contrato de integración corregido / runtime sin cambios.

## 1. Respuesta documentada: ¿estaban actualizados Instrumentos y Reliquias?

**Sí como presencia en la compilación QA5; NO como actualización integral de imágenes y QA funcional.** El manifiesto de selección `manifests/ci137-selected-source-137-historical-ids.json` contiene **136** Items: **21** de `Instrumentos musicales`, **8** `Reliquias legendarias`, **8** `Reliquias cotidianas` y **1** Reliquia separada, `Tokicura`. No sumar 21 + 16 al total 136: ya están incluidos.

Se verificó directamente el ZIP instalado/recomendado `HIPERAUSTRALIS_CI137_V14_370_QA5_IDS_CORREGIDOS_FORGE.zip`:
- `module.json`: `hiperaustralis-compendios-prototype` `0.1.7-ci137qa.5`, packs Item/Actor/Journal.
- Arte de Instrumentos integrado: **6 WebP** en `assets/instrumentos/` (`Kultrung`, `Pifüllka`, `Waza`, `Piloilo`, `Kaskawilla`, `Pututu`). Seis remapeos ERH de transporte aprobados y comprobados en D2, no 21/21.
- Arte de Reliquias integrado: **8 WebP cotidianas + 8 legendarias**, más **1 Tokicura independiente**; las 16 fuentes históricas y sus carpetas en el compendio se mantienen separadas. Tokicura no integra el grupo de dieciséis.
- Catálogo actualizado de Instrumentos ERH v04 es la autoridad descriptiva; seis remapeos ERH no autorizan a sustituir las otras quince imágenes por semejanza ni a activar Arpa de boca pendiente técnico.
- Hay tres packs y nueve carpetas QA5 verificadas por capturas/usuario; **no consta prueba individual de drag-and-drop** de Instrumentos ni Reliquias a la hoja Kona, ni comprobación visual de los 21/16.

Fuentes primarias: `docs/AUDITORIA_INSTRUMENTOS_ERH_2026-11-13.md`, `manifests/instrumentos-erh-assets.json`, `docs/RECUPERACION_RELIQUIAS_16_ITEMS_2026-11-14.md`, `docs/CHECKPOINT_RELIQUIAS_ASSETS_PIPELINE_2026-11-14.md`, `manifests/reliquias-assets.json`, ZIP real QA5.

## 2. Recetas — contrato autoral nuevo

**Confirmación explícita del 24-11-2026:** `Recetas/` está dentro de **cada Territorio CORE**, como carpeta hermana de `Flora/`, `Fauna/` y `Funga/`; cada Receta utilizable en juego **debe ser un documento Foundry Item arrastrable (drag-and-drop) hacia una hoja Kona** a través del flujo existente de CSB 6.1.2 + MELIAZ Bridge 0.24.203. No tratarla como sólo texto de JournalEntry, imagen ni referencia narrativa.

- **FFF 4×4×4:** mantiene cuatro asignaciones por Flora/Fauna/Funga; **Recetas no cuenta** en 12 posiciones FFF por Territorio. Sus altas se rigen por fuentes aprobadas, no por una nueva cuota numérica.
- **Identidad:** una receta recibe un único documento Item y un `_id` Foundry V14 válido de 16 caracteres, una ficha CSB compatible, contexto/territorio de procedencia y, cuando aplique, referencia canónica entre territorios. No copiar el mismo Item por cada aparición territorial.
- **Comportamiento exigible:** abrir el Item Receta desde `ha-proto-items`, arrastrar y soltar sobre Kona, verificar que figure en la sección autorizada por la hoja, que conserve campos y procedencia, recargar personaje y mundo, confirmar persistencia y ausencia de errores consola/Bridge. **No crear casilla o subsistema nuevo por inferencia**: el destino exacto y eventuales adaptaciones al Bridge se definen por la implementación aprobada y una prueba real.
- **Disponibilidad:** ni el árbol de fuentes CI137 actual ni los ZIP reales 0.4.75 y QA5 presentan archivos de Recetas con identidad/payload confirmado; **cero Recetas incorporadas hasta ahora**. La estructura sí es obligatoria en la futura ampliación; no generar nueve carpetas con Items inventados.
- **Estado D3:** ausencia de prueba de recepción/persistencia en cliente, **PENDIENTE**.

## 3. Salvaguardas y matriz de QA

| Familia | Recuperación verificada | QA pendiente |
|---|---|---|
| Instrumentos | 21 Items históricos; seis remapeos gráficos ERH validados por CI | Revisar los 15 restantes y arrastre a Kona |
| Reliquias | 8 cotidianas + 8 legendarias y arte propio; Tokicura separado | Revisar hoja y arrastre/persistencia, rutas de referencia de assets |
| Recetas | Nueve destinos territoriales definidos como carpetas de Item, fuera de cuota FFF | Recuperar fichas aprobadas, IDs, plantilla y probar arrastre/reapertura |

**Decisiones:** no alterar la instalación QA5; conservar los tres packs existentes y el ID del módulo; Recetas son Items de inventario/documentos drag-and-drop; Instrumentos y Reliquias no se duplican por sus lotes visuales. **Pendientes:** aprobación de payload de Recetas, prueba funcional de arrastre de las tres familias, cotejo visual restante de instrumentos, cierre de 99 rutas heredadas. **Fuentes:** ZIPs, manifiestos/checkpoints citados y orden autoral de 24-11-2026. **Cambios al Estado Maestro, main, Forge, H6/H7 y Bridge:** ninguno.
