# Inventario estructural — Biomas y Flora 0.4.75

Fecha: 2026-11-12  
Fuente: `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip`  
SHA-256: `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`  
Rama: `work/native-compendia-pipeline`

## 1. Alcance y método

Se inspeccionaron los JSON de Items y Journals, las rutas de imágenes declaradas por los Items y la presencia física de esos archivos dentro del ZIP. No se ejecutó el instalador ni se importaron documentos a Foundry.

Archivos inspeccionados:
- `data/biomas_items.json`
- `data/biomas_journal.json`
- `data/flora_items.json`
- `data/journals.json`

## 2. Items Bioma

Ocho Items `equippableItem`, todos con template `HipBiomaTpl00001`, `system.props.hipera_tipo = bioma`, apartado `Biomas` y flag `meliaz-bridge.kind = bioma`. La identidad de semilla se conserva en `flags.hiperaustralis-bioma-item.seedId`, BIO-001…BIO-008.

| Código | Nombre | Bioma declarado | Imagen |
|---|---|---|---|
| BIO-001 | Titicaca | Altiplano lacustre | `assets/biomas/iconos/BIO-001.webp` |
| BIO-002 | Paititi | Bosque nublado | `assets/biomas/iconos/BIO-002.webp` |
| BIO-003 | Ngulumapu | Bosque templado lluvioso | `assets/biomas/iconos/BIO-003.webp` |
| BIO-004 | Pewenmapu | Cordillera volcánica | `assets/biomas/iconos/BIO-004.webp` |
| BIO-005 | Patagonia austral | Estepa y bosque subantártico | `assets/biomas/iconos/BIO-005.webp` |
| BIO-006 | Tierra del Fuego | Bosque subpolar e islas | `assets/biomas/iconos/BIO-006.webp` |
| BIO-007 | Canales australes | Archipiélago y canales fríos | `assets/biomas/iconos/BIO-007.webp` |
| BIO-008 | Umbral Polar | Ambiente antártico | `assets/biomas/iconos/BIO-008.webp` |

Nota: los nombres y etiquetas se transcriben del JSON fuente; no constituyen validación geográfica o editorial.

## 3. Registros Journal de Biomas

`data/biomas_journal.json` contiene ocho registros BIO-001…BIO-008 con campos:
- `id`, `nombre`, `bioma`, `icono`
- `descripcion_jugable`, `situacion_de_juego`
- `obstaculo_ejemplo.descripcion`, `obstaculo_ejemplo.peso_situacional_provisional`
- `nota_editorial`, `estado`

Los ocho registros declaran `CANDIDATO / NO PUBLICAR`. Los pesos situacionales son explícitamente provisionales. Se conserva esa condición; no se promueve ningún registro a canon o publicación.

## 4. Flora Items

40 Items `equippableItem`, template `HipFloraTpl00001`, `system.props.hipera_tipo = flora`, apartado `Flora y Funga`, con código FLO-001…FLO-040 y semilla `flora-01`…`flora-40`. Sus iconos están bajo `assets/flora-y-funga/iconos/`; las fichas también declaran fondos en `assets/flora/biomas/`.

