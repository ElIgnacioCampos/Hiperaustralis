# CI137 — Índice de 95 imágenes históricas recuperadas en staging anterior

**No es una auditoría binaria nueva.** Este índice une las rutas literales de los manifiestos CI137, para localizar paquetes antiguos por contenidos. La comprobación de los binarios en staging se documentó en checkpoint 18–19/11, pero los ZIP no han sido localizados en este turno.

## Desglose correcto
- Armas: 20
- Defensas: 8
- Instrumentos musicales: 21
- Parafernalia · sanación · cultura material: 22
- Rituales: 8
- Reliquias legendarias: 8
- Reliquias cotidianas: 8

Los 95 iconos legacy del pack de 135 corresponden a 20 Armas + 8 Defensas + 21 Instrumentos + 22 Parafernalia + 8 Rituales + 16 Reliquias. Los 40 Items de Equipo común usan iconos `icons/...`, no imágenes específicas dentro del módulo. El staging histórico completo de 96 añade Tokicura, que no es uno de los 135 históricos.

**Importante:** los 29 WebP de Equipo del repositorio son un lote gráfico adicional y no equivalen a los 22 WebP históricos de Parafernalia ni a los ocho de Rituales. Los 4 Turianos son Actors, fuera del conjunto Item CI137.

## Recuperación prioritaria
1. Buscar los **22 Parafernalia y ocho Rituales** por las rutas exactas de la tabla, no por nombres de los ZIP.
2. Recuperar los 20 WebP de Armas desde el staging SHA-verificado, manteniendo ARM-11–13 como candidatos gráficos no definitivos.
3. Cruce de los ocho assets históricos de Defensas y 21 de Instrumentos con staging actual, sin presumir identidad por código cultural.
4. Reusar los 16 WebP de Reliquias y Tokicura existentes por sus manifiestos ya verificados, respetando conflicto de IDs históricos.
5. Mantener Cuchillo de piedra `HipArm01PackA000` fuera de los 95: su recurso independiente sigue sin localizar.

