# Hiperaustralis — CORE / Equipo Común
## Checkpoint v06 — Cotejo de nueve fichas y preparación QA Foundry
**Fecha:** 2026-11-21
**Rama:** `work/native-compendia-pipeline`
**Estado:** FUENTES Y MATRIZ VALIDADA / PRUEBA EN FOUNDRY AÚN NO EJECUTADA.

### Decisión operativa vigente
Conforme a la aclaración autoral del 21-11-2026:
- El catálogo histórico tiene **40 ítems de Equipo Común**, que utilizaban mayoritariamente iconos propios del catálogo Foundry.
- La producción gráfica cultural propia arrancó en noviembre. No existe obligación de producir 40 imágenes originales.
- **Nueve** ítems históricos presentan correspondencias directas con WebP culturales propios.
- Los **31 restantes conservan sus iconos actuales** mientras sean funcionales; **20 WebP de noviembre** sin correspondencia directa permanecen en banco, no se convierten en Items automáticamente.
- Los PNG maestros son respaldo editorial: su ausencia en la rama no bloquea el examen del derivado WebP ya verificado.

### Cotejo del export del 19-11-2026
Los nueve documentos siguientes se verificaron por ID como registros **`world-compendium`** dentro de `world.hiperaustralis-rituales`, carpeta `Equipo común` (`e1H5TyvyNEU2Dv5E`), `itemType: equippableItem` y `system.props.hipera_tipo: equipo`. El campo `img` corresponde a la ruta Foundry enumerada. No mezclar sus IDs con las copias del mundo.

| N° | Item | ID histórico de compendio | `img` antes de cualquier cambio | WebP propio candidato |
|---:|---|---|---|---|
| 13 | Qapu · Huso | `SbBJa9ACdFH2z86D` | `icons/commodities/cloth/thread-spindle-grey.webp` | `aymara_qapu_huso.webp` |
| 17 | Knífr · Cuchillo | `EPqXIQm8A38zvtXw` | `icons/weapons/daggers/dagger-black.webp` | `nordico_knifr_cuchillo.webp` |
| 20 | Eldjárn · Yesquero | `XhykrqOWzvB8abe9` | `icons/tools/laboratory/burner-steel-grey.webp` | `nordico_eldjarn_yesquero.webp` |
| 22 | Saum-nál · Aguja de coser | `VOtfeqh5KvQw6eF1` | `icons/tools/hand/needle-grey.webp` | `nordico_saum_nal_aguja.webp` |
| 29 | Gancho de atalaje | `YuTiSkP9Mx7FvJy7` | `icons/sundries/survival/rope-wrapped-loops-grey.webp` | `lickanantay_gancho_atalaje.webp` |
| 35 | Chinguillo · Bolsa-red | `CBIQgRyTGVMq6RCP` | `icons/tools/fishing/net-tan.webp` | `chinchorro_chinguillo.webp` |
| 36 | Chope · Desconchador | `Cal0I8l96tdRm1pR` | `icons/tools/hand/wrench-steel-grey.webp` | `chinchorro_chope.webp` |
| 38 | Canasto | `8a526Vqfx3hsafi3` | `icons/containers/misc/basket-simple-yellow.webp` | `chinchorro_canasto.webp` |
| 40 | Punzón de hueso | `MX9mAxfkdCwvEvkZ` | `icons/commodities/bones/tooth-spiked-brown.webp` | `chinchorro_punzon_hueso.webp` |

**Propuesta:** futura sustitución SOLO del valor `img` para estos nueve documentos. Los nombres, descripciones, procedencias, datos de CSB, `flags`, IDs y carpetas quedan idénticos. **Esto no autoriza aún cambiar ítems.**

### Entregables nuevos
1. `manifests/equipo-comun-candidatos-solo-img-20261121.json`: registra por Item ID, UUID, cultura, tipo, carpeta, `hipera_tipo`, `img` original, WebP candidato, SHA-256 y operación futura solo-img.
2. `tools/qa_equipo_comun_export_readonly.py`: coteja export original de Foundry con ese manifiesto y `TRANSFER_MANIFEST.json`; rechaza IDs, nombres, imágenes previas o tipos que no coincidan; no escribe datos.
3. `tools/foundry/qa-equipo-comun-readonly.js`: **actualizado** para revisar también el `img` preexistente, el tipo de ítem y la carpeta, además de los nueve nombres, IDs y cargas de imágenes.
4. `tools/qa_equipo_comun_readonly.py`: anterior chequeo técnico de 29 WebP, que admite ausencia de PNG maestros y deja QA en estado incompleto hasta resolver runtime.

### Límites del cotejo
- Los nueve ID/imagen previa fueron cotejados con el export indexado, pero **el validador recién creado no se ha ejecutado aún contra el JSON íntegro local**; ese export no tuvo una ruta autorizada de bytes en el contenedor actual.
- La macro de Foundry **tampoco se ha ejecutado en un mundo aislado**.
- La comprobación de SHA-256, VP8L, 256×256 y alfa para 9 WebP sí se efectuó directamente contra GitHub el 21-11.
- Un staging WebP puede estar en el repositorio y no estar servido por el ZIP de instalación; la macro lo detecta, no lo corrige.
- La revisión visual de bordes, halo, contraste sobre fondo claro/oscuro en Foundry sigue pendiente.
- No hay nueva CI comprobada asociada a este cambio documental; los checks aún no informan resultado para el último commit.

### Próximo paso executable
1. En un checkout local del repositorio que tenga acceso **privado** al export `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`, ejecutar:
   `python3 tools/qa_equipo_comun_export_readonly.py /ruta/al/export.json`
2. Ejecutar preflight de imágenes:
   `python3 tools/qa_equipo_comun_readonly.py`
3. Con módulo prototipo y compendio histórico disponibles en un **mundo Foundry V14 aislado**, ejecutar la macro `tools/foundry/qa-equipo-comun-readonly.js` (solo lectura) y conservar el JSON de resultado.
4. Realizar la prueba visual, cotejar resultados y aprobar **separadamente** la promoción de WebP y el cambio de nueve rutas `img`.
5. No modificar ni publicar `main`, Bridge, módulo estable, mundo productivo o Estado Maestro.

### Cierre
**Decisiones:** fijadas la preservación de 31 imágenes existentes y la propuesta de nueve sustituciones solo-img condicionadas a QA.
**Pendientes:** bytes del export accesibles para la herramienta, preflight local, QA Foundry y aprobación de promoción.
**Fuentes:** export Foundry de 19-11; manifiesto de transferencia; checkpoint v03; aclaración v05; banco de 20; matriz candidata de nueve.
**Estado Maestro:** intacto.
