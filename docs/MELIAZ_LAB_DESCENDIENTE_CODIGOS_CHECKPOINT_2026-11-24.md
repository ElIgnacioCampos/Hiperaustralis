# CORE / MELIAZ LAB — Descendiente y Códigos · 24-11-2026

## Decisiones
- Separar el frente Hoja Kona de CI137 compendio y auditoría de obsolescencia; no tocar QA5, H6/H7 ni Forge.
- Usuario informa que no puede marcar Descendiente; sospecha interacción con Mascota. Fuente 0.24.203 en rama LAB 0.24.204: marcador top 37%, altura 3%, Mascota top 38%; regla final 0.24.180 da z-index 120 a ambos. Solapamiento estático confirmado; causa runtime no confirmada.
- LAB 0.24.205-lab.0: prioridad 121 exclusivamente al marcador, pointer-events none si disabled. Sin cambios de geometría, candado, flags, Auspicio, Manifestar, Mascota ni gráficos. D2 de empaquetado/sintaxis PASS #45510298722, commit e3c549bb41f377f0cf1c7b7793340a052f1949b0. D3 pendiente. Misma ID meliaz-bridge-lab, sólo reemplaza LAB, nunca coactivar original. No despliegue.
- Códigos sustituye Lenguas en hoja y mecánica; lengua propia de Cultura queda como interpretación; Picardía vs Peso 3 como ejemplo de comprender lengua desconocida, no dificultad fija universal. No añadir subsistema de idiomas.

## Fuente y contrato de migración de Códigos
- Estado Maestro ACTUAL 24-11, §§ Creación básica y Hoja Kona, aún dice Lenguas; desfase de integración. No modificar ACTUAL sin aprobación explícita.
- Checkpoints CORE_CODIGOS_MATRIZ_OFICIOS_APRENDIZAJE_v50_2026-11-24.md y CORE_CODIGOS_CUPOS_COMPLETOS_Y_SUSTITUCION_v53_2026-11-24.md, leídos íntegros.
- Cupos = Picardía presente. Una práctica comunicativa concreta = un cupo; formas culturales realmente aprendidas de misma práctica no añaden cupo. Oficio restringe familia. Tramas son Códigos; hallar/comprender una Trama singular no otorga automáticamente práctica aprendida. Aprendizaje cuando Historia demuestra comprensión y uso autónomo, validado por Voz del Mundo sin tirada adicional, PX ni Newén.
- Matriz de trabajo v51: Viajero Señalizar+Convocar y Guerrero Significar+Convocar aprobados explícitamente. Sabio Inscribir+Significar y Cantor Significar+Convocar filas heredadas de propuesta v50 sin aprobación individual inequívoca según v53. No convertir propuesta en bloqueo definitivo sin cierre. Sustitución voluntaria entre aventuras sigue provisional, no habilitar.
- Hoja: export histórico Kona y export Actors 14-11 contienen cuatro textField CSB lengua_1..4, clases ha-lengua-1..4. Bridge conserva posicionamiento radial interior. No confundir campos heredados con datos Códigos. Auditar plantilla real vigente y si rótulo está embebido en placa. Preservar cuatro posiciones y resolución del fondo; usar nuevo almacenamiento para Códigos, no reinterpretar textos antiguos de Lenguas como prácticas. Conservar antiguos datos como biografía/compatibilidad sin cupo; no borrar ni migrar por semejanza. Propuesta técnica: entradas estructuradas con ID de práctica, familia, nombre y formas culturales; no duplicar cupos, nunca borrar al bajar Picardía, impedir nuevas altas fuera de cupo; cotejar comportamiento cuando Picardía varía antes de cerrar. No inventar prácticas ni selección de catálogo.
- Orden: D3 Descendiente con mascota/no mascota y candado abierto/cerrado; recuperar plantilla y catálogo de Códigos vigente; migración aislada, validación con Picardía 1..4 y persistencia. No rediseñar placa ni introducir iconos por iniciativa propia.

## Pendientes
Prueba física D3 del LAB 0.24.205, migración namespace de flags si fuera necesaria (no tocada), plantilla actual y catálogo de prácticas, Códigos sin sustitución automática. Retomar CI137 según cola registrada tras cerrar este incidente.
