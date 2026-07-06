# Status — Acoustic Calculator
_Bijgewerkt: 2026-07-06_

## Huidige staat
**Production-ready** — 4-staps wizard + verkoop-/specfeatures, klaar voor `calculator.lumenear.com`.

### Nieuw sinds 06-07
- **Herziene Merford-cijfers verwerkt** (41 rijen: Toad/Halo/Nova/Cone/Float bijgewerkt, Blaze + Line voor het eerst met eigen cijfers) + materiaal-oppervlak nu expliciet i.p.v. berekend voor die rijen.
- **Flora toegevoegd** als nieuwe productlijn (4 varianten), maar **verborgen** (`hidden:true`) tot lancering — data staat klaar, komt niet in de fixture-catalogus of familiefilter totdat Falco 'm activeert.
- **19 geëxtrapoleerde producten teruggedraaid** (Breeze/Orbit/Wing/Cloud/Sliced/Blooom/Drop/Cage/Podge/Spott/Pyknic) naar de oorspronkelijke materiaalformule — de familie-ratio-aanname uit 01-07 bleek niet stabiel genoeg. Toad Oval 1750 uitgezonderd (heeft nu een eigen echte meetwaarde).
- CI groen: 93/93 sync, 11/11 unit tests. Gecommit en gepusht.

### Sinds 01-07
- Echte Merford ISO 354 labmetingen verwerkt (7 armaturen, 12-05-2026). `tools/check_sync.py`: `Equivalent_Absorption_Aeq_m2`-kolom in de CSV is een override boven de materiaalformule wanneer gevuld (voorkomt dubbele diffractiecorrectie op al-gemeten waarden).
- Bronbestanden meting: `Akoestische testen/2026-05-12 Merford ISO354 meetrapport.pdf` + verwerkt xlsx-overzicht (v1 — zie 06-07 voor de herziene tabel, geen apart brondocument ontvangen).

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
- Lumen ontbreekt voor E27-decolampen (Drop/Cage/Podge/Spott/Pyknic/Blooom), Float oval/rect en de nieuwe Flora-lijn (stonden niet op de site).
- `submitQuote` evt. later naar Supabase/endpoint i.p.v. Netlify Forms (seam = 1 functie).
- Blaze had t/m 01-07 nog Toad's placeholder-cijfers; sinds 06-07 eigen cijfers (zie decisions.md 2026-07-06).
- ~~Float-oppervlak in data.js (~2×) vs Merford-rapport~~ — opgelost op 06-07 (oppervlak nu expliciet gezet i.p.v. berekend).
- Cone-waarden zijn de minst zekere van de Merford-set (combimeting + geometrische split naar losse maten, niet los gemeten) — Falco's tabel markeert dit zelf met een *.
- Flora: `hidden:true` — verborgen tot lancering. Marketingtekst en ovale afmetingen (W×L) nog placeholder ("TBD"). Activeren = `hidden` verwijderen in `app/data.js` (4 rijen) zodra productinfo compleet is.
- ~~De 20 op 01-07 extrapoleerde producten~~ — 19 op 06-07 teruggedraaid naar de oorspronkelijke materiaalformule (familieratio bleek niet stabiel). Toad Oval 1750 heeft wél een eigen echte meetwaarde.

## Roadmap
v7.0: SVG/DXF export voor projectdocumentatie.
