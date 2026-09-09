/**
 * Datos oficiales de departamentos y municipios de Guatemala.
 * Fuente: Script SQL oficial del RENAP (base dpi).
 *
 * IMPORTANTE: Los municipios de cada departamento están en el orden
 * exacto del código municipal (01, 02, 03…), lo que permite mapear
 * directamente desde los dígitos 11-12 del CUI guatemalteco.
 * Índice 0 = municipio código 01, índice 1 = código 02, etc.
 */
export interface Departamento {
  title: string
  /** Código numérico (1-22) — coincide con dígitos 09-10 del CUI */
  code: number
  mun: string[]
}

export const DEPARTAMENTOS_GUATEMALA: Departamento[] = [
  {
    code: 1, title: 'Guatemala',
    mun: [
      'Guatemala',             // 0101
      'Santa Catarina Pinula', // 0102
      'San José Pinula',       // 0103
      'San José del Golfo',    // 0104
      'Palencia',              // 0105
      'Chinautla',             // 0106
      'San Pedro Ayampuc',     // 0107
      'Mixco',                 // 0108
      'San Pedro Sacatepéquez',// 0109
      'San Juan Sacatepéquez', // 0110
      'San Raymundo',          // 0111
      'Chuarrancho',           // 0112
      'Fraijanes',             // 0113
      'Amatitlán',             // 0114
      'Villa Nueva',           // 0115
      'Villa Canales',         // 0116
      'San Miguel Petapa',     // 0117
    ],
  },
  {
    code: 2, title: 'El Progreso',
    mun: [
      'Guastatoya',                    // 0201
      'Morazán',                       // 0202
      'San Agustín Acasaguastlán',     // 0203
      'San Cristóbal Acasaguastlán',   // 0204
      'El Jícaro',                     // 0205
      'Sansare',                       // 0206
      'Sanarate',                      // 0207
      'San Antonio La Paz',            // 0208
    ],
  },
  {
    code: 3, title: 'Sacatepéquez',
    mun: [
      'Antigua',                         // 0301
      'Jocotenango',                     // 0302
      'Pastores',                        // 0303
      'Sumpango',                        // 0304
      'Santo Domingo Xenacoj',           // 0305
      'Santiago Sacatepéquez',           // 0306
      'San Bartolomé Milpas Altas',      // 0307
      'San Lucas Sacatepéquez',          // 0308
      'Santa Lucía Milpas Altas',        // 0309
      'Magdalena Milpas Altas',          // 0310
      'Santa María de Jesús',            // 0311
      'Ciudad Vieja',                    // 0312
      'San Miguel Dueñas',               // 0313
      'Alotenango',                      // 0314
      'San Antonio Aguas Calientes',     // 0315
      'Santa Catarina Barahona',         // 0316
    ],
  },
  {
    code: 4, title: 'Chimaltenango',
    mun: [
      'Chimaltenango',           // 0401
      'San José Poaquil',        // 0402
      'San Martín Jilotepeque',  // 0403
      'San Juan Comalapa',       // 0404
      'Santa Apolonia',          // 0405
      'Tecpán Guatemala',        // 0406
      'Patzún',                  // 0407
      'San Miguel Pochuta',      // 0408
      'Patzicía',                // 0409
      'Santa Cruz Balanyá',      // 0410
      'Acatenango',              // 0411
      'San Pedro Yepocapa',      // 0412
      'San Andrés Itzapa',       // 0413
      'Parramos',                // 0414
      'Zaragoza',                // 0415
      'El Tejar',                // 0416
    ],
  },
  {
    code: 5, title: 'Escuintla',
    mun: [
      'Escuintla',                    // 0501
      'Santa Lucía Cotzumalguapa',    // 0502
      'La Democracia',                // 0503
      'Siquinalá',                    // 0504
      'Masagua',                      // 0505
      'Tiquisate',                    // 0506
      'La Gomera',                    // 0507
      'Guanagazapa',                  // 0508
      'San José',                     // 0509
      'Iztapa',                       // 0510
      'Palín',                        // 0511
      'San Vicente Pacaya',           // 0512
      'Nueva Concepción',             // 0513
    ],
  },
  {
    code: 6, title: 'Santa Rosa',
    mun: [
      'Cuilapa',                 // 0601
      'Barberena',               // 0602
      'Santa Rosa de Lima',      // 0603
      'Casillas',                // 0604
      'San Rafael Las Flores',   // 0605
      'Oratorio',                // 0606
      'San Juan Tecuaco',        // 0607
      'Chiquimulilla',           // 0608
      'Taxisco',                 // 0609
      'Santa María Ixhuatán',    // 0610
      'Guazacapán',              // 0611
      'Santa Cruz Naranjo',      // 0612
      'Pueblo Nuevo Viñas',      // 0613
      'Nueva Santa Rosa',        // 0614
    ],
  },
  {
    code: 7, title: 'Sololá',
    mun: [
      'Sololá',                        // 0701
      'San José Chacaya',              // 0702
      'Santa María Visitación',        // 0703
      'Santa Lucía Utatlán',           // 0704
      'Nahualá',                       // 0705
      'Santa Catarina Ixtahuacán',     // 0706
      'Santa Clara La Laguna',         // 0707
      'Concepción',                    // 0708
      'San Andrés Semetabaj',          // 0709
      'Panajachel',                    // 0710
      'Santa Catarina Palopó',         // 0711
      'San Antonio Palopó',            // 0712
      'San Lucas Tolimán',             // 0713
      'Santa Cruz La Laguna',          // 0714
      'San Pablo La Laguna',           // 0715
      'San Marcos La Laguna',          // 0716
      'San Juan La Laguna',            // 0717
      'San Pedro La Laguna',           // 0718
      'Santiago Atitlán',              // 0719
    ],
  },
  {
    code: 8, title: 'Totonicapán',
    mun: [
      'Totonicapán',                   // 0801
      'San Cristóbal Totonicapán',     // 0802
      'San Francisco El Alto',         // 0803
      'San Andrés Xecul',              // 0804
      'Momostenango',                  // 0805
      'Santa María Chiquimula',        // 0806
      'Santa Lucía La Reforma',        // 0807
      'San Bartolo Aguas Calientes',   // 0808
    ],
  },
  {
    code: 9, title: 'Quetzaltenango',
    mun: [
      'Quetzaltenango',                // 0901
      'Salcajá',                       // 0902
      'Olintepeque',                   // 0903
      'San Carlos Sija',               // 0904
      'Sibilia',                       // 0905
      'Cabrícán',                      // 0906
      'Cajolá',                        // 0907
      'San Miguel Sigüilá',            // 0908
      'San Juan Ostuncalco',           // 0909
      'San Mateo',                     // 0910
      'Concepción Chiquirichapa',      // 0911
      'San Martín Sacatepéquez',       // 0912
      'Almolonga',                     // 0913
      'Cantel',                        // 0914
      'Huitan',                        // 0915
      'Zunil',                         // 0916
      'Colomba Costa Cuca',            // 0917
      'San Francisco La Unión',        // 0918
      'El Palmar',                     // 0919
      'Coatepeque',                    // 0920
      'Génova Costa Cuca',             // 0921
      'Flores Costa Cuca',             // 0922
      'La Esperanza',                  // 0923
      'Palestina de Los Altos',        // 0924
    ],
  },
  {
    code: 10, title: 'Suchitepéquez',
    mun: [
      'Mazatenango',                       // 1001
      'Cuyotenango',                       // 1002
      'San Francisco Zapotitlán',          // 1003
      'San Bernardino',                    // 1004
      'San José El Ídolo',                 // 1005
      'Santo Domingo Suchitepéquez',       // 1006
      'San Lorenzo',                       // 1007
      'Samayac',                           // 1008
      'San Pablo Jocopilas',               // 1009
      'San Antonio Suchitepéquez',         // 1010
      'San Miguel Panán',                  // 1011
      'San Gabriel',                       // 1012
      'Chicacao',                          // 1013
      'Patulul',                           // 1014
      'Santa Bárbara',                     // 1015
      'San Juan Bautista',                 // 1016
      'Santo Tomás La Unión',              // 1017
      'Zunilito',                          // 1018
      'Pueblo Nuevo',                      // 1019
      'Río Bravo',                         // 1020
    ],
  },
  {
    code: 11, title: 'Retalhuleu',
    mun: [
      'Retalhuleu',              // 1101
      'San Sebastián',           // 1102
      'Santa Cruz Muluá',        // 1103
      'San Martín Zapotitlán',   // 1104
      'San Felipe',              // 1105
      'San Andrés Villa Seca',   // 1106
      'Champerico',              // 1107
      'Nuevo San Carlos',        // 1108
      'El Asintal',              // 1109
    ],
  },
  {
    code: 12, title: 'San Marcos',
    mun: [
      'San Marcos',                      // 1201
      'San Pedro Sacatepéquez',          // 1202
      'San Antonio Sacatepéquez',        // 1203
      'Comitancillo',                    // 1204
      'San Miguel Ixtahuacán',           // 1205
      'Concepción Tutuapa',              // 1206
      'Tacaná',                          // 1207
      'Sibinal',                         // 1208
      'Tajumulco',                       // 1209
      'Tejutla',                         // 1210
      'San Rafael Pie de la Cuesta',     // 1211
      'Nuevo Progreso',                  // 1212
      'El Tumbador',                     // 1213
      'San José El Rodeo',               // 1214
      'Malacatán',                       // 1215
      'Catarina',                        // 1216
      'Ayutla (Tecún Umán)',             // 1217
      'Ocós',                            // 1218
      'San Pablo',                       // 1219
      'El Quetzal',                      // 1220
      'La Reforma',                      // 1221
      'Pajapita',                        // 1222
      'Ixchiguán',                       // 1223
      'San José Ojetenam',               // 1224
      'San Cristóbal Cucho',             // 1225
      'Sipacapa',                        // 1226
      'Esquipulas Palo Gordo',           // 1227
      'Río Blanco',                      // 1228
      'San Lorenzo',                     // 1229
    ],
  },
  {
    code: 13, title: 'Huehuetenango',
    mun: [
      'Huehuetenango',                   // 1301
      'Chiantla',                        // 1302
      'Malacatancito',                   // 1303
      'Cuilco',                          // 1304
      'Nentón',                          // 1305
      'San Pedro Necta',                 // 1306
      'Jacaltenango',                    // 1307
      'San Pedro Soloma',                // 1308
      'San Ildefonso Ixtahuacán',        // 1309
      'Santa Bárbara',                   // 1310
      'La Libertad',                     // 1311
      'La Democracia',                   // 1312
      'San Miguel Acatán',               // 1313
      'San Rafael La Independencia',     // 1314
      'Todos Santos Cuchumatán',         // 1315
      'San Juan Atitán',                 // 1316
      'Santa Eulalia',                   // 1317
      'San Mateo Ixtatán',               // 1318
      'Colotenango',                     // 1319
      'San Sebastián Huehuetenango',     // 1320
      'Tectitán',                        // 1321
      'Concepción Huista',               // 1322
      'San Juan Ixcoy',                  // 1323
      'San Antonio Huista',              // 1324
      'San Sebastián Coatán',            // 1325
      'Santa Cruz Barillas',             // 1326
      'Aguacatán',                       // 1327
      'San Rafael Petzal',               // 1328
      'San Gaspar Ixchil',               // 1329
      'Santiago Chimaltenango',          // 1330
      'Santa Ana Huista',                // 1331
      'Unión Cantinil',                  // 1332
    ],
  },
  {
    code: 14, title: 'Quiché',
    mun: [
      'Santa Cruz del Quiché',           // 1401
      'Chiché',                          // 1402
      'Chinique',                        // 1403
      'Zacualpa',                        // 1404
      'Chajul',                          // 1405
      'Santo Tomás Chichicastenango',    // 1406
      'Patzité',                         // 1407
      'San Antonio Ilotenango',          // 1408
      'San Pedro Jocopilas',             // 1409
      'Cunén',                           // 1410
      'San Juan Cotzal',                 // 1411
      'Joyabaj',                         // 1412
      'Nebaj',                           // 1413
      'San Andrés Sajcabajá',            // 1414
      'San Miguel Uspantán',             // 1415
      'Sacapulas',                       // 1416
      'San Bartolomé Jocotenango',       // 1417
      'Canillá',                         // 1418
      'Chicamán',                        // 1419
      'Ixcán',                           // 1420
      'Pachalum',                        // 1421
      'Playa Grande (Ixcán)',            // 1422
    ],
  },
  {
    code: 15, title: 'Baja Verapaz',
    mun: [
      'Salamá',               // 1501
      'San Miguel Chicaj',    // 1502
      'Rabinal',              // 1503
      'Cubulco',              // 1504
      'Granados',             // 1505
      'Santa Cruz El Chol',   // 1506
      'San Jerónimo',         // 1507
      'Purulhá',              // 1508
    ],
  },
  {
    code: 16, title: 'Alta Verapaz',
    mun: [
      'Cobán',                           // 1601
      'Santa Cruz Verapaz',              // 1602
      'San Cristóbal Verapaz',           // 1603
      'Tactic',                          // 1604
      'Tamahú',                          // 1605
      'Tucurú',                          // 1606
      'Panzós',                          // 1607
      'Senahú',                          // 1608
      'San Pedro Carchá',                // 1609
      'San Juan Chamelco',               // 1610
      'Lanquín',                         // 1611
      'Santa María Cahabón',             // 1612
      'Chisec',                          // 1613
      'Chahal',                          // 1614
      'Fray Bartolomé de las Casas',     // 1615
      'La Tinta',                        // 1616
      'Raxruha',                         // 1617
    ],
  },
  {
    code: 17, title: 'El Petén',
    mun: [
      'Flores',               // 1701
      'San José',             // 1702
      'San Benito',           // 1703
      'San Andrés',           // 1704
      'La Libertad',          // 1705
      'San Francisco',        // 1706
      'Santa Ana',            // 1707
      'Dolores',              // 1708
      'San Luis',             // 1709
      'Sayaxché',             // 1710
      'Melchor de Mencos',    // 1711
      'Poptún',               // 1712
    ],
  },
  {
    code: 18, title: 'Izabal',
    mun: [
      'Puerto Barrios',   // 1801
      'Livingston',       // 1802
      'El Estor',         // 1803
      'Morales',          // 1804
      'Los Amates',       // 1805
    ],
  },
  {
    code: 19, title: 'Zacapa',
    mun: [
      'Zacapa',       // 1901
      'Estanzuela',   // 1902
      'Río Hondo',    // 1903
      'Gualán',       // 1904
      'Teculután',    // 1905
      'Usumatlán',    // 1906
      'Cabañas',      // 1907
      'San Diego',    // 1908
      'La Unión',     // 1909
      'Huité',        // 1910
    ],
  },
  {
    code: 20, title: 'Chiquimula',
    mun: [
      'Chiquimula',            // 2001
      'San José La Arada',     // 2002
      'San Juan La Ermita',    // 2003
      'Jocotán',               // 2004
      'Camotán',               // 2005
      'Olopa',                 // 2006
      'Esquipulas',            // 2007
      'Concepción Las Minas',  // 2008
      'Quezaltepeque',         // 2009
      'San Jacinto',           // 2010
      'Ipala',                 // 2011
    ],
  },
  {
    code: 21, title: 'Jalapa',
    mun: [
      'Jalapa',                    // 2101
      'San Pedro Pinula',          // 2102
      'San Luis Jilotepeque',      // 2103
      'San Manuel Chaparrón',      // 2104
      'San Carlos Alzatate',       // 2105
      'Monjas',                    // 2106
      'Mataquescuintla',           // 2107
    ],
  },
  {
    code: 22, title: 'Jutiapa',
    mun: [
      'Jutiapa',               // 2201
      'El Progreso',           // 2202
      'Santa Catarina Mita',   // 2203
      'Agua Blanca',           // 2204
      'Asunción Mita',         // 2205
      'Yupiltepeque',          // 2206
      'Atescatempa',           // 2207
      'Jerez',                 // 2208
      'El Adelanto',           // 2209
      'Zapotitlán',            // 2210
      'Comapa',                // 2211
      'Jalpatagua',            // 2212
      'Conguaco',              // 2213
      'Moyuta',                // 2214
      'Pasaco',                // 2215
      'San José Acatempa',     // 2216
      'Quesada',               // 2217
    ],
  },
]
