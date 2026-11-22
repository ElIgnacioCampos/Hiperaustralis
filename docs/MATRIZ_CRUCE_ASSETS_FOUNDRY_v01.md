# Matriz de cruce preliminar — Assets y documentos Foundry

Fecha: 2026-11-14  
Rama: `work/native-compendia-pipeline`  
Estado: **PRELIMINAR — no autoriza promoción a runtime ni creación de documentos**

## 1. Alcance y criterio

Este documento cruza los assets versionados en staging con los documentos Foundry que pueden identificarse en las fuentes inspeccionadas. Distingue:

- **Coincidencia documentada:** existe un JSON Item individual con ID, seedId y referencia al compendio histórico.
- **Coincidencia de snapshot:** el documento aparece sólo como Item embebido en un Actor exportado; su `_id` es el de la instancia embebida, no necesariamente el ID del Item original.
- **Candidato semántico:** nombre/seedId y nombre del asset coinciden, pero todavía falta verificar la identidad visual contra el master y el export canónico.
- **Sin cruce:** no hay evidencia suficiente para asociar el asset a un documento Foundry concreto.

No se generan IDs, no se actualizan `img` ni `flags.hiperaustralis-sheet.background`, y no se modifica ningún documento fuente.

## 2. Inventario de assets y discrepancia del manifiesto

`TRANSFER_MANIFEST.json` declara 108 registros físicos:

| Familia | Registros declarados | Composición |
|---|---:|---|
| Equipo | 58 | 29 WebP 256 + 29 PNG maestros 512 |
| Defensas | 16 | 8 WebP 256 + 8 PNG 256 |
| Instrumentos ERH | 28 | 28 WebP 256 |
| Turianos | 4 | 4 WebP 512 |
| Reliquias | 2 | Tokicura WebP runtime + PNG fuente |
| **Total** | **108** | |

El paquete CI104 recibido contiene 69 recursos de staging (29 Equipo, 8 Defensas, 28 Instrumentos y 4 Turianos), además de los recursos de Reliquias y los packs compilados.

### Verificación directa de rutas en GitHub

Se comprobaron rutas concretas en `work/native-compendia-pipeline`:

- WebP existentes: `nordico_knifr_cuchillo.webp`, `chinchorro_canasto.webp`, `nordico_eldjarn_yesquero.webp`, `COM-03_Manta_Mapuche_256.webp`, `CUERNO_MUSICAL_ERH_256.webp`, `ARPA_BOCA_NORDICA_ERH_256.webp` y `cantor_tamborilero.webp`.
- Tokicura: existen `module/assets/reliquias/tokicura_256.webp` y `source-original/reliquias/Tokicura.png`.
- Rutas de PNG maestro declaradas en el manifiesto que devolvieron 404 al consultarlas: `NORDICO_KNIFR_CUCHILLO_v02_APROBADO.png`, `COM-03_Manta_Mapuche_256.png`, `CHINCHORRO_CANASTO_v01.png` y `MAPUCHE_PILWA_MAESTRO_512.png`.

**Dictamen:** el manifiesto enumera 37 PNG maestros de Equipo/Defensas, pero su presencia en GitHub no está acreditada; cuatro rutas comprobadas devuelven 404. No tratar esos 37 registros como binarios versionados hasta verificar o transferir los archivos. La presencia de los demás WebP tampoco se considera exhaustivamente comprobada por estas consultas de muestra.

## 3. Equipo — cruces encontrados

Las cinco fuentes Item individuales siguientes están disponibles en la Biblioteca, pero aún no están incorporadas a `source/items/` en GitHub. Sus `_id` son los del JSON exportado; `_stats.compendiumSource` conserva la referencia al Item del compendio histórico.

| Item | `seedId` | `_id` del JSON individual | Referencia histórica (`compendiumSource`) | Asset WebP candidato | Estado |
|---|---|---|---|---|---|
| Knífr · Cuchillo | `eq-nor-knifr` | `8yktBeoR9HjgTCBT` | `Item.rs4pwBdQEXH84an2` | `nordico_knifr_cuchillo.webp` | Candidato semántico |
| Eldjárn · Yesquero | `eq-nor-eldjarn` | `POjA7bEnCVUpnAIK` | `Item.gvtyZvtG06lFRYcb` | `nordico_eldjarn_yesquero.webp` | Candidato semántico |
| Saum-nál · Aguja de coser | `eq-nor-saumnal` | `9OkiKgRUKqLEIUQo` | `Item.Mcg891i5gyA6UkiC` | `nordico_saum_nal_aguja.webp` | Candidato semántico |
| Punzón de hueso | `eq-chin-punzon` | `wO3eT2R1NVzzXtP7` | `Item.5Q3Z2ycFIich9LLO` | `chinchorro_punzon_hueso.webp` | Candidato semántico |
| Chope · Desconchador | `eq-chin-chope` | `SuN6GgMvhBM0dCzX` | `Item.DNf0lSdWbNnpc2yX` | `chinchorro_chope.webp` | Candidato semántico |

