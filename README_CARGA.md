# LOTE GITHUB — ASSETS AUDITADOS v01

Destino: `ElIgnacioCampos/Hiperaustralis`
Rama: `work/native-compendia-pipeline`

## Qué contiene
Binarios de Equipo, Defensas, Instrumentos ERH, Turianos y Tokicura, extraídos de paquetes auditados. Los duplicados exactos por SHA-256 se almacenan una sola vez.

## Importante
- Tokicura es el único archivo con ruta runtime ya referenciada por un Item fuente comprometido.
- El resto queda en `module/assets/_staging/`; NO cambiar referencias ni promover a runtime todavía.
- No reemplazar JSON ni manifests que ya existen en la rama.
- No incluye DEF-06/COM-09 Tañaña (binario aprobado no recuperado).
- No incluye candidatos Turianos Sangu ni Popr.
- Los estados y hashes por archivo están en `TRANSFER_MANIFEST.json`.

## Carga
Extraer el ZIP y cargar su contenido conservando las rutas desde la raíz del repositorio. No subir el ZIP como si fuera un asset runtime.
