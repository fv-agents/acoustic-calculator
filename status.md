# Status — Acoustic Calculator
_Bijgewerkt: 2026-06-12_

## Huidige staat
v5.3 live: productafbeeldingen per familie in productkaarten (24 thumbnails in app/img/; fallback: img verbergt bij laadfouten). CI groen.

## Blocker
Geen.

## Volgende stap (vereisen actie van Falco — niet vanaf deze machine te doen)
1. **Domein**: log in op het Netlify-account waar de site draait (niet falcovile@gmail.com — CLI ziet de site niet) → Site settings → Domain management → add `calculator.lumenear.com` → CNAME `calculator` → `lumenear-acoustic-calculator.netlify.app` bij de DNS-provider. HTTPS gaat automatisch.
2. **Embed op lumenear.com**: WordPress-pagina met het iframe-snippet uit docs/DEPLOYMENT.md (CSP staat al goed).

## Roadmap daarna
Presentatiemodus → meerdere ruimten per project (docs/VERBETERPUNTEN.md).
