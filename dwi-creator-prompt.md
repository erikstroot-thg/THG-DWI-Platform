# Claude Code Prompt: DWI Creator Feature

## Opdracht
Bouw een volledige "Nieuwe DWI aanmaken" feature voor het THG-DWI-Platform (Vite 8 + React 19 + Tailwind v4). Dit omvat een backend API-server, een frontend formulier, AI-generatie van werkinstructies, en een review/goedkeur-workflow.

---

## Architectuur

### Backend: Express API Server (poort 3001)
Maak een `server/` directory in de project root met:

```
server/
  index.js          ← Express app, start op poort 3001
  routes/
    dwi.js          ← API routes voor DWI CRUD + AI generatie
  services/
    ai.js           ← Anthropic/OpenAI API integratie
  data/
    drafts.json     ← Opslag voor concept-DWI's (niet in werkinstructies.js)
```

**Dependencies toevoegen aan package.json:**
```json
"dependencies": {
  "@anthropic-ai/sdk": "latest",
  "express": "^4.18",
  "cors": "^2.8",
  "multer": "^1.4",
  "dotenv": "^16.4",
  "uuid": "^9.0"
}
```

**Scripts toevoegen:**
```json
"scripts": {
  "dev": "concurrently \"vite --port 5173\" \"node server/index.js\"",
  "dev:frontend": "vite --port 5173",
  "dev:backend": "node server/index.js",
  "build": "vite build"
}
```
Plus `"devDependencies": { "concurrently": "^8.2" }`

### .env bestand (project root)
```env
ANTHROPIC_API_KEY=sk-ant-...
# OF als OpenAI gebruikt wordt:
# OPENAI_API_KEY=sk-...
AI_PROVIDER=anthropic
PORT=3001
```

### Vite proxy config (vite.config.js)
Voeg een proxy toe zodat de frontend naar de backend kan:
```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

---

## Backend API Endpoints

### POST /api/dwi/generate
**Input (multipart/form-data):**
- `station` (string): stationcode (bijv. "BOR", "SNI", "ESG")
- `stationNummer` (number): 1-11
- `machine` (string): machinenaam
- `auteur` (string): naam van de medewerker
- `chatText` (string): WhatsApp chat-tekst of vrije tekstbeschrijving
- `photos` (files[]): optioneel, foto's van het proces (max 20)

**AI Prompt sturen naar Claude/GPT:**
```
Je bent een procesoptimalisatie expert voor Timmermans Hardglas (THG),
een glasverwerkingsbedrijf. Genereer een complete digitale werkinstructie (DWI)
op basis van de volgende input.

Station: {station} ({stationNummer})
Machine: {machine}
Beschrijving/chat: {chatText}

Genereer een JSON-object met deze structuur:
{
  "id": "DWI-{STATION}-{VOLGNR}",
  "titel": "Korte beschrijvende titel",
  "station": "{stationNaam}",
  "stationNummer": {nr},
  "machine": "{machine}",
  "auteur": "{auteur}",
  "versie": "v0.1",
  "datum": "{vandaag}",
  "status": "concept",
  "zoektermen": ["relevante", "zoektermen"],
  "pbm": [{"naam": "PBM item", "icoon": "emoji"}],
  "gereedschap": ["gereedschap items"],
  "materialen": ["materiaal items"],
  "secties": [
    {
      "titel": "Sectietitel",
      "stappen": [
        {
          "nummer": 1,
          "titel": "Staptitel",
          "beschrijving": "Gedetailleerde beschrijving van deze stap",
          "substappen": ["substap 1", "substap 2"],
          "waarschuwing": "optionele waarschuwing",
          "afbeeldingen": [],
          "bijschrift": []
        }
      ]
    }
  ],
  "afwijkingen": [
    {
      "probleem": "Wat kan misgaan",
      "oorzaak": "Mogelijke oorzaak",
      "actie": "Correctieve actie"
    }
  ],
  "kpis": {
    "doorlooptijd": "X minuten",
    "kpiNaam": "waarde"
  }
}

