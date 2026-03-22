// Timmermans Hardglas - Digitale Werkinstructies (DWI) Database
// Auto-generated from HTML source documents
// Updated: 21-03-2026

export const STATIONS = [
  { code: 'alle', label: 'Alle stations', nummer: null },
  { code: 'ONT', label: 'Ontvangst', nummer: 1 },
  { code: 'SNI', label: 'Snijlijn', nummer: 2 },
  { code: 'CNC', label: 'CNC', nummer: 3 },
  { code: 'BOR', label: 'Boren', nummer: 4 },
  { code: 'SLI', label: 'Slijpen', nummer: 5 },
  { code: 'WSS', label: 'Wassen', nummer: 6 },
  { code: 'ESG', label: 'Hardoven', nummer: 7 },
  { code: 'VSG', label: 'Lamineren', nummer: 8 },
  { code: 'ISO', label: 'ISO-lijn', nummer: 9 },
  { code: 'QC', label: 'Inspectie', nummer: 10 },
  { code: 'EXP', label: 'Expeditie', nummer: 11 },
];

export const WERKINSTRUCTIES = [
  // ============================================================================
  // DWI-BOR-001: Boormachine Opstarten & Instellen (Station 4: Boren)
  // ============================================================================
  {
    id: 'DWI-BOR-001',
    titel: 'Boormachine Opstarten & Instellen',
    station: 'BOR',
    stationNummer: 4,
    machine: 'Bohle boormachine (Siemens SIMATIC + WEINTEK touchscreen)',
    auteur: 'Alex Tabarcia',
    goedgekeurd: 'Erik Stroot',
    versie: '1.0',
    datum: '10-03-2026',
    volgendeReview: '10-09-2026',
    status: 'gereed',
    gereedschap: [
      'Bahco 250mm liniaal',
      'Testglas'
    ],
    pbm: [
      'Veiligheidsschoenen',
      'Veiligheidsbril',
      'Snijbestendige handschoenen'
    ],
    stappen: [
      {
        nummer: 1,
        titel: 'Machine inschakelen',
        beschrijving: 'Druk op de groene knop in de gele behuizing',
        waarschuwing: null,
        tip: null,
        substappen: null,
        afbeeldingen: [
          '/images/dwi/DWI-BOR-001/stap-01.jpg',
          '/images/dwi/DWI-BOR-001/stap-02.jpg',
        ],
        bijschrift: [
          'Groene knop in gele behuizing — hand drukt op startknop',
          'Siemens SIMATIC paneel — startscherm',
        ],
      },
      {
        nummer: 2,
        titel: 'Tafel resetten',
        beschrijving: 'Zet de tafel gereed voor gebruik',
        waarschuwing: 'Controleer of de tafel vrij is van obstakels',
        tip: null,
        substappen: [
          'Druk rode knop in (noodstop opheffen)',
          'Druk blauwe knop 3 seconden in',
          'Druk "Reset" op WEINTEK touchscreen'
        ],
        afbeeldingen: [
          '/images/dwi/DWI-BOR-001/stap-03.jpg',
          '/images/dwi/DWI-BOR-001/stap-04.jpg',
          '/images/dwi/DWI-BOR-001/stap-05.jpg',
        ],
        bijschrift: [
          'Rode knop (noodstop)',
          'Blauwe knop 3 sec indrukken',
          'WEINTEK touchscreen — Reset knop (groen omcirkeld)',
        ],
      },
      {
        nummer: 3,
        titel: 'Waterkranen openen',
        beschrijving: 'Beide groene kogelkranen horizontaal draaien',
        waarschuwing: null,
        tip: 'Controleer of er water doorstroomt. Zonder water mag er niet geboord worden.',
        substappen: null,
        afbeeldingen: [
          '/images/dwi/DWI-BOR-001/stap-06.jpg',
          '/images/dwi/DWI-BOR-001/stap-07.jpg',
        ],
        bijschrift: [
          'Groene kogelkranen horizontaal draaien',
          'Beide kranen open',
        ],
      },
      {
        nummer: 4,
        titel: 'Tafelbeweging inschakelen',
        beschrijving: 'Activeer de tafelbeweging via de touchscreen',
        waarschuwing: null,
        tip: null,
        substappen: [
          'Druk "Turn on" op WEINTEK touchscreen'
        ],
        afbeeldingen: [
          '/images/dwi/DWI-BOR-001/stap-08.jpg',
        ],
        bijschrift: [
          'Touchscreen "Turn on" knop',
        ],
      },
      {
        nummer: 5,
        titel: 'SET 0 instellen',
        beschrijving: 'Stel de nulpunt in voor X en Y coördinaten',
        waarschuwing: 'Gebruik altijd een testglas. Stel nooit de SET 0 in zonder testglas.',
        tip: null,
        substappen: [
          'Stel X = 60 in',
          'Stel Y = 27 in',
          'Druk "Play"',
          'Plaats testglas op tafel',
          'Druk "Nullen"-knop',
          'Stel bovenboor in',
          'Stel onderboor in'
        ],
        afbeeldingen: [
          '/images/dwi/DWI-BOR-001/stap-09.jpg',
          '/images/dwi/DWI-BOR-001/stap-10.jpg',
          '/images/dwi/DWI-BOR-001/stap-11.jpg',
          '/images/dwi/DWI-BOR-001/stap-12.jpg',
        ],
        bijschrift: [
          'X/Y coördinaten invoeren',
          'Bovenboor positie',
          'Onderboor positie',
          'Nullen-knop op paneel',
        ],
      },
      {
        nummer: 6,
        titel: 'Automatic Drilling starten',
        beschrijving: 'Start het automatische boorproces',
        waarschuwing: null,
        tip: null,
        substappen: [
          'Ga naar Bohle menu',
          'Selecteer "AUTOMATIC DRILLING"',
          'Druk "START"'
        ],
        afbeeldingen: [
          '/images/dwi/DWI-BOR-001/stap-13.jpg',
          '/images/dwi/DWI-BOR-001/stap-14.jpg',
        ],
        bijschrift: [
          'Bohle menu AUTOMATIC DRILLING',
          'START knop',
        ],
      },
      {
        nummer: 7,
        titel: 'Meten & keuren',
        beschrijving: 'Meet en keur het geboortte glas',
        waarschuwing: null,
        tip: 'Eerste stuk altijd controleren voordat de serie wordt gestart.',
        substappen: [
          'Pak Bahco 250mm liniaal',
          'Meet boorgatpositie',
          'Controleer afmetingen'
        ],
        afbeeldingen: [
          '/images/dwi/DWI-BOR-001/stap-15.jpg',
        ],
        bijschrift: [
          'Bahco 250mm liniaal meting',
        ],
      }
    ],
    afwijkingen: [
      {
        afwijking: 'Boorgat op verkeerde positie',
        oorzaak: 'SET 0 niet correct ingesteld',
        actie: 'Herhaal stap 5 met nieuw testglas'
      },
      {
        afwijking: 'Uitbrokkeling rond boorgat',
        oorzaak: 'Boor versleten of waterdruk te laag',
        actie: 'Boor vervangen, waterdruk controleren'
      },
      {
        afwijking: 'Machine stopt tijdens boren',
        oorzaak: 'Noodstop geactiveerd of storing',
        actie: 'Herhaal stap 2 (reset), controleer foutmelding'
      },
      {
        afwijking: 'Geen water tijdens boren',
        oorzaak: 'Kogelkranen niet open',
        actie: 'Stop machine! Herhaal stap 3'
      }
    ],
    zoektermen: 'boormachine bohle siemens weintek touchscreen boren opstarten set 0 nulpunt testglas'
  },

  // ============================================================================
  // DWI-SNI-001: Gelaagd Snijden iPlus/331 op Intermac Genius LM (Station 2)
  // ============================================================================
  {
    id: 'DWI-SNI-001',
    titel: 'Gelaagd Snijden iPlus/331 op Intermac Genius LM',
    station: 'SNI',
    stationNummer: 2,
    machine: 'Intermac Genius LM met Movetro glaslader',
    auteur: 'Hendry Kooistra',
    goedgekeurd: 'Erik Stroot',
    versie: '1.0',
    datum: '13-03-2026',
    volgendeReview: '13-09-2026',
    status: 'gereed',
    gereedschap: [
      'PerfectCut software',
      'Intermac Genius LM',
      'Movetro glaslader',
      'Printer'
    ],
    pbm: [
      'Veiligheidsschoenen',
      'Veiligheidsbril',
      'Snijbestendige handschoenen'
    ],
    secties: [
      {
        nummer: 1,
        titel: 'Voorbereiding',
        stappen: [
          {
            nummer: 1,
            titel: 'Systeem gereed maken',
            beschrijving: 'Controleer de voorbereiding van het snijsysteem',
            waarschuwing: null,
            tip: null,
            substappen: [
              'PC op stand "L" zetten',
              'Stoplichten controleren (groen)',
              'Beide PC\'s opstarten',
              'Niets onder lamineertafel'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-001/stap-01.jpg',
            ],
            bijschrift: [
              'Voorste computer op (L), sleutel omdraaien, stoplicht op groen',
            ],
          }
        ]
      },
      {
        nummer: 2,
        titel: 'Programma (PerfectCut)',
        stappen: [
          {
            nummer: 1,
            titel: 'Project aanmaken en configureren',
            beschrijving: 'Maak een nieuw project in PerfectCut en configureer de plaat',
            waarschuwing: null,
            tip: null,
            substappen: [
              'PerfectCut openen',
              'Klik "New project"',
              'Selecteer plaat: 3210 x 2550 mm',
              'Voer gewenste maten in',
              'Klik "Start processing"',
              'Project opslaan',
              'Bestand naar dati map verplaatsen'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-001/stap-02.jpg',
              '/images/dwi/DWI-SNI-001/stap-03.jpg',
              '/images/dwi/DWI-SNI-001/stap-04.jpg',
              '/images/dwi/DWI-SNI-001/stap-05.jpg',
              '/images/dwi/DWI-SNI-001/stap-06.jpg',
              '/images/dwi/DWI-SNI-001/stap-07.jpg',
              '/images/dwi/DWI-SNI-001/stap-09.jpg',
              '/images/dwi/DWI-SNI-001/stap-10.jpg',
            ],
            bijschrift: [
              'PerfectCut programma — voor handmatig snijden van 331 float/iPlus',
              'Free cut selecteren, material code 331 instellen',
              'Parameter 1 en 2 invullen, dan OK',
              'Bevestiging parameters',
              'PerfectCut: Project → New, platen selecteren (Stock rechts)',
              'Display loading transfer instelling',
              'Programma slepen naar dati → kw map',
              'Map kw openen, bestand naar dati slepen',
            ],
          }
        ]
      },
      {
        nummer: 3,
        titel: 'Plaat Laden (Movetro)',
        stappen: [
          {
            nummer: 1,
            titel: 'Glas laden en positioneren',
            beschrijving: 'Laad het glas in de Movetro glaslader',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Druk laadknop',
              'Druk doorstuurknop',
              'Vink uit (deselecteer)',
              'Druk groene knop',
              'Druk resetknop'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-001/stap-08.jpg',
              '/images/dwi/DWI-SNI-001/stap-11.jpg',
              '/images/dwi/DWI-SNI-001/stap-12.jpg',
              '/images/dwi/DWI-SNI-001/stap-13.jpg',
              '/images/dwi/DWI-SNI-001/stap-14.jpg',
            ],
            bijschrift: [
              'Knop ingedrukt houden tot Movetro start, KF stopt met knipperen',
              'Knop ingedrukt houden tot plaat op tafel ligt',
              'Vinkje uitzetten, groene knop drukken',
              'Zwarte knop resetten',
              'Programma openen in dati (PerfectCut moet afgesloten zijn)',
            ],
          }
        ]
      },
      {
        nummer: 4,
        titel: 'Snijproces (Free Cut)',
        stappen: [
          {
            nummer: 1,
            titel: 'Intermac Genius configureren en starten',
            beschrijving: 'Configureer de snijparameters in Intermac Genius',
            waarschuwing: 'PerfectCut moet gesloten zijn voordat u Intermac opent',
            tip: 'Controleer altijd het juiste mesje voor het glastype voordat u begint',
            substappen: [
              'Intermac Genius openen',
              'Printer inschakelen',
              'Ga naar Modify Family',
              'Selecteer "4iplus"',
              'Zet op "Removal Only"',
              'Voer parameters in',
              'Selecteer Material Code 331/442',
              'Controleer juiste mesje',
              'Plaats glas tegen gele knopjes',
              'Druk voetpedaal om snijden te starten'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-001/stap-15.jpg',
              '/images/dwi/DWI-SNI-001/stap-16.jpg',
              '/images/dwi/DWI-SNI-001/stap-17.jpg',
              '/images/dwi/DWI-SNI-001/stap-18.jpg',
              '/images/dwi/DWI-SNI-001/stap-19.jpg',
              '/images/dwi/DWI-SNI-001/stap-20.jpg',
              '/images/dwi/DWI-SNI-001/stap-21.jpg',
              '/images/dwi/DWI-SNI-001/stap-22.jpg',
              '/images/dwi/DWI-SNI-001/stap-23.jpg',
              '/images/dwi/DWI-SNI-001/stap-24.jpg',
              '/images/dwi/DWI-SNI-001/stap-25.jpg',
              '/images/dwi/DWI-SNI-001/stap-26.jpg',
              '/images/dwi/DWI-SNI-001/stap-50.jpg',
              '/images/dwi/DWI-SNI-001/stap-51.jpg',
            ],
            bijschrift: [
              'Printer boven op kast aanzetten',
              'Volledig programma printen',
              'Modify family → naar 4iplus (BELANGRIJK)',
              'Bevestiging family wijziging',
              'Druk op Yes',
              'Programma opslaan',
              'Removal only instelling, dan start',
              'Tekeningen voor berekeningen — 60mm rand eromheen',
              'Berekeningen detail',
              'Verdere berekeningen',
              'Eerste 2 maten invoeren, OK. Let op: 331 + juist mesje!',
              'Snijproces',
              'Nieuwe sequentie beginnen',
              'Glassoort instellen — meestal 331',
            ],
          }
        ]
      },
      {
        nummer: 5,
        titel: 'Afwerking',
        stappen: [
          {
            nummer: 1,
            titel: 'Breken en sorteren',
            beschrijving: 'Breek het glas en sorteer de delen',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Break het glas langs snijlijn',
              'Verplaats reststuk naar achteren',
              'Draai glas om'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-001/stap-27.jpg',
              '/images/dwi/DWI-SNI-001/stap-28.jpg',
              '/images/dwi/DWI-SNI-001/stap-29.jpg',
              '/images/dwi/DWI-SNI-001/stap-30.jpg',
              '/images/dwi/DWI-SNI-001/stap-31.jpg',
              '/images/dwi/DWI-SNI-001/stap-32.jpg',
              '/images/dwi/DWI-SNI-001/stap-33.jpg',
              '/images/dwi/DWI-SNI-001/stap-34.jpg',
              '/images/dwi/DWI-SNI-001/stap-35.jpg',
              '/images/dwi/DWI-SNI-001/stap-36.jpg',
              '/images/dwi/DWI-SNI-001/stap-37.jpg',
              '/images/dwi/DWI-SNI-001/stap-38.jpg',
              '/images/dwi/DWI-SNI-001/stap-39.jpg',
              '/images/dwi/DWI-SNI-001/stap-40.jpg',
              '/images/dwi/DWI-SNI-001/stap-52.jpg',
            ],
            bijschrift: [
              'Op pedaal drukken',
              'Sheet naar je toe brengen, links/rechts positioneren',
              'Tweede positionering',
              'Strak tegen gele knopjes, goed vasthouden + controleren',
              'Mesje boven de lijn controleren',
              'Instructies op scherm volgen',
              'Plaat loslaten na snijden — machine maakt proces af',
              'Reststuk ver genoeg naar achteren brengen, LET OP',
              'Sheet omdraaien voor andere kant',
              'Sheet weer strak tegen gele bandjes',
              'Controleren en cyclus herhalen',
              'Doorrekenen tot ramen/deuren er helemaal uit zijn',
              'Altijd reststuk weghalen aan einde cyclus',
              'Reststuk kan tussen machine vallen — OPLETTEN',
              'Repetities gebruiken bij zelfde maten meerdere keren',
            ],
          },
          {
            nummer: 2,
            titel: 'Troubleshooting bij problemen',
            beschrijving: 'Handel storingen af volgens procedure',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Druk zwarte resetknop bij storing',
              'Voer resetprogramma uit',
              'Controleer foutmeldingen'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-001/stap-41.jpg',
              '/images/dwi/DWI-SNI-001/stap-42.jpg',
              '/images/dwi/DWI-SNI-001/stap-43.jpg',
              '/images/dwi/DWI-SNI-001/stap-53.jpg',
              '/images/dwi/DWI-SNI-001/stap-54.jpg',
              '/images/dwi/DWI-SNI-001/stap-55.jpg',
              '/images/dwi/DWI-SNI-001/stap-56.jpg',
            ],
            bijschrift: [
              'Soms gaat sequentie mis → zwarte resetknop drukken',
              'Reset procedure',
              'Handje aanklikken, rood = fout. Van onder en rechts naar links uitzetten',
              'Voorbeeld: als er iets mis gaat',
              'Detail fout 1',
              'Detail fout 2',
              'Detail fout 3',
            ],
          }
        ]
      },
      {
        nummer: 6,
        titel: 'Mesjes & Onderhoud',
        stappen: [
          {
            nummer: 1,
            titel: 'Controleer en onderhoud werkstukken',
            beschrijving: 'Voer dagelijks onderhoud uit op mesjes en snijwielen',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Controleer Stanley mesje op slijtage',
              'Inspecteer snijwieltje',
              'Voer dagelijks onderhoud uit',
              'Noteer onderhoudslogboek'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-001/stap-44.jpg',
              '/images/dwi/DWI-SNI-001/stap-45.jpg',
              '/images/dwi/DWI-SNI-001/stap-46.jpg',
              '/images/dwi/DWI-SNI-001/stap-47.jpg',
              '/images/dwi/DWI-SNI-001/stap-48.jpg',
              '/images/dwi/DWI-SNI-001/stap-49.jpg',
            ],
            bijschrift: [
              'Kast openen, stanley mesje en snijmesjes checken',
              'Moertjes losdraaien, stanley mes eruit halen, controleren',
              'Snijmes controleren op soepelheid',
              '331 mesje (groter dan 442), pinnetje eruit, schoonblazen',
              'Kast dicht, sleutels omdraaien, beide computers checken',
              'Achterste PC sleutel ook omdraaien',
            ],
          }
        ]
      }
    ],
    materialen: [
      { naam: 'Gelaagd glas 331', samenstelling: '3mm + 3mm + 1mm PVB', mesje: 'Stanley mesje 331 (groter)', wieltje: 'Snijwieltje 331' },
      { naam: 'Gelaagd glas 442', samenstelling: '4mm + 4mm + 2mm PVB', mesje: 'Stanley mesje 442 (kleiner)', wieltje: 'Snijwieltje 442' }
    ],
    opmerkingenImportant: [
      'Family MOET "4iplus" zijn',
      'Bij 442 glas ander mesje dan bij 331',
      '60mm minimale rand overstek'
    ],
    afwijkingen: [
      {
        afwijking: 'Glas breekt tijdens snijden',
        oorzaak: 'Mesje versleten of verkeerde druk',
        actie: 'Controleer mesje, vervang indien nodig, pas parameters aan'
      },
      {
        afwijking: 'Scheef snijden',
        oorzaak: 'Glas niet recht tegen gele knopjes',
        actie: 'Reposicioneer glas, zorg voor goed contact'
      },
      {
        afwijking: 'Printer werkt niet',
        oorzaak: 'Niet aangesloten of papier op',
        actie: 'Controleer aansluiting en papiervoorraad'
      }
    ],
    zoektermen: 'gelaagd snijden iplus 331 442 intermac genius movetro perfectcut free cut lamineren'
  },

  // ============================================================================
  // DWI-SNI-002: Slijpschijf Vervangen (Station 2)
  // ============================================================================
  {
    id: 'DWI-SNI-002',
    titel: 'Slijpschijf Vervangen',
    station: 'SNI',
    stationNummer: 2,
    machine: 'Snijlijn slijpunit',
    auteur: 'Hendry Kooistra',
    goedgekeurd: 'Erik Stroot',
    versie: '1.0',
    datum: '13-03-2026',
    volgendeReview: '13-09-2026',
    status: 'gereed',
    gereedschap: [
      'Steeksleutel maat 4',
      'Steeksleutel maat 5',
      'Luchtspuit (optioneel)',
      'Slijpprogramma (PC bij tafel 1)'
    ],
    pbm: [
      'Veiligheidsschoenen',
      'Veiligheidsbril'
    ],
    secties: [
      {
        nummer: 1,
        titel: 'Voorbereiding',
        stappen: [
          {
            nummer: 1,
            titel: 'Controleer sticker en gereedschap',
            beschrijving: 'Verzamel alle benodigde informatie en materialen',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Controleer sticker bij PC voor schijfgegevens',
              'Controleer sticker op nieuwe schijf',
              'Open slijpprogramma op PC bij tafel 1',
              'Noteer code en diameter van oude schijf',
              'Leg gereedschap klaar (steeksleutels 4 en 5)'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-002/stap-17.jpg',
              '/images/dwi/DWI-SNI-002/stap-01.jpg',
              '/images/dwi/DWI-SNI-002/stap-02.jpg',
              '/images/dwi/DWI-SNI-002/stap-03.jpg',
            ],
            bijschrift: [
              'Machine uitzetten voordat je begint',
              'Sticker naast PC bij tafel 1 — welke slijpschijf we hebben',
              'Sticker op schijf — check met doos of het matcht',
              'Programma op PC waar je het kunt zien',
            ],
          }
        ]
      },
      {
        nummer: 2,
        titel: 'Demontage',
        stappen: [
          {
            nummer: 1,
            titel: 'Verwijder oude slijpschijf',
            beschrijving: 'Demonteer de versleten slijpschijf voorzichtig',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Klik op schijf-icoon in slijpprogramma',
              'Draai buitenkap los',
              'Maak 3 bevestigingsbouten los (maat 4 + maat 5)',
              'Verwijder oude schijf zorgvuldig'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-002/stap-04.jpg',
              '/images/dwi/DWI-SNI-002/stap-05.jpg',
              '/images/dwi/DWI-SNI-002/stap-06.jpg',
              '/images/dwi/DWI-SNI-002/stap-07.jpg',
            ],
            bijschrift: [
              'Klik op deze optie',
              'Draai deze los',
              'Deze 3 mogen ook los — sleutel 4 (eerste) en sleutel 5 (tweede)',
              'Hier is die leeg (oude schijf eruit)',
            ],
          }
        ]
      },
      {
        nummer: 3,
        titel: 'Montage',
        stappen: [
          {
            nummer: 1,
            titel: 'Installeer nieuwe slijpschijf',
            beschrijving: 'Plaats de nieuwe schijf en zorg voor correcte vastlegging',
            waarschuwing: 'ALTIJD markering/platte kant aan BINNENZIJDE plaatsen! Geen beweging/speling na montage.',
            tip: null,
            substappen: [
              'Pak nieuwe schijf uit doos',
              'Verwijder beschermingssticker',
              'Plaats schijf in houder (markering/platte kant BINNENZIJDE)',
              'Zet borgring terug',
              'Draai bevestigingsbouten KRUISLINGS aan (als autoband)',
              'Controleer: GEEN beweging of speling!',
              'Draai buitenkap terug'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-002/stap-08.jpg',
              '/images/dwi/DWI-SNI-002/stap-09.jpg',
              '/images/dwi/DWI-SNI-002/stap-10.jpg',
              '/images/dwi/DWI-SNI-002/stap-11.jpg',
              '/images/dwi/DWI-SNI-002/stap-12.jpg',
              '/images/dwi/DWI-SNI-002/stap-13.jpg',
            ],
            bijschrift: [
              'Nieuwe erin, sticker eraf',
              'Plaatje er weer op, deze kant aan de binnenzijde',
              'Vastzetten als een autoband',
              'Goed aandraaien',
              'Mag geen beweging in zitten — voel na, anders zit het verkeerd',
              'Buitenkant er weer op en goed vastdraaien',
            ],
          }
        ]
      },
      {
        nummer: 4,
        titel: 'Software Update',
        stappen: [
          {
            nummer: 1,
            titel: 'Update slijpprogramma',
            beschrijving: 'Voer schijfgegevens in het slijpprogramma in',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Voer code (van sticker) in slijpprogramma in',
              'Druk OK',
              'Diameter wordt automatisch aangepast',
              'Controleer juiste waarden zijn ingesteld'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-002/stap-14.jpg',
              '/images/dwi/DWI-SNI-002/stap-15.jpg',
              '/images/dwi/DWI-SNI-002/stap-16.jpg',
            ],
            bijschrift: [
              'Zelfde code hier invoeren',
              'Druk op OK',
              'Diameter wordt automatisch aangepast',
            ],
          }
        ]
      },
      {
        nummer: 5,
        titel: 'Testen',
        stappen: [
          {
            nummer: 1,
            titel: 'Test met proefstuk glas',
            beschrijving: 'Controleer werking met een testglas',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Voer testronde uit met proefstuk glas',
              'Controleer slijpkwaliteit (glad, geen uitbrokkeling)',
              'Check op trillingen',
              'Bij problemen: controleer of schijf vast zit en code correct'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-002/stap-19.jpg',
              '/images/dwi/DWI-SNI-002/stap-20.jpg',
            ],
            bijschrift: [
              'Aanvullende info',
              'Laatste stap is testen',
            ],
          },
          {
            nummer: 2,
            titel: 'Rapportage',
            beschrijving: 'Rapporteer problemen en zorg voor vervanging',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Bij problemen: melden bij teamleider',
              'Na gebruik: nieuwe schijf bestellen'
            ],
            afbeeldingen: [
              '/images/dwi/DWI-SNI-002/stap-18.jpg',
            ],
            bijschrift: [
              'Vervangen? Bestel nieuwe!',
            ],
          }
        ]
      }
    ],
    kpis: [
      'Stickercodes moeten matchen',
      'Geen beweging na montage',
      'Diameter automatisch aangepast'
    ],
    opmerkingenImportant: [
      'ALTIJD code controleren vóór montage',
      'GEEN beweging/speling na montage',
      'Kruislings aandraaien (als autoband)',
      'Na gebruik nieuwe bestellen'
    ],
    afwijkingen: [
      {
        afwijking: 'Schijf wil niet in houder passen',
        oorzaak: 'Markering niet aan binnenzijde gericht',
        actie: 'Verwijder schijf, orienteer correct, plaats opnieuw'
      },
      {
        afwijking: 'Beweging/speling na montage',
        oorzaak: 'Bouten niet stevig genoeg aangedraaid',
        actie: 'Draai bouten opnieuw kruislings aan'
      },
      {
        afwijking: 'Slijpkwaliteit slecht',
        oorzaak: 'Schijf niet correct geklmd of code fout',
        actie: 'Controleer montage en code in slijpprogramma'
      }
    ],
    zoektermen: 'slijpschijf vervangen snijlijn slijpen onderhoud montage demontage steeksleutel'
  },

  // ============================================================================
  // DWI-ISO-POL-001: Polysun Assemblage (Station 9: ISO-lijn)
  // ============================================================================
  {
    id: 'DWI-ISO-POL-001',
    titel: 'Polysun Assemblage',
    station: 'ISO',
    stationNummer: 9,
    machine: 'Handmatige assemblage + Bestmachina',
    auteur: 'Simone Hamberg',
    goedgekeurd: 'Erik Stroot',
    versie: '1.0',
    datum: '15-03-2026',
    volgendeReview: '15-09-2026',
    status: 'gereed',
    gereedschap: [
      'Alcohol (reinigingsmiddel)',
      'Bestmachina',
      'Foampjes',
      'Hoekjes',
      'Productiestickers'
    ],
    pbm: [
      'Veiligheidsschoenen',
      'Schone handschoenen'
    ],
    secties: [
      {
        nummer: 1,
        titel: 'Ontvangst',
        stappen: [
          {
            nummer: 1,
            titel: 'Sorteer en controleer pakketten',
            beschrijving: 'Ontvang en sorteer Pellini-pakketten per batch',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Pellini-pakketten sorteren op batchnummer',
              'Locatie: bij zaagafdeling',
              'Glas per batch apart gesneden',
              'Controleer: batchnummers matchen'
            ]
          }
        ]
      },
      {
        nummer: 2,
        titel: 'Voorbereiding',
        stappen: [
          {
            nummer: 1,
            titel: 'Pak uit en reinig',
            beschrijving: 'Bereid de onderdelen voor montage voor',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Pak Pellini-pakket uit',
              'Verwijder plastic verpakking',
              'Laat beschermfolie eraan zitten',
              'Duw hoekjes in raam indrukken',
              'Schoonmaken: frame met alcohol reinigen'
            ]
          }
        ]
      },
      {
        nummer: 3,
        titel: 'Frame-assemblage',
        stappen: [
          {
            nummer: 1,
            titel: 'Monteer hoekjes en foampjes',
            beschrijving: 'Bereid frame voor butylering',
            waarschuwing: 'Foampjes ALLEEN aan 3 zijden aanbrengen (links, rechts, onder). NIET aan bovenzijde!',
            tip: null,
            substappen: [
              'Verwijder beschermfolie',
              'Haal frame los',
              'Plaats hoekjes in raamhoeken',
              'Breng foampjes aan op 3 zijden:',
              '  - Links',
              '  - Rechts',
              '  - Onder',
              '  [NIET bovenzijde!]'
            ]
          }
        ]
      },
      {
        nummer: 4,
        titel: 'Butyleren',
        stappen: [
          {
            nummer: 1,
            titel: 'Voorbereiding vulplek',
            beschrijving: 'Zet de butylering gereed',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Ga naar vulplek',
              'Schoonmaken: oppervlak met alcohol reinigen',
              'Droogkorrels vullen'
            ]
          },
          {
            nummer: 2,
            titel: 'Butyl aanbrengen met Bestmachina',
            beschrijving: 'Extrudeer butyl volgens parameters',
            waarschuwing: 'NOOIT boven 6 bar druk! Bovenzijde NIET vullen!',
            tip: null,
            substappen: [
              'Zet Bestmachina aan',
              'Butyl aanbrengen: ~4 gram per meter',
              'Druk: max 6 bar',
              'Stelschroeven: evt. half open zetten',
              'Start extrusieproces',
              'Na Polysun-batch: Bestmachina terugstellen'
            ]
          }
        ]
      },
      {
        nummer: 5,
        titel: 'Ophangen',
        stappen: [
          {
            nummer: 1,
            titel: 'Hang assemblage op en documenteer',
            beschrijving: 'Zet de gereedde ruiten vast per batch',
            waarschuwing: 'Assemblage moet binnen 24 uur verwerkt worden (liefst dezelfde dag)',
            tip: null,
            substappen: [
              'Direct ophangen na butylering',
              'Organiseren per batch',
              'Productiesticker erbij plakken',
              'Tijdstempel: assemblage < 24 uur'
            ]
          }
        ]
      },
      {
        nummer: 6,
        titel: 'Manco-procedure',
        stappen: [
          {
            nummer: 1,
            titel: 'Handel ontbrekende onderdelen af',
            beschrijving: 'Procedure voor onvolledige of beschadigde sets',
            waarschuwing: null,
            tip: null,
            substappen: [
              'Markeer met rood kruis op formulier',
              'Noteer "Nog manco" (ontbrekend)',
              'Leg mapje "Manco Polysun" aan',
              'Bewaar productiesticker',
              'Verwerk alsnog bij volgende ontvangst',
              'Volg vervolgprocedure op'
            ]
          }
        ]
      }
    ],
    materialen: [
      { naam: 'Screen-pakketten', variant: 'Pellini' },
      { naam: 'Polysun-ruiten', variant: 'Intern snijlijn' },
      { naam: 'Foampjes', variant: '3-zijdig' },
      { naam: 'Butyl', variant: '~4 g/m' },
      { naam: 'Hoekjes', variant: 'Standaard' },
      { naam: 'Alcohol', variant: 'Reinigingsmiddel' }
    ],
    opmerkingenImportant: [
      'Bovenzijde NIET vullen met foampjes',
      'NOOIT boven 6 bar butylering',
      'Assemblage < 24 uur (liefst dezelfde dag)',
      'Na Polysun-batch Bestmachina terugstellen',
      'Batchnummers moeten matchen'
    ],
    afwijkingen: [
      {
        afwijking: 'Foampjes aan bovenzijde',
        oorzaak: 'Fout in voorbereiding',
        actie: 'Verwijder foampje van bovenzijde, plaats alleen aan 3 zijden'
      },
      {
        afwijking: 'Butyl niet uniform',
        oorzaak: 'Druk niet correct of Bestmachina niet goed ingesteld',
        actie: 'Controleer druk (max 6 bar), reset stelschroeven'
      },
      {
        afwijking: 'Ontbrekende onderdelen',
        oorzaak: 'Pellini-pakket onvolledig',
        actie: 'Markeer "Manco", leg apart, volg manco-procedure'
      },
      {
        afwijking: 'Montage langer dan 24 uur',
        oorzaak: 'Vertraging in proces',
        actie: 'Melden bij teamleider, mogelijk verwerken volgende dag'
      }
    ],
    zoektermen: 'polysun assemblage iso lijn lamellen screens pellini butyl foampjes bestmachina manco'
  }
];

// ============================================================================
// Export utility functions
// ============================================================================

export const getStationByCode = (code) => {
  return STATIONS.find(s => s.code === code);
};

export const getWerkinstructieById = (id) => {
  return WERKINSTRUCTIES.find(wi => wi.id === id);
};

export const getWerkinstructiesByStation = (stationCode) => {
  if (stationCode === 'alle') {
    return WERKINSTRUCTIES;
  }
  return WERKINSTRUCTIES.filter(wi => wi.station === stationCode);
};

export const getAllStations = () => {
  return STATIONS;
};

export const getAllWerkinstructies = () => {
  return WERKINSTRUCTIES;
};

export const searchWerkinstructies = (query) => {
  const q = query.toLowerCase();
  return WERKINSTRUCTIES.filter(wi => {
    return (
      wi.titel.toLowerCase().includes(q) ||
      wi.machine.toLowerCase().includes(q) ||
      wi.zoektermen.toLowerCase().includes(q) ||
      wi.id.toLowerCase().includes(q)
    );
  });
};
