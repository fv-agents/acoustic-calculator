# Verbeterpunten & Roadmap — Lumenear Calculator

> Prioriteit: ⭐ = nice to have · ⭐⭐ = waardevol · ⭐⭐⭐ = hoge impact
> Bijgewerkt: 2026-06-11

## ✅ Gerealiseerd (v5.1, 2026-06-12) — materialen- en data-audit

- **Materialenherziening projectenmarkt** — tapijttegels (αw 0,15, dé kantoorvloer), houten lamellenwand/-plafond, akoestisch spuitpleister, PET-vilt wandopties op eigen Peutz-data (0,36 direct / 0,90 met absorber), metselwerk; schijnkeuzes (gips+glas-mengvormen) weg
- **"Dun tapijt"-fout gefixt** — waardes waren "heavy carpet on concrete" (0,37); eerlijk hernoemd, tapijttegels toegevoegd
- **Bezetting** — personen tellen mee (±0,46 m² Sabine p.p.); rapport vermeldt bezet/onbezet
- **Meubilering zegt nu iets** — 5 niveaus op dichtheid × stoffering i.p.v. ruimtetype-labels
- **Extra akoestiek = checkboxes** (additief) i.p.v. genummerde ladder
- **Presets +3** — Bedrijfskantine, Callcenter/klantcontact, Kinderopvang; celkantoor en klaslokaal aangescherpt naar 0,6 s
- **NEN→DIN 18041** — foutieve normnaam overal gecorrigeerd
- **Excel-versie uitgefaseerd** — CSV blijft bron van waarheid (`data/`), PP-regeneratie via `check_sync.py --emit`

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

- **DIN 18041-categoriebeoordeling** — "certificaat-waardige output" is op een single-band Sabine-schatting inhoudelijk niet waar te maken; aansprakelijkheidsrisico. Pas met frequentieband-data (octaafbanden zitten al in de CSV).
- **Frequentieband-analyse 125–4000 Hz** — octaafband-data zit al in de CSV, maar UI + validatie is veel werk; schijnnauwkeurigheid vermijden.
- **Live API-koppeling productdata** — het single-file/offline model is juist de kracht; backend = nieuwe faalmodus. CSV + CI-sync volstaat.
- **CRM/offerte-integratie, GA4-tracking** — prematuur zonder prijzen in de tool.
- **Mobiele redesign** — het PDF-rapport is het deelbare artefact; tablet-weergave (stapeling) bestaat al.
- **Dark mode, animaties, C50/D50, niet-rechthoekige ruimten** — na bovenstaande.
