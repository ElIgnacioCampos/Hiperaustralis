# Arquitectura territorial — JournalEntry, Items y assets

Estado: especificación de trabajo para el módulo independiente de compendios nativos.
Rama: `work/native-compendia-pipeline`.
Alcance: separación de estructuras territoriales, taxonomía, procedencia de assets y contrato de migración.
No autoriza despliegue en el mundo productivo ni modificación de `main`, MELIAZ Bridge o del módulo estable.

## 1. Separación de estructuras

La migración contempla dos estructuras distintas que comparten el concepto y nombre visible de Territorio. No deben fusionarse:

### A. JournalEntry — Biomas → Territorios

- Existe un JournalEntry actualmente identificado como **Biomas**.
- Su nombre visible será renombrado a **Territorios**.
- Es una estructura de consulta/navegación territorial de tipo Foundry `JournalEntry`.
- El cambio de nombre no lo convierte en un compendio de Items ni implica trasladar sus contenidos a la carpeta de Items.
- Deben conservarse sus IDs y referencias internas, salvo cambios expresamente justificados y registrados.

### B. Carpeta de Items — Territorio

- Existe una carpeta **Territorio** dentro de la estructura de documentos de tipo Foundry `Item`.
- Esta carpeta contiene las subcarpetas territoriales y sus documentos Item.
- Su estructura es independiente del JournalEntry anterior.
- No renombrar ni convertir esta carpeta en JournalEntry.
- No inferir que las subcarpetas de Items son páginas o carpetas internas del Journal.

## 2. Territorios y subcarpetas de Items

La carpeta de Items `Territorio/` organiza los ocho territorios del Corredor:

1. Titicaca — Altiplano lacustre
2. Paititi — Bosque nublado
3. Ngulumapu — Bosque lluvioso
4. Pewenmapu — Cordillera volcánica
5. Patagonia austral
6. Tierra del Fuego
7. Canales australes
8. Umbral Polar

Cada territorio contiene estas cuatro subcarpetas editoriales:

- `Flora/`
- `Fauna/`
- `Funga/`
- `Recetas/`

Estructura prevista:

```text
Items/
  Territorio/
    Titicaca/
      Flora/
      Fauna/
      Funga/
      Recetas/
    Paititi/
      Flora/
      Fauna/
      Funga/
      Recetas/
    Ngulumapu/
      Flora/
      Fauna/
      Funga/
      Recetas/
    Pewenmapu/
      Flora/
      Fauna/
      Funga/
      Recetas/
    Patagonia austral/
      Flora/
      Fauna/
      Funga/
      Recetas/
    Tierra del Fuego/
      Flora/
      Fauna/
      Funga/
      Recetas/
    Canales australes/
      Flora/
      Fauna/
      Funga/
      Recetas/
    Umbral Polar/
      Flora/
      Fauna/
      Funga/
      Recetas/
```

La estructura se prepara para los ocho territorios aunque alguna subcarpeta todavía no tenga documentos aprobados. Una carpeta vacía es preferible a inventar contenido para llenarla. La presencia de una carpeta no demuestra que sus documentos o assets ya hayan sido migrados.

## 3. Contrato de clasificación y procedencia de assets

Cada asset territorial migrado debe quedar asociado a:

- territorio de procedencia;
- subcategoría cuando corresponda: Flora, Fauna, Funga o Recetas;
- familia visual (BIO-RUP, fotografía, ilustración, mapa u otra);
- identificador estable del recurso;
- nombre y descripción editorial disponibles;
- ruta de origen;
- ruta de destino;
- hash SHA-256;
- estado de verificación;
- evidencia que respalda la procedencia y clasificación.

La procedencia se determina por fuentes, metadatos o documentación editorial verificable. No se infiere únicamente por apariencia visual, semejanza o conocimiento general.

Estados permitidos:

- `verified`: procedencia y clasificación respaldadas.
- `pending_provenance`: no hay evidencia suficiente para asignar territorio.
- `pending_category`: territorio conocido, clasificación no resuelta.
- `excluded_from_migration`: recurso que pertenece a otro banco visual o no corresponde a esta taxonomía.

Los recursos pendientes no se descartan ni se asignan por conjetura. Se registran en un inventario de pendientes con su ruta original.

## 4. Separación de familias visuales

Los iconos rupestres territoriales (familia BIO-RUP) se gestionan como una familia propia.

Deben permanecer separados:

- fotografías de biomas y paisajes;
- ilustraciones editoriales que no sean iconos BIO-RUP;
- mapas;
- otros recursos gráficos de interfaz o ambientación.

Una fotografía no se convierte en icono rupestre por representar flora, fauna o funga. La clasificación taxonómica de un recurso no autoriza cambiar su familia visual ni heredar aprobaciones editoriales de otra familia.

