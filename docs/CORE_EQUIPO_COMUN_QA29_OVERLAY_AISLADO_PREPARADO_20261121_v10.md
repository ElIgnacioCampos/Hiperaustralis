# HIPERAUSTRALIS RPG — CORE / Equipo Común
## Checkpoint v10 · QA29: overlay aislado preparado, preflight offline ejecutado
**Corte:** 2026-11-21/22 · **Rama:** `work/native-compendia-pipeline`
**Estado:** PREPARACIÓN + QA OFFLINE PARCIAL REAL; **QA EN CLIENTE FOUNDRY NO EJECUTADO**.

### 1. Objetivo autorizado
Tras el cierre visual de L01–L05 y el cotejo Armas/Equipo/Reliquias, el usuario aprobó avanzar con el QA de los **29 iconos candidatos**. Reutilizar los elementos de Armas; conservar Toki herramienta separado de Tokicura reliquia. Ninguna nueva generación visual ni imagen de arma duplicada.

### 2. Evidencia recuperada
- Compendio histórico `world.hiperaustralis-rituales`: **40 Items Equipo Común**, export `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-19T00-23-25-933Z.json`.
- Matriz `manifests/equipo-comun-29-cruces-candidatos-20261121.json`: **29 IDs únicos**, nueve assets de noviembre en staging GitHub y 20 imágenes nuevas L01–L05 aprobadas.
- Los **20 WebP nuevos** están en el respaldo `HIPERA_EQUIPO_COMUN_20_WEBP_APROBADOS_LOTES01_05_QA_v01.zip`: todos superaron SHA-256, tamaño, 256×256, VP8L y alfa.
- Los **nueve WebP anteriores** se habían cotejado contra GitHub (9/9 hashes y formato) en el checkpoint v03. Esos binarios **no** se han descargado ni copiado en el overlay actual; siguen en `module/assets/_staging/equipo/webp256/` de la rama.
- `module/module.json` del repositorio define módulo **`hiperaustralis-compendios-prototype`**, versión **0.1.5**, con **tres packs fixture**. **NO contiene los 40 documentos del compendio histórico** de forma autónoma.
- No confundir `module/assets/equipo-comun/` (overlay nuevo) con `module/assets/_staging/equipo/webp256/` (nueve assets existentes).

### 3. Entregable real verificado
**Nombre:** `HIPERA_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_v01.zip`
**Tamaño:** **1.128.909 bytes**
**SHA-256:** `867884cadc27b86216e5c8f91703a7d5c75c9bc2f6410e75db7fe605e8d54be6`
**Respaldo BBTECA:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_QA29_OVERLAY_AISLADO_v01.zip` (subida verificada).

Contiene:
1. `module/assets/equipo-comun/`: **20 WebP**, sin maestros PNG ni archivos del prototipo y sin sustituir los nueve staging de GitHub.
2. `QA/manifest_29.json`: las **29 identidades** con ID, cultura, `img` original, ruta de prueba, tamaño y hash esperado.
3. `QA/qa_offline_29.py`: validador local (solo lectura) de integridad, con `--checkout` opcional para comprobar también los nueve recursos staged del repositorio.
4. `QA/qa_foundry_29_readonly.js`: macro de **solo lectura** para Foundry V14. Lee las 29 fichas del compendio histórico si existe en el mundo de prueba; comprueba ID, nombre, tipo, carpeta, `hipera_tipo`, `img` anterior y descarga los assets servidos por el módulo, contrastando SHA-256, bytes y 256×256.
5. `QA/REPORTE_OFFLINE_LOCAL_20_29.json` y `LEEME_QA29.md`.

**Importante:** es un **overlay auxiliar de QA**, no un módulo instalable, no un patch de Items, no una release ni un reemplazo de `module.json`.

### 4. Qué pruebas se ejecutaron
| Prueba | Resultado real |
|---|---|
| CRC y seguridad de rutas del ZIP overlay | **PASS** |
| SHA-256, VP8L, 256×256 y alfa de 20 nuevos WebP | **20/20 PASS**, sobre bytes |
| Cruce de 20 IDs/nombres con matriz histórica | **20/20 PASS**, sin duplicados |
| Matriz 29 IDs candidatos | **29 únicos**, nueve staging declarados + veinte nuevos |
| Compilación sintáctica de macro JS con Node | **PASS** |
| Simulación de macro en Node con objetos Foundry ficticios y 20 imágenes locales | **PASS de arnés**: leyó 29 identidades simuladas, acreditó 20 imágenes, detectó correctamente ausencia de nueve staged; **NO es QA del mundo real** |
| Preflight completo 29/29 en un checkout real | **NO EJECUTADO** (repositorio no accesible por red desde este contenedor) |
| Carga de assets desde Foundry y lectura de los 29 documentos reales | **NO EJECUTADO** |
| QA visual en hoja Foundry sobre fondos claro/oscuro | **NO EJECUTADO** |
| Cambios a `img`, Items, pack o Bridge | **NINGUNO** |

El resultado local es `PARTIAL_20_LOCAL_9_REQUIRE_REPO`. No afirmar “29/29 QA PASSED” ni que el módulo prototipo ya tenga los 40 Items.

### 5. Protocolo de prueba (solo en mundo aislado)
1. Instalar una **copia independiente** del módulo prototipo en un entorno Foundry V14 de prueba con Custom System Builder; conservar `main`, módulo estable y Bridge.
2. Superponer **solo los 20 WebP** del overlay dentro de `assets/equipo-comun/` de esa copia del módulo. Los nueve previos permanecen en el staging de la rama.
3. Garantizar que el mundo **aislado** dispone del compendio original `world.hiperaustralis-rituales` con los IDs históricos. El prototipo **no los incluye** automáticamente.
4. Ejecutar `python3 QA/qa_offline_29.py --checkout /ruta/a/Hiperaustralis` en el checkout completo (requiere Pillow); objetivo `PASS_OFFLINE_29`.
5. Ejecutar macro `QA/qa_foundry_29_readonly.js` en una macro Script de Foundry o entorno equivalente. Registrar JSON, errores 404, nombres diferentes y discrepancias.
6. Auditar presentación visual; no promover staging ni reemplazar `img` antes de la revisión de errores/QA y la aprobación de despliegue.

### 6. Decisiones / Pendientes / Fuentes / Maestro
**Decisiones:** arte 29 conservado; paquete de prueba mínimo sin maestros; control con hash de los assets servidos; cero modificaciones de compendios.
**Pendientes:** acceso a cliente Foundry aislado + compendio histórico real; nueve assets en checkout; reporte QA, revisión visual, parche reversible y aplicación editorial de Ckarisur después de QA.
**Fuentes:** manifiesto GitHub de 29 cruces, inventario histórico, `TRANSFER_MANIFEST.json`, ZIP aprobado de 20, `module/module.json`, checkpoint v08–v09.
**Cambios al Estado Maestro:** ninguno. Tampoco `main`, MELIAZ Bridge, mundo Foundry productivo ni módulo estable.
