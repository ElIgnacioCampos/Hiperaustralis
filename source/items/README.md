# Pipeline de compendios y assets

Rama de trabajo: `work/native-compendia-pipeline`

## Estado del lote de Items incorporado
- 38 Items disponibles en `source/items/`: 21 clasificados como armas y 17 como reliquias.
- Armas: 20 registros recuperados en `armas/` más el Item raíz `01_cuchillo_piedra.json`; ambos conservan sus IDs originales.
- Reliquias: 8 cotidianas, 8 legendarias recuperadas del JSON monolítico y Tokicura como registro independiente (legendaria).
- Los 16 Items recuperados del JSON monolítico conservan sus IDs, nombres, texto, flags e imágenes.
- Tokicura conserva el ID `TokicuraRel0001` y su fuente independiente `reliquias/tokicura.json`.

## Organización interna del compendio
La preparación Foundry CLI genera una jerarquía nativa dentro de `ha-proto-items`:
```
Armas/
Reliquias/
  Cotidianas/
  Legendarias/
```
La asignación se aplica durante la preparación del build; los JSON canónicos conservan `folder: null`. Las reglas se validan mediante un manifiesto temporal y round-trip de Foundry CLI. Las carpetas fuente del repositorio no se confunden con carpetas internas del compendio.

## Assets de Reliquias
- Los 16 WebP fuente están verificados por SHA-256 en `manifests/reliquias-assets.json`.
- CI restaura los 16 recursos bajo `module/assets/reliquias/{legendarias,cotidianas}/`.
- Las rutas runtime de los 16 Items y de Tokicura apuntan al módulo independiente `hiperaustralis-compendios-prototype`.
- Tokicura usa el recurso ya existente `assets/reliquias/tokicura_256.webp`; no forma parte del lote de 16 WebP.

## Migración histórica pendiente
- El inventario histórico documenta 135 Items distribuidos en ocho carpetas raíz.
- El árbol Git aún no contiene los 135 documentos completos; no declarar migrado el corpus histórico.
- Defensas, Equipo común, Instrumentos musicales, Parafernalia/sanación/cultura material y Rituales siguen pendientes de incorporación y cotejo.
- No crear carpetas con documentos ficticios ni clasificar por nombre cuando falta evidencia de fuente.

## Validación
- `validate_sources.py`: estructura y plantillas de los documentos fuente.
- `prepare_sources.py`: transporte Foundry CLI y jerarquía determinista de carpetas.
- `validate_compiled.py`: IDs, nombres, páginas, carpetas y referencias de carpeta tras round-trip.
- CI valida además el inventario y SHA-256 de los 16 WebP.
- CI no sustituye la prueba runtime en mundo aislado de Foundry/Forge.

No modificar `main`, el módulo estable ni MELIAZ Bridge. No instalar sobre el mundo productivo.
