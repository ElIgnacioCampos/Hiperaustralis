# Auditoría funcional — instalador y module.json 0.4.75

Fecha: 2026-11-12  
Fuente: `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip`  
SHA-256 ZIP: `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`  
Rama: `work/native-compendia-pipeline`

## 1. Resultado ejecutivo

**No ejecutar este instalador en el mundo productivo.** `scripts/install.js` se registra mediante `Hooks.once("ready", ...)` y, en el arranque de Foundry, ejecuta una secuencia extensa de sincronización de compendios. Requiere GM y Custom System Builder. No es una herramienta de importación territorial aislada.

El script puede crear compendios del mundo, crear y actualizar documentos, cambiar carpetas e imágenes, reemplazar páginas de Journals y eliminar documentos o un compendio antiguo. No se ejecutó durante esta auditoría.

## 2. module.json

Valores declarados:
- ID: `hiperaustralis-rituales`
- Título: `Hiperaustralis · Compendios`
- Versión interna: `0.4.74`
- Compatibilidad: Foundry mínimo 13, verificado 13
- Sistema: `custom-system-builder`, mínimo 5.2.1
- Script de arranque: `scripts/install.js`

**Discrepancia:** el archivo ZIP recibido se identifica como 0.4.75, pero `module.json` declara 0.4.74. No inferir que el paquete y la versión interna son equivalentes. Resolver antes de empaquetar/publicar.

## 3. Comportamiento de arranque

Hay dos hooks `ready`:
1. Expone `globalThis.hiperaRepararBiomas` para recuperación manual del GM.
2. Ejecuta automáticamente el instalador principal si el usuario es GM y el sistema es CSB.

La secuencia automática ejecuta mantenimiento histórico y varios sembradores de catálogos. El bloque territorial no está aislado del resto del instalador.

## 4. Efectos territoriales y de naturaleza

### 4.1 Items Flora y Fauna

`seedHiperaNaturalItemsV043()`:
- Crea o recupera el compendio de mundo `world.hiperaustralis-naturaleza-items`.
- Prepara templates Flora y Fauna.
- Lee `flora_items.json` y `fauna_items.json`.
- Crea/actualiza Items por `seedId`; como compatibilidad, puede emparejar por nombre exacto si no encuentra seedId.
- Asigna carpetas de primer nivel `Flora` y `Fauna`.
- Actualiza el documento completo mediante `Item.implementation.updateDocuments` cuando encuentra uno existente, incluyendo sus datos e imagen fuente.
- No crea la jerarquía `Territorio / Flora / Fauna / Funga / Recetas`.

**Riesgo:** una ejecución sincroniza el contenido de los Items existentes con el JSON fuente; no es sólo una operación aditiva.

### 4.2 Items Biomas

`seedHiperaBiomasIndependientes()`:
- Carga `biomas_items.json` y exige exactamente ocho registros.
- Prepara el template `HipBiomaTpl00001`.
- Usa el mismo compendio `world.hiperaustralis-naturaleza-items`.
- Crea/actualiza ocho Items por código BIO-001…BIO-008.
- Los coloca en la carpeta de primer nivel `Biomas`.
- Verifica que existan ocho registros después de la sincronización.

Se ejecuta dos veces en el arranque: primero como reparación BIO prioritaria y otra vez en el bloque específico BIO. También queda expuesta una función manual al GM.

**Riesgo:** la sincronización actualiza Items existentes por código y puede sobrescribir sus datos con los JSON fuente. No existe aquí una aprobación editorial automática.

### 4.3 Journal de Naturaleza unificado

`seedHiperaNaturalezaJournalUnificado()`:
- Construye un JournalEntry `Naturaleza — Fauna, Flora y Funga` con tres páginas.
- Actualiza el JournalEntry sembrado reemplazando sus páginas.
- Después elimina los Journals con seedId `journal-fauna-32-v1` y `journal-flora-corredor-austral-v1`.
- Intenta eliminar el compendio de mundo `world.hiperaustralis-flora-y-funga`.

Este paso se ejecuta automáticamente en el arranque.

