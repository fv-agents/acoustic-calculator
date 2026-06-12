# Status — Acoustic Calculator
_Bijgewerkt: 2026-06-12_

## Huidige staat
**v6.0 live** — volledige UI-rebuild: dark theme, 3-staps wizard, Engelse UI, multi-file architectuur.
- `app/data.js` — 89 producten, design naming (Rect/×)
- `app/ui-components.jsx` — AnimatedNumber, IsoRoom, RT60Meter, ProductCard, SimpleBarChart
- `app/calculator-app.jsx` — 3-staps wizard, Sabine-engine, PDF via window.print()
- `app/styles.css` — dark design system, DM Serif Display + DM Mono zelfgehost, print A4
- `app/vendor/babel.min.js` — Babel standalone gevendord (offline, geen CDN)
- CI groen: 89/89 in sync, `tools/check_sync.py` leest `window.PRODUCTS` uit data.js
- `docs/DESIGN-SPEC.md` bewaard voor finetuning

## Blocker
Geen.

## Volgende stap (vereisen actie van Falco — niet vanaf deze machine te doen)
1. **Domein**: log in op het Netlify-account waar de site draait (niet falcovile@gmail.com) → Site settings → Domain management → add `calculator.lumenear.com` → CNAME `calculator` → `lumenear-acoustic-calculator.netlify.app` bij de DNS-provider.
2. **Embed op lumenear.com**: WordPress-pagina met het iframe-snippet uit docs/DEPLOYMENT.md (CSP staat al goed).
3. **Productafbeeldingen testen**: check of alle 24 thumbnails renderen na deploy (app/img/*.jpg zijn meegecommit).

## Roadmap
v6.1: product thumbnail card finetuning · v7.0: SVG/DXF export voor projectdocumentatie.
