# MELIAZ Bridge 0.24.198 — Kona stability (experimental)

Base: 0.24.197 STANDARD V14.

## Cambios
- Reconciliación incremental de celdas en los grids Kona: conserva los nodos exteriores cuando la posición física no cambia, evitando vaciar y reconstruir el grid completo.
- Grid de Equipo reconciliado por slot; conserva los cuatro centros/posiciones aprobados y los Items legacy ya asignados.
- Armas sólo se asignan al espacio Arma de Ñeque.
- Defensas sólo se asignan al espacio Armadura de Ñeque, sujeto a Oficio habilitado.
- Los cuatro espacios Equipo sólo reciben Items de tipo `equipo`.
- Se elimina la normalización persistente de Equipo durante montaje, drop y retirada contextual.
- Los Items legacy `arma`/`defensa` que ya tengan `equipoSlot` siguen visibles y recuperables; no se migran ni se borran.

## Compatibilidad preservada
- No se cambian IDs de Items, plantillas, propiedades CSB, imágenes ni flags existentes.
- No se modifican las geometrías de Kona, hitboxes, Cariños, Lenguas, Instrumentos, Territorio, Rituales o Reliquias.
- No se agrega ni elimina ningún campo CSB.

## Estado de QA
- `node --check bridge.js`: PASS.
- Pruebas estáticas de destinos, ausencia de llamadas a normalización y reconciliación: PASS.
- Runtime Foundry V14 + CSB 6.x: PENDIENTE.
- No instalar en producción hasta completar runtime QA.
