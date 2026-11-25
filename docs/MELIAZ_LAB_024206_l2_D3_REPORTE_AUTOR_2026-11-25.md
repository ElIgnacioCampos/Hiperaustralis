# MELIAZ LAB 0.24.206-lab.2 — D3 autor y ajuste Descanso · 25-11-2026
## Evidencia y decisiones
- Usuario confirma de lab.1: «bien, funciona todo. El botón descanso debe ajustarse más al texto y bajar 5px. Pendientes?».
- D3 funcional general positivo según reporte autoral. Incidencia de reconocimiento del módulo ya no impide esta prueba; no atribuir causa retroactivamente. No certificar individualmente casos D3-00..11 no explicitados (permisos, snapshots, doble reinicio, etc.).
- lab.2 deriva del ZIP lab.1 exacto (SHA256 adc794e5aa28322c68df51486f502dee6bbcb513765ceec440533f4960f59229). Cambia sólo CSS de Descanso en bridge.js: ancho max-content, padding horizontal 6 CSS px, centro 50% con translateX(-50%), top calc(48.65% + 5px), altura y estilo conservados. module.json versión lab.2. No altera lógica, otras coordenadas, assets, IDs ni dependencias.
- ZIP MELIAZ_BRIDGE_LAB_0.24.206-lab.2_NO_H6_H7.zip: 6097609 bytes, SHA256 6d9de4019abc2675db937ae9a8c35bcf64128716f3b645a0476af97947f72e90, CRC PASS, 63 entradas, ambos node --check PASS. WEBP aprobado intacto SHA256 fb9d84709b9303457f0c06efd6a9c8364c62fb2b03870358b3f73c940b9aeafe.
- Ensamblador actualizado en 6befde9fc4e9756254c7dd4982c0554b371a938a. Fuente base D2 + WEBP exacto requerido; aún no hay build remoto autónomo sin ese binario.
## Pendientes
1. QA visual Descanso lab.2, no reabrir las funciones que el autor acaba de probar salvo regresión concreta.
2. Territorios: reconciliar nueve CORE y ocho bandas legadas, preservar Journals/IDs; Recetas: contrato real, destino en hoja, DnD, persistencia.
3. Armas: completar clasificación arma/reliquia bélica → Quiebre con catálogo aprobado; Heridas materiales. Códigos: catálogo/prácticas e iconos aprobados sin canonizar candidatos.
4. CORE: compatibilidad Desbandar III con Piño sin Emparejar y elegibilidad definitiva Torcer, sin inventar reglas.
5. QA técnico de permisos/persistencia/duplicación y snapshots no documentados, compatibilidad CI137; binario WEBP en ruta reproducible GH; promoción con aprobación expresa.
## Fuentes y límites
Checkpoint consolidación a2ec4f9f8806167d1370a4e4cb05d5cd31754ddd; reporte directo usuario; inspección y comparación binaria de los ZIP exactos. No tocar Maestro ACTUAL, Bridge estable, CI137, H6/H7 ni Forge activo.
