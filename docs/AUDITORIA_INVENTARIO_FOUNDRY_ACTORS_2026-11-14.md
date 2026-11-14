# Auditoría de inventario Foundry — Actors

Fecha: 2026-11-14  
Fuente: `HIPERAUSTRALIS_FOUNDRY_ACTORS_2026-11-14T18-19-48-819Z.json`  
SHA-256: `ccbfea38e96b075cf236ca676b4cfd6b4862576fd4cc97646ac63dad703a1e11`  
Mundo: `Hipera 5` · Foundry V14.367 · CSB 6.0.2  
Rama: `work/native-compendia-pipeline`

## 1. Resultado de exportación

- 176 documentos Actor exportados.
- 104 documentos del mundo.
- 72 documentos de compendios.
- 170 Items embebidos, todos de tipo `equippableItem`.
- 11 Actors contienen Items embebidos.
- 3 carpetas Actor en el mundo.
- Errores de exportación: 0.
- Compendios incluidos:
  - `world.hiperaustralais-personajes`: 4.
  - `world.hiperaustralais-adversarios-mapuche`: 20.
  - `world.hiperaustralais-bestiario`: 48.

El total 176 cuenta documentos en sus respectivos ámbitos. No debe tratarse como 176 identidades independientes sin cruzar IDs, UUID y procedencia.

## 2. Carpetas observadas

### Mundo

| Ruta | Actors |
|---|---:|
| Hiperaustralis · Bestiario | 43 |
| Hiperaustralis · Bestiario/Mascotas | 11 |
| Hiperaustralis · Bestiario/Familiares Exóticos | 8 |
| Sin carpeta | 42 |
| **Total** | **104** |

Las tres carpetas existentes forman una jerarquía parcial de Bestiario. Los 42 documentos sin carpeta incluyen fichas, plantillas y actores de distintos usos; no se deben clasificar por nombre sin revisar su función.

### Compendios

- Bestiario: 30 sin carpeta, 8 en Familiares Exóticos y 10 en Mascotas.
- Adversarios Mapuche: 16 sin carpeta y 4 en Culturas.
- Personajes: 4 sin carpeta.

Las carpetas internas de compendio no equivalen a las carpetas del mundo. El exportador preserva ambas rutas por separado.

## 3. Cruces de identidad entre mundo y compendios

Se detectan 11 pares con el mismo `documentId` en mundo y compendio:

- 10 actores de Mascotas.
- Kren.

### Mascotas

Los 10 pares tienen el mismo contenido documental salvo metadatos `_stats`. Son copias de un mismo registro lógico en dos ámbitos, pero conservan UUID distintos. No deben contarse como entidades nuevas ni deduplicarse destructivamente.

### Kren

El Actor del mundo y el del compendio `world.hiperaustralais-personajes` comparten `documentId`, pero **no son equivalentes**: difieren en plantilla CSB, versión de plantilla, campos de sistema, equipamiento y cantidad de Items embebidos (2 en mundo, 0 en compendio). Se conservan como dos versiones con procedencia distinta hasta decidir cuál es autoridad. No sobrescribir ni deduplicar.

## 4. Items embebidos

Los 170 Items embebidos pertenecen a 11 Actors. La mayor parte está concentrada en fichas de PJ o pruebas del mundo; todos son `equippableItem`.

No se deben migrar automáticamente como Items autónomos: primero hay que determinar si son equipo particular de una ficha, copias de documentos del compendio o registros independientes. El export de Items separado sigue siendo la fuente para el inventario general de Items.

## 5. Turianos

No aparece ningún Actor con nombre o identificación TUR-01…TUR-04 en esta exportación. Por tanto, el cruce anterior de assets TUR-01…TUR-04 no queda resuelto como identidad Actor de Foundry. No se asignan IDs por semejanza ni se crean fichas por inferencia.

## 6. Implicaciones para la migración

1. Mantener separados mundo, compendios y documentos embebidos mediante `sourceScope`, `sourcePack`, `documentId` y UUID.
2. Resolver Kren antes de elegir una fuente canónica.
3. Revisar los 42 Actors del mundo sin carpeta y decidir cuáles son fichas activas, plantillas, pruebas o candidatos a compendio.
4. Preservar las carpetas de Bestiario existentes como evidencia de organización actual, no como taxonomía definitiva.
5. No incorporar los 170 Items embebidos al pack de Objetos sin cotejo de identidad y procedencia.
6. Mantener pendiente el cruce TUR-01…TUR-04 con los assets y las fuentes originales.

## 7. Estado y salvaguardas

- Exportación íntegra, sin errores.
- No se modificó el mundo Foundry ni sus documentos.
- No se modificó `main`, no se fusionó PR #1 ni se desplegó en Forge.
- No se modificó el Estado Maestro.

## Decisiones / Pendientes / Fuentes / Estado Maestro

### Decisiones
- El export actual de Actors es la evidencia primaria para IDs, UUID, carpetas y contenido embebido.
- Las coincidencias de ID entre mundo y compendios no autorizan deduplicación automática.
- Kren queda marcado como conflicto de versión.

### Pendientes
- Resolver la autoridad de Kren.
- Clasificar los 42 Actors del mundo sin carpeta.
- Cotejar TUR-01…TUR-04 con fuentes y assets.
- Determinar el destino de los Items embebidos sin duplicar el corpus autónomo.

### Fuentes
- Export de Actors indicado al inicio.
- `docs/AUDITORIA_INVENTARIO_FOUNDRY_2026-11-14.md`.
- `docs/CHECKPOINT_NATIVE_ITEM_FOLDERS_2026-11-14.md`.

### Estado Maestro
- Ningún cambio solicitado ni realizado. Este informe registra evidencia técnica de la rama de trabajo.
