# Claude Code Prompt: Redesign NieuwDwiPagina als Stap-voor-Stap Builder

## Context
De huidige `/new` pagina (`NieuwDwiPagina.jsx`) werkt als een formulier waar je ALLES in één keer invult (station, machine, beschrijving, bulk foto-upload) en dan op "Genereer" klikt. Dit moet worden omgebouwd tot een **stap-voor-stap builder** waarbij de medewerker interactief zijn werkinstructie opbouwt, blok voor blok.

## Wat er MOET veranderen

### 1. Titel-veld toevoegen
De medewerker moet ZELF een titel kunnen invullen voor de DWI. Voeg een `titel` veld toe in de basisgegevens, bijv. "Hardoven Opstarten", "Slijpschijf Vervangen". Dit wordt de `titel` property in het DWI-object.

### 2. Stap-voor-stap builder (de kern van de wijziging)
Vervang het huidige "beschrijving textarea + bulk foto-upload" met een **blokken-builder**:

```
┌─────────────────────────────────────┐
│  BASISGEGEVENS                      │
│  [Titel]  [Station ▼]  [Machine]   │
│  [Auteur]                           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  STAP 1                            │
│  ┌──────────┐                      │
│  │  📷 FOTO │  (thumbnail preview) │
│  └──────────┘                      │
│  [Beschrijving van deze stap...]   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  STAP 2                            │
│  ┌──────────┐                      │
│  │  📷 FOTO │  (thumbnail preview) │
│  └──────────┘                      │
│  [Beschrijving van deze stap...]   │
└─────────────────────────────────────┘

     [ + Volgende stap toevoegen ]

┌─────────────────────────────────────┐
│  [🤖 Genereer DWI met AI]          │
└─────────────────────────────────────┘
```

**Elke stap ("blok") bestaat uit:**
- Een foto (verplicht per stap) — upload of camera
- Een tekstveld (optioneel maar aanbevolen) — beschrijving van wat je in deze stap doet
- Een verwijder-knop (🗑️) om het blok te verwijderen
- Drag-handle of omhoog/omlaag knoppen om volgorde te wijzigen

**Na het toevoegen van een stap verschijnt DIRECT de knop "+ Volgende stap toevoegen".**

De medewerker bouwt zo zijn DWI op door afwisselend foto's te maken en tekst toe te voegen. Dit is het "80% beeld, 20% tekst" principe.

### 3. Camera-knop (verbeterde implementatie)
De huidige "Neem foto" knop met `capture="environment"` werkt goed op mobiel (opent camera). Op desktop opent het logischerwijs de file picker — dat is prima. Maar verbeter de UX:

```jsx
// Per stap-blok: twee knoppen naast elkaar
<div className="flex gap-2">
  {/* Camera — op mobiel opent dit de camera, op desktop de file picker */}
  <button onClick={openCamera}>
    <Camera /> Foto maken
  </button>
  {/* File picker — altijd de Verkenner */}
  <button onClick={openFilePicker}>
    <ImagePlus /> Bestand kiezen
  </button>
</div>
```

De camera-input per stap-blok (niet meer bulk):
```jsx
function openCamera() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.capture = 'environment'  // opent camera op mobiel
  input.onchange = (e) => handleStepPhoto(stepIndex, e.target.files[0])
  input.click()
}
```

### 4. State structuur
```jsx
const [stappen, setStappen] = useState([
  { foto: null, tekst: '' }  // Start met 1 leeg blok
])

// Stap toevoegen
function addStap() {
  setStappen(prev => [...prev, { foto: null, tekst: '' }])
}

// Foto aan stap koppelen
function setStapFoto(index, file) {
  // resize image, then store base64
  setStappen(prev => prev.map((s, i) =>
    i === index ? { ...s, foto: { base64, name: file.name } } : s
  ))
}

// Tekst aan stap koppelen
function setStapTekst(index, tekst) {
  setStappen(prev => prev.map((s, i) =>
    i === index ? { ...s, tekst } : s
  ))
}

// Stap verwijderen
function removeStap(index) {
  setStappen(prev => prev.filter((_, i) => i !== index))
}

// Stap omhoog/omlaag verplaatsen
function moveStap(index, direction) {
  // swap met index + direction (-1 of +1)
}
```

### 5. Data naar API sturen
Bij "Genereer DWI met AI" stuur je de stappen-array naar de backend:

