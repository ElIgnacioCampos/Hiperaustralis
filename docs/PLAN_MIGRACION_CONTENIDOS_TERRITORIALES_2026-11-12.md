# Migración de contenidos territoriales — checkpoint 2026-11-12

Estado: PREPARACIÓN DE MIGRACIÓN; los binarios territoriales no se han incorporado todavía.
Rama: `work/native-compendia-pipeline`.
Base verificada antes de este checkpoint: `d400c862a44cfc0fb6468b7fd651b090f6d9a83e`.

## 1. Alcance y separación estructural

La migración mantiene dos estructuras independientes:

- **JournalEntry `Biomas` → `Territorios`**: navegación y consulta territorial.
- **Items / carpeta `Territorio`**: documentos Item organizados por territorio y subcategoría.

No se convierten Journals en Items ni Items en Journals.

Ocho territorios de la carpeta Item `Territorio`:

1. Titicaca — Altiplano lacustre
2. Paititi — Bosque nublado
3. Ngulumapu — Bosque lluvioso
4. Pewenmapu — Cordillera volcánica
5. Patagonia austral
6. Tierra del Fuego
7. Canales australes
8. Umbral Polar

Cada territorio conserva las subcarpetas editoriales `Flora/`, `Fauna/`, `Funga/` y `Recetas/`. Una carpeta vacía no autoriza crear documentos ficticios.

## 2. Fuentes localizadas

### Paquetes de compendios
El acta de continuidad RF01 del 2026-10-15 registra copias históricas y sus respaldos Drive:

- `HIPERAUSTRALIS_COMPENDIOS_0.4.71_BIOMAS_REPARACION_LAB.zip` — 45.57 MB; 357 entradas CRC; SHA-256 del respaldo `52ee79aa5662e56024dc5b6c90cc8bb20a00b00f98dce8a3c3755b0bb3b9fcd1`.
- `HIPERAUSTRALIS_COMPENDIOS_0.4.72_REPARACION_BIO_LAB.zip` — 45.58 MB; 357 entradas CRC; SHA-256 `437b263f40c0c1e18cd24d0bcb996a4e1769a3830978133d0c839a0dbe1b228c`.
- `HIPERAUSTRALIS_COMPENDIOS_0.4.73_BIO_TEXTOS_LAB.zip` — 45.58 MB; 357 entradas CRC; SHA-256 `2d8830d5a18b7d6ff7ba4eee469214fef7b7efdf7164b552464620a0580a5329`.
- `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip` — 33.03 MB; 358 entradas CRC; SHA-256 `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`.
- Carpeta Drive Compendios LAB: https://drive.google.com/drive/folders/1CFh8azDA721YheGy1jkS15_ZH2WN522l
- Carpeta Drive Hiperaustralis — otros archivos grandes y fuentes: https://drive.google.com/drive/folders/19bSJhFUviqLaIGJB2v3Dr-u-D8KHErOi

Los SHA-256 citados son los del respaldo descargado, no una comparación criptográfica independiente con los originales.

### Flora 001–040
- Paquete: `HIPERAUSTRALIS_FLORA_001_040_RESCATADAS_EDITORIAL_v2.zip`.
- Registro histórico: 96.24 MB, 144 entradas CRC, SHA-256 del respaldo `c91c58c8cb32b215e46ae57e8ccf85d99ad512b4fabb59ccc41b888eeb6d932e`.
- La auditoría ED del 2026-10-09 establece que 001–040 son candidatos físicos, no 40 iconos aprobados. Ninguno de esos 40 candidatos tiene aprobación final automática para sustituir los iconos operativos.
- La normalización descrita como objetivo editorial es PNG RGBA 1024×1024 y derivado Foundry WEBP RGBA 512×512; no asumir que todos los archivos del ZIP ya cumplen ese objetivo.

### BIO-RUP
- Inventario físico localizado: `BIO_RUP_INVENTARIO_REAL_2026-10-11.csv`.
- El inventario registra 98 entradas distribuidas entre `HIPERAUSTRALIS_BIO_RUP_TODAS_LAS_IMAGENES_DEL_CHAT(1).zip` y `HIPERAUSTRALIS_RESCATE_COMPOSICIONES_BIO_RUP_2026-10-11(1).zip`, con rutas internas, tamaños y hashes.
- Checkpoint ED BIO-RUP v16: no declarar BIO-001–008 aprobados ni aptos para Foundry. BIO-001 v0.2 es referencia de calibración; BIO-005 requiere corrección localizada; BIO-007 variante B es preferencia provisional, no aprobación.
- La existencia del inventario no equivale a disponibilidad de los bytes originales.

