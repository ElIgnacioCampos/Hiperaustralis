# CI137 — Ampliación de familias y catálogo territorial · checkpoint de trabajo
**Fecha:** 24-11-2026 · **Rama aislada:** `work/ci137-expansion-familias-20261124`
**Base intacta:** QA5 `0.1.7-ci137qa.5`, módulo `hiperaustralis-compendios-prototype`, Foundry 14.370 / CSB 6.1.2.

## 1. Estado real de la base

- Usuario informó que **los tres compendios reaparecieron tras reiniciar H7 con QA5 activo**. Arranque y persistencia: PASS de informe. Las nueve carpetas del pack Objetos y la apertura inicial de los tres packs ya tienen evidencias visuales.
- Conteo runtime de Items 136/136, contenido de las 21 páginas y 99 rutas heredadas: controles pendientes. **No editar QA5 estable ni reemplazar el módulo a nivel de Forge** durante esta ampliación.
- **No crear otro módulo ni otros identificadores de pack**; extender contenidos del módulo ya registrado: `ha-proto-items`, `ha-proto-actors`, `ha-proto-journals`.
- Este checkpoint amplía el **alcance técnico** anterior (17-11) que excluía Territorios. La nueva solicitud autoral del 24-11 autoriza **preparar** la inclusión territorial, no a promocionar candidatos de imágenes o inventar fichas.

## 1 quáter. Diagnóstico ejecutado: soporte Recetas ausente en Bridge (24-11-2026)

**Codecheck real** sobre rama `work/meliaz-bridge-0.24.203-clean`:
- El Bridge sí procesa `instrumento` → Sentir/Música, `reliquia` → Temple, `flora/fauna/funga/bioma` → Territorio.
- La función `inferHiperaItemKind`, el selector `KONA_COMPENDIUM_TARGETS.territorio`, el colector `hiperaNaturalezaItems` y el render/handler `installHiperaBiomas` no incluyen `receta`. Una carpeta o etiqueta de Item no repara el recorrido DnD por sí sola.
- **No consta en la fuente** el destino receptor exacto para Recetas en la hoja Kona; no inventarlo, no insertar una quinta casilla en Territorio, no alterar las existentes.
- La propia referencia interna del Bridge enumera ocho bandas `KONA_TERRITORY_BIOMAS` del diseño histórico; el módulo territorial de CI137 actual contempla nueve Territorios CORE. **Auditar correspondencia** antes de refactorizar el picker de Journal Territorio; no deducir que ambos son la misma entidad.
- CI137 no dispone todavía de un Item Receta fuente validado, con ID y plantilla CSB. Se mantiene bloqueada su compilación runtime.

