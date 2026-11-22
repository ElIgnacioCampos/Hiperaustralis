# CI137 — Rectificación de continuidad de assets (21-11-2026)

**Fuente histórica recuperada:** `CHECKPOINT_CORE_GITHUB_FOUNDRY_INVENTARIO_2026-11-18.md` (actualizaciones v04–v09, especialmente v07–v09).

## Corrección del diagnóstico
Las matrices GitHub v01–v04 cruzan exclusivamente los assets presentes en el árbol GitHub, especialmente los 69 WebP del staging y el ZIP de Reliquias. Su estado `NO_LEXICAL_CANDIDATE` **no** prueba ausencia del recurso gráfico en la continuidad del proyecto.

El trabajo anterior había recuperado y validado **96 WebP** en staging local:
- **20** Armas históricas, hashes coincidentes con respaldo 0.4.75;
- **59** WebP únicos de las cinco familias;
- **17** Reliquias, incluido Tokicura, derivados del artefacto CI112.

El conjunto CI137 staging v02 ya había pasado **137 Items, 9 carpetas, 137 claves**, con **141/143 rutas internas resueltas**. Las únicas dos referencias heredadas correspondían al `HipArm01PackA000` (Cuchillo de piedra, recurso `01_cuchillo_piedra.webp`). Las versiones ARM-11–13 aún requieren aprobación gráfica.

## Implicación
- No regenerar ni recrear los 96 recursos históricos recuperados.
- No promover por parecido de nombre los 25 candidatos léxicos.
- Antes de la prueba visual, localizar los paquetes ya producidos: `CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip`, `CORE_FOUNDRY_ARMAS20_IDENTIDAD_RELIQUIAS16_20261118_v01.zip`, `CORE_FOUNDRY_MIGRACION_STAGING_99_20261118_v01.zip`.
- Incorporar a la rama aislada solo los archivos/crosswalk procedentes de esos paquetes, verificando hashes y evitando duplicar binarios.
- Cuchillo de piedra no se rellena con Cuchillo lítico.
- No modificar `main`, Bridge, Foundry, Forge ni Estado Maestro. No compilar hasta CLI oficial y compatibilidad CSB.

## Pendientes auténticos
1. Reconciliar staging previo con GitHub CI137 (sha de cada uno de los 96, sin duplicados).
2. Recuperar `01_cuchillo_piedra.webp` independiente.
3. Confirmar la gráfica final de ARM-11–13.
4. Resolver IDs históricos de 16 Reliquias y crosswalk UUID.
5. Compilar ambas variantes bajo Foundry CLI y probarlas en mundo aislado V14.367/CSB6.1.2.

**Estado:** RECTIFICACIÓN DOCUMENTAL; no se afirma transferencia del staging local a GitHub ni QA runtime.
