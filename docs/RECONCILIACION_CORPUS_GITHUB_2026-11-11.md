# Reconciliación de corpus — actualización del compendio GitHub

Fecha: 2026-11-11  
Rama: `work/native-compendia-pipeline`  
Alcance: exportación Forge Hipera 5, fuentes JSON recuperadas, módulo nativo v1.0.0 y staging v08.

## 1. Fuentes y autoridad

- La exportación `ForgeVTT-export-hipera-5-2026-11-10_22_21_14.zip` es la fuente primaria recuperada del mundo Hipera 5 (Foundry 14.367 / CSB 6.0.2).
- `HIPERAUSTRALIS_COMPENDIOS_v1.0.0_FORGE.zip` es una distribución compilada posterior, con integraciones v08. No contiene fuentes editoriales legibles y no debe convertirse en fuente maestra.
- `INTEGRACION_ACTUALIZACIONES_HIPERA5_v08.zip` es staging de cambios trazables, no un módulo ni una importación directa.
- El PR #1 sigue siendo un prototipo CI de tres fixtures; no contiene el corpus real.

## 2. Reconciliación de conteos

| Pack | Fuente recuperada | Build v1.0.0 |
|---|---:|---:|
| Personajes (Actor) | 4 | 4 |
| Journals (JournalEntry) | 6 documentos / 3.866 páginas | 6 documentos / 97 páginas |
| Adversarios Mapuche (Actor) | 20 | 20 |
| Equipo e instrumentos (Item) | 135 | 145 |
| Naturaleza (Item) | 98 | 98 |
| Bestiario (Actor) | 48 | 48 |
| Territorio (JournalEntry) | 32 carpetas / 0 documentos | 32 carpetas / 0 documentos |

Los conteos de Actors e Items de Naturaleza coinciden. En Equipo e instrumentos, la diferencia de 135 a 145 concuerda aritméticamente con las integraciones v08: 7 Items ERH nuevos y 3 Items de equipo común nuevos. Además se documentan 20 instrumentos existentes y 3 Items comunes actualizados, preservando IDs.

## 3. Diferencias que requieren control

### Journals
La extracción recuperada contiene 6 Journals y 3.866 páginas; el build v1.0.0 registra 97 páginas. El informe v08 atribuye la reducción a la retención de 13 páginas de Presencias y exclusión de 3.770 páginas duplicadas. La diferencia debe reconciliarse Journal por Journal y página por página antes de declarar equivalencia semántica.

### Items
- Los 20 instrumentos existentes se actualizan por ID Foundry; no duplicar.
- Siete instrumentos nuevos: dos Selk’nam aprobados visualmente y cinco candidatos Norte Costero. Mantener estados diferenciados.
- COM-01..06: tres Items comunes existentes actualizados y tres nuevos; no inferir equivalencias por nombre genérico.
- Campana piramidal / Campana Lickanantay conserva el nombre instalado mientras no exista aprobación editorial para renombrar.
- Arpa de boca nórdica queda fuera del runtime operativo por defecto técnico pendiente.

### Actors y cultura
- Cuatro perfiles Turianos figuran como actualizados y una página cultural añadida en el build v1.0.0.
- No crear la categoría heredada «Gorilescos».
- POPR sigue pendiente de prueba Foundry; SANGU no se incluye porque falta el master original.

### Assets y autonomía
El manifiesto v1.0.0 declara dependencia obligatoria de `hiperaustralis-rituales`. El inventario de origen también contiene rutas runtime bajo `modules/hiperaustralis-rituales/assets/...`. La distribución actual no es autónoma. No desinstalar ni sustituir el módulo antiguo hasta copiar, verificar y probar todos los recursos.

## 4. Dictamen de migración a GitHub

1. No copiar el ZIP LevelDB v1.0.0 como fuente canónica.
2. No usar directamente los JSON recuperados como versión final: Journals e Items tienen cambios posteriores.
3. Construir fuentes GitHub legibles mediante reconciliación controlada: extracción primaria + reparación de Journals aceptada + cambios v08 trazados por ID + manifiestos de assets y procedencia.
4. Mantener originales y staging intactos.
5. Separar `source/`, `assets/` y `manifests/`; generar LevelDB sólo durante CI.
6. Ampliar validadores declarativos y semánticos; conservar los tres fixtures actuales como regresión.
7. Mantener PR #1 abierto y aislado. No tocar `main`, Forge productivo ni MELIAZ Bridge.

## 5. Próximos lotes

- **A — Journals:** comparar extracción original, reparación v06 y build v1.0.0; generar mapa de páginas retenidas/excluidas y justificar cada exclusión.
- **B — Items:** reconciliar 145 documentos contra 135 originales y matrices ERH/COM por ID, campos, flags, iconos y rutas.
- **C — Actors:** reconciliar Personajes, Adversarios, Bestiario y Turianos por ID y payload.
- **D — Assets:** inventariar rutas, hashes, existencia, formato y dependencia del módulo antiguo.
- **E — GitHub:** serializar sólo fuentes aprobadas y manifiestos verificables; compilar desde catálogo declarativo.

## Registro

**Decisiones:** exportación Forge 10-11-2026 como fuente primaria; v1.0.0 como distribución integrada de referencia, no como fuente maestra; v08 como staging trazable.

**Pendientes:** reconciliación de Journals, validación de Items/Actors, inventario de assets, autonomía del módulo, fuentes legibles y QA Foundry runtime.

**Cambios al Estado Maestro:** ninguno.
