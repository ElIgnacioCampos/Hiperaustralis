# HIPERAUSTRALIS — CORE / CI137 · CHECKPOINT ÚNICO ACTUAL
## SANEAMIENTO EJECUTADO — CORTE OPERATIVO 23-11-2026

**Hecho comprobado sobre ZIPs locales físicos** `HIPERAUSTRALIS_COMPENDIOS_PROTO_NATIVO_v0.1.5_RESTAURAR.zip` y `HIPERA_PROTOTIPO_EXISTENTE_ACTUALIZACION_CI137_QA_v01.zip`: el segundo es exactamente el ZIP producido por GitHub Actions #45078858569 (SHA256 `b4a353fb5fe422246c6d57d7a8ab46c6e67dffa8fad4d6c6aa535e1762c650d5`). No hay compendio adicional ni archivos borrados. Las diferencias de contenido afectan únicamente el `module.json`, archivos de LevelDB de `ha-proto-items` y tres añadidos `QA/*`; los archivos de `ha-proto-actors`, `ha-proto-journals` y **86 assets** son idénticos. Esto NO identifica por sí solo la causa del fallo de carga.

**Dependencias medidas sin repetir arqueología de imágenes:** `ci137-preflight.json` conserva **137 IDs**, **9 carpetas**, **5 plantillas CSB referenciadas**, **16 Reliquias aprobadas/32 remaps**, **109 enlaces visuales a 80 rutas históricas**; referencia al módulo histórico ≠ imagen perdida. Las cinco plantillas no están empaquetadas como plantillas CSB autónomas en el ZIP. No consta QA real de apertura de las 137 fichas ni explicación forense concluyente del bloqueo de Forge. **El estado D3 es FALLÓ / NO ACREDITADO, no PASS.**

**Corrección efectiva del riesgo:** el workflow CI137 se deja exclusivamente para **preparación, compilación/round-trip D2 y reporte de gate**. Se retiró la recuperación de v0.1.5 y el ensamblado de ZIP instalable dentro del workflow, así como la carga de ese ZIP a Actions; conserva el código histórico fuera del flujo operativo. El nuevo `ci137-release-gate.json` verifica las cuentas y devuelve **`releaseDecision: BLOCKED`**; no fabrica un módulo ni genera una nueva descarga instalable. Sólo se rehabilita el empaquetado tras evidencias de resolución de dependencias y QA cliente satisfactorio. No se abrió mundo, no se modificó `main`, Bridge, estado Maestro o Forge.

**Próximo avance material:** trabajar sobre `manifests/ci137-selected-source-137-historical-ids.json`, aprobaciones gráficas y dependencias de las cinco plantillas. No producir ni importar ZIP hasta cerrar el gate. Mantener el mismo módulo y los mismos tres packs, sin variantes, sin duplicados.

## INCIDENCIA D3 — BLOQUEO DE CARGA EN FOUNDRY / FORGE (22-11-2026)

**Reporte directo del usuario:** tras importar en Forge el ZIP de actualización del mismo `hiperaustralis-compendios-prototype` sobre v0.1.5, **Foundry se queda cargando el mundo y no permite entrar**. El run #45078858569 acreditó únicamente D2 (compilación/round-trip/estructura), **NO D3**. La causalidad técnica todavía no está diagnosticada; tratar la actualización CI137 como **SUSPENDIDA / NO INSTALAR** hasta evidencia contraria. No atribuir con certeza el bloqueo a imágenes, Items o sistema sin pruebas.

**Medidas preventivas realizadas:**
- El ZIP QA de Drive con ID `16Vm55JK4cqqm87UXxnpOUYeckTiVNeRi` fue **renombrado en el mismo lugar** `NO_INSTALAR__CI137_QA_D3_FALLO_CARGA_MUNDO__HIPERA_PROTOTIPO_v0.1.6.zip`, sin duplicar ni borrar contenido.
- Recuperado desde el artefacto de la compilación histórica **el ZIP original v0.1.5** (no otro compendio): `HIPERAUSTRALIS_COMPENDIOS_PROTO_NATIVO_v0.1.5_RESTAURAR.zip`, **4.938.068 bytes**, SHA-256 `c3125b7fe1ec4022a2d7e6c8802f723ac27a480541cef41a0136289de201ec93`, CRC PASS, mismo ID, mismos tres compendios. Respaldo Drive: https://drive.google.com/file/d/1B6YkLX_GbKNuHms9Sla__9US1aNRJ5oA/view?usp=drivesdk.
- **Recuperación segura sugerida** (no ejecutada por ChatGPT): Safe Configuration para el mundo afectado (Foundry Setup → Game Worlds → Edit World → Launch in Safe Configuration → Update World; Forge Game Manager también tiene Launch in Safe Configuration). Si abre, mantener CI137 desactivado y volver a versión anterior mediante Import Wizard, evitando restauración/destrucción del mundo.
- **No producir ni recomendar otro ZIP CI137 ni nueva versión** hasta diagnosticar el fallo real, preservar logs y probar en cliente aislado. No confundir PASS del workflow con usabilidad.

