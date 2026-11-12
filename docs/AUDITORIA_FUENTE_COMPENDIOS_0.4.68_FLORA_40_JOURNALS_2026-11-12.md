# Auditoría de fuente — Compendios 0.4.68 Flora 40 / Journals

Fecha de inspección: 2026-11-12  
Archivo recibido: `HIPERAUSTRALIS_COMPENDIOS_0.4.68_FLORA_40_JOURNALS_LAB.zip`  
Tamaño: 45,404,885 bytes  
SHA-256: `cf522602cf16f7e272ba9cc62d6164d761318426398cd7717e41e0bf36bd1a61`  
Entradas ZIP: 399  
Integridad CRC: correcta (`testzip() = None`)

## 1. Alcance y resultado

El paquete contiene datos y recursos de Foundry correspondientes a la versión 0.4.68 LAB. Es una fuente histórica recuperada y verificable, no una actualización automática del destino ni una sustitución demostrada de 0.4.75.

Archivos relevantes:
- `data/journals.json`
- `data/flora_items.json`
- `data/flora_y_funga_40.json`
- `assets/flora-y-funga/iconos/`
- `assets/flora/biomas/`
- `CHECKPOINT_0468.md`
- `CHECKPOINT_FLORA_FUNGA_0458.md`
- `CHECKPOINT_0462_JOURNAL_ITEMS_FAUNA.md`

## 2. Journals

`data/journals.json` contiene cuatro JournalEntry:
- Auspicios — Hiperaustralis (21 páginas)
- Hiperaustralis — Flora del Corredor Austral (8 páginas)
- Hiperaustralis · Fauna (32 páginas)
- Culturas — Hiperaustralis (36 páginas)

El Journal de Flora contiene ocho páginas documentales:
1. Totora — Titicaca
2. Orquídea andina — Paititi
3. Ulmo — Ngulumapu
4. Pewen / araucaria — Pewenmapu
5. Calafate — Patagonia austral
6. Lenga — Tierra del Fuego
7. Ciprés de las Guaitecas — Canales australes
8. Pasto antártico — Umbral Polar

Este Journal es una fuente documental territorial de flora. No se debe confundir con el JournalEntry independiente identificado en el plan de migración como Biomas, cuyo nombre visible de destino es Territorios. No se debe inferir que son el mismo JournalEntry ni renombrar este Journal por semejanza temática.

## 3. Flora Items

`data/flora_items.json` contiene 40 Items, códigos FLO-001 a FLO-040. Los 40 códigos tienen correspondencia entre `flora_items.json` y `flora_y_funga_40.json`.

Los 40 iconos WebP referenciados bajo `assets/flora-y-funga/iconos/` existen en el ZIP. Sus SHA-256 coinciden con los valores registrados en `flora_y_funga_40.json`: 40/40.

Los iconos comprobados son WEBP de 512×512 con canal alfa/transparencia.

Los Items son documentos de tipo `equippableItem`, con `system.props.hipera_tipo = flora`, códigos FLO y flags de procedencia/versionado 0.4.68. No convertirlos en páginas de JournalEntry ni alterar sus IDs/seedId sin cotejo posterior.

## 4. Discrepancia de fondos de ficha

En los flags `hiperaustralis-sheet.background` de los 40 Items:
- 8 Items usan ocho rutas distintas de fondo bajo `assets/flora/biomas/`.
- 33 Items apuntan a la misma ruta de fondo de Totora:
  `modules/hiperaustralis-rituales/assets/flora/biomas/totora_schoenoplectus_californicus.webp`.

Este patrón requiere cotejo con una versión posterior y/o con el comportamiento esperado de la ficha antes de migrar. Se registra como anomalía de fuente; no se corrige en esta auditoría.

## 5. Estados editoriales

`flora_y_funga_40.json` contiene 40 registros y campos de estado editorial, revisión específica, reservas, procedencia y hashes. Las asignaciones territoriales no son todas definitivas: hay entradas con territorio sin confirmar, por definir o reservas explícitas. No normalizar esas asignaciones ni promoverlas por inferencia.

El checkpoint 0.4.68 indica:
- Las 40 entradas autorizadas FLO-001 a FLO-040 pasan a Naturaleza (Items), sin nuevo compendio.
- Se conservan los ocho seedId previos para actualizar Items antiguos.
- Los códigos se conservan en datos y rutas, pero no en títulos del Journal documental unificado.
- Imágenes documentales permanecen en Journals; WebP autorizados en Items.
- Quedaban pendientes las pruebas visuales, drag/drop y revisión de acumulación de Items manuales sin flag.

El checkpoint 0.4.58 describe una etapa anterior distinta: JournalEntry de Flora y Funga con 40 fichas, separado de ocho Flora Items heredados. No tratar ese checkpoint anterior como la arquitectura vigente del 0.4.68.

## 6. Separación de estructuras territoriales de destino

Se preserva la distinción establecida en el plan de migración:
- JournalEntry Biomas → Territorios: estructura documental/navegacional independiente.
- Carpeta de Items Territorio: estructura de Items con subcarpetas Flora, Fauna, Funga y Recetas.

El Journal Flora del Corredor Austral, sus ocho páginas documentales y los 40 Flora Items son fuentes de contenido relacionadas, pero no reemplazan ni colapsan esas dos estructuras.

## 7. Decisiones de migración

- Registrar el ZIP 0.4.68 como fuente histórica inspeccionada.
- No asumir que 0.4.68 sustituye 0.4.75; falta cotejo binario y de contenido entre versiones.
- Conservar los JSON fuente, los 40 iconos y las rutas originales como evidencia para la migración.
- No modificar IDs, seedId, nombres, asignaciones territoriales ni estados editoriales.
- No copiar la anomalía de los 33 fondos repetidos al destino sin resolver su origen.
- No modificar Estado Maestro, `main`, módulo estable, Forge productivo ni MELIAZ Bridge.

## 8. Pendientes

1. Cotejar 0.4.68 con 0.4.75 y, si se recuperan, 0.4.71–0.4.73.
2. Verificar si el JournalEntry Biomas está presente en alguna fuente y recuperar su identidad/ID sin confundirlo con Flora del Corredor Austral.
3. Cotejar los 40 fondos de ficha y resolver la repetición de Totora mediante evidencia de versiones o implementación.
4. Extraer manifiestos de rutas, IDs, referencias y hashes para la estructura final de Items Territorio.
5. Mantener las reservas editoriales y estados de aprobación sin promoción automática.

## 9. Estado

Fuente recibida e inspeccionada. Integridad ZIP correcta. JSON y 40 iconos de Flora cotejados internamente. Migración binaria al repositorio todavía no ejecutada; este documento registra auditoría, no importación de activos.
