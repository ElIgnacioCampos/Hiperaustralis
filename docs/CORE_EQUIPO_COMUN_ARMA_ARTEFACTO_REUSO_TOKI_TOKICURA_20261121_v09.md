# HIPERAUSTRALIS RPG — CORE / Equipo Común
## Cotejo Armas ↔ Equipo ↔ Reliquias: Toki, Tokicura y reutilización — v09
**Corte:** 2026-11-21. **Rama:** `work/native-compendia-pipeline`. **Estado:** recuperación y decisión operativa, sin cambios a fuentes de Items, imágenes ni runtime.

### 1. Aclaración autoral y decisión
El autor precisa: «Si son armas, están generadas. Si son artefactos, al menos toqui ya existe, quizás como arma».

**Decisión:** NO producir ilustraciones nuevas de Armas ni duplicar imágenes de artefactos que ya existan. La comparación se hace por **identidad, función y asset verificable**, no por similitud ortográfica de nombres.

### 2. Hallazgos comprobados
| Objeto | Familia real | Fuente histórica/técnica | Estado |
|---|---|---|---|
| **Toki · Hacha de piedra** | **Equipo común** (herramienta) | Export Foundry `world.hiperaustralis-rituales`, Item `rZ5JztozLP6qqf7u`, `equippableItem`, `hipera_tipo=equipo`, seed `eq-map-toki` | Icono Foundry `icons/weapons/axes/axe-tomahawk-simple-black.webp`; **ningún nuevo icono propio requerido** |
| **Hacha lítica** | **Armas** | Inventario `INVENTARIO_LEGACY_0.4.75.json`: Armas #9, ID `HipArm09PackA000`, ruta histórica `modules/hiperaustralis-rituales/assets/armas/09_hacha_litica.webp` | El inventario certifica recurso binario en el instalador histórico; **no** se han cotejado aquí sus píxeles, y esa ruta NO existe en la rama GitHub `work/native-compendia-pipeline` |
| **Tokicura** | **Reliquias** | `TRANSFER_MANIFEST.json`: `LOTE_GITHUB_TOKICURA_v01.zip` + `HIPERAUSTRALIS_RELIQUIAS_LEGENDARIAS_TOKICURA_v02.zip` | WebP `module/assets/reliquias/tokicura_256.webp` y maestro `source-original/reliquias/Tokicura.png` comprobados presentes en rama GitHub. No son equivalentes automáticos a la herramienta Toki |

**Fuente decisiva de identidad del Toki:** flags `hiperaustralis-equipo` en export 19-11: `culture=Mapuche`, `family=herramienta_corte`, `materials=[piedra,madera,fibra]`, con nota editorial literal: **«Aquí toki designa la herramienta; no implica por sí mismo rango, autoridad ni carácter ceremonial.»**

### 3. Armas ya ilustradas: verificación independiente
El inventario histórico contabiliza **20 armas, 20 rutas de imágenes del módulo y 20 recursos incluidos en el ZIP legacy**. Entre ellas:
- #1 **Cuchillo lítico** — `01_cuchillo_litico.webp`.
- #9 **Hacha lítica** — `09_hacha_litica.webp`.
- #16 **Arco simple** — `16_arco_simple.webp`.
- #17 **Flecha** — `17_flecha.webp`.
- #18 **Honda** — `18_honda.webp`.
- #20 **Arpón** — `20_arpon.webp`.

Es evidencia de que los artefactos gráficos históricos **se generaron y empaquetaron**. No acredita que sus archivos estén hoy montados en el prototipo de rama ni que se pueda sustituir el `img` sin cotejo.

### 4. Resolución propuesta de cinco cruces con Equipo Común
- **Toki (Equipo) → Hacha lítica (Armas):** reutilización gráfica **posible**, pero verificar que represente herramienta y no arma de guerra. Si no corresponde, mantener icono Foundry; no generar nuevo por ahora.
- **Q'urawa · Honda (Equipo) → Honda (Armas):** comprobar la coincidencia visual/funcional y recuperar referencia de imagen propia legacy de Equipo; no generar otro icono.
- **Arco y flechas (Equipo) → Arco simple + Flecha (Armas):** reutilización si conviene, sin clonar automáticamente dos assets en una imagen única.
- **Arpón (Equipo) → Arpón (Armas):** existente; ninguna ilustración nueva.
- **Cuchillo lítico (Equipo) → Cuchillo lítico (Armas):** existente; ninguna ilustración nueva.

Los demás seis ítems sin cruce propio exacto (Metawe, Paño tejido, Phala, Phullu, Poki y Cuchara de madera lickanantay) mantienen por defecto el icono Foundry o se examinan por recursos ya presentes en banco (Alka Metawe, COM Soga/Manta, Witrü) **sin transferir automáticamente identidad cultural o función**.

### 5. Efecto sobre el balance visual
- Se conservan **29 cruces candidatos** ya registrados (9 antiguos + 20 WebP aprobados L01–L05), sin reemplazos en Foundry.
- Los **11 restantes dejan de figurar como “faltantes para generar”**: cinco vinculables a arte gráfico de Armas si es pertinente, y seis con icono Foundry o banco cultural. Se mantienen sujetos a QA semántico/visual, no a producción automática.
- `Tokicura` es un caso **separado de Reliquias**, no relleno para el Toki de Equipo.

### 6. Decisiones / Pendientes / Fuentes / Estado Maestro
**Decisiones:** no volver a generar armas ni artefactos por coincidencia superficial; reutilización contextual antes que creación; mantener distinción Toki herramienta ↔ Hacha lítica arma ↔ Tokicura reliquia.
**Pendientes:** inspeccionar binario exacto de Hacha lítica y de Honda del instalador histórico cuando sus bytes sean accesibles; QA del banco de 29 assets y reglas de imagen `img` en Foundry aislado. **No hay un Lote 06 de producción gráfica justificado.**
**Fuentes:** `INVENTARIO_LEGACY_0.4.75.json`, `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`, `TRANSFER_MANIFEST.json`, checkpoint v08.
**Cambios al Estado Maestro:** ninguno. Sin edición de `main`, Bridge, compendios, actor/item ni Foundry productivo.
