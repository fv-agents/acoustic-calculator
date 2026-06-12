# Session Log — Acoustic Calculator

---

## 2026-06-12 (5) — v6.1: result page upgrade + Lumenear logo
**Gedaan:** result-components.jsx (DecayCurve SVG, AbsorptionDonut SVG, MetricCards 4×KPI, ComparisonChart met norm-zone, RT60MeterV2 geluidsgolf-animatie) + result-styles.css (print: CSS custom property inversion, A4 2-pagina PDF). calculator-app.jsx: Step 3 volledig vervangen, RT60Meter → RT60MeterV2, Lumenear logo PNG (filter:invert) in header, window._upgradeQty sync. Oude @media print uit styles.css verwijderd. CI groen.
**Besloten:** logo via filter:invert(1) op zwarte PNG — werkt op donkere header.
**Openstaand:** visueel testen in browser; Falco-acties: domein, embed.

## 2026-06-12 (4) — audit v6.0: 8 fixes
**Gedaan:** Inter @font-face toegevoegd (inter-var.woff2 was aanwezig maar niet gedeclareerd), SimpleBarChart optimal range label gefixt (nu via RT60_NORMS), CI step name gecorrigeerd, .gitignore aangemaakt, cache headers netlify.toml, README + DOCUMENTATIE.md bijgewerkt naar v6.0, tools/test_calc.py (11 unit tests Sabine-engine). CI 89/89 + 11/11 groen.
**Besloten:** geen E2E browser tests — acceptabel voor dit stadium.
**Openstaand:** —

## 2026-06-12 (3) — v6.0: dark theme redesign, 3-staps wizard, multi-file architectuur
**Gedaan:** Volledige UI-rebuild op basis van Claude Design upgrade (Design upgrade/DESIGN-SPEC.md). Dark theme CSS custom properties. DM Serif Display + DM Mono zelfgehost (WOFF2, geen CDN). Babel standalone gevendord (3MB, offline). Single-file index.html gesplitst in data.js + ui-components.jsx + calculator-app.jsx. 89 producten hernoemd naar design convention (Rect/×). localStorage key lumenear_calc_v2. 3-staps wizard: Step 1 ruimte+materialen, Step 2 armaturen split-panel, Step 3 resultaat+PDF. RT60 sticky footer meter met optimal zone per ruimtetype. AnimatedNumber, IsoRoom, ProductCard (thumbnails). PDF via window.print() met A4-stylesheet, print-header+disclaimer hidden on screen. check_sync.py herschreven: leest window.PRODUCTS uit data.js, name normalization (Rectangle↔Rect, x↔×). CI 89/89 groen. docs/DESIGN-SPEC.md bewaard.
**Besloten:** Engels UI, design naming (Rect/×, localStorage break), window.print() voor PDF.
**Openstaand:** Falco: domein, embed, thumbnails visueel verifiëren na deploy.

## 2026-06-12 (2) — v5.2: bronnenonderzoek aannames + auto-suggest
**Gedaan:** Alle vier aanname-α's onderzocht (ISO 354-rapporten lattenpanelen, ICC/Oscar spuitpleisterdata, Tarkett/DESSO tapijttegels, Aural Exchange personen): lamellenwand gesplitst 0,30 direct / 0,62 op regels+isolatie, lamellenplafond 0,60, rest bevestigd. Brontabel in DOCUMENTATIE §4. Auto-suggest gebouwd: adviesblok rechterpaneel + rapportzin "nog ~X m² Aeq ≈ N× product". Productafbeeldingen onderzocht → hotlinken afgewezen (lazy-load + offline), wacht op 24 thumbnails. Domein/embed: exacte stappen in status.md (vereist het andere Netlify-account).
**Besloten:** zie decisions.md 2026-06-12 (v5.2-entries).
**Openstaand:** Falco-acties: domein, embed, thumbnails.

## 2026-06-12 — v5.1: materialen-audit doorgevoerd + Excel uitgefaseerd
**Gedaan:** Data-audit geverifieerd tegen Sengpiel/Harris-tabellen + fabrikantdata. Fixes: "dun tapijt" (was heavy-carpet-waarden), tapijttegels 0,15 toegevoegd, lamellenwand/-plafond + spuitpleister + PET-vilt wandopties (Peutz 0,36/0,90), meubilering herschreven (5 dichtheidsniveaus), extra akoestiek → checkboxes, personen-absorptie (0,46 m²/p.p.), presets +kantine/callcenter/kinderopvang, normen celkantoor/klaslokaal → 0,6, NEN→DIN 18041 overal. Excel-buildscript → backup, excel/ → data/, check_sync kreeg --emit. Legacy-mapping voor oude projecten/autosave. Docs + rekenvoorbeeld herschreven.
**Besloten:** zie decisions.md 2026-06-12 (2 entries).
**Openstaand:** 4 aanname-waardes verifiëren met datasheets.

## 2026-06-11 (avond) — v5.0: dashboard wordt hoofdapp + volledige verbouwing
**Gedaan:** Audit v1 + v2-export met 8 (deels parallelle) agents. v2 React-dashboard tot hoofdapp verbouwd (app/index.html): Babel/CDN's vervangen door gevendorde React+htm, Inter lokaal (GDPR/offline), PDF-adviesrapport (2 pag. A4, print-stylesheet), autosave (localStorage), productzoekveld, import-validatie met meldingen, layoutfix (flex), a11y, NL-komma's, RT60 ongeclampt. Repo herstructureerd (app/excel/tools/docs/backup), tools/check_sync.py + GitHub Actions CI, netlify.toml: publish=app + CSP frame-ancestors (embed lumenear.com), XFO weg. Excel-script: Windows-fix (emoji's), hard-fail calc_area, EX-waarden + WALLS "Weet ik niet" gesynct, --web modus, 6s-cap weg. QA-browsertest 12/12 PASS; eind-audit schoon.
**Besloten:** zie decisions.md (berekende Aeq leidend, v2-data leidend, vendored stack).
**Openstaand:** custom domein + daadwerkelijke embed op lumenear.com.

## 2026-06-11 — Project ingericht + GitHub
**Gedaan:** Claude Code structuur aangemaakt (CLAUDE.md, .claude/, status.md, session-log.md, decisions.md). Git repo geïnitialiseerd, gepusht naar fv-agents/acoustic-calculator. Netlify gekoppeld (lumenear-acoustic-calculator.netlify.app); eerste deploy-fout gefixt (no-op build command).
**Besloten:** Repo-root = projectmap; geen Co-Authored-By in commits.
**Openstaand:** —
