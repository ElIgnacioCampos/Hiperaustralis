# HIPERAUSTRALIS RPG — CORE / EQUIPO COMÚN
## L05: revisión individual y balance de cobertura visual de los 40 Items
**Corte:** 2026-11-21. **Rama:** `work/native-compendia-pipeline`.
**Estado:** L05 MORFOLOGÍA ACEPTADA, ESTILO ERH PENDIENTE; sin integración Foundry.

### Autoridad y continuidad
- El usuario indicó: **«está correcto, pero estás casi hiperrealista»**, seguido de **«ok»** a la propuesta de conservar morfologías y corregir el rumbo pictórico.
- El L05 conserva cuatro formas aceptadas: Mortero de piedra (Mapuche), Snælda · Huso (Nórdicos), Saba · Saco (Lickanantay), Anzuelo y sedal (banco histórico Chinchorro).
- La aprobación de forma NO convierte la imagen en final de Foundry. No hacer nuevos dibujos o versiones de estilo por inercia: preparar primero el prompt específico de estilización y una prueba única sobre fuente original si el usuario la encarga.

### Fuente visual preservada en BBTECA
**Ruta:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L05_LAMINA_MORFOLOGIA_APROBADA_ESTILO_PENDIENTE_v01.png`
**Origen:** `a_crisp_detailed_high_resolution_illustration_ph.png` del chat, sin modificar.
**SHA-256:** `15ec2ff55829691aa42cb0815cbbeb9e53aee884c177c343864597d45df88b89`.
**Propiedades:** 1254×1254, `RGB` de tres canales, **sin alfa**. La trama cuadriculada visible está INCORPORADA A LOS PÍXELES. No tratar el archivo como PNG transparente ni publicar como icono. Si en el futuro se aprueba el estilo, extraer las figuras a máscara y comprobar residuos y bordes a 256 y 64 px.

### Revisión individual contra el export histórico
| Ítem y cultura | ID de compendio | Evidencia en ficha | Evaluación | Acción |
|---|---|---|---|---|
| Mortero de piedra, Mapuche | `7y88F6dSJK7HvqrN` | Piedra con cavidad para triturar; procede de una ruka ajena y no se transporta | Cavidad y mano de moler reconocibles; marcas angulosas superficiales no constan como símbolo tradicional | Conservar forma; simplificar microtextura y signos ornamentales, sin cambiar función |
| Snælda · Huso, Nórdicos | `w9DvGQFnGfW8GsiW` | Huso para hilar lana, posible tortera, mango pulido | Silueta y tortera correctas; decoración en zigzag de la tortera no prueba un patrón vikingo específico | Conservar; retirar detalle ornamental excesivo en cualquier estilización |
| Saba · Saco, Lickanantay | `89egEPGh4AtrOMS0` | Saco resistente de provisiones, con una costura reparada distinta en la base | Forma y reparación acertadas; riqueza de trama reduce lectura a 64px | Conservar; condensar fibra en masas y destacar solo una reparación |
| Anzuelo y sedal, Chinchorro | `3v9D425QdKOva3XV` | Anzuelo de espina, concha u otro material resistente; sedal de fibra | Funcional y materialmente compatible; el ejemplar representado no se cotejó con un anzuelo arqueológico preciso | Conservar como reinterpretación; disminuir microfibras y grosor visual del sedal sin rediseñar perfil |

**Fuentes de respaldo tipológico (no reproducen la ilustración exacta):**
- UCDavis, tecnologías textiles de época vikinga: `https://medieval.ucdavis.edu/SWEDEN/Clothmaking.html`.
- Cambridge Archaeological Journal, instrumental Chinchorro: `https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/artistic-nature-of-the-chinchorro-mummies-and-the-archaeology-of-grief/E47F035D0F550826EC9D873B71ABE85E`.
- Journal of Archaeological Science: Reports / Taylor Francis, anzuelos del litoral de Atacama: `https://www.tandfonline.com/doi/full/10.1080/14614103.2021.1886647`.
- **Fuente principal de descripción y procedencia:** `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`. Cualquier atribución cultural se mantiene al nivel de ficha histórica; no afirmar continuidad étnica Chinchorro hasta 1067 por esa etiqueta.

