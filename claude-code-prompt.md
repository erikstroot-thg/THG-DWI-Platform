# Opdracht: DWI Platform — Foto's toevoegen aan werkinstructies

## Context
In `C:\Users\eriks\thg-dwi-platform` staat een Vite + React + Tailwind app voor Digitale Werkinstructies (DWI) van Timmermans Hardglas.

Er zijn nu 101 foto's toegevoegd in `public/images/dwi/` georganiseerd per DWI:
- `public/images/dwi/DWI-BOR-001/` — 25 foto's (stap-01.jpg t/m stap-15.jpg + extra-01.jpg t/m extra-10.jpg)
- `public/images/dwi/DWI-SNI-001/` — 56 foto's (stap-01.jpg t/m stap-56.jpg)
- `public/images/dwi/DWI-SNI-002/` — 20 foto's (stap-01.jpg t/m stap-20.jpg)

In de root staat `DWI-FOTO-MAPPING.md` met een complete mapping van welke foto bij welke stap hoort, inclusief bijschriften.

## Wat moet er gebeuren

### 1. `src/data/werkinstructies.js` uitbreiden
Voeg aan elke stap `afbeeldingen` (array van paden) en `bijschrift` (array van strings) toe. Gebruik de mapping uit `DWI-FOTO-MAPPING.md`. Paden beginnen met `/images/dwi/DWI-ID/bestandsnaam.jpg`.

Voorbeeld structuur per stap:
```javascript
{
  tekst: 'Druk op de groene knop in de gele behuizing',
  afbeeldingen: ['/images/dwi/DWI-BOR-001/stap-01.jpg'],
  bijschrift: ['Groene knop = AAN | Rode knop = UIT']
}
```

Voor stappen met substappen: voeg afbeeldingen toe op substap-niveau waar relevant.

### 2. `src/components/DetailPagina.jsx` aanpassen
Maak de layout 80% visueel, 20% tekst:
- Foto's moeten GROOT en PROMINENT zijn — full-width binnen de content area
- Tekst eronder als korte toelichting
- Lightbox functionaliteit: klik op foto → vergroot weergeven
- Op mobiel: foto's full-width, tekst eronder
- Bijschrift onder elke foto in klein grijs lettertype
- Als een stap meerdere foto's heeft: toon ze als grid (2 kolommen op desktop, 1 op mobiel)

### 3. Ontwerpprincipe
Dit is voor productiepersoneel op de werkvloer. Zij leren door te ZIEN, niet door te lezen.
- 80% van de informatie moet visueel zijn (foto's)
- 20% is ondersteunende tekst
- Grote, duidelijke foto's met minimale tekst
- Mobile-first (wordt vaak op telefoon bekeken)

## Technische details
- Vite serveert bestanden uit `public/` direct op root-pad
- Dus `public/images/dwi/DWI-BOR-001/stap-01.jpg` → bereikbaar als `/images/dwi/DWI-BOR-001/stap-01.jpg`
- App draait op localhost:5173
- Na wijzigingen: `npm run build` om te checken op fouten
- GitHub repo: erikstroot-thg/THG-DWI-Platform — commit en push als je klaar bent
