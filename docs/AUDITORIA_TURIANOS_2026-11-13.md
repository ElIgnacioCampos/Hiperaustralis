# Auditoría de Turianos — 2026-11-13

Rama: `work/native-compendia-pipeline`  
Estado: auditoría de fuentes, actores y assets. Sin instalación en Foundry y sin migración binaria.

## Paquetes revisados

### A. `HIPERAUSTRALIS_TURIANOS_TUR01-06_CARPETA_CULTURAS.zip`
- SHA-256: `6b35d342cf5530da4f11e693ae74bff15ed529a030d9479dd3788872094b98fd`
- 9 entradas; 1,291,933 bytes; CRC íntegro.
- Incluye seis imágenes WebP, un JSON con seis registros Actor, dos scripts de instalación y README.
- Los seis WebP son 512×512 RGBA con canal alfa efectivo (0–255).

### B. `HIPERAUSTRALIS_TURIANOS_REUBICAR_Y_NORMALIZAR.zip`
- SHA-256: `2f1ef4a2580e1e789e3e91563e4d784128aa34b411107b8572667a2cff0bcc5c`
- 2 entradas; 14,522 bytes descomprimidos; CRC íntegro.
- Contiene un script alternativo de normalización de carpeta e instalación y su README.

Los dos paquetes incluyen scripts que crean/actualizan TUR-01..TUR-06 identificando por código. Son alternativas operativas; no deben ejecutarse ambos. No se ejecutó ninguno.

## Identidad y payload disponible

El JSON `turianos_6_actores.json` contiene seis registros `Actor` con códigos TUR-01..TUR-06 y seedId únicos. No contiene `_id`, UUID ni carpeta Foundry; por ello no es un export canónico con identidad persistente y no permite afirmar correspondencia con los actores actualmente instalados.

| Código | Actor | Grupo en payload | Peso | Estado visual/ficha |
|---|---|---|---:|---|
| TUR-01 | Cantor / Tamborilero | GORILESCOS | 4 | Visual recuperado; ficha pendiente |
| TUR-02 | Viajero | GORILESCOS | 4 | Visual recuperado; ficha pendiente |
| TUR-03 | Sabio | GORILESCOS | 4 | Visual recuperado; ficha pendiente |
| TUR-04 | Guerrero gorilesco de lanza | GORILESCOS | 4 | Visual recuperado; ficha pendiente |
| TUR-05 | Sangu | ESPECIAL | 5 | Candidato no validado en Foundry; ficha pendiente |
| TUR-06 | Popr | ESPECIAL | 5 | Refinamiento técnico aprobado; prueba Foundry pendiente |

Los cuatro primeros registros no están cerrados editorialmente: el payload conserva `estadoFicha=PENDIENTE`. Sangu no se considera aprobado ni se incluye en runtime por defecto. POPR tampoco queda aprobado para runtime hasta la prueba Foundry.

## Assets comprobados

| Archivo | Bytes | SHA-256 |
|---|---:|---|
| `cantor_tamborilero.webp` | 234,400 | `ed76179de48f9be939edd2d6f1dd7ff7d936769badd1c4771f99fe5164c865fc` |
| `viajero_trenzas.webp` | 199,452 | `a692735ede5e3711da7deeaeb0235eae408a13e3810d314f2d5cd789141218b3` |
| `sabio_pregonando_libro.webp` | 236,148 | `806ec8ea4a3efb08a7fe23984cdae0869847dd5a36de161ba6395555453fb8ce` |
| `guerrero_gorilesco_lanza.webp` | 197,934 | `93d557b7250f0715eb341860ddc1575017e36cd65c43543b4262f445b9842567` |
| `sangu_candidato_provisional.webp` | 258,104 | `c0cab8588b5649c0eefd39190db7c02390d7d7781b759715012e421994aa3c98` |
| `popr.webp` | 160,364 | `80a0f0f1c5a46a001089a1f4064e7a79401242cb9c688f5fd58d7d9a6d5571e0` |

La auditoría previa del lote transversal registra que los cuatro tokens Turianos principales tienen rutas alternativas duplicadas por SHA-256. Se mantiene un solo binario por hash y las rutas históricas como alias; no se reingresan esos duplicados.

## Estructura y riesgos del instalador

- El instalador de `REUBICAR_Y_NORMALIZAR` renombra la raíz antigua `Hiperaustralis - Adversarios humanos Mapuche` a `Hiperaustralis Adversarios`, conserva/crea `Culturas/Turianos` y actualiza o crea los seis actores.
- El instalador de `TUR01-06_CARPETA_CULTURAS` crea/usa directamente `Hiperaustralis Adversarios/Culturas/Turianos`.
- Ambos actualizan por código TUR y contienen payloads con rutas runtime bajo `modules/hiperaustralis-rituales/assets/adversarios/turianos/`.
- Ambos llevan el literal de grupo `GORILESCOS` en TUR-01..04. Esto es metadata heredada del payload, no autorización para crear una categoría editorial o taxonómica «Gorilescos». Debe resolverse al reconciliar el canon de cultura/grupos; no corregirlo silenciosamente en esta migración.
- No ejecutar scripts hasta cotejar el mundo exportado, carpeta actual, IDs y decisión sobre el grupo. La ejecución de uno u otro podría actualizar registros existentes.

## Decisión de migración

1. Conservar TUR-01..06 como seis registros candidatos de fuente, sin duplicarlos ni tratarlos como seis aprobados.
2. Mantener Sangu fuera del runtime operativo por defecto.
3. Mantener POPR pendiente de prueba Foundry.
4. No usar el JSON como fuente canónica definitiva: carece de `_id`, UUID y carpeta.
5. No cambiar rutas runtime: todavía dependen de `hiperaustralis-rituales`.
6. No copiar binarios a `assets/` hasta cotejar IDs, estado editorial y dependencias.
7. Los dos scripts se archivan como alternativas históricas; no se ejecutan en esta etapa.

## Pendientes

- Recuperar/exportar los seis Actors reales del mundo Foundry y cotejar _id, UUID, folder, flags y payload por código/seedId.
- Resolver la metadata heredada `grupo=GORILESCOS` contra la organización aprobada, sin crear categorías nuevas.
- Confirmar si TUR-01..04 ya existen en mundo y si su ficha sigue pendiente.
- Mantener TUR-05/Sangu como candidato no validado.
- Ejecutar QA de Foundry para TUR-06/POPR antes de considerar su runtime.
- Tras cerrar lo anterior, elegir una sola ruta canónica por hash y migrar los cuatro tokens recuperados más los candidatos aprobados.

## Registro

**Decisiones:** no ejecutar instaladores; no duplicar tokens; Sangu fuera de runtime; POPR pendiente de prueba; payload JSON no canónico por ausencia de IDs persistentes.  
**Pendientes:** export real de Foundry, grupo heredado, QA POPR y rutas autónomas.  
**Fuentes:** ambos ZIP Turianos y auditoría técnica del lote transversal del 2026-11-11.  
**Cambios al Estado Maestro:** ninguno.
