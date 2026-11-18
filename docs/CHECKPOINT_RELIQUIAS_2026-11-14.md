# Checkpoint — Compendios nativos / Reliquias

Fecha: 2026-11-14  
Rama: `work/native-compendia-pipeline`  
PR: #1 — abierto, draft, sin merge.

## Decisiones
- Los 16 Items de Reliquias se incorporan como JSON individuales en `source/items/reliquias-legendarias/` y `source/items/reliquias-cotidianas/`.
- Se preservan íntegros IDs, nombres, textos, flags, rutas heredadas de imagen, `folder: null` y datos de origen.
- Las carpetas del repositorio no son carpetas Foundry.
- Tokicura permanece independiente en `source/items/reliquias/tokicura.json`.
- El validador usa las plantillas exportadas: coteja template ID, versión y campos editoriales de `system.props` con `system.body.contents[]`; no exige `system.body` en cada Item.
- No cambiar referencias runtime hasta que los binarios estén incorporados al módulo nuevo y sus hashes verificados.
- No modificar `main`, Forge productivo ni MELIAZ Bridge.

## Evidencia
- 16 JSON incorporados; IDs únicos.
- Git blob SHA-1 de cada JSON coincide con el contenido JSON normalizado del paquete fuente.
- Actions #78: SUCCESS — https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/43608571229
- SOURCE_PASS: 38 Items, 1 Actor, 1 JournalEntry.
- Compilación Foundry CLI 3.0.5: SUCCESS.
- ROUNDTRIP_PASS: 38 Items, 1 Actor, 1 JournalEntry; IDs/nombres/páginas coinciden.
- Artefacto: `HIPERAUSTRALIS_COMPENDIOS_PROTO_NATIVO_v0.1.5`
- Artifact ID: `14118988421`
- SHA-256: `31f56a9f4ebc32d4725066b6be7a6a9ea89469e1255efcd4faf5a8c91d6f968d`

## Pendientes
1. Incorporar los 16 WebP a `module/assets/reliquias/`, comprobando SHA-256 contra `manifests/reliquias-assets.json`.
2. Actualizar `img` y `flags.hiperaustralis-sheet.background` de los 16 Items a rutas del módulo nuevo sólo después de verificar los binarios.
3. Ejecutar Actions y revisar nuevo artefacto.
4. QA de instalación y apertura en mundo de prueba Foundry V14 + CSB 6.0.2.
5. Continuar con los lotes restantes del corpus.

## Transferencia binaria preparada
Se preparó `HIPERAUSTRALIS_RELIQUIAS_ASSETS_16_WEBP_v01.zip`:
- 16 WebP originales, sin transformación.
- 8 legendarias y 8 cotidianas.
- Incluye README y SHA256SUMS.
- Tamaño: 1.174.756 bytes.
- SHA-256 ZIP: `7eaaba005bbfa8239a094b9609f672b86fb423377ee48770ec78bcd562191b73`.

**Acción requerida del usuario:** subir ese ZIP desde la interfaz web de GitHub al repositorio, en la rama `work/native-compendia-pipeline`, con ruta exacta `source-original/reliquias-assets-16-webp-v01.zip`. No hace falta volver a adjuntar el ZIP histórico 0.4.76 al chat: ya está disponible y fue procesado. Tras la carga, continuaré con extracción controlada, verificación de los 16 hashes, rutas runtime y nuevo build.

## Fuentes
- `HIPERAUSTRALIS_COMPENDIOS_0.4.76_FAUNA_52_AUDITADA_LAB (3).zip`
- `HIPERAUSTRALIS_RELIQUIAS_SOURCE_16_ITEMS_v01.zip`
- `manifests/reliquias-assets.json`
- `docs/AUDITORIA_RELIQUIAS_TOKICURA_2026-11-13.md`
- `source-original/foundry-templates/fvtt-Item-_hiperaustralis-reliquia-HipRelqTpl000001.json`

## Cambios al Estado Maestro
Ninguno. Se actualizan sólo documentos operativos de migración en la rama de trabajo; no se modifica el Estado Maestro ni se promueve contenido a canon.
