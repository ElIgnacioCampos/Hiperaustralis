# Inventario de recuperación y protocolo de cotejo — Compendios Hiperaustralis

**Fecha:** 2026-11-10  
**Frente:** Compendios nativos Foundry V14  
**Estado:** documento operativo de recuperación; no constituye aprobación editorial ni canon.

## 1. Alcance y límites

Este inventario consolida las identidades de archivos y verificaciones documentadas en la Biblioteca. No acredita que el contenido interno de cada ZIP haya sido inspeccionado semánticamente, ni que sea compatible con Foundry V14. Los SHA-256 registrados corresponden a las copias recuperadas desde Drive durante el procedimiento de continuidad de octubre de 2026; no existe hash independiente del original de proyecto para afirmar igualdad criptográfica origen-destino.

No se dispone en esta sesión de una conexión activa a Google Drive ni de los bytes de los ZIP históricos en la Biblioteca. Por tanto, no se descargan ni reconstruyen archivos desde nombres o referencias. La recuperación binaria queda pendiente de un acceso válido al Drive o de que las fuentes se vuelvan a adjuntar.

## 2. Fuentes de control consultadas

- `SAC_RF01_MANIFIESTO_CONTINUIDAD_20261015_v06.csv` — Biblioteca, file `file_00000000f43081f4beefcf95446f3a3c`.
- `SAC_RF01_ACTA_CONTINUIDAD_20261015_v06.md` — Biblioteca, file `file_0000000036c081f5ad971688c16be640`.
- Carpetas Drive consignadas en el acta:
  - Compendios LAB: https://drive.google.com/drive/folders/1CFh8azDA721YheGy1jkS15_ZH2WN522l
  - Hiperaustralis — otros archivos grandes y fuentes: https://drive.google.com/drive/folders/19bSJhFUviqLaIGJB2v3Dr-u-D8kHErOi

## 3. Inventario de fuentes recuperables según registro

| Prioridad | Archivo | Tamaño registrado | Entradas ZIP verificadas | SHA-256 de la copia Drive | Ubicación |
|---|---|---:|---:|---|---|
| A — candidato base | `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip` | 33,028,294 B | 358 | `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e` | Drive / otros archivos grandes |
| B — línea bio/textos | `HIPERAUSTRALIS_COMPENDIOS_0.4.73_BIO_TEXTOS_LAB.zip` | 45,575,239 B | 357 | `2d8830d5a18b7d6ff7ba4eee469214fef7b7efdf7164b552464620a0580a5329` | Drive / Compendios LAB |
| B — reparación bio | `HIPERAUSTRALIS_COMPENDIOS_0.4.72_REPARACION_BIO_LAB.zip` | 45,575,174 B | 357 | `437b263f40c0c1e18cd24d0bcb996a4e1769a3830978133d0c839a0dbe1b228c` | Drive / Compendios LAB |
| B — reparación biomas | `HIPERAUSTRALIS_COMPENDIOS_0.4.71_BIOMAS_REPARACION_LAB.zip` | 45,574,950 B | 357 | `52ee79aa5662e56024dc5b6c90cc8bb20a00b00f98dce8a3c3755b0bb3b9fcd1` | Drive / Compendios LAB |
| C — limpieza | `HIPERAUSTRALIS_COMPENDIOS_0.4.69_LIMPIEZA_AVISOS_LAB.zip` | 45,404,856 B | 399 | `e459172f7a0823da6294afe3614547f1106b02623d5fe5b9b9c45e8a39f13684` | Drive / Compendios LAB |
| Separada — flora editorial | `HIPERAUSTRALIS_FLORA_001_040_RESCATADAS_EDITORIAL_v2.zip` | 96,239,715 B | 144 | `c91c58c8cb32b215e46ae57e8ccf85d99ad512b4fabb59ccc41b888eeb6d932e` | Drive / otros archivos grandes |

**Interpretación:** 0.4.75 es el primer candidato a inspección por ser el optimizado más reciente registrado, no una base aprobada. 0.4.69–0.4.73 son antecedentes diferenciales/reparaciones que deben cotejarse para identificar aportes que 0.4.75 pudiera no contener. El ZIP de Flora 001–040 es una fuente editorial separada y no debe fusionarse automáticamente con los compendios.

## 4. Referencias históricas pendientes de localizar

En el historial del proyecto aparecen mencionados:

- `HIPERAUSTRALIS_COMPENDIOS_0.4.68_FLORA_40_JOURNALS_LAB.zip`
- `HIPERAUSTRALIS_COMPENDIOS_0.4.67_RIVALES_01_16_LAB.zip`

No figuran en el manifiesto v06 consultado. Sus nombres y versiones se conservan como pistas de recuperación, no como evidencia de existencia actual, integridad, ubicación ni contenido. No reemplazar con ellos ninguna fuente registrada.

