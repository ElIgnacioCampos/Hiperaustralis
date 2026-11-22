# CORE / GitHub–Foundry — recuperación comprobada de assets Armas (18-11-2026)

## Estado y límites
- Rama: `work/native-compendia-pipeline`; PR #1 sigue en borrador.
- No se modifica `main`, Forge productivo, MELIAZ Bridge ni el Estado Maestro.
- El backup histórico es fuente de imágenes, **no** un sustituto de los JSON Foundry actuales ni una release V14.
- Mantener Territorios fuera del lote de migración actual.
- No promover iconos antiguos sobre las armas revisadas posteriormente (especialmente ARM-11–13) sin cotejo editorial.

## Recuperación binaria comprobada
- Archivo original: `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip` recuperado de Drive.
- Tamaño exacto: 33.028.294 bytes.
- SHA-256: `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`, **coincide** con el registro histórico.
- ZIP: **358 entradas, CRC correcto, 310 WebP**.
- Manifiesto interno del módulo: versión **0.4.74**; Foundry 13, CSB 5.2.1. No instalarlo como V14.
- `assets/armas/`: **20 WebP originales**, 265.488 bytes descomprimidos, cada uno 512×512 y formato RGB (sin canal alfa).
- Cruce contra `manifests/armas-source-manifest.json` actual: **20/20 rutas `img` exactas** tienen archivo homónimo en el ZIP.
- Los IDs de `data/armas.json` antiguo NO se toman como autoridad frente a los IDs del export Foundry 2026-11-11; se rescatan sólo binarios e identificación de rutas.
- Existen además 8 Defensas, 40 Equipo, 21 Instrumentos, 16 Reliquias y 8 Rituales como JSON de instalador; esto **no acredita** la recuperación del export histórico de los 135 Items. Parafernalia (22) no tiene lote JSON independiente en este ZIP.

## Desbloqueado / no desbloqueado
- **Desbloqueado:** recuperación verificable de los 20 archivos visuales de Armas; archivo local de staging con hashes por imagen.
- **Pendiente:** revisión frente a los WebP finales más recientes; su publicación en `module/assets/armas/`; reescritura determinista de rutas en copias de transporte; hash de cada binario en CI.
- **Pendiente:** incorporación de los 135 Items históricos (incluidos 22 de Parafernalia), reconciliación semántica de 16 pares de Reliquias, QA de Forge.
- No marcar el módulo como autónomo hasta validar referencias de `img` y `flags.hiperaustralis-sheet.background` en runtime.

## Fauna L01 en paralelo (sin mezcla con Territorios)
- Kit local recibido FAU-033–036: auditoría y copia de prueba de cuatro Items completos. 6 tests simulados PASS con Node 22.
- **Cero importaciones reales acreditadas**, nunca ejecutar APPLY en `hipera-5`.
- Territorios y Rivales fuera de ese kit.

## Evidencia de CI vigente
- Native Compendia #112: https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44162907021 — SUCCESS, 38 Items fixture.
- MELIAZ Bridge #4: https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44146169636 — SUCCESS, versión 0.24.203; QA A–F en Forge pendiente.

## Próximos pasos
1. Comparar imágenes Armas del instalador con el lote gráfico más reciente antes de promover.
2. Validar hashes, IDs y referencias `img`/background, sin alterar originales.
3. Compilar desde GitHub, QA en mundo de prueba Forge V14/CSB6, conservar PR como draft hasta PASS.
4. Recuperar/reexportar inventario de 135 para migración semántica completa.

**Estado Maestro:** sin cambios. **Producción:** sin cambios. **Estatuto:** auditoría técnica, NO aprobación de assets.
