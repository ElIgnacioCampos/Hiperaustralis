# Checkpoint — Jerarquía interna del pack de Objetos

Fecha: 2026-11-14  
Rama: `work/native-compendia-pipeline`  
Estado: compilación y round-trip aprobados; pendiente inspección visual final en Forge.

## Decisión de implementación
La estructura de carpetas internas del pack `ha-proto-items` se genera durante la preparación Foundry CLI. Los JSON canónicos mantienen `folder: null`; la asignación se realiza en el transporte temporal mediante reglas deterministas y un manifiesto temporal de carpetas.

## Estructura compilada
```
Armas/
Reliquias/
  Cotidianas/
  Legendarias/
```

## Asignación verificada
- Armas: 21 Items (20 del lote `armas/` y `01_cuchillo_piedra.json` en la raíz, clasificado por `system.props.hipera_tipo = arma`).
- Reliquias/Cotidianas: 8 Items.
- Reliquias/Legendarias: 9 Items (8 recuperados + Tokicura).
- Total: 38 Items.
- Tokicura permanece como fuente independiente y conserva `TokicuraRel0001`.

## Cambios técnicos
- `prepare_sources.py`: genera documentos Folder nativos `!folders!`, carpetas jerárquicas, asigna `folder` temporal a Items y emite `item-folder-manifest.json` para validación.
- `.github/workflows/compile-native-packs.yml`: compila Items con `--recursive`, desempaqueta con `--folders` y pasa el manifiesto temporal al validador.
- `validate_compiled.py`: verifica los 38 Items, IDs/nombres/páginas, cuatro carpetas, relaciones padre-hijo y asignación de cada Item.
- `source/items/README.md`: actualizado para reflejar el estado real y separar el lote disponible de la migración histórica de 135 Items.

## Evidencia CI
- Run #105: [CI — jerarquía de carpetas](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/43612771870)
- Estado: SUCCESS.
- SOURCE_PASS: éxito.
- Preparación de fuentes: éxito.
- Foundry CLI 3.0.5: compilación y desempaquetado con carpetas: éxito.
- ROUNDTRIP_PASS: éxito.
- ZIP de Foundry generado e íntegro.
- Artifact ID: `14120369854`.
- SHA-256 del ZIP interno de Foundry: `f60ff7b022de11d939c94fcaefdfa3113f4a5ebb59a56e163e8e88c2dfd76163`.
- ZIP interno: 4,938,064 bytes; 124 entradas; `module.json` presente.

## Límites y pendientes
- La jerarquía se ha comprobado en compilación y round-trip, no todavía visualmente en Forge.
- El pack histórico de 135 Items aún no está migrado completo. Defensas, Equipo común, Instrumentos musicales, Parafernalia/sanación/cultura material y Rituales siguen pendientes de incorporación.
- El Item raíz `01_cuchillo_piedra.json` se conserva como documento separado; no se fusionó con `Cuchillo lítico`.
- No se modificó `main`, no se fusionó PR #1, no se publicó release de prueba, no se tocó el módulo productivo ni MELIAZ Bridge.
- No se modificó el Estado Maestro.

## Siguiente paso
Instalar el ZIP nuevo en el entorno Forge de prueba y confirmar visualmente:
1. Armas como carpeta raíz.
2. Reliquias como carpeta raíz con Cotidianas y Legendarias anidadas.
3. Tokicura dentro de Legendarias.
4. Los 38 documentos siguen presentes y abren correctamente.
