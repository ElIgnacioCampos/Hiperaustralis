# Contrato de datos — Compendios nativos Hiperaustralis

Estado: BORRADOR TÉCNICO v0.1 · sujeto a revisión y aprobación.
Fecha: 2026-11-10
Rama: `work/native-compendia-pipeline`
Alcance: modelo de fuentes, identidad, relaciones, clasificación, assets y catálogo declarativo.
No modifica el Estado Maestro, el módulo estable, `hiperaustralais-rituales`, MELIAZ Bridge ni `main`.

## 1. Principios de arquitectura

1. La fuente editorial legible es la autoridad de contenido; los packs compilados son artefactos de distribución.
2. El tipo nativo Foundry, la clasificación editorial, la procedencia territorial y la familia visual son dimensiones separadas.
3. Un documento puede tener relaciones con otros documentos nativos sin duplicar su contenido.
4. Las relaciones se expresan mediante identificadores estables de fuente y se resuelven a UUID Foundry durante el build.
5. Ningún dato, documento, vínculo, probabilidad, recurso o categoría se inventa para completar una estructura.
6. El esquema admite tipos Foundry diferentes, pero sólo se activan en el catálogo los que tengan contenido real y justificado.
7. Se conserva trazabilidad entre identificadores históricos, identificadores de fuente y documentos compilados.
8. El módulo nuevo debe ser autónomo: ninguna ruta runtime puede depender del módulo antiguo.

## 2. Tres capas de identidad

Cada registro de fuente tendrá:

- `sourceId`: identificador lógico permanente y legible por máquina, único en todo el corpus. No depende del nombre, carpeta, título ni posición.
- `foundryId`: `_id` de Foundry, estable dentro del pack de destino. Debe cumplir las restricciones del tipo de documento/Foundry CLI y ser único dentro del pack. No se genera a partir del título sin una regla determinista documentada.
- `legacyIds`: cero o más identificadores anteriores conservados literalmente, con origen y estado de resolución.

Al compilar, Foundry expone el UUID completo del documento. El UUID se registra en el manifiesto de salida y se usa para vínculos persistentes en hojas, flags o datos de usuario. No se guardan nombres ni índices de lista como sustitutos de identidad.

### Regla de migración

- Si un ID histórico sigue siendo válido y no colisiona, se conserva.
- Si debe cambiar, se registra una correspondencia explícita `legacyId → sourceId → foundryId → compendiumUuid`.
- Una colisión no se resuelve sobrescribiendo: se detiene el lote y se documenta.
- Renombrar una carpeta o etiqueta no cambia la identidad del documento.

## 3. Sobre común de fuente

Cada documento fuente usa un sobre editorial común, separado del payload nativo Foundry:

```json
{
  "schemaVersion": "1.0",
  "sourceId": "ha:namespace:stable-key",
  "foundry": {
    "documentType": "JournalEntry",
    "pack": "pack-id",
    "foundryId": "stableFoundryId"
  },
  "editorial": {
    "title": "Título visible",
    "status": "approved",
    "classification": [],
    "territory": null,
    "subcategory": null,
    "sources": []
  },
  "provenance": {
    "status": "verified",
    "origin": [],
    "evidence": []
  },
  "assets": [],
  "relations": [],
  "document": {}
}
```

Es un patrón ilustrativo, no un registro de contenido ni una plantilla que deba copiarse con valores ficticios. Los campos opcionales se omiten o quedan nulos sólo cuando el esquema lo permita; no se rellenan por conveniencia.

### Campos comunes

