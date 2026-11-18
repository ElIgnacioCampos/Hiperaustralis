# Reconciliación inicial del corpus histórico de Objetos — 2026-11-14

Rama: `work/native-compendia-pipeline`  
Fuente histórica: exportación Foundry Items de Hipera 5, pack `world.hiperaustralis-rituales`.  
Manifiesto de extracción: `MANIFEST_MIGRACION_ITEMS_HISTORICOS_135_v01.json` (generado localmente en esta etapa).

## Resultado del cruce de identidad

Se cotejaron los 135 documentos históricos contra los lotes fuente ya incorporados al repositorio.

| Cruce | Resultado | Tratamiento |
|---|---:|---|
| Armas históricas vs. manifiesto `armas-source-manifest.json` | 20/20 mismos `_id` | No reingresar como nuevos documentos; verificar payload y mantener procedencia histórica |
| Reliquias históricas cotidianas vs. lote recuperado de 16 | 8/8 mismo nombre, distinto `_id` | Colisión editorial/versiones paralelas; no fusionar ni descartar |
| Reliquias históricas legendarias vs. lote recuperado de 16 | 8/8 mismo nombre, distinto `_id` | Colisión editorial/versiones paralelas; no fusionar ni descartar |
| Defensas, Equipo común, Instrumentos, Parafernalia y Rituales | 99 documentos | Sin colisión de identidad documentada con los lotes fuente revisados; siguen sujetos a cotejo por ID y contenido |

## Detalle: Armas

Los 20 IDs del pack histórico coinciden exactamente con los 20 IDs del manifiesto de armas ya versionado. Por tanto, no se deben crear segundos documentos para esos IDs. El corpus histórico sigue siendo fuente de procedencia y referencia; la igualdad de IDs no demuestra por sí sola igualdad de payload.

## Detalle: Reliquias

Los 16 nombres históricos coinciden con los 16 nombres del lote recuperado desde `reliquias.json`, pero los IDs Foundry son distintos en los 16 casos. Se trata de dos conjuntos de documentos diferentes que comparten identidad editorial por nombre. No se debe deduplicar por nombre ni reemplazar un ID por otro.

La decisión sobre qué versión debe alimentar el pack nuevo requiere comparación semántica de cada par: sistema, plantilla, propiedades, descripción, flags, imagen, efectos y metadatos. Hasta entonces, conservar ambas fuentes y su trazabilidad.

## Alcance de assets

El export histórico contiene 95 referencias de imagen bajo `modules/hiperaustralis-rituales/` y 40 referencias que no siguen ese prefijo. Esto sólo clasifica rutas declaradas; no acredita que los 95 binarios estén recuperados o que los otros 40 sean recursos válidos. La migración de rutas queda bloqueada hasta el cotejo binario.

## Decisiones operativas

1. No duplicar los 20 Items de Armas por identidad.
2. No fusionar los 16 pares de Reliquias por nombre; conservar los dos IDs y comparar contenido antes de elegir la fuente del pack.
3. Incorporar los 99 documentos restantes a una capa histórica de respaldo y preparar su fuente canónica tras verificar colisiones de ID y contenido.
4. No cambiar rutas `img` hasta comprobar cada recurso de destino.
5. No migrar Items embebidos de Actors en este lote.
6. Mantener todo en `work/native-compendia-pipeline`; no tocar `main`, Forge productivo, el módulo estable ni MELIAZ Bridge.

## Pendientes

- Comparación semántica de 20 pares de Armas.
- Comparación semántica de 16 pares de Reliquias.
- Auditoría de IDs y contenido de los 99 restantes contra todo el árbol de fuentes del repositorio.
- Verificación y migración de binarios de imagen.
- Incorporación del respaldo histórico y fuentes canónicas sin duplicación.
