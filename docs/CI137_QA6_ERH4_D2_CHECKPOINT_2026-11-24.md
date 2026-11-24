# CI137 — QA6 ERH4: cuatro imágenes aprobadas integradas en paquete aislado

**Corte:** 2026-11-24 · **Rama aislada:** `work/ci137-qa6-erh4-isolated-20261124`  
**Módulo:** `hiperaustralis-compendios-prototype` · **Versión candidata:** `0.1.7-ci137qa.6`  
**Estado:** **D2 PASS / D3 PENDIENTE — NO INSTALAR en Forge ni sustituir QA5**.

## 1. Decisión y fuente exacta

El autor eligió «**la 2da opcion cada vez**» sobre cuatro comparativas históricas (izquierda) frente a imágenes ERH (derecha). La matriz de aprobación en `manifests/ci137-erh-cuatro-ambiguedades-aprobacion-20261124.json` registra IDs, SHA-256 y procedencia; las imágenes históricas no se borran.

| Instrumento | ID Item histórico, conservado | WebP ERH aprobado | SHA-256 |
|---|---|---|---|
| Arpa de boca | `j7J6wcAttET8rJpB` | `ARPA_BOCA_NORDICA_ERH_256.webp` | `eae0fbc7330c34bea7a66a147e2929c54bc43d0f820031887e56b799431d09b8` |
| Campana Lickanantay | `RzhInApxuwq1o651` | `CAMPANA_PIRAMIDAL_ERH_256.webp` | `d52d5af9ecaf3eb7586e5f55cb61b01d3a272b63b8e6f6d3fefb7a1231166cb2` |
| Cuerno musical nórdico | `INdG4JndLBl0sWto` | `CUERNO_MUSICAL_ERH_256.webp` | `fd4562fb1fb2a3dfcced879c9ee8e66c1b8cea3c594a45bc233c54d03e5e9e8b` |
| Flauta de hueso | `YfFAFtBpsdyU2l9R` | `FLAUTA_HUESO_ERH_256.webp` | `3f81addeee80ef03ea314e3b4887405d92cba2a12d893b4c7f6ef85ea51baa14` |

Se comprobó `RIFF`, tamaño binario, SHA y decodificación **WebP RGBA 256×256**. Los cuatro originales históricos son **512×512 RGBA**, preservados, con SHA también registrado.

## 2. Implementación mínima

La rama contiene un ensamblador nuevo, **opt-in y exclusivamente diagnóstico**: `tools/foundry/ci137_qa6_erh4_isolated.py`. Mantiene `module/module.json` en QA5 en fuentes; sólo cambia la versión a QA6 **en memoria al construir el ZIP**. No modifica `ci137_pipeline.py`, ningún archivo fuente Item, Bridge, Estado Maestro, `main`, Forge ni mundos H6/H7.

Secuencia ejecutada en Actions:
1. Recompilar base canónica de **136 Items / 9 carpetas** usando pipeline actual, Actor y Journal originales.
2. Aplicar **exactamente cuatro diferencias `img`** a la copia preparada y añadir los cuatro WebP íntegros en `assets/instrumentos/`.
3. Demostrar que todos los demás `_id`, nombres, `system.template`, `system.props`, flags, efectos, ownership y campos de los **otros 132 Items** están intactos.
4. Verificar Arpa: Item `equippableItem`; plantilla `HipInstrTpl00001`; `system.props.hipera_tipo = instrumento`; `flags.meliaz-bridge.kind = instrumento`; WebP 256×256 RGBA decodificable.
5. Compilar tres LevelDB frescos con `@foundryvtt/foundryvtt-cli@3.0.5`, desempaquetar y validar las identidades y campos.
6. Excluir registros volátiles LevelDB `LOCK`, `LOG`, `LOG.old` y archivos `.log` no persistentes, conservando `CURRENT`, `MANIFEST` y SST; reabrir **el ZIP final** otra vez con la CLI.
7. Confirmar 48 WebP (**44 byte a byte idénticos a la base QA5 + cuatro autorizados**) y sin scripts ni ZIP anidados.

**Resultado final:** [GitHub Actions #45477919784](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45477919784) **PASS**. Un ensayo anterior [#45477785037](https://github.com/ElIgnacioCampos/Hiperaustralis/actions/runs/45477785037) detectó un `LOG.old` no vacío y fue bloqueado; la depuración siguió la política del saneador QA5, descartando registros de servicio y conservando datos durables. El segundo ensayo reabrió los tres packs y pasó.

## 3. Archivo y trazabilidad

- **ZIP directo candidato:** `HIPERAUSTRALIS_CI137_QA6_ERH4_AISLADO_NO_INSTALAR.zip`.
- **Bytes:** `2.801.791`.
- **SHA-256:** `bd61d913c76c827ba389dd4e6742de82478fcaf0859a44b7554d3c28d2676420`.
- **60 miembros**, **CRC PASS**; raíz `module.json`, tres packs de Item/Actor/Journal, 48 WebP, dos archivos QA descriptivos, ninguna carga automática.
- **Resultados:** `CI137_QA6_ERH4_D2_REPORT.json`, `CI137_QA6_4ERH_IMG_ONLY_AUDIT.json`, `CI137_QA6_V14_ID_GATE.json`.
- **Artefacto de Actions:** `CI137-QA6-4ERH-AISLADO-NO-INSTALAR`, ID `14959249267`; paquete de conversación descargable `CI137_QA6_ERH4_AISLADO_D2_20261124.zip`.

## 4. Balance de cambios

| Indicador | QA5 estable | QA6 aislada |
|---|---:|---:|
| Items | 136 | 136 |
| Carpetas Item | 9 | 9 |
| Actor / Journal / páginas | 1 / 1 / 21 | 1 / 1 / 21 |
| Imágenes WebP de módulo | 44 | 48 |
| Remapeos ERH de Instrumentos incluidos | 6 | 10 |
| Referencias gráficas heredadas | 99 | 95 |
| Items con cambio semántico/reglístico | 0 | 0 |
| Prueba D3/Forge | QA5 previamente funcional | **Pendiente** |

## 5. Decisiones / Pendientes / Fuentes / Maestro

**Decisiones:** aprobar los cuatro ERH como imágenes finales para sus Items; preservar identidades, nombres, descripciones y alternativas históricas; QA6 aislada sólo para prueba técnica, no promocionada.

**Pendientes:** probar carga, miniatura, hoja y **drag-and-drop de Arpa de boca**, Campana, Cuerno y Flauta en un entorno de Foundry separado que no sobrescriba el módulo estable de Forge; verificar persistencia tras reinicio. La discrepancia territorial FFF/Recetas y la ampliación de familias están en otro frente de la misma rama, sin modificar QA6. Permanecen **95 referencias gráficas heredadas**.

**Fuentes:** aprobación explícita del usuario, `manifests/ci137-erh-cuatro-ambiguedades-aprobacion-20261124.json`, `manifests/ci137-selected-source-137-historical-ids.json`, fuentes instrumentales originales/ERH WebP, workflow y logs de Actions #45477919784.

**Cambios al Estado Maestro:** ninguno. `main`, QA5 instalada, Forge, H6, H7 y MELIAZ Bridge: **intactos**.
