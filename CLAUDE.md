# Acoustic Calculator
_Bijgewerkt: 2026-06-12_

## Doel
Lumenear akoestisch advies-dashboard: RT60-berekening (Sabine) + effect van Lumenear armaturen, met printbaar PDF-adviesrapport.

**Live:** https://lumenear-acoustic-calculator.netlify.app/ · **GitHub:** fv-agents/acoustic-calculator (private, auto-deploy op push naar main)

## Commando's
- App lokaal: open `app/index.html` (werkt offline, geen build)
- PP-array regenereren na CSV-wijziging: `python tools/check_sync.py --emit` → plak in app/index.html
- Datasync controleren: `python tools/check_sync.py` (draait ook in CI)

## Structuur
| Bestand/map | Wat |
|---|---|
| `app/index.html` | De web-app — React 18 + htm (gevendored, géén Babel/CDN), single-file logica |
| `app/vendor/`, `app/fonts/` | Gevendorde libraries + Inter-font (offline) |
| `data/lumenear_2026_acoustic_data.csv` | **Bron van waarheid** productdata (89 producten, octaafbanden, Peutz) |
| `tools/check_sync.py` | Verifieert app ↔ CSV (CI faalt bij drift) + `--emit` voor regeneratie |
| `netlify.toml` | Publish dir `app`, CSP frame-ancestors (embed alleen lumenear.com) |
| `docs/` | Documentatie, deployment, rekenvoorbeeld, roadmap |
| `backup/` | Oude versies (v1 web, v2-export, Excel-buildscript) — niet bewerken |
| `status.md` / `session-log.md` / `decisions.md` | Projectmemory |

## Harde dataregels (altijd respecteren)
1. Glas absorbeert bijna niets bij spraak (α ≈ 0.03) — nooit hoger.
2. Gipsplaat 125 Hz = 0.29 is correct (membraanresonantie) — niet verlagen.
3. Diffractie 1.12 **alleen** pendant; wall/floor/baffle = 1.00.
4. Float acoustic = Peutz V5 (α 500/1000/2000 = 0.99/0.99/0.97); Float light = αw 0.55.
5. "Weet ik niet" defaults op worst-case (laagste realistische absorptie).
6. **Berekende Aeq is leidend** — CSV-kolom Equivalent_Absorption_Aeq_m2 bewust genegeerd (besluit 2026-06-11).
7. Productdata door CI bewaakt; materiaaldata staat alléén in app/index.html (bronnen + aannames gedocumenteerd in docs/DOCUMENTATIE.md §4).
8. De norm heet **DIN 18041** (Duits) — nooit "NEN 18041". Richtwaarden blijven "indicatief".
9. Personen = 0,46 m² Sabine p.p.; 0 personen = onbezet/worst-case.

## Werkafspraken
- Lees bij sessiestart: `status.md` + `session-log.md`
- Na CSV- of datawijziging: altijd `tools/check_sync.py` draaien vóór commit
- Update bij sessie-einde status.md + session-log.md (of `/save`)
- Datums altijd YYYY-MM-DD · geen keys/secrets in git
- **Geen Co-Authored-By in commits** (Netlify-repo)
