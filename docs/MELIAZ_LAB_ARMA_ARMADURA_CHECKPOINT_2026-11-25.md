# CORE / MELIAZ LAB — Arma y Armadura · 25-11-2026

## Decisiones
- Hoja Kona v5.1 madera aprobada visualmente por usuario; WEBP 1448×1086, Códigos y Aguante. Incorporar el archivo exacto aprobado al paquete consolidado; aún no reemplazado en GitHub ni CSB.
- Clic en arma equipada: Ñeque / Resolver Intercambio. Ya existente en delta v13; Shift+clic abre ficha. Clic ordinario de capacidad sin cambios.
- Revés definitivo tras Torcer, que produciría Herida y cuya causa puede ser interceptada por Armadura: confirmación de interposición → evita Herida, Armadura Inutilizada, no evita desgaste. No automatizar compatibilidad material, Herida ni Aguante.
- Reutilizar icono de aviso en slot existente, etiqueta Inutilizada, reparación con confirmación en ficción. Guardar flag en Item incrustado, no en Actor; leer flag actor legado si existe hasta reparación. No cambiar geometría.
- Sólo LAB; no despliegue ni entrega intermedia.

## Cambios
- 05e749efe3000fe0ef4c75e8ce710e706a6dd4d4: delta, 38 anclas únicas verificadas sobre fuente; confirmación de interposición tras Torcer; registro de resultado en chat, persistencia de estado y reparación.
- 5f29ef53b196bd625ec642735515350311c2b980: workflow D2 con pruebas mock de helper, trigger por delta, reporte.
- Run 45540044411 lanzado, resultado inicialmente pendiente. Consultar Actions.
 
## Pendientes
- D2 de nuevo delta y D3 real: icono al resolver, refrescar, reabrir, intercambio de armaduras, reparación, permisos, no marcar si no procede, Torcer a Impacto no inutiliza. Revisar flag antiguo si existe.
- Integración del fondo aprobado en candidato consolidado; Códigos, Aguante, restantes reglas y CI137 según checkpoint anterior. No confundir interposición con asignación automática de Herida.
- Versionado final del paquete antes de entrega, sin sustituir el estable 0.24.203.

## Fuentes
CORE_CHECKPOINT_MELIAZ_ARMADURA_CIERRE_2026-11-24_v04; capítulo V consolidado v13; checkpoint de armas y Heridas 24-11; aprobación explícita en chat 25-11; delta v13 y fuente bridge.js en LAB.
Estado Maestro ACTUAL, Forge, H6/H7, Bridge estable y compendio CI137: intactos.