```js
// In dwiService.js - aanpassen
export async function generateDwi({ stappen, station, stationNummer, machine, beschrijving: titel, auteur }) {
  const photos = stappen.filter(s => s.foto).map(s => s.foto)
  const stapBeschrijvingen = stappen.map((s, i) =>
    `Stap ${i + 1}: ${s.tekst || '(geen beschrijving)'}`
  ).join('\n')

  const res = await fetch('/api/generate-dwi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      photos,
      stappen,  // stuur volledige stappen-array mee
      station,
      stationNummer,
      machine,
      beschrijving: `Titel: ${titel}\n\nStappen van de operator:\n${stapBeschrijvingen}`,
      auteur
    }),
  })
  // ...
}
```

### 6. Backend aanpassen (server/index.js)
De backend moet de stappen-array gebruiken in de AI-prompt. Pas het `userContent` aan:

```js
// In plaats van alleen foto's + beschrijving, stuur per stap foto + tekst
const userContent = []

// Per stap: foto + bijbehorende tekst
stappen.forEach((stap, i) => {
  if (stap.foto) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: stap.foto.mimeType || 'image/jpeg',
        data: stap.foto.base64.replace(/^data:image\/\w+;base64,/, ''),
      },
    })
  }
  userContent.push({
    type: 'text',
    text: `[Stap ${i + 1}] ${stap.tekst || 'Geen beschrijving opgegeven door operator. Analyseer de foto en beschrijf wat je ziet.'}`,
  })
})

// Eindinstructie
userContent.push({
  type: 'text',
  text: `Genereer nu de complete DWI als JSON. DWI ID: ${nextId}, Station: ${station} (${stationNummer}), Machine: ${machine}, Auteur: ${auteur || 'Onbekend'}, Titel: ${titel || 'Naamloos'}.`
})
```

### 7. Visuele stijl per stap-blok
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
  {/* Header */}
  <div className="flex items-center justify-between">
    <span className="bg-thg-blue text-white text-sm font-bold px-3 py-1 rounded-full">
      Stap {index + 1}
    </span>
    <div className="flex gap-1">
      <button onClick={() => moveStap(index, -1)} disabled={index === 0}>▲</button>
      <button onClick={() => moveStap(index, 1)} disabled={index === stappen.length - 1}>▼</button>
      <button onClick={() => removeStap(index)} className="text-red-500">🗑️</button>
    </div>
  </div>

  {/* Foto */}
  {stap.foto ? (
    <img src={stap.foto.base64} className="w-full max-h-64 object-contain rounded-lg" />
  ) : (
    <div className="flex gap-2">
      <button onClick={() => openCamera(index)}>📷 Foto maken</button>
      <button onClick={() => openFilePicker(index)}>📁 Bestand kiezen</button>
    </div>
  )}

  {/* Tekst */}
  <textarea
    value={stap.tekst}
    onChange={(e) => setStapTekst(index, e.target.value)}
    placeholder="Wat moet de operator hier doen? (optioneel - AI vult aan op basis van de foto)"
    rows={2}
  />
</div>
```

### 8. "Volgende stap" knop — auto-scroll
Na klikken op "+ Volgende stap toevoegen":
1. Nieuw blok verschijnt onderaan
2. Pagina scrollt automatisch naar het nieuwe blok
3. Focus gaat naar de foto-knop van het nieuwe blok

```jsx
const lastStapRef = useRef(null)

function addStap() {
  setStappen(prev => [...prev, { foto: null, tekst: '' }])
  // Scroll naar nieuw blok na render
  setTimeout(() => lastStapRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
}
```

## Wat NIET mag veranderen
- De basisgegevens (station, machine, auteur) blijven bovenaan het formulier
- De AI-generatie flow (genereer → preview → opslaan) blijft intact
- De backend server/index.js basis-structuur blijft (Express + Anthropic SDK)
- De preview component (DwiVoorbeeld.jsx) blijft
- FotoUpload.jsx kan als referentie gebruikt worden voor de resize-logica, maar het component zelf wordt vervangen door per-stap foto-upload
- THG huisstijl kleuren en styling
- Bestaande routes en componenten (OverzichtPagina, DetailPagina, etc.)

## Samenvatting
Het verschil is: van **"vul alles in en dump alle foto's"** naar **"bouw je DWI stap voor stap op, foto + tekst per stap"**. De medewerker op de werkvloer loopt langs de machine, maakt per handeling een foto, typt er kort bij wat hij doet, en gaat door naar de volgende stap. Aan het eind klikt hij "Genereer" en Claude maakt er een professionele werkinstructie van.
