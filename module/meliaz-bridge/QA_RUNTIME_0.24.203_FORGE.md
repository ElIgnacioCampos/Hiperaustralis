# QA runtime — MELIAZ Bridge 0.24.203
Target: Foundry VTT V14 + Custom System Builder 6.0.2
Branch: work/meliaz-bridge-0.24.203-audit
Status: PENDING — requiere prueba en Forge

## Objetivo
Comprobar en runtime que 0.24.203 elimina la aparición visual de los wrappers CSB heredados de Equipo sin borrar ni alterar sus datos, sin afectar los cuatro espacios actuales y sin romper Kona.

## Preparación segura
- [ ] Instalar el ZIP 0.24.203 en un mundo de prueba de Forge.
- [ ] Confirmar Foundry V14 y CSB 6.0.2.
- [ ] Mantener una copia/exportación del Actor de prueba antes de modificarlo.
- [ ] Usar un Actor duplicado; no ejecutar pruebas destructivas sobre el Actor de producción.
- [ ] Activar MELIAZ Bridge y comprobar el diagnóstico: bridgeActivo = true.
- [ ] Abrir consola del navegador y registrar errores iniciales.

## Pruebas funcionales

### A. Carga y activación
- [ ] El módulo carga y permanece activo después de recargar el mundo.
- [ ] La hoja Kona abre sin errores JavaScript.
- [ ] No faltan fondos, texturas, iconos, imágenes ni recursos del módulo.
- [ ] El diagnóstico confirma bridgeActivo = true.

Resultado esperado: módulo activo, hoja renderizada y recursos resueltos.

### B. Wrappers heredados de Equipo
- [ ] No aparece visualmente equipo_1, equipo_2, equipo_3 ni equipo_4.
- [ ] No aparece el input ni el texto residual de esos campos.
- [ ] No hay destello inicial de wrappers durante la carga.
- [ ] No reaparecen wrappers ni texto residual después de refrescar la hoja.
- [ ] No reaparecen después de editar otro campo del Actor.
- [ ] No reaparecen después de drag-and-drop.

Resultado esperado: los cuatro wrappers heredados permanecen ocultos en todos esos estados.

### C. Integridad de datos heredados
- [ ] Comparar system.props.equipo_1..4 antes y después.
- [ ] Confirmar que los valores previos siguen intactos.
- [ ] Confirmar que no se eliminan Items asociados.
- [ ] Confirmar que no cambian flags ni asignaciones equipoSlot.

Resultado esperado: ocultación exclusivamente visual; ningún dato heredado se pierde ni se reescribe.

### D. Cuatro espacios actuales
- [ ] Los cuatro espacios actuales se muestran en su geometría prevista.
- [ ] No hay desplazamientos, solapamientos ni cambios de tamaño.
- [ ] Los destinos Ñeque/Equipo siguen disponibles y responden correctamente.
- [ ] Los Items existentes continúan asignados a sus destinos correctos.
- [ ] Arrastrar un Item a cada espacio y retirarlo funciona sin duplicación ni pérdida.

Resultado esperado: slots actuales intactos; las operaciones de asignación no reactivan la interfaz heredada.

### E. Campos drag-and-drop y geometría Kona
- [ ] Cariños conserva su posición.
- [ ] Lenguas conserva su posición.
- [ ] Ningún desplazamiento vertical global afecta estos dos campos.
- [ ] Otros campos funcionales mantienen sus posiciones.
- [ ] Repetir tras refrescar Actor y reabrir la hoja.

Resultado esperado: Cariños y Lenguas permanecen anclados en sus posiciones; no hay deriva de layout.

### F. Consola y estabilidad
- [ ] Sin errores JavaScript nuevos durante carga, refresco o drag-and-drop.
- [ ] Sin errores de rutas de assets.
- [ ] Sin loops de actualización ni refrescos continuos.
- [ ] Cerrar y reabrir la hoja no cambia el resultado.

Resultado esperado: comportamiento estable durante el ciclo de prueba.

## Registro de resultados

| Área | Resultado | Evidencia / observaciones |
|---|---|---|
| Activación y carga | PENDIENTE | |
| Wrappers heredados ocultos | PENDIENTE | |
| Persistencia tras refrescos | PENDIENTE | |
| Integridad de datos | PENDIENTE | |
| Cuatro espacios actuales | PENDIENTE | |
| Cariños y Lenguas | PENDIENTE | |
| Assets y consola | PENDIENTE | |

## Criterio de aprobación
Aprobar 0.24.203 sólo si todas las pruebas A–F pasan y se conserva evidencia de:
1. diagnóstico de módulo activo;
2. hoja Kona renderizada;
3. wrappers heredados ausentes después de refrescos y drag-and-drop;
4. valores heredados antes/después sin cambios;
5. cuatro espacios actuales y campos Cariños/Lenguas sin alteraciones;
6. consola sin errores nuevos.

Si falla cualquier prueba, registrar el fallo y detener la promoción. No fusionar la rama ni reemplazar el ZIP operativo hasta resolverlo y repetir el QA.

## Cierre
- Fecha:
- Mundo de prueba:
- Actor duplicado:
- Resultado global: PENDIENTE
- Evidencias:
- Incidencias:
- Decisión: NO PROMOVER / APROBADO PARA REVISIÓN
