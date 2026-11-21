# CI137 · 99 Items históricos fuera de compilación — 21-11-2026

Estado: **STAGING VERIFICABLE / NO RUNTIME**. Este bloque no se incluye en `source/items/` ni en el ZIP construido actualmente. No declara autonomía, equivalencia de imágenes ni QA Foundry.

Origen exacto: export íntegro `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`, 593 Items; SHA-256 del export según checkpoint: `54bb7ff326e66cb4ae9a31f472f9883d21f29dfd6d1cf6e6124a2a642f27c2ef`. Scope: `world.hiperaustralis-rituales`, 135 documentos.
- 20 Armas: ya están en `source/items/armas/`; no duplicadas.
- 16 Reliquias: ya están en el prototipo, con **IDs distintos** a la fuente histórica; no se elige autoridad ni se fusionan.
- 99 Items históricos: 8 Defensas, 40 Equipo común, 21 Instrumentos musicales, 22 Parafernalia y 8 Rituales. Sus payloads nativos originales se guardan aquí por `_id`, sin normalizar campos, `img`, flags ni `_stats`.
- 2 Items extra del prototipo (Cuchillo de piedra y Tokicura): se mantienen separados.

Puertas pendientes para llevar a `source/items/` y compilar 137: reglas de carpeta para cinco familias, compatibilidad de cinco plantillas CSB, análisis de rutas gráficas y UUID, 2 referencias legadas del Cuchillo de piedra, ARM-11–13 y resolución de 16 Reliquias. No ejecutar instalador legado ni cambiar Territorios.

No tocar `main`, Forge/Foundry productivo, Bridge ni Estado Maestro. Este commit no modifica ningún archivo existente del prototipo.
