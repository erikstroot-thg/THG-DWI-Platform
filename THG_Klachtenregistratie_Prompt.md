# Prompt voor Power Apps (Copilot) – "THG Klachtenregistratie"

Bouw een **Power Apps mobiele app (phone layout, portrait)** voor **Timmermans Hardglas B.V.** in onze THG-huisstijl. Gebruik **Dataverse** als datalaag en maak een nieuwe tabel: **THG_Klachten**.
Maak 3 schermen: **Lijst**, **Nieuw/Bewerken**, **Details**. Voeg zoek-, filter- en sorteeropties toe. Alle velden hieronder moeten invulbaar zijn op mobiel, met validaties.

## Dataverse-tabel: THG_Klachten (kolommen & typen)

* **KlachtID** (Autonummer, format KL-{DATETIMEUTC:yyyyMM}-{SEQNUM:4}, alleen-lezen in app)
* **DatumMelding** (DateOnly, default = Today(), verplicht)
* **MelderNaam** (Text, default = User().FullName, verplicht)
* **MelderEmail** (Text, default = User().Email)
* **Afdeling** (Choice: Productie, Logistiek, Verkoop, Inkoop, Kwaliteit, Technische Dienst, Administratie, Anders; verplicht)
* **Functie** (Text)
* **Herkomst** (Choice: Intern, Extern; verplicht)
* **KlantLeverancier** (Text)
* **ProcesOfProduct** (Text)
* **Omschrijving** (Multiline Text, verplicht, min. 20 tekens)
* **OorzaakAnalyse** (Multiline Text)
* **CorrigerendeMaatregel** (Multiline Text)
* **PreventieveMaatregel** (Multiline Text)
* **VerantwoordelijkeOpvolging** (User/Person, verplicht)
* **StreefdatumAfronding** (DateOnly, verplicht)
* **DatumAfronding** (DateOnly, business rule: mag niet vóór DatumMelding liggen)
* **Status** (Choice: Nieuw, In behandeling, In afwachting, Afgehandeld, Geannuleerd; default = Nieuw; verplicht)
* **Prioriteit** (Choice: Laag, Midden, Hoog; default = Midden)
* **Bijlagen** (File/Image: meerdere, voor foto’s van schade/glas)
* **HandtekeningAfhandeling** (Pen input / image capture, verplicht zodra Status = Afgehandeld)
* **Opmerkingen** (Multiline Text)
* **AangemaaktDoor** (User, default = Current user, alleen-lezen)
* **AangemaaktOp** (DateTime, system, alleen-lezen)
* **LaatstBijgewerktOp** (DateTime, system, alleen-lezen)

## Validaties & logica

* **Omschrijving**: min. 20 tekens, toon foutmelding bij te korte invoer.
* **StreefdatumAfronding**: ≥ DatumMelding, anders foutmelding.
* **DatumAfronding**: alleen zichtbaar/bewerkbaar als Status = Afgehandeld; moet ≥ DatumMelding.
* **HandtekeningAfhandeling**: verplicht als Status = Afgehandeld.
* **VerantwoordelijkeOpvolging**: verplicht (User-picker).
* **Afdeling** en **Status** en **Herkomst**: verplicht.

## UX & navigatie

* **Lijstscherm**:

  * Galerij met kaarten: KlachtID, Status (met kleurbadge), Prioriteit, DatumMelding, Afdeling, VerantwoordelijkeOpvolging.
  * Bovenin: zoek (op Omschrijving, KlachtID, KlantLeverancier), filters (Status, Afdeling, Prioriteit, Herkomst) en sorteren (nieuwste eerst).
  * FAB “+” voor nieuwe klacht.
* **Nieuw/Bewerken** (EditForm): form in logische secties met duidelijke labels en placeholders. Toon validatiefouten inline.
* **Details**: alle velden readonly, met knop **Bewerken**, **Status wijzigen** en **Bijlage bekijken**.
* Voeg **pull-to-refresh** toe op Lijst.

## Branding (THG-stijl)

* Lettertype **Calibri**; veel witruimte; strakke indeling.
* **Kopbalk** met links het **THG-logo** (ik upload een media-asset “timmermans-hardglas-logo.png”) en titel “Klachtenregistratie”.
* Accentkleur **THG-blauw**; statusbadges in neutrale kleurtinten (groen Afgehandeld, oranje In behandeling, grijs Nieuw, rood Hoog-prioriteit).
* **Voettekst** (klein lettertype) onderaan schermen: “Timmermans Hardglas B.V. | Handelsstraat 55–57 | 7772 TS Hardenberg”.

## Automatisering (Power Automate – aanmaken als onderdeel van de oplossing)

1. **Notificatie bij nieuwe klacht**

   * Trigger: nieuw record in THG_Klachten.
   * Actie: post adaptief bericht in **Teams kanaal ‘Kwaliteit’** met kaartenvelden (KlachtID, Afdeling, Prioriteit, Omschrijving samenvatting, VerantwoordelijkeOpvolging) en link “Openen in app”.
2. **Escalatie hoge prioriteit**

   * Als Prioriteit = Hoog of StreefdatumAfronding binnen 48 uur verstrijkt: stuur e-mail naar **Kwaliteit@** + verantwoordelijke + manager Productie & Logistiek.
3. **Afhandelingsbevestiging**

   * Trigger: Status → Afgehandeld.
   * Actie: registreer DatumAfronding (als leeg), vereis HandtekeningAfhandeling en stuur bevestiging naar melder (MelderEmail indien gevuld).

## Beveiliging & rechten

* Maak **Beveiligingsrol “THG-Kwaliteit-User”** met CRUD op THG_Klachten (eigen records schrijven, teamrecords lezen).
* Alleen rol “THG-Kwaliteit-Lead” mag Status direct op **Geannuleerd** zetten.

## Offline (optioneel, graag toevoegen)

* Voeg **SaveData/LoadData** toe voor lokaal cachen van recente klachten en nieuw aangemaakte records in wachtrij.
* Sync-knop die probeert te verzenden bij netwerkherstel; toon badge met aantal unsynced items.

## Acceptatiecriteria

* Nieuwe klacht is in <3 taps te registreren (FAB → form → Verzenden).
* Alle verplichte velden hebben duidelijke foutmeldingen.
* Teams-melding verschijnt binnen 1 minuut met link.
* Statusflow en datums bewaken logica (geen afrondingsdatum vóór meldingsdatum, handtekening verplicht bij Afgehandeld).
* App werkt prettig op 6–6.7” scherm (Android/iOS).

**Genereer nu de Dataverse-tabel, de app met drie schermen, de form-validaties, de Teams-notificatieflow, en voeg het logo toe als media-asset.**
Exporteer alles als **solution** “THG_Klachtenregistratie” (publisher THG, version 1.0.0.0).

---

Wil je dat ik er ook meteen een **CSV met choices** en een **Teams-kanaal sjabloon** bij lever, of eerst even bouwen en testen met een paar voorbeeldrecords?
