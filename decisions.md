# Decisions — Acoustic Calculator

Gemaakte keuzes met redenering. Alleen echte keuzes — geen obvious dingen.

---

## 2026-06-11 — Repo-root = projectmap, niet de submap
**Reden:** Falco wil de hele projectmap op GitHub. PROMPT.md ging uit van lumenear-calculator als repo-root (publish = "."), maar dan zouden status/session-log/CLAUDE.md buiten git vallen.
**Gevolg:** netlify.toml staat op repo-root met `publish = "lumenear-calculator"`. De app-bestanden blijven in de submap.

## 2026-06-11 — Geen Co-Authored-By in commits
**Reden:** Zelfde regel als nesting-calculator — Co-Authored-By trailer brak daar de Netlify deploy.
**Gevolg:** Commits in deze repo altijd zonder trailer.

## 2026-06-11 — Repo private
**Reden:** Bevat interne werkbestanden (status, decisions, productdata-CSV). Netlify deployt prima vanaf private repos.
**Gevolg:** Publiek maken kan later als gewenst (zoals baffle-calculator).