**Estado actual:** D2 PASS documental/técnico anterior, **D3 FALLÓ EN OPERACIÓN DE USUARIO (causa no identificada)**, D4 bloqueado; **sin acceso desde esta sesión a Forge**. Se requiere confirmar recuperación funcional antes de retomar pruebas de compilación. No reproducir ni ignorar este incidente en el siguiente checkpoint.

**Corte:** 2026-11-22 · **Rama:** `work/ci137-ensayo-identidad-historica-20261121`
**Estado ejecutivo:** 137 Items históricos/seleccionados compilados y round-trip PASS; **no hay todavía módulo CI137 autónomo instalable ni QA en cliente Foundry**.
**Autoridad:** este checkpoint sólo rige implementación técnica de CI137. El Estado Maestro ACTUAL de Hiperaustralis rige el canon; no se modifica aquí.

## NORMA CERRADA — NO DUPLICAR EL COMPENDIO

**Objeto de continuidad:** `hiperaustralis-compendios-prototype.ha-proto-items` (**HA · Prototipo · Objetos**) es y seguirá siendo el **ÚNICO compendio Item** de este trabajo, con las identidades históricas dentro del mismo pack, no en un segundo pack. Se preservan los otros dos compendios existentes, `ha-proto-actors` y `ha-proto-journals`. **El mundo (Hipera 6 u otro) no determina la identidad del compendio.**

**PROHIBIDO salvo decisión autoral explícita:** crear otro módulo con nuevo ID, otro compendio de Objetos, un cuarto pack, clones `CI137 QA`, reetiquetar el pack existente o encargar ZIP de otro módulo. Los ejemplos `hiperaustralis-ci137-qa6` y `ha-ci137-items` son rutas de trabajo **rechazadas**.

**Guard ejecutable:** `tools/foundry/assert_single_compendium.py` y `.github/workflows/guard-single-compendium.yml`. En cada cambio relevante validan ID, nombres/tipos/rutas/etiquetas exactas, tres packs, un solo Item, ausencia de generadores duplicadores y cinco pruebas negativas. Antes de entregar cualquier ZIP, ejecutar `--artifact`; si actualiza el prototipo, ejecutar además `--baseline` para exigir SHA idéntico de Actors y Journals. Una anomalía bloquea la entrega. No reemplazar la versión de Forge sin comparar antes su estado real.

**Objetivo único:** actualizar el contenido del pack actual de **38 → 137 Items**; conservar los demás packs. D2 = PASS de las 137 fuentes; D3 Foundry sigue pendiente. **No volver a proponer un nuevo compendio para evitar una colisión: resolver las colisiones preservando el compendio existente.**

## 1. Evidencia actual — no volver a auditar sin delta

