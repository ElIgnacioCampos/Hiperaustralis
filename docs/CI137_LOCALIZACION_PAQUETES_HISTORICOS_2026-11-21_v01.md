# CI137 — Localización de los paquetes históricos de staging

Fecha: 2026-11-21. Rama aislada: `work/ci137-ensayo-identidad-historica-20261121`.

## Fuente histórica acreditada

El checkpoint `CHECKPOINT_CORE_GITHUB_FOUNDRY_INVENTARIO_2026-11-18.md` (actualizaciones v04–v09) documenta el staging con **96 WebP**: 20 Armas, 59 recursos de cinco familias y 17 de Reliquias (Tokicura incluido). `verify_staging_v02.py` alcanzó 141/143 referencias internas y 137/137 IDs. No equivale a una compilación Foundry real.

## Paquetes exactos buscados

- `CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip`
- `CORE_FOUNDRY_ARMAS20_IDENTIDAD_RELIQUIAS16_20261118_v01.zip`
- `CORE_FOUNDRY_MIGRACION_STAGING_99_20261118_v01.zip`
- `CORE_FOUNDRY_CI137_HISTORICO_RELIQUIAS_ALTERNATIVA_20261118_v01.zip`

## Resultado de localización

1. Búsqueda por nombre exacto en Biblioteca: se recuperaron los checkpoints textuales, **no** los ZIP binarios en los resultados de búsqueda.
2. Google Drive: búsquedas de nombres exactos abreviados `CORE_FOUNDRY_CI137_STAGING_INTEGRADO`, `CORE_FOUNDRY_ARMAS20_IDENTIDAD_RELIQUIAS16`, `CORE_FOUNDRY_MIGRACION_STAGING_99` y `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB`: cero coincidencias. También se probó `CI137` y `ARMAS20`: cero.
3. GitHub: el árbol de la rama CI137 contiene 69 WebP de staging, ZIP de 16 Reliquias y Tokicura. El ZIP de Armas versionado contiene JSON, **no imágenes** (auditoría GitHub 17-11). La lectura de la colección de runs de Actions funcionó, pero la consulta directa de la colección de artefactos no fue aceptada por el conector; **no** se verificó descarga del staging 96.
4. No se han transferido los binarios de staging histórico a GitHub. No se ha obtenido ni recalculado SHA-256 binario de los 96 desde la fuente original durante esta revisión.

## Dictamen

**RECUPERACIÓN HISTÓRICA ACREDITADA POR CHECKPOINT; UBICACIÓN DE LOS ZIP DE STAGING TODAVÍA NO ACREDITADA EN LAS FUENTES EXAMINADAS.**

La disponibilidad pretérita de 96 WebP no significa que sus bytes estén actualmente en GitHub. Los 70 WebP del manifiesto de transferencia no son un sustituto automático de las 96 imágenes del staging histórico.

## Próximas acciones

- Continuar búsqueda por inventarios de Biblioteca, archivos anexos históricos o copia persistente con el SHA de los ZIP. Una referencia textual no basta para transferir.
- Si aparece paquete, verificar inventario, hashes, familias, duplicados y correspondencia por `_id` antes de incorporar a la rama.
- Resolver por separado `01_cuchillo_piedra.webp`, ARM-11–13, identidad de Reliquias, plantillas CSB/UUID y QA real.
- No recrear 96 imágenes, no cambiar ninguna referencia a un candidato léxico, no ejecutar build CI137 ni migración.

## Decisiones / Pendientes / Fuentes / Maestro

**Decisiones:** impedir regeneración y reasignación sin fuente acreditada; preservar los 137 JSON históricos y sus variantes.  
**Pendientes:** ubicación binaria del staging 96; cuatro puertas de CI137; CLI y QA aislado.  
**Fuentes:** checkpoint de 18–19/11, árbol GitHub CI137, auditoría GitHub de Armas del 17/11, resultados de Biblioteca y Drive.  
**Estado Maestro, main, Bridge, Foundry y Forge:** ninguno modificado.
