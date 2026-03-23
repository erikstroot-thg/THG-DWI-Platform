// THG Knowledge Base — Bedrijfscontext voor AI DWI-generatie
// Dit bestand wordt automatisch meegegeven aan Claude bij het genereren/verrijken van DWI's.
// Bewerkbaar via Beheer → Instellingen in de DWI-app.

export const THG_KNOWLEDGE_BASE = {
  bedrijf: {
    naam: "Timmermans Hardglas B.V.",
    locatie: "Handelsstraat 57, Hardenberg, Overijssel, Nederland",
    oprichting: 1992,
    industrie: "Glasverwerking — maatwerk hardglas voor bouw en industrie",
    directie: ["René van Dijk (Algemeen directeur)", "Erik Timmermans (Eigenaar)", "Marijn Stelpstra (Manager Sales & Supply Chain)"],
    kwaliteitsleider: "Erik Stroot",
    capaciteit: "~25 ton glas per week",
    werktijden: "06:00–22:00, 5 dagen per week",
    software: "A+W (glasindustrie-standaard)",
    medewerkers: "~14",
    leverbetrouwbaarheid: "99%",
    certificeringen: [
      "CE-keurmerk op gehard/gelaagd glas",
      "NEN-EN 12150-1 (thermisch gehard veiligheidsglas)",
      "EN 14449 (gelaagd veiligheidsglas)",
      "EN 1279-5 (isolatieglas)",
      "RVO meldcode KA29779 (E-save TriPlus)",
      "AGC Recognized Processor (gelakt glas)",
    ],
    machineleverancier: "Pieterman Glas- en Steentechniek (Vlaardingen) — hofleverancier machinepark",
    onderhoud: "Preventief onderhoud 2x per jaar + op basis van draaiuren",
  },

  productgroepen: [
    {
      naam: "Hardglas (ESG)",
      beschrijving: "Thermisch gehard veiligheidsglas. Verhit tot 680°C, gecontroleerd afgekoeld. Grotere weerstand tegen fysieke en thermische schokken. Breekt in kleine onscherpe stukjes.",
      toepassingen: ["Bouw", "Industrie", "Maatwerk"],
    },
    {
      naam: "Gehard/Gelaagd glas (VSG)",
      beschrijving: "Volledig in eigen huis geproduceerd met hardingsoven en hypermoderne autoclaaf. CE-gekeurmerkt.",
      folieTypes: ["PVB (Polyvinylbutyral — standaard)", "EVA (Ethyleen-vinylacetaat — outdoor/vocht)", "SentryGlas (100x stijver, 5x harder)"],
      varianten: ["Gelamineerd vacuümglas", "BENG vacuümglas", "FINEO vacuümglas", "Monumentaal glas met Restover"],
      toepassingen: ["Balustrades", "Beloopbaar glas", "Vitrineglas", "Glastafels", "Mesh/metaal tussenlagen"],
    },
    {
      naam: "E-Save Isolatieglas",
      beschrijving: "Energiebesparend isolatieglas voor alle toepassingen. Superspacer T-Shape warm edge technologie (Forel robot). Eerste glasfabriek in NL met deze techniek.",
      varianten: ["Dubbelglas", "Triple glas (HR+++ U-waarde 0.9 W/m²K)", "Polysun zonwering-in-isolatieglas"],
      gasvulling: ["Argon", "Krypton"],
      rvoMeldcode: "KA29779 — E-save TriPlus 1.0 argon 4/10/4/12/4 (U-waarde 0.7 W/m²K)",
    },
    {
      naam: "Klep-, Val- en Draairamen (KVD)",
      beschrijving: "Onderhoudsvrije ramen. Hoeven niet geschilderd te worden, eenvoudig en snel te monteren.",
    },
    {
      naam: "Preventie Glas",
      beschrijving: "In samenwerking met Smelt Preventie Glas. Spatschermen en afscheidingen.",
    },
    {
      naam: "Timeless Glas",
      beschrijving: "Beschermd tegen kalkaanslag en vuil door innovatieve coating aangebracht tijdens productie.",
    },
    {
      naam: "Gehard Gelakt Glas",
      beschrijving: "Voor interieur en exterieur. Gevelbekleding, etalages, borstweringen. 7 standaardkleuren op voorraad. AGC Recognized Processor.",
    },
  ],

  stations: {
    ONT: {
      naam: "Ontvangst",
      nummer: 1,
      beschrijving: "Glas ontvangen, kwaliteitscontrole inkomend materiaal",
      machines: ["Rollenbaan"],
      processen: ["Glas ontvangen", "Inkomende kwaliteitscontrole", "Sortering op productieorder"],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Snijbestendige handschoenen"],
    },
    SNI: {
      naam: "Snijlijn",
      nummer: 2,
      beschrijving: "Vlakglas en gelaagd glas op maat snijden. Intermac Genius snijlijn met automatische Movetro glaslader.",
      machines: [
        "Intermac Genius LM (automatische snijlijn)",
        "Intermac Genius CT",
        "Movetro glaslader (automatische glasbelading)",
      ],
      software: ["PerfectCut (snijontwerp)", "Intermac Genius (snijbesturing)", "A+W (orderverwerking)"],
      processen: ["Vlakglas snijden", "Gelaagd snijden (331/442/iPlus)", "Breeklijn snijden", "Free Cut modus"],
      materialen: {
        "331 Float": { samenstelling: "3mm + 3mm + 1mm PVB", mesje: "Stanley mesje 331 (groter)", wieltje: "Snijwieltje 331", code: "331" },
        "442 Float": { samenstelling: "4mm + 4mm + 2mm PVB", mesje: "Stanley mesje 442 (kleiner)", wieltje: "Snijwieltje 442", code: "442" },
        "iPlus": { family: "4iplus", opmerking: "Family setting MOET '4iplus' zijn in Intermac Genius" },
      },
      kritischRegels: [
        "331 glas = 331 mesje (NOOIT mixen)",
        "PerfectCut MOET gesloten zijn voordat Intermac Genius geopend wordt",
        "Family instelling MOET '4iplus' zijn voor iPlus/gelaagd",
        "60mm marge rondom bij berekeningen",
        "Restglas kan in machine vallen — EXTREME VOORZICHTIGHEID",
      ],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Snijbestendige handschoenen"],
    },
    CNC: {
      naam: "CNC",
      nummer: 3,
      beschrijving: "CNC-bewerking van glasplaten: slijpen, gaten frezen, randen polijsten. 4 brede Intermac CNC-machines.",
      machines: [
        "Intermac Master Edge (horizontale CNC)",
        "Intermac CNC 5-as (geüpgraded van 3-as — verbeterde software en gereedschapsopslag)",
        "Intermac CNC (4 brede machines totaal — slijpen, frezen, polijsten)",
      ],
      processen: ["Randbewerking", "Vormsnijden", "Gaten frezen", "Randen polijsten", "Uitsparingen frezen"],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Snijbestendige handschoenen", "Gehoorbescherming"],
    },
    BOR: {
      naam: "Boren",
      nummer: 4,
      beschrijving: "Gaten boren in glasplaten met Bohle boormachine. Siemens SIMATIC besturing met WEINTEK touchscreen.",
      machines: [
        "Bohle boormachine (Siemens SIMATIC + WEINTEK touchscreen)",
      ],
      processen: ["Boren", "Boormaat instellen (SET 0)", "Tafel resetten", "Automatisch boorprogramma"],
      parameters: {
        "SET 0 standaard": { X: 60, Y: 27 },
        "Koelwater": "Verplicht — 2 groene kogelkranen open voordat boren mag starten",
      },
      gereedschap: ["Bahco 250mm liniaal", "Testglas (altijd gebruiken bij SET 0)"],
      kritischRegels: [
        "Geen watercirculatie = STOPPEN met boren",
        "Testglas verplicht bij elke SET 0 kalibratie",
        "Braamvorming rond boorgaten controleren",
      ],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Snijbestendige handschoenen"],
    },
    SLI: {
      naam: "Slijpen",
      nummer: 5,
      beschrijving: "Randbewerking en slijpen van glasplaten.",
      machines: ["Slijpmachine", "Slijpunit (onderdeel snijlijn)"],
      processen: ["Randbewerking", "Slijpen", "Polijsten"],
      onderhoud: {
        slijpschijf: "Markering/platte kant NAAR BINNEN monteren. GEEN speling na montage. Code in software invoeren (diametercompensatie).",
      },
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Snijbestendige handschoenen", "Gehoorbescherming"],
    },
    WSS: {
      naam: "Wassen",
      nummer: 6,
      beschrijving: "Industriële glasreiniging voorafgaand aan harden of lamineren.",
      machines: ["Wasmachine (industrieel)"],
      processen: ["Glasreiniging", "Droging", "Kwaliteitscontrole schoon oppervlak"],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril"],
    },
    ESG: {
      naam: "Hardoven",
      nummer: 7,
      beschrijving: "Thermisch harden van glas. Verhitting tot 680°C, gecontroleerde afkoeling. Eigen hardingsoven.",
      machines: ["Hardingsoven (eigen)", "Tamglass (vermoedelijk)"],
      processen: ["Thermisch harden (680°C)", "Gecontroleerde afkoeling", "Heat-soak test"],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Hittebestendige handschoenen", "Gehoorbescherming"],
    },
    VSG: {
      naam: "Lamineren",
      nummer: 8,
      beschrijving: "Lamineren van glasplaten met PVB/EVA folie. Hypermoderne autoclaaf voor vacuümlaminering.",
      machines: ["Lamineeroven", "Autoclaaf (hypermodern)", "Vacuümlaminering"],
      processen: ["Lamineren", "PVB/EVA folie aanbrengen", "Autoclaaf cyclus", "Vacuümglas laminering (BENG, FINEO)"],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Hittebestendige handschoenen"],
    },
    ISO: {
      naam: "ISO-lijn",
      nummer: 9,
      beschrijving: "Isolatieglas assemblage. Polysun zonwering-in-isolatieglas. Lisec isolatielijn.",
      machines: [
        "Lisec isolatielijn",
        "Forel robot (automatische Superspacer T-Shape applicatie — warm edge)",
        "Bestmachina (butylextrusie)",
        "Polysun assemblage-unit",
      ],
      processen: ["Isolatieglas assemblage", "Gasvulling (argon/krypton)", "Superspacer T-Shape applicatie", "Polysun assemblage", "Butyleren"],
      materialen: {
        "Pellini packages": "Extern geleverde componenten (lamellen, screens, accessoires)",
        "Butyl": "4 g/m doelwaarde, max 6 bar druk, bovenkant NIET vullen",
        "Foampjes": "Droogvulling spacers — 3 zijden: links, rechts, onder (NIET boven)",
      },
      kritischRegels: [
        "Butyldruk NOOIT boven 6 bar",
        "Bovenkant NOOIT vullen met butyl",
        "Foampjes op 3 zijden (links, rechts, onder — NIET boven)",
        "Batchnummer glas MOET overeenkomen met Pellini-batchnummer",
        "Verwerking binnen 24 uur (bij voorkeur zelfde dag)",
      ],
      pbm: ["Veiligheidsschoenen", "Schone handschoenen"],
    },
    QC: {
      naam: "Inspectie",
      nummer: 10,
      beschrijving: "Visuele kwaliteitscontrole en heat-soak tests.",
      machines: ["Inspectietafel", "Heat-soak oven"],
      processen: ["Visuele inspectie", "Heat-soak test", "Maatcontrole", "Kwaliteitsregistratie"],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril"],
    },
    EXP: {
      naam: "Expeditie",
      nummer: 11,
      beschrijving: "Verpakking en verzending van eindproducten.",
      machines: ["Glasbok (transportrek)", "Vrachtwagen belading"],
      processen: ["Verpakken", "Glasbok laden", "Vrachtbrieven", "Expeditie"],
      pbm: ["Veiligheidsschoenen", "Veiligheidsbril", "Snijbestendige handschoenen"],
    },
  },

  veiligheid: {
    altijd: ["Veiligheidsschoenen (alle stations)", "Veiligheidsbril (bij glasbewerking)"],
    glasbewerking: ["Snijbestendige handschoenen"],
    oven: ["Hittebestendige handschoenen", "Gehoorbescherming"],
    lawaai: ["Gehoorbescherming (CNC, slijpen, hardoven)"],
    chemisch: ["Ademhalingsbescherming (indien van toepassing)"],
    schoon: ["Schone handschoenen (ISO-lijn, lamineren)"],
  },

  glasSoorten: {
    "ESG (hardglas)": "Thermisch gehard veiligheidsglas, 680°C behandeld",
    "VSG (gelaagd glas)": "Gelamineerd glas met PVB/EVA tussenlaag",
    "Float glas": "Onbewerkt vlakglas, basis voor alle bewerkingen",
    "331 Float": "3mm + 3mm + 1mm PVB laminaat",
    "442 Float": "4mm + 4mm + 2mm PVB laminaat",
    "iPlus": "Gelaagd glas variant, family '4iplus' in Intermac",
    "Isolatieglas": "Dubbelglas of triple glas met gasvulling",
    "Triple glas": "HR+++ driedubbel glas, U-waarde 0.9 W/m²K",
    "Vacuümglas": "BENG/FINEO vacuümlaminering in autoclaaf",
    "Timeless glas": "Anti-kalk coating, onderhoudsvrij",
    "Gelakt glas": "Gehard glas met keramische lak, 7 standaardkleuren, AGC assortiment",
    "Halfgehard glas": "Heat-strengthened glas, minder sterk dan ESG maar breekt in grote stukken",
    "SentryGlas": "Hoogwaardige laminaatfolie, 100x stijver dan PVB, voor structurele toepassingen",
    "Superspacer T-Shape": "Warm edge spacer profiel voor isolatieglas, betere isolatiewaarde",
    "Energy 72/38": "Low-E glastype op voorraad in 6mm, voor isolatieglas productie",
  },

  industrieTerminologie: {
    "ESG": "Einscheiben-Sicherheitsglas (gehard glas)",
    "VSG": "Verbund-Sicherheitsglas (gelaagd glas)",
    "PVB": "Polyvinylbutyral (tussenlaag in gelaagd glas)",
    "EVA": "Ethyleen-vinylacetaat (alternatieve tussenlaag)",
    "U-waarde": "Warmtedoorgangscoëfficiënt (lager = beter isolerend)",
    "LTA": "Lichttransmissie (% licht doorgelaten)",
    "ZTA": "Zonnetoetreding (% zonne-energie doorgelaten)",
    "Heat-soak": "Nabehandeling om NiS-insluitsels te detecteren",
    "NiS": "Nikkel-sulfide insluitsels (oorzaak spontane breuk)",
    "Butyl": "Afdichtingsmateriaal voor isolatieglas",
    "SET 0": "Nulpuntkalibratie bij boormachine",
    "KVD": "Klep-, Val- en Draairamen",
  },
}

