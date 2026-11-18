# Auditoría del prototipo y pipeline de compendios nativos

Fecha: 2026-11-10
Rama auditada: `work/native-compendia-pipeline`
Alcance: revisión estática de manifiesto, validadores, preparación de fuentes y workflow.
No se ejecutó Foundry/Forge runtime QA. No se modificó el módulo estable ni MELIAZ Bridge.

## Dictamen

**El prototipo sirve como prueba técnica del flujo Foundry CLI, pero no es una base de producto lista para ampliar directamente.** Conviene conservarlo como fixture de integración y construir el módulo definitivo con configuración declarativa y corpus desacoplado.

## Hallazgos comprobados

### 1. Identidad de módulo provisional
`module/module.json` declara:
- ID: `hiperaustralis-compendios-prototype`
- título de prototipo;
- versión 0.1.5;
- tres packs con nombres `ha-proto-*`.

Esto es correcto para una prueba aislada, pero no para el módulo final. No renombrar todavía hasta definir el ID definitivo y comprobar que no colisiona con módulos instalados.

### 2. Pipeline acoplado a tres packs
`validate_sources.py`, `prepare_sources.py`, `validate_compiled.py` y el workflow enumeran explícitamente:
- items;
- actors;
- journals.

El workflow compila tres packs nombrados uno por uno y construye un ZIP fijo `HIPERAUSTRALIS_COMPENDIOS_PROTO_NATIVO_v0.1.5.zip`. No existe todavía un registro declarativo de packs ni descubrimiento controlado de colecciones.

### 3. Validación insuficiente para migración de corpus
El validador de fuentes comprueba IDs y nombres, y añade algunas reglas específicas de los fixtures. No valida:
- unicidad global de UUID entre colecciones;
- referencias cruzadas;
- rutas de imágenes y otros recursos;
- existencia e integridad SHA-256 de assets;
- territorio y clasificación Flora/Fauna/Funga;
- estado/evidencia de procedencia;
- separación entre BIO-RUP, fotografías, mapas y otras familias;
- vínculos de Actor/JournalEntry/Item;
- dependencias del módulo antiguo.

### 4. Round-trip demasiado superficial
`validate_compiled.py` compara IDs, nombres y número de páginas. No verifica igualdad semántica completa de documentos, campos, relaciones, flags, contenido HTML ni referencias a recursos. Puede aceptar una compilación que haya perdido datos no cubiertos por esas tres comparaciones.

### 5. Riesgo de dependencia del módulo antiguo
El prototipo incluye recursos que apuntan a rutas del módulo `hiperaustralais-rituales`. El ZIP puede compilar y aun así no ser autónomo al instalarse sin ese módulo. La independencia de recursos debe verificarse con un escaneo de todas las rutas y una prueba en un mundo aislado sin el módulo antiguo.

### 6. Fuentes y distribución
El Journal de Auspicios está guardado como JSON comprimido y base64, restaurado dentro del workflow. Esto funciona como transporte, pero dificulta revisión editorial, diff y auditoría de contenido. Para el corpus completo conviene conservar fuentes legibles y separar compresión como optimización de build, no como formato maestro.
Las fuentes de Items y Actors previstas por los validadores no pudieron recuperarse mediante las rutas consultadas en esta rama; deben verificarse con un inventario completo del árbol antes de afirmar su ausencia definitiva.

### 7. CI no equivale a QA de Foundry
El workflow valida fuentes, compila con Foundry CLI, desempaqueta, verifica y empaqueta. No ejecuta una instalación real en Foundry/Forge, no comprueba acceso desde la interfaz, arrastre de documentos ni carga de recursos. La aceptación de runtime debe ser una etapa separada.

### 8. Activación del workflow
El disparador de push se limita a la rama de prototipo y a rutas concretas (`source/**`, `module/**`, scripts y workflow). La documentación nueva no activa el build, lo que es razonable; al pasar a la arquitectura final habrá que alinear ramas, rutas y artefactos con el nuevo módulo.

## Reutilizable

- Foundry CLI 3.0.5 como compilador, sujeto a confirmar compatibilidad con la versión de Foundry objetivo.
- Preparación de campos de transporte `_key` separada de las fuentes canónicas.
- Compilación de packs nativos, unpack y artefacto ZIP como patrón.
- Validación automática y checksum SHA-256.
- El prototipo de tres documentos como fixture de regresión, no como corpus de producto.

## Reemplazar o rediseñar antes de ampliar

1. Manifiesto del módulo y catálogo declarativo de packs.
2. Esquema de fuentes y validadores.
3. Descubrimiento de documentos y colecciones.
4. Validador profundo de referencias, UUID, recursos y taxonomía.
5. Manifiesto de assets con origen/destino/hash/procedencia.
6. Round-trip semántico y verificación de recursos.
7. Empaquetado autónomo, sin referencias al módulo antiguo.
8. Pipeline de CI y versionado de artefactos.
9. Pruebas runtime separadas: mundo limpio, interfaz, navegación, apertura, drag-and-drop y recursos.

## Arquitectura de destino recomendada

- `source/`: fuentes canónicas legibles, separadas por tipo de documento y familia editorial.
- `assets/`: recursos del módulo nuevo, organizados por familia visual y territorio.
- `manifests/`: catálogo de packs, inventario de recursos, procedencia y referencias.
- `scripts/`: validación, preparación Foundry CLI, compilación, round-trip y empaquetado.
- `module/`: manifiesto final y packs compilados; no usar como fuente editorial.
- `docs/`: contratos, decisiones, inventarios y QA.
- `dist/`: ZIP de distribución y checksums, generado y no versionado como fuente.

La taxonomía territorial queda fijada en `docs/COMPENDIOS_TERRITORIO_PROCEDENCIA.md`: ocho territorios, cada uno con Flora/Fauna/Funga; BIO-RUP separado de fotografías, mapas y otros bancos. No crear documentos vacíos para simular contenido.

## Orden de ejecución propuesto

1. Cerrar el contrato de datos y el catálogo declarativo de colecciones.
2. Inventariar el árbol completo de la rama y las fuentes disponibles.
3. Recuperar los ZIP históricos prioritarios y cotejarlos por contenido y hash.
4. Construir inventario de documentos y assets con referencias y procedencia.
5. Migrar primero un lote piloto representativo y validar sus referencias.
6. Ampliar al corpus completo; mantener pendientes sin procedencia.
7. Compilar, desempaquetar y comparar semánticamente.
8. Probar el módulo en mundo Foundry aislado y después en Forge.
9. Sólo con QA aprobado, preparar coexistencia y eventual sustitución.

## Decisión de seguridad

No cambiar `main`, no mergear PR #1, no publicar release, no instalar sobre el mundo productivo y no modificar el módulo estable ni Bridge. El prototipo queda preservado como fixture técnico hasta que el nuevo pipeline lo sustituya de manera verificable.
