# Auditoría de inventario Foundry — 2026-11-14

## Fuente

- Archivo: `HIPERAUSTRALIS_FOUNDRY_ITEMS_2026-11-14T16-15-55-624Z.json`
- SHA-256: `e30ab288ff0307d13a2b5e8036657ac0fecf3d3a5e5d29fd8ae0f594b3d67c9b`
- Tamaño: 2,013,399 bytes
- Mundo: **Hipera 5** (`hipera-5`)
- Foundry: **14.367**
- Sistema: **custom-system-builder 6.0.2**
- Exportación: 2026-11-14T16:15:55.624Z
- Errores reportados por macro: **0**

## Recuento

| Origen | Items |
|---|---:|
| Mundo (`game.items`) | 320 |
| `world.hiperaustralis-rituales` | 135 |
| `world.hiperaustralis-naturaleza-items` | 98 |
| `world.armas` | 40 |
| **Total exportado** | **593** |

Los 135 Items históricos del compendio `hiperaustralis-rituales` están presentes. El total de 593 no representa 593 fuentes canónicas independientes: incluye copias del mundo y los compendios.

## Distribución de los 135 Items del compendio histórico

| Carpeta | Items |
|---|---:|
| Armas | 20 |
| Defensas | 8 |
| Equipo común | 40 |
| Instrumentos musicales | 21 |
| Parafernalia · sanación · cultura material | 22 |
| Reliquias cotidianas | 8 |
| Reliquias legendarias | 8 |
| Rituales | 8 |

La distribución corresponde a ocho carpetas previstas.

## Duplicación de documentos entre mundo y compendios

- UUID repetidos: **0**.
- `_id`/`documentId` repetidos entre ámbitos: **81** grupos.
- Los 81 grupos corresponden a pares mundo/compendio con el mismo `_id`: 41 de Naturaleza y 40 de Armas. La diferencia de UUID se debe al contexto (mundo vs compendio), no a una colisión UUID.
- En los 41 pares de Naturaleza, el contenido queda idéntico al excluir `_stats` y `system.uniqueId` (el duplicado de mundo tiene `uniqueId` rellenado; el compendio lo conserva vacío).
- En los 40 pares de Armas, además de `_stats`, difieren `folder` y `sort`: las copias del mundo están organizadas en `Hiperaustralis - Assets/Armas`, mientras el compendio no tiene carpeta interna.
- Conservar `sourceScope` y `sourcePack` al reconciliar. No deduplicar únicamente por nombre ni tratar los 593 registros como 593 entidades canónicas.

## Observaciones estructurales

- Los 135 Items de `hiperaustralis-rituales` tienen carpeta asignada y sus rutas de imagen apuntan a `modules/hiperaustralis-rituales/assets/...`.
- El compendio `world.armas` exporta sus 40 Items sin `folderPath` de compendio; sus copias del mundo están bajo `Hiperaustralis - Assets/Armas`.
- El mundo contiene 320 Items: 311 `equippableItem`, ocho plantillas `_equippableItemTemplate` y un `activeEffectContainer`.
- La exportación contiene 11 carpetas Item del mundo.
- El exportador no incluyó Actors (`actorDocuments: false`); la reconciliación de Turianos requiere un export independiente.

## Decisiones de migración

1. Tomar `world.hiperaustralis-rituales` como fuente primaria del lote histórico de 135 Items, sin alterar sus IDs hasta aprobar estrategia de migración.
2. Mantener `world.hiperaustralis-naturaleza-items` y `world.armas` como fuentes separadas; reconciliar sus copias del mundo antes de decidir qué pack será canónico.
3. No importar los 320 Items del mundo como nuevos documentos sin comparar sus payloads con los compendios.
4. No modificar rutas runtime ni publicar cambios en Forge en esta fase.
5. Ejecutar export separado de Actors para Turianos y demás entidades que correspondan.

## Pendientes

- Comparación campo por campo de los 40 pares de Armas, para confirmar que `folder` y `sort` son las únicas diferencias de contenido además de metadatos.
- Auditoría de `flags`, `system`, `_stats`, `img` y referencias UUID de los 135 Items.
- Definir estructura canónica de packs y carpetas para la migración GitHub.
- Exportar Actors para reconciliar Turianos.
- QA visual/funcional en Foundry V14 + CSB 6.0.2.

## Estado de integración

- Este informe documenta la fuente recibida; no modifica el mundo Foundry ni el módulo productivo.
- Rama de trabajo: `work/native-compendia-pipeline`.
- `main` y el Estado Maestro permanecen sin cambios.