// ==========================================================================
// THG_CONTEXT — Werkvloerkennis & cultuur voor AI DWI-generatie
// Bron: operatorinterviews, kwaliteitsleider Erik Stroot
// ==========================================================================
export const THG_CONTEXT = {
  company: {
    name: "Timmermans Hardglas B.V.",
    sector: "Glasverwerking",
    core_activity: "Bewerken en assembleren van vlakglas tot eindproduct (ESG, VSG, ISO)",
    philosophy: [
      "Kwaliteit ontstaat in elke stap, niet aan het einde",
      "Voorkomen is goedkoper dan herstellen",
      "Samen verbeteren, geen discussiecultuur",
      "Aanspreken = helpen verbeteren"
    ]
  },
  production_flow: {
    general_flow: [
      "Snijden",
      "Slijpen (edging)",
      "Boren",
      "Wassen",
      "Harden (ESG)",
      "Assembleren (ISO / VSG)"
    ],
    key_control_points: [
      "Na snijden: maatvoering check",
      "Na slijpen: randkwaliteit + krassen",
      "Na boren: positie + uitbraak",
      "Na wassen: visuele controle",
      "Na harden: vervorming + coating",
      "Voor ISO: volledige eindinspectie"
    ],
    critical_controls: [
      { step: "Snijden", check: "Maatvoering", tolerance: "±1 mm" },
      { step: "Slijpen", check: "Randkwaliteit / krassen", tolerance: "Geen zichtbare schade" },
      { step: "Boren", check: "Positie + diameter", tolerance: "Volgens tekening" },
      { step: "ISO QC", check: "Volledige visuele controle", rule: "Alles stoppen en checken" }
    ]
  },
  machines: {
    cutting_line: {
      description: "Snijlijn voor basis glasplaten",
      operators: ["MP", "DM", "HK"],
      risks: [
        "Krassen door verschuiven",
        "Verkeerde maatvoering",
        "Glasbreuk bij handling"
      ]
    },
    cnc_line: {
      description: "Intermac CNC voor slijpen en boren",
      model: "Master series",
      operators: ["JK", "MF"],
      operations: ["Slijpen", "Boren", "Frezen"],
      critical_settings: [
        "Correct nulpunt",
        "Juiste tool selectie",
        "Koeling actief"
      ],
      risks: [
        "Foute positionering",
        "Beschadiging door tooling",
        "Krassen tijdens handling"
      ]
    },
    iso_line: {
      description: "Forel lijn voor isolatieglas",
      operators: ["GB", "RB", "FM"],
      modules: [
        "Wasmachine",
        "Inspectie (LED)",
        "Spacer applicatie",
        "Gasvulling",
        "Pers"
      ],
      qc_points: [
        "Inspectie vóór spacer",
        "QC na spacer",
        "Eindcontrole vóór pers"
      ],
      rules: [
        "Altijd stoppen bij inspectie",
        "Geen twijfel doorlaten",
        "Elke ruit actief beoordelen",
        "Blokjes correct positioneren",
        "Continue maatcontrole"
      ]
    },
    drilling: {
      description: "Boorstation",
      operators: ["AT", "DH"],
      rules: [
        "Controle op juiste boorpositie",
        "Let op uitbraak",
        "Altijd check op tekening"
      ]
    },
    edging: {
      description: "Slijpen / kanten breken",
      main_operator: "GJS",
      note: "Ook andere operators kunnen dit uitvoeren",
      risks: [
        "Randbeschadiging",
        "Krassen door slechte handling"
      ]
    },
    esg_oven: {
      description: "Hardingsoven",
      operators: ["RA-VD"],
      critical_checks: [
        "Temperatuur curve",
        "Glaspositie",
        "Geen vervuiling"
      ],
      coating_rules: [
        "Pyrolytische coating = toegestaan",
        "Sputter coating = risico, voorzichtig behandelen"
      ],
      risks: [
        "Vervorming",
        "Optische afwijkingen",
        "Coating schade"
      ]
    },
    vsg_lamination: {
      description: "Lamineren van glas",
      operators: ["FB"],
      risks: [
        "Vervuiling tussen lagen",
        "Luchtinsluiting",
        "Foutieve opbouw"
      ]
    }
  },
  quality_rules: {
    general: [
      "NOOIT glas verschuiven in handen",
      "Altijd stabiel verplaatsen",
      "Op elk station visueel controleren",
      "Twijfel = stoppen en checken"
    ],
    scratch_prevention: [
      "Glas niet over elkaar schuiven",
      "Gebruik correcte ondersteuning",
      "Direct melden bij twijfel"
    ],
    iso_specific: [
      "Blokjes 9mm altijd in lengterichting plaatsen",
      "Blokjes uitlijnen met glaszijde",
      "Controleer boorgaten positie",
      "Eindsticker op eerste ruit zonder frame"
    ],
    exception_rules: [
      "Bij uitzetters mogen blokjes haaks geplaatst worden indien nodig"
    ]
  },
  common_mistakes: [
    {
      issue: "Krassen pas zichtbaar bij ISO",
      cause: "Schade eerder in proces niet gezien",
      lesson: "Elke stap controleren, niet doorschuiven"
    },
    {
      issue: "Glas valt om bij loslaten zuignappen",
      cause: "Te hoge loslaatdruk",
      lesson: "Instellingen controleren en rustig lossen"
    },
    {
      issue: "Verkeerde blokpositie",
      cause: "Onoplettendheid of haast",
      lesson: "Altijd check tegen tekening"
    }
  ],
  best_practices: [
    "Rustig werken = minder fouten",
    "Altijd vooruit denken (volgende stap)",
    "Werkplek schoon houden",
    "Direct corrigeren i.p.v. laten doorgaan",
    "Elkaar aanspreken op fouten"
  ],
  operator_language: {
    style: [
      "Kort en duidelijk",
      "Geen lange uitleg",
      "Direct toepasbaar",
      "Focus op actie"
    ],
    examples: [
      "Check maat",
      "Niet schuiven",
      "Rustig neerleggen",
      "Stop bij twijfel",
      "Eerst kijken, dan doen"
    ]
  },
  tone_of_voice: {
    do: [
      "Praktisch",
      "Direct",
      "Helder",
      "Werkvloergericht"
    ],
    dont: [
      "Geen managementtaal",
      "Geen lange verhalen",
      "Geen vaagheid"
    ]
  },
  fault_codes: {
    vacuum_system: [
      {
        issue: "Glas valt om bij lossen",
        cause: "Te hoge loslaatdruk",
        action: ["Reduceer druk", "Controleer zuignappen", "Check vervuiling"]
      }
    ]
  },
  measurement_rules: {
    general: [
      "Altijd meten bij twijfel",
      "Niet aannemen, controleren"
    ],
    iso: [
      "Blokjes positie controleren",
      "Afstandhouder exact meten",
      "Glasdikte checken vóór assemblage"
    ]
  },
  quality_control: {
    checkpoints: [
      {
        location: "Voor ISO",
        action: "Volledige visuele inspectie",
        focus: ["Krassen", "Vervuiling", "Randbeschadiging"]
      }
    ],
    stop_rules: [
      "Bij twijfel altijd stoppen",
      "Geen beschadigd glas doorlaten",
      "Fout = direct melden"
    ]
  },
  ncr_system: {
    when_to_create: [
      "Structurele fout",
      "Herhalende schade",
      "Procesafwijking"
    ],
    required_fields: [
      "Datum", "Station", "Operator",
      "Omschrijving", "Waarschijnlijke oorzaak", "Actie"
    ],
    goal: "Herhaling voorkomen, niet schuld zoeken"
  },
  photo_requirements: [
    { situation: "Schade", requirement: "Altijd foto maken" },
    { situation: "Onzekerheid", requirement: "Foto + overleg" }
  ],
  ai_behavior: {
    instruction_rules: [
      "Gebruik korte stappen",
      "Maximaal 5-8 stappen per instructie",
      "Gebruik werkvloer taal",
      "Geen lange uitleg"
    ],
    safety_rules: [
      "Altijd waarschuwing bij risico",
      "Fouten voorkomen staat centraal"
    ],
    output_format: [
      "Stap-voor-stap",
      "Duidelijke acties",
      "Eventueel korte waarschuwingen"
    ]
  }
}

