# Status — Acoustic Calculator
_Bijgewerkt: 2026-06-12_

## Huidige staat
v5.1 live: materialenherziening na data-audit (tapijttegels-fix, lamellenwand/-plafond, PET-vilt op Peutz-data, meubilering op dichtheid, extra akoestiek als checkboxes, personen-absorptie, presets +3, NEN→DIN). Excel uitgefaseerd: CSV in data/ blijft bron van waarheid, regeneratie via check_sync --emit. CI bewaakt datasync.

## Blocker
Geen.

## Volgende stap
1. Vier aanname-waardes verifiëren met datasheets: tapijttegels 0,15 · lamellenwand 0,55 · lamellenplafond 0,55 · spuitpleister 0,70
2. Eigen domein calculator.lumenear.com (CNAME, via Netlify UI van het site-account)
3. Embed op lumenear.com (iframe-snippet in docs/DEPLOYMENT.md; CSP staat goed)
4. Roadmap: productafbeeldingen → presentatiemodus → auto-suggest (docs/VERBETERPUNTEN.md)

## Aandachtspunt
Netlify-site draait onder een ander account dan de lokale CLI-login (falcovile@gmail.com) — beheer via Netlify UI van dat account.
