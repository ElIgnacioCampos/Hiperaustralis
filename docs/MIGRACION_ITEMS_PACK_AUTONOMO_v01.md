# Migración del pack histórico de Items — inventario fuente

Estado: inventario verificado; migración de contenido a GitHub pendiente.
Rama: `work/native-compendia-pipeline`.
Fuente: exportación recuperada de Forge Hipera 5, pack `world.hiperaustralis-rituales`.
Fecha de cotejo: 2026-11-11.

## Hallazgo estructural

El pack histórico no es un compendio exclusivamente ritual. Su etiqueta era `Hiperaustralis - Assets`, tipo Foundry `Item`, sistema `custom-system-builder`. Contiene 135 documentos y ocho carpetas raíz. Los 135 `_id` son únicos y están presentes.

| Carpeta histórica | Documentos |
|---|---:|
| Armas | 20 |
| Defensas | 8 |
| Equipo común | 40 |
| Instrumentos musicales | 21 |
| Parafernalia · sanación · cultura material | 22 |
| Reliquias cotidianas | 8 |
| Reliquias legendarias | 8 |
| Rituales | 8 |
| **Total** | **135** |

Los conteos se obtuvieron agrupando los documentos por su `folder` y cruzando cada ID de carpeta con el inventario jerárquico recuperado. No se infirieron categorías a partir del nombre de los Items.

## Decisión de migración

- Pack de destino propuesto: `hiperaustralis-objetos`.
- Tipo Foundry: `Item`.
- Etiqueta propuesta: `Hiperaustralis · Objetos, equipo y rituales`.
- Conservar los 135 `_id` originales.
- Conservar los payloads nativos, flags y campos de sistema; cualquier normalización debe ser explícita y cotejada.
- Preservar las ocho carpetas como subcarpetas internas del pack destino.
- Guardar el mapeo de IDs de carpetas históricas a rutas editoriales nuevas.
- Trasladar los recursos al directorio propio del módulo nuevo y reescribir todas las rutas runtime.
- El módulo final no debe declarar ni necesitar `hiperaustralis-rituales`.

## Estructura de fuente propuesta

```text
source/items/
  armas/
  defensas/
  equipo-comun/
  instrumentos-musicales/
  parafernalia-sanacion-cultura-material/
  reliquias-cotidianas/
  reliquias-legendarias/
  rituales/
```

La estructura de carpetas de fuente no cambia el tipo nativo Foundry ni los IDs de los documentos.

## Pendientes técnicos antes de compilar

1. Ingresar los 135 documentos íntegros en `source/items/` como fuentes legibles y versionables.
2. Añadir un manifiesto con ID original, carpeta original, ruta nueva y hash de fuente.
3. Integrar las actualizaciones ERH/COM ya cotejadas, sin duplicar IDs ni pisar contenido no relacionado.
4. Inventariar cada `img` y cada referencia de asset de los 135 documentos.
5. Copiar recursos al módulo nuevo, verificar SHA-256 y reescribir rutas.
6. Adaptar preparación Foundry CLI para recorrer fuentes recursivamente y generar `_key` de carpeta de destino sin alterar las fuentes canónicas.
7. Round-trip semántico: comparar cada documento compilado con su fuente, incluyendo sistema, descripción, flags, efectos, imagen, carpeta e ID.
8. Verificar cero referencias runtime a `modules/hiperaustralis-rituales/` y cero dependencia declarada del módulo antiguo.
9. Probar instalación en mundo Foundry aislado sin el módulo antiguo.

## Salvaguardas

No se modifica `main`, no se fusiona PR #1, no se instala en el mundo productivo y no se toca Bridge ni el módulo estable. El pack antiguo permanece como respaldo hasta completar QA y recibir autorización explícita.

## Criterio de cierre

La migración de Objetos se considera completa sólo cuando los 135 documentos (más las integraciones aprobadas) y todos sus recursos están en GitHub bajo fuentes legibles, el pack autónomo compila y supera round-trip y runtime QA sin el módulo antiguo.
