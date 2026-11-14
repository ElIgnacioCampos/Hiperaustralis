# Auditoría de paquete CI104 — Compendios nativos

Fecha de revisión: 2026-11-14

## Identificación

- Archivo: `HIPERAUSTRALIS_COMPENDIOS_PROTO_NATIVO_v0.1.5_CI104_FOUNDRY.zip`
- SHA-256 del ZIP: `f60ff7b022de11d939c94fcaefdfa3113f4a5ebb59a56e163e8e88c2dfd76163`
- Módulo: `hiperaustralis-compendios-prototype`, versión `0.1.5`
- Compatibilidad declarada: Foundry VTT `14.367`; Custom System Builder mínimo `6.0.0`
- Integridad ZIP/CRC: PASS
- 108 archivos, 4.931.669 bytes descomprimidos; 124 entradas contando directorios.
- La etiqueta `CI104` pertenece al nombre del archivo recibido; no acredita que corresponda a la ejecución GitHub Actions #104. La última ejecución de pipeline documentada en el PR es la #98.

## Inventario

| Grupo | Archivos | Bytes |
|---|---:|---:|
| `assets/_staging/defensas/` | 8 | 557.982 |
| `assets/_staging/equipo/` | 29 | 1.288.910 |
| `assets/_staging/instrumentos-erh/` | 28 | 980.602 |
| `assets/_staging/turianos/` | 4 | 867.934 |
| `assets/reliquias/` | 17 | 1.181.542 |
| Packs LevelDB | 21 | — |

Los 69 assets de staging son WebP legibles con canal alfa (RGBA). Los 65 archivos de defensas, equipo e instrumentos miden 256×256; los cuatro retratos turianos miden 512×512.

## Cotejo de reliquias

- Los 16 WebP de reliquias (8 legendarias y 8 cotidianas) coinciden byte a byte por SHA-256 con `manifests/reliquias-assets.json`.
- `assets/reliquias/tokicura_256.webp` coincide con el SHA-256 runtime registrado para Tokicura: `1a1a480ed3014b1f031e9e295ddf57ece94b2f5d060fcd6edb5fc6fb87421c09`.
- Este cotejo acredita el contenido del ZIP recibido, no que esos binarios ya estén almacenados en GitHub. La transferencia al repositorio sigue pendiente de verificación.

## Naturaleza del paquete

El ZIP mezcla tres clases de contenido:
1. Assets de staging bajo `assets/_staging/`.
2. Copias runtime de reliquias bajo `assets/reliquias/`.
3. Tres packs LevelDB compilados: Items, Actors y Journals.

Los packs LevelDB y las copias runtime son artefactos de distribución/prueba. No deben sustituir las fuentes JSON ni convertirse en la única copia de los recursos.

## Decisiones de migración

- Mantener los 69 recursos bajo la clasificación de staging; no promoverlos automáticamente a runtime.
- Conservar los nombres y rutas originales del paquete durante el inventario.
- No alterar IDs Foundry ni reescribir rutas de documentos sin cotejar cada referencia.
- Mantener las reliquias bajo su manifiesto existente; no duplicar sus registros en un manifiesto genérico.
- No tratar el ZIP de Forge como corpus fuente.
- Mantener este frente en `work/native-compendia-pipeline`; no modificar `main`, MELIAZ Bridge ni el módulo productivo.

## Próximo paso

Construir el cruce declarativo entre cada asset de staging y su documento Foundry de origen: categoría, nombre visible, ID, ruta de imagen y estado de procedencia. Sólo después de ese cotejo se decide qué binarios pasan a `source-original/` y cuáles se restauran en el runtime del módulo durante CI.

## Alcance no cubierto

Esta auditoría no valida la semántica interna de los documentos LevelDB, la totalidad de las referencias de imagen, ni la instalación/QA visual del módulo en un mundo Foundry V14 + CSB 6.0.2.