**Instrumentos:** 21 históricos = 6 remapeos ERH aprobados, 11 candidatos por nombre y 4 casos ambiguos, según matriz `manifests/ci137-instrumentos-recetas-dnd-qa-20261124-v01.json`. **Reliquias:** 16 históricas + Tokicura independiente, DnD de Bridge presente pero D3 individual pendiente. [Acta completa](CI137_RECETAS_BRIDGE_DND_INSTRUMENTOS_21_20261124_v01.md); [CI #45471624420](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45471624420) **PASS** de análisis, pero reporta Recetas como **BLOQUEADAS**, no funcionales. Ninguna instalación.

## 1 ter. Instrumentos, Reliquias y Recetas drag-and-drop (24-11-2026)

**Inventario real de QA5:** dentro de los 136 Items: **21 Instrumentos musicales, 8 Reliquias cotidianas, 8 legendarias y Tokicura independiente**. Los 6 remapeos ERH aprobados no representan actualización completa de 21/21 iconos de Instrumentos; los 16 WebP de Reliquias y la imagen de Tokicura sí están incluidos en el paquete. El drag-and-drop de esos Items a Kona no se ha probado específicamente.

**Recetas:** cuarto grupo por Territorio, `Territorio/<CORE>/Recetas/`, **fuera de FFF**, y cada receta aprobada debe ser un Item real de `ha-proto-items` que se pueda arrastrar a la hoja Kona con CSB 6.1.2/MELIAZ Bridge 0.24.203, conservando campos y persistencia. Sin fuentes exactas de Items Receta recuperadas en el ZIP 0.4.75 ni QA5, **no hay Recetas instaladas** y no se rellena con placeholders. Antes de incluir: recuperar contenido aprobado, plantilla CSB compatible, UUID/ID válido, destino de drop ya autorizado, probar en cliente y verificar reinicio sin alteración. Referencia: [acta puntual](CI137_INSTRUMENTOS_RELIQUIAS_RECETAS_DND_20261124_v01.md), [Actions #45470344571](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45470344571) **PASS de guard estático**, NO prueba D3.

## 1 bis. Fe de erratas — FFF 4×4×4 y Equipo (24-11-2026)

**Corrección solicitada por el autor:** el primer manifiesto de expansión sólo preveía 9×4 referencias de Fauna: **era incompleto**. El diseño vigente por Territorio CORE sigue la matriz **4 Flora + 4 Fauna + 4 Funga = 12 posiciones de curaduría**. Hay **9 territorios CORE**, por lo tanto **36/36/36 = 108 asignaciones objetivo**, NO 108 Item JSON únicos y NO 108 especies obligatorias. Las ocho bandas histórico-ecológicas producían un objetivo antiguo de 96; **no trasladar automáticamente** su selección a los nueve territorios histórico-culturales. Se permite referencia del mismo UUID en varios territorios, sin duplicar Items.

**Cuatro subcarpetas hermanas por Territorio:** `Flora/`, `Fauna/`, `Funga/`, `Recetas/`; Recetas no cuenta en FFF. La matriz conserva **36 referencias de Fauna candidatas** del lote anterior, no asegura todavía que todas las asignaciones estén editorialmente cerradas. **Flora y Funga carecen de matriz reconciliada para los nueve territorios**: dejar listas vacías con objetivo 4/4, sin crear relleno. Del banco anterior hay aprobación documental de `FUN-01` a `FUN-04` para Tierra del Fuego; **eso no equivale** a documentos Foundry V14 con IDs, assets y asignación dentro de los nueve territorios verificados. Recuperar su fuente antes de darlos por instalables.

**Equipo común — separación de funciones:** la carpeta plana de QA5 contiene **40 Items históricos**, con un banco de **29 candidatos gráficos / cruces de identidad**, no 69 objetos. Hay dos arreglos históricos: el legado 0.4.97 agrupaba por seis culturas **dentro** de `Equipo común`; una decisión posterior (11-11) distinguió explícitamente **Equipo común transversal** de **Equipo cultural adscrito**, manteniendo **Instrumentos musicales** como familia separada. Para staging, los destinos se expresan `Equipo común/` (transversal), `Equipo cultural/{Mapuche,Aymara,Nórdicos,Lickanantay,Chinchorro,Selk’nam}/` (cultural) e `Instrumentos musicales/`. **No mover ni duplicar los 40 Items todavía**; antes comprobar un Item por vez con sus IDs y su última función aprobada. No confundir cultura del asset con categoría del Item. La decisión de subcarpetas se valida en el cotejo de la nueva estructura, sin resucitar automáticamente la versión anterior.

**Manifest y gate corregidos:** `manifests/ci137-expansion-territorios-habitantes-culturas-v01.json` incorpora `fffStandard`, metas 108 y separación funcional de Equipo. `tools/foundry/ci137_expansion_gate.py` bloquea un preflight que retroceda a 9×4 Fauna o que confunda 40 Items con 29 imágenes. [CI #45468986756](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45468986756) **PASS**.

**Decisiones:** objetivo 4×4×4 por Territorio; separar transversales/culturales; no inventar faltantes. **Pendientes:** matrices Flora y Funga por nueve Territorios, FUN-01..04 fuente + IDs, revisión de adscripción de los 40 Items y ruta de 29 iconos. **Fuentes:** decisiones de usuario del 10/14/24-11; estándares territoriales; checkpoint `CORE_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_PREPARADO_20261121_v10.md`; matriz `CORE_MATRIZ_EQUIPO_COMUN_40x29_2026-11-21_v02.csv`. **Estado Maestro/main/Forge/H6/H7/Bridge:** sin cambios.

## 2. Árbol de destino

```text
ha-proto-items — Objetos (preservar los 136 existentes)
├─ Armas / Defensas / Parafernalia / Rituales
├─ Equipo común (sólo material transversal; distribución pendiente)
├─ Equipo cultural (material adscrito; distribución pendiente)
│  ├─ Mapuche / Aymara / Nórdicos
│  └─ Lickanantay / Chinchorro / Selk’nam
├─ Instrumentos musicales (familia separada)
├─ Reliquias (Cotidianas / Legendarias)
└─ Territorio
   ├─ 01 Atacama / Lickanantay
   ├─ 02 Pikunmapu
   ├─ 03 Ngulumapu
   ├─ 04 Pewenmapu
   ├─ 05 Willimapu
   ├─ 06 Patagonia austral
   ├─ 07 Tierra del Fuego
   ├─ 08 Canales australes
   └─ 09 Umbral Polar
       [cada Territorio: 4 Flora + 4 Fauna + 4 Funga; Recetas fuera de cupo]
ha-proto-actors — Adversarios (preservar Ladrón oportunista)
├─ Habitantes
│  └─ Amenyi
└─ Adversarios
   └─ Turianos
ha-proto-journals — Journals (preservar Auspicios, 21 páginas)
└─ Culturas — Hiperaustralis (fuente histórica 36 páginas; identidad por reconciliar)
```

**Nota de integridad:** un Item FAU o FLO puede asociarse a más de un Territorio. El código / ID / documento **no se duplica** por esa razón. Los índices territoriales deben apuntar al Item canónico por UUID. Las carpetas son navegación; si la misma especie debe mostrarse en varias, generar enlaces/referencias, NO varias fichas con el mismo código. La forma técnica exacta de presentar esos enlaces queda pendiente del cotejo Foundry. Los nueve Territorios CORE no son los ocho biomas del plan anterior; Titicaca/Paititi mantienen su estatuto de nodos complementarios, no reemplazan automáticamente Atacama/Pikunmapu/Willimapu.

## 3. Inventario recuperado — disponibilidad para migrar

| Familia | Datos inspeccionados | Identidad Foundry / aprobación | Integración |
|---|---|---|---|
| Defensas nuevas | Catálogo **DEF-01–09**; 8 imágenes COM-03/05/06/07/08/10/11/12 aprobadas; COM-09 Tañaña sin archivo final | `0.4.75` tiene **8 defensas históricas distintas**, sin `_id` en `data/defensas.json`; el pack QA5 ya contiene sus 8 Items históricos con otros IDs | Cotejar uno a uno antes de alta; **prohibido sustituir o duplicar por nombre parecido** |
| Fauna | Maestro **45 códigos**: 44 activos + FAU-006 legado; 16 arte aprobados / 28 pendientes | mapa Foundry en repositorio tiene **50 IDs únicos**; legado 0.4.75 aporta sólo **32 payloads** sin `_id`; 9×4 = 36 referencias, especies repetibles entre territorios | Reconciliar 50/45/44 sin altas automáticas ni duplicar |
| Flora | FLO-001–040 en `0.4.75` con 40 fichas y 40 iconos históricos | 40 IDs Foundry recuperados y trazables; **cero nuevos iconos FLO aprobados** para sustitución (estados editoriales históricos no son aprobación de iconos finales) | Cotejar 40 JSON originales vs identidades Foundry; preservar fondos históricos sin copiar anomalías |
| Funga | La fuente `flora_y_funga_40.json` agrupa taxones y candidatos (incluye líquenes/fungosidades) | **sin lote independiente aprobado**; no asignar especie a Funga por rótulo genérico | Carpeta reservada, ninguna ficha creada sin clasificación validada |
| Habitantes / Amenyi | Acta autoral `ADV_AMENYI_ACTA_NOMENCLATURA_Y_CONTINUIDAD_v01.md` | Nomenclatura **Amenyi** para el pueblo; **Epeche** sólo relato; no consta export Actor final con IDs | Ubicación **Habitantes/Amenyi** registrada; fichas sólo tras recuperar payload / visual final |
| Adversarios / Turianos | `manifests/turianos-assets.json`; TUR-01–06, seis WebP SHA registrados | El JSON histórico de seis Actors **no tiene `_id` ni UUID**; TUR-01–04 fichas pendientes, **Sangu/TUR-05** fuera de runtime y **Popr/TUR-06** pendiente de prueba; `GORILESCOS` es metadato heredado, no una categoría aprobada | Destino **Adversarios/Turianos**, sin activar seis Actors automáticamente |
| Culturas | `0.4.75/data/journals.json` incluye **Culturas — Hiperaustralis (36 páginas)** | Journal histórico sin ID persistente; distinguir de Auspicios 21 páginas, ya instalado | Incorporar al pack `ha-proto-journals` tras cotejo de UUID/páginas |

## 4. Fuente binaria comprobada

Se abrió **físicamente** `/mnt/data/HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB(1).zip`: **358 entradas CRC PASS**, SHA-256 **`c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`** (coincide con manifiesto GitHub histórico). En su raíz existe `hiperaustralis-rituales/`, NO es un módulo CI137 para instalar. Se compararon las claves `_id` de sus `data/*`: Defensas 8 / Fauna 32 / Flora 40 / Bestiario 8 / Adversarios Mapuche 16 / Culturas Journal 36 páginas; los documentos de esas familias, salvo algunos de otras familias, son plantillas de instalación que carecen de IDs persistentes. **No migrarlos por copia directa**.

Hashes SHA256 de los JSON de la fuente histórica:
- `data/defensas.json`: `50a212d61807e8ac19ea68bdec2961271e4a3833e902aeed36c0ad38e2422be0`.
- `data/fauna_items.json`: `19c6d1d12f1cd5844b6a09ef0272d4b6a2882b4b4ce137def6e6712def41abaf`.
- `data/flora_items.json`: `2c048cd5ec7e4a16e38703586539a6c91ba2c42a89f11c20f5d261145a8bc1b5`.
- `data/flora_y_funga_40.json`: `6acf8feb5ee56f51d350387b5c6286fa94761ec33180e629cba9b108fe317228`.
- `data/journals.json`: `d8a3522036f5369b320abf31d6acdecb1a7098194744b47542341497c4faa259`.

## 5. QA de expansión y bloqueo de publicación

Artefactos de trabajo:
- `manifests/ci137-expansion-territorios-habitantes-culturas-v01.json`: destina familias, conserva autoridades, consigna requisitos y **bloquea nuevas altas no justificadas**.
- `tools/foundry/ci137_expansion_gate.py`: comprueba mapas reales de IDs 50 Fauna / 40 Flora, catálogo DEF01–09, 9 territorios / 36 FAU referencias, TUR01–06, ubicaciones de Amenyi/Turianos y estado no aprobatorio.
- `.github/workflows/ci137-expansion-gate.yml`: preflight **sólo lectura**. No compila módulo ni altera Forge.

**Puertas para un ZIP futuro** (mismo ID, nunca instalarlo directamente sobre H6): fuentes encontradas → identidad original y carga de Actor/Item/Journal → V14 16 caracteres / folders → payload y visuales por aprobación → roundtrip de los tres packs → QA cliente H7/clon y dos reinicios. **Mientras haya fichas sin ID o visuales no aprobados, no declararlas instaladas.**

## 6. Decisiones / Pendientes / Fuentes / Maestro

**Decisiones:** QA5 permanece estable; mismo módulo y tres packs; **Amenyi → Habitantes**, **Turianos → Adversarios**; nueve Territorios CORE; Funga separada sin contenido ficticio; catálogo nuevo DEF distinto de ocho Items históricos; Fauna y Flora sin duplicados por territorio.

**Pendientes:** export exacto de Actors Amenyi/Turianos y Journal Culturas; cotejo DEF/COM de nueve entradas; reconciliación 50/44/45 FAU; aprobación y QA de 40 iconos FLO y clasificación micológica; recuperación de payloads actuales más recientes que 0.4.75; D3 de futura ampliación.

**Fuentes:** fuentes repositorio y ZIP 0.4.75 SHA arriba; `FAUNA_MAESTRO_ACTUAL.md` (Biblioteca 18-11); `ADV_AMENYI_ACTA_NOMENCLATURA_Y_CONTINUIDAD_v01.md` (Biblioteca 20-11); `CORE_AUDITORIA_TERRITORIO_BIOMA_JURISDICCIONES_2026-11-21_v01.md` (21-11); `manifests/defensas-assets.json`, `manifests/turianos-assets.json`, `source/territorios/flora/foundry-id-map.json`, `source/territorios/fauna/foundry-id-map.json`, `docs/COMPENDIOS_TERRITORIO_PROCEDENCIA.md`.

**Cambios al Estado Maestro:** NINGUNO. No se cambió `main`, Forge, H7, H6 ni MELIAZ Bridge.
