# MELIAZ Bridge 0.24.190 — Normalización inicial Foundry V14

- Se conserva la lógica y los recursos de 0.24.188.
- El arranque deja de ejecutar automáticamente `migrateHiperaGameplayDocuments()`.
- La auditoría de módulos relacionados permanece en `ready` y es de sólo lectura.
- La migración sigue disponible de forma explícita mediante `meliazBridgeRunCleanup()` para GM.
- No se declara `verified` hasta completar pruebas dentro de Foundry V14 + CSB 6.0.2.

Esta versión no acredita todavía compatibilidad funcional completa.
