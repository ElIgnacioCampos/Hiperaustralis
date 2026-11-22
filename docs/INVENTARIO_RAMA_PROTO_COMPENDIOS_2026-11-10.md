# Inventario de rama y reconciliación del prototipo

Fecha: 2026-11-10
Rama inspeccionada: `work/native-compendia-pipeline`
Commit inspeccionado: `3c6436dc15bf4e4e18cd5b9c4d89be9c420f218a`
Alcance: árbol Git completo, manifiesto, fuentes, workflow, README y estado del PR.
No se modificó código de compilación, módulo estable, MELIAZ Bridge ni `main`.

## 1. Resultado del inventario Git

Árbol completo consultado con respuesta no truncada: 22 entradas (incluidos directorios). Archivos presentes:

| Ruta | Hallazgo |
|---|---|
| `.github/workflows/compile-native-packs.yml` | Workflow de tres packs, nombres y ZIP fijados al prototipo |
| `README.md` | Texto obsoleto; corregido en este commit |
| `README_FORGE_CLOUD_BUILD.md` | Describe correctamente el flujo de prueba de tres packs |
| `docs/AUDITORIA_PIPELINE_COMPENDIOS_2026-11-10.md` | Auditoría técnica previa |
| `docs/COMPENDIOS_TERRITORIO_PROCEDENCIA.md` | Arquitectura territorial y procedencia |
| `docs/CONTRATO_DATOS_COMPENDIOS_NATIVOS_v0.1.md` | Contrato de datos en borrador, no aprobado |
| `docs/EDITORIAL_AUDIT_BACKLOG.md` | Auditoría editorial pendiente |
| `module/module.json` | Manifiesto ID prototype, versión 0.1.5 |
| `prepare_sources.py` | Preparación de campos temporales CLI |
| `validate_sources.py` | Validador específico de los tres fixtures |
| `validate_compiled.py` | Round-trip limitado a IDs, nombres y páginas |
| `source/items/01_cuchillo_piedra.json` | Fuente Item presente |
| `source/actors/01_ladron_oportunista.json` | Fuente Actor presente |
| `source/journals/01_auspicios_hiperaustralis.json.gz.b64` | Journal comprimido; workflow lo restaura como JSON |

No existen todavía en este árbol manifiestos declarativos de colecciones, assets, relaciones o equivalencias de IDs; tampoco existe corpus territorial migrado ni un inventario de assets.

## 2. Reconciliación README / CI

El README anterior decía que el repositorio estaba vacío y que no había packs LevelDB compilados. Esa descripción ya no correspondía al estado de la rama: había tres fuentes fixture, un workflow operativo y evidencia de CI SUCCESS. Se actualizó el README para describir el estado real sin afirmar QA de runtime.

El README_FORGE_CLOUD_BUILD y el workflow coinciden en que se trata de una prueba aislada de tres packs, no de una migración completa.

El workflow no se dispara por cambios en `docs/**`; por tanto, los commits documentales recientes no generan por sí solos una nueva compilación. Esto es coherente con el alcance actual del workflow.

## 3. Estado de las fuentes fixture

- Item: `HipArm01PackA000`, Cuchillo de piedra.
- Actor: `1ad8f2de41a35138`, Ladrón oportunista.
- JournalEntry: Auspicios Hiperaustralis, 21 páginas, almacenado como gzip/base64 y restaurado en CI.

Los dos JSON legibles tienen referencias a imágenes dentro de `modules/hiperaustralais-rituales/assets/...`. El Item también conserva referencias en flags a ese módulo. El Actor tiene referencias en `img` y `prototypeToken.texture.src`. Por tanto, el prototipo **no es autónomo** al instalarse sin el módulo antiguo.

Los fixtures conservan campos y flags de CSB/MELIAZ y referencias históricas. No deben editarse por limpieza estética ni transformarse en fuentes canónicas de producto sin cotejo con el origen.

## 4. Límites de validación confirmados

El workflow compila exactamente:
- `ha-proto-items` (Item);
- `ha-proto-actors` (Actor);
- `ha-proto-journals` (JournalEntry).

El validador de fuentes aplica reglas específicas a estos fixtures. El round-trip compara ID, nombre y cantidad de páginas; no acredita equivalencia completa de payload, flags, HTML, relaciones ni recursos.

CI SUCCESS demuestra que el flujo automatizado pudo completar la compilación y comprobaciones implementadas para los commits probados. No demuestra instalación, navegación, búsqueda, drag-and-drop ni apertura correcta en Foundry/Forge.

La API de Actions consultada muestra el run `42756916861` SUCCESS sobre commit `a09934e55b5e5cb0a85cf5ca45fbf7d41a047f55`. El commit documental actual `3c6436d` no tiene una nueva ejecución asociada porque sólo cambió documentación fuera de las rutas del trigger.

## 5. Pull request

PR #1 permanece abierto y no fusionado, con base `main` y head `work/native-compendia-pipeline`. La descripción del PR conserva evidencias de ejecución anteriores; debe tratarse como historial del prototipo y no como garantía de que el ZIP/artefacto descrito corresponda al HEAD documental actual.

No se mergea ni publica release.

## 6. Dictamen

1. El prototipo se conserva como fixture técnico.
2. No ampliar sus validadores mediante más excepciones específicas; sustituirlos por validadores declarativos después de aprobar el contrato.
3. No reutilizar sus rutas de assets en el módulo nuevo.
4. El Journal comprimido es aceptable como transporte heredado de este fixture, no como formato editorial maestro.
5. No hay corpus real disponible en la rama; la siguiente fuente de contenido debe proceder de ZIP históricos recuperados y cotejados.
6. El README se corrigió; el workflow, manifiesto y fixtures permanecen intactos.

## 7. Próximo orden de trabajo

1. Revisar el contrato de datos v0.1 y registrar aprobación/correcciones.
2. Recuperar ZIP históricos prioritarios desde las ubicaciones de respaldo documentadas, cuando exista acceso efectivo.
3. Cotejar los paquetes por hashes y contenido; no asumir acumulación por número de versión.
4. Inventariar documentos, imágenes, rutas, referencias y procedencia.
5. Definir catálogo real de packs a partir del inventario.
6. Implementar pipeline y validadores nuevos en esta rama, conservando el prototipo como regresión.
7. Ejecutar QA de runtime en mundo limpio y Forge.

## Registro de cierre

- **Decisiones:** árbol Git completo inventariado; README actualizado; prototipo retenido como fixture.
- **Pendientes:** contrato sin aprobación; ZIP históricos no disponibles en este entorno; corpus y assets sin migrar; runtime QA pendiente.
- **Fuentes:** árbol Git de la rama, README, workflow, manifiesto, scripts, fuentes Item/Actor, documentación de arquitectura y contrato.
- **Cambios al Maestro:** ninguno.
