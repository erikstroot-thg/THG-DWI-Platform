# THG DWI-Platform — Volledige Projectanalyse & Planning

*Gegenereerd: 24 maart 2026*

## 1. Wat is het THG-DWI-Platform?

Een **full-stack webapplicatie** (React + Express + Claude AI) waarmee Timmermans Hardglas digitale werkinstructies maakt, beheert en distribueert voor 11 productiestations in de glasfabriek.

**Kernidee:** Een operator loopt langs de machine, maakt foto's per stap, typt kort wat hij doet. Claude AI maakt er een professionele werkinstructie van. Geen Word-documenten meer, geen papieren instructies die verouderen.

**Tech stack:** Vite 8 + React 19 + Tailwind CSS v4 + Express.js + Anthropic SDK (Claude AI)

---

## 2. Wat is er NU gebouwd (functioneel)

### A. DWI Aanmaken (AI-gestuurd)
- **Stap-voor-stap builder**: operator bouwt blok voor blok (foto + tekst per stap)
- **AI-generatie met Claude**: extended thinking, streaming voortgang, Sonnet/Opus keuze
- **Multi-file input**: foto's, PDF's, TXT, WhatsApp ZIP-bestanden als context
- **SVG-illustraties**: Claude genereert technische diagrammen bij stappen
- **Mermaid procesdiagrammen**: automatische flowcharts

