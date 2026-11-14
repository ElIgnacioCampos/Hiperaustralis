# Exportación de inventario Foundry — Items

Objetivo: obtener un inventario verificable de los Items del mundo y de sus compendios `world.*` para reconciliar los 135 Items históricos con las fuentes de `source/items/`.

## Script

`tools/foundry/export-items-inventory.js`

Es un exportador de sólo lectura. No crea, edita, mueve ni borra documentos. Conserva:

- `_id` y UUID completo;
- tipo de documento y tipo de Item;
- compendio de origen;
- ID de carpeta y ruta de carpeta cuando puede resolverse;
- payload completo de Foundry, incluidos `system`, `flags`, `img` y `_stats`;
- versión de Foundry y del sistema;
- árbol de carpetas Item del mundo;
- conteo por compendio y carpeta, además de errores de lectura.

Incluye Items directamente contenidos en el mundo y todos los compendios del mundo cuyo tipo documental sea Item. Excluye compendios de sistemas/módulos y no exporta Actors.

## Ejecución

1. Abrir el mundo Foundry que contiene los compendios históricos.
2. Crear una Macro nueva de tipo **Script**.
3. Copiar el contenido de `tools/foundry/export-items-inventory.js` y guardarlo en la Macro.
4. Ejecutarla una vez.
5. Foundry descargará un archivo `HIPERAUSTRALIS_FOUNDRY_ITEMS_*.json`.
6. Conservar el archivo sin editarlo y usarlo como export de referencia para el cruce de IDs, UUID, carpetas y rutas.

## Validación esperada

El resumen de la consola y la notificación muestran:
- total de Items únicos;
- Items del mundo;
- Items de compendios;
- carpetas Item;
- errores por compendio.

El inventario esperado de referencia histórica es de 135 Items distribuidos en ocho carpetas raíz, pero el script no fuerza ese número. Si el resultado difiere, se investigan el mundo activo, los compendios disponibles y los errores antes de declarar incompleta o duplicada una categoría.

## Seguridad y límites

- No ejecutar scripts de instalación ni normalización de actores.
- No usar este inventario para modificar el mundo productivo.
- No importar el JSON de vuelta a Foundry.
- No cambiar IDs ni rutas en GitHub a partir de coincidencias por nombre solamente.
- El export contiene payload completo de Items del mundo y de sus compendios; almacenarlo como fuente privada del proyecto y no publicarlo en repositorios públicos.

El export no incluye Actors Turianos. Su reconciliación requerirá un inventario separado de los Actors reales y sus IDs/carpeta, una vez cerrado el frente de Items.
