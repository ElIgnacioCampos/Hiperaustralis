# Auditoría de dependencias de assets — Items actuales
Fecha: 2026-11-17
Rama: `work/native-compendia-pipeline`
Alcance: los 38 Items presentes en el árbol fuente actual. No representa todavía el inventario histórico completo de 135.

## Hallazgos comprobados

### Armas: 21 referencias sin autonomía demostrada

- Los 20 Items de `source/items/armas/` conservan `img` bajo `modules/hiperaustralis-rituales/assets/armas/`, según `manifests/armas-source-manifest.json`.
- El Item independiente `HipArm01PackA000` — Cuchillo de piedra — también usa la ruta heredada en `img` y en `flags.hiperaustralis-sheet.background`.
- El repositorio contiene `source/items/SOURCE_ITEMS_ARMAS_CORTE1_GITHUB.zip`, pero la existencia del ZIP no acredita que sus binarios hayan sido extraídos, cotejados y copiados al módulo nuevo.
- En el árbol de cambios del PR no hay directorio runtime `module/assets/armas/` ni un manifiesto de hashes de esos binarios.

**Estado:** 21 documentos con dependencia de ruta antigua; binarios de destino no acreditados. No reescribir rutas ni dar por resuelta la dependencia.

### Reliquias: 17 referencias con destino nuevo

- Los 16 Items de Reliquias usan rutas bajo `modules/hiperaustralis-compendios-prototype/assets/reliquias/`; la auditoría de la rama registra 16 WebP verificados por SHA-256 y restaurados por CI.
- Tokicura conserva su ruta propia y el archivo runtime `module/assets/reliquias/tokicura_256.webp`.
- Esta comprobación de assets no resuelve la colisión de identidad entre las 16 Reliquias recuperadas y sus 16 pares históricos: la comparación semántica sigue pendiente.

**Estado:** assets del lote actual acreditados por manifiesto/CI; autoridad entre versiones todavía pendiente.

## Brecha del validador

`validate_sources.py` comprueba estructura JSON, IDs, plantillas y campos de Actor/Journal. No inspecciona las rutas `img`, `flags.*.background`, referencias a módulos antiguos ni la existencia/hash de cada binario.

Por tanto, un `SOURCE_PASS` no certifica autonomía de assets. La compilación actual puede completar aunque los Items de Armas sigan apuntando al módulo anterior.

## Acciones requeridas

1. Extraer el ZIP de fuentes de Armas en un entorno de trabajo aislado.
2. Inventariar cada binario por ruta, tamaño, formato, dimensiones y SHA-256.
3. Cruzar los 20 assets con sus IDs de Item y con el Cuchillo de piedra independiente; no asignar por semejanza de nombre solamente.
4. Copiar únicamente binarios cotejados a `module/assets/armas/` y registrar el manifiesto.
5. Actualizar `img` y `flags.hiperaustralis-sheet.background` de forma determinista, preservando los payloads restantes.
6. Añadir validación que falle si queda una referencia a `modules/hiperaustralis-rituales/` o si una ruta runtime no existe/hash no coincide.
7. Repetir la auditoría sobre los 135 Items históricos cuando se recuperen sus JSON completos.

## Decisiones / Pendientes / Fuentes / Estado Maestro

**Decisiones:** no declarar autónomo el pack mientras existan referencias runtime a `hiperaustralis-rituales`; no modificar rutas antes de verificar binarios.

**Pendientes:** extracción y cotejo de los assets de Armas; comparación semántica de Reliquias; validador exhaustivo de assets; ampliación al corpus histórico.

**Fuentes:** `source/items/01_cuchillo_piedra.json`, `source/items/armas/`, `manifests/armas-source-manifest.json`, `manifests/reliquias-assets.json`, `TRANSFER_MANIFEST.json`, `validate_sources.py`, `docs/CHECKPOINT_ASSET_CROSSWALK_2026-11-14.md`.

**Estado Maestro:** sin cambios.
