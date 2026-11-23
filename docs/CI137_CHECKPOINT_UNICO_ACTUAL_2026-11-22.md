# HIPERAUSTRALIS · CI137 / CHECKPOINT ÚNICO ACTUAL
**Corte:** 22-11-2026 (Chile) · **Rama:** `work/ci137-ensayo-identidad-historica-20261121`
**Estado ACTUAL (23-11-2026, D2):** **136/136 Items PASS y remapeo autorizado condicionado PASS con nombre final Cuchillo de piedra**, 20 Armas, nueve carpetas, cinco plantillas; **115/115 WebP transferidos PASS**. **79/79 WebP históricos**, 30 SHA históricos, **17/17 candidatos ERH** y **8/8 COM aprobados** verificados físicamente en CI. **PF22/RIT08**: 30/30 identidades y SHA de los respaldos 0.4.72/0.4.73, ocho fondos rituales PASS; **igualdad de bytes 0.4.75 pendiente**. DEF08/INS21: 17 cruces nominales, 8 ambiguos, 4 sin pareja. Ningún remapeo nuevo; **105 referencias gráficas** por resolver editorialmente. D3/Foundry **NO ACREDITADO**; publicación **BLOQUEADA**.
**Autoridad:** Estado Maestro ACTUAL para canon; `manifests/ci137-selected-source-137-historical-ids.json` para las 136 identidades seleccionadas; este checkpoint para implementación técnica. Sin cambios al Maestro.

## LIMPIEZA DEL PROTOTIPO — STAGING SEGREGADO (23-11-2026)

Se creó respaldo exacto `backup/ci137-prelimpieza-20261123` en `feafa4ac62cacf2c1a327afd1de57d461d074a43`. Trasladados, por **SHA de Git Blob sin modificar bytes**, **148 WebP / 6.654.130 bytes** desde `module/assets/_staging/` a `source-original/ci137-asset-staging/`. `module/assets/` queda con los **38 WebP** operativos/aprobados existentes y ningún staging; los 20 Equipo aún esperan vinculación en Foundry.

