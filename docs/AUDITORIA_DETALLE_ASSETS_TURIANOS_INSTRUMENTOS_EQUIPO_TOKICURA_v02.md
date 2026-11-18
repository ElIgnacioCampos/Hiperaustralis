# Auditoría de lote de assets — detalle de rutas y hashes

Fuente inspeccionada en esta sesión: `HIPERAUSTRALIS_ASSETS_UPDATE_TURIANOS_INSTRUMENTOS_EQUIPO_TOKICURA_v01.zip`.

## Conteo comprobado
- 79 rutas de recursos en `MANIFEST_SHA256.csv` (más el propio CSV dentro del ZIP).
- 42 SHA-256 únicos: 37 pares de rutas comparten contenido idéntico y el resto son recursos únicos.
- Distribución por grupo: Instrumentos 54 rutas; Turianos 11; Equipo común 12; Tokicura 1 recurso WebP en el árbol de assets y 1 PNG de fuente auxiliar dentro de `source/tokicura/`.
- Los seis recursos de Equipo común tienen seis rutas ERH equivalentes exactas por SHA-256. Mantener la ruta de runtime canónica y resolver los nombres históricos como alias; no almacenar dos copias.
- Los siete instrumentos nuevos tienen copia idéntica en `nuevos/` y `actualizaciones_ERH/`; conservar un solo blob físico y elegir una ruta canónica.
- Las seis normalizaciones andino-lickanantay y las seis normalizaciones mapuche/nórdicas coinciden con sus rutas de origen. Las tres piezas Lote03 también coinciden con sus rutas en normalizaciones_ERH.
- Los cuatro tokens Turianos de 512 px coinciden exactamente con sus cuatro nombres alternativos del directorio `actualizaciones_tokens_512/`.
- POPR WebP de candidato y candidato_actualizacion comparten hash; el PNG RGBA es una variante adicional, no idéntica. Mantener ambos como candidato editorial, fuera de runtime hasta aprobación.

## Tokicura — verificación técnica
- Recurso de runtime: `assets/reliquias-legendarias/tokicura_256.webp`.
- 256 × 256 px, modo RGBA, canal alfa presente.
- SHA-256: `74a11a097d3c90cb42337a40a30247b799d5007a60403d654bc320759ebd9c2a`.
- El ZIP fuente adicional contiene `Tokicura.png` de 200 × 200 RGBA; el recurso WebP 256 es la versión normalizada que debe usarse para runtime.
- `source/tokicura/Tokicura.png` dentro del lote principal es un auxiliar de fuente, no el recurso runtime.

## Estado de integración
La inspección de los adjuntos confirma que el contenido fuente está disponible en el entorno de trabajo. Esta auditoría registra hashes, rutas y reglas de deduplicación. No equivale a confirmar que los binarios estén presentes en GitHub: esa comprobación requiere leer el árbol remoto después de la transferencia.

## Próximas acciones de build
1. Incorporar las rutas canónicas, no duplicados por hash.
2. Preservar un manifiesto de alias para que los Items puedan mantener rutas estables mientras se actualizan referencias.
3. Cambiar la referencia Tokicura a la ruta del WebP normalizado.
4. Confirmar que todas las rutas runtime resuelvan dentro del módulo nuevo.
5. Ejecutar validación de existencia, dimensiones, transparencia y SHA-256 contra los archivos versionados.
