# Backlog editorial — auditoría de fichas Hiperaustralis

Estado: PENDIENTE. No aplicar cambios hasta ejecutar una auditoría transversal y revisar sus resultados.

## Criterio: encabezados redundantes de descripción

- Detectar etiquetas visibles como «Descripción» cuando el bloque ya es inequívocamente descriptivo por su posición, contenido o contexto de ficha.
- Preferir mostrar directamente el texto descriptivo sin encabezado redundante.
- Conservar etiquetas cuando distingan campos funcionalmente diferentes o eviten ambigüedad.
- Revisar Items, armas, objetos, criaturas, rivales, personajes, fauna, flora y demás fichas que utilicen plantillas.
- Distinguir entre la clave técnica del campo (por ejemplo, `descripcion`) y la etiqueta visible: la clave interna puede ser necesaria para compatibilidad aunque se elimine el rótulo redundante.
- No renombrar claves internas, propiedades ni IDs como parte de una corrección puramente editorial.
- No alterar mecánicas, valores, descripciones canónicas ni plantillas sin evidencia y aprobación.

## Procedimiento de auditoría

1. Inventariar las plantillas y campos visibles.
2. Identificar rótulos redundantes y posibles excepciones.
3. Preparar una matriz por plantilla/documento con propuesta de cambio.
4. Comprobar compatibilidad con Custom System Builder y Foundry V14.
5. Aplicar cambios sólo después de revisar la matriz.
6. Compilar packs, ejecutar validaciones y probar fichas en un mundo aislado.

## Registro inicial

- Observación: el rótulo «Descripción» resulta redundante en fichas donde el bloque es inequívocamente descriptivo.
- Alcance: auditoría transversal, no sólo el Item Cuchillo de piedra ni el Actor Ladrón oportunista.
- Estado: pendiente; no se ha modificado ninguna ficha por esta observación.