### Fauna
- Checkpoints FAU documentan lotes y controles individuales. El checkpoint de etapa 2 registra 7 aprobados (001–005, 023 v2 y 032 v11), 24 preseleccionados y 006 como legado retirado; FAU-007–022 y 024–031 permanecían sin aprobación automática en ese corte.
- No promover todo el banco a publicación por el mero hecho de que existan archivos o checkpoints.

### Banco fotográfico de biomas
- Fuente documental identificada: `BANCO_FOTOS_BIOMAS_HIPERAUSTRALIS_FOUNDRY_v0.2.md` y su CSV.
- El índice maestro de bancos visuales registra 32 escenas / 8 bandas y exige conservarlas como fotografía editorial, sin rupestrizarlas. Los originales/crops y licencias deben cotejarse antes de distribuir.

## 3. Estado de acceso en esta ejecución

- GitHub: rama de trabajo accesible; el árbol actual no contiene todavía directorios de contenidos territoriales ni sus binarios.
- Biblioteca: inventarios y checkpoints textuales accesibles.
- Las copias de los ZIP citados constan históricamente trasladadas a papelera de Biblioteca. La materialización de esos IDs no está disponible en esta ejecución.
- No hay conector Google Drive disponible para descargar los paquetes desde las carpetas registradas.
- No se ha modificado `main`, el módulo estable, Forge productivo, MELIAZ Bridge ni el Estado Maestro.

## 4. Orden de migración al recuperar los binarios

1. Inspeccionar ZIP completos, CRC y SHA-256; registrar el hash del archivo fuente recuperado.
2. Comparar los paquetes 0.4.71–0.4.75 por rutas, hashes y contenido. No concatenarlos ni asumir que son acumulativos.
3. Extraer inventario de documentos Foundry y assets con ruta original, ID, nombre, tipo, territorio, subcategoría, tamaño, dimensiones, formato, transparencia y referencias runtime.
4. Separar candidatos editoriales, originales, pruebas, descartados y recursos operativos vigentes.
5. Copiar a `source/` los JSON canónicos legibles; a `assets/` sólo los binarios necesarios para autonomía del módulo; mantener pruebas y originales en sus rutas de archivo según procedencia.
6. Crear manifiestos por familia y registrar equivalencias cuando cambie una ruta. No cambiar IDs.
7. Validar referencias, UUID, rutas, dimensiones, alfa y hashes; compilar y hacer round-trip.
8. Mantener el PR aislado y sin instalación productiva hasta QA y aprobación.

## 5. Decisiones / pendientes / fuentes / Maestro

### Decisiones
- Se mantiene separada la arquitectura JournalEntry y la carpeta Item.
- Se preservan los ocho territorios y sus cuatro subcategorías.
- No se inventan contenidos ni se promueven candidatos a aprobados.

### Pendientes
- Recuperar los ZIP desde las carpetas Drive citadas o reponerlos en una fuente accesible.
- Inspeccionar y reconciliar sus contenidos reales.
- Incorporar los binarios y JSON territoriales por lotes con hashes verificables.

### Fuentes
- `docs/COMPENDIOS_TERRITORIO_PROCEDENCIA.md`.
- Acta de continuidad SAC-RF01 v06 (2026-10-15).
- `BIO_RUP_INVENTARIO_REAL_2026-10-11.csv`.
- `ED_CHECKPOINT_BIO_RUP_ARQUEOLOGIA_v16.md`.
- `ED_AUDITORIA_ESTADO_FLORA_ESTANDAR_2026-10-09.md`.
- `CORE_CHECKPOINT_FAU_SECUENCIA_ETAPA_02_2026-10-10.md`.
- `ED_INDICE_MAESTRO_BANCOS_VISUALES_HIPERAUSTRALIS_v0.1.md`.

### Cambios al Estado Maestro
NINGUNO. Este checkpoint sólo registra el estado de la migración técnica.
