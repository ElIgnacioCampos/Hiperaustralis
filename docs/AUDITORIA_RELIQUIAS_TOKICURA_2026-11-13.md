# Auditoría de Reliquias y Tokicura — 2026-11-13

## Fuentes cotejadas
- `HIPERAUSTRALIS_COMPENDIOS_0.4.68_FLORA_40_JOURNALS_LAB.zip`
- `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip`
- `HIPERAUSTRALIS_COMPENDIOS_0.4.76_FAUNA_52_AUDITADA_LAB (3).zip`
- `HIPERAUSTRALIS_RELIQUIAS_LEGENDARIAS_TOKICURA_v02.zip`
- `HIPERAUSTRALIS_ASSETS_RELIQUIAS_TOKICURA_v01.zip`
- Documentación previa de Tokicura registrada en esta rama.

## Reliquias — fuente de Items
El archivo `data/reliquias.json` contiene 16 Items `equippableItem`: 8 Reliquias Legendarias y 8 Reliquias Cotidianas. Su SHA-256 es idéntico en las tres versiones: `a1ce9671102ea6dbcbedc4743c82c850867b6f9acbab0ed382ed6b1961dc0f4a`. No hay cambios de registros entre 0.4.68, 0.4.75 y 0.4.76.

Los 16 `_id` son únicos dentro del archivo. Los Items tienen `folder: null`; no se debe inferir una estructura de carpetas Foundry a partir de los directorios de imágenes.

## Imágenes de Reliquias
- 16 archivos WebP, todos 512×512.
- Los 16 están codificados en RGB, sin canal alfa.
- Los hashes SHA-256 individuales y las rutas exactas están registrados en `manifests/reliquias-assets.json`.
- Las imágenes de Reliquias son idénticas entre los ZIP 0.4.75 y 0.4.76; no hay una nueva variante visual en 0.4.76.

## Tokicura — recuperación confirmada
Se recibieron dos ZIP independientes:
- `HIPERAUSTRALIS_RELIQUIAS_LEGENDARIAS_TOKICURA_v02.zip`
- `HIPERAUSTRALIS_ASSETS_RELIQUIAS_TOKICURA_v01.zip`

Ambos ZIP pasan CRC y contienen el mismo PNG:
- Ruta original v02: `assets/Reliquias Legendarias/Tokicura.png`
- Ruta propuesta v01: `assets/reliquias/Tokicura.png`
- SHA-256: `eac02773aeb16224066a9777d5228ac1143d3ce2bf5d38de0ef1da756065845a`
- Tamaño: 26.332 bytes
- PNG 200×200, RGBA, alfa real (rango 0–255).

Los dos archivos PNG son idénticos byte por byte. No se deben almacenar dos copias. Los Markdown acompañantes difieren: v02 contiene la descripción y nota provisional; v01 agrega una línea de estado de integración. Se conserva la ruta de integración v01 como candidata de organización, sin que ello cambie la ruta runtime de Foundry.

La descripción recibida dice: “Hacha de piedra e insignia de autoridad del toki, el jefe guerrero. Algunas fuentes le atribuyen facultades oraculares.” Correspondencia sugerida: “Temple · Fuego”. El propio documento declara que es sugerida, no exclusiva, y que la ilustración no es una reconstrucción arqueológica definitiva. No elevar esas afirmaciones a canon.

La documentación previa registra un WebP runtime `tokicura_256.webp`, 256×256 RGBA, 27.972 bytes, SHA-256 `74a11a097d3c90cb42337a40a30247b799d5007a60403d654bc320759ebd9c2a`. Ese binario no está incluido en los dos ZIP recién recibidos. Una conversión de prueba desde el PNG recuperado no reproduce ese hash; por tanto, no declarar que el WebP histórico ha sido recuperado ni reemplazarlo silenciosamente.

La asociación de Tokicura a un Item concreto de los 16 registros no queda demostrada por estos ZIP. No asignar ni reemplazar imágenes por inferencia.

## Árbol GitHub al momento de la auditoría
- No existe todavía `assets/` en la rama `work/native-compendia-pipeline`.
- No hay Items de Reliquias divididos en `source/items/`.
- Los registros canónicos examinados proceden del JSON monolítico `data/reliquias.json` de los ZIP de laboratorio.

## Decisiones técnicas
1. Conservar los 16 IDs Foundry y las rutas fuente sin cambios.
2. No duplicar los 16 binarios ni crear una segunda variante desde 0.76.
3. Registrar un solo PNG fuente de Tokicura; ambos ZIP contienen el mismo archivo.
4. Mantener la descripción y correspondencia de Tokicura como material provisional/sugerido.
5. Mantener el WebP histórico como pendiente de recuperación o reproducción exacta.
6. No asociar Tokicura a un Item ni actualizar referencias runtime hasta cotejar el registro canónico.
7. No crear carpetas Foundry ni modificar rutas runtime durante esta auditoría.

## Estado
**Fuente PNG de Tokicura recuperada y verificada; migración runtime no ejecutada.** No se modificaron JSON de Foundry, IDs, rutas runtime, módulo estable, `main` ni MELIAZ Bridge.
