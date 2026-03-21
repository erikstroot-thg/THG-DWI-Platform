# THG Huisstijl Specificatie — Timmermans Hardglas B.V.

## 1. Kleuren

### Primair palet (Tailwind custom kleuren)

| Naam | Hex | Tailwind class | Gebruik |
|------|-----|----------------|---------|
| THG Blauw | `#1e3a5f` | `bg-thg-blue`, `text-thg-blue` | Headers, primaire knoppen, navigatie |
| THG Blauw Light | `#2b5282` | `bg-thg-blue-light` | Hover states, secondary backgrounds |
| THG Blauw Dark | `#152d49` | `bg-thg-blue-dark` | Active states, donkere accenten |
| THG Accent | `#3b82f6` | `bg-thg-accent`, `text-thg-accent` | Links, focus rings, actieve elementen |

### Functionele kleuren

| Naam | Hex | Tailwind class | Gebruik |
|------|-----|----------------|---------|
| THG Oranje | `#f97316` | `bg-thg-orange` | Waarschuwingen, aandacht |
| THG Rood | `#ef4444` | `bg-thg-red` | Fouten, kritieke status, verwijderen |
| THG Groen | `#22c55e` | `bg-thg-green` | Succes, actief, afgerond |
| THG Grijs | `#6b7280` | `text-thg-gray` | Secundaire tekst, randen |

### Achtergronden

| Context | Class |
|---------|-------|
| Pagina achtergrond | `bg-gray-50` |
| Card achtergrond | `bg-white` |
| Header | `bg-thg-blue` |
| Sidebar (indien van toepassing) | `bg-thg-blue-dark` |
| Tabel header | `bg-gray-100` |
| Tabel rij hover | `hover:bg-gray-50` |

---

## 2. Typografie

### Font stack
```
font-family: 'Calibri', 'Inter', system-ui, sans-serif;
```

Tailwind config:
```js
fontFamily: {
  sans: ['Calibri', 'Inter', 'system-ui', 'sans-serif'],
}
```

### Groottes

| Element | Tailwind class | Minimale grootte |
|---------|----------------|------------------|
| H1 (paginatitel) | `text-2xl font-bold` | 24px |
| H2 (sectietitel) | `text-xl font-semibold` | 20px |
| H3 (subsectie) | `text-lg font-semibold` | 18px |
| Body tekst | `text-base` | 16px |
| Label | `text-sm font-medium` | 14px |
| Caption/hulptekst | `text-sm text-thg-gray` | 14px |
| Kleinste toegestaan | `text-xs` | 12px — NOOIT kleiner |

---

## 3. Knoppen

### Primaire knop
```jsx
<button className="bg-thg-blue hover:bg-thg-blue-light text-white font-semibold
  py-3 px-6 rounded-lg min-h-[44px] min-w-[44px]
  transition-colors duration-150 active:bg-thg-blue-dark">
  Actie
</button>
```

### Secundaire knop
```jsx
<button className="bg-white border-2 border-thg-blue text-thg-blue font-semibold
  py-3 px-6 rounded-lg min-h-[44px]
  hover:bg-thg-blue hover:text-white transition-colors duration-150">
  Annuleren
</button>
```

### Danger knop
```jsx
<button className="bg-thg-red hover:bg-red-600 text-white font-semibold
  py-3 px-6 rounded-lg min-h-[44px]
  transition-colors duration-150">
  Verwijderen
</button>
```

### Knop regels
- **Minimaal 44x44px** tap target (shop floor, handschoenen)
- Altijd `font-semibold`
- Altijd `rounded-lg`
- Altijd een hover en active state
- Icon + tekst combinaties: icon links, tekst rechts, `gap-2`

---

## 4. Cards

```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  {/* Card content */}
</div>
```

### Card varianten

| Variant | Extra classes |
|---------|--------------|
| Standaard | `shadow-sm` |
| Verhoogd (modaal) | `shadow-lg` |
| Klikbaar | `hover:shadow-md cursor-pointer transition-shadow` |
| Waarschuwing | `border-l-4 border-l-thg-orange` |
| Fout | `border-l-4 border-l-thg-red` |

---

## 5. Formulieren

