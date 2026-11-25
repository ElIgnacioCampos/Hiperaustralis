# CI137 — QA7 acumulativo · 25-11-2026
## Base y decisión
QA5 funcional visible en captura 25-11; conservar ID hiperaustralis-compendios-prototype, 136 Items, 9 carpetas, tres packs. Rama aislada QA7 desde QA6 exacto 8517918e6356abcc0bf70af2a8c32c91485e6ca8. La confirmación autoral permite preparar candidato acumulativo, no desplegar ni sustituir globalmente QA5.
## Trabajo
- QA6 cuatro imágenes de Instrumentos aprobadas; conservar seis anteriores.
- QA29 overlay Biblioteca HIPERA_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_v01.zip físicamente recuperado; SHA256 867884cadc27b86216e5c8f91703a7d5c75c9bc2f6410e75db7fe605e8d54be6, 20/20 WebP SHA, tamaño y 256x256 RGBA verificados localmente. Los 20 también existen en module/assets/equipo-comun de rama QA6; pipeline coteja hashes antes de enlazar.
- 29 cruces = 20 arte aprobado + 9 sólo candidatos no autorizados. Los nueve siguen sin mutación; 11 otros Items conservan iconos base. No cambiar descripción Ckarisur sin fuente textual aprobada exacta.
- Script 0d8f8330c8abd6d771e4ecd45e777f27eed7a793: exige nombre, ID, tipo, plantilla, flags kind, carpeta y antiguo img de fuente exacta; comprueba cambio img exclusivo de 24 docs (4 instrumentos + 20 equipo), resto intacto, 136 IDs, 48 WebP ya incluidos en QA6. No alta de documentos nuevos. Compila y reabre tres LevelDB con CLI.
- Workflow a5b71a67853d6ee236930730b140a16c5d137e06, run 45549997993 en ejecución al escribir. No declarar PASS hasta resultado.
## Exclusiones pendientes
- 9 Defensas nuevas: catálogo corregido exacto y Tañaña pendientes, identidad casco/peto/coraza por cotejar; 8 históricas intactas.
- 9 imágenes de Equipo sólo candidatas requieren aprobación individual. 95 refs gráficas legadas permanecen (no contar 20 equipo como reducción de refs legadas: antes usaban iconos Foundry).
- Territorios, Flora/Fauna/Funga, Recetas, Habitantes/Adversarios, Quiebres, Códigos pendientes de corpus aprobado y contrato; no completar con invención.
- D3 runtime QA7; confirmar versión registrada de Bridge LAB, selector y compendio real antes de cualquier promoción. Mantener H6/H7/Forge, main, Maestro y QA5 intactos.
## Fuentes
docs/CI137_QA6_ERH4_D2_CHECKPOINT_2026-11-24.md; manifests/equipo-comun-29-cruces-candidatos-20261121.json; manifests/ci137-selected-source-137-historical-ids.json; QA29 overlay y sus QA/manifest_29.json y LEEME. Captura de usuario 25-11; matriz de defensas v02 en rama expansión. 
