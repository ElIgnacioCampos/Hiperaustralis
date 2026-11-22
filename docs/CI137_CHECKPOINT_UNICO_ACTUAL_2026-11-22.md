# HIPERAUSTRALIS — CORE / CI137 · CHECKPOINT ÚNICO ACTUAL
**Corte:** 2026-11-22 · **Rama:** `work/ci137-ensayo-identidad-historica-20261121`
**Estado ejecutivo:** 137 Items históricos/seleccionados compilados y round-trip PASS; **no hay todavía módulo CI137 autónomo instalable ni QA en cliente Foundry**.
**Autoridad:** este checkpoint sólo rige implementación técnica de CI137. El Estado Maestro ACTUAL de Hiperaustralis rige el canon; no se modifica aquí.

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

## 4. Ruta única de ejecución — sin volver a diseñar iconos

**Paso 1 — QA de autonomía y compatibilidad del candidato, SIN nuevo arte:** elaborar sobre el pack D2 ya probado una verificación read-only que distinga (a) rutas de imágenes del módulo nuevo con bytes existentes, (b) rutas originales que dependen de `hiperaustralis-rituales`, (c) iconos stock Foundry válidos y (d) recursos ausentes de verdad. Esto es una **prueba de dependencias**, no un nuevo banco de imágenes. Distinguir carga **con** el módulo histórico instalado (QA de compatibilidad) de instalación **autónoma** (gate posterior). Si no hay acceso al cliente Foundry, preparar prueba reproducible y marcar D3 NO EJECUTADO.

**Paso 2 — CANDIDATO QA AISLADO CONSTRUIDO (NO AUTÓNOMO):** ZIP reproducible derivado de los artefactos Actions #44981739482 y #44961385066, con pack de 137, nueve carpetas y **17 WebP con hashes comprobados** (16 Reliquias + Tokicura). Descarga persistente y verificada en Drive: https://drive.google.com/file/d/1UEWO1tIY_Mv91Q4ypliqFoC0lOr1EiLc/view?usp=drivesdk. Nombre: `HIPERA_CI137_CANDIDATO_AISLADO_QA_D3_20261122.zip`; tamaño **1.263.024 bytes**, SHA-256 **`2f59de55be69e773c42904c262d85a3358703c3a2ca7c71fc0180830468a8f33`**, CRC PASS. Contiene `QA/CI137_FOUNDRY_SOLO_LECTURA.js`, matriz de IDs/plantillas y mapa de dependencias. **109 referencias a 80 URLs del módulo histórico permanecen**: usar únicamente en una instalación/mundo aislados, nunca junto a un prototipo productivo con el mismo módulo ID. **No crea release ni descarga automática**.

**Paso 3 — D3 PENDIENTE EN CLIENTE FOUNDRY:** instalar manualmente el ZIP de prueba en instancia **aislada** de Foundry V14+CSB (NO en producción); ejecutar la macro de sólo lectura y guardar su reporte. Probar una vez con módulo histórico activo (compatibilidad) y otra sin él (autonomía), inspeccionar fichas de cinco plantillas y nueve carpetas, fondos y persistencia. **No decir D3 PASS hasta ejecutar esas pruebas reales**. **D4** sólo con QA y aprobación expresa.

## 5. Cierre de control
**Decisiones:** identidades históricas y round-trip D2 cerrados; no más búsquedas generales, no reabrir iconos validados, no recompilar por documentación.
**Pendientes:** QA D3 en cliente Foundry con candidato aislado ya persistido; autonomía de 109 referencias; resolución puntual de imagen del Cuchillo de piedra y revisiones ARM-11–13 sólo con evidencia final; D4 autorización eventual.
**Fuentes:** GitHub CI137 y último run #44982643301; artifact Items #44981739482; artifact prototipo #44961385066; ZIP QA persistido en Drive (SHA indicado arriba); QA29 v10 y matrices recuperadas; checkpoint histórico v02; manifiestos de Reliquias.
**Cambios al Estado Maestro ACTUAL:** ninguno. **`main`, MELIAZ Bridge y producción:** sin tocar.
