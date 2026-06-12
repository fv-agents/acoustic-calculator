# Lumenear Acoustic Calculator

3-staps akoestisch advies-dashboard: berekent de nagalmtijd (RT60, Sabine) van een ruimte en het effect van [Lumenear](https://lumenear.com) armaturen, inclusief printbaar A4-adviesrapport (PDF).

**[→ Open de calculator](https://lumenear-acoustic-calculator.netlify.app/)**

## Functies

- **Stap 1** — ruimtetype, afmetingen, materialen, bezetting + live isometrisch ruimteoverzicht
- **Stap 2** — 89 Lumenear-armaturen uit de 2026-catalogus (EN-ISO 354 / Peutz), live RT60-meter in footer
- **Stap 3** — RT60 voor/na, staafdiagram, aanbeveling, downloadbaar adviesrapport (PDF via `window.print()`)
- 12 ruimtepresets (open kantoor, vergadering, restaurant, kantine, callcenter, kinderopvang, …) met DIN 18041-richtwaarden
- Bezetting telt mee (±0,46 m² Sabine per persoon)
- Automatische opslag in de browser (localStorage)
- Werkt volledig offline (geen CDN's; React, Babel en fonts zijn gevendored)

## Structuur

| Map | Wat |
|---|---|
| `app/` | De web-app (Netlify publish dir) — index.html + data.js + ui-components.jsx + calculator-app.jsx + vendor/ + fonts/ + img/ |
| `data/` | Productdata-CSV (bron van waarheid, incl. octaafband-α's en Peutz-data) |
| `tools/check_sync.py` | CI-check: data.js ↔ CSV met name-normalisatie |
| `docs/` | Documentatie, rekenvoorbeeld, deployment, roadmap, DESIGN-SPEC |
| `backup/` | Oude versies (v1 web, originele export, Excel-buildscript) |

## Methode

- Sabine: `RT60 = 0.161 × V / A`, spraakgemiddelde 500/1000/2000 Hz
- Pendant-producten +12% randdiffractie; Aeq per armatuur uit ISO 354-labdata
- Bronnen: Peutz rapport A 3432-1-RA (EN-ISO 354:2003), Acoustic.ua, Sengpiel Audio

---

⚠ Indicatieve berekening. Raadpleeg een akoestisch adviseur voor definitief advies.

© Lumenear / In-Zee BV
