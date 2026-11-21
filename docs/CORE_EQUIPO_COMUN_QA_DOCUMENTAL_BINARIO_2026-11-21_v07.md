# HIPERAUSTRALIS — CORE / IMPLEMENTACIÓN
## Checkpoint v07 — QA documental y binario ejecutado (21-11-2026)
**Estado:** APROBADO A NIVEL DE DATOS/ASSETS; **NO** APROBADO PARA CAMBIOS EN RUNTIME. Rama de trabajo: `work/native-compendia-pipeline`.

### Resultados efectivamente ejecutados
- **40/40 Items de Equipo Común** localizados al procesar el extracto íntegro correspondiente a los registros de la carpeta `Equipo común` del export `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`. 40 IDs únicos, 40 documentos `equippableItem`, 40 `system.props.hipera_tipo=equipo`, 40 plantillas `HipEquipTpl00001`, 40 descripciones, 40 procedencias y 40 bloques de flags.
- **40/40 imágenes en el export actual** comienzan con `icons/` (biblioteca nativa de Foundry). Esto incluye **Q'urawa · Honda**, cuya ruta WebP anterior sólo consta en el inventario legacy. El export de 19-11 da `icons/svg/item-bag.svg`.
- **9/9 asociaciones estrictas** comparadas directamente con sus registros completos del compendio (ID, UUID, nombre, tipo, carpeta `e1H5TyvyNEU2Dv5E`, imagen previa, `hipera_tipo`, presencia de descripción y plantilla). **Cero discrepancias.** Archivo de propuesta: `manifests/equipo-comun-candidatos-solo-img-20261121.json`.
- **29/29 WebP propios** descargados desde la rama, cotejados contra `TRANSFER_MANIFEST.json` por tamaño real, SHA-256 recalculado, cabecera RIFF/WEBP, VP8L, dimensiones 256×256 y bandera alfa. Los 29 aprobaron, **cero errores binarios**.
- **29 recursos no equivalen a 29 nuevos Items**: 23 WebP culturales + 6 genéricos COM. Nueve tienen cruce directo con el catálogo histórico y veinte permanecen en banco (otros usos y variantes). Los 31 Items históricos sin reemplazo conservan su imagen nativa Foundry.

### Pruebas ejecutadas vs. no ejecutadas
| Control | Resultado | Alcance |
|---|---|---|
| Datos de 40 fichas en export histórico | PASS | Sólo lectura del export |
| Cotejo de nueve fichas/IDs/imagen previa | PASS | Sólo lectura del export |
| SHA-256 y estructura de los 29 WebP | PASS | Bytes servidos por GitHub y manifiesto |
| Instalación y carga por ruta en Foundry V14 | **NO EJECUTADO** | Requiere mundo aislado y módulo prototipo |
| Prueba de contraste, alfa/halo, escala de icono en interfaz | **NO EJECUTADO** | Requiere cliente Foundry |
| Test CI GitHub Actions específico de este lote | **NO CONSTATADO** | Los commits recientes no muestran runs/status de este lote |
| Integración de `img` o promoción de staging | **NO EJECUTADO** | Pendiente de QA runtime y aprobación autoral |
| Recuperación de PNG maestros | **NO NECESARIA PARA ESTE QA** | Respaldo editorial, no bloqueo por defecto |

### Evidencia y artefactos
- Registro máquina: `reports/CORE_EQUIPO_COMUN_QA_OFFLINE_2026-11-21.json`.
- Propuesta declarativa: `manifests/equipo-comun-candidatos-solo-img-20261121.json`.
- Validadores de sólo lectura: `tools/qa_equipo_comun_readonly.py`, `tools/qa_equipo_comun_export_readonly.py` y `tools/foundry/qa-equipo-comun-readonly.js`.
- Matriz histórica: `docs/CORE_MATRIZ_EQUIPO_COMUN_40x29_2026-11-21_v02.csv`.
- Marco corregido por autor: `docs/CORE_EQUIPO_COMUN_ORIENTACION_FOUNDRY_Y_ARTE_CULTURAL_2026-11-21_v05.md`.

### Próxima ejecución precisa
1. **Mundo Foundry V14 aislado**: instalar el prototipo de rama/ZIP pertinente, disponer del compendio histórico, ejecutar `tools/foundry/qa-equipo-comun-readonly.js` y registrar reporte JSON.
2. Si los WebP de `_staging/` no se sirven en el módulo instalado, **no corregir el mundo**; preparar ruta runtime sólo en nuevo paquete de prueba y repetir QA.
3. Acreditar visuamente nueve iconos (claro/oscuro, halos, tamaño de ficha) y decidir los nueve `img` por separado, con posibilidad de conservar los de Foundry.
4. No duplicar ni alterar el contenido de los Items por el solo hecho de tener recurso visual alternativo.

### Cierre de bloque
**Decisiones:** original Foundry plenamente legítimo; nueve candidatas a sustitución gráfica; veinte WebP en banco; recuperación de PNG no prioritaria.
**Pendientes:** prueba en cliente Foundry real, QA visual y promoción autorizada por Item.
**Fuentes:** export 19-11, matriz y manifiestos de rama, evidencia de lectura de bytes y reporte QA v07.
**Cambios al Estado Maestro:** ninguno. Tampoco a `main`, Bridge, módulo estable, Forge ni Foundry productivo.
