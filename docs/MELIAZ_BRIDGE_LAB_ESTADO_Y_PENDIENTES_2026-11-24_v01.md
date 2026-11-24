# CORE / MELIAZ Bridge — Estado, pendientes y laboratorio aislado

**Corte:** 24-11-2026 · **Objeto:** Bridge 0.24.203 original estable + módulo alternativo `meliaz-bridge-lab` 0.24.204-lab.0.  
**Fuente principal inspeccionada directamente:** `module/meliaz-bridge/bridge.js`, `module/meliaz-bridge/kona-token-icons.js`, `module/meliaz-bridge/module.json`, `module/meliaz-bridge/QA_RUNTIME_0.24.203_FORGE.md` y `docs/BRIDGE_KONA_STABILITY_DIAGNOSIS_0.24.198.md` de rama `work/meliaz-bridge-0.24.203-clean`, HEAD `1a7c66d50c9d52db33e109804142f12779c6c9d9`. La auditoría del contrato territorial / Recetas deriva además del manifiesto CI137 QA5/QA6 y del checkpoint FFF.

## 1. Base preservada y copia de laboratorio

| Campo | Original | Laboratorio |
|---|---|---|
| ID Foundry | `meliaz-bridge` | `meliaz-bridge-lab` |
| Versión | `0.24.203` | `0.24.204-lab.0` |
| Rama | `work/meliaz-bridge-0.24.203-clean` | `work/meliaz-bridge-lab-0.24.204-20261124` |
| Bridge JS / tokens | Original intacto | Renombrado sólo en una copia `dist`, sin alterar fuente |
| Recursos gráficos | 40 WebP Kona + hoja + placa | Idénticos byte a byte |
| Coactivación de módulos | Sin guardia LAB | LAB se bloquea sin registrar hooks si `meliaz-bridge` está activo |
| Efecto en Forge/H6/H7 | En uso; prohibido reemplazar | NINGUNO. No instalado ni activado |
| QA | A–F en documento, aún no registrado como PASS global | GitHub CI D2 PASS, prueba real D3 PENDIENTE |

**ZIP de referencia original verificado físicamente:** artefacto GitHub Actions `43990574532` (`meliaz-bridge-0.24.203-foundry`), ZIP instalable `meliaz-bridge-0.24.203.zip`, **5.001.596 bytes**, SHA-256 `57748ab63d90675311b92dec258d0d5ab232477eefd394edf0757d51df457ea5`, **63 archivos + 2 entradas directorio**, CRC PASS. El CHANGELOG anterior decía «168 entradas», pero **no describe el ZIP instalable de esta ejecución**. Inventario comprobado: 40 WebP PJ-001..040, fondo de hoja Kona, placa, 2 scripts, manifiesto y documentación. No hay pérdida de imágenes en esta referencia. Entre la rama limpia y el ZIP de referencia hay una diferencia documental en `QA_RUNTIME_0.24.203_FORGE.md` además de las tres modificaciones LAB deliberadas; no son discrepancias de ejecutables/assets.

