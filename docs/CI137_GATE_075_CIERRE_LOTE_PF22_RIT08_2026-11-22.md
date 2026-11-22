# CI137 — Gate final de procedencia binaria, Parafernalia 22 + Rituales 8
Fecha de verificación: 2026-11-22.

## Resultado reproducido
- 0.4.72 ZIP: SHA256 `437b263f40c0c1e18cd24d0bcb996a4e1769a3830978133d0c839a0dbe1b228c`, 357 entradas, CRC PASS.
- 0.4.73 ZIP: SHA256 `2d8830d5a18b7d6ff7ba4eee469214fef7b7efdf7164b552464620a0580a5329`, 357 entradas, CRC PASS.
- 30/30 rutas originales recuperadas (22 `assets/iconos_aprobados`, ocho `assets/rituales`), 30/30 SHA de archivos coincidentes entre 0.4.72, 0.4.73 y ZIP candidato; 30 nombres y hashes únicos; decodificación WebP correcta a 512x512.
- ZIP local candidato: `CI137_CANDIDATO_0473_30_WEBP.zip` SHA256 `48d13f20b91cc1a3cfe9b858ec90b48ce98bfb6475aa36c51f370231386901ec`.
- Se ejecutó una puerta de comparación read-only contra los 30 SHA en `CI137_CANDIDATO_0473_MANIFIESTO.json`. Resultado exacto: **`BLOCKED_REFERENCE_075_NOT_AVAILABLE`**, sin diferencias en la fuente candidata, exit code 2 esperado. Se verificó sintaxis Python del comparador.
- Búsquedas Drive por nombre y por filtro `name contains '0.4.75'` y en respaldos visibles: 0 resultados. Se localizaron backups v0.4.72 y v0.4.73 y se auditaron sus binarios; no el 0.4.75. GitHub Actions contiene artefactos para el prototipo y auditoría de Armas, no prueba de un backup 0.4.75.

## Criterio de cierre
- Fuente requerida: `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip`, SHA256 `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`.
- Cuando aparezca, comparar **byte a byte** las 30 rutas `hiperaustralis-rituales/assets/iconos_aprobados/*.webp` y `assets/rituales/*.webp` contra el manifiesto actual.
- Si 30 SHA coinciden: continuidad de versiones acreditada; la eventual integración a la rama debe ser un commit aislado sólo de assets, sin cambiar Items, IDs o referencias.
- Si hay divergencias: registrar por ruta y preservar todas las variantes; no reemplazar los 30 finales por el candidato.
- No se puede afirmar que el lote haya pasado el cotejo 0.4.75. **Estado actual: CANDIDATO HISTÓRICO RECUPERADO; PROMOCIÓN BLOQUEADA**.

## Decisiones / pendientes / fuentes / Estado Maestro
**Decisión:** no reiniciar imágenes, no reasignar, no promover sin evidencia del backup 0.4.75.  
**Pendiente:** cotejo físico 0.4.75, transferir y validar bajo QA de rama, luego resto de puertas CI137.  
**Fuentes:** respaldos Drive 0.4.72/0.4.73 recuperados; 30 JSON históricos; manifiesto v03; checkpoint Foundry de 18–19/11; informe local del gate.  
**Estado Maestro / main / Bridge / Foundry / Forge:** sin cambios.
