# Session Log — Acoustic Calculator

---

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