**Riesgo alto:** el instalador elimina deliberadamente los Journals separados de Fauna y Flora y el compendio antiguo de Flora y Funga tras verificar el Journal unificado. Esto contradice una estrategia de migración que pretenda conservar separadas las estructuras hasta completar el cotejo y la aprobación. No ejecutar esta función en el entorno productivo sin decidir expresamente el destino de esos documentos.

### 4.4 Journals generales

`seedHiperaJournalsCompendium()`:
- Crea/recupera `world.hiperaustralis-journals`.
- Actualiza páginas de Journals gestionados por seed.
- Elimina documentos con seeds antiguos específicos: `auspicio-*` y `mama-qocha-provisional`.
- Excluye del sembrado general dos Journals concretos de Fauna y Flora, que se manejan en el proceso de unificación anterior.

No confundir este compendio con el JournalEntry general de navegación territorial `Biomas → Territorios` que se ha definido como estructura separada en la arquitectura de destino.

## 5. Otros efectos no territoriales

El hook principal también llama rutinas de mantenimiento para:
- Rituales y Reliquias.
- Armas.
- Equipo e Instrumentos.
- Material aprobado y Defensas.
- Plantilla de Actor Kona y pregenerados.
- Bestiario.
- Adversarios Mapuche.
- Presencias.
- Fichas Rival.

Estas rutinas pueden crear o actualizar compendios y documentos del mundo. La revisión territorial no valida su seguridad ni su corrección funcional.

## 6. Organización de carpetas

El instalador crea carpetas de primer nivel en distintos compendios. Para Naturaleza (Items), las carpetas creadas por las rutinas inspeccionadas son `Flora`, `Fauna` y `Biomas`.

La función `organizeHiperaCompendiumFolders()` declara explícitamente desactivada la organización automática de subcarpetas por compatibilidad Foundry 13. Por tanto, el instalador no implementa la jerarquía territorial anidada solicitada.

La estructura de destino debe construirse y validarse en un proceso independiente, preservando las identidades documentales y sin asumir que la ejecución del instalador la creará.

## 7. Hallazgos y decisiones técnicas

| Hallazgo | Evaluación | Acción |
|---|---|---|
| Hook automático en `ready` | Riesgo operativo alto | No ejecutar en mundo productivo |
| Actualización completa de Items por seedId | Puede sobrescribir cambios locales | Migrar con control de diff y respaldo |
| Emparejamiento alternativo por nombre exacto | Puede asociar documento incorrecto si hay ambigüedad | No usar como identidad primaria |
| BIO sembrado dos veces | Redundante; actualización repetida | Simplificar sólo en una futura versión aprobada |
| Unificación y eliminación de Journals | Destructivo | No ejecutar hasta decidir conservación |
| Eliminación de compendio antiguo | Destructivo | No ejecutar hasta respaldar y cotejar |
| Subcarpetas automáticas desactivadas | No satisface jerarquía destino | Implementar migración separada |
| ZIP 0.4.75 / module.json 0.4.74 | Versionado inconsistente | Resolver antes de publicar |

## 8. Recomendación

No reutilizar `scripts/install.js` como mecanismo de migración territorial. Separar una herramienta de migración controlada que:
1. opere sobre una copia aislada del mundo o sobre datos exportados;
2. inventaríe primero documentos, carpetas, IDs, UUID y referencias;
3. cree la estructura destino sin borrar fuentes;
4. preserve los IDs cuando sea técnicamente posible y registre equivalencias cuando no;
5. aplique actualizaciones sólo tras comparar fuente y destino;
6. valide recuentos, rutas, referencias y contenido;
7. deje las operaciones de eliminación para una etapa posterior, explícita y aprobada.

## 9. Límites de esta auditoría

- Revisión estática del código y del manifiesto; no se ejecutó JavaScript.
- No se probó compatibilidad real en Foundry 13 ni CSB.
- No se inspeccionó el contenido de un mundo productivo.
- No se verificaron IDs/UUID existentes en compendios persistentes del mundo.
- No se modificaron binarios, documentos fuente, `main`, Forge, Bridge ni Estado Maestro.

## Cierre

**Decisión operativa:** el instalador 0.4.75 queda clasificado como sincronizador amplio de catálogos con efectos destructivos sobre Journals antiguos. Se mantiene fuera de cualquier prueba productiva. La migración territorial debe implementarse como proceso separado, reversible y con inventario previo.
