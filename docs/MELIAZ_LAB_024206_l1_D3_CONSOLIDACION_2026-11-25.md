# MELIAZ LAB 0.24.206-lab.1 — consolidación y D3 · 25-11-2026
## Evidencia
- D2 integrado código 0.24.206-lab.0: Actions 45546313921 success, artefacto 14991253606, ZIP interno SHA256 e972f99ce35ca2775a7ad57f534f6564be5b635671530eab0fa0362775ed5fd0.
- WEBP aprobado Hoja_Kona_Codigos_v5.1_madera_QA.webp SHA256 fb9d84709b9303457f0c06efd6a9c8364c62fb2b03870358b3f73c940b9aeafe, 1448×1086, 2745 píxeles diferentes frente a original.
- Ensamblador tools/foundry/meliaz_lab_assemble_approved_sheet.py commit ccbe718fb53e8a508859019348c4a27ef22745b7: exige SHA de ambas entradas, no recomprime el WEBP, cambia sólo ese recurso y versión de module.json. El binario exacto aprobado aún no está en GitHub; el script requiere suministrarlo. No declarar build remoto autónomo.
- ZIP local MELIAZ_BRIDGE_LAB_0.24.206-lab.1_NO_H6_H7.zip: 6097602 bytes, SHA256 adc794e5aa28322c68df51486f502dee6bbcb513765ceec440533f4960f59229, 63 entradas, 40 tokens, CRC PASS, ambos node --check PASS. JS idénticos byte a byte al D2. ID meliaz-bridge-lab; versión lab.1 distingue montaje final.
- No publicar release ni instalar en H6/H7. D3 no ejecutado. ZIP entregable únicamente para clon aislado.
## D3 — matriz de regresión (todos PENDIENTES)
| ID | Caso | Criterio de aceptación |
|---|---|---|
| D3-00 | Forge setup y clon, servidor reiniciado | LAB aparece en game.modules, ID y versión correctos; SocketLib activo, original inactivo; F14.370+ CSB6.1.2+. Ausencia de URL manifest no se considera causa demostrada. |
| D3-01 | Snapshot Actor duplicado antes/tras arranque | Sin pérdida de props, flags, Items ni duplicación inesperada de hooks. |
| D3-02 | Hoja v5.1 y resize | Fondo exacto, controles coinciden con placa, Descanso visible sin solapar contadores/Porte; Códigos en cuatro posiciones. |
| D3-03 | Descendiente con/sin Mascota, bloqueo abierto/cerrado | Marcador accesible sólo si editable; Mascota y persistencia intactas. |
| D3-04 | Arma clic, Shift+clic, retiro, selector, DnD | Una acción Ñeque con arma; Shift abre Item; no doble tirada. |
| D3-05 | Intercambio iniciativa Kona/reactiva Rival, cuatro caras | Una tirada; elegibilidad v13; Torcer antes de consecuencias; Peso 0 Incapacitado; comprobar Quiebre de ficha real. |
| D3-06 | Revés con/sin desgaste, Herida, Armadura | −1 Aguante sólo si procede, nunca doble débito; icono Inutilizada persiste tras cerrar; intercambiar Armadura no transfiere estado; reparación requiere confirmación; Torcer a 3 no desgasta. |
| D3-07 | Descanso: Arraigo 1–3, recursos incompletos, cancelar, combate | Aguante hasta Ñeque, Newén +Arraigo hasta 4, sin reparar ni curar; chat exacto. |
| D3-08 | Códigos Picardía 1–4 y cuatro Oficios, forma y sustitución | Cupo, familias, persistencia tras reabrir, datos legados intactos; reducción Picardía no borra registros; validar sustitución entre aventuras. |
| D3-09 | Piño y antiguo flag Apiñar | Peso ordinario, no bono ni control activo, sin escritura de flag legado. Desbandar III queda fuera de cierre hasta decisión CORE. |
| D3-10 | Regresión A–F de base 0.24.203 | Tokens, Auspicio, Exaltar, Manifestar I–III +1, Gracia, Rituales, Reliquias, Equipo, Territorio, Instrumentos, DnD y permisos sin regresiones. |
| D3-11 | Reapertura y dos reinicios | No pérdida ni duplicación; comparar snapshot inicial/final. |
## Bloqueos explícitos
- Incidencia D3-001 instalación previa (Setup visible, mundo no reconoce) abierta; recuperar docs/MELIAZ_LAB_D3_001_INSTALACION_SIN_MANIFEST_20261124.md, no inventar URL ni cambiar ID.
- Desbandar III requiere cotejo CORE con Piño simplificado; catálogo Códigos/iconos y Arma → Quiebre completos pendientes. Torcer conserva elegibilidad provisional de LAB.
- Territorio nueve bandas y Recetas pendientes de contrato/destino aprobado; no declarar cierre global. CI137 D3 separado.
- No promoción al estable ni modificaciones de Maestro.
