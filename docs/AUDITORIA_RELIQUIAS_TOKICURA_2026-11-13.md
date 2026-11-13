# Auditoría de Reliquias y Tokicura — 2026-11-13

## Fuentes cotejadas
- `HIPERAUSTRALIS_COMPENDIOS_0.4.68_FLORA_40_JOURNALS_LAB.zip`
- `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip`
- `HIPERAUSTRALIS_COMPENDIOS_0.4.76_FAUNA_52_AUDITADA_LAB (3).zip`
- Documentación previa de Tokicura ya registrada en esta rama.

## Reliquias — fuente de Items
El archivo `data/reliquias.json` contiene 16 Items `equippableItem`: 8 Reliquias Legendarias y 8 Reliquias Cotidianas. Su SHA-256 es idéntico en las tres versiones: `a1ce9671102ea6dbcbedc4743c82c850867b6f9acbab0ed382ed6b1961dc0f4a`. No hay cambios de registros entre 0.4.68, 0.4.75 y 0.4.76.

Los 16 `_id` son únicos dentro del archivo. Los Items tienen `folder: null`; no se debe inferir una estructura de carpetas Foundry a partir de los directorios de imágenes.

## Imágenes de Reliquias
- 16 archivos WebP, todos 512×512.
- Los 16 están codificados en RGB, sin canal alfa. No son assets transparentes.
- Los hashes SHA-256 individuales y las rutas exactas están registrados en `manifests/reliquias-assets.json`.
- Las imágenes de Reliquias son idénticas entre los ZIP 0.4.75 y 0.4.76; no hay una nueva variante visual en 0.4.76.
- El ZIP 0.4.68 incluye además entradas de directorio vacías; no son recursos adicionales.

## Tokicura
La auditoría anterior registrada en `docs/AUDITORIA_TECNICA_ASSETS_TOKICURA_TURIANOS_INSTRUMENTOS_EQUIPO_2026-11-11.md` y `docs/AUDITORIA_DETALLE_ASSETS_TURIANOS_INSTRUMENTOS_EQUIPO_TOKICURA_v02.md` documenta `tokicura_256.webp`: 27.972 bytes, WebP 256×256 RGBA, SHA-256 `74a11a097d3c90cb42337a40a30247b799d5007a60403d654bc320759ebd9c2a`.

En esta sesión el binario no está disponible en `/mnt/data` y tampoco aparece en el árbol remoto de la rama. Se conserva el dato como verificación histórica, no como verificación actual del repositorio. La asociación de Tokicura a un Item concreto no queda demostrada por las fuentes revisadas; no asignar ni reemplazar imágenes por inferencia.

## Árbol GitHub al momento de la auditoría
- No existe todavía `assets/` en la rama `work/native-compendia-pipeline`.
- No hay Items de Reliquias divididos en `source/items/`.
- Los únicos registros canónicos examinados proceden del JSON monolítico `data/reliquias.json` de los ZIP de laboratorio.

## Decisiones técnicas
1. Conservar los 16 IDs Foundry y las rutas fuente sin cambios.
2. No duplicar los 16 binarios ni crear una segunda variante desde 0.76: los recursos son idénticos a 0.75.
3. No convertir RGB a RGBA ni declarar transparencia: los WebP actuales no tienen alfa.
4. Mantener Tokicura como recurso documentado pendiente de recuperación binaria y de asociación inequívoca con un Item.
5. No crear carpetas Foundry ni actualizar referencias runtime durante esta auditoría.

## Estado
**Auditoría registrada; migración no ejecutada.** No se modificaron JSON de Foundry, IDs, rutas runtime, módulo estable, `main` ni MELIAZ Bridge.
