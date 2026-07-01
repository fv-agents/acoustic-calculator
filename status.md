# Status — Acoustic Calculator
_Bijgewerkt: 2026-07-01_

## Huidige staat
**Production-ready** — 4-staps wizard + verkoop-/specfeatures, klaar voor `calculator.lumenear.com`.

### Nieuw sinds 01-07
- **Echte Merford ISO 354 labmetingen verwerkt** (7 armaturen, 12-05-2026) — 65 van de 89 producten kregen een gecorrigeerde Aeq (Toad/Halo/Nova/Column/Twist/Float/Cone direct, 20 andere producten via familie-specifieke extrapolatie). Zie decisions.md 2026-07-01 voor volledige methodologie en scope.
- `tools/check_sync.py`: `Equivalent_Absorption_Aeq_m2`-kolom in de CSV is nu een override boven de materiaalformule wanneer gevuld (voorkomt dubbele diffractiecorrectie op al-gemeten waarden).
- CI groen: 89/89 sync, 11/11 unit tests.
- Bronbestanden meting: `Akoestische testen/2026-05-12 Merford ISO354 meetrapport.pdf` + verwerkt xlsx-overzicht.

### Nieuw sinds 12-06
- **Specs-modal per lamp**: klik kaart of "Specs"-knop → lumen/watt/kleurtemp/dimming/viltkleuren + αw/Aeq + links naar productpagina & product sheet (`product-specs.js`, uit RRP-xlsx + web; geen prijzen).
- **Offerteaanvraag** in stap 4, echt via Netlify Forms (honeypot, verborgen form in index.html).
- **8 ruimtepresets** met realistisch-slechte startbasis (Other = gemiddeld); extra's altijd uit.
- **Band-verankerde rating** (DIN 18041 optimal/acceptable), gunstiger maar verdedigbaar.
- **Mobiel-gate** (<768px): gebrand "open op desktop" scherm.
- Herbruikbare a11y UI-kit, schoner rapport, SVG-favicon, OG-tags.

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
1. **Online zetten**: Netlify → Domain management → add `calculator.lumenear.com` → CNAME bij DNS-provider naar de netlify-site. SSL gaat automatisch.
2. **Leads aanzetten**: Netlify → Forms → bij form "quote" notificatie-mail instellen (bijv. falco@lumenear.com), anders staan inzendingen alleen in het dashboard.
3. **Rooktest na live**: mobiel-gate op telefoon + één echte test-lead via het offerteformulier.

## Bekende gaten
- Lumen ontbreekt voor E27-decolampen (Drop/Cage/Podge/Spott/Pyknic/Blooom) en Float oval/rect (stond niet op de site).
- `submitQuote` evt. later naar Supabase/endpoint i.p.v. Netlify Forms (seam = 1 functie).
- Blaze (deelde voorheen Toad's cijfers als placeholder) nog niet apart getest/gecorrigeerd — bewust buiten scope gehouden bij de Merford-verwerking van 01-07.
- Float-oppervlak in data.js (~2×) vs Merford-rapport nog niet verklaard/opgelost (speelt nu geen rol, want de nieuwe Aeq's komen direct uit de meting, niet via het oppervlak herberekend).
- Cone-waarden zijn de minst zekere van de Merford-set (combimeting + geometrische split naar losse maten, niet los gemeten).

## Roadmap
v7.0: SVG/DXF export voor projectdocumentatie.