| Campo | Función | Regla |
|---|---|---|
| `schemaVersion` | Versión del esquema de fuente | Obligatorio |
| `sourceId` | Identidad lógica del registro | Obligatorio y globalmente único |
| `foundry.documentType` | Tipo nativo Foundry | Obligatorio |
| `foundry.pack` | ID del pack de destino | Obligatorio; debe existir en catálogo |
| `foundry.foundryId` | ID nativo estable | Obligatorio |
| `editorial.title` | Nombre visible | Obligatorio cuando el tipo lo requiera |
| `editorial.status` | Estado editorial | Obligatorio |
| `editorial.classification` | Clasificaciones editoriales no excluyentes | Opcional; vocabulario controlado |
| `editorial.territory` | Territorio relacionado/procedencia territorial | Opcional; no inferir |
| `editorial.subcategory` | Flora/Fauna/Funga cuando corresponda | Opcional; no forzar a otros tipos |
| `editorial.sources` | Fuentes documentales del contenido | Lista de referencias verificables |
| `provenance.status` | Estado de procedencia | Obligatorio para recursos clasificados territorialmente |
| `assets` | Recursos usados por el documento | Lista de referencias al manifiesto de assets |
| `relations` | Vínculos a otros registros | Lista tipada por relación |
| `document` | Payload nativo del tipo Foundry | Validado contra el tipo |

## 4. Estados editoriales y de procedencia

### Estado editorial

Vocabulario inicial, sin implicar aprobación de contenido por el mero hecho de existir el campo:

- `approved`: contenido aprobado para distribución.
- `review`: requiere revisión editorial/cultural/técnica.
- `draft`: borrador no distribuible.
- `deprecated`: sustituido; se conserva trazabilidad.
- `excluded`: excluido de este módulo, con motivo registrado.

Sólo `approved` entra en los packs públicos, salvo fixtures de prueba separados del corpus.

### Procedencia de recursos territoriales

Se reutilizan los estados ya fijados en `COMPENDIOS_TERRITORIO_PROCEDENCIA.md`:

- `verified`
- `pending_provenance`
- `pending_category`
- `excluded_from_migration`

No convertir un estado editorial en estado de procedencia ni viceversa. Un documento puede estar aprobado editorialmente y tener un asset con procedencia pendiente; ese asset no se distribuye como recurso territorial verificado.

## 5. Catálogo declarativo de packs

El catálogo vive en `manifests/collections.json` y define, por pack:

- `id`: nombre técnico único del pack;
- `label`: etiqueta visible;
- `documentType`: tipo nativo Foundry;
- `sourceGlob` o selector equivalente: fuentes incluidas;
- `visibility`: público/privado según necesidad real;
- `status`: active, planned o fixture;
- `description`: propósito del pack.

El compilador recorre el catálogo, no una lista de packs duplicada en cada script/workflow. Los validadores verifican que todos los packs referenciados existan y que el tipo de cada documento coincida con el pack.

### Tipos admitidos por el contrato

| Tipo Foundry | Uso | Condición |
|---|---|---|
| `JournalEntry` | Entradas editoriales, descriptivas, de consulta y referencia | Tipo base para contenidos documentales; no implica que toda entidad jugable sea sólo un Journal |
| `Actor` | Entidades con perfil operativo de actor en Foundry | Sólo cuando el contenido necesite ese comportamiento/perfil |
| `Item` | Objetos, armas, equipo, rituales u otros elementos que correspondan a Item | Según contrato específico de cada familia y compatibilidad CSB |
| `RollTable` | Tablas de resultados | Sólo si existen entradas y probabilidades reales aprobadas |
| Otros tipos nativos | Posibles extensiones | No activar hasta justificar el caso de uso y definir validación |

El prototipo actual `ha-proto-items`, `ha-proto-actors` y `ha-proto-journals` queda marcado como fixture técnico. No es el catálogo final ni determina los nombres definitivos de packs.

## 6. Separación de dimensiones editoriales

No colapsar estas dimensiones:

- **Tipo Foundry:** cómo se almacena y comporta el documento en Foundry.
- **Familia editorial:** Bestiario, Territorio, Flora, Fauna, Funga, Cultura, Ritual, Reliquia, Equipo, Tabla u otra clasificación respaldada por el corpus.
- **Clasificación ecológica:** por ejemplo Flora, Fauna, Otros habitantes o Presencias, conforme al vocabulario editorial vigente. No sustituir estas distinciones por el árbol de assets.
- **Territorio:** relación geográfica/editorial con uno o más de los ocho territorios.
- **Procedencia:** de dónde procede la información o el recurso y qué evidencia la respalda.
- **Familia visual:** BIO-RUP, fotografía, mapa, ilustración u otra familia documentada.

