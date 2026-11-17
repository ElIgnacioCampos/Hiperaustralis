# MELIAZ Bridge 0.24.199

## Kona · limpieza de tooltips de Equipo
- Se eliminan únicamente los atributos `title` y `data-tooltip` cuyo texto sea exactamente `Equipo 1` a `Equipo 4`.
- Se conservan los cuatro slots, sus índices internos, flags, propiedades CSB, posiciones, dimensiones, iconos y lógica de arrastre.
- No se modifican nombres de Items ni tooltips de objetos concretos.
- Se mantiene íntegra la separación funcional Arma → Ñeque/Arma, Defensa → Ñeque/Armadura y Equipo → cuatro espacios de Equipo.

## Alcance de QA
- Validación estática y de integridad del paquete; no equivale a prueba runtime en Foundry V14.
