# LAB.6.2 — D3 preflight (25-11-2026)

Base exacta: `7c2ede72606be017220f02cfc98f8c4b1274d575`. ZIP de Biblioteca `file_000000006aa0820e82978bf03790c50e` recuperado: 6.131.490 bytes; SHA256 `0f181e832438d3f3aa44acecf877400698dc05a43bf95d4e1b7ec9afbffd6941`, coincide; CRC de 80 miembros correcto. Fuentes de pruebas `file_000000008018820eb23c7590cc484b05`. Reejecutados los ocho scripts Node sobre archivos extraídos del candidato: 65 líneas PASS. Simulación, no ejecución en Foundry.

## D3: mundo duplicado
Requisitos declarados: Foundry >=14.370, CSB >=6.1.2, socketlib; ID `meliaz-bridge-lab`; no activar junto con `meliaz-bridge`. Manifest sin URL de actualización; instalación local, no actualización remota.

| Prueba | Resultado esperado | Estado |
|---|---|---|
| Barra LVDM | Tres herramientas en vertical, orden Combate/Descanso/Kawín, tooltip, no visible para jugador | PENDIENTE |
| Combate | Todos los Kona PJ de escena incorporados una vez antes de iniciar; no alta automática de PNJ; encuentro preparado compatible reutilizado | PENDIENTE |
| Cierre | Cancelación no cambia nada; marcador cerrado y Manifestaciones limpias antes de eliminar encuentro | PENDIENTE |
| Descanso | Elegir subconjunto, cancelar sin cambios; confirmar noche real; Aguante máximo y Newén según Arraigo; excluidos intactos | PENDIENTE |
| Kawín | Apertura colectiva y texto aprobado; edición permitida a participantes; cierre explícito recupera Newén y Aguante completos; excluidos intactos | PENDIENTE |
| Exclusión | Combate y Descanso bloqueados durante Kawín; confirmar persistencia tras recarga | PENDIENTE |

## Riesgos observados por lectura de código
Descanso registra cada participante en chat después de actualizar el Actor; si falla la publicación, puede existir recuperación sin mensaje. Antes de repetir, cotejar valores efectivos y seleccionar sólo restantes. Combate comprueba que el marcador tenga filas, no la inclusión completa de todos los UUID esperados después de crear combatientes; D3 debe cotejar el listado completo. No se han reproducido estos fallos en Foundry ni se cambia código aquí.

## Cierre
Decisiones: conservar candidato exacto y tres controles. Pendientes: D3 real y riesgos anteriores; restantes del checkpoint LAB.6.2 siguen abiertos. Fuentes: checkpoint, ZIP y pruebas recuperadas. Estado Maestro: sin cambios. Estable, compendio y mundo: sin cambios.
