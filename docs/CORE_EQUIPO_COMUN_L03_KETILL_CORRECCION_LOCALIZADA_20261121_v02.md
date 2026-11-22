# HIPERAUSTRALIS — CORE / Equipo común
## L03 · Ketill / corrección localizada sin patas — v02
**Fecha de continuidad:** 2026-11-21 · **Estado:** CANDIDATO CORREGIDO · NO INTEGRADO FOUNDRY

### Motivo y autoridad
- La lámina 2×2 del lote 03 fue **aprobada** por el usuario; la auditoría individual propuso corregir únicamente las tres patas integradas del **Ketill · Caldero**.
- El usuario respondió **«ok»**, por tanto autoriza ejecutar esa corrección puntual. No autoriza rediseñar las otras tres piezas ni alterar Foundry productivo.
- La solución elegida conserva exactamente los píxeles del objeto previamente aprobado por encima de la línea 360 del PNG 512 y elimina los tres soportes bajo el cuerpo usando un recorte curvo con transparencia. **No es una recreación completa del caldero**. Una prueba alternativa reconstruida no se utilizó como fuente final.

### Identidad
- Item: **Ketill · Caldero** (Nórdicos).
- Compendio histórico: `world.hiperaustralis-rituales`.
- Item ID: `PmTYfMVymolkOvkq`.
- Tipo: `equippableItem`; plantilla `HipEquipTpl00001`.
- `img` actual en export 2026-11-19: `icons/tools/cooking/cauldron-empty.webp`.
- Sin cambios en `img`, reglas, IDs, carpeta, `flags` o `system`.

### Entrega y respaldo
**BBTECA verificada:** `/Hiperaustralis/CORE/IMPLEMENTACION/FOUNDRY/EQUIPO_COMUN/HIPERA_EQUIPO_COMUN_L03_KETILL_SIN_PATAS_v02_CANDIDATO.zip`.

**ZIP SHA-256:** `02a6acf388eb4183852382194ba543fe29583c4190b37ff0d629fecc834d42ab`.
**PNG master 512:** `EQ_NOR_KETILL_CALDERO_L03_v02_SIN_PATAS.png`, SHA-256 `4647cb95ea2c0f15565e8c28bd02fbf21e1804317d38d3044fe127dd1af69f78`.
**WebP lossless 256:** `EQ_NOR_KETILL_CALDERO_L03_v02_SIN_PATAS.webp`, SHA-256 `4c79bac67c39c0a128e681fe499f450605d788af725efca266980132bb22fb23`.
**Fuente maestra original, inalterada:** `EQ_NOR_KETILL_CALDERO_L03_v01_APROBADA.png`, SHA-256 `985cd825cdd6646353925d691546ccc21e644063afe55a101461a117f87ad679`.

Se incluye copia exacta del master anterior, manifiesto JSON y comparaciones sobre fondos claros/oscuros. El ZIP original `HIPERA_EQUIPO_COMUN_L03_APROBADOS_AUDITORIA_v01.zip` permanece independiente y conservado. Witrü, Q'ipi y Canasto Lickanantay **no se tocaron**.

### QA realizado y límites
- Sí: dimensiones 512/256, WebP lossless, transparencia real, ZIP CRC, SHA-256, preservación de fuente, comparación antes/después.
- Sí: inspección visual confirma que las tres patas ya no aparecen y que se conserva el cuerpo remachado con asa.
- No: QA de carga dentro de Foundry aislado; no se modifican rutas runtime.
- La corrección es **CANDIDATO v02** hasta que sea ratificada visualmente. La aprobación general del lote 03 no se extiende automáticamente a una versión distinta del Ketill.

### Cierre
**Decisiones:** retirar únicamente los pies del Ketill; mantener los restantes tres ítems del lote 03 aprobados e inalterados.
**Pendientes:** aprobar v02 sobre la comparación, QA de carga en Foundry aislado, decisión de promoción gráfica.
**Fuentes:** lámina fuente L03 aprobada y auditoría individual `docs/CORE_EQUIPO_COMUN_LOTE03_AUDITORIA_INDIVIDUAL_20261121_v01.md`.
**Estado Maestro:** sin cambios; tampoco `main`, Bridge, compendio histórico ni módulo productivo.