El manifiesto original CI104 se conserva completo bajo `source-original/ci137-asset-staging/TRANSFER_MANIFEST_LEGACY_CI104.json` como documento histórico (contiene rutas de la época). Importador CI137 de ejecución única, workflow de transferencia y matrices v01–v04 retirados **solo de la rama actual**, recuperables íntegros del respaldo. Pipeline, workflow CI137, selección 136, 16 Reliquias, arte y fuentes originales permanecen íntegros. Se actualizan rutas operativas de scripts y manifiestos a la nueva ubicación **sin promover ninguna imagen**. Los documentos históricos antiguos conservan sus rutas históricas y deben leerse con este traslado. **D3 y publicación bloqueados. Reubicación CI: PASS**, [GitHub Actions #45244704053](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45244704053), commit `4fc15f624c63d62be4c1533a2d7bb0b0eb0486e3`: control de 38 assets runtime / 148 históricos, Python y pruebas sintéticas, 136 Items compilados/descompilados, puertas de identidad DEF/ERH y PF/RIT y release bloqueado. Guard de compendio [#45244704219](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45244704219): PASS.

## D2 — Transporte de arte final con aprobación explícita (23-11-2026)

**Cambio operativo sobre CI137 existente:** el pipeline deja de exigir que las **105 referencias heredadas** permanezcan fijas por diseño. Puede remapearlas **por lotes** sin crear un script ni módulo adicional, únicamente si cada Item incorpora en el manifiesto vigente `approvedAssetTransport` con: ID seleccionado, `originalImg` igual a fuente JSON, `status=FINAL_ART_APPROVED_FOR_CI137`, `visualIdentityApproved=true`, `approvedForTransport=true`, referencia de aprobación, `sourcePath` staging verificable, destino runtime seguro, SHA-256 exacto y declaración congruente sobre fondo CSB. Rechaza cualquier ausencia, colisión, alias o arte incompatible.

**Protección visual:** nunca reproduce ni transforma imágenes; copia byte por byte la final aprobada al output temporal. No modifica archivos JSON fuente. Se conservan las 16 Reliquias y el Cuchillo de piedra con sus rutas aprobadas. Los candidatos históricos de 0.4.72/0.4.73 con `finalArtApprovedForCI137=false` **no reciben aprobación por este cambio**; las matrices DEF/ERH y PF/RIT siguen siendo evidencia, no autorización.

**Situación de la rama — PASS:** **0 Item** tiene todavía `approvedAssetTransport` explícito; el transporte compiló **136/136** con **105 enlaces sin tocar**, **0 nuevos remapeos** y `releaseDecision=BLOCKED` en [GitHub Actions #45242850823](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45242850823), commit `ca18372121c2de750f37756b363715ff82c97be5`. La prueba **SINTÉTICA Y EFÍMERA** del mismo workflow verificó que una ruta/byte/hash correctos con aprobación explícita son aceptados y que falta de identidad visual aprobada o un SHA distinto causan bloqueo. **Esta prueba no aprueba ninguna ilustración real.** Una vez acreditada una aprobación real de versión gráfica e identidad, bastará registrar el vínculo en el **mismo manifiesto**, ejecutar el **mismo workflow** y verificar la disminución cuantificada de referencias, sin editar otra vez el pipeline. **D3 bloqueado.**

**Decisiones:** no sustituir arte histórico por variante más reciente sin permiso y no llenar huecos por similitud. **Pendientes:** aprobaciones visuales concretas de los 78 enlaces/Items, incluidos ARM-11–13; la puerta 0.4.75 continúa abierta. **Fuentes:** manifiesto de selección CI137, catálogos finales COM/ERH, registros L01–L05, bytes y SHA de staging GitHub. **Estado Maestro:** sin cambios.

## D2 — PF22/RIT08, corrección de rutas físicas y prueba de 30 IDs (23-11-2026)

El manifiesto vigente `manifests/ci137-parafernalia22-rituales8-recovery.json` indicaba `NO_BINARIES_TRANSFERRED`, estado desactualizado: los 30 WebP históricos **ya estaban** en GitHub dentro de los 115 transferidos. Se distinguen ahora **destino propuesto** (`stagedPath` anterior) y **ubicación real archivada** (`currentPhysicalStagingPath` nueva). Los SHA conservados provienen de 0.4.72/0.4.73; `assetSha256` continúa `null` para el cotejo pendiente con 0.4.75. **Ninguna imagen final promovida.**

El `INVENTARIO_LEGACY_0.4.75.json` recuperado documenta ocho rutas de Rituales con archivo presente en el ZIP 0.4.75 (ocho `zipImagePresent: true`), pero no aporta SHA-256 por imagen. Los 22 Items de Parafernalia no están representados como fichas en ese instalador. Esto prueba continuidad nominal para Rituales, **no paridad de bytes**. La comparación binaria exacta con 0.4.75 sigue bloqueada por falta de acceso al ZIP real.

**Validación integrada al pipeline CI137 existente:** comprobar por los **30 IDs** fuente JSON, tipo de plantilla, ruta `img`, SHA-256 de staging y ocho fondos rituales, sin cambiar Item ni `img`. La puerta del workflow exige cero remapeos y `archive075ByteParity: false` hasta disponer del ZIP. **Resultado CI: PASS** [GitHub Actions #45240892668](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45240892668), commit `d489622fa3fd555c40fe6ef216aea761aa388d1c`: 136/136 Items round-trip; 22/22 Parafernalia y 8/8 Rituales con SHA 0.4.72/0.4.73 contrastado, ocho fondos rituales íntegros, presencia de ocho rutas rituales documentada en 0.4.75, paridad binaria con 0.4.75 **NO VALIDADA**, remapeos nuevos **0**, publicación **BLOCKED**.

**Decisiones:** conservar 30 originales históricos; no reemplazar con 0.4.73 como si fueran finales 0.4.75. **Pendientes:** archivo fuente 0.4.75 recuperable y cotejo de bytes/arte final. **Fuentes:** manifiesto PF22/RIT08, inventario legacy 0.4.75 (solo metadatos derivados), fuente de 30 Items y staging GitHub. **Maestro:** sin cambios.

## D2 — Cruce de 29 Items Defensas/Instrumentos y control de ocho COM (23-11-2026)

**Corte validado CI PASS:** cotejadas las **29 fuentes JSON originales** con los catálogos gráficos **COM Defensas v02** y **ERH Instrumentos**, los staging ya presentes en GitHub y la matriz de triage. Se registran **17 correspondencias nominales uno-a-uno de Instrumentos**, **8 ambiguas** (cuatro Instrumentos; cuatro Defensas) y **4 Defensas sin obra idéntica acreditada**. Las correspondencias nombradas se almacenan en el mismo manifiesto de selección como `editorialCrosswalk`, **sin aprobación visual ni remapeo de ningún `img`**.

**Corrección identificada:** Antara Lickanantay `Aobt60Pl1vy7i7MU` → **`04_antara_lickanantay.webp`**, distinta de Antara Tiwanaku `zSsH0T0CZzJ4nNQB` → **`02_antara_tiwanaku.webp`**. Se abandona la colisión nominal que proponía `02_antara_tiwanaku.webp` para ambas en la matriz histórica v04, sin reescribir esa evidencia anterior.

**Ambigüedades no promovidas:** tres cascos históricos Pica–Tarapacá compiten por el dibujo único COM-07, y la coraza Lasana no puede homologarse automáticamente con COM-08/11; Capucha de camélido, Espaldar, Manta surandina y Peto no disponen de imagen editorial idéntica. En ERH, Arpa de boca tiene pendiente técnico; Campana Lickanantay no prueba equivalencia con campana piramidal, y Cuerno/Flauta de hueso requieren cotejo visual. El catálogo COM contiene ocho WebP aprobados, pero sus IDs y temas no equivalen a los ocho Items Defensas del export histórico.

**Validación agregada al pipeline existente:** exigir SHA-1 **de objeto Git** y longitud exacta a los **17 candidatos ERH**; confirmar los ocho WebP COM aprobados mediante **SHA-256**, tamaño y RIFF/WebP contra `manifests/defensas-assets.json`; exigir 17/8/4 en el gate de salida y **cero** nuevas promociones. `D2` todavía no actualiza `img` ni backgrounds; **105 referencias pendientes**. D3 y release siguen BLOQUEADOS. **Resultado de CI: PASS**, [GitHub Actions #45239742686](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45239742686), commit `a1ae2262593dcd79641bad37186d6a040c2b5a50`: compilación y round-trip 136/136 PASS, 17/17 candidatos ERH con SHA-1 de blob Git verificado, 8/8 COM aprobados verificados por SHA-256, 8 ambiguos + 4 sin pareja conservados sin remap, 105 referencias abiertas, release BLOCKED.

**Decisiones:** reconocer correspondencias nominales sin inventar equivalencias visuales; no fusionar cascos ni cultura de mantas; no generar imágenes nuevas. **Pendientes:** cotejo visual editorial y decisión explícita de qué gráfico final sirve a cada Item. **Fuentes:** JSON de 29 Items, manifiestos COM y ERH, v04 triage y blobs GitHub. **Estado Maestro:** sin cambios.

## D2 — Puerta física de 79 WebP históricos — PASS (23-11-2026)

**Trabajo implementado y validado:** se endureció el **compilador existente** `tools/foundry/ci137_pipeline.py` sin nuevo script ni workflow. Para cada uno de los **79 Items con arte histórico** (`archivedImage`) verifica antes de compilar: ruta original consistente, ruta de staging exacta dentro de `module/assets/_staging/ci137_v02_historico/`, archivo físico, encabezado RIFF/WEBP y longitud interna coherente, SHA-256 calculado. En **30/79** exige igualdad frente al SHA-256 original ya registrado en el manifiesto CI137 (22 Parafernalia + 8 Rituales). Para los otros 49 se registra el SHA medido **sin atribuirle aprobación editorial**. Valida de nuevo durante el round-trip y exige **cero promociones** de candidatos históricos. El reporte se integra en `ci137-preflight.json` y en la puerta release **ya existentes**.

**Objeto y alcance:** 136 Items, 20 Armas, nombre final `Cuchillo de piedra`, imágenes y fuentes intactas. Las 105 referencias heredadas siguen abiertas hasta cotejar el arte final. **Esta puerta valida bytes del respaldo, no reemplaza `img` ni satisface D3**. **PASS acreditado:** [GitHub Actions #45237985128](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45237985128), commit `78049aea62aaf5ccafa2c99a2d9649a83c306c3d`; preparación 136, control CSB, Foundry CLI 3.0.5 compilación/descompilación 136/136, comparación exacta de **79 WebP históricos**, **30 SHA de archivo confrontados con manifiesto**, reporte de **79 SHA calculados**, **0 candidatos promovidos**, release `BLOCKED` por D3 y 105 enlaces pendientes.

## D2 — Recuperación documental de salidas originales del 9-11-2026 (23-11-2026)

**Fuente recuperada:** secuencia real del chat del **9-11-2026** sobre ARM-11 Hacha de dos manos, ARM-12 Hacha barbada y ARM-13 Lanza corta; el usuario aprobó avanzar con respaldo y WebP transparentes. Hay **salidas sandbox generadas** documentadas, pero **ningún comprobante de que esos cinco archivos exactos hayan sido subidos posteriormente a Biblioteca/Drive/GitHub**. Corrige cualquier presunción de que «se generó en el chat» significa «se respaldó persistentemente».

| Salida histórica (9-11-2026) | Contenido/estado declarado en chat |
| --- | --- |
| `RESPALDO_ARM_11-13_PNG1024_WEBP256.zip` | PNG 1024 + tres WebP 256, paquete de respaldo entregado por sandbox |
| `RESPALDO_ARM_11-13_WEBP256_transparente.zip` | `ARM-11_Hacha_a_dos_manos_256.webp`, `ARM-12_Hacha_barbada_256.webp`, `ARM-13_Lanza_corta_256.webp`; 256×256, RGBA, WebP lossless según comprobación declarada en ese chat |
| `ARMAS_HIPERAUSTRALIS_01-13_WEBP256_TRANSPARENTES_v01.zip` | Consolidación de ARM-01–13; entregado por sandbox |
| `HIPERAUSTRALIS_COMPENDIOS_0.4.85_ARMAS_01-20_CONSOLIDADAS_CANDIDATO.zip` | **CANDIDATO** de compendio con 392 entradas, CRC declarado correcto |
| `HIPERAUSTRALIS_COMPENDIOS_0.4.86_ARCO_REEMPLAZADO_CANDIDATO.zip` | **CANDIDATO** posterior; reemplazó exclusivamente `16_arco_simple.webp`, mantuvo 392 archivos |

**Alcance de evidencia:** estas afirmaciones son **registros de entrega en la conversación**, no lectura de bytes ni validación CRC/SHA actual. Sus enlaces originales eran `sandbox:/mnt/data/...`, pertenecientes a la sesión anterior: **no reutilizar esos enlaces ni suponer que son accesibles en la sesión actual**. Los PNG se nombraron `ARM-11_Hacha_a_dos_manos_v01.png`, `ARM-12_Hacha_barbada_v01.png`, `ARM-13_Lanza_corta_v01.png`. Los hashes de los tres WebP **finales no constan** en las fuentes recuperadas; **no usar los hashes 512×512 de 0.4.72/0.4.73 como si fueran finales**.

**Búsqueda persistente realizada:** inventario de ZIP e imágenes de Biblioteca, carpetas CORE/Foundry, Drive por nombre y papelera, ramas y commits de GitHub y Releases. Los archivos finales **no aparecen como copias de bytes accesibles con esos nombres**. El único dato concluyente es la **creación/entrega histórica por sandbox sin prueba recuperada de respaldo persistente**. Ausencia de índice no prueba borrado. Las 115 imágenes cargadas en la rama CI137 son el lote histórico 79 + 20 Equipo + 16 Reliquias: **no incluye la promoción final ARM-11/12/13**.

**Decisión:** conservar D2 136/136 PASS, imagen compartida y resto de assets sin intervención; no reproducir, regenerar, reasignar ni promover ARM-11/12/13 hasta encontrar bytes verificables del lote final. Si aparece copia 0.4.85/0.4.86 o paquete 256, comparar CRC, dimensiones, alfa y hashes contra su propio manifiesto antes de usar el **mismo** transporte CI137. D3 continúa bloqueado; no crear otros pipelines, ramas o instaladores. **Estado Maestro sin cambios.**

## D2 — Rastreo ampliado de respaldos preexistentes (23-11-2026)

**Rectificación del diagnóstico de localización:** el archivo `CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip` **SÍ figura en la Biblioteca** en `/Hiperaustralis/CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip`, tamaño **4.353.820 bytes**, registro de creación **2026-11-19 03:36:25 UTC** (ID Biblioteca `libfile_4b991fac711881918fde0e058bf143ed`). La afirmación anterior «no localizable» es incorrecta para el **índice**; **la lectura binaria actual está BLOQUEADA**: el acceso de materialización al ZIP informa `This Project file does not have an authorized raw-byte materialization path`. No se abrió el ZIP ni se comprobó su CRC/SHA en esta pasada. **No borrar su registro ni recrearlo de memoria**.

**Otros respaldos hallados por índice:** `HIPERAUSTRALIS_COMPENDIOS_0.4.76_FAUNA_52_AUDITADA_LAB.zip` (**33.517.169 bytes**) y `HIPERAUSTRALIS_COMPENDIOS_0.4.60_LIMPIEZA_EDITORIAL_LAB.zip` (**40.321.661 bytes**) aparecen en Biblioteca. También constan `HIPERAUSTRALIS_PACK_A_ARMAS_FINAL_2026-10-05.zip` (**22.074.711 bytes**), `CI137_CANDIDATO_0473_ARMAS20_WEBP.zip` (**267.965 bytes**) y los respaldos CI137 de 30 WebP, Defensas/Instrumentos y fuentes históricas. El ZIP 0.4.76 tampoco pudo materializarse por la misma restricción de bytes; su existencia como asiento indexado **no certifica contenido interno**. Un `INVENTARIO_LEGACY_0.4.75.json` sí pudo copiarse y leerse: registra el ZIP original `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip`, **33.028.294 bytes**, SHA256 `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`, 358 entradas y 310 WebP. Es **prueba documental derivada**, no sustituto de una comparación física con el ZIP 0.4.75.

**ARM-11/12/13 posteriores al histórico:** los trabajos previos del **9-11-2026** registran la preparación de `RESPALDO_ARM_11-13_PNG1024_WEBP256.zip`, `RESPALDO_ARM_11-13_WEBP256_transparente.zip` y `ARMAS_HIPERAUSTRALIS_01-13_WEBP256_TRANSPARENTES_v01.zip`, más el candidato `HIPERAUSTRALIS_COMPENDIOS_0.4.85_ARMAS_01-20_CONSOLIDADAS_CANDIDATO.zip`; 0.4.86 actualizaba el arco. Referencia histórica de procedencia, **no materialización ni SHA revalidado en esta sesión**. El rastreo del catálogo actual de **1.090 ZIP** y **2.410 imágenes** de la Biblioteca, búsqueda de nombres en Drive (incluida papelera), ramas actuales GitHub y rastro de commits de assets **no encontró copias accesibles por los nombres exactos**. Esto **NO demuestra borrado**, solo acceso físico no resuelto; no sustituir con WebP 512 antiguos.

**Estado material en GitHub:** la transferencia independiente `c3c0520` acredita los **79 binarios históricos de staging + 20 Equipo común + 16 Reliquias**; por tanto **no repetir la subida de 115**. El transporte de **136 Items** con **Cuchillo de piedra** sigue D2 PASS, **105 referencias** sin remapeo editorial acreditado y D3 BLOQUEADO. El rastreo posterior a este registro deberá localizar **los 256 transparentes finales ARM-11/12/13** en su origen real, no inventar nombres ni derivar imágenes a partir del staging.

**Fuentes de este corte:** Biblioteca Hiperaustralis (metadatos de asientos), búsqueda Google Drive y papelera, árboles/commits GitHub, `INVENTARIO_LEGACY_0.4.75.json`, `docs/CI137_ARM_11_13_Y_RESCATE_DEF08_INS21_2026-11-22.md` y continuidad registrada de las sesiones del 9-11-2026. **Cambio realizado:** solo registrar hallazgos en el checkpoint vigente. Ningún Item, WebP, manifiesto compilable, workflow, `main`, Bridge, Forge ni Estado Maestro se modifica.

## D2 — Reconciliación de 105 referencias en selección 136 (23-11-2026)

**Prueba de lectura sobre el HEAD `0884091dc761` y árbol GitHub:** el manifiesto vigente de **136 IDs** se cotejó con la matriz histórica v05 de 137 entradas, descartando exclusivamente `HipArm01PackA000`. **136/136 IDs identificados, ninguno ausente**. La matriz v05 se conserva como documento histórico; NO es autoridad para seleccionar 137 ni autoriza cambios de imágenes.

**Rutas gráficas de origen:** exactamente **79/79 nombres de WebP** históricos de las familias Armas (20), Parafernalia (22), Instrumentos (21), Rituales (8) y Defensas (8) están físicamente listados en `module/assets/_staging/ci137_v02_historico/`. El Cuchillo de piedra vigente (ID `c2L6T5w4S9OcgkDt`) ya utiliza fuera del staging el WebP previamente aprobado, con `img` y fondo remapeados; quedan **78/78 rutas históricas originales archivadas en GitHub**, no 78 archivos físicamente desaparecidos.

| Familia | Rutas distintas no promovidas | Referencias `img`/fondo pendientes |
| --- | ---: | ---: |
| Armas, excluido Cuchillo de piedra vigente | 19 | 38 |
| Parafernalia | 22 | 22 |
| Instrumentos musicales | 21 | 21 |
| Rituales | 8 | 16 |
| Defensas | 8 | 8 |
| **Total** | **78** | **105** |

**Doble puerta de aprobación:** integridad/ubicación histórica **PASS 78/78 por ruta exacta**; autorización editorial de esas imágenes como arte final para reemplazar las referencias **NO ACREDITADA**. Los 79 archivos del staging histórico proceden de respaldos 0.4.72/0.4.73 y no se promocionan automáticamente, especialmente ARM-11/12/13 (prioridad a las versiones 256 px posteriores). El lote Parafernalia/Rituales continúa a la espera del cotejo con 0.4.75. Defensas/Instrumentos deben respetar sus variantes finales y los cruces de identidad comprobados. Sin remapeos gráficos nuevos en este corte.

**Equipo común, frente distinto de los 105 enlaces:** los **29/29 IDs** de la matriz QA29 están dentro de los 40 Items históricos seleccionados y sus **29/29 WebP** están presentes en GitHub: 20 obras aprobadas en `module/assets/equipo-comun/` y nueve candidatos en `module/assets/_staging/equipo/webp256/`. **0/29 aprobaciones de reemplazo `img`** en el manifiesto de correspondencias; no alterar las fichas ni presentar el arte aprobado como un cambio de icono runtime. Los 11 Items restantes conservan iconos stock legítimos.

**Próxima acción D2 en el mismo proceso:** resolver por evidencia y aprobación del arte final los 78 cruces pendientes; priorizar cotejo ARM‑11/12/13 y referencias finales Defensas/ERH, y verificar PF22/RIT08 contra el respaldo 0.4.75 si está disponible. Actualizar **solamente el manifiesto y pipeline actuales cuando exista una correspondencia aprobada**; repetir el workflow existente. D3 sigue BLOQUEADO por el incidente de carga de Foundry. Sin instaladores, ramas, módulos, workflows, fichas nuevas ni modificaciones al Estado Maestro.

**Fuentes directas:** selección CI137 ACTUAL; `docs/CI137_MATRIZ_ITEMS_ASSETS_2026-11-21_v05.json` (referente histórico de rutas); árbol GitHub del commit señalado; `manifests/equipo-comun-29-cruces-candidatos-20261121.json`; `docs/CI137_ARM_11_13_Y_RESCATE_DEF08_INS21_2026-11-22.md`; `docs/CI137_GATE_075_CIERRE_LOTE_PF22_RIT08_2026-11-22.md`. **Datos/bytes de imágenes no modificados.**

## CORRECCIÓN DE NOMBRE FINAL — CUCHILLO DE PIEDRA (23-11-2026)
**Decisión editorial explícita:** el nombre final del Item seleccionado es **Cuchillo de piedra**. Se conserva el ID histórico `c2L6T5w4S9OcgkDt` y se aplica el nombre solo al transporte CI137; `source/items/armas/01_cuchillo_litico.json` mantiene su nombre archivístico **Cuchillo lítico**. El duplicado `HipArm01PackA000` continúa excluido, con JSON fuente conservado. Mismo WebP aprobado, 136 Items, 20 Armas, nueve carpetas y cinco plantillas. **D2 revalidado PASS** en [GitHub Actions #45099633940](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45099633940), commit `68135981f425b68a3985e64eecf8ffb65056e0fa`; compilación/descompilación 136/136 y validación CSB PASS, release BLOCKED. **D3 sigue bloqueado.** Los nombres antiguos en el historial siguiente son evidencias documentales, no el nombre editorial vigente.

## CORTE VIGENTE — D2 / CORRECCIÓN EDITORIAL A 136 VALIDADA

**Autorización recibida:** ejecutar la corrección mínima dentro de la misma rama, pipeline, workflow, manifiesto y checkpoint CI137. Se excluye **solo del transporte** `HipArm01PackA000` (Cuchillo de piedra), redundante con `c2L6T5w4S9OcgkDt` (Cuchillo lítico). Fuente `source/items/01_cuchillo_piedra.json` conservada intacta como archivo histórico del prototipo. Tokicura y los 135 Items históricos permanecen seleccionados. Resultado comprobado: **136 Items, 20 Armas, nueve carpetas, cinco plantillas**.

**Asset:** el único WebP aprobado `module/assets/armas/01_cuchillo_litico.webp` permanece con su SHA verificado; solo dos referencias `img`/fondo del Cuchillo lítico requieren el remapeo. Los 105 enlaces heredados no resueltos se mantienen. Los 115 WebP ya transferidos no se reimportan ni sustituyen. No hay gráficos nuevos.

**Validación material:** [GitHub Actions #45099157074](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45099157074) **SUCCESS**, commit `031723a7b630b5c770aeb4457747794dc949cb6a`: preparación 136 fuentes, control estático CSB, compilación y descompilación CLI 3.0.5, 136/136 IDs y campos semánticos, nueve carpetas y release gate `BLOCKED`. Artefacto de auditoría `ci137-real-136-preflight-and-roundtrip` (`14784562702`). **No es instalador; D3 sin ejecutar.**

**Puertas:** solo D2 mediante workflow existente. Scripts legados de instalador y macro QA D3 quedan congelados, contienen expectativas antiguas de 137 y **no están habilitados para uso con 136** hasta revisar el incidente de carga en Foundry. No generar instalador, no modificar `main`, Forge, Bridge, mundo, plantilla CSB ni Estado Maestro. Las secciones inferiores documentan el corte histórico 137, no la selección actual.

## AUDITORÍA EDITORIAL — DUPLICACIÓN CONFIRMADA, CORRECCIÓN PROPUESTA (22-11-2026)

**Evidencia:** comparados los dos JSON fuente, el export real del 19-11-2026 y la historia GitHub. Cuchillo de piedra (`HipArm01PackA000`, `source/items/01_cuchillo_piedra.json`) y Cuchillo lítico (`c2L6T5w4S9OcgkDt`, `source/items/armas/01_cuchillo_litico.json`) tienen descripción **idéntica literalmente**, mismo `equippableItem`, misma plantilla CSB `HipArmaTpl000001` versión `186001`, `hipera_tipo=arma` y `mechanics=none`. No hay diferencia funcional o editorial sustantiva. Difieren nombres, IDs, slugs y detalles de formato de exportación, sin justificar dos entradas.

**Autoridad:** `c2L6T5w4S9OcgkDt` existe en el compendio histórico exportado `world.hiperaustralis-rituales` (`HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`). `HipArm01PackA000` fue introducido para el prototipo el 10-11-2026, commits `dc029c2` y `6bea7d6`, y no aparece en el mismo export histórico. GitHub incorporó la fuente histórica por commit `8530444` el 12-11-2026. La duplicación se produjo al seleccionar 135 fuentes históricas más dos extras del prototipo para CI137.

**Corrección editorial recomendada (aún no aplicada):** conservar **Cuchillo lítico** con su ID histórico; retirar **Cuchillo de piedra** **solamente de la selección del transporte**, preservando el JSON del prototipo como archivo documental. Resultado proyectado: **136 Items**, **20 Armas**, **9 carpetas**, **5 plantillas**; Tokicura sigue incluido. Conservar el único WebP aprobado; no borrar del mundo existente, no cambiar Estado Maestro.

**Alcance de la orden:** el usuario pidió revisar, no ejecutar todavía una baja de ID. Por tanto se registra el dictamen sin modificar manifiesto, código, workflows, fuentes ni compendios. D2 137 sigue siendo el último corte técnico probado; el nuevo objetivo editorial sugerido sería 136 tras aprobación. D3 y publicación siguen bloqueados.

## DECISIÓN APLICADA — UNA ILUSTRACIÓN PARA DOS CUCHILLOS

**Aprobación del usuario (22-11-2026):** mantener los IDs `HipArm01PackA000` (Cuchillo de piedra) y `c2L6T5w4S9OcgkDt` (Cuchillo lítico); ambos referirán el mismo WebP `assets/armas/01_cuchillo_litico.webp` en el **transporte CI137**. El objeto de Git `c8f32044e1c8e4e4cb671ad964e2378effb18f49` se reutiliza desde el staging, **sin regeneración ni duplicación de contenido binario**. SHA256 del WebP: `7ff631440c2a74d7ca25014ceb1c38024b14d3ebdb2f73a9bcc0be98ba7a8082`.

**Cambio material previsto en este commit:** 4 referencias gráficas en transporte (dos `img`, dos fondos), una ruta compartida, cero cambios en JSON fuente. Los 137 IDs se mantienen, incluida su posible duplicación editorial. Los remaps anteriores de 16 Reliquias siguen separados (32 referencias). Conteo esperado de enlaces externos: **109 → 105**, rutas externas distintas **80 → 78**. La aprobación cubre **compartir el archivo**, no fusionar los dos Items ni promover otras imágenes de Armas.

**Puerta:** CI137 debe comprobar 137 IDs/9 carpetas/5 plantillas, SHA exacto del WebP compartido y round-trip. `D3` sin aprobar; ningún ZIP instalable ni cambios a Forge, `main`, Bridge o Estado Maestro.

## ACLARACIÓN DE IDENTIDAD — CUCHILLO DE PIEDRA / CUCHILLO LÍTICO

**Verificación directa de ambos JSON fuente y del WebP:** `source/items/01_cuchillo_piedra.json` (`HipArm01PackA000`) y `source/items/armas/01_cuchillo_litico.json` (`c2L6T5w4S9OcgkDt`) tienen **la misma descripción literal**. La imagen físicamente recuperada `01_cuchillo_litico.webp` representa visualmente una hoja de piedra tallada con mango y amarras. La ruta específica `01_cuchillo_piedra.webp` **no existe en los respaldos inspeccionados**, pero eso NO significa que falte una imagen apropiada del objeto. Corregir en adelante la frase «imagen de Cuchillo de piedra ausente» a **«ruta nominal específica ausente; equivalencia gráfica plausible con Cuchillo lítico»**.

**Rectificación tras aprobación:** la decisión quedó autorizada: se conservan ambos Items y se comparte exclusivamente el WebP en el transporte. La posible duplicación editorial permanece abierta. JSON fuente y compendios no se alteran.

## ACTUALIZACIÓN MATERIAL — TRANSFERENCIA GITHUB CERRADA (22-11-2026, hora de Santiago)

**Resultado real, no una preparación:** [GitHub Actions #45095241123](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45095241123) **SUCCESS**. Commit de assets [`c3c0520`](https://github.com/ElIgnacioCampos/Hiperaustralis/commit/c3c0520f4971d56729bfd32c18d00d8e353605fd), verificado por consulta independiente del árbol y los SHA de los 115 blobs. **115/115 bytes originales exactos**; 79 fuentes del staging v02 archivadas en `module/assets/_staging/ci137_v02_historico/` para evitar promoción editorial indebida, 20 WebP de Equipo común L01–L05 en `module/assets/equipo-comun/`, 16 Reliquias históricas aprobadas en `module/assets/reliquias/`. Tokicura ya existía y se conserva sin duplicación (17 imágenes en la carpeta Reliquias después del cambio). **Los 115 archivos modificados en ese commit son todos WebP en `module/assets/`**.

**Procedencia y seguridad:** se trasladó un archivo binario verificado SHA256 `84aa4402fd51c48e4f4a66d5dfb5d454708160cc3026cd3d5a7fc486815f3a52`, dividido en 11 objetos Git autenticados, recompuesto por Action con control SHA/CRC. El importador `tools/foundry/ci137_assets_import.py` verificó los 115 contenidos, identidad del módulo y los únicos tres packs, sin sobrescribir archivos distintos. El mismo algoritmo superó una prueba local de **115 escritos y posterior idempotencia 0 escritos**. Resultado remoto: 115 archivos incorporados, ningún Item, LevelDB, `module.json`, Bridge ni `main` modificado. No se instaló en Foundry.

**IMPORTANTE — estado de promoción:** disponer de los 79 WebP históricos en GitHub **NO equivale a autorización para reemplazar los iconos finales**; ARM‑11/12/13 siguen sujetos a versiones 256 px posteriores. Los 20 Equipo común están aprobados como arte, NO sus cambios de `img` runtime. Las 16 Reliquias son las históricas seleccionadas. **La imagen independiente de Cuchillo de piedra continúa ausente**. Los 109 enlaces visuales heredados permanecen sin remapeo en el transporte CI137; ahora están disponibles los bytes respaldados para trabajar el remapeo tras autorización y QA. `D3` y release `BLOCKED`.

**Historial:** las notas de las secciones 2–5 que dicen «no se transfirió», «no se subió» o «pendiente transferir» describen **cortes anteriores** y quedan superadas por este resultado con commit. Mantenerlas sólo como trazabilidad, no como estado ACTUAL.

## 1. Continuidad cerrada

**Único módulo:** `hiperaustralis-compendios-prototype`; sus **únicos tres packs**: `ha-proto-items`, `ha-proto-actors`, `ha-proto-journals`. No crear segundo compendio, módulo QA6 ni cuarto pack, independientemente del mundo de Foundry. Guard automático: `tools/foundry/assert_single_compendium.py` con pruebas negativas PASS en ambas ramas.

**Fuentes:** 135 Items históricos + Cuchillo de piedra + Tokicura = **137 IDs únicos, nueve carpetas, cinco plantillas CSB referenciadas**. Identidad histórica de 16 Reliquias aprobada; 16 WebP de Reliquias y 32 referencias aplicadas en transporte aislado por SHA. No alterar JSON originales.

**Prueba técnica:** [Actions #45090601010](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45090601010): Foundry CLI 3.0.5 round-trip real **137/137 PASS**, gate `releaseDecision: BLOCKED`, **sin ZIP instalable**. Quedan **109 referencias heredadas a 80 rutas visuales** en Armas (42), Parafernalia (22), Instrumentos (21), Rituales (16) y Defensas (8). Una referencia heredada no acredita archivo perdido.

**Incidente:** el ZIP CI137 v0.1.6 sobre el módulo existente coincidió con un bloqueo de carga de mundo en Forge. La **causa sigue desconocida**; NO reinstalar, reconstruir o sugerir otro ZIP sin QA funcional. El archivo en Drive quedó rotulado `NO_INSTALAR`; v0.1.5 está conservado como respaldo. Actors/Journals y 86 assets eran iguales en el ZIP fallido respecto al prototipo v0.1.5. La compilación D2 no demostró apertura de mundo ni hidratación CSB.

## 2. Consolidación material — Equipo común

**Rescate efectivamente realizado:** los dos ZIP correctos estaban disponibles en Biblioteca, ruta exacta
`/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/`. Recuperados y abiertos físicamente, no inferidos de nombres.

- `HIPERA_EQUIPO_COMUN_20_WEBP_APROBADOS_LOTES01_05_QA_v01.zip`, **1.121.107 bytes**, SHA256 `41d20db6e45894e1f00ad94a8fccce01e767567bd8d3401a58716a609f4e1a72`.
- `HIPERA_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_v01.zip`, **1.128.909 bytes**, SHA256 `867884cadc27b86216e5c8f91703a7d5c75c9bc2f6410e75db7fe605e8d54be6`.
- **20/20 WebP de lotes L01–L05 PASS físico**: ambos ZIP tienen los mismos bytes por nombre; SHA y tamaño coinciden con ambos manifiestos; 256×256, WebP alfa, CRC de ambos ZIP PASS. **Los 20 ya están respaldados; NO regenerar ni hacer nuevo ZIP.**
- **29/29 cruces (ID:SHA) coinciden** con `manifests/equipo-comun-29-cruces-candidatos-20261121.json`; los 29 IDs pertenecen a los 40 Items históricos de Equipo común seleccionados en CI137. Nueve candidatos ya estaban en `module/assets/_staging/equipo/webp256/` en GitHub; **once conservan los iconos stock**.
- **No confundir:** aprobación de imagen ≠ autorización de reemplazo de `img` ni QA cliente. No se transfirieron los **20 binarios nuevos** al repositorio en este lote, no se modificaron las fichas y no se agregó un módulo. El manifiesto existente registra procedencia/hashes sin alterar selección ni disparar CI.

**Próximo avance material de Equipo común:** transferir **exactamente los 20 WebP de BBTECA** al árbol de assets del mismo prototipo mediante una vía autenticada que admita bytes; comparar cada SHA al llegar. Solo después hacer QA de los 29 en cliente aislado y decidir las sustituciones `img` individualmente; no suponer aprobación runtime.

## 3. Puertas técnicas nuevas — ejecutadas sobre fuentes reales

**Transferencia QA29 reproducible sin subir binarios todavía:** añadido `tools/foundry/ci137_equipo_20_transfer.py` sobre el mismo módulo, sin crear flujo alternativo. Entradas: los DOS ZIP exactos ya recuperados en BBTECA. Comprueba SHA256/CRC de ambos ZIP, igualdad exacta de los 20 WebP, dimensiones/alpha, los 29 IDs/hashes contra manifiesto del repositorio, las 40 identidades de Equipo común y el ID/los tres packs del módulo; en modo `--apply` exige además los nueve assets históricos ya presentes en el checkout y rechaza colisiones. Por defecto actúa en **sólo lectura**. El script no altera Items, `img`, LevelDB, manifiesto de módulo ni releases. Prueba local previa sobre la misma lógica y ZIP reales: **20/20 PASS offline; --apply BLOCKED correctamente al faltar el staging en checkout incompleto**. **No consta ejecución --apply sobre checkout real y no se transfirieron los 20 binarios a GitHub**: la conexión de Library a GitHub no permite egress binario directo. No presentarlo como incorporación terminada.

**Plantillas CSB: comprobación real del corpus completo, no de cinco muestras.** Añadido `tools/foundry/ci137_template_gate.py` al workflow CI137 ya existente; compara los **137 JSON de transporte** con cinco JSON exactos de `source-original/foundry-templates/`. [GitHub Actions #45093151565](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45093151565) **SUCCESS**, `PASS_STATIC_REFERENCES_NOT_RUNTIME`, cero problemas de identidad, versión de plantilla o campos requeridos. Distribución real: **21 Arma / 70 Equipo (incluye Defensas y Parafernalia) / 21 Instrumento / 17 Reliquia / 8 Ritual = 137**. Flags declarados en fuentes: **99 CSB 5.2.1, 36 CSB 6.0.2, dos sin declaración**. Conservados intactos, no migrar por inferencia. `ci137-template-compatibility.json` se conserva dentro del artefacto D2; el release gate sigue `BLOCKED`, **ningún ZIP instalable**.

**Advertencia:** estas verificaciones prueban consistencia de metadatos, NO presencia de plantillas en el mundo ni hidratación de fichas, compatibilidad del cliente CSB instalado, apertura de mundos o causalidad del bloqueo D3.

## 4. Dependencia externa histórica — cotejo físico 22-11-2026

**Fuentes binarias reabiertas:** ZIP `HIPERAUSTRALIS_COMPENDIOS_0.4.72_REPARACION_BIO_LAB.zip` (SHA256 `437b263f40c0c1e18cd24d0bcb996a4e1769a3830978133d0c839a0dbe1b228c`) y ZIP `HIPERAUSTRALIS_COMPENDIOS_0.4.73_BIO_TEXTOS_LAB.zip` (SHA256 `2d8830d5a18b7d6ff7ba4eee469214fef7b7efdf7164b552464620a0580a5329`). Ambos contienen `hiperaustralis-rituales/module.json` con ID de módulo real `hiperaustralis-rituales`. Se cruzaron por **ruta exacta** contra las 109 entradas `legacyAssetReferences` de `ci137-preflight.json`.

**Resultado verificable:** **107/109 referencias** (79/80 archivos distintos) existen físicamente en **ambos** ZIP. Comparación byte a byte de esos 79 archivos entre v0.4.72 y v0.4.73: **79/79 idénticos; cero diferencias**. Las únicas dos referencias que no resuelven (el `img` y el fondo) comparten una sola ruta: `modules/hiperaustralis-rituales/assets/armas/01_cuchillo_piedra.webp`. No confundir con `01_cuchillo_litico.webp`.

**Decisión técnica:** no tratar las 109 referencias externas como 109 imágenes perdidas. Para una prueba de compatibilidad puede mantenerse el módulo histórico, siempre que **esté realmente instalado y sirva esas rutas en el cliente**. Esto no vuelve autónomo CI137: faltan 2 referencias al mismo recurso, el QA de carga del cliente y la acreditación de dependencias. Los 79 son **binarios históricos presentes**, no 79 aprobaciones editoriales de gráfica final ni autorización para promover v0.4.72/73 sobre arte posterior.

**Transferencia de 20 WebP de Equipo común:** también se comprobó vía API GitHub si los 20 hashes Git-blob de los binarios aprobados ya existían en el almacén de objetos del repositorio; **20/20 no encontrados**. No es posible reutilizarlos por SHA con `create_tree`; sigue siendo necesaria una vía de subida binaria autorizada. No se simuló transferencia ni se escribió ningún blob sustitutivo.

## 5. Rescate material del staging CI137 v02 — 96 WebP (22-11-2026)

**Hallazgo decisivo:** aunque el ZIP autosuficiente `CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip` no se encontró directamente, **los cuatro insumos originales y el ensamblador v02 persistían en BBTECA**. En lugar de regenerar imágenes se recuperaron físicamente:
1. `CORE_FOUNDRY_MIGRACION_STAGING_99_20261118_v01.zip` — SHA256 `5ad6d6fd16981cf08d25b5ee93f16f3b6c071d9bb2844e844aa003a9534588db`;
2. `CORE_FOUNDRY_PREFLIGHT_CI137_20261118_v01.zip` — SHA256 `0240f2ade0c9a0159f5dc037e4a0e9bf5e54d067c321a2e112eae85037415321`;
3. `CORE_FOUNDRY_ARMAS20_IDENTIDAD_RELIQUIAS16_20261118_v01.zip` — SHA256 `12dfd717c804ea91b7f2fff71f22b379c634ff2f223e0380eafb4b02239e77b9`;
4. `CI137_DEPENDENCY_BASE_NATIVE_PROTOTYPE_RUN44961385066.zip` — SHA256 `416572117ab167c22a3c8328e254404b6f7b834818b951a02dc5211151ac1898`, contiene el prototipo 0.1.5 interno con SHA256 `c3125b7fe1ec4022a2d7e6c8802f723ac27a480541cef41a0136289de201ec93` (idéntico al respaldo ya acreditado).

**Ejecución local efectiva del código histórico**, sin modificaciones en los insumos: `assemble_ci137_v02.py`, `prepare_sources.py`, `verify_staging_v02.py`. Resultado exacto: `PASS_OFFLINE_V02` — **137 Items, nueve carpetas, 96 WebP, 141/143 enlaces internos resueltos y 2 referencias faltantes**, ambas al `01_cuchillo_piedra.webp` independiente. Los 96 assets son **20 Armas históricas + 59 del staging99 + 17 Reliquias CI112**; se verificaron por SHA/CRC. Manifest recuperado `MANIFEST_ASSETS96.json`: SHA256 `7379f48be2aa8665bad0d644f4252774e162fff1fc76a1af452ec91b471f66a0`. **No se cotejó el ZIP completo recuperado contra el ZIP v02 original ausente, por lo que no afirmar identidad byte a byte del ZIP entero.**

**Cruce con el corpus VIGENTE de identidades CI137:** la selección actual de 137 IDs comparte **121** con el staging v02; sus **16 IDs distintos** son las Reliquias CI112 del staging histórico, reemplazadas luego por **16 IDs históricos** ya aprobados. **NO importar ni instalar la selección antigua del staging v02 sobre los 137 actuales.** El rescate es para sus **96 bytes gráficos, 20 copias fuente de Armas previamente remapeadas, rutas y evidencia de hashes**; el actual corpus histórico sigue siendo la autoridad.

**Prueba nueva de correspondencia:** de las **109 referencias heredadas** en el preflight VIGENTE (`ci137-preflight.json` con 16 reliquias ya remapeadas), **107** apuntan exactamente a **79 de los WebP recuperados** en v02, por sufijo de ruta sin selección por parecido; las otras **2** son el Cuchillo de piedra. Distribución de las 107: **40** referencias a 20 WebP de Armas, **67** a 59 WebP de otras familias. Esto prueba que el antiguo trabajo material sí cubre los archivos necesarios para eliminar 107 enlaces externos cuando se integre por rutas y hashes. **No implica promoción editorial de ARM-11–13 (arte final posterior) ni integración efectiva en GitHub/Foundry**.

**Estado D3 y publicación:** siguen BLOQUEADOS. No se generó ZIP instalable, no se subieron binarios a GitHub, no se tocó mundo ni módulo. Mantener las 16 Reliquias de identidad histórica, no resucitar la variante CI112. Próximo trabajo: integrar **assets verificados**, no el corpus obsoleto del staging v02, mediante transferencia binaria auténtica; cotejar versiones finales de Armas, resolver Cuchillo y ejecutar QA cliente real.

## 6. Otros pendientes legítimos, sin reabrir inventarios

- **Historias del staging v02:** antecedente offline de 137 Items/9 carpetas/96 WebP/141 de 143 referencias; **ZIP completo no localizable en este corte**. No volver a buscar por nombre ni reproducirlo con imágenes antiguas; permanecer como evidencia histórica.
- **Gráfica Armas/otras familias:** 79/80 candidatos antiguos localizados en 0.4.72–0.4.73, no aprobados automáticamente como finales. Cuchillo de piedra `HipArm01PackA000` tiene icono propio no acreditado. ARM-11–13 requieren priorizar arte posterior 256px. Los 20 gráficos de Equipo común son un frente distinto y no restan de las **109 referencias heredadas**.
- **Plantillas CSB:** cinco fixtures documentales en `source-original/foundry-templates/`; no se ha demostrado su disponibilidad/hidratación en un mundo limpio. Actuar sobre datos reales, no inventar compatibilidades.
- **D3:** prueba del cliente V14+CSB, carga de mundo, renderizado de fichas, fondos, carpetas, UUID y persistencia. **No aprobado**. D4 solo tras autorización del usuario.
- **Bridge, Actors, Journals, Territorios, Fauna, `main`, Forge productivo y Estado Maestro:** fuera de esta operación, intactos.

## 7. Método operativo

1. Reutilizar **el manifiesto de identidades único** y el registro de QA29 existente. No crear otro compendio, otra matriz ni otro inventario.
2. **Fuente → bytes/ID/hash → decisión editorial → cambio en transporte → prueba en cliente.** Una prueba offline nunca sustituye D3.
3. Un lote debe entregar un cambio material verificable y registrar su límite. No producir instaladores ni activar releases mientras el gate esté BLOQUEADO.
4. No pedir de nuevo los ZIP que ya están en BBTECA. Para cambios gráficos usar únicamente los bytes ya aprobados y sus respaldos persistentes.

## 8. Decisiones / Pendientes / Fuentes / Maestro

**Decisiones:** mantener un único HA Prototipo y sus tres packs; D2 136/136 PASS tras excluir el duplicado Cuchillo de piedra del transporte sin borrar su fuente; congelar el instalador fallido; conservar los 20 WebP de Equipo común sin promoción runtime.
**Pendientes ACTUALES:** D2: revisar remapeos gráficos de los **105 enlaces heredados** del corpus 136, separando archivos históricos recuperados de imágenes aprobadas; respetar arte final ARM‑11/12/13 y no sobreescribirlo con staging; preparar QA de Equipo común (29 cruces) sin dar por autorizados los cambios de `img`. D3: diagnosticar bloqueo de carga Foundry, confirmar las cinco plantillas CSB en runtime y aprobar por separado cualquier instalación. **La ruta independiente Cuchillo de piedra ya no es requisito**: ese Item quedó excluido del transporte y su fuente se preserva. **Transferencia de 115/115 WebP y duplicación editorial: CERRADAS**.
**Fuentes:** [D2 vigente 136 PASS](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45099157074); [D2 histórico 137 PASS](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45090601010); `docs/CI137_RECTIFICACION_CONTINUIDAD_ASSETS_2026-11-21.md`; `docs/CORE_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_PREPARADO_20261121_v10.md`; los dos ZIP de BBTECA especificados arriba; `manifests/equipo-comun-29-cruces-candidatos-20261121.json`.
**Cambios al Estado Maestro:** ninguno. `main`, Bridge y Forge sin cambios.
