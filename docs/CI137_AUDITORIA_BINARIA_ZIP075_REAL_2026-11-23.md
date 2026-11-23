# CORE / CI137 — Auditoría física del ZIP 0.4.75
**Fecha:** 23-11-2026 · **Fuente directa:** ZIP adjuntado a la conversación por el usuario · **Estado:** D2 prueba binaria real PASS; D3 / publicación bloqueados.

## Autoridad y integridad
- Archivo recibido: \`HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB(1).zip\` (nombre de carga, conserva el contenido de \`HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB.zip\`).
- Tamaño físico: **33.028.294 bytes**; SHA-256 **\`c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e\`**. Coincide con los registros de auditoría históricos.
- ZIP: **358 entradas**, **CRC PASS**, **0 nombres duplicados**. Las imágenes enumeradas más abajo se decodificaron directamente desde el ZIP con Pillow; no se convirtieron ni editaron.
- Identidad interna del módulo histórico: \`hiperaustralis-rituales\`, **versión declarada 0.4.74** aunque el ZIP se denomine 0.4.75, Foundry 13 y CSB 5.2.1. El instalador \`scripts/install.js\` produce efectos de sincronización, edición y eliminación de documentos al iniciar; **NO instalar en V14 ni reutilizar instalador para CI137**.

## Resultado por familia
| Grupo | Archivos | Bytes reales descomprimidos | Validación |
|---|---:|---:|---|
| Flora \`assets/flora-y-funga/iconos\` | 40 | **3.641.622** | 40 WebP RGBA 512×512; 40/40 decodifican |
| Fondos \`assets/flora/biomas\` | 8 | **3.228.266** | 8 WebP RGB válidos; dimensiones variables originales |
| Parafernalia \`assets/iconos_aprobados\` | 22 | **828.128** | 22 RGB 512×512, hash cotejado |
| Rituales \`assets/rituales\` | 8 | **492.868** | 8 RGB 512×512, hash cotejado |
| Fauna rupestre \`assets/fauna/rupestre\` | 31 | **1.750.516** | 31 RGBA 512×512 decodifican; sin promoción |
| Biomas \`assets/biomas/iconos\` | 8 | **332.956** | 8 RGBA 512×512; material candidato |

### Resuelto: doble cifra histórica de Flora
- El archivo exacto cuyo SHA-256 se verificó contiene **40 iconos por 3.641.622 bytes**. Coincide con \`docs/AUDITORIA_COMPARATIVA_COMPENDIOS_0.4.68_vs_0.4.75_2026-11-12.md\`.
- \`docs/AUDITORIA_HASHES_FLORA_0.4.68_vs_0.4.75_2026-11-12.md\` consignaba **5.951.968 bytes**, cifra **incompatible con este mismo ZIP SHA-verificado**. Conservar el documento como antecedente e incorporar esta fe de erratas sin sustituir silenciosamente el original.
- Las 40 fichas \`data/flora_items.json\` tienen 40 códigos, 40 seedId únicos, 40 rutas de iconos existentes y **40 rutas de fondo existentes**. Estas últimas apuntan a **8 archivos únicos**, pero **33 fichas remiten al fondo de Totora** (FLO-001 y FLO-009…040). Anomalía heredada: **no reasignar fondos automáticamente**.
- Ni el banco Flora v1 de Biblioteca ni el documento JSON histórico conceden aprobación visual para instalar por defecto todos los iconos en el nuevo prototipo. **0 iconos Flora promovidos**.

### Resuelto: 22 Parafernalia + 8 Rituales
- **30/30 SHA-256 de la fuente física 0.4.75 idénticos** a los \`historicalCandidateSha256_0472_0473\` de \`manifests/ci137-parafernalia22-rituales8-recovery.json\`. **Cero diferencias**, 30 rutas exactas, todos 512×512 RGB. Se acredita continuidad *de bytes* 0.4.72/0.4.73/0.4.75, no autorización para sobrescribir arte de runtime.
- La selección de 136 Items y los JSON originales no se alteraron; el manifiesto ahora separa \`archive075ByteEquality\` de \`approvedForTransport: false\`.
- GitHub Actions sólo vuelve a verificar huellas del staging y la evidencia declarada; el ZIP real de 33 MB **fue cotejado localmente a partir del adjunto**, no incorporado al workflow.

### FAU-003 recuperado con cautela
En el ZIP existen tres archivos homónimos que **no son equivalentes**:
1. \`assets/fauna/iconos/FAU-003_Fulica_ardesiaca.webp\` — **1024×1024 RGBA**; SHA-256 \`a5f418074209715ceb383ba53c4fc0974e9c68375b0dd02aa487c9b62775049d\` — **idéntico a la huella histórica del original sin cambios**.
2. \`assets/fauna/rupestre/FAU-003_Fulica_ardesiaca.webp\` — **512×512 RGBA**; SHA-256 \`c536bd972d57eb0b5534e1b020c7d409f327b2276a4bd7b56748cf6e00acd62f\` — variante distinta: **no equiparar a la versión 512 aprobada con solo el nombre**.
3. \`assets/fauna/01_Titicaca/FAU-003_Fulica_ardesiaca.webp\` — **1080×1440 RGB**, documento fotográfico/territorial separado; no es icono rupestre.

Se recupera la procedencia exacta de un original aprobado; la reparación del WebP512 de 0 bytes del ZIP FAU de octubre requiere cotejo visual y autorización editorial independiente. **No se genera, normaliza ni sustituye imagen por defecto**.

### Exclusiones y seguridad
- \`data/biomas_journal.json\`: 8/8 registros mantienen **CANDIDATO / NO PUBLICAR**.
- **D3/Foundry cliente: NO ACREDITADO**. Sin instalación, reemplazo de Items, reescritura de \`img\`, cambios del Bridge, Forge, \`main\`, producción ni Estado Maestro.
- El nuevo \`tools/foundry/ci137_verify_075.py\` puede repetir el control de SHA/CRC/40 iconos/8 fondos/30 huellas cuando se ejecute con el ZIP local; su CI alberga autopruebas sintéticas, no una copia del ZIP.
- Archivo de auditoría JSON completo generado localmente: \`CI137_075_AUDITORIA_BINARIA_REAL_20261123.json\` (sin subir los 33 MB ni duplicar arte en GitHub).

## Cierre
**Decisiones:** reconocer el 0.4.75 exacto y sus 30 pares SHA, resolver total Flora, preservar el original exacto FAU-003 de 1024 y bloquear toda promoción automática.
**Pendientes:** verificación de identidad del WebP512 FAU-003, auditoría editorial de los fondos Flora compartidos, 99 referencias históricas de CI137, D3 de Foundry real.
**Fuentes:** ZIP del usuario con SHA-verificación actual, manifiestos CI137, auditorías 12-11 y checkpoint visual FAU 10-10.
**Cambios al Estado Maestro:** ninguno.
