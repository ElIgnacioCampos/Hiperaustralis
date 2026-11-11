# Fuente canónica de Items — migración en curso

Destino Foundry: pack único `hiperaustralis-objetos` (tipo `Item`).

El pack histórico `world.hiperaustralis-rituales` contiene ocho carpetas raíz y 135 Items. La distribución por carpeta y las reglas de preservación están documentadas en [MIGRACION_ITEMS_PACK_AUTONOMO_v01.md](../../docs/MIGRACION_ITEMS_PACK_AUTONOMO_v01.md).

## Carpetas de fuente

- `armas/` — 20 documentos
- `defensas/` — 8 documentos
- `equipo-comun/` — 40 documentos
- `instrumentos-musicales/` — 21 documentos
- `parafernalia-sanacion-cultura-material/` — 22 documentos
- `reliquias-cotidianas/` — 8 documentos
- `reliquias-legendarias/` — 8 documentos
- `rituales/` — 8 documentos

## Reglas

- Un JSON por documento Foundry, con su `_id` original.
- Los JSON fuente deben preservar el payload nativo íntegro.
- La ruta de carpeta se convierte en jerarquía Foundry durante el build; no se altera la identidad del documento.
- Los campos de transporte requeridos por Foundry CLI se generan sólo en una copia temporal.
- Los assets deben vivir en el módulo nuevo y resolverse sin el módulo histórico.
- No incluir documentos no aprobados ni fabricar equivalencias para completar categorías.

**Estado:** estructura de destino documentada; los 135 JSON y el inventario de assets todavía deben incorporarse y validarse en esta rama.
