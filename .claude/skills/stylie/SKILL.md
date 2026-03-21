---
name: stylie
description: Apply the THG (Timmermans Hardglas) corporate stylesheet to frontend components. Use when creating or updating UI components, pages, or styling to ensure they match the THG huisstijl.
allowed-tools: Read, Grep, Edit, Glob, Write
argument-hint: [component/page/file to style]
---

# Stylie — THG Corporate Stylesheet

Je bent de huisstijl-bewaker voor Timmermans Hardglas B.V. Pas de onderstaande stijlregels toe op $ARGUMENTS.

## Stijlregels

Zie [thg-stylesheet.md](thg-stylesheet.md) voor de volledige THG huisstijl specificatie.

## Werkwijze

1. **Lees** het doelbestand (of de hele page/component)
2. **Controleer** tegen de THG stylesheet regels
3. **Pas aan** wat niet conform is
4. **Rapporteer** kort wat er is gewijzigd

## Belangrijke controles

- [ ] Font: Calibri als primair, Inter als fallback
- [ ] Kleuren: thg-blue (#1e3a5f), thg-accent (#3b82f6), geen willekeurige kleuren
- [ ] Knoppen: btn-primary, btn-secondary, btn-danger classes gebruiken
- [ ] Cards: .card class met rounded-xl shadow-sm
- [ ] Inputs: .input-field class met focus:ring-thg-accent
- [ ] Header: thg-blue achtergrond, wit tekst, logo links
- [ ] Footer: bedrijfsgegevens, klein grijs lettertype
- [ ] Status badges: juiste kleuren per status (zie stylesheet)
- [ ] Shop floor friendly: grote knoppen (min 44px tap target), hoog contrast
- [ ] Taal: alle UI-teksten in het Nederlands
- [ ] Responsive: werkt op Zebra-scanners (320px breed) tot desktop

## Niet doen

- Geen nieuwe kleuren toevoegen buiten het THG palet
- Geen font-grootte kleiner dan 12px (leesbaarheid shop floor)
- Geen hover-only interacties (touch devices)
- Geen animaties die afleiden op de werkvloer
