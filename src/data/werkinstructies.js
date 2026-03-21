/**
 * Werkinstructies data — Timmermans Hardglas B.V.
 *
 * Stations:
 *  1. ONT - Ontvangst
 *  2. SNI - Snijlijn
 *  3. CNC - CNC/Boren
 *  4. SLI - Slijpen
 *  5. WSS - Wassen
 *  6. ESG - Hardoven
 *  7. VSG - Lamineren
 *  8. ISO - ISO-lijn
 *  9. QC  - Inspectie
 * 10. EXP - Expeditie
 */

export const stations = [
  { code: 'alle', label: 'Alle stations', nummer: null },
  { code: 'ONT', label: 'Ontvangst', nummer: 1 },
  { code: 'SNI', label: 'Snijlijn', nummer: 2 },
  { code: 'CNC', label: 'CNC/Boren', nummer: 3 },
  { code: 'SLI', label: 'Slijpen', nummer: 4 },
  { code: 'WSS', label: 'Wassen', nummer: 5 },
  { code: 'ESG', label: 'Hardoven', nummer: 6 },
  { code: 'VSG', label: 'Lamineren', nummer: 7 },
  { code: 'ISO', label: 'ISO-lijn', nummer: 8 },
  { code: 'QC', label: 'Inspectie', nummer: 9 },
  { code: 'EXP', label: 'Expeditie', nummer: 10 },
]

