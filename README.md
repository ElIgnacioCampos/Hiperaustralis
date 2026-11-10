# Hiperaustralis — implementación Foundry

Repositorio de trabajo técnico del módulo Hiperaustralis para Foundry VTT.

## Estado inicial

- Repositorio identificado: `ElIgnacioCampos/Hiperaustralis`.
- Rama: `main`.
- El repositorio estaba vacío al iniciar esta recuperación.
- El prototipo nativo de compendios existe como fuente local de trabajo, pero **todavía no contiene packs LevelDB compilados ni ha sido probado dentro de Foundry V14**.

## Líneas de trabajo

1. `prototype/native-compendia/`: prototipo aislado de packs nativos.
2. `module/`: módulo instalable sólo después de compilar y validar los packs.
3. `source/`: fuentes JSON canónicas para la compilación.
4. `.github/workflows/`: automatización de validación y compilación en GitHub Actions.

## Salvaguardas

- No reemplazar el módulo productivo `hiperaustralis-rituales`.
- No modificar MELIAZ Bridge.
- No borrar ni migrar los compendios `world.*` existentes.
- No desplegar en el mundo productivo.
- Todo paquete compilado debe superar validación de fuentes, compilación, desempaquetado de control y prueba en un mundo Foundry aislado antes de considerarse candidato.

## Primer hito

Revisar y subir el prototipo de tres documentos (Item, Actor y JournalEntry), corregir su pipeline si corresponde y producir un artefacto de prueba. La compilación en GitHub Actions y la carga en Forge son etapas separadas.