Una criatura puede tener un JournalEntry editorial y un Actor vinculado si necesita perfil físico/combatible. No se duplica el texto maestro ni se presume que toda entrada del Bestiario requiere Actor. Las tablas sólo se convierten en RollTable cuando su contenido contiene resultados y probabilidades reales.

## 7. Taxonomía Territorio

Se mantiene la estructura acordada:

- Titicaca — Altiplano lacustre
- Paititi — Bosque nublado
- Ngulumapu — Bosque lluvioso
- Pewenmapu — Cordillera volcánica
- Patagonia austral
- Tierra del Fuego
- Canales australes
- Umbral Polar

Cada territorio dispone de las subcarpetas de recursos `Flora/`, `Fauna/` y `Funga/`. La estructura puede existir aunque haya subcarpetas vacías.

La carpeta de assets no determina por sí sola el tipo Foundry del documento. Un JournalEntry de Flora puede referenciar un icono BIO-RUP, una fotografía o varios assets sin que esos recursos se conviertan en documentos Foundry independientes.

## 8. Contrato de relaciones

Las relaciones se declaran con `sourceId`, nunca con títulos ni posiciones:

```json
{
  "targetSourceId": "ha:namespace:other-stable-key",
  "type": "profile",
  "cardinality": "one"
}
```

Tipos de relación iniciales:

- `profile`: documento editorial ↔ perfil operativo (por ejemplo JournalEntry ↔ Actor).
- `related`: relación editorial sin dependencia funcional.
- `territory`: documento ↔ territorio.
- `asset`: documento ↔ recurso gráfico.
- `replaces`: documento vigente ↔ documento sustituido.
- `source`: documento ↔ fuente bibliográfica/documental.

Esta lista es un vocabulario técnico inicial. No implica que cada relación exista en el corpus. Si una relación requiere una semántica nueva, se documenta antes de usarla.

El build resuelve `targetSourceId` a UUID Foundry. Si el destino no existe, está excluido, tiene más de una coincidencia o pertenece a un pack no distribuido, el build falla. No se permite resolver por nombre como fallback.

## 9. Contrato de assets

Cada recurso tendrá un registro en `manifests/assets.json` con:

- `assetId`: identificador estable;
- `family`: BIO-RUP, photograph, map, illustration, ui u otra familia demostrada;
- `sourcePath`: ubicación original;
- `targetPath`: ruta dentro del módulo nuevo;
- `sha256`: hash del archivo de origen y del destino;
- `mimeType`, dimensiones y tamaño cuando corresponda;
- `provenance.status`, territorio/subcategoría si aplica y referencias de evidencia;
- `status`: approved, review, excluded;
- `usedBy`: sourceIds de documentos que lo referencian.

Reglas:

1. Copiar y verificar hash antes de actualizar referencias.
2. Mantener originales durante la migración y QA.
3. No deducir procedencia por apariencia.
4. No mezclar familias visuales ni heredar aprobaciones.
5. Toda ruta referenciada debe existir en el paquete final y resolver desde Foundry.
6. El paquete debe funcionar sin el módulo antiguo instalado.

## 10. Campos específicos de cada tipo

El sobre común no sustituye el esquema nativo. Cada tipo dispone de validación independiente:

- **JournalEntry:** páginas, orden, tipo de página, contenido, flags y referencias. Se preservan estructura y formato editorial del origen; no aplanar páginas sin autorización.
- **Actor:** tipo de actor, sistema/CSB, datos mecánicos realmente usados, prototipo de hoja, imágenes y vínculos. No agregar estadísticas por analogía con PJ ni reintroducir BRP.
- **Item:** tipo de objeto, sistema/CSB, descripción, datos funcionales, imagen, propiedades y referencias. No inventar propiedades ausentes.
- **RollTable:** resultados, pesos/probabilidades, referencias de resultado y configuración. No crear tablas desde listas sin probabilidades aprobadas.

