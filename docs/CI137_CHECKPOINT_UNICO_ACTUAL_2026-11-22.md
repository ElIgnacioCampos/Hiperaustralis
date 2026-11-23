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

## 3. Otros pendientes legítimos, sin reabrir inventarios

- **Historias del staging v02:** antecedente offline de 137 Items/9 carpetas/96 WebP/141 de 143 referencias; **ZIP completo no localizable en este corte**. No volver a buscar por nombre ni reproducirlo con imágenes antiguas; permanecer como evidencia histórica.
- **Gráfica Armas/otras familias:** 79/80 candidatos antiguos localizados en 0.4.72–0.4.73, no aprobados automáticamente como finales. Cuchillo de piedra `HipArm01PackA000` tiene icono propio no acreditado. ARM-11–13 requieren priorizar arte posterior 256px. Los 20 gráficos de Equipo común son un frente distinto y no restan de las **109 referencias heredadas**.
- **Plantillas CSB:** cinco fixtures documentales en `source-original/foundry-templates/`; no se ha demostrado su disponibilidad/hidratación en un mundo limpio. Actuar sobre datos reales, no inventar compatibilidades.
- **D3:** prueba del cliente V14+CSB, carga de mundo, renderizado de fichas, fondos, carpetas, UUID y persistencia. **No aprobado**. D4 solo tras autorización del usuario.
- **Bridge, Actors, Journals, Territorios, Fauna, `main`, Forge productivo y Estado Maestro:** fuera de esta operación, intactos.

## 4. Método operativo

1. Reutilizar **el manifiesto de identidades único** y el registro de QA29 existente. No crear otro compendio, otra matriz ni otro inventario.
2. **Fuente → bytes/ID/hash → decisión editorial → cambio en transporte → prueba en cliente.** Una prueba offline nunca sustituye D3.
3. Un lote debe entregar un cambio material verificable y registrar su límite. No producir instaladores ni activar releases mientras el gate esté BLOQUEADO.
4. No pedir de nuevo los ZIP que ya están en BBTECA. Para cambios gráficos usar únicamente los bytes ya aprobados y sus respaldos persistentes.

## 5. Decisiones / Pendientes / Fuentes / Maestro

**Decisiones:** mantener un único HA Prototipo y sus tres packs; congelar el instalador fallido; los 20 WebP de Equipo común son recuperados/validados en Biblioteca, sin promoción runtime.
**Pendientes:** transferencia autenticada de los 20 binarios exactos al repositorio; QA29 cliente; cerrar imágenes históricas restantes y cinco dependencias de CSB; diagnosticar carga de Foundry; pasar D3 antes de nueva distribución.
**Fuentes:** [compilación y gate D2](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45090601010); `docs/CI137_RECTIFICACION_CONTINUIDAD_ASSETS_2026-11-21.md`; `docs/CORE_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_PREPARADO_20261121_v10.md`; los dos ZIP de BBTECA especificados arriba; `manifests/equipo-comun-29-cruces-candidatos-20261121.json`.
**Cambios al Estado Maestro:** ninguno. `main`, Bridge y Forge sin cambios.
