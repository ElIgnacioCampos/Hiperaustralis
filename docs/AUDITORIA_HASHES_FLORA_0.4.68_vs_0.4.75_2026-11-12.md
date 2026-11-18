# Auditoría de hashes de iconos Flora: 0.4.68 vs 0.4.75

Fecha: 2026-11-12  
Rama: `work/native-compendia-pipeline`  
Fuentes:
- `HIPERAUSTRALIS_COMPENDIOS_0.4.68_FLORA_40_JOURNALS_LAB.zip`
- `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip`

## Resultado

La discrepancia detectada inicialmente entre las fichas editoriales y los 40 iconos del paquete 0.4.75 **no corresponde a una sustitución gráfica sin documentar**. Los hashes y tamaños consignados en las fichas editoriales coinciden exactamente con los iconos originales del paquete 0.4.68: **40/40**.

Los 40 iconos WebP del paquete 0.4.75 presentan hashes y tamaños distintos porque corresponden a la variante optimizada. Se compararon por nombre de archivo y SHA-256, no sólo por tamaño.

| Medida | 0.4.68 | 0.4.75 |
|---|---:|---:|
| Iconos cotejados | 40 | 40 |
| Peso conjunto | 11.417.558 bytes | 5.951.968 bytes |

Reducción conjunta: **47,87 %**.

## Interpretación técnica

- Las fichas editoriales conservan la huella de los originales 0.4.68.
- El paquete 0.4.75 incorpora variantes WebP optimizadas.
- No hay evidencia en este cotejo de cambio de identidad gráfica; la comparación realizada demuestra la correspondencia de nombres y la optimización de payload, no una evaluación visual pixel a pixel.
- Se preservan los metadatos editoriales originales. No se reescriben hashes históricos para hacerlos coincidir con los archivos optimizados.
- Si el pipeline necesita verificar los assets actuales, debe mantener un manifiesto técnico separado con hash y bytes de 0.4.75.

## Decisión

**Aceptar los 40 iconos 0.4.75 como assets optimizados de la fuente de migración**, conservando los hashes editoriales como referencia histórica de 0.4.68. La discrepancia queda explicada y no bloquea por sí misma la migración.

## Límites y pendientes

1. Esta auditoría no verifica IDs/UUID persistentes de Foundry: los JSON fuente no contienen `_id` de nivel superior.
2. Los fondos se contabilizan como 8 archivos compartidos; sus referencias deben validarse contra cada Item al incorporar.
3. La migración al árbol `source/territorios/flora/items/` y la incorporación de assets aún no se han ejecutado.
4. No ejecutar instalador ni publicar en entornos productivos.

## Registro de bloque

- **Decisiones:** preservar JSON y fichas editoriales; usar iconos 0.4.75 optimizados; mantener hashes editoriales históricos.
- **Pendientes:** incorporar documentos/assets; validar rutas de fondos; cotejar IDs persistentes Foundry mediante export de compendio/mundo.
- **Fuentes:** paquetes 0.4.68 y 0.4.75; auditoría de extracción `MIGRACION_FLORA_FUENTE_v02.zip`.
- **Cambios al Estado Maestro:** ninguno. Requiere aprobación explícita.
