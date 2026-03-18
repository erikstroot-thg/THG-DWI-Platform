# THG-DWI-Platform

Digitale Werkinstructies (DWI) portaal voor **Timmermans Hardglas B.V.**

## Wat is dit?

Een HTML-gebaseerd intranetportaal met digitale werkinstructies per productiestation.
Elke DWI is een visuele, stap-voor-stap instructie die direct bruikbaar is op de werkvloer.

## Productiestations

| Nr | Station | Code |
|----|---------|------|
| 1  | Ontvangst / Goederenontvangst | ONT |
| 2  | Snijlijn | SNI |
| 3  | CNC / Boren | CNC |
| 4  | Slijpen / Kantenbewerking | SLI |
| 5  | Wassen | WSS |
| 6  | Hardoven (ESG) | ESG |
| 7  | Lamineren (VSG) | VSG |
| 8  | ISO-lijn (isolatieglas) | ISO |
| 9  | Inspectie / Kwaliteitscontrole | QC |
| 10 | Expeditie / Sortering | EXP |

## Opgeleverde DWI's

| Code | Omschrijving | Status |
|------|-------------|--------|
| DWI-CNC-001 | Boormachine Opstarten en Instellen | Gereed |
| DWI-SNI-001 | Snijlijn opstarten | Backlog |
| DWI-ISO-001 | ISO-lijn handeling | Backlog |
| DWI-ESG-001 | Hardoven opstarten | Backlog |

## Portaal openen

Open in Chrome/Edge op elke netwerkwerkplek of na clonen: dwi_intranet/index.html

## Bestandsnaamconventie

DWI-[STATION]-[VOLGNR]_[Omschrijving].html

## Nieuwe DWI toevoegen

1. Bronmateriaal verzamelen (WhatsApp-export, video, document)
2. HTML DWI genereren in THG-huisstijl
3. Opslaan als dwi_intranet/dwi/DWI-[CODE]-[NR]_[Omschrijving].html
4. Kaart toevoegen aan dwi_intranet/index.html

## Tech

Puur HTML/CSS - geen build tools, geen server, geen dependencies.

## Eigenaar

**Erik Stroot** - Timmermans Hardglas B.V.
Ontwikkeling via Claude Code.
