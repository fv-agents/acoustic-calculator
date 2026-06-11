# Lumenear Akoestische Calculator — Documentatie

> Versie: 5.0 (dashboard, self-contained)
> Bijgewerkt: 2026-06-11
> Doel: verkooptool voor akoestisch advies — architecten, projectinrichters en het Lumenear salesteam

---

## 1. Wat is dit?

Interactief webdashboard dat live berekent wat Lumenear armaturen bijdragen aan de akoestiek van een ruimte: nagalmtijd (RT60) zonder en met Lumenear, verbetering in %, normtoetsing (indicatief) en STI-schatting. Inclusief **printbaar adviesrapport (PDF)**.

De app draait volledig zelfstandig: React, htm en het Inter-font zijn lokaal gevendored (`app/vendor/`, `app/fonts/`). Geen CDN's, geen build-stap, geen internetverbinding nodig. Eén `app/index.html` + twee mappen.

## 2. Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ HEADER (zwart)   projectnaam     [Rapport (PDF)][Opslaan][Openen][Nieuw]
├───────────────────────────────────────────────────────────────────┤
│ TOPBAR: [3D kamer] RT60 zonder · RT60 met · Verbetering · Richtwaarde · ● rating
├──────────────┬──────────────────────────────┬─────────────────────┤
│ LINKS (25%)  │ MIDDEN (45%)                 │ RECHTS (30%)        │
│ Project      │ Producten: zoekveld,         │ Geselecteerde       │
│ Ruimte       │ familietabs, productgrid     │ producten           │
│ Materialen   │ met [−][n][+]                │ RT60 staafdiagram   │
│ Inrichting   │                              │ Absorptie-taart     │
│              │                              │ + 4 tech parameters │
│              │                              │ STI-indicator       │
└──────────────┴──────────────────────────────┴─────────────────────┘
```

- Layout gebruikt flex (`flex:1; min-height:0`) — geen hoogte-magic numbers, klopt op elk scherm en in iframes.
- Onder 1100px breedte stapelt de layout verticaal (tablet/smalle iframe).

## 3. Berekening

- **Sabine**: `T₆₀ = 0.161 × V / A` — spraakgemiddelde 500–2000 Hz
- Ruimteabsorptie: `α_vloer×S_vloer + α_wand×S_wanden + α_plafond×S_plafond + (factor_meubels + factor_extra)×S_vloer`
- Lumenear: `Σ (aantal × Aeq)` per product; Aeq uit ISO 354-labdata, pendant +12% randdiffractie
- RT60 wordt **ongeclampt** berekend; alleen de weergave topt af op "≥6,0 s" zodat de verbetering ook in extreme ruimtes klopt
- Rating (t.o.v. richtwaarde): ≤1.0 Uitstekend · ≤1.15 Prima · ≤1.3 Redelijk · ≤1.6 Matig · ≤2.0 Onvoldoende · >2.0 Zeer slecht
- STI-schatting op basis van T₆₀ (ISO 3382-3 richtwaarden), indicatief

Volledig rekenvoorbeeld: `BEREKENING-VOORBEELD.md`.

## 4. Data

**Bron van waarheid: `excel/lumenear_2026_acoustic_data.csv`** (89 producten, octaafband-α's, ISO 354).

De `const PP=[...]` array in `app/index.html` is daarvan afgeleid. Regenereren:

```bash
cd excel
python build_lumenear_calculator_v4.py --web   # print het JS-blok
python ../tools/check_sync.py                  # verifieert de sync (draait ook in CI)
```

Materiaaldata (FLOOR/WALL/CEIL/FURN/EX) en presets staan in `app/index.html` én `excel/build_lumenear_calculator_v4.py` — handmatig synchroon houden.

### Harde dataregels (niet wijzigen zonder bron)

1. **Glas absorbeert bijna niets bij spraak** (α ≈ 0.03). Nooit hoger zetten.
2. **Gipsplaat 125 Hz = 0.29 is correct** (membraanresonantie). Niet verlagen.
3. **Diffractie 1.12 alleen voor pendant.** Wall/floor/baffle altijd 1.00.
4. **Float acoustic = Peutz V5** (9mm vilt + 40mm wol), α 500/1000/2000 = 0.99/0.99/0.97.
5. **Float light = αw 0.55** (9mm vilt + 60mm luchtspouw).
6. **"Weet ik niet" defaults op worst-case** (laagste absorptie).
7. **Overige akoestiek mag niet overlappen met Inrichting** (geen "stoelen"/"meubels").
8. **Berekende Aeq is leidend** — de CSV-kolom Equivalent_Absorption_Aeq_m2 wordt bewust genegeerd (besluit 2026-06-11).
9. **Web en Excel gebruiken dezelfde waarden** — CI bewaakt de productdata via `tools/check_sync.py`.

## 5. Functies

| Functie | Hoe |
|---|---|
| Rapport (PDF) | Knop in header → printdialoog → "Opslaan als PDF". 2 pagina's A4: conclusie, grafieken, uitgangssituatie, productadvies, STI, methodiek + disclaimer |
| Opslaan/Openen | JSON-export/import van het volledige project. Import valideert alle namen en meldt onbekende waarden |
| Autosave | Huidige staat wordt in localStorage bewaard — F5 wist niets |
| Nieuw | Reset naar standaardwaarden (opsteller blijft staan) |
| Zoeken | Tekstfilter over de 89 producten, combineerbaar met familietabs |
| Tooltips | Hover over αw, Aeq, STI, V/A, geluidsverval voor uitleg |

## 6. Stack

| Onderdeel | Keuze | Waarom |
|---|---|---|
| UI | React 18 (UMD, gevendored in `app/vendor/`) | Reactieve state, geen build |
| Templates | htm 3 (1 KB, gevendored) | JSX-achtige syntax zonder Babel/transpiler |
| Styling | CSS custom properties, inline | Geen framework nodig |
| Grafieken | Eigen SVG (IsoRoom, Bars, Pie) | Licht, print-vriendelijk |
| Font | Inter variable (woff2, `app/fonts/`) | Lokaal, geen Google-request (GDPR) |
| Opslag | localStorage + JSON-bestanden | Geen backend |

## 7. Bekende beperkingen

1. Sabine is een benadering — in zeer droge/galmende ruimten zijn Eyring/Millington nauwkeuriger.
2. Eén spraakgemiddelde, geen frequentiebandsplitsing.
3. Positie/clustering van armaturen telt niet mee (geen diffusieberekening).
4. STI is een schatting op basis van nagalmtijd alleen.
5. De richtwaarden per ruimtetype zijn indicatief — geen formele NEN 18041-toetsing.
