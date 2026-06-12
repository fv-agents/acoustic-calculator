# Status — Acoustic Calculator
_Bijgewerkt: 2026-06-12_

## Huidige staat
**v6.1 live** — result page upgrade + Lumenear logo.
- `app/result-components.jsx` — DecayCurve, AbsorptionDonut, MetricCards, ComparisonChart, RT60MeterV2, PrintHeader/Footer/PageBreak
- `app/result-styles.css` — stijlen voor nieuwe componenten + volledig @media print (CSS custom property inversion, A4, 2-pagina PDF)
- `app/calculator-app.jsx` — Step 3 gebruikt nieuwe visualisaties; RT60MeterV2 in Steps 1+2; Lumenear logo in header
- `app/img/lumenear-logo.png` — echte brand PNG, wit via `filter:invert(1)`
- CI groen: 89/89 in sync, 11/11 unit tests pass
- Audit v6.0 uitgevoerd: Inter font-fix, bar chart range fix, .gitignore, cache headers, docs bijgewerkt

## Blocker
Geen.

## Volgende stap (vereisen actie van Falco — niet vanaf deze machine te doen)
1. **Domein**: log in op het Netlify-account waar de site draait (niet falcovile@gmail.com) → Site settings → Domain management → add `calculator.lumenear.com` → CNAME bij DNS-provider.
2. **Embed op lumenear.com**: WordPress-pagina met iframe-snippet uit docs/DEPLOYMENT.md (CSP staat goed).
3. **Visueel testen**: Step 3 in browser checken — decay curve, donut, RT60MeterV2.

## Roadmap
v7.0: SVG/DXF export voor projectdocumentatie.
