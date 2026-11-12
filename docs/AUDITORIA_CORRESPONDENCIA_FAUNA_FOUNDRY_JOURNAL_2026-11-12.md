# AUDITORÍA DE CORRESPONDENCIA FAUNA — FOUNDRY / JOURNAL
Fecha: 2026-11-12
Rama: work/native-compendia-pipeline
Mundo observado: hipera-5
Foundry: 14.367
Compendio: world.hiperaustralis-naturaleza-items
Carpeta: Fauna (folderId bFBfGotWh0kDYyPN)

## Fuentes cotejadas
- Exportación de Foundry: HIPERAUSTRALIS_EXPORT_IDS_FAUNA_v03.json, exportada 2026-11-12T23:30:45.657Z.
- Journal de Biblioteca: fauna_journal.json, versión 1, 61.349 bytes, modificado 2026-10-07.
- Mapa técnico: source/territorios/fauna/foundry-id-map.json.

## Resultado cuantitativo
- Foundry: 50 Items, 50 códigos únicos, 50 _id únicos, 50 UUID únicos.
- Journal: 32 entradas codificadas FAU-001–FAU-032 (más una página de índice).
- Cobertura del Journal en Foundry: 32/32 códigos.
- Para esos 32 códigos: nombres visibles coincidentes y nombres científicos coincidentes.
- Sin códigos duplicados en la exportación.
- Todos los Items exportados están en carpeta Fauna y tienen flags.meliaz-bridge.kind = fauna.
- _stats.compendiumSource y _stats.exportSource son null en los 50 documentos; no hay procedencia de importación acreditada por esos campos.

## Diferencias de alcance
Foundry contiene 18 códigos adicionales no presentes en el Journal de 32 entradas:
- FAU-033–040 (8 Items).
- FAU-045–054 (10 Items).
No aparecen FAU-041–044. No inferir que esos cuatro códigos estén reservados, eliminados o pendientes: sólo constatar ausencia en esta exportación.

## FAU-006
FAU-006 Gallito de las rocas aparece en el Journal y en Foundry. El checkpoint editorial lo mantiene retirado del pack nuevo, conservado como legado. La presencia técnica no revoca esa decisión ni autoriza su reactivación.

## Biomas
En el Journal, las flags usan claves compactas:
01_Titicaca, 02_Paititi, 03_Ngulumapu, 04_Pewenmapu, 05_Patagonia_austral, 06_Tierra_del_Fuego, 07_Canales_australes, 08_Umbral_Polar.
En Foundry, los Items 001–032 muestran etiquetas descriptivas de bioma. Se trata de representaciones distintas del mismo orden territorial; no se registra discrepancia de asignación en este cotejo.

## Assets — discrepancia de rutas
- El HTML del Journal usa rutas bajo modules/hiperaustralis-fauna/assets/fauna/...
- Los Items de Foundry usan rutas bajo modules/hiperaustralis-rituales/assets/fauna/rupestre/...
- Los 50 Items exportados apuntan a esta segunda raíz.
La diferencia de namespace y estructura está acreditada; no se ha verificado la existencia binaria de todos los archivos en ambas rutas. No cambiar rutas ni copiar assets hasta cotejar el ZIP/fuente binaria y confirmar el módulo que debe ser propietario de los recursos.

## Identidad y estado editorial
El mapa foundry-id-map.json registra identidad técnica (código, _id, UUID). No constituye manifiesto de publicación ni estado editorial. Los estados aprobados/preseleccionados/retirados siguen gobernados por los checkpoints editoriales existentes.

## Decisiones
1. Mantener los 50 Items en el mapa de identidad técnica.
2. Mantener FAU-006 como legado técnico sin reactivarlo.
3. Tratar FAU-033–040 y FAU-045–054 como extensión presente en Foundry, fuera del Journal de 32 entradas.
4. No crear registros FAU-041–044.
5. No normalizar rutas de assets sin paquete fuente verificable.

## Pendientes
1. Recuperar el paquete binario más reciente de Fauna y calcular inventario/hash de PNG/WebP.
2. Cotejar cada ruta de imagen de los 50 Items con archivo real y módulo propietario.
3. Determinar documentalmente el origen editorial de FAU-033–040 y FAU-045–054.
4. Si se decide ampliar el Journal, hacerlo como trabajo editorial separado; no inferir que los 18 Items ya están aprobados.
5. Resolver si el compendio nativo debe mantener assets bajo hiperaustralis-rituales o migrar a módulo autónomo.

## Estado Maestro
Sin cambios. Este informe es auditoría técnica; no altera canon, aprobación editorial ni módulo productivo.
