// 5S Checklist data structure and default templates per station
// Based on the 5S methodology: Sorteren, Schikken, Schoonmaken, Standaardiseren, Standhouden

export const VIJF_S_CATEGORIEEN = [
  { key: 'sorteren', label: 'Sorteren (整理)', kleur: 'bg-red-500', omschrijving: 'Verwijder alles wat niet nodig is op de werkplek' },
  { key: 'schikken', label: 'Schikken (整頓)', kleur: 'bg-yellow-500', omschrijving: 'Een vaste plek voor alles, alles op zijn plek' },
  { key: 'schoonmaken', label: 'Schoonmaken (清掃)', kleur: 'bg-green-500', omschrijving: 'Maak de werkplek schoon en inspecteer tegelijk' },
  { key: 'standaardiseren', label: 'Standaardiseren (清潔)', kleur: 'bg-blue-500', omschrijving: 'Maak afspraken en leg ze vast' },
  { key: 'standhouden', label: 'Standhouden (躾)', kleur: 'bg-purple-500', omschrijving: 'Zorg dat het zo blijft — discipline en audits' },
]

export const VIJF_S_SCORES = [
  { waarde: 0, label: 'Niet beoordeeld', kleur: 'bg-gray-200 text-gray-500' },
  { waarde: 1, label: 'Slecht', kleur: 'bg-red-100 text-red-700' },
  { waarde: 2, label: 'Matig', kleur: 'bg-orange-100 text-orange-700' },
  { waarde: 3, label: 'Voldoende', kleur: 'bg-yellow-100 text-yellow-700' },
  { waarde: 4, label: 'Goed', kleur: 'bg-green-100 text-green-700' },
  { waarde: 5, label: 'Uitstekend', kleur: 'bg-green-200 text-green-800' },
]

// Default checklist items per 5S category (applicable to all stations)
export const DEFAULT_CHECKLIST_ITEMS = {
  sorteren: [
    'Alleen benodigde gereedschappen en materialen op de werkplek',
    'Geen defect materiaal of oud gereedschap aanwezig',
    'Persoonlijke spullen opgeborgen (niet op de werkplek)',
    'Geen onnodige documenten of printjes',
    'Afvalcontainers niet overvol',
  ],
  schikken: [
    'Gereedschap heeft een vaste, gemarkeerde plek',
    'Materialen zijn gelabeld en gesorteerd',
    'Looppaden vrij van obstakels',
    'Veiligheidsuitrusting op aangewezen plek',
    'Voorraadniveaus visueel duidelijk (min/max gemarkeerd)',
  ],
  schoonmaken: [
    'Vloer schoon en vrij van glasresten',
    'Machine(s) schoon — geen stof, olie of koelvloeistof',
    'Werktafel/oppervlakken schoongemaakt',
    'Afval gescheiden en afgevoerd',
    'Lekken of beschadigingen gemeld',
  ],
  standaardiseren: [
    'Werkinstructies (DWI) beschikbaar en actueel',
    'Schoonmaakschema aanwezig en bijgehouden',
    'Verantwoordelijkheden duidelijk toegewezen',
    'Checklistprocedure is gedocumenteerd',
    'Visueel management (labels, kleuren) consequent',
  ],
  standhouden: [
    'Vorige 5S audit-acties zijn uitgevoerd',
    'Team is op de hoogte van 5S standaard',
    'Afwijkingen worden direct gemeld',
    'Verbetervoorstellen worden besproken',
    'Periodieke audit is ingepland',
  ],
}

// Station-specific additions to the default checklist
export const STATION_SPECIFIEK = {
  ONT: {
    sorteren: ['Ontvangstdocumenten gearchiveerd na verwerking'],
    schoonmaken: ['Rolbanen schoon, geen glasscherven'],
  },
  SNI: {
    sorteren: ['Gebruikte snijwielen apart bewaard van nieuwe'],
    schoonmaken: ['Snijtafel vrij van glasresten en olie', 'Koelvloeistof op peil'],
    schikken: ['Snijwielen gerangschikt per type en maat'],
  },
  CNC: {
    schoonmaken: ['Koelvloeistof op peil en schoon', 'Spanen/glasstof opgezogen'],
    sorteren: ['Gereedschapswisselaars correct gevuld'],
  },
  BOR: {
    schoonmaken: ['Wateropvangbak leeggemaakt', 'Boren schoon en scherp'],
    schikken: ['Boren gesorteerd per diameter'],
  },
  SLI: {
    schoonmaken: ['Slijpwater regelmatig ververst', 'Geen glasstof op machine'],
  },
  WSS: {
    schoonmaken: ['Waswater kwaliteit gecontroleerd', 'Borstels in goede staat'],
  },
  ESG: {
    schoonmaken: ['Rollen in oven schoon (geen glasresten)', 'Koelsectie vrij van obstakels'],
    sorteren: ['Geen breukglas in het productiegebied'],
  },
  VSG: {
    schoonmaken: ['Cleanroom/lamineerruimte stofvrij', 'Autoclaaf schoon'],
    schikken: ['PVB folie droog en correct opgeslagen'],
  },
  ISO: {
    schoonmaken: ['Butylextruder schoon', 'Gasvulstation lekvrij'],
    schikken: ['Spacers gesorteerd per maat'],
  },
  QC: {
    schoonmaken: ['Lichttafel schoon en vrij van krassen', 'Meetapparatuur gekalibreerd'],
  },
  EXP: {
    schikken: ['Bokken gelabeld per klant/order', 'Laadzone vrij voor transport'],
    schoonmaken: ['Verpakkingsmateriaal opgeruimd'],
  },
}
