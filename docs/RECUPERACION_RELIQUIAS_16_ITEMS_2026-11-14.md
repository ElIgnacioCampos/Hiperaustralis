# Recuperación de Reliquias — 16 Items

Fecha: 2026-11-14  
Rama: `work/native-compendia-pipeline`

## Fuente
- ZIP recibido: `HIPERAUSTRALIS_COMPENDIOS_0.4.76_FAUNA_52_AUDITADA_LAB (3).zip`
- Ruta interna: `hiperaustralis-rituales/data/reliquias.json`
- SHA-256 del JSON monolítico: `a1ce9671102ea6dbcbedc4743c82c850867b6f9acbab0ed382ed6b1961dc0f4a`
- ZIP: 374 entradas; CRC íntegro (`testzip() = None`).
- JSON: 28.355 bytes; 16 documentos JSON válidos.

## Inventario
Ocho Reliquias Legendarias:
- `TridUllmanRel001` — Tridente de Ullman
- `AntukuraReliq001` — Antükura
- `YelHipolitaRel01` — Yelmo de Hipólita
- `DrakarUllmanRel01` — Drakar de Ullman
- `PiedraPaititiRel1` — Piedra Vieja de Paititi
- `ChayancoRel00001` — Chayanco de Chillpila
- `TabHumFelRel0001` — Tableta del Hombre-Felino
- `KvinnebyRel00001` — Amuleto rúnico de Kvinneby

Ocho Reliquias Cotidianas:
- `ChallaHeredRel001` — Challa heredada
- `KMetaweFamRel01` — Kütru metawe familiar
- `ChuspaCamRel0001` — Chuspa de camino
- `InkuniaRel000001` — Inkuña de ofrendas
- `PeineAstaRel0001` — Peine de asta heredado
- `AfilarViajeRel01` — Piedra de afilar del viaje
- `CuchChaniarRel01` — Cuchara de chañar
- `CencerroMadRel01` — Cencerro de madera

## Estructura observada
- Los 16 documentos son `equippableItem`.
- IDs únicos dentro del conjunto.
- Todos declaran `system.template = HipRelqTpl000001`.
- Todos declaran `templateSystemUniqueVersion = 172001`.
- `system.props` contiene `hipera_tipo` y los cuatro campos editoriales `historia`, `correspondencias`, `resonancia`, `notas`.
- Ninguno incluye `system.body`.
- Todos conservan `folder: null`.
- Se preservan IDs, nombres, texto, flags, imágenes y demás datos de origen.

## Organización fuente
La organización de trabajo prevista es:
- `source/items/reliquias-legendarias/`
- `source/items/reliquias-cotidianas/`

Estas carpetas son organización del repositorio, no carpetas Foundry. No inferir ni crear valores `folder` a partir de ellas.

## Tokicura
Tokicura permanece en `source/items/reliquias/tokicura.json`, como fuente independiente. No forma parte de estos 16 registros. No asociar imágenes ni fusionar datos por semejanza de nombre o categoría.

## Estado
Fuente monolítica recuperada, CRC y SHA-256 verificados, 16 registros identificados. La incorporación individual y la validación CI de estos 16 documentos quedan sujetas a su commit y ejecución posterior. Esta recuperación no implica migración runtime, QA Foundry ni cambio del módulo productivo.
