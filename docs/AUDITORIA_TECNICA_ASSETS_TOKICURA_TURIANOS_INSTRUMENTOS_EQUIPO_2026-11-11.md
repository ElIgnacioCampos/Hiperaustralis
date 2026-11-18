# Auditoría técnica del lote de assets — 2026-11-11

## Fuente revisada
`HIPERAUSTRALIS_ASSETS_UPDATE_TURIANOS_INSTRUMENTOS_EQUIPO_TOKICURA_v01.zip`
- 81 entradas ZIP: 1 manifiesto SHA-256 + 80 archivos.
- 7,453,454 bytes descomprimidos.
- El manifiesto incluye ruta, tamaño y SHA-256 para los 80 archivos.

## Conteo por familia
| Familia | Archivos |
|---|---:|
| Turianos | 11 |
| Instrumentos | 54 |
| Equipo común | 12 |
| Tokicura (asset runtime) | 1 |
| Fuentes Tokicura (MD + PNG) | 2 |
| **Total** | **80** |

## Duplicados comprobados por SHA-256
- Turianos: las cuatro imágenes principales y sus cuatro nombres de actualización son pares idénticos; mantener un único binario canónico por imagen y resolver alias en manifiesto.
- Equipo común: los seis archivos `com_0*_foundry_256.webp` coinciden uno a uno con las seis actualizaciones ERH. No duplicar binarios; conservar el mapeo COM↔ERH.
- Instrumentos: hay variantes de normalización que repiten exactamente los masters históricos. Resolver por hash y no por nombre.
- POPR: WebP candidato y PNG candidato son variantes distintas; el WebP candidato tiene hash idéntico a `POPR_ERH_REFINAMIENTO_TECNICO_v02`. Ambos siguen fuera del runtime hasta QA/aprobación.
- Instrumentos nuevos: siete recursos en `nuevos/` (dos Selk’nam y cinco Norte Costero); mantener su estado editorial individual. No convertir candidatos en aprobados por el solo hecho de estar en el ZIP.

## Tokicura — verificación técnica
Archivo: `assets/reliquias-legendarias/tokicura_256.webp`
- SHA-256: `74a11a097d3c90cb42337a40a30247b799d5007a60403d654bc320759ebd9c2a`
- Tamaño: 27,972 bytes.
- Formato: WebP.
- Dimensiones: 256 × 256.
- Modo: RGBA.
- Canal alfa: presente, rango 0–255.
- El archivo fue inspeccionado desde el ZIP y cumple el objetivo técnico Foundry 256 transparente.

## Estado de incorporación
Esta auditoría verifica los binarios dentro del adjunto ZIP y sus hashes; **no demuestra que los binarios estén presentes en GitHub**. En el árbol remoto de la rama, el inventario recursivo todavía muestra únicamente el fixture `source/items/01_cuchillo_piedra.json` dentro de `source/items/`, y no muestra el directorio `assets/` del módulo. No actualizar rutas runtime ni declarar autonomía hasta incorporar los binarios y confirmar los hashes desde el propio árbol Git.

## Próximas acciones técnicas
1. Incorporar los 80 archivos del lote a `assets/` preservando subrutas, con deduplicación física basada en SHA-256 y aliases documentados.
2. Incorporar los 135 JSON canónicos en `source/items/` como archivos individuales, conservando IDs y carpetas Foundry.
3. Generar `manifests/assets.json`, `manifests/id-map.json` y el registro de procedencia.
4. Adaptar el preparador para descubrimiento recursivo y reconstrucción de carpetas Foundry.
5. Escanear referencias runtime y validar cero dependencias `modules/hiperaustralis-rituales/`.
6. Ejecutar build, round-trip semántico y QA en mundo Foundry aislado.

## Salvaguardas
No tocar `main`, no fusionar PR #1, no modificar el módulo estable ni MELIAZ Bridge, y no instalar en el mundo productivo.
