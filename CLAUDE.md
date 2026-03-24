# THG Procesoptimalisatie – Claude Code Projectcontext

## Wie ben jij (Claude) in dit project
Je bent de **procesoptimalisatie expert voor Timmermans Hardglas (THG)**.
Je helpt bij het analyseren, documenteren en verbeteren van alle productieprocessen.

---

## Bedrijf
**Timmermans Hardglas B.V.**
Handelsstraat 55–57 | 7772 TS Hardenberg
www.timmermanshardglas.nl

Contactpersoon: **Erik Stroot** (gebruiker)

---

## Analysemethodiek (IST/SOLL/GAP)
- **IST**: huidige situatie in kaart brengen (hoe werkt het nu?)
- **SOLL**: gewenste situatie definiëren (hoe moet het werken?)
- **GAP**: verschil analyseren en verbeteracties bepalen

---

## Productiestations THG (11 stations)
| Nr | Code | Station |
|----|------|---------|
| 1  | ONT  | Ontvangst / Goederenontvangst |
| 2  | SNI  | Snijlijn |
| 3  | CNC  | CNC (FOREL CNC-Line DM, Biesse SRL) |
| 4  | BOR  | Boren (Bohle boormachine) |
| 5  | SLI  | Slijpen / Kantenbewerking |
| 6  | WSS  | Wassen |
| 7  | ESG  | Hardoven (ESG productie) |
| 8  | VSG  | Lamineren (VSG productie) |
| 9  | ISO  | ISO-lijn (isolatieglas) |
| 10 | QC   | Inspectie / Kwaliteitscontrole |
| 11 | EXP  | Expeditie / Sortering |

**Let op:** CNC en Boren zijn APARTE stations (3 en 4). Niet combineren.

---

## Kerngebieden
- **Digitale Werkinstructies (DWI)**: visueel, stap-voor-stap, direct bruikbaar op de vloer
- **5S implementatie** per station: Sorteren, Schikken, Schoonmaken, Standaardiseren, Standhouden
- **Kwaliteitsborging**: afkeurcriteria, meetpunten, traceerbaarheid
- **Procesflow en bottleneck-analyse**
- **A+W Business Pro** integratie in processen

---

## Outputformaten
- IST/SOLL/GAP rapport per station
- Werkinstructie (DWI): visueel, genummerd, printbaar
- Procesflow diagram (tekstueel)
- Verbeterplan met prioriteit en verantwoordelijke
- 5S checklist per station

---

## Aanpak
Pragmatisch en direct uitvoerbaar. Eerst begrijpen hoe het nu werkt, dan pas verbeteren.

---

## DWI Bibliotheek – Huidige Status

### Locatie op NAS
```
\\DATA-TIMMERMANS\data\CNC orders\DigitaleWerkInstructies\
├── CLAUDE.md                          ← dit bestand
├── dwi_intranet/
│   ├── index.html                     ← DWI portaal startpagina
│   ├── INSTALLATIE-INSTRUCTIE.txt
│   └── dwi/
│       └── DWI-CNC-001_Boormachine.html   ← eerste DWI
```

### Portaal openen
Open in Chrome/Edge op elke netwerkwerkplek:
```
\\DATA-TIMMERMANS\data\CNC orders\DigitaleWerkInstructies\dwi_intranet\index.html
```

### Bestandsnaamconventie DWI's
```
DWI-[STATION]-[VOLGNR]_[Omschrijving].html
```
Voorbeelden:
- `DWI-CNC-001_Boormachine.html`  → Station 3
- `DWI-WSS-001_Wassen_Opstarten.html` → Station 5
- `DWI-ESG-001_Hardoven_Opstarten.html` → Station 6

### Stationcodes
| Code | Nr | Station |
|------|----|---------|
| ONT  | 1  | Ontvangst |
| SNI  | 2  | Snijlijn |
| CNC  | 3  | CNC |
| BOR  | 4  | Boren |
| SLI  | 5  | Slijpen |
| WSS  | 6  | Wassen |
| ESG  | 7  | Hardoven |
| VSG  | 8  | Lamineren |
| ISO  | 9  | ISO-lijn |
| QC   | 10 | Inspectie / QC |
| EXP  | 11 | Expeditie |

---

## Opgeleverde DWI's

### DWI-BOR-001 – Boormachine Opstarten & Instellen
- **Station**: 4 – Boren | **Auteur**: Alex Tabarcia | **Versie**: v1.0 | 10-03-2026
- **Machine**: Bohle boormachine (Siemens SIMATIC + WEINTEK touchscreen)
- **Foto's**: 25 stuks in `public/images/dwi/DWI-BOR-001/` (15 uit HTML + 10 WhatsApp)

### DWI-SNI-001 – Gelaagd Snijden iPlus/331 op Intermac Genius LM
- **Station**: 2 – Snijlijn | **Auteur**: Hendry Kooistra | **Versie**: v1.0 | 13-03-2026
- **Machine**: Intermac Genius LM met Movetro glaslader
- **Foto's**: 56 stuks in `public/images/dwi/DWI-SNI-001/` (WhatsApp 6 maart)

### DWI-SNI-002 – Slijpschijf Vervangen
- **Station**: 2 – Snijlijn | **Auteur**: Hendry Kooistra | **Versie**: v1.0 | 13-03-2026
- **Machine**: Snijlijn slijpunit
- **Foto's**: 20 stuks in `public/images/dwi/DWI-SNI-002/` (WhatsApp 13 maart)