| Frente | Hecho comprobado | Alcance del PASS o del pendiente |
|---|---|---|
| Fuentes | 135 Items históricos (99 de cinco familias, 20 Armas, 16 Reliquias de identidad histórica aprobada) + Cuchillo de piedra y Tokicura: **137 IDs únicos**, 137 rutas de origen en GitHub | Selección cerrada; no rehacer fuentes ni identidad |
| Estructura | **9 carpetas**, **5 plantillas CSB**; `tools/foundry/ci137_pipeline.py` compiló/desempaquetó mediante Foundry CLI 3.0.5 | **Round-trip real PASS** [run #44982643301](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44982643301), commit `b6ae6fd5` |
| Arte aplicado | **16 WebP existentes de Reliquias**, verificadas por SHA, incorporadas **al transporte y al artefacto aislado**; 32 referencias corregidas | No significa módulo final instalado; originales no alterados |
| Dependencias visuales del transporte actual | **109 referencias** heredadas a `hiperaustralis-rituales`, correspondientes a **80 imágenes distintas** | Son enlaces pendientes de autonomía del nuevo módulo, **no 80 imágenes perdidas** |
| Rescate histórico | Antecedente de 79/80 imágenes antiguas recuperadas de respaldos 0.4.72/0.4.73; una no localizada: imagen propia del Cuchillo de piedra | Evidencia de procedencia histórica, **no autoridad de última revisión ni disponibilidad actual de los bytes en GitHub** |
| Staging previo v02 | `CORE_FOUNDRY_CI137_STAGING_INTEGRADO_v02.zip`: antecedente de 137 Items, 9 carpetas, 96 WebP, 141/143 enlaces resueltos | Resultado offline histórico **no reproducido sobre el ZIP exacto en este entorno**; ZIP completo no localizable aquí. No declararlo perdido definitivamente ni exigir su búsqueda reiterada |
| Equipo común | **29 cruces candidatos de 40 Items**, 20 iconos nuevos aprobados con QA offline y nueve staged; 11 conservan iconos Foundry. QA29 v10, matriz y validadores ya copiadas desde rama nativa | Identidad/candidatura de arte **no autorizan cambio runtime de `img`**; QA de cliente pendiente |
| Ramas y PR | CI137 y `work/native-compendia-pipeline` divergentes; CI137 ya recibió **11 archivos finales** de Equipo; PR #1 en borrador apunta a rama nativa con fixture de 38 Items | No fusionar ramas ni PR por inercia; mantener historia de versiones |
| Producción | `main`, Bridge, Foundry/Forge productivos y Estado Maestro | Sin modificaciones autorizadas por CI137 |

**Fuentes primarias actuales:** `manifests/ci137-selected-source-137-historical-ids.json` (identidad), `source-pending/` y `source/items/` (payload original), `.github/workflows/compile-ci137.yml`, `tools/foundry/ci137_pipeline.py`, run #44982643301. Para el estado previo usar `docs/CI137_RECTIFICACION_CONTINUIDAD_ASSETS_2026-11-21.md` y el checkpoint histórico 18–19/11 **sólo como evidencia de aquella ejecución**.

## 2. Auditoría del método — errores detectados y correcciones obligatorias

1. **Se confundieron pruebas distintas.** Un `ROUNDTRIP_PASS` acredita preservación de identidad, carpeta y campos después de compilar/desempaquetar; **no** acredita imágenes visibles, autonomía de assets, CSB renderizado o runtime Foundry. Mantener gates independientes y no declarar publicable hasta superarlos.
2. **Se volvió a investigar trabajo cerrado.** Un estado de inventario parcial del árbol GitHub se interpretó como falta de iconografía: esto provocó nuevas búsquedas de ZIP, hashes y artes ya validados. Una ruta heredada no equivale a un binario perdido. No repetir un cotejo sin un hecho nuevo preciso.
3. **Se fusionaron indebidamente autoridades.** Fuente histórica, arte visual aprobado, correspondencia candidata, bytes disponibles ahora y sustitución runtime autorizada son cinco condiciones distintas; **cada una necesita su evidencia**. No promover por semejanza de nombre ni convertir automáticamente un respaldo 512 px en la revisión final 256 px.
4. **El checkpoint creció acumulando instrucciones contradictorias.** Se reemplaza por este corte limpio; el historial íntegro sigue en Git. No volver a agregar secciones que reabran gates cerrados.
5. **Se hicieron commits sin avance funcional.** Actualizar el manifiesto de selección para registrar auditorías provocó CI repetidas. El manifiesto de 137 identidades queda estable; auditoría metodológica y hallazgos de continuidad van **sólo a este checkpoint**. El workflow CI137 ya excluye este archivo de sus triggers `push.paths`.
6. **Persistencia mal entendida.** Un ZIP creado en un chat, un artefacto Actions con retención de 30 días y un archivo efectivamente guardado en BBTECA/GitHub **no son lo mismo**. Un nombre o link histórico no demuestra acceso actual. Decir **«no localizable con estos accesos»**, no «perdido para siempre».
7. **Se multiplicaron frentes.** CI137 no incorpora Actors, Journals, Territorios ni Bridge por extensión implícita. Cada uno mantiene rama/checkpoint/protocolo propio y sólo pasa al Maestro tras aprobación.

## 3. Protocolo operativo desde ahora

**A. Recuperar sin repetir:** al abrir el frente, leer Estado Maestro ACTUAL sólo para compatibilidad, este checkpoint, manifiesto de 137 y **un** checkpoint final del subfrente afectado. Revisar historial únicamente ante contradicción localizada. Nunca abrir una búsqueda general de archivos, imágenes o ZIP si ya consta el resultado.

**B. Declarar una sola operación:** indicar entrada exacta, salida esperada, límite de alcance y condición PASS/FAIL. No iniciar un segundo inventario, escribir actas paralelas ni ampliar el lote durante la ejecución.

**C. Ejecutar con trazabilidad:** inspeccionar los bytes reales/JSON en el lugar donde se van a usar; cada sustitución exige ID, procedencia, hash cuando exista y aprobación aplicable. Cambios solamente en rama aislada; fuentes originales intactas. Si falta el binario, registrar esa dependencia y continuar con pruebas que no lo necesitan.

**D. Probar sin sobreafirmar:** usar niveles **D0 documental**, **D1 integridad de fuentes/bytes**, **D2 compilación y round-trip**, **D3 instalación y QA en cliente Foundry V14/CSB**, **D4 distribución/publicación autorizada**. CI137 de Items está **D2 PASS**, no D3 ni D4. El arte de Reliquias está D1 PASS y en transporte D2; las otras familias no tienen autonomía demostrada.

**E. Guardar poco y bien:** un commit por avance material, readback de GitHub, link a la prueba. Actualizar **este único checkpoint** con decisión, pendiente, fuente y cambio al Maestro (normalmente ninguno). Artefactos binarios persistentes sólo en respaldos aprobados; no tratar Actions como archivo permanente.

**F. Cerrar sin trasladar carga:** no pedir al usuario que reconstruya material ya documentado; ante un recurso inaccesible, indicar el bloqueo preciso y proponer o ejecutar el mejor avance independiente. No prometer QA en Foundry si no hay acceso a su cliente real.

## Corrección del flujo Forge — reutilizar HA · Prototipo (22-11-2026)

**Decisión:** no crear un segundo módulo/compendio `hiperaustralis-ci137-qa6`. En captura del mundo Hipera 6 ya figuran los tres packs `HA · Prototipo · Objetos`, `HA · Prototipo · Adversarios` y `HA · Prototipo · Journals`. La propuesta anterior de un nuevo ID duplicaba el paquete y quedó **SUPERADA**. Su workflow `.github/workflows/build-ci137-forge-hipera6.yml` fue retirado de la rama; los scripts quedan únicamente como historia técnica.

**Candidato de actualización del prototipo EXISTENTE (NO IMPORTADO):**
- ZIP **ACTUALIZADO IN SITU** `HIPERA_PROTOTIPO_EXISTENTE_ACTUALIZACION_CI137_QA_v01.zip`, **4.985.980 bytes**, SHA-256 **`b4a353fb5fe422246c6d57d7a8ab46c6e67dffa8fad4d6c6aa535e1762c650d5`**. Se reemplazó el anterior en el **mismo archivo Drive**, ID inalterado; no existe segundo compendio.
- Respaldo Drive verificado: https://drive.google.com/file/d/16Vm55JK4cqqm87UXxnpOUYeckTiVNeRi/view?usp=drivesdk.
- **CI ACTUAL PASS:** [Actions #45078858569](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45078858569), commit `4228c439`. Es el **workflow CI137 existente** ampliado: 137 compilados, round-trip PASS, recuperación autenticada del prototipo v0.1.5 por SHA, reemplazo **sólo** de `packs/ha-proto-items/`, verificación de los otros dos packs y de 86 assets por SHA, prueba de guard 5 negativas, ZIP raíz verificado. Artefacto GitHub #14776580662. `module.json` conserva el ID y 3 packs; sin URLs antiguas de versión pública.
- Scripts reproducibles en rama CI137: `tools/foundry/ci137_update_existing_prototype.py`, `tools/foundry/ci137_readonly_existing_prototype.js`, `tools/foundry/assert_single_compendium.py`. **No crear nuevo pipeline ni compendio**.
- **Mismo ID** `hiperaustralis-compendios-prototype`, **mismos tres packs y etiquetas**. Se sustituye únicamente el LevelDB `ha-proto-items` del artefacto base del pipeline de GitHub por el compilado CI137 de 137 Items. **Los archivos de Actors, Journals y 86 assets del prototipo histórico son idénticos por SHA** frente a la base exportada en Actions #44961385066; se añade QA de solo lectura. Los originales de Item permanecen intactos. Manifest/download antiguos de la versión pública retirados del ZIP de prueba para evitar una reversión accidental; versión `0.1.6-ci137qa.1`.
- **LÍMITE:** la preservación comprobada es contra **el prototipo v0.1.5 del artefacto GitHub**, no contra los bytes actualmente instalados en la cuenta de Forge. NO asegurar igualdad de estos dos sin backup/cotejo.
- **SEGURIDAD FORGE:** The Forge documenta que importar un módulo con ID existente **reemplaza la versión instalada a nivel de cuenta**; puede afectar otros mundos aunque sólo se active en Hipera 6. Por eso **NO IMPORTAR todavía** sin exportar/respaldar y cotejar la versión real del módulo instalado. Ningún cambio se realizó en Forge.
- D2 para 137 Items = PASS previo. D3 cliente sigue pendiente. 109 enlaces a módulo histórico permanecen; no confundir con iconos faltantes.

**Siguiente puerta — exclusivamente Forge:** antes de importar en cuenta compartida, validar el módulo `hiperaustralis-compendios-prototype` actualmente instalado contra base v0.1.5, pues los packs son compartidos entre mundos. Una vez acreditada esa equivalencia, usar el **mismo ZIP persistente** para actualizar **el mismo módulo**, sin instalar otro ni cambiar ID. D3 queda NO EJECUTADO; no afirmar actualización en Forge hasta que conste.

## 4. Ruta única de ejecución — sin volver a diseñar iconos

**Paso 1 — QA de autonomía y compatibilidad del candidato, SIN nuevo arte:** elaborar sobre el pack D2 ya probado una verificación read-only que distinga (a) rutas de imágenes del módulo nuevo con bytes existentes, (b) rutas originales que dependen de `hiperaustralis-rituales`, (c) iconos stock Foundry válidos y (d) recursos ausentes de verdad. Esto es una **prueba de dependencias**, no un nuevo banco de imágenes. Distinguir carga **con** el módulo histórico instalado (QA de compatibilidad) de instalación **autónoma** (gate posterior). Si no hay acceso al cliente Foundry, preparar prueba reproducible y marcar D3 NO EJECUTADO.

**Paso 2 — CANDIDATO QA AISLADO PREVIO (SUPERADO POR ACTUALIZACIÓN DEL PROTOTIPO EXISTENTE):** ZIP reproducible derivado de los artefactos Actions #44981739482 y #44961385066, con pack de 137, nueve carpetas y **17 WebP con hashes comprobados** (16 Reliquias + Tokicura). Descarga persistente y verificada en Drive: https://drive.google.com/file/d/1UEWO1tIY_Mv91Q4ypliqFoC0lOr1EiLc/view?usp=drivesdk. Nombre: `HIPERA_CI137_CANDIDATO_AISLADO_QA_D3_20261122.zip`; tamaño **1.263.024 bytes**, SHA-256 **`2f59de55be69e773c42904c262d85a3358703c3a2ca7c71fc0180830468a8f33`**, CRC PASS. Contiene `QA/CI137_FOUNDRY_SOLO_LECTURA.js`, matriz de IDs/plantillas y mapa de dependencias. **109 referencias a 80 URLs del módulo histórico permanecen**: usar únicamente en una instalación/mundo aislados, nunca junto a un prototipo productivo con el mismo módulo ID. **No crea release ni descarga automática**.

**Paso 3 — D3 PENDIENTE EN CLIENTE FOUNDRY:** instalar manualmente el ZIP de prueba en instancia **aislada** de Foundry V14+CSB (NO en producción); ejecutar la macro de sólo lectura y guardar su reporte. Probar una vez con módulo histórico activo (compatibilidad) y otra sin él (autonomía), inspeccionar fichas de cinco plantillas y nueve carpetas, fondos y persistencia. **No decir D3 PASS hasta ejecutar esas pruebas reales**. **D4** sólo con QA y aprobación expresa.

## 5. Cierre de control
**Decisiones:** identidades históricas y round-trip D2 cerrados; reutilizar los tres packs del prototipo existente, sin módulo duplicado; no más búsquedas generales, no reabrir iconos validados, no recompilar por documentación.
**Pendientes:** QA D3 en cliente Foundry con candidato aislado ya persistido; autonomía de 109 referencias; resolución puntual de imagen del Cuchillo de piedra y revisiones ARM-11–13 sólo con evidencia final; D4 autorización eventual.
**Fuentes:** GitHub CI137 y último run #44982643301; artifact Items #44981739482; artifact prototipo #44961385066; ZIP QA persistido en Drive (SHA indicado arriba); QA29 v10 y matrices recuperadas; checkpoint histórico v02; manifiestos de Reliquias.
**Cambios al Estado Maestro ACTUAL:** ninguno. **`main`, MELIAZ Bridge y producción:** sin tocar.
