# Auditoría de instrumentos musicales ERH — 2026-11-13

Rama: `work/native-compendia-pipeline`  
Estado: reconciliación de paquetes gráficos y documentación. No declara migración binaria ni creación/actualización de Items Foundry.

## Fuentes inspeccionadas

| Paquete | Entradas | SHA-256 | CRC |
|---|---:|---|---|
| `HIPERAUSTRALIS_INSTRUMENTOS_ERH_CONSOLIDACION_PARCIAL_v01.zip` | 49 | `d8ddc54957d649d4625b09c77dce7feaa4632634bbe8851d4271a8a574e3336a` | OK |
| `INSTRUMENTOS_ERH_CONSOLIDADO_FOUNDRY_v01.zip` | 30 | `10b944708ed588894d8d3fbc522aff7c1f9a0cd822fbdb5fcd13a53ffe5feda9` | OK |
| `LOTE_INSTRUMENTOS_ERH_02_WEBP256.zip` | 9 | `a2c9f9877e384eec2165c3dedf9cc27ae76d51f5448921a7c8f35c73c715fea6` | OK |
| `INSTRUMENTOS_ERH_LOTE03_APROBADO_v01.zip` | 14 | `ce0d41f957f46e9c80518fd7a5ba092a011beace5f870fee0c4c0f7acd7c266e` | OK |
| `LOTE04_SELKNAM_ERH_RESPALDO_v01.zip` | 7 | `8a04014a0340c1ac539bda8e800beb8002b06c8da25898357ee13ce22c0b9e8f` | OK |
| `LOTE05_NORTE_COSTERO_ERH_CONSOLIDADO_v01.zip` | 13 | `3d3322b04a1fbc50d133fa315aa777d2ac9aac4d84a2260edf51a476d0f44a12` | OK |

## Resultado técnico

- El consolidado parcial contiene 28 derivados WebP de 256×256 RGBA; todos inspeccionados con alfa real (rango 0–255).
- Los paquetes individuales de lotes 03, 04 y 05 contienen masters PNG 1024×1024 y derivados WebP 256×256 RGBA; se verificó formato, dimensiones y alfa.
- El paquete Foundry v01 incluye 17 derivados WebP organizados en familias culturales, más dos recursos extra con estados técnicos distintos y masters/fuentes auxiliares.
- No se detectaron daños CRC en ninguno de los seis ZIP.
- Los paquetes no representan seis lotes independientes sumables: hay copias exactas entre consolidaciones y respaldos.

## Deduplicación por SHA-256

Coincidencias comprobadas:
- Lote 02 Andino/Lickanantay: los seis WebP coinciden exactamente entre consolidación parcial, consolidado Foundry y ZIP individual Lote 02. Una sola copia física por recurso.
- Lote 03: Siku, Flauta Coyo y Campana piramidal coinciden exactamente entre consolidación parcial y respaldo aprobado del lote.
- Lote 04: Canto corporal y Bastón percutido coinciden exactamente entre consolidación parcial y respaldo Selk'nam.
- Lote 01 Mapuche/Andino y Lote 02 nórdico: sus WebP aparecen idénticos entre consolidación parcial y consolidado Foundry.
- Kakel-kultrung: el WebP coincide exactamente entre consolidación parcial y consolidado Foundry.
- Lote 05: la consolidación parcial usa cinco derivados identificados como v02; el ZIP individual disponible es v01. No son el mismo binario por nombre de versión y no se debe reemplazar v02 por v01. El paquete parcial es la fuente disponible para los derivados v02; el ZIP individual v01 conserva masters y documentación.

## Cobertura por lote y estado

