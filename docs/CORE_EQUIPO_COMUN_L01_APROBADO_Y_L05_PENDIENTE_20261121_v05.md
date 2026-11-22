# HIPERAUSTRALIS RPG — CORE / Equipo Común
## Cierre visual L01 · corrección editorial Ckarisur · siguiente paso L05
**Fecha:** 2026-11-21 · **Estado:** L01 APROBADO VISUAL; sin QA de cliente Foundry. **Rama de documentación:** `work/native-compendia-pipeline`.

### 1. Decisiones consolidadas
- El «ok» autoral posterior a la entrega v02 limpia de L01 confirma **Külko, Uysu, Brýni y Ckarisur** como piezas aprobadas visualmente. Los cuatro objetos ya existían: no volver a generarlos.
- ZIP delta v02 técnicamente probado por CRC, SHA-256 y pruebas visuales claro/oscuro y 64px; **no se alteraron siluetas ni materialidad**. Resultado: 3.672 residuos rojos del master y 135 residuos tras reducción eliminados; 4 PNG 512 y 4 WebP lossless 256.
- **BBTECA:** renombrado el mismo respaldo a `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L01_DELTA_LIMPIEZA_ALFA_v02_APROBADO.zip`. Archivo único sin duplicación; SHA-256 `f9d6a0bbfe6315e49d46609f70ef6e0b95e6f379b02c3bc7aac63c4459a06988`.
- La lámina fuente y el paquete original `HIPERA_EQUIPO_COMUN_L01_2x2_CANDIDATOS_v01.zip` permanecen **sin edición** como testigos. El manifiesto **interno** del ZIP delta data de antes de la aprobación y conserva `CANDIDATO`; la aprobación posterior se documenta en el manifiesto de rama `manifests/equipo-comun-l01-aprobacion-20261121.json`, sin reempaquetar.
- **Ckarisur:** la aprobación del lote y el «ok» a la propuesta mínima permiten registrar **editorialmente** la sustitución puntual de `system.props.descripcion`, sin desplegarla:
  - Antes: «Peine pequeño, tallado en madera, para desenredar y cuidar el cabello.»
  - Nuevo texto aprobado para implementación posterior: «Peine pequeño, con dientes vegetales sujetos entre varillas de madera, para desenredar y cuidar el cabello.»
  - Item histórico: `Compendium.world.hiperaustralis-rituales.Item.xzRV37AjDu0WVuzh`; no tocar `procedencia`, template, flags, IDs ni reglas. La edición **NO se aplicó a Foundry**.
- La imagen Ckarisur es coherente con peines arqueológicos de espinas vegetales unidos con varillas, pero ello no implica reproducir un objeto arqueológico específico de 1067. El cambio editorial resuelve inconsistencia entre una descripción concreta y la imagen.

### 2. Registro por ítem
| Cultura | Item | ID de compendio | Estado |
|---|---|---|---|
| Mapuche | Külko · Canasto | `F8SYAQfuZnLiXCv6` | L01 v02 aprobado |
| Aymara | Uysu · Arado de pie | `tfOpt8w3B1dFl6qS` | L01 v02 aprobado |
| Nórdicos | Brýni · Piedra de afilar | `kMqPL8yvZQIaZGmY` | L01 v02 aprobado |
| Lickanantay | Ckarisur · Peine | `xzRV37AjDu0WVuzh` | L01 v02 aprobado + ajuste editorial registrado |

### 3. Siguiente frente inmediato: L05, sin generación por defecto
Las cuatro formas de L05 están aceptadas: Mortero, Snælda, Saba, Anzuelo/sedal. Se observó **deriva hiperrealista** respecto del canon ERH. La fuente RGB 1254 con cuadriculado dibujado está respaldada en BBTECA como `HIPERA_EQUIPO_COMUN_L05_LAMINA_MORFOLOGIA_APROBADA_ESTILO_PENDIENTE_v01.png`.

- Objetivo artístico: reducción de microtextura, modelado lumínico y ornamentación gratuita; **conservar contornos, función, posiciones, proporciones y materias**.
- Hay un prompt de transformación definido en `docs/CORE_EQUIPO_COMUN_L01_DELTA_ALFA_QA_Y_L05_ESTILO_2026-11-21_v04.md`; **no se ha ejecutado ni hay versión estilizada aprobada**.
- No inventar sustituciones visuales ni crear otra lámina antes de solicitud explícita del usuario. Se conserva fuente original incluso si se creara una candidata.
- Antes de cualquier derivación L05, convertir a alfa real; la fuente RGB no es un recurso transparente para Foundry.

### 4. Estado de integración
- **QA gráfico local L01:** completo.
- **QA en cliente Foundry V14 aislado:** pendiente; no se ha ejecutado.
- **Promoción de `img` a compendios y edición Ckarisur:** pendientes; no ejecutados ni desplegados.
- **Otras familias:** 29 WebP históricos intactos; L02, L03 y L04 con aprobaciones visuales; L05 solo aceptación de forma y estilo a resolver.
- **`main`, Bridge MELIAZ, mundo productivo y Estado Maestro ACTUAL:** intactos.

### 5. Cierre
**Decisiones:** L01 v02 visualmente aprobado; texto mínimo de Ckarisur aprobado editorialmente para futuro parche; L05 conserva su fuente con aviso de estilo.
**Pendientes:** decisión de ejecutar edición de estilo L05, QA Foundry aislado y futura aplicación controlada de imagen/descripción.
**Fuentes:** ZIP original y delta L01 en BBTECA, `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`, canon ERH, registro v04 y manifiesto L01 de GitHub.
**Cambios al Estado Maestro:** ninguno.
