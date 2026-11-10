# MELIAZ Bridge 0.24.200

## Kona — limpieza de montaje de Ñeque
- Se oculta preventivamente el bloque visual de Arma/Armadura mientras CSB reconstruye la hoja.
- Los dos destinos actuales se revelan sólo después de reconciliar sus nodos, contenido, estado de Oficio e iconos.
- En cada render CSB se invalida la marca de montaje anterior para evitar mostrar cajas de un ciclo previo.
- No se borran Items, flags, propiedades, asignaciones ni datos legacy.
- No se modifican geometría, hitboxes, drag-and-drop, Equipo ni otros sectores de Kona.

## Límite de validación
La corrección estática no demuestra por sí sola la desaparición del destello en Foundry V14 + CSB 6.x; requiere prueba runtime en mundo de laboratorio.
