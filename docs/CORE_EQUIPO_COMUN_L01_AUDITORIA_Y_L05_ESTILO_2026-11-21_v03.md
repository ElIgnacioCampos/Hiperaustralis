# HIPERAUSTRALIS RPG — CORE / EQUIPO COMÚN
## L01 auditado + L05: regla correctiva de estilo · v03
**Corte operativo:** 2026-11-21 · **Rama:** `work/native-compendia-pipeline`.
**Estado:** REVISIÓN DOCUMENTAL Y VISUAL. Sin nuevas imágenes, sin reescritura de Items, sin despliegue Foundry y sin cambio al Estado Maestro.

### 1. Recuperación efectiva del L01
Fuente recuperada e inspeccionada en el runtime:
- ZIP `HIPERA_EQUIPO_COMUN_L01_2x2_CANDIDATOS_v01.zip`, 3.672.756 bytes, SHA-256 `6a55f579caaf978f462d67b76a479fe743778678840a35d86c0a30d8e4c79cb9`.
- Fuente original `EQ_COMUN_L01_2x2_GENERADO_ORIGINAL.png`, RGBA 1254×1254, SHA-256 `a61715dce90f2b62524245f956160b886843a77866fc9321010a6e357210b303`.
- Se verificaron los **cuatro PNG 512 RGBA**, los **cuatro WebP 256 RGBA**, sus rutas e identidades en el manifiesto. ZIP CRC íntegro.
- **Nuevo respaldo BBTECA verificado:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L01_2x2_CANDIDATOS_v01.zip`.
- **Estado:** L01 aún **CANDIDATO**, sin aprobación autoral de las cuatro piezas como versión final.

### 2. Examen individual con ficha original de Foundry
**Fuente principal:** export `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`, compendio `world.hiperaustralis-rituales`, carpeta `Equipo común`.

| Item | ID compendio | Ficha original | Dictamen visual / cultural |
|---|---|---|---|
| **Külko · Canasto** — Mapuche | `F8SYAQfuZnLiXCv6` | «Canasto tejido con fibras vegetales para contener, separar o transportar productos y objetos pequeños»; borde rehecho | Forma de cesto hondo y borde reforzado reconocibles. Conservar imagen; textura interior excesiva para ERH, simplificación opcional, no rediseñar |
| **Uysu · Arado de pie** — Aymara | `tfOpt8w3B1dFl6qS` | «Herramienta de labranza accionada con el pie para abrir y remover la tierra antes de cultivar» | Mango largo, punta y estribo lateral visibles. Identidad funcional respaldada; no confundir con pico. Conservar como candidato |
| **Brýni · Piedra de afilar** — Nórdicos | `kMqPL8yvZQIaZGmY` | «Piedra abrasiva pequeña para mantener el filo de cuchillos, hachas y otras herramientas» | Piedra larga de extremo redondeado; la forma tiene paralelos museográficos y no exige reducción obligatoria a barra plana. Mantener; revisar sólo si se pierde lectura a 64px |
| **Ckarisur · Peine** — Lickanantay | `xzRV37AjDu0WVuzh` | «Peine pequeño, tallado en madera, para desenredar y cuidar el cabello» | **Desajuste entre ficha e imagen, no entre imagen y evidencia material.** La ilustración muestra doble hilera de dientes vegetales sujetos con varillas y amarras. Hay ejemplares arqueológicos de Chiu-Chiu muy cercanos en estructura. Conservar arte; proponer modificación mínima de la **descripción**, si el autor la aprueba |

#### Decisión editorial candidata — Ckarisur, sin ejecutar
**Texto vigente:** «Peine pequeño, tallado en madera, para desenredar y cuidar el cabello».

**Propuesta mínima:** «Peine pequeño, con dientes vegetales sujetos entre varillas de madera, para desenredar y cuidar el cabello».

**Motivo:** los peines conservados del Norte Grande muestran dientes de espina de cactus y varillas de madera trabadas con fibras. Las piezas consultadas **no fijan por sí mismas una atribución específica al año 1067**, ni certifican el vocablo `Ckarisur`. Cambiar el `system.props.descripcion` es una **propuesta editorial**, no una operación autorizada. La `procedencia`, nombre, tipo y demás campos permanecen intocables.

**Referencias verificadas:**
- Subdirección de Investigación, «Colores y piezas desde el desierto de Atacama a la colección Echeverría y Reyes», entrada **Peine** proveniente de Chiu-Chiu: `https://www.investigacion.patrimoniocultural.gob.cl/galeria/colores-y-piezas-desde-el-desierto-de-atacama-la-coleccion-echeverria-y-reyes`.
- Chile Patrimonios, ficha **Peine**, `05SDC-67-347` (madera, 35 dientes de espina de cactus y cordel de camélido): `https://www.chilepatrimonios.gob.cl/ficha?doi=05SDC-67-347`.
- Chile Patrimonios, ficha **Peine**, `05SDC-7-3458` (dos trozos de caña y dientes que sobresalen hacia ambos lados): `https://www.chilepatrimonios.gob.cl/ficha?doi=05SDC-7-3458`.
- Museo de Historia Cultural de Oslo, «Whetstone – grinding and honing» (piedras de afilar largas con extremos intencionalmente redondeados): `https://www.khm.uio.no/english/research/projects/previous-projects/langeid/project/whetstone/`.
- Diccionario de americanismos ASALE, **uysu** (arado de pie con punta): `https://temporalweb.asale.org/damer/uysu`.