### Balance real de los 40 Items (excluyendo variantes del banco)
- **9** Items con correspondencia directa a WebP preexistentes de noviembre, acreditada documental y binariamente.
- **20** Items con nueva imagen generada en lotes L01–L05 (4 por lote): de ellos **4 L01 solo candidatos**, **12 L02–L04 aprobados visualmente**, **4 L05 con morfología aceptada y estilo pendiente**.
- **11** Items que siguen exclusivamente con icono original Foundry y sin imagen propia exacta:
  1. Metawe · Jarro — Mapuche (ya existe variante distinta **Alka Metawe** en el banco).
  2. Toki · Hacha de piedra — Mapuche (**diferenciar herramienta e insignia** antes de ilustrar).
  3. Paño tejido — Mapuche (icono Foundry funcional).
  4. Phala · Soga — Aymara (ya existe **COM-01 Soga** en banco genérico).
  5. Q'urawa · Honda — Aymara (existe ruta propia en paquete legacy, pendiente de recuperación del binario; evitar duplicar).
  6. Phullu · Manta — Aymara (ya existe **COM-03 Manta** en banco genérico).
  7. Poki · Bolsa — Nórdicos (icono Foundry funcional).
  8. Cuchara de madera — Lickanantay (ya existe **Witrü · Cuchara** mapuche: mismo tipo, otra identidad cultural).
  9. Arco y flechas — Lickanantay (**Armas**, no gastar dibujo duplicado).
  10. Arpón — Chinchorro (**Armas**, no gastar dibujo duplicado).
  11. Cuchillo lítico — Chinchorro (**Armas**, no gastar dibujo duplicado).
- No es una deuda de 11 ilustraciones. **Una siguiente tanda obligatoria 2×2 no se justifica todavía**. Auditaremos L01 y las identidades singulares antes de producir otro objeto.

### Prompt restringido para eventual corrección de estilo L05
> Editar únicamente el estilo pictórico de la lámina original L05 preservando al máximo la identidad, disposición, siluetas, tamaños y funciones de sus cuatro objetos: Mortero mapuche, Snælda nórdico, Saba lickanantay y Anzuelo/Sedal Chinchorro. Sustituir aspecto casi fotorrealista por el ERH: contornos ligeramente manuales, pigmentos minerales opacos, ocres/hematita/carbón/hueso, masas grandes de color sin luces de estudio, 3–7 volúmenes pictóricos dominantes por objeto, desgaste selectivo, marcas internas esenciales, textura reducida drásticamente y lectura clara a 64px. No insertar glifos, símbolos nuevos, runas, ornamentación supuestamente étnica ni piezas adicionales. Evitar caja de sombras, ambientación, infografía o superficie de apoyo. **No dibujar cuadrícula de transparencia**; en derivados, exigir alfa real y QA de halo. Presentar primero una única lámina candidata para evaluación: no sobrescribir la fuente aprobada ni actualizar Foundry.

### Cierre
**Decisiones:** fuente L05 respaldada sin transformación; morfologías correctas; estilo ERH pendiente de cierre; no forzar nueva lámina L06.
**Pendientes:** revisión y aprobación visual del L01, eventual variante ERH del L05 si se encarga, arbitraje Toki/Honda y exploración de recursos ya ilustrados; QA real del módulo en Foundry aislado.
**Fuentes:** export 19-11-2026, matriz `CORE_MATRIZ_EQUIPO_COMUN_40x29_2026-11-21_v02.csv`, banco de 29 WebP, lotes L01–L05, canon `Estilo_Rupestre_Hipera_Canonizado_v01.md`.
**Cambios al Estado Maestro:** ninguno; sin cambios en main, Bridge, mundo Foundry ni compendio.
