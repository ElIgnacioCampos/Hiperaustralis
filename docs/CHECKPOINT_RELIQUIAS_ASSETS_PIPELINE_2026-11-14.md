# Checkpoint — Assets de Reliquias incorporados al pipeline

Fecha: 2026-11-14  
Proyecto: Hiperaustralis — compendios nativos Foundry V14  
Rama: `work/native-compendia-pipeline`  
HEAD: `f81d9a2b7520854e7b01706ad9f935825ae0777d`

## Decisiones

- El ZIP de transferencia se conserva sin renombrar ni descomprimir manualmente en GitHub.
- La fuente binaria queda archivada en `source-original/HIPERAUSTRALIS_RELIQUIAS_ASSETS_16_WEBP_v01.zip`.
- El pipeline restaura los WebP durante CI, verifica inventario y SHA-256 contra `manifests/reliquias-assets.json`, y los incorpora al paquete del módulo.
- Los destinos de runtime son:
  - `module/assets/reliquias/legendarias/`
  - `module/assets/reliquias/cotidianas/`
- Los 16 Items fuente actualizan `img` y `flags.hiperaustralis-sheet.background` a `modules/hiperaustralis-compendios-prototype/assets/reliquias/<grupo>/<archivo>`.
- Tokicura queda excluida de este lote.

## Evidencia

- ZIP fuente en GitHub: blob `345e336501078711b548c7f597fcc08f792ba82b`, 1.174.756 bytes.
- Inventario: 16 WebP; 8 legendarias y 8 cotidianas.
- CI #98: SUCCESS — https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/43610601819
- Paso `Restore and verify 16 relic WebP assets`: SUCCESS.
- Validación de fuentes, compilación CLI y round-trip de packs: SUCCESS.
- Artefacto: `HIPERAUSTRALIS_COMPENDIOS_PROTO_NATIVO_v0.1.5`
- Artifact ID: `14120490186`
- SHA-256: `77bfa7da9c8b07d115640ae0a5c3952b4c065300a59f5f51353e5ca1d82c76d3`
- Tamaño: 4.925.115 bytes.

## Pendientes

- QA visual y funcional en un mundo de prueba Foundry V14 + CSB 6.0.2.
- Verificar carga de imágenes en ficha, compendio y hoja.
- Revisar el único commit de diferencia entre `main` y la rama antes de cualquier integración.

## Fuentes

- ZIP de transferencia en `source-original/`.
- `manifests/reliquias-assets.json`.
- 16 JSON en `source/items/reliquias-legendarias/` y `source/items/reliquias-cotidianas/`.
- Workflow `.github/workflows/compile-native-packs.yml`.
- CI #98 y artefacto indicados arriba.

## Cambios al Estado Maestro

Ninguno. Este checkpoint documenta el avance de la rama de trabajo; no modifica el Estado Maestro ni integra cambios en `main`.

## Estado de seguridad

- PR #1 abierto, draft y sin merge.
- `main` intacta por este trabajo.
- Módulo productivo y MELIAZ Bridge sin cambios.
