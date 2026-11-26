# LAB.6.2 — D3 parcial: Arma y Gracia

Autor, 25-11-2026: «Arma y gracia funcionan. pero gracia no tiene su icono aun».

- Arma: funcionamiento PASS reportado por autor.
- Gracia: funcionamiento PASS reportado por autor; icono pendiente. No implica aprobación de todos los casos de Porte ni de la barra LVDM.
- Diagnóstico sobre ZIP exacto LAB.6.2: `hiperaGraciaIcon` resuelve `modules/meliaz-bridge-lab/assets/gracias/${key}.webp`; `installKonaGraciaIcon` oculta el texto sólo si la imagen carga. No existe ningún miembro `assets/gracias/` en el ZIP. Fallback esperado.
- Lote ERH aprobado identificado en Biblioteca: `/Hiperaustralis/GRACIAS_ERH_OptimusWebP256_FOUNDry.zip` (80.007 bytes, `file_00000000a79c820eb8ae85356838f62f`), respaldo `GRACIAS_ERH_APROBADAS_2026-11-25.zip` (`file_000000003ed8820ebc02884425f10b62`). Recuperación de bytes denegada por superficie de proyecto; también falló respaldo PNG. No generar arte ni sustituirlo. Requiere ZIP autorizado/adjunto.
- Próximo parche estrictamente gráfico: cotejar originales aprobados, copiar WebP a `assets/gracias/pewma.webp`, `entonar.webp`, `franquear.webp`, `arremetida.webp`, comprobar alfa y carga. Preservar compatibilidad de clave Pewma vigente en Bridge; el cambio nominal Pewma Rüpü del CORE tiene expediente separado y no se integra en este parche.
- Código, versión estable, Maestro y compendio sin cambios. D3 restante pendiente.