| Código | Nombre | Ámbito declarado |
|---|---|---|
| FLO-001 | Totora | Titiqaqa |
| FLO-002 | Orquídea andina | Paititi |
| FLO-003 | Ulmo | Ngulumapu |
| FLO-004 | Pewen | Pewenmapu |
| FLO-005 | Calafate | Patagonia austral |
| FLO-006 | Lenga | Patagonia austral / Tierra del Fuego |
| FLO-007 | Ciprés de las Guaitecas | Canales australes |
| FLO-008 | Pasto antártico | Umbral Polar |
| FLO-009 | Llacho | Titiqaqa |
| FLO-010 | Bromelia | Paititi |
| FLO-011 | Canelo | Ngulumapu / Canales / Tierra del Fuego |
| FLO-012 | Ñirre | Pewenmapu / Patagonia austral |
| FLO-013 | Coigüe | Ngulumapu / Pewenmapu |
| FLO-014 | Coirón | Patagonia austral |
| FLO-015 | Guindo | Tierra del Fuego / Canales |
| FLO-016 | Esfagno | Tierra del Fuego |
| FLO-017 | Helecho arborescente | Paititi |
| FLO-018 | Avellano | Ngulumapu |
| FLO-019 | Chaura | Patagonia austral |
| FLO-020 | Liquen polar | Umbral Polar |
| FLO-021 | Junco | Titiqaqa |
| FLO-022 | Bambú | Paititi |
| FLO-023 | Mañío | Pewenmapu |
| FLO-024 | Macroalga | Canales australes |
| FLO-025 | Lenteja de agua | Titiqaqa |
| FLO-026 | Musgo de bosque | Bosque nublado / templado |
| FLO-027 | Ciprés de cordillera | Pewenmapu |
| FLO-028 | Fungosidades | Umbral Polar — encuadre específico por determinar |
| FLO-029 | Helecho de agua | Sin asignación territorial confirmada |
| FLO-030 | Epífita | Paititi |
| FLO-031 | Trepadora | Ngulumapu |
| FLO-032 | Alga polar | Umbral Polar |
| FLO-033 | Helecho terrestre | Territorio no asignado |
| FLO-034 | Gramínea cordillerana | Cordillera (territorio por definir) |
| FLO-035 | Vegetación litoral | Canales australes |
| FLO-036 | Musgo polar | Umbral Polar |
| FLO-037 | Yareta | Territorio por confirmar |
| FLO-038 | Copihue | Ngulumapu |
| FLO-039 | Nalca | Ngulumapu |
| FLO-040 | Chilco | Ngulumapu |

## 5. Hallazgos técnicos y alertas

1. **Rutas de imagen:** todas las rutas `img` y `background` declaradas por los 48 Items (8 Biomas + 40 Flora) existen dentro del ZIP. No se detectaron referencias rotas en este conjunto.
2. **Fondos de Flora:** FLO-001…008 tienen ocho fondos específicos; FLO-009…040 comparten el fondo de Totora. Se registra como anomalía heredada para revisión visual/editorial, sin modificarla.
3. **Asignación territorial:** varios Items Flora tienen ámbitos múltiples, descriptivos o sin asignación confirmada. No forzar su distribución a una sola carpeta territorial durante la migración.
4. **Identidad:** los Biomas usan seedId BIO-001…008; Flora usa seedId flora-01…40 y código FLO-001…040. Preservar ambos campos y cualquier UUID/ID Foundry que aparezca en fuentes posteriores. Estos JSON no contienen un `_id` de documento Foundry en el nivel superior.
5. **Carpetas Foundry:** los JSON inspeccionados no acreditan por sí solos la existencia ni jerarquía de carpetas `Territorio/Flora/Fauna/Funga/Recetas`. Tampoco se encontró en este ZIP un export de carpetas/compendios tipo LevelDB. No crear ni afirmar esas carpetas como migradas a partir de estos archivos.
6. **Journal general:** `data/biomas_journal.json` es un conjunto de registros de datos, no el JournalEntry general `Biomas → Territorios` ya identificado en la arquitectura de destino. No confundirlos ni renombrarlos automáticamente.
7. **Journal de Flora:** `Hiperaustralis — Flora del Corredor Austral` se mantiene separado de los Items Flora y del Journal general de Territorios.

## 6. Estado de migración

| Componente | Estado |
|---|---|
| Inventario JSON Biomas | Inspeccionado |
| Inventario JSON Flora | Inspeccionado |
| Rutas de imagen de ambos grupos | Verificadas dentro del ZIP |
| Carpetas Foundry destino | No verificadas |
| UUID/IDs documentales persistentes | No aportados por estos JSON |
| Aprobación editorial BIO-001…008 | No; candidato / no publicar |
| Importación a Foundry | No ejecutada |
| Instalación / publicación | No ejecutada |

## 7. Próximos pasos técnicos

- Inspeccionar y documentar el diff de `scripts/install.js` y `module.json` antes de adoptar el instalador.
- Recuperar un export de Foundry que contenga las carpetas y documentos persistentes, si se requiere reconstruir la jerarquía real.
- Construir manifiestos de migración con seedId, código, ruta de icono, ruta de fondo, ámbito y estado editorial.
- Resolver las asignaciones territoriales y fondos compartidos sólo mediante auditoría editorial explícita.
- Mantener aislada la rama de trabajo; no tocar `main`, mundo productivo, Forge, Bridge ni Estado Maestro.

## Cierre

Inventario de 48 Items completado a nivel de JSON y assets referenciados. La estructura de carpetas destino y los UUID/IDs Foundry persistentes siguen sin estar demostrados por esta fuente. No se alteró ningún binario ni documento fuente.
