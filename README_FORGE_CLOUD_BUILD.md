# Compilación cloud y despliegue en Forge

GitHub Actions compila las fuentes JSON con la CLI oficial de Foundry VTT. Forge sólo recibe el ZIP ya compilado; no transforma fuentes JSON en LevelDB.

## Flujo

1. GitHub Actions valida fuentes y manifiesto.
2. Foundry CLI compila tres packs nativos.
3. Foundry CLI desempaqueta cada pack para una prueba de ida y vuelta.
4. Se construye el ZIP con `module.json` en la raíz.
5. Se publica el ZIP y su SHA-256 como artefacto.
6. El ZIP se importa en un mundo de prueba de Forge, nunca directamente en el mundo productivo.

## Salvaguardas

- ID independiente: `hiperaustralis-compendios-prototype`.
- No sustituye `hiperaustralis-rituales`.
- No modifica MELIAZ Bridge.
- No migra ni borra compendios de mundo.
- La muestra no es una migración integral.
- La aprobación final requiere abrir los tres packs en Foundry V14 + CSB 6.0.2.