### 3. QA técnico L01 y reservas
Cuatro PNG y cuatro WebP tienen alfa real, dimensiones esperadas y mantienen trazabilidad con la fuente. ZIP CRC OK.

**Detección heurística de píxeles rojos potencialmente residuales** (rojo R≥210, G/B<70, alfa entre 1 y 249; **no prueba por sí sola que cada píxel sea halo**):
- PNG 512 Külko: 962; Uysu: 100; Brýni: 15; Ckarisur: 2595.
- WebP 256 Külko: 121; Uysu: 31; Brýni: 4; Ckarisur: 391.

Por ello, **prioridad técnica**: limpiar únicamente los residuos externos rojizos de Ckarisur y Külko sobre derivados, previa prueba sobre fondo claro/oscuro, sin afectar materiales internos ni contornos. No usar la propia presencia de alfa como prueba de halo limpio.

**Pendiente de QA real:** validar legibilidad efectiva a 64/128 y carga de los cuatro WebP en un **mundo Foundry V14 aislado**. No promover a runtime ni tocar `img`.

### 4. L05 — dictamen de estilo y versión del prompt
El usuario aprobó las **morfologías** de Mortero, Snælda, Saba y Anzuelo/Sedal, pero observó que el acabado se aproxima al **hiperrealismo**. La fuente no debe perderse ni redibujarse sin un encargo específico.

**Respaldo BBTECA ya verificado:**
`/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L05_LAMINA_MORFOLOGIA_APROBADA_ESTILO_PENDIENTE_v01.png`.
SHA-256 `15ec2ff55829691aa42cb0815cbbeb9e53aee884c177c343864597d45df88b89`.
**Importante:** el original L05 es PNG RGB 1254×1254 con tablero de transparencia pintado; **no tiene canal alfa real**.

#### Prompt rectificado de estilo — preparado, NO ejecutado
> **Editar solo el tratamiento pictórico de la lámina L05 aprobada en forma.** Conservar exactamente cuatro objetos —Mortero de piedra (Mapuche), Snælda · Huso (Nórdicos), Saba · Saco (Lickanantay), Anzuelo y sedal (banco histórico Chinchorro)—, su orden 2×2, siluetas, proporciones, materia general y detalles funcionales (cavidad y mano de mortero; tortera y lana; reparación del saco; punta y sedal). Reinterpretar la superficie según el **ERH canonizado**, no como render arqueológico: grandes masas pictóricas de mineral mate, ocres/hematita/carbón/hueso; contornos manuales irregulares y pocos cambios de tono; priorizar volumen esquemático y lectura a 64px. Reducir drásticamente la microtextura de piedra/madera/tela/fibras, las luces fotográficas, los biseles brillantes, las sombras 3D y la sensación de fotografía de producto. Evitar colores saturados, glifos, zigzags étnicos no documentados, etiquetas, sombras de suelo o figuras añadidas. **Fondo realmente transparente** en el resultado editado, sin falsos cuadritos; preservar original intacto como referencia de identidad. Producir **solo una lámina candidata** para evaluación, sin cortes para Foundry antes de aprobación.

#### Criterios de aceptación del L05
- La **forma exterior y función** de cada objeto continúan idénticas; no cambiar el anzuelo, mortero, huso ni saco.
- Se reconocen claramente a 64 px por silueta y dos o tres detalles funcionales.
- El dibujo deja de parecer fotorrealista y recupera pigmento mate/volúmenes sintéticos, sin empobrecer la iconografía.
- Alfa real en una futura candidata; fuente RGB original permanece archivada.
- Si no se logra una estilización sin alterar siluetas, se conserva la versión previa y se rechaza la variante, sin sumar un nuevo Item.

**Estado:** CORRECCIÓN DE ESTILO DEFINIDA, **NO GENERADA NI APROBADA VISUALMENTE**. El estándar editorial ya estaba cerrado; este texto es una instrucción de compatibilidad para L05, no canon nuevo.

### 5. Continuidad
**Decisiones operativas:** no regenerar L01; conservar Ckarisur como referencia material válida; proponer ajuste textual de la ficha; L05 morfología aceptada y estilo pendiente de adaptación; no iniciar L06.
**Pendientes:** aprobación visual expresa de L01; autorización editorial del texto Ckarisur antes de cambiar `system.props.descripcion`; limpieza no destructiva de halos; eventual versión L05 conforme al prompt; QA Foundry aislado.
**Fuentes:** imágenes/ZIP L01 y L05, export Foundry del 19-11, `Estilo_Rupestre_Hipera_Canonizado_v01.md`, referencias enlazadas y observaciones autorales de este chat.
**Cambios al Estado Maestro:** ninguno. Sin cambios en `main`, Bridge, Items del compendio o Foundry productivo.
