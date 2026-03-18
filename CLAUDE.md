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

## Productiestations THG (10 stations)
| Nr | Station |
|----|---------|
| 1  | Ontvangst / Goederenontvangst |
| 2  | Snijlijn |
| 3  | CNC / Boren (FOREL CNC-Line DM, Biesse SRL) |
| 4  | Slijpen / Kantenbewerking |
| 5  | Wassen |
| 6  | Hardoven (ESG productie) |
| 7  | Lamineren (VSG productie) |
| 8  | ISO-lijn (isolatieglas) |
| 9  | Inspectie / Kwaliteitscontrole |
| 10 | Expeditie / Sortering |

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
| Code | Station |
|------|---------|
| ONT  | Ontvangst |
| SNI  | Snijlijn |
| CNC  | CNC / Boren |
| SLI  | Slijpen |
| WSS  | Wassen |
| ESG  | Hardoven |
| VSG  | Lamineren |
| ISO  | ISO-lijn |
| QC   | Inspectie / QC |
| EXP  | Expeditie |

---

## Opgeleverde DWI's

### DWI-CNC-001 – Boormachine Opstarten & Instellen
- **Station**: 3 – CNC / Boren
- **Machine**: Bohle boormachine (Siemens SIMATIC paneel + WEINTEK touchscreen)
- **Auteur**: Alex Tabarcia
- **Goedgekeurd**: Erik Stroot
- **Versie**: v1.0 | Datum: 10-03-2026
- **Volgende review**: 10-09-2026
- **Bestand HTML**: `dwi_intranet/dwi/DWI-CNC-001_Boormachine.html`
- **Bestand DOCX**: zie `C:\Users\eriks\AI Fileserver\WI_Werkinstructies\DWI-Boormachine-THG.docx`

**7 Fasen procedure:**
1. Machine inschakelen (groene knop gele behuizing)
2. Tafel resetten (rode → blauwe knop 3 sec → Reset touchscreen)
3. Waterkranen openen (beide groene kogelkranen horizontaal)
4. Tafelbeweging inschakelen ("Turn on" touchscreen)
5. SET 0 instellen (X=60, Y=27 → Play → testglas → Nullen-knop → bovenboor + onderboor)
6. Automatic Drilling starten (Bohle menu → AUTOMATIC DRILLING → START)
7. Meten & keuren (Bahco 250mm liniaal)

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

## Volgende stappen (backlog)
- [ ] DWI-SNI-001: Snijlijn opstarten (Station 2)
- [ ] DWI-ISO-001: ISO-lijn handeling (Station 8) — handboek bestaat al als DOCX
- [ ] DWI-ESG-001: Hardoven opstarten (Station 6)
- [ ] 5S checklists per station
- [ ] IST/SOLL/GAP analyse Station 3 (CNC/Boren)
- [ ] Koppeling A+W → DWI via QR-code of barcode op productiekaart
