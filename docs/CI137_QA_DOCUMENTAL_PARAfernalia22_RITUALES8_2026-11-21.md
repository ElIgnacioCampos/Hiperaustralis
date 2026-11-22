# CI137 — Prueba documental del lote de 30 imágenes

Fecha: 2026-11-21. Origen: 30 JSON históricos de `source-pending/ci137-historicos-99`; destino: rama de ensayo CI137.

## Verificaciones efectivamente ejecutadas
- 22 Items de Parafernalia + 8 de Rituales abiertos desde GitHub.
- 30/30 `_id` cotejados con el manifiesto.
- 30/30 rutas `img` cotejadas **por igualdad literal** con el manifiesto de recuperación.
- Los ocho Rituales tienen `flags.hiperaustralis-sheet.background` idéntico a `img`.
- Los 22 Items Parafernalia examinados no presentan ese campo de fondo.
- Plantillas exactas: `HipEquipTpl00001` (22) y `HipRitualTpl0001` (8).
- **38 referencias gráficas**: 30 `img` y ocho `background`, que representan 30 rutas binarias únicas.

## Lo que falta
No se hallaron bytes del ZIP histórico 0.4.75 en los archivos montados de esta sesión, en la búsqueda por título de Biblioteca o en las búsquedas de Drive examinadas. GitHub conserva las rutas/manifiestos, pero no esos 30 WebP como archivos separados.

La prueba anterior de staging 96 en el checkpoint fue válida **en su entorno anterior**, no significa que los binarios estén ahora disponibles. No existe SHA individual calculado hoy ni inspección visual realizada hoy sobre estos 30.

Se localizó el script GitHub `tools/foundry/recover-armas-assets.py` que fija SHA-256 del respaldo 0.4.75: `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`. Nuestro recuperador usa el mismo SHA antes de leer el lote de 30. Ejecutarlo requiere acceso efectivo a ese ZIP.

## Decisiones
No reconstruir imágenes por nombres, no migrar rutas ni modificar IDs/Items. Las 30 identidades son exactas en los JSON, no aprobaciones visuales nuevas.

## Pendientes
Localizar respaldo binario 0.4.75, ejecutar recuperación aislada, comprobar decodificación/dimensiones/SHA por imagen y luego transferencia verificada a la rama sin publicar.

## Estado Maestro
Sin cambios. `main`, Bridge, Foundry y Forge intactos.
