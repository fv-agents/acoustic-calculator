# Status — Acoustic Calculator
_Bijgewerkt: 2026-06-12_

## Huidige staat
v5.2 live: alle aanname-waardes onderzocht en definitief (brontabel in docs/DOCUMENTATIE.md §4 — lamellenwand gesplitst 0,30/0,62, spuitpleister 0,70 bevestigd, personen 0,46 dubbel bevestigd) + auto-suggest in rechterpaneel en rapport ("nog ~X m² Aeq ≈ N× product"). CI bewaakt datasync.

## Blocker
Geen.

## Volgende stap (vereisen actie van Falco — niet vanaf deze machine te doen)
1. **Domein**: log in op het Netlify-account waar de site draait (niet falcovile@gmail.com — CLI ziet de site niet) → Site settings → Domain management → add `calculator.lumenear.com` → CNAME `calculator` → `lumenear-acoustic-calculator.netlify.app` bij de DNS-provider. HTTPS gaat automatisch.
2. **Embed op lumenear.com**: WordPress-pagina met het iframe-snippet uit docs/DEPLOYMENT.md (CSP staat al goed).
3. **Productafbeeldingen**: 24 familie-thumbnails aanleveren in `app/img/<familie>.jpg` (lumenear.com hotlinken kan niet — lazy-loaded + breekt offline) → daarna bouwt Claude ze in.

## Roadmap daarna
Presentatiemodus → meerdere ruimten per project (docs/VERBETERPUNTEN.md).
