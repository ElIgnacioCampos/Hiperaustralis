# HIPERAUSTRALIS RPG — CORE / Equipo Común
## L01 · Limpieza alfa ejecutada · L05 · Control de estilo pendiente — v04
**Fecha de trabajo:** 2026-11-21/22 · **Rama:** `work/native-compendia-pipeline`
**Alcance:** corrección técnica **SIN generación de imágenes** y revisión de compatibilidad ERH. No se han editado Items ni escenas Foundry.

### Decisión vigente
- El autor dio «ok» para continuar con **limpieza técnica L01 y revisión de estilo L05**.
- NO equivale a aprobación visual definitiva de L01 ni a encargo de **generar otra variante** del L05.
- La lámina L01 v01 sigue preservada y los 40 Items históricos conservan sus rutas originales `img`.

### 1. L01 — Recuperación, corrección ejecutada y resultados
**Fuente primaria inspeccionada:** `HIPERA_EQUIPO_COMUN_L01_2x2_CANDIDATOS_v01.zip` y los cuatro maestros PNG 512 del paquete. Revisados sin regenerar.

**Defecto material exacto:** píxeles de RGB `#FF0000`, canal alfa **1–3/255**, ajenos a la paleta mineral. Se suprimieron únicamente esos residuos; todos los demás píxeles de los maestros PNG originales son idénticos. La conversión LANCZOS 512→256 podía reintroducir píxeles de alfa mínimo: se eliminaron asimismo esos restos **en los derivados WebP**, antes de la codificación lossless.

| Objeto | ID Foundry | Píxeles eliminados en PNG 512 | Reapariciones eliminadas al reducir 256 | Nuevo WebP SHA-256 |
|---|---|---:|---:|---|
| **Külko · Canasto** (Mapuche) | `F8SYAQfuZnLiXCv6` | **962** | 49 | `5d03ba5b9bc14e29015c4e9c7d1ddbbe4655519fff3ab279ac3c6a37d13ac30c` |
| **Uysu · Arado de pie** (Aymara) | `tfOpt8w3B1dFl6qS` | **100** | 27 | `f70d345c2de92b69e78dc266bec9b579152d1969413c55b45fa540e536647666` |
| **Brýni · Piedra de afilar** (Nórdicos) | `kMqPL8yvZQIaZGmY` | **15** | 4 | `f722f42795c85431a01e1d8766df1135fce5e3a35842aa1d50fd63b42f6385a1` |
| **Ckarisur · Peine** (Lickanantay) | `xzRV37AjDu0WVuzh` | **2.595** | 55 | `364cb29d35c807622d2e4a95b63a511fb8d2594c144b61f9041f30f1054c8f52` |
| **TOTAL** | 4 ítems | **3.672** | **135** | — |

**Resultados efectivamente comprobados:**
- Los cuatro maestros limpios siguen siendo PNG **512×512 RGBA**; píxeles fuera de la máscara de residuo: **idénticos**.
- Los cuatro derivados WebP son **256×256**, `lossless`, con canal alfa preservado; decodificación sin diferencias de color o alfa en **ningún píxel visible** respecto del PNG reducido. Algunos decodificadores pueden asignar RGB arbitrario donde alfa=0, sin afectar composición.
- Revisión visual en fondos claro/oscuro a 256 px: sin halos llamativos; legibles los cuatro.
- Revisión a **64 px** claro/oscuro: los cuatro se distinguen; las púas de Ckarisur pierden detalle, pero el tipo de peine sigue reconocible.
- CRC ZIP PASS y copia fuente original intacta **fuera del delta**.

