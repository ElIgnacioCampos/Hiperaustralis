# MELIAZ Bridge 0.24.197

## Mascota — retirada contextual
- Añadido clic derecho sobre el retrato de Mascota.
- Sólo retira cuando `capacidadesLocked` está abierto (`false`).
- Sólo elimina la bandera `mascotaPortrait` del Actor PJ.
- No elimina, modifica ni duplica el Actor del Bestiario.
- Candado cerrado: el gesto no ejecuta ninguna mutación.
- Slot vacío: no realiza acción.
- Se conserva drag-and-drop para vincular o reemplazar la mascota.
- Mensaje de confirmación y tratamiento de errores.
- Tooltip indica la acción disponible cuando el candado está abierto.

## Conservación
- Sin cambios de geometría, hitbox, coordenadas ni opacidad.
- Sin cambios a Cariños, Lenguas ni otros drag-and-drop.
- Sin migraciones ni cambios de datos ajenos a `mascotaPortrait`.
- Pendiente prueba real en Foundry V14 + CSB 6.x.
