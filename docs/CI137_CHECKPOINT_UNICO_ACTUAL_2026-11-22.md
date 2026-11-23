# HIPERAUSTRALIS · CI137 / CHECKPOINT ÚNICO ACTUAL
**Corte:** 22-11-2026 (Chile) · **Rama:** `work/ci137-ensayo-identidad-historica-20261121`
**Estado:** D2 / 137 Items **PASS** · D3 / Foundry **FALLÓ EN PRUEBA DE USUARIO, CAUSA NO DIAGNOSTICADA** · PUBLICACIÓN **BLOQUEADA**.
**Autoridad:** Estado Maestro ACTUAL para canon; `manifests/ci137-selected-source-137-historical-ids.json` para las 137 identidades; este checkpoint para implementación técnica. Sin cambios al Maestro.

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

**Decisiones:** mantener un único HA Prototipo y sus tres packs; congelar el instalador fallido; los 20 WebP de Equipo común son recuperados/validados en Biblioteca, sin promoción runtime.
**Pendientes:** transferir sólo los bytes aprobados del staging v02 recuperado (sin sustituir las 16 Reliquias históricas, ni versiones posteriores ARM-11–13); transferencia auténtica de los 20 WebP de Equipo común; icono Cuchillo de piedra; QA29 cliente y 5 plantillas CSB en runtime; diagnosticar carga de Foundry; D3 antes de distribución.
**Fuentes:** [compilación y gate D2](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45090601010); `docs/CI137_RECTIFICACION_CONTINUIDAD_ASSETS_2026-11-21.md`; `docs/CORE_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_PREPARADO_20261121_v10.md`; los dos ZIP de BBTECA especificados arriba; `manifests/equipo-comun-29-cruces-candidatos-20261121.json`.
**Cambios al Estado Maestro:** ninguno. `main`, Bridge y Forge sin cambios.
