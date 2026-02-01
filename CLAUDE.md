# CLAUDE.md – AI Assistant Guide for THG Klachtenregistratie

## Project Overview

This repository contains the **THG Klachtenregistratie** (Complaint Registration) system for **Timmermans Hardglas B.V.**, a glass manufacturing company based in Hardenberg, Netherlands. The system is built entirely on the **Microsoft Power Platform** (low-code/no-code) and is not a traditional source code project.

**Core stack:** Power Apps (mobile) + Dataverse (data) + Power Automate (workflows) + Microsoft Teams (notifications)

## Repository Structure

```
/
├── README.md                              # Project summary and table of contents (Dutch)
├── THG_Klachtenregistratie_Prompt.md      # Comprehensive Copilot/Codex prompt for building the solution
├── THG-Klachtenregistratie.zip            # Packaged Power Platform solution export
│   ├── THG-Klachtenregistratie/README.md
│   ├── THG-Klachtenregistratie/docs/Procesbeschrijving.md
│   └── THG-Klachtenregistratie/dataverse/schema.json
├── Klachten en Garantie afhandeling       # Git initialization script
└── CLAUDE.md                              # This file
```

## Key Concepts

### Language & Localization

- All documentation, field names, UI labels, and choice values are in **Dutch**.
- Key term translations for AI context:
  - Klacht = Complaint
  - Afdeling = Department
  - Herkomst = Origin (Intern/Extern)
  - Omschrijving = Description
  - Bijlagen = Attachments
  - Afgehandeld = Completed/Resolved
  - Streefdatum = Target date
  - Melder = Reporter
  - Handtekening = Signature

### Dataverse Table: THG_Klachten

The single core table with these important fields:

| Field | Type | Notes |
|-------|------|-------|
| KlachtID | Autonumber | Format: `KL-{DATETIMEUTC:yyyyMM}-{SEQNUM:4}`, read-only |
| DatumMelding | DateOnly | Default: Today(), mandatory |
| MelderNaam | Text | Default: User().FullName, mandatory |
| Status | Choice | Nieuw, In behandeling, In afwachting, Afgehandeld, Geannuleerd |
| Prioriteit | Choice | Laag, Midden, Hoog (default: Midden) |
| Afdeling | Choice | 8 departments (Productie, Logistiek, Verkoop, etc.) |
| Herkomst | Choice | Intern, Extern |
| Omschrijving | Multiline Text | Min. 20 characters, mandatory |
| HandtekeningAfhandeling | Pen/Image | Required when Status = Afgehandeld |

See `THG_Klachtenregistratie_Prompt.md` for the full schema with all 20+ fields.

### Business Rules

1. **Omschrijving** must be >= 20 characters
2. **StreefdatumAfronding** must be >= DatumMelding
3. **DatumAfronding** is only visible/editable when Status = Afgehandeld and must be >= DatumMelding
4. **HandtekeningAfhandeling** is mandatory when Status = Afgehandeld
5. Only the "THG-Kwaliteit-Lead" role can set Status to Geannuleerd

### Power Automate Flows

1. **New complaint notification** - Posts adaptive card to Teams 'Kwaliteit' channel
2. **High priority escalation** - Emails quality + managers when Prioriteit = Hoog or deadline within 48h
3. **Completion confirmation** - Sets DatumAfronding, requires signature, emails reporter

### App Design

- 3-screen mobile app: List, New/Edit, Details
- Phone layout, portrait orientation
- THG corporate branding (Calibri font, THG-blue accent)
- Target: <3 taps to register a new complaint

## Development Conventions

### Naming

- **Dataverse tables:** PascalCase with `THG_` prefix (e.g., `THG_Klachten`)
- **Fields:** PascalCase in Dutch (e.g., `VerantwoordelijkeOpvolging`)
- **Autonumber IDs:** Pattern `KL-{DATETIMEUTC:yyyyMM}-{SEQNUM:4}`
- **Security roles:** Prefixed with `THG-Kwaliteit-` (e.g., `THG-Kwaliteit-User`, `THG-Kwaliteit-Lead`)
- **Solution name:** `THG_Klachtenregistratie` (publisher: THG, version: 1.0.0.0)

### File Conventions

- Documentation is written in **Dutch**
- Markdown files use standard GitHub-flavored markdown
- The prompt file (`THG_Klachtenregistratie_Prompt.md`) serves as the primary specification document

### Git Practices

- Commit messages are in **English**
- Short, descriptive commit messages (imperative mood)
- All development on the `main` branch (single contributor so far)

## How to Work with This Repository

### For AI Assistants

1. **This is a Power Platform project** - There is no traditional source code to compile or run. Changes are made through Power Apps Studio, Dataverse configuration, and Power Automate designer.
2. **The prompt file is the spec** - `THG_Klachtenregistratie_Prompt.md` is the authoritative specification for building the solution. Treat it as the source of truth for requirements.
3. **The zip is a solution export** - `THG-Klachtenregistratie.zip` contains a packaged Power Platform solution with schema definitions and process documentation.
4. **When modifying documentation**, maintain Dutch language consistency unless the file is explicitly in English (like commit messages or this file).
5. **When updating the prompt**, preserve the existing structure (Dataverse schema, Validaties, UX, Branding, Automatisering, Beveiliging, Offline, Acceptatiecriteria sections).

### Key Files to Read First

1. `THG_Klachtenregistratie_Prompt.md` - Full system specification
2. `README.md` - Project overview and component list

## Architecture Summary

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Power Apps  │────>│   Dataverse  │<────│  Power Automate  │
│  (Mobile UI) │     │ THG_Klachten │     │  (3 Flows)       │
└─────────────┘     └──────────────┘     └────────┬─────────┘
                                                   │
                                          ┌────────▼─────────┐
                                          │  Microsoft Teams  │
                                          │  + Email          │
                                          └──────────────────┘
```

## Security Model

- **THG-Kwaliteit-User**: CRUD on own records, read on team records
- **THG-Kwaliteit-Lead**: Full access + can cancel (Geannuleerd) complaints
- Field-level security: system fields (AangemaaktDoor, AangemaaktOp, LaatstBijgewerktOp) are read-only
