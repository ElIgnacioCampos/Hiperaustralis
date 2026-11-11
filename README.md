# Hiperaustralis — implementación Foundry

Repositorio técnico para el módulo independiente de compendios nativos de Hiperaustralis RPG.

## Estado actual

- Rama de trabajo: `work/native-compendia-pipeline`.
- Pull request #1 abierto hacia `main`; no fusionado.
- `main` permanece fuera de este frente.
- Existe un prototipo nativo aislado con tres packs: Item, Actor y JournalEntry.
- El pipeline de GitHub Actions compiló los tres packs con Foundry CLI 3.0.5, realizó unpack y validación de control, y generó un ZIP de prueba.
- La compilación CI está verificada; **no equivale a instalación ni QA de runtime en Foundry/Forge**.
- El prototipo no es el corpus completo ni el módulo final.

## Estructura observada

- `source/items/`: Item Cuchillo de piedra.
- `source/actors/`: Actor Ladrón oportunista.
- `source/journals/`: JournalEntry Auspicios Hiperaustralis, almacenado como JSON gzip/base64 y restaurado por el workflow.
- `module/`: manifiesto del módulo prototipo.
- `.github/workflows/`: compilación cloud.
- `docs/`: arquitectura territorial, auditoría del pipeline, contrato de datos en borrador y backlog editorial.

## Arquitectura y salvaguardas

- El nuevo módulo será independiente de `hiperaustralais-rituales`.
- No modificar MELIAZ Bridge ni el módulo estable.
- No migrar ni borrar compendios `world.*`.
- No desplegar sobre el mundo productivo.
- Mantener los originales y las referencias históricas hasta completar inventario y QA.
- El prototipo actual se conserva como fixture técnico, no como fuente maestra del corpus.
- La taxonomía Territorio y el contrato de procedencia están documentados; todavía no se ha ejecutado la migración de iconos ni del corpus histórico.

## Pipeline de prueba existente

El workflow actual:
1. restaura el Journal comprimido;
2. instala Foundry CLI 3.0.5;
3. valida los tres documentos fixture;
4. prepara los campos temporales `_key`;
5. compila los tres packs LevelDB;
6. desempaqueta y compara IDs, nombres y cantidad de páginas;
7. empaqueta un ZIP y calcula SHA-256.

La validación actual es deliberadamente limitada: no acredita igualdad semántica completa, integridad de assets, ausencia de dependencias del módulo antiguo ni funcionamiento en Foundry.

## Siguiente hito

Cerrar y aprobar el contrato de datos; después inventariar y cotejar los ZIP históricos prioritarios, ampliar validadores y construir el pipeline declarativo del corpus real. No asignar IDs finales ni crear packs de producto antes de conocer el inventario.
