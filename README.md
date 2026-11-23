# Hiperaustralis — Prototipo de compendios nativos (CI137)

## ACTUAL
- [Checkpoint único CI137](docs/CI137_CHECKPOINT_UNICO_ACTUAL_2026-11-22.md) — fuente de continuidad técnica.
- **136 Items** seleccionados; D2 compila y realiza round-trip; **D3 cliente Foundry y publicación bloqueados**.
- Módulo independiente: `hiperaustralis-compendios-prototype`. No afecta a `main`, MELIAZ Bridge, Forge ni al módulo `hiperaustralis-rituales`.
- Fuente de identidades y decisiones: `manifests/ci137-selected-source-137-historical-ids.json`. Las fuentes originales JSON se conservan intactas.

## Rutas ordenadas
- `module/assets/`: **44 WebP** (20 Equipo común aprobado pendiente de enlace/QA; 16 Reliquias; Tokicura; Cuchillo de piedra; **6 Instrumentos ERH visualmente aprobados y ligados por seedId/SHA a la prueba CI137**). **Sin candidatos históricos.**
- `source-original/ci137-asset-staging/`: **148 WebP** preservados sin modificación: 79 CI137 históricos, 29 Equipo, 8 Defensas COM, 28 Instrumentos ERH y 4 Turianos. Seis ERH tienen copia idéntica en el módulo para transporte aislado; el resto sigue sin autorización de remapeo.
- `source-original/ci137-asset-staging/TRANSFER_MANIFEST_LEGACY_CI104.json`: manifiesto histórico original de importación; sus rutas son anteriores al traslado.
- `source-original/HIPERAUSTRALIS_RELIQUIAS_ASSETS_16_WEBP_v01.zip`: fuente aprobada de Reliquias necesaria para las pruebas.
- `source/`, `source-pending/`, `manifests/`: fuentes y evidencias. `tools/foundry/ci137_pipeline.py` + `.github/workflows/compile-ci137.yml`: única compilación aislada CI137, sin instalador.

## Iconos y contenidos por territorio
- `manifests/ci137-iconos-territoriales.json`: catálogo de ocho territorios (40 Flora con 45 referencias; 50 Fauna, 32 con Journal y 18 por cotejar). Funga y Recetas siguen diferenciados.
- El catálogo no sustituye archivos binarios ni crea Items. **Fuentes físicas recuperadas**: Fauna v2 (277 entradas) y compendio 0.4.73 (40 iconos Flora + 8 fondos; 31 rupestres FAU); **cinco iconos rupestres FAU aprobados fueron resguardados en `source-original/ci137-territorial/fau-approved/`; ninguno es todavía asset runtime**. Cinco FAU aprobados tienen WebP válido recuperado; FAU-003 aprobada conserva un WebP vacío en la auditoría v2 y exige cotejo. Flora final 0.4.75 y BIO-RUP siguen pendientes. Figuras documentales del Journal ≠ iconos de Items.
- El workflow CI137 valida identidad y referencias del catálogo sin modificar los 136 Items ni publicar el módulo.

## Salvaguardas
- [Respaldo completo anterior a limpieza](https://github.com/ElIgnacioCampos/Hiperaustralis/tree/backup/ci137-prelimpieza-20261123): `feafa4ac62cacf2c1a327afd1de57d461d074a43`.
- Importador CI137 de una sola ejecución, su workflow y matrices v01–v04 quedan solo en ese respaldo; v05 y checkpoint ACTUAL continúan aquí.
- No regenerar, reasignar ni promover candidatos de staging por nombre o parecido. Exigir vinculación exacta por ID y SHA, y aprobación gráfica, antes de integrar.
