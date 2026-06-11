# Verbeterpunten & Roadmap — Lumenear Calculator

> Prioriteit: ⭐ = nice to have · ⭐⭐ = waardevol · ⭐⭐⭐ = hoge impact
> Bijgewerkt: 2026-06-11

## ✅ Gerealiseerd (v5.0, 2026-06-11)

- **PDF-rapport** — 2 pagina's A4 adviesrapport via print-stylesheet: conclusie, grafieken, uitgangssituatie, productadvies, STI, methodiek + disclaimer, Lumenear-branding
- **Offline werken** — React/htm/Inter gevendored, geen CDN's; `app/` map werkt zonder internet
- **Iframe-embedding** — CSP frame-ancestors voor lumenear.com (X-Frame-Options DENY weg)
- **Autosave** (localStorage) + reset-knop — F5 tijdens demo wist niets meer
- **Productzoekveld** + tooltips bij αw/Aeq/STI/V/A — toegankelijker voor niet-akoestici
- **Import-validatie** — onbekende producten/materialen worden gemeld i.p.v. stil genegeerd
- **Layoutfix** — panelen passen op elk scherm (ook 1366×768), tablet-weergave stapelt
- **NL-notatie** — decimale komma overal, rating-pill met context ("Met Lumenear: Prima")
- **CI-bewaking datasync** — web-productdata wordt automatisch tegen de CSV gecontroleerd

## Open — aanbevolen volgorde

### ⭐⭐⭐ Productafbeeldingen tonen
Miniatuur per productkaart (URL-mapping naar lumenear.com). Visueel sterkste volgende stap.

### ⭐⭐ Meerdere ruimten per project
Project > ruimten > producten met gecombineerde bestellijst. Vereist forse state-herstructurering — als aparte sprint doen.

### ⭐⭐ Klant-facing presentatiemodus
Vereenvoudigde weergave: 3D kamer groot, RT60 voor/na, rating, productenlijst.

### ⭐⭐ Aanbevolen producten (auto-suggest)
"Om deze ruimte op 0,6 s te brengen: minimaal 4× Float acoustic Rectangle 1200×2400."

### ⭐ Meertaligheid (EN minimaal), QR-delen, vergelijkingsmodus, productkaart-uitklap

## Bewust uitgesteld (besluit 2026-06-11)

- **NEN 18041-categoriebeoordeling** — "certificaat-waardige output" is op een single-band Sabine-schatting inhoudelijk niet waar te maken; aansprakelijkheidsrisico. Pas met frequentieband-data.
- **Frequentieband-analyse 125–4000 Hz** — octaafband-data zit al in de CSV, maar UI + validatie is veel werk; schijnnauwkeurigheid vermijden.
- **Live API-koppeling productdata** — het single-file/offline model is juist de kracht; backend = nieuwe faalmodus. CSV + CI-sync volstaat.
- **CRM/offerte-integratie, GA4-tracking** — prematuur zonder prijzen in de tool.
- **Mobiele redesign** — het PDF-rapport is het deelbare artefact; tablet-weergave (stapeling) bestaat al.
- **Dark mode, animaties, C50/D50, niet-rechthoekige ruimten** — na bovenstaande.
