# Hiperaustralis RPG — CORE / Implementación
## Equipo Común: rescate de maestros y preparación de QA aislado — v04
**Corte:** 2026-11-21 · **Estado:** investigación documental y herramientas de prueba; NO integra Items ni modifica assets runtime.

### 1. Recuperación documental realizada
- Biblioteca del proyecto: búsqueda paginada de ZIP en todo el catálogo (987 resultados) y PNG en /Hiperaustralis (1850 resultados).
- No se localizó como archivo independiente el ZIP original `HIPERAUSTRALIS_EQUIPO_COMPLETO_INTEGRACION_v01.zip` ni los nueve PNG maestros prioritarios.
- Drive: las consultas por nombres exactos/parciales del paquete y los maestros no identificaron copias verificables.
- GitHub `work/native-compendia-pipeline`: las nueve rutas de PNG declaradas en `TRANSFER_MANIFEST.json` devuelven 404. Esto no implica eliminación del archivo fuente en otros respaldos.
- **LIMITACIÓN:** los ZIP alternativos sí aparecen como registros en Biblioteca, pero la herramienta no proporciona sus bytes en este entorno. No se ha comprobado su contenido. No se modificaron ni borraron.

### 2. Tres archivos históricos identificados; contenido aún no inspeccionado
| Registro | Biblioteca | Tamaño conocido | Estado |
|---|---|---:|---|
| `HIPERAUSTRALIS_FOUNDRY_EQUIPO_COMUN_v0.2.zip` | `/Hiperaustralis/` | 21.485 B | Archivo antiguo identificado; bytes inaccesibles |
| `hiperaustralis-compendio-v0.4.7_equipo_instrumentos_SWIZARD.zip` | `/Hiperaustralis/` | 4.771.835 B | Archivo antiguo identificado; bytes inaccesibles |
| `CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip` | `/Hiperaustralis/` | 4.353.820 B | Respaldo staging identificado; bytes inaccesibles |

No suponer que estas versiones contienen los PNG maestros, ni usarlas como autoridad frente al export Foundry del 19-11-2026.

### 3. Equipo Común acreditado
- Catálogo histórico: 40 registros Item, IDs del compendio `world.hiperaustralis-rituales`, matriz v02.
- Assets actuales: 29 WebP de Equipo en staging, documentados en `TRANSFER_MANIFEST.json`.
- Nueve cruces directos: Qapu, Knífr, Eldjárn, Saum-nál, Gancho de atalaje, Chinguillo, Chope, Canasto chinchorro y Punzón de hueso.
- Para esos **9/9** WebP: presencia en GitHub, tamaño, cabecera RIFF/WEBP, codificación VP8L, dimensiones 256×256, bandera alfa y SHA-256 coincidente con manifiesto.
- La integridad binaria **no certifica** corrección iconográfica ni funcionamiento en Foundry.

### 4. Nuevas herramientas en rama de trabajo
1. `manifests/equipo-comun-qa9-20261121.json`: matriz trazable de nueve ID↔WebP↔master declarado, con hashes, tamaños y estado candidato.
2. `tools/qa_equipo_comun_readonly.py`: preflight de solo lectura contra el checkout: comprueba los 29 WebP del manifiesto, IDs no repetidos de los nueve candidatos y hashes/estado de sus masters. No genera ni edita archivos del módulo. Ejecución: `python3 tools/qa_equipo_comun_readonly.py`.
3. `tools/foundry/qa-equipo-comun-readonly.js`: macro de solo lectura para **mundo Foundry V14 aislado**. Consulta los nueve IDs del compendio histórico y prueba si los nueve WebP del módulo prototipo se cargan a 256×256. No modifica `img`, Items, packs ni actores. Genera un JSON de resultados local cuando el entorno permite `saveDataToFile`.

**Estado de ejecución:** los dos scripts están escritos y guardados en GitHub. No se ha ejecutado el preflight Python en un checkout íntegro (el contenedor local no accede al remoto por red), y **no se ha ejecutado la macro en Foundry/Forge**. No reportar QA PASS sin los logs resultantes.

### 5. Bloqueos que faltan para promover los assets
1. Recuperar el ZIP de origen y los nueve PNG maestros con bytes y hashes; inspeccionar archivos alternativos antes de descartarlos.
2. Reconciliar los **JSON completos** de los nueve Items con el export histórico, preservando `_id`, `uuid`, `flags`, `system`, carpetas y referencias.
3. Ejecutar los preflight técnicos y la macro solo en mundo aislado, conservando el reporte de QA.
4. Hacer QA visual sobre fondos claro/oscuro, bordes, halos y escala; cotejar especímenes arqueológicos cuando sea posible.
5. Obtener aprobación explícita para promoción de staging a ruta runtime y cualquier reemplazo de `img`.

### 6. Salvaguardas y protocolo de cierre
**Decisiones:** mantener el inventario histórico; nueve candidatos binariamente verificados; scripts estrictamente de solo lectura.
**Pendientes:** bytes de maestros, fuente ZIP, auditoría cultural específica, JSON originales, QA visual y de cliente Foundry.
**Fuentes:** matriz v02, checkpoint v03, manifiesto de transferencia, búsqueda de Biblioteca/Drive/GitHub 21-11.
**Estado Maestro:** sin cambios. `main`, MELIAZ Bridge, módulo estable y Foundry productivo no se modificaron.
