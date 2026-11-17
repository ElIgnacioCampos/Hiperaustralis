# MELIAZ Bridge 0.24.203

Paquete de integración para Foundry VTT V14 y Custom System Builder 6.x.

## Contenido de ejecución
- `module.json`: manifiesto Foundry; ID `meliaz-bridge`; versión `0.24.203`.
- `bridge.js`: lógica de integración y renderizado Kona.
- `kona-token-icons.js`: registro de iconos PJ.
- `assets/placa-hiperaustralis-aprobada.png`: recurso de interfaz.
- `assets/hoja-kona-experimental-v2.webp`: fondo de hoja Kona.
- `assets/kona-token-icons/PJ-001.webp` a `PJ-040.webp`: iconos referenciados por el módulo.

## Exclusiones temporales
No se trasladan en esta migración los grupos de familiares exóticos, mascotas, originales PNG de tokens, PJ-041 a PJ-052, el fondo Kona anterior ni el archivo fuente de animalitos. Permanecen en la rama de recuperación; su exclusión no implica eliminación ni descarte.

## Instalación
Instalar el ZIP generado por GitHub Actions en un mundo de prueba. No actualizar el mundo productivo hasta completar el QA runtime documentado en `QA_RUNTIME_0.24.203_FORGE.md`.