### Input veld
```jsx
<input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base
  focus:outline-none focus:ring-2 focus:ring-thg-accent focus:border-thg-accent
  placeholder:text-gray-400 min-h-[44px]" />
```

### Label
```jsx
<label className="block text-sm font-medium text-gray-700 mb-1">
  Veldnaam
</label>
```

### Select
```jsx
<select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base
  focus:outline-none focus:ring-2 focus:ring-thg-accent focus:border-thg-accent
  min-h-[44px] bg-white">
```

### Formulier regels
- Labels altijd boven het veld
- Focus ring: `ring-thg-accent`
- Placeholder tekst: grijs en beschrijvend
- Foutmelding: `text-thg-red text-sm mt-1`
- Minimale hoogte 44px voor touch devices

---

## 6. Header / Navigatie

```jsx
<header className="bg-thg-blue text-white shadow-md">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Logo links */}
      <img src="/thg-logo.svg" alt="THG" className="h-8" />
      <h1 className="text-lg font-bold">THG Onderhoud</h1>
    </div>
    <nav className="flex items-center gap-4">
      {/* Navigatie items */}
    </nav>
  </div>
</header>
```

---

## 7. Status badges

```jsx
// Status indicator
const statusClasses = {
  open:       'bg-thg-orange text-white',
  actief:     'bg-thg-accent text-white',
  afgerond:   'bg-thg-green text-white',
  kritiek:    'bg-thg-red text-white',
  gepland:    'bg-blue-100 text-thg-blue',
  inactief:   'bg-gray-100 text-thg-gray',
};

<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>
  {statusLabel}
</span>
```

---

## 8. Tabellen

```jsx
<table className="w-full border-collapse">
  <thead>
    <tr className="bg-gray-100 text-left">
      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">
        Kolom
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-base">Data</td>
    </tr>
  </tbody>
</table>
```

---

## 9. Spacing & Layout

| Context | Spacing |
|---------|---------|
| Pagina padding | `p-4 md:p-6` |
| Tussen secties | `space-y-6` |
| Binnen card | `p-4 md:p-6` |
| Tussen form fields | `space-y-4` |
| Grid gap | `gap-4 md:gap-6` |
| Max breedte content | `max-w-7xl mx-auto` |

### Responsive breakpoints
- Zebra scanner: 320px (default / mobile-first)
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)

---

## 10. Iconen

Gebruik **Lucide React** iconen (reeds in project).

```jsx
import { Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

// In buttons
<button className="... flex items-center gap-2">
  <Wrench className="w-5 h-5" />
  <span>Onderhoud</span>
</button>
```

Icon groottes:
- In knoppen: `w-5 h-5`
- Standalone: `w-6 h-6`
- Groot (dashboard): `w-8 h-8`

---

## 11. Modals / Dialogen

```jsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
    <h2 className="text-xl font-semibold mb-4">Titel</h2>
    {/* Content */}
    <div className="flex gap-3 mt-6 justify-end">
      <button className="btn-secondary">Annuleren</button>
      <button className="btn-primary">Bevestigen</button>
    </div>
  </div>
</div>
```

---

## 12. Loading states

```jsx
// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-2 border-thg-blue border-t-transparent" />

// Skeleton
<div className="animate-pulse bg-gray-200 rounded-lg h-4 w-3/4" />
```

---

## 13. Toast / Notificaties

| Type | Kleur |
|------|-------|
| Succes | `bg-thg-green text-white` |
| Fout | `bg-thg-red text-white` |
| Waarschuwing | `bg-thg-orange text-white` |
| Info | `bg-thg-accent text-white` |

---

## Samenvatting kernregels

1. **Altijd** THG palet kleuren gebruiken — nooit willekeurige hex-codes
2. **Altijd** minimaal 44px tap targets
3. **Nooit** font kleiner dan 12px
4. **Altijd** Calibri als primair font
5. **Altijd** Nederlands in UI-teksten
6. **Altijd** responsive vanaf 320px (Zebra scanners)
7. **Altijd** focus states met `ring-thg-accent`
8. **Altijd** `rounded-lg` of `rounded-xl` — geen scherpe hoeken
9. **Nooit** hover-only interacties — alles moet touch-friendly zijn
10. **Altijd** hoog contrast — minimaal WCAG AA
