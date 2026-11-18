# Checkpoint — Cruce preliminar de assets y documentos Foundry

Fecha: 2026-11-14  
Rama: `work/native-compendia-pipeline`  
Estado: inventario preliminar registrado; export canónico de Items pendiente.

## Trabajo completado

- Recuperado el checkpoint CI105 de jerarquía del pack Item: 38 Items, carpetas Armas y Reliquias/Cotidianas/Legendarias; compilación y round-trip SUCCESS. QA visual en Forge pendiente.
- Leídos el contrato de datos, la arquitectura territorial/procedencia y las auditorías vigentes de Equipo/Defensas/Instrumentos/Turianos.
- Consultado `TRANSFER_MANIFEST.json`: 108 registros declarados (29 WebP + 29 PNG de Equipo; 8 WebP + 8 PNG de Defensas; 28 WebP ERH; 4 WebP Turianos; Tokicura WebP + PNG fuente).
- Consultadas rutas concretas en GitHub. Varias rutas WebP de staging y ambos recursos Tokicura existen. Cuatro rutas de PNG maestro consultadas devuelven 404; no se declara presencia de los 37 PNG maestros de Equipo/Defensas.
- Reconciliados cinco JSON Item individuales de Equipo en Biblioteca con sus `seedId` y `compendiumSource`.
- Inspeccionado el snapshot Actor `fvtt-Actor-1-cwDjAZn88gYFURfx (2).json`: Foundry 13.351 / CSB 5.2.1; contiene Items embebidos y referencias históricas, no es export canónico actual.
- Documentados siete cruces candidatos de Equipo y cuatro referencias históricas de Instrumentos, sin modificar fuentes ni rutas runtime.
- Registrada la matriz en `docs/MATRIZ_CRUCE_ASSETS_FOUNDRY_v01.md`.
- Creado exportador Foundry de sólo lectura `tools/foundry/export-items-inventory.js` e instrucciones en `docs/EXPORT_INVENTARIO_FOUNDRY_ITEMS.md`.
- Actualizado README y descripción del PR #1.

## Decisiones

1. No inferir IDs a partir de nombres o códigos.
2. No usar IDs de instancias embebidas como IDs canónicos de Items.
3. Conservar `compendiumSource` como referencia histórica y resolver el documento actual mediante export.
4. Mantener los 69 recursos derivados en staging; no actualizar rutas runtime de Equipo, Defensas o Instrumentos.
5. No equiparar Campana lickanantay con Campana piramidal.
6. Arpa de boca permanece pendiente técnico para runtime.
7. COM-09 Tañaña permanece aprobado pero pendiente de recuperar el binario final.
8. Sangu y Popr no se promueven a runtime.
9. Los 37 PNG maestros de Equipo/Defensas declarados en el manifiesto no se consideran presentes hasta comprobar las rutas o completar la transferencia.

## Pendientes

- Ejecutar el exportador en el mundo Foundry que contiene los compendios de origen.
- Reconciliar los 135 Items históricos con `_id`, UUID, carpeta, flags, payload, `img` y `compendiumSource`.
- Resolver rutas y masters de Equipo/Defensas/Instrumentos contra cada documento fuente.
- Recuperar IDs/carpeta de los Actors Turianos desde export actual; no usar el JSON de candidatos como identidad canónica.
- Completar validación exhaustiva de las 69 rutas WebP de staging y de los PNG maestros.
- QA visual/funcional en mundo aislado Foundry V14 + CSB 6.0.2.

## Fuentes

- `docs/CHECKPOINT_NATIVE_ITEM_FOLDERS_2026-11-14.md`
- `docs/CONTRATO_DATOS_COMPENDIOS_NATIVOS_v0.1.md`
- `docs/COMPENDIOS_TERRITORIO_PROCEDENCIA.md`
- `docs/AUDITORIA_DEFENSAS_2026-11-12.md`
- `docs/AUDITORIA_INSTRUMENTOS_ERH_2026-11-13.md`
- `docs/AUDITORIA_TURIANOS_2026-11-13.md`
- `TRANSFER_MANIFEST.json`
- Fuentes Item individuales y snapshot Actor consultados en Biblioteca.

## Cambios al Estado Maestro

Ninguno. Este checkpoint sólo registra el trabajo de la rama. No modifica `main`, el módulo productivo, MELIAZ Bridge ni el Estado Maestro.

## Estado de integración

- PR #1: draft, abierto y sin merge.
- Comparación de ramas al cierre de este checkpoint: 183 commits exclusivos de la rama y 1 commit exclusivo de `main`.
- El commit exclusivo de `main` añade `HIPERAUSTRALIS_RELIQUIAS_ASSETS_16_WEBP_v01.zip`; no se ha cherry-picked.
- No se ha instalado ni desplegado en Forge.
