# Actualización de assets — lote Turianos / Instrumentos / Equipo / Tokicura

Estado: **inventario y plan de integración registrados; binarios aún no incorporados al árbol Git**.

Lote recibido: `HIPERAUSTRALIS_ASSETS_UPDATE_TURIANOS_INSTRUMENTOS_EQUIPO_TOKICURA_v01.zip`
- 80 entradas en el ZIP, 7,453,454 bytes descomprimidos.
- Incluye manifiesto SHA-256.
- Turianos: 4 tokens principales de 512 px, 4 variantes de actualización duplicadas por hash y 2 candidatos POPR (WebP y PNG).
- Instrumentos: recursos históricos/normalizados y 7 incorporaciones ERH nuevas; mantener separadas las variantes aprobadas y candidatas.
- Equipo común: 6 recursos Foundry 256 y sus 6 nombres ERH correspondientes; cada pareja coincide por SHA-256.
- Tokicura: `assets/reliquias-legendarias/tokicura_256.webp`, 27,972 bytes, SHA-256 `74a11a097d3c90cb42337a40a30247b799d5007a60403d654bc320759ebd9c2a`.

## Reglas de integración
1. No crear duplicados cuando dos rutas tienen el mismo SHA-256; registrar alias/ruta canónica.
2. Mantener los cuatro tokens Turianos existentes como lote principal; POPR permanece en candidatos hasta aprobación editorial.
3. Integrar los recursos ERH nuevos de instrumentos sin reemplazar originales con distinto contenido.
4. Para Equipo común, conservar un único archivo físico por hash y mapear las rutas históricas.
5. Tokicura reemplaza la imagen de origen en Reliquias Legendarias; formato destino WebP RGBA 256×256.
6. Actualizar referencias runtime sólo después de que los binarios existan en el repositorio y comprobar que no dependan de `hiperaustralis-rituales`.

## Pendiente técnico
El conector GitHub disponible permite escribir blobs de texto/base64, pero no puede leer adjuntos locales ni cargar ZIP binarios directamente. Por tanto, este commit no declara assets migrados. Requiere una vía de carga binaria al repositorio para completar la incorporación y validar hashes.
