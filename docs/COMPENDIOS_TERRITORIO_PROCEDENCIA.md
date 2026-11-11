# Arquitectura de compendios — Territorio y procedencia de recursos

Estado: especificación de trabajo para el módulo independiente de compendios nativos.
Rama: `work/native-compendia-pipeline`.
Alcance: estructura editorial, taxonomía, procedencia de iconos y contrato de migración.
No autoriza despliegue en el mundo productivo ni modificación de `main`, MELIAZ Bridge o del módulo estable.

## 1. Separación de módulos

- El módulo estable actualmente instalado en Forge permanece intacto.
- El compendio antiguo `hiperaustralais-rituales` se conserva como referencia y respaldo durante la transición.
- El nuevo módulo de compendios será independiente, con ID propio, fuentes canónicas externas a los packs compilados y pipeline reproducible.
- El nuevo módulo coexistirá con el antiguo durante la validación. No se reemplaza ni se desinstala el antiguo hasta completar QA y recibir autorización explícita.
- MELIAZ Bridge queda fuera del alcance de esta migración.

## 2. Taxonomía territorial

La carpeta y el acceso editorial se denominan **Territorio**, no Biomas.

El compendio Territorio contiene los ocho territorios del Corredor:

1. Titicaca — Altiplano lacustre
2. Paititi — Bosque nublado
3. Ngulumapu — Bosque lluvioso
4. Pewenmapu — Cordillera volcánica
5. Patagonia austral
6. Tierra del Fuego
7. Canales australes
8. Umbral Polar

Cada territorio contiene estas subcarpetas editoriales:

- `Flora/`
- `Fauna/`
- `Funga/`

La estructura se prepara para los ocho territorios aunque alguna subcarpeta todavía no tenga documentos aprobados. Una carpeta vacía es preferible a inventar contenido para llenarla.

## 3. Contrato de clasificación de iconos

Cada icono migrado debe quedar asociado a:

- territorio de procedencia;
- subcategoría: Flora, Fauna o Funga;
- identificador estable del recurso;
- nombre y descripción editorial disponibles;
- ruta de origen;
- ruta de destino;
- estado de verificación;
- evidencia que respalda la procedencia.

La procedencia se determina por fuentes, metadatos o documentación editorial verificable. No se infiere únicamente por apariencia visual, semejanza o conocimiento general.

Estados permitidos:

- `verified`: procedencia y clasificación respaldadas.
- `pending_provenance`: no hay evidencia suficiente para asignar territorio.
- `pending_category`: territorio conocido, clasificación Flora/Fauna/Funga no resuelta.
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

## 5. Integridad de la migración

Antes de mover un recurso:

1. inventariar el archivo y su ruta de origen;
2. calcular y registrar SHA-256;
3. identificar referencias entrantes y documentos que lo usan;
4. resolver territorio y subcategoría con evidencia;
5. copiarlo a la ruta de destino conservando el original durante la transición;
6. actualizar las referencias de forma controlada;
7. validar que el recurso exista, se resuelva y conserve su integridad;
8. retirar duplicados sólo después de QA y aprobación.

No se borran originales durante la fase de inventario o migración. No se renombra ni altera un ID estable sin una tabla explícita de equivalencias.

## 6. Rutas canónicas previstas

```text
Territorio/
  Titicaca/
    Flora/
    Fauna/
    Funga/
  Paititi/
    Flora/
    Fauna/
    Funga/
  Ngulumapu/
    Flora/
    Fauna/
    Funga/
  Pewenmapu/
    Flora/
    Fauna/
    Funga/
  Patagonia austral/
    Flora/
    Fauna/
    Funga/
  Tierra del Fuego/
    Flora/
    Fauna/
    Funga/
  Canales australes/
    Flora/
    Fauna/
    Funga/
  Umbral Polar/
    Flora/
    Fauna/
    Funga/
```

Los nombres visibles conservan la grafía editorial. Los nombres técnicos de carpetas y slugs deberán normalizarse de forma consistente, sin alterar los nombres visibles ni los identificadores históricos.

## 7. Contrato de interfaz

- La etiqueta visible del acceso principal es `Territorio`.
- El acceso abre el compendio territorial y permite navegar por los ocho territorios y sus tres subcategorías.
- Las selecciones persistentes deben guardar UUID de documentos, no nombres ni posiciones de lista.
- No se crean documentos de relleno para carpetas sin contenido aprobado.
- Las referencias de recursos deben apuntar a las rutas canónicas nuevas una vez que la migración esté validada.

## 8. Condiciones para ampliar el pipeline

El pipeline actual de tres packs es un prototipo técnico, no el inventario del producto final. Antes de considerarlo candidato de distribución debe:

- aceptar el corpus completo y múltiples familias de documentos;
- validar IDs únicos y referencias entre documentos;
- validar la taxonomía territorial y los estados de procedencia;
- detectar recursos ausentes, rutas rotas y referencias obsoletas;
- emitir un manifiesto de migración con origen, destino, SHA-256 y estado;
- compilar packs nativos y realizar round-trip de verificación;
- producir un ZIP autónomo, sin depender de rutas del módulo antiguo;
- mantener separados los recursos BIO-RUP, fotografías, mapas y otros bancos;
- superar QA en un mundo Foundry aislado y luego en Forge antes de cualquier sustitución.

## 9. Límites de evidencia actuales

El inventario histórico documenta paquetes de compendios y bancos parciales, pero los ZIP originales no están actualmente disponibles en el repositorio de trabajo ni se ha verificado su contenido binario en esta fase. Por tanto, esta especificación no afirma que los iconos ya hayan sido migrados ni que el corpus esté completo.

La integración real requiere recuperar y cotejar los paquetes fuente priorizados, construir el inventario de recursos y resolver procedencias con evidencia. Hasta entonces, el código no debe fabricar registros ni asumir que una versión histórica contiene acumulativamente todas las anteriores.

## 10. Criterio de aceptación de este bloque

Este documento fija la arquitectura de destino. No certifica migración ejecutada, contenido completo, prueba en Forge ni autorización de reemplazo.

Para cerrar la migración deberán existir:
- inventario completo de recursos;
- matriz de procedencia y clasificación;
- registro de pendientes;
- manifiesto de rutas y hashes;
- referencias actualizadas y verificadas;
- compilación reproducible;
- QA de contenido y runtime;
- paquete autónomo validado.