// Helper: bouw stationscontext op voor een specifiek station
export function getStationContext(stationCode) {
  const station = THG_KNOWLEDGE_BASE.stations[stationCode]
  if (!station) return ''

  let ctx = `\n## Station ${station.nummer}: ${station.naam}\n`
  ctx += `${station.beschrijving}\n`

  if (station.machines?.length > 0) {
    ctx += `\nMachines: ${station.machines.join(', ')}\n`
  }
  if (station.processen?.length > 0) {
    ctx += `Processen: ${station.processen.join(', ')}\n`
  }
  if (station.software?.length > 0) {
    ctx += `Software: ${station.software.join(', ')}\n`
  }
  if (station.gereedschap?.length > 0) {
    ctx += `Gereedschap: ${station.gereedschap.join(', ')}\n`
  }
  if (station.materialen) {
    ctx += `\nMaterialen:\n`
    for (const [naam, info] of Object.entries(station.materialen)) {
      if (typeof info === 'string') {
        ctx += `- ${naam}: ${info}\n`
      } else {
        ctx += `- ${naam}: ${JSON.stringify(info)}\n`
      }
    }
  }
  if (station.parameters) {
    ctx += `\nParameters:\n`
    for (const [naam, waarde] of Object.entries(station.parameters)) {
      ctx += `- ${naam}: ${typeof waarde === 'object' ? JSON.stringify(waarde) : waarde}\n`
    }
  }
  if (station.kritischRegels?.length > 0) {
    ctx += `\nKRITISCHE REGELS:\n`
    station.kritischRegels.forEach(r => { ctx += `⚠️ ${r}\n` })
  }
  if (station.pbm?.length > 0) {
    ctx += `\nVerplichte PBM: ${station.pbm.join(', ')}\n`
  }

  return ctx
}

