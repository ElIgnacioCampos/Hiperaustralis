# MELIAZ Bridge — flujo GitHub → Foundry → Forge

## Objetivo
Mantener GitHub como fuente versionada, producir desde allí un ZIP instalable y probarlo en un mundo aislado de Foundry alojado en Forge antes de promoverlo.

## Rama de integración limpia
- Rama: `work/meliaz-bridge-0.24.203-clean`
- Base: `main`
- No fusionar ramas experimentales completas.
- No incorporar el pipeline de compendios nativos.
- No incorporar contenidos de turianos en esta etapa.
- La rama anterior `work/meliaz-bridge-0.24.203-audit` queda como fuente de recuperación, no como destino de integración.

## Alcance de archivos

Se integrarán los archivos de Bridge y los recursos gráficos que el código de ejecución referencia. Quedan fuera de esta etapa los recursos no referenciados por el runtime: familiares exóticos, mascotas, originales PNG de tokens, tokens PJ-041 a PJ-052, hoja Kona anterior y el archivo fuente de animalitos. Se conservan en la rama de recuperación para una decisión posterior.

## Flujo de trabajo

1. **Preparar el módulo:** trasladar a `module/meliaz-bridge/` sólo los archivos aprobados para MELIAZ Bridge 0.24.203.
2. **Validar en GitHub Actions:** comprobar `module.json`, versión, archivos declarados y sintaxis JavaScript.
3. **Empaquetar:** generar ZIP con el contenido de `module/meliaz-bridge/` en la raíz del archivo, incluyendo `module.json`.
4. **Verificar:** probar integridad ZIP y calcular SHA-256.
5. **Descargar artefacto:** Actions conserva el ZIP y su checksum por 30 días.
6. **Instalar en Forge de prueba:** importar el ZIP en un mundo aislado; no actualizar producción.
7. **QA runtime:** Foundry V14 + Custom System Builder 6.0.2; completar `QA_RUNTIME_0.24.203_FORGE.md`.
8. **Promover:** abrir PR hacia `main` sólo tras QA aprobado. La fusión y la distribución productiva son pasos separados.

## Límites de seguridad
- No modificar ni sustituir `hiperaustralis-rituales` (si el ID canónico difiere, conservar el valor del manifiesto vigente).
- No tocar el mundo productivo ni sus actores.
- No borrar datos heredados de Kona.
- No mezclar Bridge con el prototipo de compendios.
- No dar por aprobado el runtime por el solo hecho de que Actions pase.

## Criterios de aceptación del paquete
- `module.json` en la raíz del ZIP.
- ID `meliaz-bridge`.
- Versión coincidente con el manifiesto.
- Archivos JS sin errores de sintaxis.
- ZIP íntegro y checksum disponible.
- QA de Forge aprobado antes de la promoción.
