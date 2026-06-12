# Lumenear Acoustic Calculator

Interactief dashboard voor akoestisch advies: berekent de nagalmtijd (RT60, Sabine) van een ruimte en het effect van [Lumenear](https://lumenear.com) armaturen, inclusief printbaar adviesrapport (PDF).

**[→ Open de calculator](https://lumenear-acoustic-calculator.netlify.app/)**

## Functies

- Live RT60-berekening (zonder / met Lumenear) met 3D-ruimtevisualisatie
- 89 producten uit de Lumenear 2026 catalogus, gemeten conform EN-ISO 354 (Peutz)
- 12 ruimtepresets (incl. kantine, callcenter, kinderopvang) met indicatieve richtwaarden
- Bezetting telt mee (±0,46 m² Sabine per persoon), STI-schatting, absorptieverdeling
- **Rapport (PDF)** — printbaar adviesrapport voor architecten en opdrachtgevers
- Projecten opslaan/openen (.json) + automatische opslag in de browser
- Werkt volledig offline (geen CDN's; React, htm en Inter zijn gevendored)

## Structuur

| Map | Wat |
|---|---|
| `app/` | De web-app (Netlify publish dir) — één index.html + vendor/ + fonts/ |
| `data/` | Productdata-CSV (bron van waarheid, incl. octaafband-α's en Peutz-data) |
| `tools/check_sync.py` | CI-check web ↔ CSV + `--emit` om de productarray te regenereren |
| `docs/` | Documentatie, rekenvoorbeeld, deployment, roadmap |
| `backup/` | Oude versies (v1 web, originele export, Excel-buildscript) |

## Methode

- Sabine: `RT60 = 0.161 × V / A`, spraakgemiddelde 500/1000/2000 Hz
- Pendant-producten +12% randdiffractie; Aeq per armatuur uit ISO 354-labdata
- Bronnen: Peutz rapport A 3432-1-RA (EN-ISO 354:2003), Acoustic.ua, Sengpiel Audio

---

⚠ Indicatieve berekening. Raadpleeg een akoestisch adviseur voor definitief advies.

© Lumenear / In-Zee BV
