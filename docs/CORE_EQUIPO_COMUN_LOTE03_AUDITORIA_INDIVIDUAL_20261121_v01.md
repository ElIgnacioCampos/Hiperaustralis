# HIPERAUSTRALIS RPG — CORE / Equipo Común
## L03: aprobación autoral y auditoría de particularidades
**Fecha:** 2026-11-21
**Estado:** APROBACIÓN VISUAL AUTORAL · AUDITORÍA MORFOLÓGICA · DERIVADOS TÉCNICOS CANDIDATOS · SIN CAMBIOS RUNTIME

## 1. Estado y copia aprobada
El usuario aprobó expresamente **las cuatro figuras** de la lámina L03. El archivo original se conserva sin intervención y sirve de referencia definitiva de lo aprobado. En este pase se auditan diferencias de materia, función e historicidad que podrían ameritar una **corrección localizada posterior**, no una regeneración en bloque.

**Respaldo BBTECA comprobado:**
`/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L03_APROBADOS_AUDITORIA_v01.zip`

**SHA-256 ZIP:** `600f41c4a3832c97415ddf92f814fceec9c998418d320926ef75f1021e4e56e7`
**SHA-256 lámina original:** `213c8bea678620dab1262e66f339d7f646993949123b7a9dc33c53eac025f302`

Contenido: lámina 2×2 original; cuatro PNG maestros 512; cuatro WebP lossless 256 con alfa; comparación de fondo claro/oscuro; manifiesto por figura y archivo LEEME. **Normalización dimensional, no redibujo**. Se suprimieron en el derivado del Witrü dos marcas flotantes **separadas de la cuchara**; el original quedó intacto. El arte no fue subido a rutas runtime.

## 2. Cotejo individual y decisiones
| Objeto | ID compendio `world.hiperaustralis-rituales` | Rasgo que sí coincide con la ficha | Reserva | Propuesta |
|---|---|---|---|---|
| **Witrü · Cuchara de madera (Mapuche)** | `5nFewbreKtldDFdL` | Madera, cavidad cóncava, mango largo; uso para comer/remover/servir | La imagen añade una ligadura al extremo del mango; la procedencia describe **dos pequeñas incisiones**, no ligaduras. Se documentan cucharas mapuches monóxilas | **Mantener aprobada**. Ajuste opcional del mango solo si se prioriza reproducción literal de la ficha |
| **Q'ipi · Bulto de carga (Aymara)** | `g2YB821BybKVvqgK` | Fardo unitario de textiles reunidos y atados; coincide con descripción y cuerda conservada | Motivo textil geométrico no acreditado como réplica específica; el vocablo está documentado en aymara y coexiste con uso quechua | **Conservar**, sin cambios; no atribuirle carácter ceremonial inexistente en ficha |
| **Ketill · Caldero (Nórdicos)** | `PmTYfMVymolkOvkq` | Recipiente metálico de cocción, anilla de suspensión y remaches; uso culinario | **Tres patas integradas** sugieren una tipología de caldero tripodal tardía. En época vikinga se documentan especialmente calderos de placas remachadas **suspendidos del fuego**, con cadena o trípode exterior (no patas en la olla) | **Corrección localizada prioritaria antes de runtime**: eliminar solo las tres patas, conservar asa, remaches, cuerpo, acabado y resto de la lámina. No redibujar toda la lámina |
| **Canasto (Lickanantay)** | `em5ML5e9yQyQCH2o` | Cesto de fibra vegetal, capacidad utilitaria, diseño geométrico que sí tiene paralelos arqueológicos en Atacama | La figura parece mostrar trenzado entrecruzado, mientras que ejemplares clásicos de San Pedro se documentan a menudo con **técnica en espiral**; su patrón no se vincula a un ejemplar puntual del s. XI | **Conservar aprobado**; registrar límite de fidelidad específica, revisar sólo si se pretende ilustrar tipo arqueológico preciso |

El **L03 tiene una sola corrección visual prioritaria propuesta**: el Ketill. Las observaciones sobre Witrü y canasto son reservas o detalles editoriales; no autorizan reabrir la lámina completa. La aprobación original prevalece hasta que el usuario ordene un cambio.

## 3. Fuentes
**Fuente principal de descripciones/procedencias:** export `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`, compendio `world.hiperaustralis-rituales`, carpeta `Equipo común`. Los cuatro registros tienen tipo `equippableItem`, `hipera_tipo=equipo` y plantilla `HipEquipTpl00001`.

- Witrü: Portal Chile Patrimonios, ficha `05SDC-5-1705`, `https://www.chilepatrimonios.gob.cl/ficha?doi=05SDC-5-1705`.
- Witrü: artículo *Mapuche küme kujfi kuzaw mamüll* (Museo Regional de la Araucanía), `https://www.investigacion.patrimoniocultural.gob.cl/sites/www.investigacion.patrimoniocultural.gob.cl/files/2023-05/15%20Arti%CC%81culo%20-%20Artefactos%20mono%CC%81xilos%20mapuche%20en%20el%20Museo%20Regional%20de%20la%20Araucani%CC%81a.pdf`.
- Q'ipi: vocabulario Aymara (Perú), `https://cdn.www.gob.pe/uploads/document/file/4973488/item_55_vocabulario_aymara.pdf?v=1692022988`; análisis lingüístico de Coroma, `https://www.scielo.cl/scielo.php?pid=S0717-73562010000100023&script=sci_arttext`.
- Ketill: *An Archaeology of Commensal Spaces...* (tesis sobre ajuar culinario escandinavo) y `https://www.hurstwic.org/history/articles/daily_living/text/food_and_diet.htm`. Documentan remachado y suspensión, no las tres patas integradas del icono.
- Canasto: *Tesoros de San Pedro de Atacama*, Museo Chileno de Arte Precolombino, sección de cestería, `https://banco.santander.cl/uploads/000/047/475/6b954a11-dfc7-4f73-96dd-28e828f765fe/original/Tesoros-de-San-Pedro-de-Atacama-1.pdf`; *Cestería* en Chile Patrimonios, `https://www.chilepatrimonios.gob.cl/ficha?doi=03FTP-19220`.

Estas fuentes permiten **compatibilidad tipológica**, no certificar que cada ilustración reproduce una pieza arqueológica exacta de 1067.

## 4. Cierre operativo
**Decisiones:** conservar la lámina original como APROBADA, los cuatro recursos derivados como candidatos técnicos; no regenerar los otros tres; solo Ketill con sugerencia de corrección morfológica prioritaria.
**Pendientes:** revisión puntual del Ketill si se autoriza; verificación de carga en Foundry aislado; conservar imágenes previas y no escribir `img` aún. L01 sigue candidato pendiente de aprobación.
**Fuente gráfica:** lámina creada y aprobada en este mismo chat; respaldo ZIP v01 de L03 en BBTECA.
**Cambios al Estado Maestro:** ninguno; tampoco `main`, Bridge, pack runtime o Forge.
