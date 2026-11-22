# CI137 — Revisión semántica de candidatos gráficos v04

**Estado:** TRIAGE DOCUMENTAL, no verificación gráfica. Se mantienen archivos y rutas intactos.

## Resultado
- TEXT_EQUIVALENT_DISTINCT_ID_ASSET_UNVERIFIED: 2
- NO_LEXICAL_CANDIDATE: 70
- REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET: 13
- AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW: 10
- PRIORITY_VISUAL_CROSSWALK_CANDIDATE: 25
- ARCHIVED_RELIC_MANIFEST_MATCH: 16
- RUNTIME_FILE_PRESENT: 1

## Criterio
- Rechazar explícitamente cruces por sustantivo genérico, cultura incompatible, función distinta o falso token.
- Marcar ambiguo cuando los nombres indican piezas relacionadas pero no idénticas.
- Priorizar revisión visual cuando el nombre distintivo coincide, sin considerarlo aprobado.
- Conservar por separado los tres documentos de cuchillo lítico/piedra y sus IDs.

## 47 candidatos revisados
| Item | Decisión | Archivo candidato preferente |
|---|---|---|
| Capucha protectora de fibra de camélido — Pica–Tarapacá | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Casco emplumado — Pica–Tarapacá | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/defensas/webp256/COM-07_Casco_Pica_Tarapaca_256.webp` |
| Casco rígido de madera y fibras — Pica–Tarapacá | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/defensas/webp256/COM-07_Casco_Pica_Tarapaca_256.webp` |
| Casco sobre capucha tejida — Pica–Tarapacá | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/defensas/webp256/COM-07_Casco_Pica_Tarapaca_256.webp` |
| Coraza de Lasana — Alto Loa | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/defensas/webp256/COM-08_Coraza_Chiu-Chiu_256.webp` |
| Manta densa defensiva surandina | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Brýni · Piedra de afilar | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Canasto | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/equipo/webp256/chinchorro_canasto.webp` |
| Canasto | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/equipo/webp256/chinchorro_canasto.webp` |
| Ch'uspa · Bolsa pequeña | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Challa · Olla | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Chinguillo · Bolsa-red | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/chinchorro_chinguillo.webp` |
| Chope · Desconchador | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/chinchorro_chope.webp` |
| Eldjárn · Yesquero | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/nordico_eldjarn_yesquero.webp` |
| Gancho de atalaje | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/lickanantay_gancho_atalaje.webp` |
| Knífr · Cuchillo | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/nordico_knifr_cuchillo.webp` |
| Külko · Canasto | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Metawe · Jarro | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/equipo/webp256/mapuche_alka_metawe.webp` |
| Mortero de piedra | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Poki · Bolsa | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Punzón de hueso | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/chinchorro_punzon_hueso.webp` |
| Q'ipi · Bulto de carga | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Qapu · Huso | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/aymara_qapu_huso.webp` |
| Saum-nál · Aguja de coser | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/equipo/webp256/nordico_saum_nal_aguja.webp` |
| Snælda · Huso | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Toki · Hacha de piedra | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Antara Lickanantay | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/02_antara_tiwanaku.webp` |
| Antara Tiwanaku | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/02_antara_tiwanaku.webp` |
| Arpa de boca | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/instrumentos-erh/webp_256/ARPA_BOCA_NORDICA_ERH_256.webp` |
| Campana Lickanantay | REJECTED_FALSE_POSITIVE_NO_CONFIRMED_ASSET | — |
| Cuerno musical nórdico | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/instrumentos-erh/webp_256/CUERNO_MUSICAL_ERH_256.webp` |
| Flauta de hueso | AMBIGUOUS_REQUIRES_EDITORIAL_VISUAL_REVIEW | `module/assets/_staging/instrumentos-erh/webp_256/FLAUTA_HUESO_ERH_256.webp` |
| Flauta traversa de Coyo | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/FLAUTA_COYO_ERH_256.webp` |
| Kakel-kultrung | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/kakel_kultrung_ERH_256.webp` |
| Kaskawilla | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/kaskawilla_erh_256.webp` |
| Kultrung | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/kultrung_erh_256.webp` |
| Lira nórdica | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/LIRA_ERH_256.webp` |
| Pifüllka | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/pifullka_erh_256.webp` |
| Piloilo | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/piloilo_erh_256.webp` |
| Pututu | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/pututu_erh_256.webp` |
| Siku | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/SIKU_ERH_256.webp` |
| Sonaja Aymara | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/03_sonaja_aymara.webp` |
| Sonajero de hierro | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/SONAJERO_HIERRO_ERH_256.webp` |
| Sonajero Lickanantay | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/06_sonajero_lickanantay.webp` |
| Trompeta monóxila | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/05_trompeta_monoxila.webp` |
| Wankara | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/01_wankara.webp` |
| Waza | PRIORITY_VISUAL_CROSSWALK_CANDIDATE | `module/assets/_staging/instrumentos-erh/webp_256/waza_erh_256.webp` |

## Bloqueos reiterados
- COM-09 Tañaña no tiene binario final acreditado.
- Arpa de boca permanece pendiente técnico.
- Las Armas históricas carecen de imágenes verificadas en GitHub; su ZIP contiene sólo JSON.
- No cambiar `img`, `flags`, hashes ni identidades; validar original/destino por SHA y cotejo visual.

**Estado Maestro/main/Bridge/Foundry/Forge:** sin cambios.