**LAB D2:** [Actions #45480935743](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45480935743) PASS. El builder `tools/foundry/meliaz_bridge_lab_build.py` verifica exactamente 63 ficheros, 40 tokens, modifica sólo `module.json` y los dos JS copiados, comprueba sintaxis y abre el ZIP final. Prefijo de assets / socketlib / flags pasan al namespace LAB. `relationships.conflicts` identifica el módulo original y ambos JS verifican `game.modules.get("meliaz-bridge")?.active` antes de registrar hooks. **La guardia sirve de defensa adicional; no reemplaza el requisito de desactivar el original en el clon y verificar D3.**

**ZIP LAB:** `meliaz-bridge-lab-0.24.204-lab.0-NO_H6_H7.zip`, **5.004.440 bytes**, SHA256 `6e6001d3b99fd4621e366838af592dd86acc7cc1cbfb9ecabb8cd4fe042da9c8`. Archivo externo del artefacto: `MELIAZ_BRIDGE_LAB_024204_D2_AISLADO_20261124.zip`.

### Verificación forense independiente del artefacto original vs LAB

Desde el runtime local se extrajeron **ambos ZIP instalables exactos** del archivo GitHub Actions. Al eliminar *sólo* el guardia LAB y revertir `meliaz-bridge-lab` → `meliaz-bridge` en las dos cadenas JavaScript nuevas, **`bridge.js` y `kona-token-icons.js` resultan byte a byte idénticos** a los respectivos JS del ZIP original 0.24.203. La hoja WebP y la placa PNG son también **idénticas byte a byte**. El resto de activos permanece intacto. La única diferencia incidental entre la fuente GitHub limpia y el ZIP original es el fichero **documental** `QA_RUNTIME_0.24.203_FORGE.md`, sin repercusión en código de ejecución.

Los ZIP instalables directos se extrajeron y verificaron:
- Original estable: `MELIAZ_BRIDGE_0.24.203_RESPALDO_VERIFICADO.zip`, 5.001.596 B, SHA `57748ab63d90675311b92dec258d0d5ab232477eefd394edf0757d51df457ea5`.
- Laboratorio: `MELIAZ_BRIDGE_LAB_0.24.204_NO_H6_H7.zip`, 5.004.440 B, SHA `6e6001d3b99fd4621e366838af592dd86acc7cc1cbfb9ecabb8cd4fe042da9c8`.

Esto **prueba conservación binaria del original** y transformaciones delimitadas del LAB; **no prueba todavía arranque ni funcionalidad** en Foundry/Forge D3. Los archivos de respaldo se entregan desde la conversación, sin modificar ninguna instalación.

## 2. Funciones existentes y límites de prueba

| Área | Comportamiento en el JS fuente 0.24.203 | Estado |
|---|---|---|
| Rituales y Reliquias | DnD Temple con slots y plantillas de Item | Código presente, D3 específico pendiente |
| Instrumentos | `inferHiperaItemKind=instrumento`, `attachHiperaInstrumentoToSentir`, copia Item incrustada y slots | Código presente, D3 de 21 Items pendiente |
| Equipo | DnD a cuatro espacios; wrappers legados `equipo_1…7` ocultos; DOM reutilizado por reconciliación `renderKonaItemGrid` desde 0.24.198 | Código presente, integridad/visual D3 pendiente |
| Armas / Defensas | Recepción en Ñeque; Defensa a Armadura condicionada a Oficio | Código presente, regresión con fichas nuevas pendiente |
| Flora/Fauna/Funga | Clasifica y acepta Items en Territorio; grilla física tiene cuatro espacios | Código presente, no confundir con cupo **FFF 4×4×4 por territorio** |
| Recetas | No existe `receta` en `inferHiperaItemKind`, picker, lista de naturaleza, caja de Territorio o DnD | **NO IMPLEMENTADO** |
| Nueve territorios CORE | `KONA_TERRITORY_BIOMAS` contiene **ocho bandas viejas** (Titicaca/Paititi incluidos; faltan tres ajustes de CORE), categorías `Flora/Fauna/Funga`, sin Recetas | **ESTRUCTURA OBSOLETA** |
| Exaltar, Manifestar, Azar | Código/hotspots/SocketLib presentes, opción `Exaltar Azar` declarada | Regresión mecánica y orden de tarjeta pendientes; no declarar fallo sin prueba |
| Token Kona | Banco PJ-001–040, cambio token, candado y sincronización | Código presente, QA permisos/persistencia pendiente |
| Persistencia / bootstrap | `ready` normaliza Rituales/Reliquias existentes y actores; al abrir Kona como GM `ensureKonaTerritoryPackReady()` puede crear/ordenar `world.territorio` | **RIESGO DE ESCRITURAS: sólo clonar mundo y Actor para QA LAB** |

**Compatibilidad de entorno:** QA original fue redactado para CSB 6.0.2; H7 está en CSB 6.1.2 / Foundry 14.370. Confirmar D3 específico, sin extrapolar cumplimiento por la versión mínima `6.0.0` del manifiesto original.

## 3. Pendientes priorizados y puertas de cierre

**P0 — Seguridad del laboratorio (D3 preliminar)**
- Verificar instalación **sin reemplazar ID** del original: paquete LAB diferente, iconos y hoja visibles, SocketLib en LAB, consola sin colisiones.
- Crear **copia del mundo** y duplicado de Actor Kona. **Nunca activar LAB en H6/H7**. Desactivar `meliaz-bridge` sólo en el clon y activar allí `meliaz-bridge-lab`. Confirmar que ambos no actúan simultáneamente.
- Registrar snapshot de `system.props`, `flags`, Items y campos Equipo antes de arrancar: la preparación del Bridge puede escribir datos. Volver a comparar después de abrir y refrescar.

**P1 — Nuevos territorios CORE y Recetas**
- Separar **9 territorios CORE** de las 8 bandas histórico-ecológicas; no renombrar o crear automáticamente las carpetas `world.territorio` del legado ni romper sus Journals. Plan de reconciliación y migración sin pérdida antes del cambio en LAB.
- Mantener el objetivo FFF **4 Flora + 4 Fauna + 4 Funga** por territorio; es una cuota **editorial de 108 asignaciones**, no un cambio de los cuatro espacios actuales en Kona.
- Recetas: documentos `Item` de `ha-proto-items`, subcarpeta de **cada** territorio, **fuera de FFF**, drag-and-drop a Kona. Recuperar primero al menos una ficha/plantilla aprobada y el destino receptor exacto; después añadir tipo/recognizer, picker, drop, visualización, deduplicación, persistencia y regresión. No inventar una quinta casilla sin aprobación.

**P2 — Compendios y objetos existentes**
- Equipo común transversal frente a Equipo cultural adscrito (40 Items históricos, 29 cruces gráficos no nuevos Items). Corroborar nuevas carpetas sin alterar el `kind=equipo` ni los 4 espacios; preservar `equipo_1..7` y `equipoSlot` originales.
- Instrumentos: 21 Items históricos; 6 remapeos QA5, 4 segundos ERH aprobados en QA6 aislada D2 (Arpa de boca, Campana, Cuerno, Flauta), 11 candidatos sin aprobación visual. D3 de hoja, arrastre en Sentir y persistencia.
- Reliquias: 8 cotidianas + 8 legendarias + Tokicura separada; D3 drag/drop y persistencia, sin duplicar IDs.
- Defensas nuevas: destino de armadura condicionado por Oficio; cotejo de nuevas fichas de catálogo DEF/COM contra ocho históricas y los 4 espacios de Equipo; evitar duplicaciones.

**P3 — Regresión íntegra**
- Exaltar (Capacidad y Azar, tarjeta tras dado), Manifestar y Descendiente, Newen/Peso/Aguante, orden/costo, trayectos SocketLib y lectura de acciones en chats.
- Estabilidad visual sin parpadeos ni doble hook, cierres/reaperturas, ventanas CSB/Foundry, geometría de Cariños/Lenguas, slots 1–4 y persistencia tras dos reinicios.
- QA F14.370 + CSB6.1.2 en clon; ejecución de pruebas A–F `QA_RUNTIME_0.24.203_FORGE.md` que quedaron pendientes.
- Relación Asset/ID de 95 referencias gráficas heredadas aún sin resolver en candidato CI137 QA6; es **pendiente de compendio**, no modificación interna del Bridge.

## 4. Plan de promoción y límites

1. **BASE CERRADA:** conservar `work/meliaz-bridge-0.24.203-clean` sin cambios y ZIP SHA anotado.
2. **LAB v0:** duplicado con ID `meliaz-bridge-lab`, sólo guardas y traslado del namespace. **No reescribe reglas**, no instala sobre Forge.
3. **LAB v1:** resolver primero territorio/recetas con fuentes y QA específica, en commits pequeños que puedan revertirse.
4. **D3:** pruebas en copia de mundo y Actor; guardia de doble módulo, comparación de flags/propiedades/Items antes y después.
5. **PROMOCIÓN A BRIDGE ORIGINAL:** sólo luego de validación y aprobación explícita; preparar versión `meliaz-bridge` con control de rollback y no reusar ID LAB como versión final.

**Decisiones:** sí a un segundo Bridge LAB aislado; preservar código estable y source assets; no confundir compilación D2 con compatibilidad de datos reales.  
**Pendientes:** P0–P3 enumerados arriba.  
**Fuentes:** código exacto 0.24.203, paquete original descargado y verificado, QA A–F, fuente CI137 y aprobaciones de usuario.  
**Cambios Estado Maestro:** ninguno. `main`, Bridge estable, Forge, H6, H7, CI137 QA5/QA6 permanecen sin modificaciones por el LAB.
