# CORE — MELIAZ LAB D3-001: instalación visible en Setup, no en mundo

**Corte:** 2026-11-24. **Estado:** incidencia abierta; diagnóstico estático PASS, runtime sin evidencia. **Alcance:** rama LAB exclusivamente. Nada de H6/H7, Bridge estable, CI137 QA5/QA6, main ni Maestro.

## Incidencia observada
El usuario subió `MELIAZ_BRIDGE_LAB_0.24.204_NO_H6_H7.zip`; el paquete se muestra disponible en Setup, pero el mundo no lo reconoce y Setup indica ausencia de manifest URL.

## Verificaciones forenses
- Paquete SHA-256 `6e6001d3b99fd4621e366838af592dd86acc7cc1cbfb9ecabb8cd4fe042da9c8`, 5.004.440 B, 63 archivos, CRC PASS.
- Contiene `module.json` válido en raíz, `id=meliaz-bridge-lab`, `version=0.24.204-lab.0`, dos scripts ES y 40 WebP Kona.
- `node --check bridge.js` y `node --check kona-token-icons.js`: PASS en inspección independiente.
- El builder `tools/foundry/meliaz_bridge_lab_build.py` **elimina expresamente** `manifest` y `download`; el workflow publica sólo un artefacto de Actions, **no una release ni un manifiesto accesible**. No existe URL de actualización para esta versión.
- Foundry considera opcionales esas URL; su ausencia no demuestra por sí misma la imposibilidad de activar un módulo instalado localmente.
- `compatibility.minimum=14.370`; CSB mínimo 6.1.2; SocketLib obligatorio. H7 consta en Foundry 14.370 / CSB 6.1.2.
- `relationships.conflicts` declara `meliaz-bridge`. Ambos JS impiden registrar hooks si el original está activo. El objetivo es evitar coactivación, nunca habilitar LAB en H6/H7.

## Hipótesis abiertas (no declarar causa sin runtime)
1. El mundo no recibió la actualización del módulo por falta de **reinicio de servidor** tras importación Forge.
2. ZIP importado como assets y no como módulo de Game Data.
3. LAB figura en `game.modules` pero está inactivo, hay incompatibilidad de versión, falta SocketLib o conflicto con original.
4. La carpeta del módulo o su ID no coincide con `meliaz-bridge-lab`.

## Procedimiento de solo lectura
**En una COPIA del mundo exclusivamente:**
1. Reiniciar servidor Forge después de instalar el ZIP como módulo.
2. Confirmar Foundry 14.370+, CSB 6.1.2+ y SocketLib.
3. En el mundo clonado, GM → F12 → consola:
```js
(() => {
 const ids=["meliaz-bridge","meliaz-bridge-lab","socketlib"];
 console.log("Foundry",game.version,"Sistema",game.system?.id,game.system?.version);
 console.table(ids.map(id=>({id,instalado:!!game.modules?.get(id),activo:game.modules?.get(id)?.active??false,version:game.modules?.get(id)?.version??"—"})));
})();
```
4. Si LAB no está en `game.modules`: revisar la importación y reiniciar; no se soluciona cambiando arbitrariamente `manifest`.
5. Si LAB está pero inactivo y el original activo: desactivar original **sólo en el clon**; activar LAB y comprobar SocketLib.
6. Antes de DnD y pruebas de Kona, capturar snapshot de Actor duplicado (`system.props`, `flags`, Items); el arranque LAB puede escribir datos.

## Decisiones y puertas
**Decisiones:** conservar el ZIP D2 comprobado; no alterar por ahora sus tres archivos de ejecución ni la versión; no promocionar.  
**Pendientes:** diagnóstico runtime de `game.modules`, reinicio, dependencias y activación; QA D3 completo y pruebas A–F.  
**Fuente:** ZIP exacto del usuario, builder/workflow LAB, checkpoint `MELIAZ_BRIDGE_LAB_ESTADO_Y_PENDIENTES_2026-11-24_v01.md`, documentación Foundry y The Forge.  
**Estado Maestro:** sin cambios.
