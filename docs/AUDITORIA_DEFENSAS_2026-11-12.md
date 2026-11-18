# Auditoría y staging de defensas — 2026-11-12

Rama: `work/native-compendia-pipeline`  
Estado: inventario y reconciliación de los paquetes recuperados. No declara migración binaria a GitHub.

## Fuentes inspeccionadas

- `COM_DEFENSAS_CONSOLIDADO_TOTAL_v02.zip` — 18 entradas, CRC íntegro, 1,383,120 bytes; SHA-256 `31890564f71121c06450464dd1e0ce0c67a82c477f3ea1cdd21ab7e844357ea8`.
- `CATALOGO_DEF_DESCRIPCIONES.zip` — 12 entradas, CRC íntegro, 7,295 bytes; SHA-256 `5c20aca4c3fee3b8f9dd85305c00e64120a96783253978939fe776a4282b7441`.
- `COM12_CHIMU.zip` — 2 entradas, CRC íntegro, 175,008 bytes; SHA-256 `1fe557af06ab23032854ccd9c39f68203a4cc0b894c4dc48304275fe74870c17`.

## Resultado del cotejo

El consolidado v02 contiene 8 defensas con PNG y WebP: COM-03, COM-05, COM-06, COM-07, COM-08, COM-10, COM-11 y COM-12. El manifiesto interno declara aprobados los ocho archivos disponibles y señala COM-09 Tañaña como aprobado pero pendiente de recuperar sus binarios finales.

Los 16 binarios presentes son 256×256 RGBA, con transparencia efectiva (canal alfa con rango 0–255). Se verificó la integridad CRC del ZIP. El ZIP individual COM12 contiene exactamente los mismos dos binarios de COM-12 que el consolidado: ambos SHA-256 coinciden. Por tanto, COM12 individual es una copia redundante y no debe volver a incorporarse.

## Correspondencia editorial

| Código catálogo | Nombre editorial | Código de asset |
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

La correspondencia se establece por nombres y descripciones coincidentes entre el catálogo y los nombres del paquete. Los códigos DEF y COM se conservan como identificadores distintos; no se sustituyen entre sí.

## Hallazgos editoriales que deben preservarse

- DEF-02: el propio catálogo indica que la denominación local Selk'nam no está suficientemente corroborada.
- DEF-06: «Tañaña» procede de una crónica histórica; el catálogo no acredita que sea una palabra mapudungun.
- DEF-07: «Celada» es término castellano de la fuente histórica, no nombre local mapuche.
- DEF-08: la cobertura anatómica exacta no puede establecerse con las referencias disponibles.
- DEF-09: el fragmento estudiado no conserva la forma completa ni permite asegurar la cobertura anatómica.
- La mecánica común del catálogo es una transcripción descriptiva; no reemplaza la regla extensa de CORE.

## Decisión técnica

1. Conservar como lote binario recuperable los 8 pares PNG/WebP de COM-03, 05, 06, 07, 08, 10, 11 y 12.
2. No duplicar COM-12 desde el ZIP individual.
3. Mantener COM-09 en estado `approved_pending_asset_recovery`; no fabricar ni sustituir su imagen.
4. Mantener las descripciones DEF-01–09 como fuente editorial independiente de los assets COM.
5. No crear todavía JSON Foundry ni asignar IDs de Item: estos paquetes no contienen documentos Foundry ni un mapa de IDs.
6. No modificar referencias runtime. Primero se debe cotejar el export de Items vigente y sus IDs/rutas.
7. Los binarios siguen locales en esta etapa; aún no se han copiado a `assets/` en GitHub.

## Pendientes

- Reconciliar las nueve defensas con los Items del export actual de Foundry y recuperar _id, UUID, carpeta, flags y ruta runtime.
- Localizar el PNG/WebP final aprobado de COM-09.
- Determinar si el catálogo DEF ya está integrado en otra fuente editorial o si debe incorporarse como documentación de referencia.
- Tras validar IDs y referencias, migrar los binarios a `assets/` y actualizar rutas de forma trazable.

## Registro

**Decisiones:** no duplicar COM12; separar códigos DEF/COM; mantener COM09 pendiente de binario; no inventar Items Foundry.  
**Pendientes:** IDs/payloads Foundry, COM09, referencias runtime y migración binaria.  
**Fuentes:** los tres ZIP indicados en esta auditoría y sus manifiestos internos.  
**Cambios al Estado Maestro:** ninguno.
