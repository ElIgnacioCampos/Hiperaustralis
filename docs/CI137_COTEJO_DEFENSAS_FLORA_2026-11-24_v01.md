# CI137 — Cotejo de Defensas nuevas y Flora 001–040

**Corte:** 24-11-2026 · **Estado:** AUDITORÍA DE IDENTIDAD Y FUENTE REALIZADA; cero nuevos Items instalados.
**Rama:** `work/ci137-expansion-familias-20261124`
**Base protegida:** QA5 `0.1.7-ci137qa.5` / Foundry `14.370` / CSB `6.1.2`.

## 1. Fuentes cotejadas

1. Compendio real ya recuperado: `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB(1).zip`, **33.028.294 bytes**, SHA-256 `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`, **358 entradas / CRC PASS**. `data/defensas.json` contiene 8 payloads, `data/flora_items.json` y `data/flora_y_funga_40.json` contienen 40 cada uno. Es fuente **histórica** del módulo legado y no instalador QA5.
2. `source-pending/ci137-historicos-99/defensas/`: 8 JSON históricos con `_id` Foundry, exactos en cantidad y `seedId=defensa-01..08`. Ya forman parte de los 136 Items actuales; **nunca darles alta otra vez**.
3. `manifests/defensas-assets.json`: nueve códigos de catálogo **DEF-01..09** y familia de activos **COM**, sin Item `_id` para las nuevas entradas. Ocho imágenes COM tienen historial de aprobación; **COM-09 Tañaña** sin binario final.
4. `source/territorios/flora/foundry-id-map.json`: 40 `foundryId` únicos de longitud 16, con códigos FLO-001..040 y `seedId=flora-01..40`, recuperados del mundo `hipera-5`.
5. `source/territorios/flora/manifest.json`: índice **histórico** de ocho unidades, todavía no equivalente al estándar de **nueve Territorios CORE**.
6. `manifests/ci137-defensas-flora-crosswalk-20261124-v01.json`: matriz trazable completa de identidad y estados; los cotejos son solamente auditoría.

## 2. Defensas — cotejo de 8 existentes contra 9 candidatas

| DEF/COM nuevo | Catalogación nueva | Contraste con QA5 | Resolución técnica |
|---|---|---|---|
| DEF-01 / COM-03 | Makün — Manta Mapuche | Manta densa defensiva surandina (`defensa-08`) es prenda del mismo ámbito funcional, **no el mismo objeto documentado** | Mantener separados |
| DEF-02 / COM-05 | Capa Selk'nam | No existe identificación 1:1 con los ocho originales | Candidato nuevo, pendiente de ficha |
| DEF-03 / COM-06 | Escudo nórdico | Ningún escudo entre las ocho Defensas originales | Candidato nuevo, pendiente de ficha |
| DEF-04 / COM-07 | Casco Pica-Tarapacá | Familia parcialmente solapada con `defensa-01/02/03` (casco rígido, emplumado, sobre capucha) | **Solapamiento de familia, no duplicado probado** |
| DEF-05 / COM-08 | Coraza Chiu-Chiu | Posible solapamiento con `defensa-05` Coraza de Lasana–Alto Loa | Revisar descripción/pieza/asset antes de fusionar |
| DEF-06 / COM-09 | Tañaña — Coraza cónica mapuche | No hay equivalencia 1:1 acreditada | Candidato, **falta imagen aprobada recuperada** |
| DEF-07 / COM-10 | Celada — Casquete de cuero mapuche | No hay equivalencia 1:1 acreditada | Candidato nuevo, pendiente de ficha |
| DEF-08 / COM-11 | Coraza atacameña de cuero de caimán | Misma materia prima mencionada en `defensa-05` Coraza de Lasana | Revisar correspondencia: **no sumar ni fusionar sin cotejo** |
| DEF-09 / COM-12 | Armadura acolchada Chimú | No hay equivalencia acreditada | Candidato nuevo, pendiente de ficha |