## Inventario documental exacto
| Familia | Item | ID histórico | Ruta legacy |
|---|---|---|---|
| Armas | Cuchillo lítico | `c2L6T5w4S9OcgkDt` | `modules/hiperaustralis-rituales/assets/armas/01_cuchillo_litico.webp` |
| Armas | Cuchillo de hueso | `Iol01RpIqlQxSTMr` | `modules/hiperaustralis-rituales/assets/armas/02_cuchillo_hueso.webp` |
| Armas | Cuchillo metálico | `Ri1XmMCXqdIJbK3s` | `modules/hiperaustralis-rituales/assets/armas/03_cuchillo_metalico.webp` |
| Armas | Seax / cuchillo largo | `n5lkb91fMyBzjvzX` | `modules/hiperaustralis-rituales/assets/armas/04_seax.webp` |
| Armas | Espada sencilla | `tGW0xjpxQ9JnguU5` | `modules/hiperaustralis-rituales/assets/armas/05_espada.webp` |
| Armas | Garrote | `gf8C98EdlQSYUQh4` | `modules/hiperaustralis-rituales/assets/armas/06_garrote.webp` |
| Armas | Bastón de combate | `DYLtTWt2LeXGYvG7` | `modules/hiperaustralis-rituales/assets/armas/07_baston_combate.webp` |
| Armas | Maza pétrea | `VM0QO1ULwgCp72UM` | `modules/hiperaustralis-rituales/assets/armas/08_maza_petrea.webp` |
| Armas | Hacha lítica | `IIeIpAv4T4dD6hY1` | `modules/hiperaustralis-rituales/assets/armas/09_hacha_litica.webp` |
| Armas | Hacha metálica | `yJ6TtE7h71JqcxlU` | `modules/hiperaustralis-rituales/assets/armas/10_hacha_metalica.webp` |
| Armas | Hacha de dos manos | `utacTITGbR2IGTqs` | `modules/hiperaustralis-rituales/assets/armas/11_hacha_dos_manos.webp` |
| Armas | Hacha barbada | `9gpIv2fgoOYUFOpf` | `modules/hiperaustralis-rituales/assets/armas/12_hacha_barbada.webp` |
| Armas | Lanza corta | `QxUldCoEJEOCXFnJ` | `modules/hiperaustralis-rituales/assets/armas/13_lanza_corta.webp` |
| Armas | Lanza larga | `UEjClr8xQiDH77h1` | `modules/hiperaustralis-rituales/assets/armas/14_lanza_larga.webp` |
| Armas | Jabalina | `Rq6tY7rc6ktFEigy` | `modules/hiperaustralis-rituales/assets/armas/15_jabalina.webp` |
| Armas | Arco simple | `8D8YGQR5iuPKMqo0` | `modules/hiperaustralis-rituales/assets/armas/16_arco_simple.webp` |
| Armas | Flecha | `mHTbGNwut0kzDCVg` | `modules/hiperaustralis-rituales/assets/armas/17_flecha.webp` |
| Armas | Honda | `18MnPw0iJrmMtvgV` | `modules/hiperaustralis-rituales/assets/armas/18_honda.webp` |
| Armas | Mata’a | `3ssFdtyl81bRpdKc` | `modules/hiperaustralis-rituales/assets/armas/19_mataa.webp` |
| Armas | Arpón | `1uesBUeTeGjo9JQT` | `modules/hiperaustralis-rituales/assets/armas/20_arpon.webp` |
| Defensas | Capucha protectora de fibra de camélido — Pica–Tarapacá | `pe9Bb6kzCsr5IUx1` | `modules/hiperaustralis-rituales/assets/defensas/04_capucha_protectora_pica_tarapaca.webp` |
| Defensas | Casco emplumado — Pica–Tarapacá | `uM1FCC5l7Lbx8sRa` | `modules/hiperaustralis-rituales/assets/defensas/02_casco_emplumado_pica_tarapaca.webp` |
| Defensas | Casco rígido de madera y fibras — Pica–Tarapacá | `Id2dCZ4s4TPTMr8R` | `modules/hiperaustralis-rituales/assets/defensas/01_casco_rigido_pica_tarapaca.webp` |
| Defensas | Casco sobre capucha tejida — Pica–Tarapacá | `ThGITBgBJNBwJ6o2` | `modules/hiperaustralis-rituales/assets/defensas/03_casco_sobre_capucha_pica_tarapaca.webp` |
| Defensas | Coraza de Lasana — Alto Loa | `aa9YXJm5fD4UF6oK` | `modules/hiperaustralis-rituales/assets/defensas/05_coraza_lasana.webp` |
| Defensas | Espaldar grueso de cuero surandino | `6z2oWVl5FstIDJKB` | `modules/hiperaustralis-rituales/assets/defensas/07_espaldar_cuero_surandino.webp` |
| Defensas | Manta densa defensiva surandina | `bMbwzRsasVa6zxAM` | `modules/hiperaustralis-rituales/assets/defensas/08_manta_densa_surandina.webp` |
| Defensas | Peto grueso de cuero surandino | `gftm3lDJ8r4YbOjh` | `modules/hiperaustralis-rituales/assets/defensas/06_peto_cuero_surandino.webp` |
| Instrumentos musicales | Antara Lickanantay | `Aobt60Pl1vy7i7MU` | `modules/hiperaustralis-rituales/assets/instrumentos/lickanantay/07_antara_4_ductos.webp` |
| Instrumentos musicales | Antara Tiwanaku | `zSsH0T0CZzJ4nNQB` | `modules/hiperaustralis-rituales/assets/instrumentos/aymara/06_antara_tiwanaku.webp` |
| Instrumentos musicales | Arpa de boca | `j7J6wcAttET8rJpB` | `modules/hiperaustralis-rituales/assets/instrumentos/nordicos/21_arpa_de_boca.webp` |
| Instrumentos musicales | Campana Lickanantay | `RzhInApxuwq1o651` | `modules/hiperaustralis-rituales/assets/instrumentos/lickanantay/19_campana.webp` |
| Instrumentos musicales | Cuerno musical nórdico | `INdG4JndLBl0sWto` | `modules/hiperaustralis-rituales/assets/instrumentos/nordicos/20_cuerno_musical.webp` |
| Instrumentos musicales | Flauta de hueso | `YfFAFtBpsdyU2l9R` | `modules/hiperaustralis-rituales/assets/instrumentos/nordicos/11_flauta_hueso.webp` |
| Instrumentos musicales | Flauta traversa de Coyo | `R1exJG9q2EP8URHe` | `modules/hiperaustralis-rituales/assets/instrumentos/lickanantay/18_flauta_coyo.webp` |
| Instrumentos musicales | Kakel-kultrung | `1dhUgcpr5U3wAQ1l` | `modules/hiperaustralis-rituales/assets/instrumentos/mapuche/15_kakel_kultrung.webp` |
| Instrumentos musicales | Kaskawilla | `vr5gUbTNMU8tj3zL` | `modules/hiperaustralis-rituales/assets/instrumentos/mapuche/14_kaskawilla.webp` |
| Instrumentos musicales | Kultrung | `K7d2oqF6P7DB0Kpt` | `modules/hiperaustralis-rituales/assets/instrumentos/mapuche/01_kultrung.webp` |
| Instrumentos musicales | Lira nórdica | `7yTC2u73mcFuQrx2` | `modules/hiperaustralis-rituales/assets/instrumentos/nordicos/10_lira.webp` |
| Instrumentos musicales | Pifüllka | `IG8DW7Wr30mg1jqx` | `modules/hiperaustralis-rituales/assets/instrumentos/mapuche/02_pifullka.webp` |
| Instrumentos musicales | Piloilo | `KpK5mqDdleRnemjh` | `modules/hiperaustralis-rituales/assets/instrumentos/mapuche/13_piloilo.webp` |
| Instrumentos musicales | Pututu | `JZUzx0bNMoDj6xs5` | `modules/hiperaustralis-rituales/assets/instrumentos/andino/16_pututu.webp` |
| Instrumentos musicales | Siku | `K4BKDYp47LohrxuD` | `modules/hiperaustralis-rituales/assets/instrumentos/aymara/04_siku.webp` |
| Instrumentos musicales | Sonaja Aymara | `VMdFQpCaienOgLV4` | `modules/hiperaustralis-rituales/assets/instrumentos/aymara/17_sonaja.webp` |
| Instrumentos musicales | Sonajero de hierro | `RiMXmUYNYn5VRKrx` | `modules/hiperaustralis-rituales/assets/instrumentos/nordicos/12_sonajero_hierro.webp` |
| Instrumentos musicales | Sonajero Lickanantay | `tvgKf9WGkUmy6GJi` | `modules/hiperaustralis-rituales/assets/instrumentos/lickanantay/09_sonajero.webp` |
| Instrumentos musicales | Trompeta monóxila | `Akd70OCwmrJ0az3P` | `modules/hiperaustralis-rituales/assets/instrumentos/lickanantay/08_trompeta_monoxila.webp` |
| Instrumentos musicales | Wankara | `FvfW6Ug0yCyR7VjF` | `modules/hiperaustralis-rituales/assets/instrumentos/aymara/05_wankara.webp` |
| Instrumentos musicales | Waza | `gp4b3XE6mJGvqE9X` | `modules/hiperaustralis-rituales/assets/instrumentos/mapuche/03_waza.webp` |
| Parafernalia · sanación · cultura material | Asiento miniatura de plata | `ntEPr3gfZn4xD2rG` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/08_NORDICOS_ASIENTO_MINIATURA.webp` |
| Parafernalia · sanación · cultura material | Boca del mallku | `JKxUdwuhOtz8yGW1` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/19_AYMARA_BOCA_DEL_MALLKU.webp` |
| Parafernalia · sanación · cultura material | Bolsa con semillas de beleño | `ilG4UwSV1Bgbk4TF` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/16_NORDICOS_BOLSA_BELENO.webp` |
| Parafernalia · sanación · cultura material | Contenedor del kit inhalatorio | `nnmYeJON0DKDGJsL` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/17_LICKANANTAY_CONTENEDOR_KIT.webp` |
| Parafernalia · sanación · cultura material | Cucharilla / espátula | `Z955U4dlDAUeEZvr` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/13_LICKANANTAY_CUCHARILLA_ESPATULA.webp` |
| Parafernalia · sanación · cultura material | Escobilla de limpieza | `FwlbrqC5ZBqiRjXy` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/21_LICKANANTAY_ESCOBILLA_LIMPIEZA.webp` |
| Parafernalia · sanación · cultura material | Hilo negro ritual | `IPKDCSo3bKzUCcGl` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/15_AYMARA_HILO_NEGRO.webp` |
| Parafernalia · sanación · cultura material | Keñeyken | `AocpkbZW4w29Bc4u` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/38_MAPUCHE_KENEYKEN.webp` |
| Parafernalia · sanación · cultura material | Kultrún | `Nvj2xTK4apIrEDPn` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/02_MAPUCHE_KULTRUN.webp` |
| Parafernalia · sanación · cultura material | Latúe | `psnu2t74dnHQ3pFx` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/42_MAPUCHE_LATUE.webp` |
| Parafernalia · sanación · cultura material | Llaf-llaf | `FBVSE0HBZ62ShEZM` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/10_MAPUCHE_LLAF_LLAF.webp` |
| Parafernalia · sanación · cultura material | Mortero miniatura y mano | `xdvai2XGysSWwdKt` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/09_LICKANANTAY_MORTERO_MINIATURA.webp` |
| Parafernalia · sanación · cultura material | Pañoleta ceremonial | `q0qlFGWAMip94Y4i` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/14_MAPUCHE_PANOLETA_CEREMONIAL.webp` |
| Parafernalia · sanación · cultura material | Pifüllka | `dVgxiZYJcTLdA5yL` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/26_MAPUCHE_PIFULLKA.webp` |
| Parafernalia · sanación · cultura material | Q'uwa | `P0xH74Ofvj2xnAvk` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/11_AYMARA_QUWA_HUMO.webp` |
| Parafernalia · sanación · cultura material | Rewe | `fW04rY0fTfZ84fL6` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/06_MAPUCHE_REWE.webp` |
| Parafernalia · sanación · cultura material | Runas corregidas | `3cCDbjqou8AlzfsW` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/40_NORDICOS_RUNAS_CORREGIDAS.webp` |
| Parafernalia · sanación · cultura material | Tableta inhalatoria | `zSx4zh9b24XjjXMx` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/01_LICKANANTAY_TABLETA_INHALATORIA.webp` |
| Parafernalia · sanación · cultura material | Trepanación cicatrizada | `QTbZkuQcog7ReVW5` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/41_ATACAMA_TREPANACION_CICATRIZADA.webp` |
| Parafernalia · sanación · cultura material | Tubo inhalatorio | `MvGDMBIuGD1iozPW` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/05_LICKANANTAY_TUBO_INHALATORIO.webp` |
| Parafernalia · sanación · cultura material | Vara de völva | `0MRehrLjaQOO4s1A` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/24_NORDICOS_VARA_VOLVA_KOPINGSVIK.webp` |
| Parafernalia · sanación · cultura material | Vigilia nocturna | `oaLaLLWoZXQrRULq` | `modules/hiperaustralis-rituales/assets/iconos_aprobados/43_AYMARA_VIGILIA_NOCTURNA.webp` |
| Rituales | Atar | `StbeCxC7TrpiOUdG` | `modules/hiperaustralis-rituales/assets/rituales/05_ATAR.webp` |
| Rituales | Consultar | `fCg9JDUw2DNqWjOe` | `modules/hiperaustralis-rituales/assets/rituales/03_CONSULTAR.webp` |
| Rituales | Despedir | `wgLZd7pqnk84LSWJ` | `modules/hiperaustralis-rituales/assets/rituales/06_DESPEDIR.webp` |
| Rituales | Lakutun · Legar | `4jeuBPUYEGHmXKXv` | `modules/hiperaustralis-rituales/assets/rituales/08_LAKUTUN_LEGAR.webp` |
| Rituales | Renovar Arraigo | `mLpXRfCGbmX1t8xa` | `modules/hiperaustralis-rituales/assets/rituales/04_RENOVAR_ARRAIGO.webp` |
| Rituales | Restituir | `JQI2h5gPnAsqvcsF` | `modules/hiperaustralis-rituales/assets/rituales/02_RESTITUIR.webp` |
| Rituales | Viajar | `yoCFKUIlnBqVvRsH` | `modules/hiperaustralis-rituales/assets/rituales/07_VIAJAR.webp` |
| Rituales | Vincular | `yQe9xxburYY3j35H` | `modules/hiperaustralis-rituales/assets/rituales/01_VINCULAR.webp` |
| Reliquias legendarias | Amuleto rúnico de Kvinneby | `q3HXoB750L6j6XHK` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/08_AMULETO_RUNICO_DE_KVINNEBY.webp` |
| Reliquias legendarias | Antükura | `CtMcaOnMjw23zWmq` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/02_ANTUKURA.webp` |
| Reliquias cotidianas | Cencerro de madera | `frD3BIM7bklCxPle` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/08_cencerro_de_madera.webp` |
| Reliquias cotidianas | Challa heredada | `z8BEvJ4uHgLSZePS` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/01_challa_heredada.webp` |
| Reliquias legendarias | Chayanco de Chillpila | `a9NdZq068ANs5hnR` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/06_CHAYANCO_DE_CHILLPILA.webp` |
| Reliquias cotidianas | Chuspa de camino | `u5Vbl3gGUL4kJJQ2` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/03_chuspa_de_camino.webp` |
| Reliquias cotidianas | Cuchara de chañar | `sdQeeQDV2W6EVl2w` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/07_cuchara_de_chanar.webp` |
| Reliquias legendarias | Drakar de Ullman | `tr9AQooUcnTtAxO3` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/04_DRAKAR_DE_ULLMAN.webp` |
| Reliquias cotidianas | Inkuña de ofrendas | `TADm8tlCkyns4iwE` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/04_inkuna_de_ofrendas.webp` |
| Reliquias cotidianas | Kütru metawe familiar | `T0yw5ZsA7WtDOB9G` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/02_kutru_metawe_familiar.webp` |
| Reliquias cotidianas | Peine de asta heredado | `3Rjv67wd9g9rVwka` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/05_peine_de_asta_heredado.webp` |
| Reliquias cotidianas | Piedra de afilar del viaje | `NSOxLP5BMpfX7L57` | `modules/hiperaustralis-rituales/assets/reliquias_cotidianas/06_piedra_de_afilar_del_viaje.webp` |
| Reliquias legendarias | Piedra Vieja de Paititi | `ik1kdfVoqQbbTAmH` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/05_PIEDRA_VIEJA_DE_PAITITI.webp` |
| Reliquias legendarias | Tableta del Hombre-Felino | `UrZNB1QgdnAghNQb` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/07_TABLETA_DEL_HOMBRE_FELINO.webp` |
| Reliquias legendarias | Tridente de Ullman | `607Y5Z4vouHf8vEi` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/01_TRIDENTE_DE_ULLMAN.webp` |
| Reliquias legendarias | Yelmo de Hipólita | `sRDyvzOfCVjdHJ0D` | `modules/hiperaustralis-rituales/assets/reliquias_legendarias/03_YELMO_DE_HIPOLITA.webp` |

## Estado y cautelas
- Únicamente se acreditan rutas documentales e inventarios anteriores; no se extrajo ZIP ni se verificaron bytes en esta revisión.
- Ninguna imagen se transfiere, convierte, genera, descarta o asigna automáticamente.
- No tocar `main`, Bridge, Foundry, Forge ni Estado Maestro.
