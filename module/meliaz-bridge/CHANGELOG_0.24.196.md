# MELIAZ Bridge 0.24.196

## Base
- MELIAZ Bridge 0.24.195.
- Compendios acumulados 0.4.93.

## Hoja Kona — auditoría de los ocho Rituales
- Se revisaron los ocho WebP del catálogo, sus cajas alfa y los cuatro marcos radiales de Kona v2.
- Causa del recorte: `renderKonaItemGrid()` asignaba `overflow:hidden !important` en línea a cada `.ha-ritual-item-row`. Esa regla prevalecía sobre el CSS posterior que intentaba permitir `overflow:visible`.
- Corrección: los slots Ritual reciben `overflow:visible` desde el propio renderizador. La cuadrícula y el área de Rituales ya permiten desbordamiento visible en Kona experimental.
- Se conserva la escala visual existente de 1.3 (+30%): era la intención de diseño previa; ahora el arte puede renderizarse completo fuera del hitbox.
- Se conserva `object-fit: contain`; no hay deformación ni recorte.
- Se mantienen los centros, el tamaño del hitbox de 70u, el orden y las posiciones de los cuatro slots.
- Restituir mantiene su WebP al 90%; Atar al 110%; los otros seis iconos mantienen su composición.
- Los ocho iconos caben dentro del espacio visual disponible al 130%; el más alto (Atar) ocupa aprox. 88.2u frente a 90.5u de separación mínima entre centros.

## Hoja Kona — Equipo
- Los slots ocupados muestran como tooltip/aria-label el nombre real del Item.
- El icono también recibe alt, title y data-tooltip con el nombre real.
- Los slots vacíos conservan la etiqueta genérica “Equipo”.
- No se alteran flags, equipoSlot, IDs, datos persistentes ni reglas de prioridad.

## Conservación
- No se cambian posiciones ni dimensiones de hitboxes.
- No se cambian Cariños, Lenguas, Instrumentos/Música, Territorio ni otros drag-and-drop.
- Sin migraciones ni escrituras de datos.
- Sin cambios de reglas.
- Requiere prueba runtime en Foundry V14 + CSB 6.x.
