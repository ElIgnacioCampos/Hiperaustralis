# CI137 — Recuperación binaria 0.4.98 / 0.4.100 · 24-11-2026

## Fuentes físicas verificadas
- HIPERAUSTRALIS_FOUNDRY_V14_COMPENDIOS_0.4.100_ADVERSARIOS_FIX_CANDIDATO.zip — 45.129.580 bytes, SHA256 14c674d3e0ea42ecda068e0bdf071d929a90d30c455b756a3cca3a573b2a81fd, 600 entradas CRC PASS.
- HIPERAUSTRALIS_FOUNDRY_V14_COMPENDIOS_0.4.98_ADVERSARIOS_CULTURAS_CANDIDATO (1).zip — 45.126.946 bytes, SHA256 bc1421ac0444f3374ac3322e7279f47ae682ca2fbc1b370b3cc8f5402a503b8f, 596 entradas CRC PASS.
- 501 archivos de assets idénticos por ruta y SHA en ambos. Adoptar 0.4.100 como fuente de lectura, NO reinstalar módulos legados.
- Cotejo contra export de Actors 14-11 y artefacto nativo 14963828413. Manifiesto local CI137_ASSETS_RECUPERACION_04100_20261124.json, SHA256 4cb6d261b3f0bdb4163d6914ba001a0bb782adcd5f3675d2a6db16645e6506df. 193 miembros binarios únicos (22.083.654 bytes), decodificación PIL PASS, igualdad byte a byte entre ambos ZIP. Aún no transferidos a GitHub ni promovidos a runtime.

| Grupo | Exactos | Candidatos otra raíz | Ausentes |
|---|---:|---:|---:|
| Actor Rivales | 16 | 0 | 0 |
| Actor Fauna | 14 | 0 | 5 |
| Actor Habitantes | 0 | 0 | 22 |
| Actor Familiares Exóticos | 0 | 7 | 1 |
| Actor Mascotas | 0 | 10 | 0 |
| Journal Culturas | 27 | 0 | 4 |
| Item bioma | 8 | 0 | 0 |
| Item fauna | 77 | 0 | 5 |
| Item flora | 48 | 0 | 0 |

## Pendientes reales
- Cinco FAU compartidos por Actor/Item: FAU-045 Macrauchenia, FAU-046 Hippidion, FAU-047 Notiomastodon, FAU-053 Smilodon, FAU-054 Kelenken.
- Once Habitantes con retrato y token: HAB-01,02,04,05,06,07,08,09,10,11,12 (22 rutas); no sustituir por Presencias.
- EXO-009 Macaco de Pikunmapu: existen EXO-009.webp y EXO-009_Chilecebus.webp bajo meliaz-bridge; correspondencia visual no demostrada, no sustituir automáticamente.
- Cuatro imágenes antiguas de Turianos en Journal Culturas bajo modules/hiperaustralis-compendios/assets/turianos/; cotejar contra v06 y decisiones posteriores, no reciclar IDs Atlantes.
- Las 17 coincidencias por ruta relativa bajo meliaz-bridge requieren validación de identidad y remapeo, no equivalen a aprobación artística final.
- No duplicar los 40 tokens Kona ya en Bridge LAB.
- Recuperación de fuentes no equivale a aprobación de gráfico, migración territorial o D3. Próximo paso: transferir exclusivamente binarios seleccionados con hash y revisar fuentes posteriores de HAB/FAU/EXO; no pedir de nuevo 0.4.99 ni 0.4.103 sin necesidad específica.
- Estado Maestro, QA5, Bridge, Forge intactos.