Belangrijk:
- Schrijf in het Nederlands
- Wees specifiek en praktisch (productievloer-niveau)
- 80% visueel denken: beschrijf bij elke stap WAT je moet ZIEN
- Gebruik duidelijke, korte zinnen
- Voeg relevante veiligheidswaarschuwingen toe
- Genereer realistische afwijkingen die op een glasverwerkingsvloer voorkomen
```

**Output:** JSON met het gegenereerde DWI-object + een `draftId` (UUID)

### GET /api/dwi/drafts
Retourneer alle concept-DWI's uit drafts.json.
Query params: `?status=concept|review|goedgekeurd|afgekeurd`

### GET /api/dwi/drafts/:draftId
Retourneer één concept-DWI.

### PUT /api/dwi/drafts/:draftId
Update een concept-DWI (bijv. handmatige aanpassingen).

### PUT /api/dwi/drafts/:draftId/review
**Body:** `{ "status": "goedgekeurd" | "afgekeurd", "reviewer": "Erik Stroot", "opmerking": "..." }`
- Bij "goedgekeurd": kopieer de DWI naar werkinstructies.js (of een aparte published.json)
- Bij "afgekeurd": markeer als afgekeurd met opmerking

### DELETE /api/dwi/drafts/:draftId
Verwijder een concept-DWI.

---

## Frontend Routes & Componenten

### Route: /new → NieuweDwiPagina.jsx
**Formulier met:**
1. **Station** dropdown (11 stations uit STATIONS array)
2. **Machine** tekstveld
3. **Auteur** tekstveld (wie heeft de instructie aangeleverd)
4. **Beschrijving** textarea — plak hier WhatsApp-chat of typ vrije tekst
5. **Foto's** file upload (meerdere, drag & drop)
6. **"Genereer met AI" knop** → POST naar /api/dwi/generate → toon loading state
7. **Preview** van het resultaat in DWI-formaat (hergebruik DetailPagina styling)
8. **"Opslaan als concept" knop** → slaat op in drafts
9. **"Indienen voor review" knop** → status wordt "review"

**UI/UX:**
- THG huisstijl (blauw #005A9C, grijs #595959, accenten)
- Responsive, mobile-first
- Loading spinner tijdens AI-generatie met "AI genereert werkinstructie..." tekst
- Success/error toasts
- Geen link op de homepage (hidden route, alleen via URL bereikbaar)

### Route: /review → ReviewPagina.jsx (voor Erik als manager)
**Overzicht van alle ingediende DWI's met:**
1. Lijst met kaarten per concept-DWI (titel, station, auteur, datum, status)
2. Filter op status: concept | review | goedgekeurd | afgekeurd
3. Klik op kaart → detail view met volledige DWI preview
4. **Goedkeuren** knop (groen) + **Afkeuren** knop (rood) + opmerking-veld
5. Bij goedkeuren: DWI wordt actief in het portaal

**UI/UX:**
- Alleen bereikbaar via URL (geen link op homepage, voor nu)
- Badge op kaart met status-kleur: concept=grijs, review=oranje, goedgekeurd=groen, afgekeurd=rood

### App.jsx routes toevoegen:
```jsx
<Route path="/new" element={<NieuweDwiPagina />} />
<Route path="/review" element={<ReviewPagina />} />
<Route path="/review/:draftId" element={<ReviewDetailPagina />} />
```

---

## Review Workflow

```
[Medewerker vult formulier in op /new]
        ↓
[AI genereert DWI → status: "concept"]
        ↓
[Medewerker past aan → slaat op → status: "review"]
        ↓
[Erik opent /review → ziet ingediende DWI's]
        ↓
[Erik reviewt → "goedgekeurd" of "afgekeurd" + opmerking]
        ↓
[Goedgekeurd → DWI verschijnt in portaal overzicht]
[Afgekeurd → medewerker ziet feedback, kan aanpassen en opnieuw indienen]
```

---

## Data-opslag (MVP)

Voor de MVP gebruiken we `server/data/drafts.json`:
```json
{
  "drafts": [
    {
      "draftId": "uuid-hier",
      "status": "concept|review|goedgekeurd|afgekeurd",
      "reviewOpmerking": "",
      "reviewer": "",
      "reviewDatum": "",
      "aanmaakDatum": "2026-03-22",
      "laatstGewijzigd": "2026-03-22",
      "dwi": { /* volledige DWI data-object */ }
    }
  ]
}
```

Goedgekeurde DWI's worden OOK in de frontend getoond. Pas `OverzichtPagina.jsx` aan zodat het zowel `WERKINSTRUCTIES` uit `werkinstructies.js` toont ALS goedgekeurde items uit `/api/dwi/drafts?status=goedgekeurd`.

---

## Belangrijk

- **Geen .env committen naar git** — voeg `.env` toe aan `.gitignore`
- **CORS**: backend moet requests van `localhost:5173` en `localhost:5175` accepteren
- **Error handling**: als AI API faalt, toon duidelijke foutmelding in het Nederlands
- **Bestaande code niet breken**: de huidige DWI-kaarten en detailpagina's moeten exact zo blijven werken
- **THG huisstijl** toepassen op alle nieuwe componenten
- **Nederlandse UI**: alle labels, knoppen, meldingen in het Nederlands
- **.env.example** aanmaken met placeholder keys (zonder echte waarden)

---

## Stap-voor-stap implementatievolgorde

1. `server/index.js` + `server/routes/dwi.js` + `server/data/drafts.json` opzetten
2. `server/services/ai.js` — AI integratie (Anthropic SDK)
3. `vite.config.js` proxy toevoegen
4. `package.json` dependencies + scripts updaten
5. `.env` + `.env.example` + `.gitignore` update
6. `src/components/NieuweDwiPagina.jsx` — formulier + AI generatie
7. `src/components/ReviewPagina.jsx` — overzicht concept-DWI's
8. `src/components/ReviewDetailPagina.jsx` — detail + goedkeuren/afkeuren
9. `src/App.jsx` — routes toevoegen
10. `src/components/OverzichtPagina.jsx` — ook goedgekeurde drafts tonen
11. Testen: hele flow doorlopen van aanmaken → review → goedkeuren → zichtbaar in portaal
12. `.env` NIET committen, wel `.env.example`

---

## Test-scenario
1. Ga naar `localhost:5173/new`
2. Selecteer station "7 · Hardoven (ESG)", machine "Tamglass hardoven", auteur "Erik Stroot"
3. Plak in beschrijving: "De hardoven moet elke ochtend opgestart worden. Eerst de hoofdschakelaar aanzetten, dan het bedieningspaneel. Temperatuur instellen op 690 graden. Wachten tot de oven op temperatuur is (circa 45 min). Dan testglas er doorheen."
4. Klik "Genereer met AI"
5. Bekijk de gegenereerde DWI → pas eventueel aan → "Indienen voor review"
6. Ga naar `localhost:5173/review` → zie de ingediende DWI → Goedkeuren
7. Ga naar `localhost:5173/` → de nieuwe DWI staat er als 5e kaart bij
