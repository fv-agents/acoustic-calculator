# Status — Acoustic Calculator
_Bijgewerkt: 2026-06-15_

## Huidige staat
**v6.2 live** — 4-staps wizard + UX-verbeteringen sidebar.

### Wizard (4 stappen)
- **Stap 1 — Space**: ruimtetype, afmetingen, bezetting. Knop `Materials & Furnishing →` (primary, transparante balk).
- **Stap 2 — Materials**: vloer/wanden/plafond/meubilering dropdowns + bestaande behandelingen + absorptie-overzicht.
- **Stap 3 — Fixtures**: catalogus + live sidebar met bewerkbare fixture-lijst (qty stepper + verwijderen).
- **Stap 4 — Result & Report**: visualisaties + sticky download/quote-balk.

### UI-verbeteringen
- Sticky nav-balken: Step 1+2 → `position: sticky; bottom: 0; background: transparent`, Step 4 → solide balk met border.
- Sidebar fixture-lijst: per product qty stepper (−/+/input) + × verwijderknop.
- Step 3 sidebar: "View result / ← Back" sticky onderaan sidebar (`.sidebar-actions`).

### Technisch
- `app/calculator-app.jsx` — 4-step wizard, stap 2 nieuw, stappen 3+4 hernummerd
- `app/styles.css` — `.step-nav` transparant, `.step-nav-solid` voor step 4, `.sidebar-actions` sticky
- CI groen: 89/89 in sync, 11/11 unit tests pass

## Blocker
Geen.

## Volgende stap (vereisen actie van Falco)
1. **Domein**: log in op het Netlify-account waar de site draait (niet falcovile@gmail.com) → Site settings → Domain management → add `calculator.lumenear.com` → CNAME bij DNS-provider.
2. **Embed op lumenear.com**: WordPress-pagina met iframe-snippet uit docs/DEPLOYMENT.md (CSP staat goed).
3. **Visueel testen**: alle 4 stappen in browser checken.

## Roadmap
v7.0: SVG/DXF export voor projectdocumentatie.