La coincidencia entre seedId, nombre y asset es fuerte, pero el JSON individual conserva actualmente un icono genérico de Foundry. Falta cotejar visualmente el WebP con su PNG maestro original y con el documento canónico exportado antes de cambiar referencias.

### Equipo visible sólo en el snapshot de Actor

El archivo de Biblioteca `fvtt-Actor-1-cwDjAZn88gYFURfx (2).json` corresponde al Actor `1`, ID `cwDjAZn88gYFURfx`, exportado con Foundry 13.351 y CSB 5.2.1. Sus Items embebidos sirven como evidencia histórica, no como export canónico del compendio.

| Item | ID de instancia embebida | Referencia histórica encontrada | Asset candidato | Límite |
|---|---|---|---|---|
| Canasto | `3noEq3bc0pFm6eqS` | `Item.PkckHQYTFZavcR1f` | `chinchorro_canasto.webp` | No hay JSON Item individual localizado |
| Chinguillo · Bolsa-red | `uNJ5mY9qNi1NV7FT` | `Item.wNaqGGIGX5gXCds8` | `chinchorro_chinguillo.webp` | No hay JSON Item individual localizado |
| Eldjárn · Yesquero | `3evVs8OXvtXD9cki` | Sin `compendiumSource` en esta instancia | `nordico_eldjarn_yesquero.webp` | No usar el ID embebido como identidad canónica |
| Chope · Desconchador | Ocho instancias; siete apuntan a `Item.DNf0lSdWbNnpc2yX` | `Item.DNf0lSdWbNnpc2yX` | `chinchorro_chope.webp` | Son instancias repetidas del mismo origen, no ocho Items fuente |

Los IDs de instancia embebida no sustituyen la referencia histórica del Item. La exportación actual deberá resolver las identidades y carpetas reales.

### Equipo todavía sin cruce

Los otros recursos WebP de Equipo permanecen sin asociación documental verificada. En particular, los nombres genéricos `com_01_foundry_256.webp` a `com_06_foundry_256.webp` no autorizan a inferir un Item por código. Los PNG maestros con nombres como Soga, Bastón, Manta, Antorcha, Odre y Pedernal son registros visuales del banco de Equipo; sus IDs Foundry no están identificados aquí.

Los códigos COM de Equipo y los códigos COM del catálogo de Defensas se mantienen separados por familia y paquete. No se deben cruzar por compartir numeración.

## 4. Instrumentos ERH — referencias históricas y cautelas

El mismo snapshot de Actor contiene cuatro Items musicales con referencias históricas:

| Item del snapshot | ID embebido | Referencia histórica | Asset staging que podría relacionarse | Estado |
|---|---|---|---|---|
| Campana lickanantay | `OxXMNfVHH6cAQt4Q` | `Item.1LcCOE7I9Y0d8ZEl` | Ninguno con nombre equivalente | Sin cruce |
| Flauta de hueso | `PuEpZAeKcPbL9RhD` y `t1EPws0fhmpfbOhQ` | `Item.2jxDxHRMPndgWTXo` | `FLAUTA_HUESO_ERH_256.webp` | Candidato; verificar identidad del ejemplar |
| Cuerno musical | `26XbJXsNZwpvnIIR` | `Item.Ay2fRQefjFXpiw8m` | `CUERNO_MUSICAL_ERH_256.webp` | Candidato semántico |
| Arpa de boca | `k4bqXue582gNhwfY` y `O2AP3d1J5I90IxJ8` | `Item.nVzgI7Jcguq3Ow5m` | `ARPA_BOCA_NORDICA_ERH_256.webp` | Cruce candidato; **runtime pendiente técnico** |

Las dos instancias de Flauta y las dos de Arpa apuntan a la misma referencia histórica en sus respectivos casos. No se cuentan como cuatro Items fuente.

La auditoría ERH vigente conserva el catálogo descriptivo v04 como autoridad. Arpa de boca sigue pendiente técnico para runtime; no se promueve por el solo hecho de existir un WebP en staging. La Campana piramidal ERH no se equipara a Campana lickanantay: son denominaciones distintas y no hay evidencia para fusionarlas.

El resto de los 28 WebP ERH permanece sin ID Foundry asociado en esta matriz. La auditoría de paquetes no autorizó crear ni modificar Items.

## 5. Defensas

La auditoría de Defensas establece esta correspondencia editorial:

