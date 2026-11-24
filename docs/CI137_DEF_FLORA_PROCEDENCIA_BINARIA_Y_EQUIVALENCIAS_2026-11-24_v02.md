# CI137 — Defensas y Flora: segundo cotejo de equivalencia y procedencia binaria

**Fecha:** 24-11-2026 · **Rama:** `work/ci137-expansion-familias-20261124` · **Estado:** AUDITORÍA BINARIA CERRADA PARA FUENTE OPTIMIZADA; origen del catálogo gráfico anterior aún no recuperado. Cero cambios en Forge/H6/H7/QA5.

## 1. Evidencia exacta

**Fuente 1:** `HIPERAUSTRALIS_COMPENDIOS_0.4.75_OPTIMIZADO_LAB(1).zip`, SHA-256 `c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e`, 358 entradas, CRC PASS.

**Fuente 2:** `CI137_FUENTE_FLORA_075_40_ICONOS_8_FONDOS_SOLO_RESCATE_20261123.zip`, SHA-256 `5816ee481dfb3bd9620d2c4604c365cc2ed11f7899a973da3a1e6ea7c8cbb4ba`.

**Reinspección local física, no deducción de nombres:** los 48 archivos gráficos de Fuente 2 (**40 iconos + 8 fondos**) se cotejaron contra la Fuente 1 y son **48/48 idénticos byte a byte**. Los otros dos archivos de Fuente 2 (`MANIFIESTO_SHA256_FLORA_075.json`, `LEEME.txt`) son documentación de recuperación, no archivos ausentes del módulo. Los 40 iconos WebP son **512×512 RGBA** y suman **3.641.622 bytes**. Los 8 fondos tienen geometrías y modos originales heterogéneos, conservados sin intervención.

**Fuente 3:** `hiperaustralis-rituales/data/flora_y_funga_40.json` **dentro del mismo ZIP 0.4.75**, con campos `sha256_webp` y `bytes_webp`. Cotejo 40/40: **ningún SHA ni tamaño de binario coincide** con lo realmente empaquetado en 0.4.75. La suma de tamaños declarados es **9.107.212 bytes**, contra los **3.641.622 bytes** reales de los 40 iconos del ZIP. Esta diferencia **no explica por sí misma el método aplicado**: puede ser otra exportación/optimización o un catálogo de hashes sin actualizar; no afirmar cuál sin original de referencia.

**Fuente 4:** `hiperaustralis-rituales/AUDITORIA_FLORA_FUNGA_0458.json` consigna `sha256_failures: []` en una etapa previa, pero eso **no demuestra** paridad entre sus archivos de entonces y los binarios del ZIP 0.4.75. El checkpoint histórico 0.4.58 se refería a un compendio distinto `world.hiperaustralis-flora-y-funga`; no confundir sus Journals con las 40 fichas Item actuales identificadas.

**Registro granular de auditoría (40 Items + 48 binarios):** `CI137_PRUEBA_PROCEDENCIA_FLORA_DEFENSAS_20261124_v02.json` preparado como archivo de conversación; SHA-256 `01f67ca9746f265d25d242ca3658aa55ebe566174831d49b148727c9e857694f`. Incluye código FLO, semilla, ruta exacta, tamaño real/declarado, ambos SHA, dimensiones, fondo y estado gráfico; no fue publicado en GitHub por contener un inventario duplicado grande. Se conserva el SHA como llave forense.

## 2. Anomalía de fondos

- Las 40 fichas Item `data/flora_items.json` refieren **8 fondos distintos** en el campo `flags.hiperaustralis-sheet.background`.
- **33/40** apuntan al fondo de Totora, aunque son taxones diferentes.
- Otras **7/40** tienen fondos propios. La existencia física de los ocho fondos quedó comprobada.
- Decisión: conservar los fondos históricos intactos como evidencia; **no reproducir el fondo de Totora de manera automática en una nueva ficha, y no asignar nuevos fondos por inferencia**. Para las nuevas entradas de Territorio hace falta un estándar de ficha aprobado o dejar el fondo previo donde corresponda.

## 3. Defensas, equivalencia documental

Las ocho Defensas de QA5 son registros `defensa-01..08` con IDs de 16 caracteres, fuente `source-pending/ci137-historicos-99/defensas/`, ya importados. Los nueve candidatos `DEF-01..09` provienen del catálogo de activos **COM-03/05/06/07/08/09/10/11/12**.

- `DEF-04 / COM-07 Casco Pica–Tarapacá`: ámbito funcional compartido con `defensa-01` (casco rígido), `defensa-02` (emplumado) y `defensa-03` (sobre capucha), pero falta prueba de que la nueva entrada corresponda a una de esas tres fichas; **sin merge**.
- `DEF-05 / COM-08 Coraza Chiu-Chiu` y `DEF-08 / COM-11 Coraza atacameña de cuero de caimán`: cotejo con `defensa-05 Coraza de Lasana—Alto Loa` por objeto/material. Las denominaciones y las referencias iconográficas no acreditan igualdad; **sin merge**.
- `DEF-01/02/03/06/07/09`: ningún par exacto acreditado con las ocho fuentes; siguen siendo **candidatos independientes**, no se crea ficha vacía para ellos.
- `COM-09 Tañaña`: catálogo indica pieza aprobada, pero **falta el binario final de referencia**. No dibujar ni regenerar.
- Las ocho fotografías/ilustraciones nuevas COM registradas en `manifests/defensas-assets.json` **no están disponibles como binarios verificables en el ZIP 0.4.75 ni en los archivos de trabajo actuales**. No alegar cotejo visual de dos versiones. La falta de binario impide reemplazo/migración final, aunque existan SHA catalogados.

## 4. Estado técnico / decisiones

1. **Flora:** fuente optimizada intacta y rescate coincidente 48/48, pero no equiparar a original gráfico aprobado de etapa anterior sin recuperar el binario que produzca el SHA declarado. Los 40 IDs Foundry ya validados en `source/territorios/flora/foundry-id-map.json` permanecen como identidad canónica; no duplicar fichas por Territorio.
2. **Defensas:** conservar ocho originales. Los 9 códigos nuevos no implican nueve altas todavía. Solicitud autoral cubre la expansión; aprobación visual y procedencia de cada binario no se sustituyen con aproximaciones.
3. **QA5:** instalado y funcional; no tocarlo. No crear un paquete nuevo para Forge mientras estas identidades/activos estén abiertos.
4. **Próximo trabajo:** buscar la fuente original de 40 iconos que coincida con `sha256_webp`, o documentar de manera expresa la versión optimizada como nueva fuente técnica pendiente de aprobación. Para DEF, recuperar fichas/descripciones del catálogo y los 8 COM originales, primero los tres solapamientos.

**Decisiones:** identidad documental y hash tienen prioridad sobre parecido nominal o visual. **Pendientes:** procedencia histórica de hashes, recuperación aprobada COM, fondo Flora definitivo. **Fuentes:** ZIP 0.4.75, ZIP de rescate 2026-11-23, manifiestos/repositorio anteriores. **Estado Maestro, main, Bridge, Forge, H6/H7:** sin modificaciones.
