# Inventario ZIP de migración — 2026-11-12

Auditoría física del directorio de trabajo. Se inspeccionaron 31 ZIP: todos abren y pasan CRC. Se calcularon SHA-256 locales y se registraron tamaños, número de entradas, bytes descomprimidos y extensiones en el CSV de trabajo.

## Paquetes compendio
- HIPERAUSTRALIS_COMPENDIOS_0.4.68_FLORA_40_JOURNALS_LAB.zip — 399 entradas; 45,404,885 B.
- HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip — 358 entradas; 33,028,294 B; SHA-256 coincide con el registrado en el inventario histórico.
- HIPERAUSTRALIS_COMPENDIOS_0.4.76_FAUNA_52_AUDITADA_LAB (3).zip — 374 entradas; 33,517,169 B; fuente vigente de Items/assets Fauna según matriz local, con Journal no cerrado.
- MIGRACION_FLORA_FUENTE_v01.zip y MIGRACION_FLORA_FUENTE_v02.zip — 98 entradas cada uno; requieren diff de contenido antes de elegir.

## Paquetes de assets y familias
- Fauna: HIPERAUSTRALIS_FAU_007_032_CANDIDATOS_VALIDADOS.zip; FAU-033_036_CETACEOS_ACTOR_TOKEN_WEBP_NORMALIZADOS.zip; MAR_AUSTRAL_4Fx3_CONSOLIDADO_WEBP256_v02.zip.
- Funga: FUNGA_Tierra_del_Fuego_CONSOLIDADO_v01.zip.
- Territorios: TDF_12_CONSOLIDADO_4x4x4_WEBP256_v01.zip.
- Chile: HIPERAUSTRALIS_LOTE_CHILE_NORMALIZADO_v01.zip y v02.zip; v02 es preferente parcial según matriz.
- Turianos: HIPERAUSTRALIS_TURIANOS_REUBICAR_Y_NORMALIZAR.zip (instalador preferente) y HIPERAUSTRALIS_TURIANOS_TUR01-06_CARPETA_CULTURAS.zip (no ejecutar ambos).
- Equipo: HIPERAUSTRALIS_EQUIPO_COMPLETO_INTEGRACION_v01.zip.
- Equipo común: COM_LOTE_TRANSVERSAL_MAESTROS_PNG_512_v04.zip y COM_LOTE_TRANSVERSAL_FOUNDRY_WEBP_256_TRANSPARENTES_v04.zip son pares vigentes; v02 y su copia son históricos/duplicados.
- Defensas: COM_DEFENSAS_CONSOLIDADO_TOTAL_v02.zip y CATALOGO_DEF_DESCRIPCIONES.zip; COM12_CHIMU.zip queda como recurso individual pendiente de clasificación.
- Iconografía europea: HIPERAUSTRALIS_LOTE_EUROPEO_FOUNDRY_256_WEBP.zip.
- Instrumentos ERH: HIPERAUSTRALIS_INSTRUMENTOS_ERH_CONSOLIDACION_PARCIAL_v01.zip, INSTRUMENTOS_ERH_CONSOLIDADO_FOUNDRY_v01.zip, LOTE_INSTRUMENTOS_ERH_02_WEBP256.zip, INSTRUMENTOS_ERH_LOTE03_APROBADO_v01.zip, LOTE04_SELKNAM_ERH_RESPALDO_v01.zip y LOTE05_NORTE_COSTERO_ERH_CONSOLIDADO_v01.zip. Requieren cotejo de cobertura y estados; no son un único paquete intercambiable.
- Armas: SOURCE_ITEMS_ARMAS_CORTE1_GITHUB.zip; sus fuentes JSON ya aparecen en la rama bajo source/items/armas/.

## Decisiones de migración
1. No subir ZIP de laboratorio como fuente canónica ni compilar directamente desde ellos.
2. Extraer fuentes legibles a source/, binarios aprobados a assets/, y mantener manifests de identidad, procedencia, relaciones y hashes.
3. No duplicar archivos por hash; registrar alias de rutas históricas.
4. Preservar estados editoriales y de procedencia; candidato visual no equivale a aprobado.
5. No cambiar IDs ni referencias runtime hasta verificar existencia de los binarios destino.
6. Mantener el PR #1 y la rama work/native-compendia-pipeline aislados; no tocar main, Forge productivo ni MELIAZ Bridge.

## Próximas pasadas
A. Diff exhaustivo MIGRACION_FLORA v01/v02 y Flora 0.4.68/0.4.75/0.4.76.
B. Cotejo de Fauna 0.4.76 contra export de identidad y Journal independiente.
C. Cotejo de assets Equipo/COM/Defensas/Turianos/ERH por hash y destino.
D. Extraer fuentes Items/Actors/Journals de compendios, comparar IDs y payloads, crear manifiestos.
E. Migrar binarios por lotes pequeños y verificar hashes/rutas antes de actualizar referencias.

## Alcance
Esta nota registra inventario y clasificación inicial; no declara assets subidos ni migración terminada.