**Entregable mínimo, sin redundancia de fuente:** `HIPERA_EQUIPO_COMUN_L01_DELTA_LIMPIEZA_ALFA_v02_CANDIDATO.zip`, **1.460.315 bytes**.
**SHA-256 ZIP:** `f9d6a0bbfe6315e49d46609f70ef6e0b95e6f379b02c3bc7aac63c4459a06988`.
**Ubicación BBTECA verificada:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L01_DELTA_LIMPIEZA_ALFA_v02_CANDIDATO.zip`.

Contenido: cuatro maestros PNG 512, cuatro WebP 256 lossless, QA composiciones en fondos claro/oscuro a 256 y 64, manifiesto con SHA-256 y README. **No incluye copia duplicada de la lámina fuente de v01**. Los originales v01 permanecen disponibles en el otro ZIP.

**Estado:** L01 v02 LIMPIO TÉCNICAMENTE pero **CANDIDATO** hasta ratificación visual. QA dentro de Foundry real sigue sin ejecutar.

### 2. L01 — Particularidad editorial de Ckarisur
La imagen de peine doble de varillas y dientes vegetales tiene paralelos arqueológicos regionales; la discrepancia es con la ficha histórica `system.props.descripcion` que dice «Peine pequeño, tallado en madera, para desenredar y cuidar el cabello».

**Propuesta de modificación mínima NO aplicada:**
«Peine pequeño, con dientes vegetales sujetos entre varillas de madera, para desenredar y cuidar el cabello».

Mantener nombre, ID, procedencia, sistema y todos los otros campos. No realizar cambio sin decisión explícita del autor, por afectar catálogo editorial en lugar de solo iconografía.

### 3. L05 — Revisión puntual de estilo, sin nueva generación
**Fuente precisa reabierta:** `a_crisp_detailed_high_resolution_illustration_ph.png`, preservada en BBTECA como `HIPERA_EQUIPO_COMUN_L05_LAMINA_MORFOLOGIA_APROBADA_ESTILO_PENDIENTE_v01.png` (RGB 1254×1254, cuadrícula de transparencia pintada).

Las **cuatro siluetas fueron aceptadas**; el autor señaló expresamente «estás casi hiperrealista». Contraste con el canon ERH:
- **Mortero:** mantener cavidad y mano; reducir ruido de piedra casi fotográfico y diseños tallados no documentados.
- **Snælda:** mantener tortera, madera e hilo; reducir la fibra hiperdefinida y el zigzag ornamental no atribuido.
- **Saba:** conservar costura reparada y saco flexible; condensar la trama en masas sin reproducir cada hilo.
- **Anzuelo/sedal:** conservar extremo, unión y bobina de fibra; disminuir reflejos y microfibras sin perder lectura a 64px.

**Parámetros cerrados para el siguiente prompt (NO EJECUTADO):** pictografía de pigmentos minerales mate (hematita/ocre/carbón/hueso), 3–7 masas principales, líneas manuales, desgaste local, menos modelado de luz, **sin "photorealistic", "highly detailed", ni "realistic lighting"**. Siluetas, número, orden, cultura y objeto sin alteraciones. Edición visual por objeto, si se encargara, sobre la fuente preservada. El eventual derivado para Foundry necesita **alfa real**: la fuente L05 actual contiene tablero dibujado y no es apta para recorte directo.

**Estado:** forma L05 aceptada; estilo pendiente y fuente conservada. No hay nuevos píxeles generados ni variante estilizada.

### 4. Cierre y próximos pasos
**Decisiones:** limpiar **solo residuos** L01; conservar original; no regenerar L01; mantener excepcionalidad de la descripción Ckarisur; no generar L05 por inercia.
**Pendientes:** aprobación visual de L01 v02; aprobación editorial o rechazo del ajuste de Ckarisur; prueba Foundry aislada; eventual transformación ERH L05 autorizada por el usuario; integración solo de `img` para aprobados y tras QA.
**Fuentes:** `CORE_EQUIPO_COMUN_L01_AUDITORIA_Y_L05_ESTILO_2026-11-21_v03.md`, export Foundry 19-11, ZIP L01 original y delta v02, fuente L05, canon `Estilo_Rupestre_Hipera_Canonizado_v01.md`.
**Estado Maestro:** intacto. Sin cambios en `main`, Bridge, módulo instalado ni mundo Foundry productivo.
