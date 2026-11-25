# CI137 QA7 — discrepancia de assets · 25-11-2026
## Evidencia
Captura de autor confirma QA7 0.1.7-ci137qa.7 activo, tres packs visibles, Bridge LAB 0.24.206-lab.2. Autor señala que Piloilo, Yapo y Chop Chop y otros no muestran actualizaciones esperadas. No atribuir sin prueba a caché, copia antigua o error de instalación.
## Lectura independiente
Se leyeron bloques SST LevelDB (índice, entradas con prefijo y Snappy) de los ZIP físicos QA5 y QA7. 168 registros en cada uno, claves idénticas, exactamente 24 cambios img, ningún otro campo cambiado. 136 Items. QA5: 24 img propias CI137, 72 img legadas, 40 otras. QA7: 48 propias, 68 legadas, 20 otras. Cero rutas img propias sin archivo dentro de sus respectivos ZIP. No confundir 68 referencias img con 95 referencias incluyendo fondos.
- Piloilo KpK5mqDdleRnemjh: ambos ZIP apuntan a modules/hiperaustralis-compendios-prototype/assets/instrumentos/piloilo_erh_256.webp; QA7 binario SHA256 44fe741c96bbcdc185fe45b225dbf4aa13764d2abc039539eb8ad207cef81fe4, coincide con aprobación. Por tanto no es cambio nuevo de QA7 y su discrepancia reportada requiere diagnóstico runtime.
- Chope · Desconchador Cal0I8l96tdRm1pR permanece con icono Foundry en ambos ZIP; es uno de los 9 cruces no promovidos, no identificar automáticamente con Chop Chop.
- No hay Yapo ni Chop Chop ni variantes de este último en los registros de QA7 inspeccionados. Recuperar fuentes exactas fuera del corpus 136 antes de concluir identidad. No asignar IDs por inferencia.
## Acción
Diagnóstico read-only de pack, copias mundo/Actor, URL y bytes servidos de Piloilo; contrastar 24 remapeos reales de QA7. Luego inventario global aprobado vs empacado vs servido. No regenerar ni sustituir imágenes por nombre. Mantener Maestro y mundos intactos.
## Frente separado
Mascota/Familiar: al crear token Kona, crear token asociado con escala correcta, seguimiento y persistencia sin duplicaciones. Requiere recuperar contrato y catálogo de Compañeros antes de implementar. No mezclar con CI137.