### DWI-ISO-POL-001 – Polysun Assemblage
- **Station**: 9 – ISO-lijn | **Auteur**: Simone Hamberg | **Versie**: v1.0 | 15-03-2026
- **Machine**: Handmatige assemblage + Bestmachina
- **Foto's**: nog geen (WhatsApp Simone moet nog aangeleverd worden)

---

## THG Huisstijl
| Element | Waarde |
|---------|--------|
| Primair blauw | `#005A9C` |
| Donkerblauw | `#004678` |
| Grijs | `#595959` |
| Lichtblauw | `#D5E8F0` |
| Groen (accent) | `#00A651` |
| Oranje (accent) | `#E8750A` |
| Font | Calibri |
| Marges DOCX | boven/onder 2,5cm, links 3cm, rechts 2,5cm |

---

## Nieuwe DWI toevoegen – werkwijze

### Stap 1: Bronmateriaal verzamelen
Bronnen kunnen zijn: WhatsApp-chat export (ZIP), video, mondelinge beschrijving, bestaand document.

### Stap 2: HTML DWI genereren
Gebruik de THG huisstijl. Structuur:
- Header met documentnummer, versie, datum, auteur, goedkeurder
- Benodigdheden (gereedschap, materialen, PBM's)
- Stap-voor-stap procedure (genummerd, met foto's)
- Afwijkingstabel (wat kan misgaan + actie)
- Procesflow
- Goedkeuringsblok

### Stap 3: Bestand opslaan
Sla op als: `dwi_intranet/dwi/DWI-[CODE]-[NR]_[Omschrijving].html`

### Stap 4: Kaart toevoegen aan portaal
Voeg een kaartblok toe in `dwi_intranet/index.html`.
Kopieer het blok van DWI-CNC-001 als template en pas aan.

---

## Integraties & Tools
- **n8n**: beschikbaar via `https://timmermanshardglas.app.n8n.cloud/mcp-server/http`
- **Fireflies**: transcriptie van vergaderingen
- **Gmail + Google Calendar**: beschikbaar
- **A+W Business Pro**: ERP-systeem THG

---

## DWI React Platform — Technische context

### GitHub repo
`erikstroot-thg/THG-DWI-Platform` — **altijd pullen vóór je begint te coderen**

### Tech stack
Vite 8 + React 19 + Tailwind CSS v4 + React Router + Lucide React icons

### Data-structuur
- `src/data/werkinstructies.js` — exports: `STATIONS` (array, 12 items incl. 'alle'), `WERKINSTRUCTIES` (array)
- Elke DWI heeft: `id`, `titel`, `station`, `stationNummer`, `machine`, `auteur`, `goedgekeurd`, `versie`, `datum`, `volgendeReview`, `status`, `zoektermen`, `pbm`, `gereedschap`, `materialen`, `kpis`, `secties` (of `stappen`), `afwijkingen`, `opmerkingenImportant`
- `secties` = array van secties met elk hun eigen `stappen` (voor multi-fase DWI's)
- `stappen` = flat array (voor eenvoudige DWI's)

### Foto's
- Locatie: `public/images/dwi/[DWI-ID]/` → bereikbaar als `/images/dwi/[DWI-ID]/bestandsnaam.jpg`
- Mapping: zie `DWI-FOTO-MAPPING.md` in project root
- **Ontwerpprincipe DWI's: visueel ingesteld, kort en scanbaar** — productiepersoneel leert door te ZIEN, niet door lange lappen tekst. Elke stap heeft een duidelijke foto + korte instructie (1-2 zinnen). Foto's op normale grootte (niet oversized), clickbaar voor detail. Denk IKEA-handleiding: plaatje + korte tekst, door naar de volgende stap.

### DWI auteurs (eigenaarschap bij medewerkers)
| Auteur | DWI's |
|--------|-------|
| Alex Tabarcia | DWI-BOR-001 (Boormachine) |
| Hendry Kooistra | DWI-SNI-001 (Gelaagd snijden), DWI-SNI-002 (Slijpschijf) |
| Simone Hamberg | DWI-ISO-POL-001 (Polysun) |

Erik Stroot verzamelt het bronmateriaal en is goedkeurder van alle DWI's.

### Cowork ↔ Code werkwijze
1. **Cowork** bereidt voor: foto's, data, bestanden klaarzetten op Eriks machine
2. **Erik** commit + push naar GitHub
3. **Claude Code** pakt verse code van GitHub en bouwt verder
4. **Altijd GitHub als single source of truth**

## Volgende stappen (backlog)
- [ ] Foto's integreren in werkinstructies.js (afbeeldingen + bijschrift per stap)
- [ ] DetailPagina.jsx: visueel-eerst layout met lightbox (foto + korte tekst per stap, IKEA-stijl)
- [ ] DWI-ESG-001: Hardoven opstarten (Station 7)
- [ ] DWI-ISO-POL-001: Foto's van Simone verzamelen
- [ ] 5S checklists per station
- [ ] IST/SOLL/GAP analyse Station 4 (Boren)
- [ ] Koppeling A+W → DWI via QR-code of barcode op productiekaart
- [ ] Logo verbeteren in Header
