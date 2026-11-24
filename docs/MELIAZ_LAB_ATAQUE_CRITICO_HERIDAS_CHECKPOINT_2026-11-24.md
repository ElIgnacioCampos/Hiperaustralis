# CORE / MELIAZ LAB — Resolver Intercambio, armas y Heridas · 24-11-2026

## Decisiones autorales de esta conversación
- Clic en arma equipada inicia ataque de Ñeque mediante MELIAZ, no apertura ordinaria del Item.
- La consecuencia de Herida cuando proceda se determina según arma y situación. Pendiente actualización del catálogo arma → Herida.
- Tipos definidos: Inconsciente, Envenenado, Asfixia, Fractura, Mutilación. No recuperar tipos viejos ni asignar por intuición como canon.
- Conservar regla cerrada de Armadura: interposición material pertinente evita Herida, inutiliza Armadura; no elimina desgaste. No revierte veneno inoculado ni asfixia en curso.
- Usuario solicita incluir este frente antes de probar nueva hoja. Descendiente 0.24.205 D2 PASS, no D3. Códigos pendiente de implementación. No despliegue.

## Rectificación autoral posterior — prevalece sobre la escala histórica
- Tirada de combate: **Resolver Intercambio**, aplicación de la Prueba de Azar universal, una sola tirada bilateral; no ataque y defensa separados.
- Caras definitivas para esta implementación: **1 Revés · 2 Empate · 3 Avance · 4 Quiebre**. La fuente `CORE_MELIAZ_RESOLVER_INTERCAMBIO_NOMBRE_Y_REDACCION_2026-11-24_v01.md` conserva Impacto en la cara 3; la corrección explícita de esta conversación lo sustituye por Avance. No aplicar un renombrado global al azar no bélico sin cotejo.
- **Rectificación autoral definitiva del campo de arma: Quiebre**, reemplaza Crítico (y el rótulo heredado Herida si corresponde). Quiebre designa tanto la cara 4 como el apartado de arma que indica la Herida o consecuencia particular posible. No limitar el apartado a los cinco tipos de Herida; admitir otras consecuencias pertinentes sin crear estadísticas, grados ni otro campo. El Quiebre no obliga a Herida si la intención o medio no lo permiten. Revés se lee desde el lado con Ventaja, no necesariamente desde el atacante.
- La respuesta del Rival en el mismo intercambio no agrega dado ni intervención adicional. El caso de Rival con Ventaja que inicia ataque y el orden sin Emparejamientos se conservan como laboratorio según la fuente recuperada; no cerrar por inferencia.

## Autoridad recuperada (terminología histórica anterior a la rectificación)
Estado Maestro ACTUAL 24-11, líneas 120-140, 660-664, registros Puede Herir y Armadura; CORE_CHECKPOINT_MELIAZ_ARMADURA_CIERRE_2026-11-24_v04.md.
- 1 Desastre: lado sin Ventaja impone intención, complicación adicional pertinente.
- 2 Fallo: ninguna intención se impone.
- 3 Éxito: lado con Ventaja impone intención.
- 4 Crítico: lado con Ventaja impone intención, consecuencia favorable adicional. Crítico de ataque puede causar Herida.
- Capacidad efectiva inferior al Peso del Rival no permite imposición directa; sin Prueba de Azar hasta cambiar situación.
- Si intención implica desgaste: Kona pierde una parte de Aguante; Rival pierde 1 Peso. Herida independiente.
- Puede Herir: en 1 Desastre con Ventaja Kona, Rival con medio concreto puede causar Herida si efectivamente alcanza al Kona, sin pérdida adicional automática de Aguante ni tirada extra.
- No trasladar literalmente checkpoint septiembre si contradice Maestro actual.

## Auditoría real de Bridge 0.24.203 fuente LAB
module/meliaz-bridge/bridge.js:
- renderHiperaNequeLoadout ~5436: un arma y armadura, fila data-ha-neque-row, ID de Item embebido.
- installHiperaNequeLoadout ~5517: clic fila abre item.sheet.render(true); retiro, reparación, picker y contextmenu tienen sus rutas. Cambiar exclusivamente clic arma equipada; preservar retiro, defensa y acceso a ficha (propuesta: Shift+clic abre Item; no alterar clic derecho existente).
- installKonaRollCenterShield ~6660: zona Ñeque ya llama startAction(actor.uuid,"neque").
- startAction ~8559: selecciona objetivo único, Peso, Manifestación, Exaltar, intervención y tarjeta pendiente. No conserva intención ataque ni arma en snapshot de acción. Extender con contexto opcional de ataque (ID/UUID, nombre, Herida validada); llamada ordinaria sin contexto permanece idéntica. No iniciar segundo d4.
- resolveAction ~9377: etiquetas DESASTRE/FALLO/ÉXITO/CRÍTICO ya correctas; control de marcar -1 Peso hoy se presenta si targetActorUuid existe, sin filtrar imposición. Revisar guard para que sólo proceda cuando intención y resultado permitan desgaste; no aplicar a toda acción ni duplicar pérdida.
- Arma sin clasificación nueva: informar Quiebre pendiente de cotejo, no inferir tipo ni impedir ataque básico. Quiebre sólo ofrece consecuencia lesiva pertinente, no efecto automático. Registrar en tarjeta de chat el arma y resultado; propuesta de confirmación humana de Herida/Armadura antes de aplicar consecuencia. PNJ no recibe recurso numérico adicional.
- Exaltar Azar garantizado no produce Quiebre; cotejar regla actual antes de renombrar o modificar su efecto. Su actualización actual es frente separado de reglas; no reintroducir antigua ventana de intervención por este cambio.

## Próximo paso
1. Recuperar 20 armas canónicas de CI137 QA5 y sus campos reales, matriz Arma × Quiebre (cinco tipos de Herida o consecuencia pertinente) y cotejo con medios lesivos de Rival; actualizar fuentes sólo con aprobación de clasificación.
2. Construir candidato integrado LAB sin cambiar IDs, fondos, geometría o compendio estable; probar clic arma, clic ordinario Ñeque, selector, retiro, defensa, resultados 1-4 y ausencia de doble tirada, persistencia del contexto de ataque, ausencia de Herida automática, Armadura pertinente.
3. Completar Códigos conforme checkpoint previo y confirmar plantilla; consolidar D2 antes de prueba D3.
Estado Maestro, QA5, Bridge instalado, Forge: intactos. No nuevo ZIP en este paso.
