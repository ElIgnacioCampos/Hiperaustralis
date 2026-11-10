# Kona — canon de destinos y alcance del patch experimental

Fecha: 2026-11-10  
Rama: `work/bridge-kona-stability-0.24.198`  
Base de código: MELIAZ Bridge 0.24.197 STANDARD V14  
Estado: criterio recuperado de checkpoint; no modifica Estado Maestro.

## 1. Distribución funcional recuperada

| Zona / Capacidad | Contenido |
|---|---|
| Ñeque | Arma + Armadura |
| Equipo | Pertenencias y objetos; cuatro espacios propios |
| Sentir | Instrumentos |
| Temple | Rituales + Reliquias |
| Picardía | Lenguas |

La hoja conserva su geometría. No se agregan espacios ni se desplazan hitboxes.

## 2. Reglas existentes de Ñeque

El Bridge ya dispone de dos destinos diferenciados:
- `nequeSlot=arma` para Items cuyo tipo es `arma`.
- `nequeSlot=armadura` para Items cuyo tipo documental es `defensa`, mostrados en el espacio funcional Armadura.
- La fila Armadura se muestra sólo cuando `isHiperaArmorOficio(actor)` lo permite.
- El cambio de equipo conserva el Item anterior embebido y retira su `nequeSlot`; no lo elimina.

Esto es compatible con la distribución recuperada. El nombre documental `defensa` no debe renombrarse a `armadura` en los Items: son categorías distintas (tipo de catálogo y función de equipamiento).

## 3. Error funcional confirmado

El drop actual contiene rutas de reserva que contradicen la distribución:
- Arma soltada fuera de la zona Ñeque puede entrar en Equipo.
- Defensa soltada fuera de la zona Armadura puede entrar en Equipo.
- El renderer y la normalización de Equipo consideran indistintamente `arma`, `equipo` y `defensa`.

La normalización puede asignar `equipoSlot` y escribir `system.props.equipo_1..4` al montar la hoja. No debe seguir asignando nuevas Armas/Defensas a Equipo.

## 4. Política de compatibilidad para Items existentes

El checkpoint MONO del 2026-11-08 informa 16 Items: 4 Armas, 9 Defensas y 3 Equipo. La distribución de flags no estaba completa: sólo un Arma tenía `nequeSlot=arma`; ninguna Defensa tenía `nequeSlot=armadura`.

Por seguridad:
1. No borrar, duplicar ni modificar automáticamente ningún Item existente.
2. No asignar automáticamente armas o defensas a Ñeque al abrir la ficha.
3. No sobrescribir ni limpiar `equipoSlot` o los campos CSB existentes durante la corrección.
4. Los Items con asignaciones históricas mixtas requieren una migración separada, explícita, reversible y con inventario previo.
5. El patch de drop debe impedir nuevas asignaciones incorrectas; el tratamiento visual de los legacy debe mantenerlos recuperables hasta esa migración.

## 5. Alcance del patch 0.24.198

### A. DOM incremental
- Reemplazar `replaceChildren()` en los grids afectados por reconciliación incremental.
- Mantener nodos cuando el mismo Item ocupa el mismo slot.
- Modificar sólo atributos/imagen/texto que efectivamente cambien.
- Conservar eventos, hitboxes, geometría y accesibilidad.
- No tocar otros componentes de la hoja.

### B. Destinos de nuevos drops
- Arma: sólo zona Arma de Ñeque; no fallback a Equipo.
- Defensa: sólo zona Armadura de Ñeque y sujeto a la regla de Oficio; no fallback a Equipo.
- Equipo: sólo los cuatro espacios de Equipo.
- Si el Item cae fuera de su zona válida, no interceptar el drop ni crear copia.

### C. Equipo y datos históricos
- No incorporar nuevos Items `arma` ni `defensa` a la bandeja Equipo.
- No ejecutar migraciones al montar.
- Antes de filtrar legacy del renderer, diseñar una vista de recuperación que permita reconocer y reubicar Items históricos sin perder referencia ni datos.
- Preservar los cuatro campos CSB y sus valores.

## 6. QA obligatoria

1. Drop de Arma en Ñeque → asigna `nequeSlot=arma`; fuera de Ñeque → no crea ni mueve Item.
2. Drop de Defensa en Armadura con Oficio habilitado → asigna `nequeSlot=armadura`; con Oficio no habilitado o fuera de zona → no crea ni mueve Item.
3. Drop de Equipo en cada uno de los cuatro slots → asigna `equipoSlot` y conserva la identidad del Item.
4. Cambiar/reemplazar Arma o Armadura → el Item previo permanece embebido, sin slot equipado.
5. Abrir/reabrir la hoja sin cambios → cero escrituras de normalización.
6. Añadir/retirar un Item → no parpadea; nodos no afectados permanecen.
7. Instrumentos, Rituales, Reliquias, Territorio, Cariños y Lenguas conservan su comportamiento y geometría.
8. Probar con MONO y con un Actor limpio; comprobar conteo, IDs, flags, propiedades CSB e imágenes antes/después.

## 7. Pendiente antes de cerrar

No se ha localizado en el índice adjunto el archivo `00_ESTADO_MAESTRO_HIPERAUSTRALIS_RPG_ACTUAL.md`; por eso este documento registra el checkpoint y la regla recuperada, pero no declara una modificación al Maestro.

El renderer legacy debe resolverse con una estrategia de recuperación antes de ocultar Armas/Defensas que ya tengan `equipoSlot`. El patch no debe presentarse como listo para producción sin prueba runtime Foundry V14 + CSB 6.x.