**Importante:** ningún DEF nuevo posee un `_id` Foundry validado en la matriz actual. Coincidencias de oficio, materia o territorio no prueban identidad. Los ocho Items históricos se conservan en QA5. Los estados de aprobación gráfica no autorizan diseñar estadísticas ni descripciones nuevas.

## 3. Flora — identidad 40/40 recuperada

Se cotejaron los códigos, `seedId` y nombres literales de **FLO-001..040** en `data/flora_items.json` del ZIP 0.4.75 contra `source/territorios/flora/foundry-id-map.json`. Resultado: **40/40 coincidencias por código/nombre/seedId; 40/40 IDs Foundry únicos y válidos de 16 caracteres**. La copia histórica NO contiene `_id` persistentes, pero existe un mapa real que permite reconocer cada registro. El crosswalk de GitHub conserva cada ID y UUID.

### Hallazgo binario de 40 iconos

- Existen **40/40 archivos de icono WebP** bajo `hiperaustralis-rituales/assets/flora-y-funga/iconos/`, dimensión **512×512** (comprobación muestral de tamaño, no declaración de aprobación).
- Se recalculó SHA-256 de cada binario dentro del ZIP: **0/40 hashes coinciden** con el `sha256_webp` consignado en `data/flora_y_funga_40.json`; también difieren los tamaños listados. Son bytes **reales, legibles y CRC PASS**. El paquete se llama `OPTIMIZADO`: diferencia compatible con una reexportación/optimización, **no evidencia suficiente de pérdida o corrupción**.
- `flags.hiperaustralis-sheet.background` contiene **8 rutas distintas**, pero **33/40 Items apuntan al fondo de Totora**, incluidos vegetales de otros territorios. Es una anomalía histórica conocida; no replicarla en QA5 ni sobrescribirla sin referencia aprobada.
- El catálogo 0.4.75 marca 40 registros `INCLUSION_AUTORIZADA_NO_INSTALADA`. Este estado **no equivale a una aprobación visual nueva y actual de los 40 iconos**. La matriz editorial reciente mantiene estados visuales parciales.

### Diferenciar contenido de taxonomía

- **FLO-020 Liquen polar:** no convierte automáticamente la entrada en Funga, ni define una especie.
- **FLO-028 Fungosidades:** rótulo genérico candidato que exige categorización; no realizar alta independiente de Funga sin aprobación.
- **FLO-024 Macroalga / FLO-032 Alga polar:** no clasificar como hongos por encontrarse bajo la antigua rúbrica `Flora y Funga`.
- Las mismas fichas pueden aparecer como referencia en varios territorios; un solo Item por código/ID.

## 4. Lo que quedó técnicamente cerrado

1. **No duplicación de las ocho Defensas históricas:** IDs y semillas localizados.
2. **Nueve DEF nuevas identificadas** por código, activo gráfico y estado, con tres grupos de posible equivalencia funcional (DEF-04, DEF-05, DEF-08); ninguno fusionado.
3. **Flora 40/40 identidad comprobada:** nombre, código, semilla, ID Foundry, UUID registrado.
4. **Cero reescrituras visuales** y cero promociones de un candidato.
5. Nuevo guard de Github `tools/foundry/ci137_expansion_gate.py` controla el manifiesto cruzado.

**Pendientes inmediatos:** recuperar/cotejar descripciones y datos definitivos de DEF-01..09 frente a Items vivos, resolver COM-09, reconstruir procedencia SHA/variantes de los 40 iconos FLO y fondos de ficha, y preparar pruebas Foundry de importación con IDs existentes. **Sin ZIP de instalación todavía.**

**Fuentes:** ZIP 0.4.75 verificado; `manifests/defensas-assets.json`; `manifests/ci137-defensas-flora-crosswalk-20261124-v01.json`; `source/territorios/flora/foundry-id-map.json`; Biblioteca `FAUNA_MAESTRO_ACTUAL.md`, checkpoints territoriales y de flora; `docs/AUDITORIA_DEFENSAS_2026-11-12.md`.

**Decisiones:** preservar, cotejar, no duplicar. **Cambios al Estado Maestro / `main` / H6 / H7 / Bridge / Forge:** ninguno.
