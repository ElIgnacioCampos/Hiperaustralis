# HIPERAUSTRALIS RPG — CORE / IMPLEMENTACIÓN
## Equipo Común — Corrección de alcance y prioridades v05
**Fecha:** 2026-11-21 · **Autoridad:** aclaración del autor + export y manifiesto. **Estado:** decisión operativa, sin modificación de canon ni runtime.

### 1. Aclaración autoral (21-11)
Los objetos comunes originalmente utilizaban iconografía existente de Foundry. **La producción de iconos propios por culturas comenzó en noviembre de 2026.** No existe encargo ni necesidad de reemplazar de manera exhaustiva los iconos genéricos del inventario histórico.

### 2. Qué demuestran las fuentes
- Inventario histórico legacy: **40 Items de Equipo Común**, 39 con rutas `icons/...` del catálogo de Foundry, uno (Q'urawa · Honda) con ruta a un WebP del módulo antiguo. Esto describe el inventario legacy, no el estado instalado presente de cada Item.
- Export actual de 19-11: los 40 Items históricos siguen identificables; la Honda aparece con `icons/svg/item-bag.svg` (placeholder). Su referencia legacy propia es una pista concreta de reconciliación, no permiso para reemplazarla automáticamente.
- `TRANSFER_MANIFEST.json`: 29 WebP derivados aprobados para uso en Foundry dentro de la familia Equipo, **23 nombres específicos de culturas** (Mapuche 4; Aymara 4; Nórdicos 3; Lickanantay 4; Chinchorro 4; Selk'nam 4) y **6 COM genéricos**. Son un **banco visual de noviembre**, no un segundo conjunto de 29 Items antiguos.
- Coincidencias directas entre export histórico y nuevos WebP: **9**; integridad de los 9 probada por SHA-256, WebP VP8L, 256×256 y alfa.
- Los **31 Items antiguos sin cruce directo no son 31 imágenes faltantes**; los **20 WebP restantes sin cruce directo no son material sobrante**. Es falsa la resta 40−9 como lista de producción pendiente.
- 29 PNG maestros nominales se describen en el manifiesto; al menos 9 rutas originales de los nuevos recursos no están presentes en GitHub. Los WebP correspondientes sí están presentes y verificados. **Su ausencia no debe bloquear por defecto el QA de Foundry ni provocar regeneraciones.**

### 3. Protocolo revisado
1. **Conservar** la imagen nativa de Foundry de cada Item histórico cuando sea coherente y funcional. No exigir autoría visual total.
2. **Aprovechar** los WebP culturales aprobados como biblioteca propia: se asocian por Item existente sólo cuando la identidad cultural, el tipo de objeto, los IDs, el JSON fuente y el QA visual y de cliente estén acreditados.
3. **No convertir automáticamente** los 23 WebP culturales en 23 Items. Si la cultura o variante material no coincide con las 40 fichas históricas, quedan como banco para eventuales Items nuevos **en un frente editorial diferente**, sin asumir que deben existir.
4. **Resolver Honda** como caso localizado: cotejar ruta legacy y Item actual y separar su iconografía de su eventual función de arma.
5. **Rastrear maestros PNG como respaldo editorial oportunista**, preferentemente al consolidar paquetes. No bloquear por ello el lote WebP 256 ya acreditado; sólo sería bloqueo si faltase el WebP, hubiera conflicto de aprobación, problemas visuales o el original fuese necesario para una corrección concreta.
6. **QA de runtime** para los 9 candidatos actuales: validar rutas, forma a 256 px, fondo claro/oscuro y documento Item sin sobrescribir; sólo promover mediante cambio separado y con aprobación.
7. Continuar con **20 WebP sin asociación directa**, identificando su destino editorial (Equipo nuevo, variante, banco, Defensas o instrumento) sin forzar una equivalencia con las 40 fichas.
8. **No generar imágenes nuevas** en este frente salvo nuevo encargo explícito.

### 4. Secuencia inmediata
**Primero:** completar un reporte de correspondencias sobre los 29 WebP actuales y categorizar los 20 sin cruce por función/destino, sin alterar Items.
**Después:** ejecutar validador de archivos y prueba de solo lectura en mundo aislado con la matriz de 9 candidatos; documentar cualquier ausencia o fallo.
**Luego:** incorporar únicamente las asociaciones aprobadas, sin hacer depender el proceso de rescatar los nueve PNG de edición. El histórico de posibles maestros y ZIP se mantiene para resguardo, pero sale de la ruta crítica.

### 5. Decisiones / Pendientes / Fuentes / Estado Maestro
**Decisiones:** coexistencia legítima de iconos Foundry y arte cultural propio; cobertura histórica y gráfica son dos ejes distintos; PNG maestros no bloquean por sí solos la integración del derivado aprobado.
**Pendientes:** verificar los 9 Items en mundo aislado; establecer el destino de los otros 20 WebP; resolver Honda; reconciliar JSON/IDs y ejecutar QA antes de cambios runtime.
**Fuentes:** aclaración autoral 21-11; `INVENTARIO_LEGACY_0.4.75.json`; export Foundry Items 19-11; `TRANSFER_MANIFEST.json`; matrices v02, checkpoint v03, rescate v04.
**Registro:** v05 complementa/corrige **el alcance operativo de v04**, sin negar su historial documental.
**Estado Maestro:** sin cambios. No modificar `main`, Bridge MELIAZ, módulo estable ni Foundry productivo.
