# Auditoría de integración gráfica de Equipo — 2026-11-12

Fuente: `HIPERAUSTRALIS_EQUIPO_COMPLETO_INTEGRACION_v01.zip`

## Integridad y composición
- SHA-256 del ZIP: `62d1bd28755b8bf86fed80e2d215b9f2679a7258793a47a2936276ec02f475a9`.
- 66 entradas; 7,693,095 bytes descomprimidos.
- CRC: íntegro.
- 29 maestros PNG 512×512 RGBA con alfa real (rango 0–255).
- 29 derivados WebP 256×256 RGBA con alfa real (rango 0–255).
- Total: 23 objetos culturales + 6 piezas de Equipo común.

## Composición cultural
- Chinchorro: 4 objetos (Canasto, Chinguillo, Chope, Punzón de hueso).
- Nórdicos: 3 aprobados (Eldjárn, Knífr, Saum-nál). Kambr no está incorporado.
- Aymara: 4 (Wayaqa, Qapu/Kapu, Phuno, Kiana). El cambio documental v02 fija Qapu como rótulo, conservando el nombre técnico histórico del archivo.
- Mapuche: 4 (Alka Metawe, Llepu, Pilwa, Rüfüwe).
- Selk'nam: 4 (Bolsa de fuego, Cham, Mooh, Tai).
- Lickanantay: 4; cierre gráfico documentado y QA 8/8 archivos.
- El README conserva observaciones editoriales: Chope como término arqueológico/regional; no atribuirlo como palabra Chinchorro. No completar lotes por cupos ni inventar nombres o equivalencias.

## Equipo común: deduplicación comprobada
Los seis WebP COM-01..06 del paquete son idénticos por SHA-256 a los seis del paquete transversal Foundry v04. Los seis PNG maestros COM-01..06 también son idénticos a los seis del paquete de maestros v04. Resultado: 12/12 coincidencias exactas. Mantener un único binario canónico por pieza; no copiar otra vez el lote común desde este ZIP.

El manifiesto v04 declara las seis piezas comunes aprobadas: Soga, Bastón de caminar, Manta, Antorcha, Odre con correa y Pedernal/eslabón.

## Dictamen de migración
1. El paquete gráfico pasa QA técnico: integridad, formato, dimensiones y transparencia.
2. El ZIP es un consolidado gráfico/documental, no un paquete de instalación.
3. No contiene JSON Foundry ni mapa de IDs; por tanto no se crean Items ni se asignan rutas runtime desde esta fuente.
4. No se copian todavía binarios a `assets/`; la auditoría no equivale a migración.
5. No se modifican IDs, nombres, seedId, descripciones ni Estado Maestro.
6. El lote Lickanantay queda cerrado gráficamente; no regenerar.
7. Mantener abiertas las cuestiones documentales Qapu/Kapu ya resueltas a nivel de rótulo de manifiesto, sin inferir validación cultural definitiva.

## Pendientes
- Reconciliar los 23 objetos culturales con los Items reales del export vigente de Foundry: _id, UUID, carpeta, flags, payload y ruta runtime.
- Determinar si los maestros PNG se conservarán en el repositorio como fuentes editoriales o sólo como respaldo; los derivados WebP son los candidatos runtime.
- Integrar una sola copia de los seis COM comunes, sin duplicar los binarios ya identificados en v04.
- Migrar binarios después de validar referencias y autonomía del módulo.

## Registro
**Decisiones:** 29 pares maestro/derivado verificados; COM-01..06 duplicados exactos respecto de v04; no duplicar; Lickanantay cerrado gráficamente.  
**Pendientes:** reconciliación Foundry y migración binaria.  
**Fuentes:** ZIP de integración v01, manifiesto, control SHA-256, README y documentos internos del paquete.  
**Cambios al Estado Maestro:** ninguno.
