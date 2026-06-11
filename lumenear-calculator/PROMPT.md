# PROMPT — Lumenear Akoestische Calculator

Lees dit bestand EERST voordat je iets aanpast.

## Wat is dit?

Een akoestische nagalmtijd-calculator (RT60) voor Lumenear, een internationaal merk voor akoestische verlichting. De calculator toont het effect van Lumenear producten op de nagalmtijd van een ruimte.

De calculator bestaat uit twee versies:
1. **Web** (`index.html`) — Eén HTML-bestand met embedded CSS/JS. Draait op Netlify via GitHub auto-deploy.
2. **Excel** (`excel/build_lumenear_calculator_v4.py`) — Python script dat een compleet .xlsx bouwt met 4 sheets.

## Bestanden

```
lumenear-calculator/
├── index.html                              ← Web calculator (Netlify)
├── netlify.toml                            ← Netlify config
├── README.md                               ← Publieke README
├── PROMPT.md                               ← DIT BESTAND (voor Claude Code)
├── lumenear_acoustic_calculator_v4_documentatie.md  ← Volledige technische docs
└── excel/
    ├── build_lumenear_calculator_v4.py      ← Excel build script
    └── lumenear_2026_acoustic_data.csv      ← Productdata (89 producten)
```

## Kernformule

```
RT60 = 0.161 × Volume / Totale_absorptie
```

- RT60 = nagalmtijd in seconden
- Volume = L × B × H in m³
- Totale_absorptie = som van alle absorptie in m² Sabine (equivalente absorptie)
- Spraakgemiddelde = (α_500Hz + α_1000Hz + α_2000Hz) / 3

## Data-architectuur

### Materialen → absorptie in m²

- **Vloer/Wanden/Plafond**: spraak-α × oppervlak (m²) = absorptie (m²)
- **Inrichting/Overige**: factor × vloeroppervlak (m²) = absorptie (m²)

### Producten → absorptie in m²

```
Aeq/stuk = Akoestisch_oppervlak × Spraak_α × Diffractie_factor
```

- Diffractie = 1.12 voor pendant (hangend), 1.00 voor wall/floor/baffle
- Totaal = Aeq/stuk × aantal

### Rating (6 niveaus, relatief aan norm)

| Drempel | Rating |
|---------|--------|
| ≤ norm | ⭐ Uitstekend |
| ≤ norm × 1.15 | ✔️ Prima |
| ≤ norm × 1.30 | ⚠️ Redelijk |
| ≤ norm × 1.60 | 🟠 Matig |
| ≤ norm × 2.00 | 🔴 Onvoldoende |
| > norm × 2.00 | 🔴 Zeer slecht |

## Bronnen absorptiedata

- **Acoustic.ua** — Primaire bron voor α-waarden
- **Sengpiel Audio** — Kruisvalidatie
- **Peutz rapport A 3432-1-RA** (EN-ISO 354:2003) — PET-vilt testdata
- **Lumenear catalogus 2026** — Productafmetingen en αw

## Regels bij aanpassingen

1. **Glas absorbeert bijna niks bij spraak** (α ≈ 0.03). Nooit hoger zetten.
2. **Gipsplaat 125Hz = 0.29 is correct** (membraanresonantie op stijlen). Niet verlagen.
3. **Diffractie 1.12 alleen voor pendant**. Wall/floor/baffle altijd 1.00.
4. **Float acoustic = Peutz V5** (9mm vilt + 40mm Mélopée wol). αw = 1.00.
5. **Float light = αw 0.55** (9mm vilt + 60mm luchtspouw + vilten kap).
6. **"Weet ik niet" defaults op worst-case** (laagste absorptie). Niet verhogen.
7. **Overige akoestiek mag NIET overlappen** met Inrichting (geen "stoelen" of "meubels").
8. **Dropdown teksten max 255 tekens** (Excel Data Validation limiet).
9. **Web en Excel moeten dezelfde waarden gebruiken**. Sync handmatig.

## Excel bouwen

```bash
cd excel
pip install openpyxl pandas
python build_lumenear_calculator_v4.py
# Output: lumenear_acoustic_calculator_v4.xlsx
```

## Netlify deploy

GitHub repo (fv-agents/acoustic-calculator) → Netlify auto-deploy.
Repo-root is de bovenliggende projectmap; `netlify.toml` staat daar met publish directory = `lumenear-calculator`.
Push naar main = live op Netlify.

## Volledige documentatie

Zie `lumenear_acoustic_calculator_v4_documentatie.md` voor:
- Cel-voor-cel uitleg van het Excel-bestand
- Alle α-waarden met bronverwijzingen
- Alle 89 producten met Aeq
- Peutz testdata
- Alle Excel-formules
- Versiegeschiedenis V1 → V4
- Onderhoudsinstructies
