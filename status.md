# Status — Acoustic Calculator
_Bijgewerkt: 2026-06-11_

## Huidige staat
v5.0 live: v2-dashboard is de hoofdapp (app/index.html) — self-contained (React+htm gevendored, Inter lokaal, geen CDN), met PDF-adviesrapport, autosave, zoekveld, import-validatie en tooltips. QA 12/12 PASS (incl. print/PDF, file://-offline, 3 viewports). CI bewaakt datasync web↔CSV. Repo herstructureerd: app/ · excel/ · tools/ · docs/ · backup/.

## Blocker
Geen.

## Volgende stap
1. Eigen domein calculator.lumenear.com (CNAME, via Netlify UI van het site-account)
2. Embed op lumenear.com (iframe-snippet staat in docs/DEPLOYMENT.md; CSP staat al goed)
3. Roadmap: productafbeeldingen → presentatiemodus → auto-suggest (docs/VERBETERPUNTEN.md)

## Aandachtspunt
Netlify-site draait onder een ander account dan de lokale CLI-login (falcovile@gmail.com) — beheer via Netlify UI van dat account.