Los campos concretos de MELIAZ/CSB se fijan cotejando fuentes canónicas y hojas vigentes; este contrato no redefine mecánicas ni crea un modelo genérico de estadísticas.

## 11. Organización de fuentes y compilación

Estructura destino prevista:

```text
manifests/
  collections.json
  assets.json
  relations.json
  id-map.json
source/
  journals/
  actors/
  items/
  rolltables/
assets/
  bio-rup/
  photographs/
  maps/
  illustrations/
scripts/
  validate_sources.py
  validate_relations.py
  validate_assets.py
  prepare_foundry.py
  validate_compiled.py
module/
  module.json
  packs/
docs/
dist/  # artefactos generados; no fuente editorial
```

Los directorios por tipo son contenedores técnicos. La clasificación editorial y territorial se conserva en metadatos y manifiestos, evitando duplicar fuentes para cada territorio o categoría.

El contenido fuente debe ser legible y revisable en Git. La compresión, codificación temporal u otros formatos de transporte se aplican sólo durante build.

## 12. Validaciones obligatorias

El pipeline final debe fallar ante:

- sourceId duplicado globalmente;
- foundryId duplicado dentro de un pack;
- tipo documental incompatible con el pack;
- pack inexistente o no activo;
- relación a sourceId inexistente o excluido;
- UUID de salida no resoluble;
- asset ausente, hash distinto o ruta rota;
- asset territorial sin procedencia suficiente;
- familia visual mezclada o clasificación contradictoria;
- documento no aprobado incluido en pack distribuible;
- referencia al módulo antiguo;
- pérdida semántica en round-trip;
- diferencias de páginas, flags, contenido, datos de sistema o relaciones;
- campos obligatorios ausentes según el tipo nativo.

Los warnings no pueden degradar silenciosamente un error de integridad a una advertencia. Las excepciones deben estar justificadas y acotadas a registros concretos.

## 13. Compatibilidad y seguridad

- Objetivo técnico actual: Foundry V14, entorno verificado 14.367; CSB 6.0.2 en el entorno del proyecto.
- El contrato no fija todavía ID ni versión definitiva del módulo.
- El prototipo permanece aislado como fixture.
- No modificar `main`, no mergear PR #1, no publicar release.
- No instalar sobre el mundo productivo.
- No modificar el módulo estable ni MELIAZ Bridge.
- La QA de CI no sustituye la prueba en mundo Foundry limpio ni en Forge.

## 14. Pendientes antes de implementar

1. Revisar el árbol completo de la rama y resolver la discrepancia entre README, manifiesto y workflow.
2. Recuperar los ZIP históricos prioritarios y cotejar contenido/hash; la Biblioteca documenta su existencia, pero no contiene actualmente sus bytes.
3. Cotejar los campos de cada familia documental contra fuentes canónicas y el módulo antiguo sin alterar su contenido.
4. Definir los nombres definitivos de packs a partir del inventario real, no por anticipación.
5. Aprobar este contrato antes de implementarlo como esquema obligatorio.
6. Determinar cómo se materializan los UUID finales en los vínculos persistentes de la hoja y validar el ciclo de vida de esos vínculos en Foundry.

## 15. Criterio de aceptación

El contrato queda listo para implementación cuando:
- cada campo obligatorio tiene definición y validador;
- los tipos nativos están vinculados a casos reales;
- los IDs y relaciones tienen una estrategia de migración comprobable;
- la taxonomía no contradice el canon editorial;
- los assets tienen procedencia y política de integridad;
- el catálogo declarativo puede generar packs sin listas duplicadas;
- la aprobación del usuario queda registrada.

Este documento es un borrador técnico. No autoriza por sí solo migración, instalación, sustitución ni cambios al Estado Maestro.