## 5. Protocolo de recuperación binaria

1. Obtener acceso al archivo exacto en Drive mediante conector autorizado o descarga verificable desde su carpeta registrada.
2. Conservar el nombre original; registrar URL/ID de Drive, fecha de recuperación, tamaño y SHA-256 local.
3. Verificar integridad ZIP: apertura completa, CRC de todas las entradas, listado de rutas, tamaños comprimidos/descomprimidos y detección de rutas duplicadas o traversal.
4. Comparar tamaño y SHA-256 con el manifiesto. Una coincidencia del SHA con el registrado identifica la misma copia respaldada; una diferencia exige cuarentena y explicación, no sobrescritura.
5. Extraer cada versión en directorio aislado, sin mezclar ni sobrescribir fuentes.
6. Generar inventario por archivo: ruta, extensión, tamaño, hash, pack/compendio, ID interno, nombre visible, tipo Foundry, idioma, referencias y assets.
7. Preservar los originales y crear copias de trabajo. No normalizar ni renombrar antes de generar el inventario inicial.

## 6. Protocolo de cotejo semántico

Comparar 0.4.75 contra cada antecedente por identidad y contenido, no por número de versión:

- Documentos: IDs, nombres, tipo, contenido textual, estructura, flags, páginas y enlaces.
- Actores/PNJ/criaturas: IDs, datos de sistema, aptitudes, atributos, tokens, imágenes y referencias.
- Items/equipo/armas/rituales/reliquias: IDs, tipo, campos, efectos, descripción, iconos y referencias.
- Tablas: resultados, pesos/probabilidades, fórmulas y referencias.
- Flora/Fauna/Funga/Territorio y demás entradas biológicas: identidad, clasificación, territorio/procedencia, estado editorial, fuentes y relaciones.
- Assets: rutas, existencia física, formato, dimensiones, transparencia, hash y uso efectivo.
- Dependencias: referencias a módulos antiguos, en particular `modules/hiperaustralais-rituales/`; clasificarlas como dependencia heredada, no sustituirlas automáticamente.
- Duplicados y colisiones: IDs repetidos, nombres iguales con contenido distinto, referencias rotas y entradas ausentes.

Cada diferencia se clasificará como: idéntico, añadido, eliminado, modificado, duplicado, referencia rota, dependencia externa o pendiente de interpretación. Toda conclusión debe enlazar archivo fuente, ruta/ID y evidencia concreta.

## 7. Preparación para el nuevo módulo nativo

Tras el cotejo, producir:
- manifiesto consolidado de fuentes y hashes;
- catálogo de packs propuesto;
- tabla de equivalencias entre IDs heredados y `sourceId`/UUID nuevos;
- inventario de assets con procedencia;
- informe de dependencias heredadas;
- lista de conflictos y decisiones editoriales pendientes;
- lote de migración reproducible, sin escribir aún sobre el módulo estable.

La estructura territorial prevista usa `Territorio/` con ocho territorios y subcarpetas `Flora/`, `Fauna/`, `Funga/`. La asignación de iconos se hará por procedencia demostrada. Los no resueltos quedarán pendientes; no se inferirá procedencia por parecido visual. Esta organización debe validarse contra el corpus recuperado antes de aplicarla en masa.

## 8. Criterios de aceptación

- Todos los ZIP recuperados abren y pasan CRC.
- Los hashes coinciden con el registro o las discrepancias quedan justificadas.
- Cada entrada extraída tiene ruta y hash inventariados.
- Las diferencias entre versiones están clasificadas y son trazables.
- No se pierden IDs, textos, flags, relaciones ni assets sin decisión explícita.
- Las dependencias del módulo antiguo están identificadas.
- No se modifica el módulo estable ni MELIAZ Bridge.
- No se promueve a `main`, no se mergea el PR y no se publica release sin QA y autorización explícita.

## 9. Estado del bloque

**Decisiones**
- 0.4.75 queda como candidato prioritario de inspección, no como canon ni base aprobada.
- 0.4.69–0.4.73 quedan como fuentes de cotejo diferencial.
- Flora 001–040 permanece como fuente editorial separada.
- El prototipo nativo de tres packs no representa el corpus completo.

**Pendientes**
- Recuperar los bytes de las fuentes desde Drive.
- Localizar 0.4.68 y 0.4.67 o confirmar que no están disponibles.
- Ejecutar inventario ZIP, cotejo semántico y mapa de assets.
- Resolver dependencias heredadas y equivalencias de IDs.

**Fuentes**
- Manifiesto y acta SAC-RF01 v06, 2026-10-15.
- Inventario de rama del prototipo nativo, 2026-11-10.
- Contrato de datos v0.1, borrador técnico no aprobado.

**Cambios al Estado Maestro**
- Ninguno. Este documento es un procedimiento operativo de trabajo.
