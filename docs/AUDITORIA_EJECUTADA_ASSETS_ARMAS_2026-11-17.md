# Auditoría ejecutada — assets de Armas

Fecha: 2026-11-17  
Rama: `work/native-compendia-pipeline`  
Commit auditado: `be98ed34e6e64a3f6bf27c7df2bfd7802011001a`  
Workflow run: [44149199153](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44149199153)  
Artefacto: `armas-source-audit` (ID `14356639650`)

## Resultado técnico

- Workflow: `completed / success`.
- El artefacto fue descargado y abierto localmente.
- ZIP fuente: `source/items/SOURCE_ITEMS_ARMAS_CORTE1_GITHUB.zip`.
- SHA-256 del ZIP: `4cda57760a1972b532307eb86d239d15dd1bbde924910ccea5103f8a7d802c8a`.
- Entradas: 22.
- CRC: extracción completada sin errores.
- Contenido: 20 JSON de Items de Armas, `manifests/armas-source-manifest.json` y `README.md`.
- Binarios gráficos: 0.
- Formatos de imagen encontrados: ninguno.

## Precisión sobre el manifiesto

Los campos `sha256` de `manifests/armas-source-manifest.json` coinciden con los hashes de los archivos JSON de cada Item, no con hashes de imágenes. El manifiesto registra la ruta esperada de cada WebP, pero no acredita la presencia ni integridad del binario gráfico. No deben usarse esos valores como hashes de assets.

## Conclusión

La herramienta de extracción funciona y el archivo de origen está íntegro, pero el ZIP disponible no contiene los assets visuales. No existe evidencia suficiente para poblar `module/assets/armas/`, establecer hashes de imágenes o reescribir las rutas `img` y `flags.hiperaustralis-sheet.background`.

Los 20 documentos conservan las rutas históricas al módulo antiguo. El Item independiente Cuchillo de piedra debe seguir cotejándose por separado; no forma parte de este lote de 20.

## Decisiones

1. Mantener intactos los 20 JSON y sus payloads.
2. No crear imágenes sustitutas ni derivar assets a partir de nombres.
3. No cambiar rutas hasta recuperar y cotejar los binarios originales.
4. Mantener PR #1 en draft; no modificar `main` ni Forge productivo.
5. Mantener Territorios fuera del alcance.
6. Tratar los SHA-256 del manifiesto sólo como hashes de JSON, no como hashes de imágenes.

## Pendientes

1. Localizar el paquete o directorio histórico que contiene las imágenes originales de Armas.
2. Cotejar cada binario por nombre, dimensiones, formato y SHA-256 con sus Items.
3. Incorporar sólo assets acreditados a `module/assets/armas/`.
4. Extender `validate_sources.py` para detectar dependencias del módulo antiguo y rutas inexistentes.
5. Repetir CI y revisar runtime en Foundry V14.

## Fuentes y evidencia

- Workflow y artefactos: [Actions run 44149199153](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/44149199153).
- Archivo de auditoría generado: `ARCHIVE_AUDIT.json`.
- Manifiesto: `manifests/armas-source-manifest.json`.
- README incluido en el ZIP: `source/items/armas/README.md`.

## Cambios al Estado Maestro

Ninguno. Este documento registra una auditoría de implementación en la rama de trabajo; no modifica el Estado Maestro ACTUAL.
