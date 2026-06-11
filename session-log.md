# Session Log — Acoustic Calculator

---

## 2026-06-11 (avond) — v5.0: dashboard wordt hoofdapp + volledige verbouwing
**Gedaan:** Audit v1 + v2-export met 8 (deels parallelle) agents. v2 React-dashboard tot hoofdapp verbouwd (app/index.html): Babel/CDN's vervangen door gevendorde React+htm, Inter lokaal (GDPR/offline), PDF-adviesrapport (2 pag. A4, print-stylesheet), autosave (localStorage), productzoekveld, import-validatie met meldingen, layoutfix (flex), a11y, NL-komma's, RT60 ongeclampt. Repo herstructureerd (app/excel/tools/docs/backup), tools/check_sync.py + GitHub Actions CI, netlify.toml: publish=app + CSP frame-ancestors (embed lumenear.com), XFO weg. Excel-script: Windows-fix (emoji's), hard-fail calc_area, EX-waarden + WALLS "Weet ik niet" gesynct, --web modus, 6s-cap weg. QA-browsertest 12/12 PASS; eind-audit schoon.
**Besloten:** zie decisions.md (berekende Aeq leidend, v2-data leidend, vendored stack).
**Openstaand:** custom domein + daadwerkelijke embed op lumenear.com.

## 2026-06-11 — Project ingericht + GitHub
**Gedaan:** Claude Code structuur aangemaakt (CLAUDE.md, .claude/, status.md, session-log.md, decisions.md). Git repo geïnitialiseerd, gepusht naar fv-agents/acoustic-calculator. Netlify gekoppeld (lumenear-acoustic-calculator.netlify.app); eerste deploy-fout gefixt (no-op build command).
**Besloten:** Repo-root = projectmap; geen Co-Authored-By in commits.
**Openstaand:** —