| Código DEF | Nombre editorial | Código de asset |
|---|---|---|
| DEF-01 | Makün — Manta Mapuche | COM-03 |
| DEF-02 | Capa Selk'nam | COM-05 |
| DEF-03 | Escudo nórdico | COM-06 |
| DEF-04 | Casco con insignia — Casco Pica-Tarapacá | COM-07 |
| DEF-05 | Escudo de cuero — Coraza Chiu-Chiu | COM-08 |
| DEF-06 | Tañaña — Coraza cónica mapuche | COM-09 |
| DEF-07 | Celada — Casquete de cuero mapuche | COM-10 |
| DEF-08 | Coraza atacameña de cuero de caimán | COM-11 |
| DEF-09 | Armadura acolchada Chimú | COM-12 |

Hay ocho pares de assets disponibles en el consolidado: COM-03, COM-05, COM-06, COM-07, COM-08, COM-10, COM-11 y COM-12. COM-09 Tañaña sigue aprobado pero pendiente de recuperar su binario final.

No se localizaron documentos Item Foundry con IDs/UUID que permitan asociar estas ocho defensas. Los códigos DEF y COM son distintos y deben conservarse. Los assets no se convierten automáticamente en Items.

## 6. Turianos

La auditoría recupera cuatro recursos visuales principales:

| Código | Actor | Asset | Estado |
|---|---|---|---|
| TUR-01 | Cantor / Tamborilero | `cantor_tamborilero.webp` | Visual recuperado; ficha pendiente |
| TUR-02 | Viajero | `viajero_trenzas.webp` | Visual recuperado; ficha pendiente |
| TUR-03 | Sabio | `sabio_pregonando_libro.webp` | Visual recuperado; ficha pendiente |
| TUR-04 | Guerrero gorilesco de lanza | `guerrero_gorilesco_lanza.webp` | Visual recuperado; ficha pendiente |

El JSON de seis candidatos TUR-01..06 no contiene `_id`, UUID ni carpeta Foundry. Sangu (TUR-05) permanece candidato no validado y Popr (TUR-06) requiere prueba Foundry. No se crean ni actualizan Actors a partir de ese JSON ni se asignan IDs por código.

## 7. Conclusión técnica

1. El árbol fuente actual de GitHub contiene 38 Items: 21 Armas y 17 Reliquias. Equipo, Defensas e Instrumentos no están todavía incorporados como documentos fuente; Turianos no tiene todavía Actors fuente canónicos.
2. Existen cinco JSON Item individuales de Equipo en la Biblioteca y un snapshot de Actor antiguo con referencias históricas útiles. Son evidencia para la reconciliación, no sustitutos de una exportación completa del mundo actual.
3. Se reconocen siete cruces candidatos de Equipo (cinco JSON individuales y dos Items visibles sólo en snapshot) y cuatro referencias históricas de Instrumentos; ninguno autoriza todavía actualizar rutas runtime.
4. Los 69 recursos de staging deben permanecer en staging. Los estados editoriales/técnicos y las reservas de las auditorías de Defensas, ERH y Turianos prevalecen sobre el nombre del archivo o la etiqueta genérica del manifiesto.
5. El manifiesto declara 37 PNG maestros de Equipo/Defensas, pero cuatro rutas comprobadas devuelven 404. Debe separarse el inventario declarado del binario efectivamente versionado.
6. La siguiente fuente necesaria es una exportación actual de todos los Items del mundo y de los compendios `world.*`, con `_id`, UUID, carpeta, flags, payload y `img`. Se prepara un exportador de sólo lectura en `tools/foundry/export-items-inventory.js`.

## 8. Registro

**Decisiones:** no inferir IDs; no promover staging; mantener separadas las familias Equipo/Defensas/Instrumentos/Turianos; no colapsar instancias embebidas repetidas; preservar el estado técnico pendiente de Arpa de boca y COM-09.  
**Pendientes:** export actual de Items; cotejo completo de rutas y PNG maestros; validación visual de candidatos; recuperación de IDs de Defensas y Actors Turianos.  
**Fuentes:** `TRANSFER_MANIFEST.json`; `source/items/README.md`; auditorías `AUDITORIA_DEFENSAS_2026-11-12.md`, `AUDITORIA_INSTRUMENTOS_ERH_2026-11-13.md`, `AUDITORIA_TURIANOS_2026-11-13.md`; JSON Item individuales de Biblioteca; snapshot `fvtt-Actor-1-cwDjAZn88gYFURfx (2).json`.  
**Cambios al Estado Maestro:** ninguno. No se modifican fuentes Item, assets runtime, módulo productivo, MELIAZ Bridge ni `main`.