- Lote 01 Mapuche/Andino: seis piezas gráficas incluidas en los paquetes consolidados.
- Lote 02 Nórdico: cuatro piezas gráficas incluidas.
- Lote 02 Andino/Lickanantay: seis piezas; deduplicadas entre tres paquetes.
- Lote 03: tres piezas visualmente aprobadas (Siku, Flauta Coyo y Campana piramidal).
- Lote 04 Selk'nam: dos piezas visualmente aprobadas (Bastón percutido y Canto corporal). El silbato de hueso Selk'nam no está incluido; su atribución sigue pendiente.
- Lote 05 Norte costero: cinco iconos visualmente aprobados; la consolidación parcial utiliza derivados v02.
- Extras: Kakel-kultrung aprobado. Arpa de boca nórdica aparece dentro de EXTRAS_APROBADOS en el consolidado parcial, pero el paquete Foundry separado la mantiene en `PENDIENTE_TECNICO_ARPA_BOCA`; por cautela prevalece el estado técnico pendiente para runtime hasta resolver la discrepancia.

## Autoridad editorial: catálogo v04

`CATALOGO_INSTRUMENTOS_ERH_DESCRIPCIONES_CONSOLIDADO_v04.md` (12-11-2026) es la descripción vigente. El documento declara confirmadas por el autor las descripciones de Campana piramidal y Siku, conserva un único ícono de Siku y posterga la división ira/arka en dos íconos.

La propuesta `ERH_DESCRIPCIONES_DE_JUEGO_PROPUESTAS_v0.1_2026-11-13.md` es un borrador de simplificación para jugadores. La auditoría comparativa del mismo día determina que no sustituye v04. Se preservan las alertas:
1. Silbato doble: conflicto de identificación Arica / Playa Miller 7; no asumir que es el mismo ejemplar.
2. Flauta PLM-8: v04 documenta reparación con hilo/resina; la propuesta dice lana. Mantener v04 hasta cotejar ficha primaria.
3. Sonaja Alto Ramírez: piedrecillas internas aparecen en la propuesta, pero v04 no especifica contenido; no integrar sin fuente primaria.
4. Campana: no afirmar que suena al moverse; mecanismo de suspensión/sonido aún no confirmado. La función narrativa «señala el comienzo de un ritual» sí está aprobada.
5. Tambor Maitas: conservar cuerpo tejido en espiral y cuerda de suspensión; no convertirla en asa para llevarlo.
6. Siku: la complementariedad ira/arka está documentada en prácticas musicales, pero no atribuirla automáticamente al ejemplar arqueológico concreto.

No se modifican descripciones v04 ni el Estado Maestro.

## Dictamen de migración

1. Usar la consolidación parcial como índice transversal de derivados WebP, no como fuente maestra única.
2. Usar los respaldos de lote para recuperar masters, documentación y estados; preferir la versión más reciente explícitamente identificada por manifiesto, no por parecido visual.
3. Deduplicar por SHA-256 y conservar alias de ruta en manifiesto.
4. Mantener los estados editoriales/técnicos diferenciados; no promover Arpa de boca a runtime.
5. No crear ni modificar Items Foundry: los paquetes inspeccionados no contienen un mapa completo de IDs de los documentos existentes.
6. No actualizar rutas runtime hasta reconciliar el export actual de Foundry y verificar los recursos destino.
7. Los binarios aún no se han copiado a `assets/` en GitHub.

## Pendientes

- Reconciliar cada instrumento con los Items reales del export vigente: `_id`, UUID, carpeta, flags, payload e imagen actual.
- Resolver Arpa de boca y conservar su estado pendiente hasta QA.
- Resolver las seis alertas editoriales anteriores mediante fuentes primarias; no integrar la propuesta v0.1 en bloque.
- Recuperar los masters individuales que no estén presentes en la consolidación parcial, especialmente los de lotes 01 y 02.
- Migrar una sola copia de cada binario aprobado y verificar SHA-256 desde GitHub.

## Registro

**Decisiones:** v04 continúa como catálogo descriptivo vigente; propuesta v0.1 no integrada; duplicados exactos no se repiten; Lote 05 v02 prevalece sobre v01 para los derivados que la consolidación parcial contiene; Arpa de boca sigue pendiente técnico.  
**Pendientes:** IDs Foundry, rutas runtime, masters faltantes y alertas documentales.  
**Fuentes:** seis ZIP enumerados; catálogo ERH v04; propuesta ERH v0.1 y auditoría comparativa v0.1 vs v04 (2026-11-13).  
**Cambios al Estado Maestro:** ninguno.
