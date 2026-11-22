# Armas — integración al pipeline nativo

**Rama:** `work/native-compendia-pipeline`  
**Fuente:** `source/items/armas/`  
**Manifiesto:** `manifests/items-armas.json`

## Estructura

- Los 20 documentos Foundry Item se conservan individualmente en `source/items/armas/`.
- `prepare_sources.py` los incorpora al pack de Items y los ubica en la carpeta nativa **Armas**.
- Se preservan IDs, payloads, flags, estadísticas y referencias del export. El campo técnico `folder` se asigna al compilar, siguiendo la estructura de carpetas del pack.
- `validate_armas.py` comprueba cardinalidad, inventario de archivos, IDs, nombres, referencias `img` y SHA-256 de cada JSON contra el manifiesto.

## Distinción de integridad

Los SHA-256 de `manifests/items-armas.json` verifican los **JSON de los Items**. No son hashes de los WebP.

Las referencias visuales siguen declaradas bajo:

`modules/hiperaustralis-rituales/assets/armas/`

No se reescriben ni se promueven a runtime hasta que los binarios finales estén incorporados en `module/assets/armas/` y exista un manifiesto independiente con hash, formato y dimensiones de cada imagen.

## Resultado de CI

- `ARMS_SOURCE_PASS`: los 20 documentos y el manifiesto están íntegros y forman parte de la compilación.
- `legacy_asset_references_pending`: informa cuántas referencias todavía dependen del módulo histórico. No se presenta como autonomía visual.
- La validación de presencia/hash de imágenes será un gate obligatorio al incorporar el lote binario; no se simula ni se satisface con hashes de JSON.

## Límites

Esta integración no altera `main`, Forge productivo, MELIAZ Bridge ni el Estado Maestro. No resuelve por sí sola el Item independiente **Cuchillo de piedra**, que conserva su cruce separado.