// Helper: bouw volledige bedrijfscontext op voor de system prompt
export function getBedrijfsContext() {
  const kb = THG_KNOWLEDGE_BASE
  const tc = THG_CONTEXT
  let ctx = `## Bedrijfscontext — Timmermans Hardglas B.V.\n\n`
  ctx += `**Bedrijf:** ${kb.bedrijf.naam}\n`
  ctx += `**Locatie:** ${kb.bedrijf.locatie}\n`
  ctx += `**Industrie:** ${kb.bedrijf.industrie}\n`
  ctx += `**Kernactiviteit:** ${tc.company.core_activity}\n`
  ctx += `**Capaciteit:** ${kb.bedrijf.capaciteit}\n`
  ctx += `**Kwaliteitsleider:** ${kb.bedrijf.kwaliteitsleider}\n`
  ctx += `**Machineleverancier:** ${kb.bedrijf.machineleverancier}\n`
  ctx += `**Software:** ${kb.bedrijf.software}\n\n`

  // Bedrijfsfilosofie
  ctx += `### Bedrijfsfilosofie\n`
  tc.company.philosophy.forEach(p => { ctx += `- ${p}\n` })

  // Productiestroom
  ctx += `\n### Productiestroom (van begin tot eind)\n`
  tc.production_flow.general_flow.forEach((step, i) => {
    ctx += `${i + 1}. ${step}\n`
  })
  ctx += `\n**Controlepunten per stap:**\n`
  tc.production_flow.key_control_points.forEach(cp => {
    ctx += `- ${cp}\n`
  })

  // Machines met risico's en operators
  ctx += `\n### Machines & risico's (werkvloerkennis)\n`
  for (const [key, machine] of Object.entries(tc.machines)) {
    ctx += `\n**${machine.description}**`
    if (machine.operators) ctx += ` (operators: ${Array.isArray(machine.operators) ? machine.operators.join(', ') : machine.main_operator})`
    ctx += `\n`
    if (machine.risks?.length > 0) {
      ctx += `Risico's:\n`
      machine.risks.forEach(r => { ctx += `  - ${r}\n` })
    }
    if (machine.rules?.length > 0) {
      ctx += `Regels:\n`
      machine.rules.forEach(r => { ctx += `  - ${r}\n` })
    }
    if (machine.modules?.length > 0) {
      ctx += `Modules: ${machine.modules.join(' → ')}\n`
    }
    if (machine.qc_points?.length > 0) {
      ctx += `QC-punten: ${machine.qc_points.join(', ')}\n`
    }
    if (machine.critical_settings?.length > 0) {
      ctx += `Kritische instellingen: ${machine.critical_settings.join(', ')}\n`
    }
    if (machine.critical_checks?.length > 0) {
      ctx += `Kritische checks: ${machine.critical_checks.join(', ')}\n`
    }
    if (machine.coating_rules?.length > 0) {
      ctx += `Coating-regels:\n`
      machine.coating_rules.forEach(r => { ctx += `  - ${r}\n` })
    }
  }

  // Kwaliteitsregels
  ctx += `\n### Kwaliteitsregels\n`
  ctx += `**Algemeen:**\n`
  tc.quality_rules.general.forEach(r => { ctx += `- ${r}\n` })
  ctx += `**Kraspreventie:**\n`
  tc.quality_rules.scratch_prevention.forEach(r => { ctx += `- ${r}\n` })
  ctx += `**ISO-specifiek:**\n`
  tc.quality_rules.iso_specific.forEach(r => { ctx += `- ${r}\n` })
  if (tc.quality_rules.exception_rules?.length > 0) {
    ctx += `**Uitzonderingen:**\n`
    tc.quality_rules.exception_rules.forEach(r => { ctx += `- ${r}\n` })
  }

  // Veelgemaakte fouten
  ctx += `\n### Veelgemaakte fouten (leer hiervan!)\n`
  tc.common_mistakes.forEach(m => {
    ctx += `- **${m.issue}** — Oorzaak: ${m.cause}. Les: ${m.lesson}\n`
  })

  // Best practices
  ctx += `\n### Best practices op de werkvloer\n`
  tc.best_practices.forEach(bp => { ctx += `- ${bp}\n` })

  // Schrijfstijl-instructies
  ctx += `\n### Schrijfstijl voor DWI's\n`
  ctx += `**Stijl:** ${tc.operator_language.style.join(', ')}\n`
  ctx += `**Voorbeeldzinnen:** ${tc.operator_language.examples.join(' | ')}\n`
  ctx += `**Toon — WEL:** ${tc.tone_of_voice.do.join(', ')}\n`
  ctx += `**Toon — NIET:** ${tc.tone_of_voice.dont.join(', ')}\n`

  // AI-gedragsregels
  ctx += `\n### AI-instructieregels\n`
  tc.ai_behavior.instruction_rules.forEach(r => { ctx += `- ${r}\n` })
  ctx += `**Veiligheid:**\n`
  tc.ai_behavior.safety_rules.forEach(r => { ctx += `- ${r}\n` })
  ctx += `**Outputformaat:**\n`
  tc.ai_behavior.output_format.forEach(r => { ctx += `- ${r}\n` })

  // Toleranties en kritische controles
  ctx += `\n### Kritische controles & toleranties\n`
  tc.production_flow.critical_controls.forEach(cc => {
    ctx += `- **${cc.step}:** ${cc.check} (${cc.tolerance || cc.rule})\n`
  })

  // Foutcodes
  ctx += `\n### Bekende foutcodes\n`
  tc.fault_codes.vacuum_system.forEach(fc => {
    ctx += `- **${fc.issue}:** ${fc.cause} → ${fc.action.join(', ')}\n`
  })

  // Meetregels
  ctx += `\n### Meetregels\n`
  tc.measurement_rules.general.forEach(r => { ctx += `- ${r}\n` })
  ctx += `**ISO-specifiek:**\n`
  tc.measurement_rules.iso.forEach(r => { ctx += `- ${r}\n` })

  // QC stopregels
  ctx += `\n### Kwaliteitscontrole — stopregels\n`
  tc.quality_control.stop_rules.forEach(r => { ctx += `- ${r}\n` })
  tc.quality_control.checkpoints.forEach(cp => {
    ctx += `- **${cp.location}:** ${cp.action} — focus: ${cp.focus.join(', ')}\n`
  })

  // NCR-systeem
  ctx += `\n### NCR-systeem (afwijkingsregistratie)\n`
  ctx += `**Doel:** ${tc.ncr_system.goal}\n`
  ctx += `**Wanneer aanmaken:** ${tc.ncr_system.when_to_create.join(', ')}\n`
  ctx += `**Verplichte velden:** ${tc.ncr_system.required_fields.join(', ')}\n`

  // Fotoregels
  ctx += `\n### Fotoregels op de werkvloer\n`
  tc.photo_requirements.forEach(pr => {
    ctx += `- **${pr.situation}:** ${pr.requirement}\n`
  })

  // Productgroepen
  ctx += `\n### Productgroepen\n`
  kb.productgroepen.forEach(p => {
    ctx += `- **${p.naam}:** ${p.beschrijving}\n`
  })

  ctx += `\n### Glassoorten\n`
  for (const [naam, beschr] of Object.entries(kb.glasSoorten)) {
    ctx += `- **${naam}:** ${beschr}\n`
  }

  ctx += `\n### Veiligheidseisen (PBM)\n`
  for (const [cat, items] of Object.entries(kb.veiligheid)) {
    ctx += `- **${cat}:** ${items.join(', ')}\n`
  }

  ctx += `\n### Industrieterminologie\n`
  for (const [term, uitleg] of Object.entries(kb.industrieTerminologie)) {
    ctx += `- **${term}:** ${uitleg}\n`
  }

  return ctx
}
