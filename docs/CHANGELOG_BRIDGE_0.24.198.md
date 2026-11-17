# MELIAZ Bridge 0.24.198 — Kona stability (experimental)

Base: 0.24.197 STANDARD V14.

## Cambios
- Reconciliación incremental de celdas en los grids Kona; conserva nodos exteriores cuando la posición física no cambia.
- Grid de Equipo reconciliado por slot; conserva los cuatro centros/posiciones aprobados y los Items legacy ya asignados.
- Armas sólo se asignan al espacio Arma de Ñeque.
- Defensas sólo se asignan al espacio Armadura de Ñeque, sujeto a Oficio habilitado.
- Los cuatro espacios Equipo sólo reciben Items de tipo `equipo`.
- Se elimina la normalización persistente de Equipo durante montaje, drop y retirada contextual.
- Los Items legacy `arma`/`defensa` que ya tengan `equipoSlot` siguen visibles y recuperables; no se migran ni se borran.

## Compatibilidad
- No se cambian IDs, plantillas, propiedades CSB, imágenes ni flags existentes.
- No se modifican geometrías Kona, hitboxes, Cariños, Lenguas, Instrumentos, Territorio, Rituales o Reliquias.
- No se agrega ni elimina ningún campo CSB.

## QA
- `node --check bridge.js`: PASS.
- Pruebas estáticas de destinos, ausencia de llamadas a normalización y reconciliación: PASS.
- Integridad ZIP: PASS.
- Runtime Foundry V14 + CSB 6.x: PENDIENTE.
- Reproducción visual del parpadeo: PENDIENTE.

**Experimental; no aprobado para producción.**
