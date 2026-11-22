# HIPERAUSTRALIS — CI137 / CHECKPOINT ÚNICO ACTUAL

**Corte:** 22-11-2026. **Rama:** `work/ci137-ensayo-identidad-historica-20261121`.
**ESTADO:** **CI137 137/137 COMPILADO Y ROUND-TRIP PASS — NO AUTÓNOMO EN ASSETS — QA RUNTIME PENDIENTE**.

Este es el único checkpoint operativo del lote histórico no territorial. Las actas anteriores permanecen como fuentes; no generan pendientes duplicados. **No modificar Estado Maestro, `main`, módulo productivo, Bridge ni Forge**.

## 1. Resultado REAL verificado

**[GitHub Actions CI137 #44981432165](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44981432165) — SUCCESS** (commit `69b02d93de5698bf29c992084941f208f141342d`, 22-11-2026). Workflow aislado `.github/workflows/compile-ci137.yml`; adaptador `tools/foundry/ci137_pipeline.py`.

- **137 Items originales y extras**, 137 IDs únicos, 137 rutas de fuente verificadas contra el árbol GitHub.
- **Composición:** 135 Items del mundo (99 de cinco familias, 20 Armas, 16 Reliquias) + dos adicionales (Cuchillo de piedra, Tokicura).
- **9 carpetas** generadas y recuperadas con jerarquía correcta; distribución: Armas 21, Defensas 8, Equipo común 40, Instrumentos musicales 21, Parafernalia 22, Rituales 8, Reliquias/Cotidianas 8, Reliquias/Legendarias 9.
- **5 plantillas CSB** verificadas en los 137 documentos: Arma, Equipo, Instrumento, Reliquia y Ritual.
- **Foundry CLI 3.0.5:** se compilaron fuentes históricas REALES y se desempaquetó el pack nativo, **137/137 PASS**. Se cotejaron `name`, `type`, `img`, `system`, `effects`, `flags`, `ownership` y carpeta. Única normalización admitida en el validador: `effects` ausente ≡ `effects: []`, serialización automática de CLI, sin alterar JSON fuente.
- **Prueba inicial #44981354289:** compiló/desempaquetó 137, falló legítimamente por esa normalización; corregida y revalidada en #44981432165.
- **Artefacto CI:** `ci137-real-137-preflight-and-roundtrip` (ID `14736924797`), contiene LevelDB compilado, preflight completo y reporte de round-trip. ZIP revisado con CRC correcto.
- **141 referencias visuales heredadas** *realmente detectadas*: 96 `img` y 45 `flags.hiperaustralis-sheet.background` hacia `modules/hiperaustralis-rituales/`. Este resultado impide declarar el pack autónomo; no es un error de compilación.

**Distinción terminante:** CI137 BUILD PASS significa documentos/jerarquía/propiedades preservados en round-trip; **no** significa iconos integrados, instalación en Foundry, renderizado de hojas o release publicable.

## 2. Estado histórico general

| Frente | Estado verificado | No confundir con |
|---|---|---|
| **Objetos 137** | **CI PASS** de pack nativo de prueba; **137/137** | Módulo autónomo/publicado |
| **Reliquias 16** | IDs históricos aprobados como autoridad; alias de 16 IDs del prototipo preservados en manifiesto | UUID completo preservado automáticamente (cambia de pack) |
| **Iconos CI137** | 69 WebP en staging GitHub, ZIP de 16 Reliquias, Tokicura runtime; 79 históricos 0.4.72/73 en paquetes recuperados; antecedente de 96 del staging 18–19/11 | Tres inventarios distintos; no sumar ni sustituir arte 256 posterior con 512 antiguo |
| **Equipo común QA29** | Rama `work/native-compendia-pipeline`: 29 identidades, 20 artes nuevos QA offline PASS, nueve staged; overlay guardado en BBTECA | Arte faltante o QA real Foundry (aún no) |
| **Armas** | 20 IDs históricos; revisión gráfica ARM-11–13 posterior documentada; Cuchillo de piedra tiene identidad independiente | Aprobar icono antiguo como final por nombre |
| **Pipeline fixture** | Rama `work/native-compendia-pipeline`: último éxito Actions #44961385066, 38 Items; PR #1 sigue draft | Pipeline CI137 ahora PASS en rama distinta |
| **Actors** | Export histórico de 176 (104 mundo, 72 packs), 170 Items embebidos en 11 Actors; Kren tiene dos variantes no equivalentes | Migración de Actors o de Items embebidos |
| **Journals** | Un fixture de 21 páginas compilado en prototipo | Migración integral de Journals |
| **Territorios** | Excluidos del lote actual; fuentes intactas | Migración/renombrado de biomas |
| **Bridge** | CI 0.24.203 anterior PASS; QA Forge pendiente | Integración con CI137 |
| **`main`** | Sin merge; PR #1 permanece draft hacia rama nativa | Publicación o actualización en producción |

## 3. Decisiones cerradas y reglas de trabajo

1. **No rediseñar ni reconstruir iconos**: aprovechar exclusivamente aprobados y respaldos documentados; no retomar búsquedas de archivos sin evidencia nueva.
2. **No auditar de nuevo los 137 IDs, 16 pares de Reliquias ni el rescate 0.4.72–0.4.73**. El resultado es estable salvo un cambio material en fuentes.
3. **Reliquias:** usar los 16 IDs históricos en CI137; IDs del prototipo como alias documentales. Se mantiene `compendiumSource` de origen; no migrar UUID sin QA.
4. **Cuchillo de piedra** (`HipArm01PackA000`) ≠ **Cuchillo lítico**. El recurso `01_cuchillo_piedra.webp` requiere equivalencia binaria propia, no una sustitución por imagen semejante.
5. **Territorios/Actors/Journals** no se agregan silenciosamente al pack de Objetos. Retomar luego, por frentes.
6. **Una única versión ACTUAL** de este checkpoint y manifiesto; no actas por correcciones menores. Conservar archivos históricos, sin borrados.

## 4. Pendientes verdaderos, orden único

**P1 — Autonomía de assets (INMEDIATO).** Hacer cruce determinista de las **141 referencias** detectadas con los 69 WebP de staging de GitHub, overlay QA29 de BBTECA, 16 Reliquias del ZIP, Tokicura y arte final de Armas/ERH ya aprobado. Registrar por Item la ruta final y SHA de binario. **No mapear por nombres ni regenerar**; las rutas sin equivalencia verificada continúan bloqueadas. Corregir `img` y fondos sólo en copia de transporte, nunca en JSON fuente, y repetir CI137. El backup 0.4.75 sólo es necesario si un asset concreto exige cotejo histórico adicional.

**P2 — QA de cliente Foundry** después de P1: pack en **mundo aislado V14/CSB**; apertura de los 137 Items, iconos visibles, carpetas, plantillas, UUID/compendiumSource, persistencia de propiedades. No prometer que se ejecutó antes de ver evidencia.

**P3 — Publicación:** después de QA y aprobación expresa, evaluar sustitución/release y continuidad de Actors/Journals. No desplegar desde este workflow: usa permisos read-only y no contiene release.

**Prioridad excluida:** rehacer el preparador en paralelo, generar más actas, modificar Bridge, tocar `main`, Territorios o diseño CORE.

## 5. Fuentes y cierre

**Fuente principal:** `manifests/ci137-selected-source-137-historical-ids.json` (137 rutas), `source-pending/ci137-historicos-99`, `source-pending/ci137-reliquias-historicas-16`, `source/items/armas` y dos extras.
**Pruebas reproducibles:** `tools/foundry/ci137_pipeline.py`, `.github/workflows/compile-ci137.yml`, run Actions #44981432165, artefacto ID 14736924797.
**Fuentes conservadas:** checkpoint 18–19/11, QA29 v10 (rama nativa), ZIPs históricos 0.4.72/73 y manifest de Reliquias.
**Decisiones:** 137 Items compilados PASS, autoridad histórica aprobada, iconografía sólo aprobada. **Pendientes:** P1–P3. **Cambios al Estado Maestro:** ninguno. Producción intacta.

