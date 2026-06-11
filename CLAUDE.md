# Acoustic Calculator
_Bijgewerkt: 2026-06-11_

## Doel
RT60 nagalmtijd-calculator (Sabine) die het akoestische effect van Lumenear producten toont — web-versie (Netlify) + Excel-versie.

## Commando's
- Web lokaal: open `lumenear-calculator/index.html` in browser
- Excel bouwen: `cd lumenear-calculator/excel` → `pip install openpyxl pandas` → `python build_lumenear_calculator_v4.py`
- Deploy: push naar `main` = live op Netlify (auto-deploy)

## Structuur
| Bestand/map | Wat |
|---|---|
| `lumenear-calculator/` | De calculator zelf — lees EERST `PROMPT.md` daar voordat je iets aanpast |
| `lumenear-calculator/index.html` | Web-versie, één bestand met embedded CSS/JS |
| `lumenear-calculator/excel/` | Excel build script + productdata CSV (89 producten) |
| `netlify.toml` | Netlify config — publish dir = `lumenear-calculator` |
| `status.md` | Huidige staat, blocker, volgende stap |
| `session-log.md` | Wat gedaan per sessie |
| `decisions.md` | Gemaakte keuzes met redenering |
| `.claude/` | Claude Code config — settings, rules |

## Stack
HTML/CSS/JS (single-file, geen build), Python (openpyxl/pandas) voor Excel-versie, Netlify hosting.

## Werkafspraken
- Lees bij sessiestart: `status.md` + `session-log.md`
- Lees `lumenear-calculator/PROMPT.md` vóór elke aanpassing aan de calculator — bevat harde dataregels (α-waarden, diffractie, defaults)
- Web en Excel moeten dezelfde waarden gebruiken — sync handmatig
- Update bij sessie-einde status.md + session-log.md (of gebruik `/save`)
- Datums altijd YYYY-MM-DD
- Geen keys/secrets in bestanden of git
- Geen Co-Authored-By in commits (Netlify-repo)
