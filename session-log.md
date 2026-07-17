# Session Log — Acoustic Calculator

---

## 2026-07-17 (3) — Calculator-auth verhuisd naar geïsoleerd Supabase-project
**Gedaan:** Nieuw, apart Supabase-project `lumenear-calculator-auth` aangemaakt (bevat geen AIF-data), `calculator_access_log`-tabel + policy daar opnieuw gezet, 4 accounts overgezet (2 via signup-API, 2 rechtstreeks via SQL na een e-mail-rate-limit), `app/auth.js` omgezet naar het nieuwe project. Keep-alive GitHub Actions workflow toegevoegd (dagelijkse ping) tegen het gratis-tier pauzeer-risico na inactiviteit. Oude `calculator_access_log`-tabel op het AIF-project verwijderd. Volledige login-flow opnieuw getest tegen het nieuwe project — werkt.
**Besloten:** zie decisions.md 2026-07-17 (3).
**Openstaand:** Falco moet Site URL/Redirect URLs instellen op het NIEUWE project (niet meer "Agent"). De 4 te-open AIF-tabellen (events/error_logs/system_log/telegram_state) staan nog steeds open voor iedereen met de AIF-anon-key — los van de calculator, nog niet gefixt, SQL staat klaar in decisions.md 2026-07-17 (1)/(3).

