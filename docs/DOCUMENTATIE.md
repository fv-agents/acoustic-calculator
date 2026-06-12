# Lumenear Akoestische Calculator — Documentatie

> Versie: 5.1 (materialenherziening + bezetting)
> Bijgewerkt: 2026-06-12
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
- Ruimteabsorptie: `α_vloer×S_vloer + α_wand×S_wanden + α_plafond×S_plafond + (factor_meubels + Σfactor_extra)×S_vloer + personen×0,46`
- Bezetting: ±0,46 m² Sabine per zittende persoon (klassieke tabelwaarde); 0 personen = onbezet (worst-case)
- Lumenear: `Σ (aantal × Aeq)` per product; Aeq uit ISO 354-labdata, pendant +12% randdiffractie
- RT60 wordt **ongeclampt** berekend; alleen de weergave topt af op "≥6,0 s" zodat de verbetering ook in extreme ruimtes klopt
- Rating (t.o.v. richtwaarde): ≤1.0 Uitstekend · ≤1.15 Prima · ≤1.3 Redelijk · ≤1.6 Matig · ≤2.0 Onvoldoende · >2.0 Zeer slecht
- STI-schatting op basis van T₆₀ (ISO 3382-3 richtwaarden), indicatief

Volledig rekenvoorbeeld: `BEREKENING-VOORBEELD.md`.

## 4. Data

**Bron van waarheid: `data/lumenear_2026_acoustic_data.csv`** (89 producten, octaafband-α's, ISO 354).

De `const PP=[...]` array in `app/index.html` is daarvan afgeleid. Regenereren:

```bash
python tools/check_sync.py --emit   # print het JS-blok → plak in app/index.html
python tools/check_sync.py          # verifieert de sync (draait ook in CI)
```

Materiaaldata (FLOOR/WALL/CEIL/FURN/EX) en presets staan alléén in `app/index.html`. Bronnen per waarde (onderzoek 2026-06-12):

| Waarde | Bron |
|---|---|
| Tapijttegels 0,15 | Fabrikantdata Tarkett/DESSO: standaard tegels αw 0,15–0,20 |
| Lamellenwand direct op wand 0,30 | ISO 354-testrapporten lattenpanelen (αw ≈ 0,3 MH direct geschroefd) |
| Lamellenwand op regels + isolatie 0,62 | Zelfde testreeks: regels + minerale wol → ≈ 0,62 MH |
| Lamellenplafond 0,60 | Plafondmontage = plenum; tussen direct- en spouwwaarde |
| Akoestisch spuitpleister 0,70 | 25 mm op vaste ondergrond: α 0,50/0,80/0,85 → spraak 0,72; NRC-range fabrikanten 0,65–0,90 |
| Personen 0,46 m²/p.p. | Sengpiel (0,42/0,46/0,50) en Aural Exchange (0,44/0,45/0,45) — twee bronnen consistent |
| PET-vilt wandopties 0,36 / 0,90 | Eigen Peutz-rapport A 3432-1-RA (V1 / V4-V5) |

De Excel-versie is per 2026-06-12 uitgefaseerd; het buildscript staat in `backup/build_lumenear_calculator_v4.py`.

### Harde dataregels (niet wijzigen zonder bron)

1. **Glas absorbeert bijna niets bij spraak** (α ≈ 0.03). Nooit hoger zetten.
2. **Gipsplaat 125 Hz = 0.29 is correct** (membraanresonantie). Niet verlagen.
3. **Diffractie 1.12 alleen voor pendant.** Wall/floor/baffle altijd 1.00.
4. **Float acoustic = Peutz V5** (9mm vilt + 40mm wol), α 500/1000/2000 = 0.99/0.99/0.97.
5. **Float light = αw 0.55** (9mm vilt + 60mm luchtspouw).
6. **"Weet ik niet" defaults op worst-case** (laagste absorptie).
7. **Extra akoestiek mag niet overlappen met Meubilering of vloerkeuze** (daarom geen "losse tapijten" meer).
8. **Berekende Aeq is leidend** — de CSV-kolom Equivalent_Absorption_Aeq_m2 wordt bewust genegeerd (besluit 2026-06-11).
9. **Productdata komt uit de CSV** — CI bewaakt de sync via `tools/check_sync.py`; regenereren met `--emit`.
10. **De norm heet DIN 18041** (Duits) — nooit "NEN 18041" schrijven; richtwaarden blijven "indicatief, geen formele toetsing".

## 5. Functies

| Functie | Hoe |
|---|---|
| Rapport (PDF) | Knop in header → printdialoog → "Opslaan als PDF". 2 pagina's A4: conclusie, grafieken, uitgangssituatie, productadvies, STI, methodiek + disclaimer |
| Opslaan/Openen | JSON-export/import van het volledige project. Import valideert alle namen en meldt onbekende waarden |
| Autosave | Huidige staat wordt in localStorage bewaard — F5 wist niets |
| Nieuw | Reset naar standaardwaarden (opsteller blijft staan) |
| Zoeken | Tekstfilter over de 89 producten, combineerbaar met familietabs |
| Bezetting | Aantal personen telt mee als absorptie; zichtbaar in verdeling en rapport |
| Extra akoestiek | Checkboxes (additief): planten, gordijnen licht/zwaar, bureauschermen, roomdividers |
| Tooltips | Hover over αw, Aeq, STI, V/A, geluidsverval, personen voor uitleg |

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
5. De richtwaarden per ruimtetype zijn indicatief — geen formele DIN 18041-toetsing.
