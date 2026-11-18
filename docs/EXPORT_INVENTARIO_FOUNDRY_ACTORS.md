# Exportación de inventario de Actors — Foundry V14

## Objetivo

Exportar Actors del mundo y de todos los compendios `world.*` cuyo tipo nativo sea `Actor`. El documento completo incluye sus Items embebidos, `prototypeToken`, `system`, `flags`, ownership, `_stats`, IDs y referencias.

## Procedimiento

1. Abrir el mundo **Hipera 5** en Foundry V14.
2. Crear una Macro nueva de tipo **Script**.
3. Nombrarla `HIPERAUSTRALIS — Exportar Actors`.
4. Copiar el contenido de [`export-actors-inventory.js`](../tools/foundry/export-actors-inventory.js) y pegarlo en la macro.
5. Guardar y ejecutar una vez.
6. Adjuntar aquí el archivo descargado `HIPERAUSTRALIS_FOUNDRY_ACTORS_*.json`.

## Seguridad y alcance

- Sólo lectura: no crea, edita, mueve ni elimina documentos.
- Incluye Actors de `game.actors` y compendios `world.*` de tipo Actor.
- No incluye compendios de sistemas o módulos externos.
- Los Items embebidos se conservan dentro del payload de cada Actor; no se exportan como Items independientes.
- No deduplica por nombre ni altera IDs.
- Informa errores de lectura por compendio.

Este export es necesario para reconciliar los Turianos y otras fichas Actor con sus IDs, carpetas y datos reales de Foundry.
