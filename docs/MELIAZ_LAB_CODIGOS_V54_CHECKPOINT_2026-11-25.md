# CORE / MELIAZ LAB — Códigos v54 · 25-11-2026
## Decisiones recuperadas
- v54, cierre autoral 24-11: cupos por Picardía, familias Inscribir / Significar / Señalizar / Convocar; Sabio I/Sig, Cantor Sig/C, Viajero Señ/C, Guerrero Sig/C. Explorador sólo alias de compatibilidad en Bridge.
- Una práctica aprendida ocupa un cupo; formas culturales de esa práctica no añaden cupo; aprendizaje efectivo validado por Voz del Mundo. Sustitución voluntaria entre aventuras aprobada. Tramas son Códigos. Lenguas son biográficas; Picardía vs Peso 3 es ejemplo para comprender lengua desconocida, no dificultad universal.
- No recuperar datos de lengua_1..4 como Códigos. No canonizar catálogo incompleto, operaciones candidatas ni iconos por su sola existencia.
## Implementación LAB
- Delta 775c0eed8a0d53820e7a784ee58cb100142841df, ajuste 62ef8eccacf75bcca93b751954edd60b486e981e. 43 anclas verificadas contra bridge.js antes del ajuste de validación de familia.
- Cuatro posiciones existentes reutilizadas por botones; input CSB oculto visualmente, valor intacto. Flag de Actor codigosV1: cuatro entradas posibles; identidad, nombre, familia, lista de formas {culture,name}. Sin escribir props lengua.
- Registro manual de prácticas validadas en ficción (no catálogo preaprobado), selector de familias por Oficio, validación de cupo y duplicados, ampliación de formas en misma entrada, sustitución explícita entre aventuras. Confirmación declarativa, no autoridad GM automatizada.
- Si Picardía baja o cambia Oficio, conservar registros; bloquear nuevas altas fuera de cupo y aprendizajes de familia vedada. No reducir o borrar automáticamente. Lectura de datos malformados falla sin sobrescribir.
- D2 tests: alta, cupo, familia, duplicado, forma, sustitución, reducción Picardía, cambio Oficio y datos malformados. Workflow 5caeb1179fc62d8524b55cd0ec5c9fc3edd1a8a8. Resultado pendiente de verificación al registrar checkpoint.
## Pendientes
- D3 plantilla CSB real, wrappers, botones, permisos y reapertura, compatibilidad con placa v5.1, datos legados, iconos/catálogo final. Falta incorporar WEBP aprobado al builder reproducible.
- Catálogo concreto no completo: v55 iconos aprobados de Inscribir/Convocar; Señalizar maestros no recuperados; Significar no cerrado. No equiparar iconos con prácticas. Recuperar catálogo y cotejar antes de enlazar.
- Siguiente frente: Aguante e Incapacitado en Resolver Intercambio; Piño después según regla vigente. No publicar ZIP intermedio ni tocar H6/H7, Forge, Bridge estable, Maestro o CI137.
## Fuentes
CORE_CODIGOS_CIERRE_REGLISTICO_INTEGRACION_PREPARADA_v54 (recuperación de contexto), CORE_CODIGOS_CUPOS_COMPLETOS_Y_SUSTITUCION_v53, checkpoint iconos v55; plantilla histórica Arraigo 3 y fuente bridge.js exacta. No se recuperó el export vigente de CSB ni un catálogo integral aprobado.
