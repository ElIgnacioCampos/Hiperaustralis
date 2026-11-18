# Plantillas operativas exportadas de Foundry

**Procedencia:** exportaciones JSON entregadas por el usuario desde la instalación actual de Foundry.  
**Fecha de incorporación al repositorio:** 2026-11-13.  
**Estado declarado:** las ocho plantillas son las que se utilizan actualmente en Foundry.

## Alcance y cautelas

- Estos archivos conservan las exportaciones recibidas; no se normalizan ni se reescriben como esquema.
- Son fixtures de referencia operativa para cotejar Items y comportamiento del Bridge.
- No se presume que sean la última evolución posible de cada documento: cualquier archivo posterior con procedencia verificable debe compararse y sus cambios preservarse.
- No convertir estas plantillas en reglas de validación normativa sin una revisión posterior.
- No inferir carpetas de Items desde `folder: null` en estas plantillas.
- La versión de Custom System Builder indicada en los JSON es 6.0.2; no equivale por sí sola a una versión del diseño editorial o del contrato de datos.

## Inventario

| Familia | ID | templateSystemUniqueVersion | Campos en system.body |
|---|---|---:|---:|
| Arma | `HipArmaTpl000001` | 186001 | 1 |
| Bioma | `HipBiomaTpl00001` | 201003 | 4 |
| Equipo | `HipEquipTpl00001` | 191001 | 2 |
| Fauna | `HipFaunaTpl00001` | 201002 | 4 |
| Flora | `HipFloraTpl00001` | 201001 | 4 |
| Instrumento | `HipInstrTpl00001` | 191001 | 2 |
| Reliquia | `HipRelqTpl000001` | 172001 | 4 |
| Ritual | `HipRitualTpl0001` | 166001 | 4 |

Los IDs, versiones y conteos describen exactamente las exportaciones incorporadas; no establecen precedencia frente a documentos posteriores.