## 2026-07-17 (2) — Eigen inlogscherm (Supabase Auth) i.p.v. Basic Auth
**Gedaan:** Basic Auth Edge Function vervangen door een gestileerd inlogscherm op Supabase Auth: login, wachtwoord vergeten, toegang aanvragen (nieuw Netlify Forms-formulier `access-request`), onthoud-mij, en een nieuw-wachtwoord-scherm voor de reset-link. Nieuwe bestanden: `app/auth.js` (REST-client, geen SDK), `app/auth-components.jsx`, `app/auth-styles.css`. `calculator-app.jsx` wrapt nu in `<AuthGate>` + logout-knop in header. Oude Edge Function + AUTH_USERS-logica verwijderd. Volledige flow getest met een tijdelijk Supabase-testaccount (aangemaakt/opgeruimd zonder service_role key aan te raken): login/foutmelding/onthoud-mij/logout allemaal bevestigd werkend.
**Besloten:** zie decisions.md 2026-07-17 (2).
**Openstaand:** Falco moet in Supabase de 4 echte accounts aanmaken + Site URL/Redirect URLs instellen (nodig voor reset-link) + idealiter eigen SMTP (Supabase's standaard mailservice bleek zwaar rate-limited, 429 al na een paar verzoeken). Netlify env var AUTH_USERS is nu ongebruikt, mag blijven staan.

## 2026-07-17 — Tijdelijke login (Basic Auth) + Supabase monitoring
**Gedaan:** Netlify Edge Function gebouwd die de hele site achter HTTP Basic Auth zet (`netlify/edge-functions/basic-auth.ts`), credentials via env var `AUTH_USERS`. Nieuwe Supabase-tabel `calculator_access_log` (zelfde project als AIF) logt elke geslaagde login (insert-only anon-key policy, geen service_role gebruikt). Lokaal getest met `netlify dev`: alle drie scenario's (geen auth/fout wachtwoord/goede login) correct, log-rij bevestigd in Supabase, testrij verwijderd.
**Besloten:** zie decisions.md 2026-07-17.
**Openstaand:** Falco moet zelf 3 env vars zetten in het Netlify-dashboard van de calculator-site (staat op ander account dan de CLI-login) — `AUTH_USERS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` — en opnieuw deployen. Eerste 4 accounts (falco/rik/jelle/frank @in-zee.nl) klaargezet, wachtwoord door Falco gekozen.

## 2026-07-06 (2) — Flora verborgen; extrapolaties teruggedraaid
**Gedaan:** Flora kreeg `hidden:true` (data blijft, UI-catalogus/familielijst sluit 'm uit) tot Falco de lamp lanceert. De 19 op 01-07 geëxtrapoleerde producten (Breeze/Orbit/Wing/Cloud/Sliced/Blooom/Drop/Cage/Podge/Spott/Pyknic) teruggedraaid naar de oorspronkelijke materiaalformule — de Aeq-override verwijderd omdat de onderliggende familie-ratio-aanname na de tabelherziening niet stabiel bleek. Toad Oval 1750 ongemoeid (heeft nu een eigen echte meetwaarde). CI groen (93/93, 11/11).
**Besloten:** zie decisions.md 2026-07-06 (2).
**Openstaand:** Flora activeren zodra productinfo compleet is (marketingtekst, ovale afmetingen, `hidden` verwijderen). Gecommit en gepusht.

## 2026-07-06 — Herziene Merford-tabel + Flora toegevoegd
**Gedaan:** Falco leverde een herziene materiaal+Aobj-tabel (geen apart brondocument, direct overgenomen). 41 bestaande rijen bijgewerkt (Toad/Halo/Nova/Cone/Float: nieuwe Aeq + materiaal-oppervlak expliciet gezet i.p.v. berekend; Blaze en Line kregen voor het eerst eigen cijfers). Flora toegevoegd als nieuwe productlijn (4 varianten, Technical/Pendant/single-layer-PET-felt, bevestigd door Falco). CI groen (93/93 sync, 11/11 tests).
**Besloten:** zie decisions.md 2026-07-06.
**Openstaand:** Flora's marketingtekst en ovale afmetingen zijn placeholders (TBD). De 20 op 01-07 geëxtrapoleerde producten (Breeze/Orbit/Wing/Cloud/Sliced/Blooom/Drop/Cage/Podge/Spott/Pyknic) zijn NIET herrekend — de familieratio waar ze op gebaseerd waren blijkt met de herziene cijfers minder stabiel dan gedacht. Nog niet gecommit/gepusht.

## 2026-07-01 — Merford ISO 354 labmetingen verwerkt in productcatalogus
**Gedaan:** Analyse van het Merford-meetrapport (12-05-2026, 7 opstellingen echte armaturen in nagalmkamer, ISO 354) + het verwerkte xlsx-overzicht (23 varianten via lineaire/frequentie-schaling). Zelfcheck tegen `app/data.js` toonde dat de bestaande materiaalformule (oppervlak×αw×diffractie) voor Toad/Halo/Nova/Column/Twist consistent 12–25% te hoog zat; Cone (minst directe afleiding) 16–30% te laag. Na interview met Falco (scope, Float-constructie, Blaze, Cone-onzekerheid, extrapolatie-aanpak): `Equivalent_Absorption_Aeq_m2`-kolom in de CSV geactiveerd als override boven de formule (voorkomt dubbele diffractiecorrectie), 65 van 89 producten bijgewerkt — 43 direct uit de meting/xlsx, 20 via familie-specifieke extrapolatie (eigen familieratio waar getest, anders gemiddelde van de geteste families excl. Cone). `tools/check_sync.py` aangepast, CSV + `app/data.js` geregenereerd, CI groen (89/89 + 11/11).
**Besloten:** zie decisions.md 2026-07-01 (herziet besluit 2026-06-11 over die kolom). Blaze bewust niet meebewegen met Toad. Geen UI-indicatie gemeten-vs-geschat. CSV-methodologiekolom ongewijzigd (blijft overal "ISO 354" zeggen).
**Openstaand:** Float-oppervlak-discrepantie (~2×) niet opgelost, speelt nu geen rol. Cone blijft de minst zekere waarde in de set. Blaze staat nog op de oude (te hoge) Toad-cijfers, apart traject.

## 2026-06-18 — Specs-modal, 8 presets, mobiel-gate, Netlify Forms (production-ready)
**Gedaan:** Productie-upgrade. Herbruikbare a11y UI-kit (`kit-components.jsx` + `kit-styles.css`: Spinner/Skeleton/Button/NumberStepper/Field/Meter/LiveRegion/EmptyState). Rating band-verankerd aan DIN 18041 (`optimal`/`acceptable`) i.p.v. ratio, met te-droog-cap. Offerteflow (`quote-flow.jsx`): formulier → validatie → success, nu echt via **Netlify Forms** (honeypot + verborgen statische form in index.html). Presets terug naar **8 ruimtes** met realistisch-slechte startbasis; "Other" = gemiddeld. **Specs-modal per lamp**: klik kaart of "Specs"-knop → modal met lumen/watt/kleurtemp/dimming/viltkleuren + αw/Aeq + links naar productpagina & product sheet. Data uit `product-specs.js` (gegenereerd uit `Documents/Lumenear Data/Lumenear R.R.P 2026 v2.xlsx` voor cct/dimming/kleuren/links + lumen/watt gescraped van lumenear.com; géén prijzen). Modal = split-layout (specs links, volledig beeld rechts, `contain`). **Mobiel-gate** (<768px) met logo "open op desktop". Method-blok uit rapport, copy gunstiger. SVG-favicon + OG-tags + caching `netlify.toml`. Backup van gewijzigde files in `_restore-2026-06-18/`.
**Besloten:** Getallen heilig, framing via presentatie/defaults/copy (band-rating groen t/m acceptable, worst-case baseline, zichtbare plaatsingsaanname). Producteffect = rated Aeq + pendant-1,12, geen +5%. Geen prijzen in app/repo. Quote-transport = Netlify Forms (seam = 1 functie `submitQuote`). Mobiel geblokt i.p.v. read-only rapport.
**Openstaand:** Falco: DNS `calculator.lumenear.com` (CNAME naar netlify) + Netlify custom domain; Netlify → Forms → notificatie-mail aanzetten. Lumen ontbreekt voor E27-decolampen + Float oval/rect. `submitQuote` evt. later naar Supabase/endpoint.

## 2026-06-15 — v6.2: 4-staps wizard + sticky UX
**Gedaan:** Wizard uitgebreid van 3 naar 4 stappen (Space / Materials / Fixtures / Result). Stap 1 behoudt ruimtetype + afmetingen; stap 2 nieuw met alle materiaal-dropdowns + absorptie-overzicht. Sticky nav-balken: step-nav volledig transparant, step-nav-solid op stap 4. Sidebar fixture-lijst: qty stepper + verwijderknop per product. Sidebar-actions sticky onderaan. Progress bar bijgewerkt naar 4 stappen. Header Download PDF disabled tot step 4.
**Besloten:** 4 stappen communiceren beter dat er meer te doen is; transparante balk met btn-primary geeft floating-knop zonder visuele balk.
**Openstaand:** Falco-acties: domein, embed, visueel testen alle stappen.

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