export const werkinstructies = [
  {
    id: 'DWI-CNC-001',
    titel: 'Boormachine Opstarten & Instellen',
    station: 'CNC',
    stationLabel: 'Station 3 \u00b7 CNC / Boren',
    machine: 'Bohle boormachine (Siemens SIMATIC + WEINTEK)',
    samenvatting:
      '7 fasen: inschakelen \u2192 resetten \u2192 water \u2192 tafel \u2192 SET 0 \u2192 drilling \u2192 meten',
    versie: '1.0',
    datum: '10-03-2026',
    auteur: 'Alex Tabarcia',
    goedgekeurdDoor: 'Erik Stroot',
    status: 'gereed',
    zoektermen: 'boormachine boren cnc opstarten instellen bohle siemens weintek',
    stappen: [
      {
        nummer: 1,
        titel: 'Machine inschakelen',
        beschrijving:
          'Druk op de groene startknop aan de rechterzijde van de machine. Wacht tot het WEINTEK-touchscreen volledig is opgestart (ca. 30 seconden).',
        waarschuwing: null,
        tip: 'Het touchscreen toont het Bohle-logo wanneer het systeem gereed is.',
      },
      {
        nummer: 2,
        titel: 'Tafel resetten',
        beschrijving:
          'Druk de noodstop in en weer uit (kwartslag draaien). Druk vervolgens op de blauwe resetknop. Op het WEINTEK-scherm verschijnt "Machine gereset".',
        waarschuwing:
          'Controleer of er geen glas of gereedschap op de tafel ligt voordat je reset.',
        tip: null,
      },
      {
        nummer: 3,
        titel: 'Watertoevoer openen',
        beschrijving:
          'Open de twee waterkranen onder de machine door ze in horizontale positie te zetten. Controleer of water uit de boorkoppen stroomt.',
        waarschuwing:
          'Zonder water raken de boorkronen oververhit en beschadigen ze het glas.',
        tip: null,
      },
      {
        nummer: 4,
        titel: 'Tafelbeweging inschakelen',
        beschrijving:
          'Activeer de tafelbeweging via het WEINTEK-touchscreen: Menu \u2192 Tafel \u2192 Inschakelen. De tafel beweegt nu naar de startpositie.',
        waarschuwing: null,
        tip: null,
      },
      {
        nummer: 5,
        titel: 'Referentiepunt instellen (SET 0)',
        beschrijving:
          'Stel het referentiepunt in op X=60, Y=27 via het WEINTEK-scherm. Dit is het standaard nulpunt voor de Bohle boormachine.',
        waarschuwing: null,
        tip: 'Controleer de waarden altijd bij de eerste run van de dag.',
      },
      {
        nummer: 6,
        titel: 'Automatisch boren starten',
        beschrijving:
          'Plaats het glasstuk op de tafel tegen de aanslag. Druk op de groene startknop op het touchscreen om het boorprogramma te starten.',
        waarschuwing:
          'Draag altijd veiligheidsbril en gehoorbescherming tijdens het boren.',
        tip: null,
      },
      {
        nummer: 7,
        titel: 'Eerste stuk meten & controleren',
        beschrijving:
          'Meet de boorgaten met een schuifmaat. Controleer: diameter, positie (X/Y), loodrechtheid en braamvorming. Registreer de meetwaarden op het controleformulier.',
        waarschuwing: null,
        tip: 'Bij afwijking > 0.5mm: stop productie en meld aan de kwaliteitsafdeling.',
      },
    ],
    pbm: ['Veiligheidsbril', 'Gehoorbescherming', 'Veiligheidsschoenen', 'Snijbestendige handschoenen'],
    gereedschap: ['Schuifmaat', 'Controleformulier', 'Schoonmaakdoek'],
  },
  {
    id: 'DWI-ISO-POL-001',
    titel: 'Polysun Assemblage',
    station: 'ISO',
    stationLabel: 'Station 8 \u00b7 ISO-lijn',
    machine: 'Handmatige assemblage',
    samenvatting:
      'Ontvangst \u2192 Voorbereiding \u2192 Assemblage \u2192 Butyleren \u2192 Ophangen \u2192 Manco afhandeling',
    versie: '1.0',
    datum: '15-03-2026',
    auteur: 'Alex Tabarcia',
    goedgekeurdDoor: 'Erik Stroot',
    status: 'gereed',
    zoektermen: 'polysun assemblage iso lijn lamineren isolatieglas pellini butyl',
    stappen: [
      {
        nummer: 1,
        titel: 'Ontvangst materialen',
        beschrijving:
          'Controleer de binnenkomende Polysun-schermen van leverancier Pellini op beschadigingen, aantallen en maatvoering. Registreer ontvangst in het systeem.',
        waarschuwing: 'Beschadigde schermen direct apart zetten en melden.',
        tip: null,
      },
      {
        nummer: 2,
        titel: 'Voorbereiding werkplek',
        beschrijving:
          'Reinig het werkoppervlak met alcohol. Zorg dat alle benodigde materialen (butylband, schuim, glasplaten) binnen handbereik staan.',
        waarschuwing: null,
        tip: 'Gebruik isopropylalcohol (IPA) voor een vetvrij oppervlak.',
      },
      {
        nummer: 3,
        titel: 'Assemblage Polysun-scherm',
        beschrijving:
          'Plaats het Polysun-scherm op de glasplaat volgens het productieorder. Let op de ori\u00ebntatie (bovenzijde gemarkeerd). Druk het scherm stevig aan.',
        waarschuwing:
          'Draag schone handschoenen om vingerafdrukken op het glas te voorkomen.',
        tip: null,
      },
      {
        nummer: 4,
        titel: 'Butyleren',
        beschrijving:
          'Breng butylband aan langs de randen van het isolatieglas. Dikte: 4 gram per strekkende meter. Druk: maximaal 6 bar.',
        waarschuwing: 'Overschrijd nooit 6 bar persdruk.',
        tip: 'Controleer de butyldikte met een diktemeter bij elk 10e stuk.',
      },
      {
        nummer: 5,
        titel: 'Ophangen in droogrek',
        beschrijving:
          'Hang het afgewerkte isolatieglas in het droogrek. Zorg voor minimaal 5mm ruimte tussen de glasplaten. Markeer met productieordernummer.',
        waarschuwing: null,
        tip: 'Maximale droogtijd: 24 uur voordat het naar de volgende stap gaat.',
      },
      {
        nummer: 6,
        titel: "Manco's afhandelen",
        beschrijving:
          "Bij ontbrekende of beschadigde materialen: registreer een manco in het systeem. Neem contact op met de planner voor een vervangende order.",
        waarschuwing: null,
        tip: null,
      },
    ],
    pbm: ['Schone handschoenen', 'Veiligheidsbril', 'Veiligheidsschoenen'],
    gereedschap: ['Diktemeter', 'Isopropylalcohol', 'Schoonmaakdoek', 'Butylpistool'],
  },
]
