# CI137 · Reliquias históricas — variante de identidad aislada

**Estado:** FUENTES CANDIDATAS / NO COMPILADO / NO PUBLICABLE. Corte 21-11-2026.

Este bloque contiene los **16 documentos originales sin normalización del payload**, recuperados del export de Hipera 5. La rama también hereda los 99 históricos de las otras cinco familias, sin modificar sus JSON.

## Comparación
- 20 Armas originales ya existen en `source/items/armas/`.
- 99 originales adicionales viven en `source-pending/ci137-historicos-99/`.
- 16 Reliquias originales están en este directorio (8 cotidianas, 8 legendarias).
- 2 Items adicionales de CI112 siguen siendo Cuchillo de piedra y Tokicura.
- La prueba alternativa de **137 Items** se forma seleccionando los 135 IDs históricos más los 2 extras. El presente commit **no realiza ese ensamblado**.
- Las 16 Reliquias vigentes del prototipo continúan intactas en `source/items/reliquias-*/`; el manifiesto conserva su crosswalk. No fusionar identidades por nombre.

## Bloqueos de promoción
No adjudicar autoridad editorial ni conservar UUID externos por suponer que el `_id` basta: la ruta `Compendium.world.hiperaustralis-rituales` cambia al distribuir en el módulo nuevo. Las imágenes aún apuntan al módulo legado; usar el staging de 96 WebP ya preparado, tras verificar SHA y aprobaciones ARM-11–13. La imagen independiente de Cuchillo de piedra sigue ausente. Falta CI137 y QA runtime real.

**Seguridad:** no tocar `main`, la rama prototipo, Bridge, Forge, mundos Foundry, Estado Maestro ni contenido aprobado. No compilar/publicar desde esta rama sin resolver los bloqueos.
