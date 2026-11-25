# CI137 — QA8 autónomo · 25-11-2026
## Decisiones
- Autor pide consolidación efectiva sin más parches testimoniales. QA7 activo según captura, discrepancia Piloilo reportada. Yapo y chop chop eran expresiones coloquiales, NO Items; rectificación explícita del autor.
- Conservar pipeline QA5/QA7, 136 IDs, 9 carpetas, tres packs, 48 WebP de QA7 y sus enlaces aprobados. No confundir archivos nuevos aprobados con imágenes históricas cuya ruta depende del legado.
- QA8 es transporte de 68 WebP históricos exactos ya referenciados por las fichas, no remapeo editorial a obra distinta ni aprobación visual nueva. Cambia sólo 95 rutas img/background legadas a assets/historico/, sin re-encode. No modificar fuente original, Maestro, Forge ni mundos.
## Implementación
- tools/foundry/ci137_qa8_autonomo.py commit bdb22d5cd3b1ebd97bc35ac9eb0af111b39fca03; workflow ad209d651af4204b43586f2bf1c1e15fda8e6552. Reusa qa7.overlay, qa7.package, QA5 preparación/guard IDs/CLI 3.0.5, exactos SHA y WebP decodificado, readback de los tres packs. Verifica reversión exacta de las rutas en copia de cada documento y cero referencias legadas de img/background.
- Objetivo verificable: 136 Items, 116 WebP (48 + 68), 95 referencias reubicadas, 0 dependencias legacy en esos campos. Run 45662067489 pendiente al registrar.
## Pendientes
- D3 runtime y discrepancia Piloilo: no declarar resuelta por transportar imágenes históricas; comparar URL servida y copia de Item si persiste. No automatizar reescritura de Items incrustados.
- Defensas 9 nuevas, catálogo v02 exacto y Tañaña; 11 instrumentos con sólo cruce nominal, 9 Equipo candidatos no promovidos; recuperar aprobaciones concretas. No generar ni inventar fichas.
- Mascota/Familiar escena en frente separado; Territorios/Recetas/FFF/Habitantes pendientes.
## Fuentes
QA7 checkpoint 961e327fd78ed305e8797ad96d5f425983398fa8; lectura de ZIP QA5/QA7; manifiesto ci137-selected-source-137-historical-ids.json y 79 WebP verificados en ci137_pipeline.py. Ninguna modificación al Maestro ACTUAL.