### B. DWI Bekijken (DetailPagina)
- Stappen met foto's, waarschuwingen, tips
- Lightbox (full-screen foto's doorbladen)
- Afwijkingentabel (probleem → oorzaak → actie)
- KPI's per instructie
- QR-code genereren (SVG/PNG download)
- PDF-export (printbare versie)
- Vertaling (NL → EN / RO) via AI

### C. DWI Bewerken (Editor)
- Drag-and-drop stappen herordenen (@dnd-kit)
- Inline tekst bewerken per stap
- AI-verbetering per individuele stap
- Preview-modus
- Automatische versioning (1.0 → 1.1 → 1.2)
- Versiegeschiedenis bekijken

### D. Beheer & Workflow
- **Statusworkflow**: concept → review → goedgekeurd → gepubliceerd → gearchiveerd
- **Pincode-beveiliging** voor goedkeuring (4-cijferig)
- **Analytics dashboard**: views per DWI, top 10, trends laatste 30 dagen
- **Context management**: kennisbank per station aanpasbaar (machines, PBM's, regels)
- **Kopieer hardcoded DWI naar bewerkbaar**: migratie van oud naar nieuw

### E. 5S Audit Module
- Per station: 5 categorieën (Sorteren, Schikken, Schoonmaken, Standaardiseren, Standhouden)
- Scoring per item (1-5 sterren)
- Auditgeschiedenis per station
- Overzicht alle stations

### F. IST/SOLL/GAP Analyse
- Formulier per station (gedeeltelijk geïmplementeerd)
- Scorebars en impact-badges
- Server-side opslag

### G. Technische basis
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + React Router 7
- **Backend**: Express.js + Anthropic SDK + PDF-parse
- **Opslag**: JSON-bestanden op disk (geen database)
- **AI**: Claude Sonnet/Opus met extended thinking + vision
- **Rate limiting**: 10 requests/minuut per IP

---

## 3. Bestaande DWI-content

| ID | Titel | Station | Stappen | Foto's | Auteur |
|----|-------|---------|---------|--------|--------|
| DWI-BOR-001 | Boormachine Opstarten | Boren (4) | 14 | 25 | Alex Tabarcia |
| DWI-SNI-001 | Gelaagd Snijden iPlus/331 | Snijlijn (2) | Multi-sectie | 56 | Hendry Kooistra |
| DWI-SNI-002 | Slijpschijf Vervangen | Snijlijn (2) | Enkelvoudig | 20 | Hendry Kooistra |
| DWI-ISO-POL-001 | Polysun Assemblage | ISO-lijn (9) | Placeholder | 0 | Simone Hamberg |

---

## 4. Wat commerciële tools WEL hebben en wij (nog) NIET

### Categorie A: Gebruikersbeheer & Toegang
| Feature | SwipeGuide | VKS | Dozuki | THG-DWI | Gap |
|---------|------------|-----|--------|---------|-----|
| User login / accounts | ✅ | ✅ | ✅ | ❌ | **Groot** |
| Rollen (admin/auteur/operator) | ✅ | ✅ | ✅ | ❌ (alleen pincode) | **Groot** |
| Per-station toegangsrechten | ✅ | ✅ | ✅ | ❌ | Middel |
| SSO / Active Directory | ✅ | ✅ | ✅ | ❌ | Klein (later) |

### Categorie B: Offline & Mobiel
| Feature | SwipeGuide | VKS | Dozuki | THG-DWI | Gap |
|---------|------------|-----|--------|---------|-----|
| Native mobiele app | ✅ | ✅ | ✅ | ❌ (web only) | Middel |
| Offline beschikbaar | ✅ | ✅ | ✅ | ❌ (SW geregistreerd, niet actief) | **Groot** |
| Push notificaties | ✅ | ✅ | ❌ | ❌ | Klein |

### Categorie C: Samenwerking & Feedback
| Feature | SwipeGuide | VKS | Dozuki | THG-DWI | Gap |
|---------|------------|-----|--------|---------|-----|
| Opmerkingen/feedback per stap | ✅ | ✅ | ✅ | ❌ | Middel |
| Revisie-aanvraag door operator | ✅ | ❌ | ✅ | ❌ | Middel |
| Meldingen bij wijzigingen | ✅ | ✅ | ✅ | ❌ | Middel |
| "Gelezen & begrepen" bevestiging | ✅ | ✅ | ✅ | ❌ | **Groot** |

### Categorie D: Training & Competentie
| Feature | SwipeGuide | VKS | Dozuki | THG-DWI | Gap |
|---------|------------|-----|--------|---------|-----|
| Kennistoets / quiz per DWI | ✅ | ❌ | ✅ | ❌ | Middel |
| Competentiematrix (wie kan wat) | ✅ | ✅ | ❌ | ❌ | Middel |
| Trainingsregistratie | ✅ | ✅ | ✅ | ❌ | Middel |
| Certificering / verloopdatum | ❌ | ✅ | ❌ | ❌ | Klein |

### Categorie E: Integraties
| Feature | SwipeGuide | VKS | Dozuki | THG-DWI | Gap |
|---------|------------|-----|--------|---------|-----|
| ERP-koppeling | ✅ | ✅ | ✅ | ❌ (A+W gepland) | **Groot** |
| QR/barcode op productiekaart | ✅ | ✅ | ✅ | ⚠️ (QR genereren kan, koppeling niet) | Middel |
| API voor externe systemen | ✅ | ✅ | ✅ | ❌ (alleen intern) | Middel |
| Webhook/notificaties | ✅ | ✅ | ❌ | ❌ | Klein |

### Categorie F: Data & Rapportage
| Feature | SwipeGuide | VKS | Dozuki | THG-DWI | Gap |
|---------|------------|-----|--------|---------|-----|
| Echte database (niet JSON files) | ✅ | ✅ | ✅ | ❌ | **Groot** |
| Backup & export | ✅ | ✅ | ✅ | ❌ | **Groot** |
| Uitgebreide rapportages | ✅ | ✅ | ✅ | ⚠️ (basic analytics) | Middel |
| Audit trail (wie deed wat wanneer) | ✅ | ✅ | ✅ | ⚠️ (versiegeschiedenis) | Middel |

### Categorie G: Content & Media
| Feature | SwipeGuide | VKS | Dozuki | THG-DWI | Gap |
|---------|------------|-----|--------|---------|-----|
| Video-ondersteuning | ✅ | ✅ | ✅ | ❌ | Middel |
| Annotaties op foto's (pijlen, cirkels) | ✅ | ✅ | ✅ | ❌ | Middel |
| Templates / sjablonen | ✅ | ✅ | ✅ | ❌ | Klein |
| Meerdere talen | ✅ | ✅ | ✅ | ✅ (AI-vertaling NL/EN/RO) | — |

---

## 5. Wat THG-DWI WEL heeft dat commerciële tools NIET hebben

| Feature | THG-DWI | Commercieel |
|---------|---------|-------------|
| **AI-generatie van complete DWI** | ✅ Claude genereert volledige instructie van foto's + beschrijving | ❌ Geen enkele tool doet dit |
| **AI-verbetering per stap** | ✅ Individuele stap laten herschrijven door AI | ❌ |
| **AI-vertaling** | ✅ Volledige DWI vertalen met context | ⚠️ Sommige hebben Google Translate |
| **SVG-illustraties door AI** | ✅ Technische diagrammen automatisch gegenereerd | ❌ |
| **Stap-voor-stap builder met AI** | ✅ Operator maakt foto's, AI schrijft de instructie | ❌ |
| **Extended thinking** | ✅ AI denkt diep na over volgorde en veiligheid | ❌ |
| **5S audit geïntegreerd** | ✅ In hetzelfde platform | ❌ Aparte tools nodig |
| **IST/SOLL/GAP analyse** | ✅ In hetzelfde platform | ❌ Aparte tools nodig |
| **Procesdiagrammen (Mermaid)** | ✅ Automatisch gegenereerd | ❌ Handmatig of apart |
| **Geen abonnementskosten** | ✅ Eigen platform, alleen API-kosten | ❌ €500-2000/mnd |

---

## 6. Prioriteiten voor doorontwikkeling

### Prioriteit 1 — Productierijp maken (weken)
- [ ] **Offline/PWA**: Service worker activeren, gepubliceerde DWI's cachen
- [ ] **Database migratie**: Van JSON-files naar SQLite (eenvoudig, geen server nodig)
- [ ] **Backup/export**: Automatische dagelijkse backup van alle data
- [ ] **Foto's koppelen aan bestaande DWI's**: SNI-001/002/BOR-001 foto-mapping afronden

### Prioriteit 2 — Gebruikersbeheer (maanden)
- [ ] **Simpele login**: Naam + pincode per medewerker (geen complex auth systeem)
- [ ] **Rollen**: Admin (Erik), Auteur (operators die DWI's maken), Lezer (productie)
- [ ] **"Gelezen & begrepen"**: Operator bevestigt dat hij instructie heeft gelezen
- [ ] **Trainingsregistratie**: Wie heeft welke DWI gelezen/begrepen

### Prioriteit 3 — Integraties (maanden)
- [ ] **A+W Business Pro koppeling**: Productiekaart → QR-code → juiste DWI
- [ ] **Opmerkingen per stap**: Operator kan feedback geven op een stap
- [ ] **Notificaties**: Bij nieuwe/gewijzigde DWI → melding naar relevante operators

### Prioriteit 4 — Content verrijking (doorlopend)
- [ ] **Video-ondersteuning**: Korte clips per stap (naast foto's)
- [ ] **Foto-annotaties**: Pijlen, cirkels, highlights op foto's
- [ ] **Templates**: Standaard-DWI sjablonen per type (opstarten, onderhoud, storingen)
- [ ] **Meer DWI's maken**: ESG-001 (Hardoven), ISO-POL-001 (foto's Simone), etc.

### Prioriteit 5 — Geavanceerd (toekomst)
- [ ] **Competentiematrix**: Wie is bevoegd voor welke machine/proces
- [ ] **Kennistoets**: Korte quiz na lezen van DWI
- [ ] **API voor externe systemen**: Zodat andere tools DWI's kunnen opvragen
- [ ] **Audit trail**: Compleet logboek van alle acties

---

## 7. Kostenvergelĳking

| Aspect | THG-DWI (eigen) | SwipeGuide | VKS | Dozuki |
|--------|-----------------|------------|-----|--------|
| Licentie/mnd | €0 | ~€500-1500 | ~€800-2000 | ~€600-1500 |
| API-kosten (Claude) | ~€20-50/mnd | — | — | — |
| Hosting | Eigen server/NAS | Cloud | Cloud | Cloud |
| Setup | Al gebouwd | Weken-maanden | Weken-maanden | Weken-maanden |
| Maatwerk | Onbeperkt | Beperkt | Beperkt | Beperkt |
| AI-generatie | ✅ Kernfunctie | ❌ | ❌ | ❌ |
| Onderhoud | Zelf (+ Claude Code) | Leverancier | Leverancier | Leverancier |

---

## 8. Samenvatting

**THG-DWI-Platform is een werkend, uniek platform** dat dingen kan die geen enkele commerciële tool biedt (AI-generatie, AI-vertaling, AI-verbetering). De grootste gaps zitten in **gebruikersbeheer**, **offline beschikbaarheid**, en **database-opslag**. Die zijn allemaal oplosbaar zonder de kern te veranderen.

De kernvraag: **bouw je verder op eigen platform (met AI als USP) of stap je over naar een commerciële tool (en verlies je de AI-features)?** Het antwoord hangt af van hoeveel waarde de AI-generatie heeft vs. hoeveel waarde gebruikersbeheer/offline/integraties hebben voor THG.