Los assets pueden estar vinculados tanto a documentos del JournalEntry como a Items. Cada referencia debe inventariarse y migrarse según su destino real; no se debe asumir que ambos tipos comparten las mismas rutas o el mismo registro de procedencia.

## 5. Integridad de la migración

Antes de mover un recurso:

1. inventariar el archivo y su ruta de origen;
2. calcular y registrar SHA-256;
3. identificar referencias entrantes y documentos que lo usan, distinguiendo JournalEntry e Item;
4. resolver territorio, subcategoría y familia visual con evidencia;
5. copiarlo a la ruta de destino conservando el original durante la transición;
6. actualizar las referencias de forma controlada;
7. validar que el recurso exista, se resuelva y conserve su integridad;
8. retirar duplicados sólo después de QA y aprobación.

No se borran originales durante la fase de inventario o migración. No se renombra ni altera un ID estable sin una tabla explícita de equivalencias.

## 6. Contrato de interfaz y nombres

- El JournalEntry actualmente llamado **Biomas** se presentará como **Territorios**.
- La carpeta de Items conserva el nombre **Territorio**.
- Ambos accesos deben seguir apuntando a sus respectivos tipos y documentos Foundry.
- Las selecciones persistentes deben guardar UUID de documentos, no nombres ni posiciones de lista.
- No se crean documentos de relleno para carpetas sin contenido aprobado.
- Las referencias de recursos deben apuntar a las rutas canónicas nuevas una vez que la migración esté validada.
- Los nombres visibles conservan la grafía editorial. Los nombres técnicos de carpetas y slugs deberán normalizarse de forma consistente, sin alterar los nombres visibles ni los identificadores históricos.

## 7. Condiciones para ampliar el pipeline

El pipeline actual de tres packs es un prototipo técnico, no el inventario del producto final. Antes de considerarlo candidato de distribución debe:

- tratar JournalEntry y Item como estructuras independientes;
- soportar el renombre visible Biomas → Territorios sin alterar IDs;
- preservar la carpeta Item `Territorio` y sus ocho ramas con cuatro subcarpetas;
- aceptar el corpus completo y múltiples familias de documentos;
- validar IDs únicos y referencias entre documentos;
- validar la taxonomía territorial y los estados de procedencia;
- detectar recursos ausentes, rutas rotas y referencias obsoletas;
- emitir manifiestos de documentos y assets con origen, destino, SHA-256 y estado;
- compilar packs nativos y realizar round-trip de verificación;
- producir un ZIP autónomo, sin depender de rutas del módulo antiguo;
- mantener separados los recursos BIO-RUP, fotografías, mapas y otros bancos;
- superar QA en un mundo Foundry aislado y luego en Forge antes de cualquier sustitución.

## 8. Límites de evidencia actuales

La reconciliación del corpus registra un conjunto de carpetas de Territorio en la exportación, pero no acredita por sí sola que las rutas nuevas de assets estén incorporadas en GitHub ni que todos sus documentos hayan sido recuperados. Esta especificación no afirma que los assets ya hayan sido migrados ni que el corpus esté completo.

La integración real requiere recuperar y cotejar los paquetes fuente priorizados, construir inventarios separados para JournalEntry, Items y assets, y resolver procedencias con evidencia. Hasta entonces, el código no debe fabricar registros ni asumir que una versión histórica contiene acumulativamente todas las anteriores.

## 9. Criterio de aceptación

Este documento fija la arquitectura de destino. No certifica migración ejecutada, contenido completo, prueba en Forge ni autorización de reemplazo.

Para cerrar la migración deberán existir:

- inventario del JournalEntry Biomas/Territorios y sus referencias;
- inventario de la carpeta Item Territorio y sus documentos;
- inventario completo de assets;
- matriz de procedencia, clasificación y familia visual;
- registro de pendientes;
- manifiestos de rutas y hashes;
- referencias actualizadas y verificadas por tipo de documento;
- compilación reproducible;
- QA de contenido y runtime;
- paquete autónomo validado.

## Registro de cierre

**Decisiones registradas en esta especificación:**
- JournalEntry Biomas cambia su nombre visible a Territorios.
- La carpeta de Items Territorio permanece separada.
- Cada uno de los ocho territorios de Items contempla Flora, Fauna, Funga y Recetas.

**Pendientes:**
- cotejar el contenido real y los IDs de ambas estructuras contra la exportación primaria;
- recuperar y verificar las rutas de assets por territorio;
- generar manifiestos de referencias y hashes;
- validar compilación y runtime.

**Cambios al Estado Maestro:** ninguno. Esta actualización sólo corrige la especificación de migración en la rama de trabajo.
