# CORE / MELIAZ LAB — Aguante e Incapacitado · 25-11-2026
## Decisiones y fuentes
- CORE_ED_CAPITULO_V_MELIAZ_CONSOLIDADO_CANDIDATO_2026-11-24_v13.md y CORE_MELIAZ_RESOLVER_INTERCAMBIO_RESULTADOS_INTEGRALES_REVES_2026-11-24_v09.md, recuperados de Biblioteca: Revés implica pérdida de una parte de Aguante sólo si el Rival consigue desgastar al Kona. Herida no añade pérdida. Armadura no evita desgaste. Aguante o Peso 0 = Incapacitado sin Herida obligatoria. Mantener Impacto/Quiebre y lectura Kona-céntrica.
- Códigos último ajuste D2 PASS, run 45544706931.
## Implementación
- 4997580b63e7a409f6dd98ea80ded11e76865981: helper de desgaste después de Torcer y de decisión de Armadura; confirmación contextual, exclusión de otras caras, descuento único de Aguante, registro en mensaje, Incapacitado al llegar a 0. No escribe Herida/Newén/otros campos ni crea estado independiente. Si Piño absorbe, no confirmar desgaste directo; automatización Piño pendiente. No se añade bloqueo global a acciones ordinarias.
- 9fe9bdb3013d4add642ea537d12d513e482fc697: pruebas del helper real con mocks, consentimiento, repetición y reclamación persistente, límites, cero, exactitud de escritura.
- e8203b790da755a3518fd30b8987e9bf3f505ad7: reporte D2 actualizado. Resultado pendiente al registrar.
## Pendientes
- D2 último candidato, D3 real permisos, diálogo, actualización CSB y estado Incapacitado, Torcer, Armadura, Peso 0. Confirmación declarativa de Voz del Mundo; no implementa autorización GM remota.
- Piño: recuperar decisión vigente posterior a eliminación de Emparejar antes de integrar; evitar descontar al principal cuando corresponda otra consecuencia. No cerrar por inferencia.
- Integrar WEBP exacto aprobado al builder; verificar Quiebre de armas y catálogo Códigos. No publicar ni instalar por partes; Bridge estable, H6/H7, Forge, CI137 y Maestro intactos.
