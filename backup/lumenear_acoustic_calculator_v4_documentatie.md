# Lumenear Akoestische Calculator V4 — Volledige Documentatie

> **Versie:** 4.0 (februari 2026)
> **Bestand:** `lumenear_acoustic_calculator_v4.xlsx`
> **Doel:** Indicatieve berekening van nagalmtijd (RT60) voor architecten, interieurontwerpers en verlichtingsadviseurs. Toont het akoestische effect van Lumenear producten in een ruimte.
> **Methode:** Sabine-formule, spraakgemiddelde (500/1000/2000 Hz)

---

## Inhoudsopgave

1. [Hoe het werkt](#1-hoe-het-werkt)
2. [Sheet-structuur](#2-sheet-structuur)
3. [Calculator — Cel-voor-cel uitleg](#3-calculator--cel-voor-cel-uitleg)
4. [Materiaaldata — Alle absorptiewaarden](#4-materiaaldata--alle-absorptiewaarden)
5. [Productdata — 89 producten](#5-productdata--89-producten)
6. [Peutz Testdata](#6-peutz-testdata)
7. [De Sabine-formule](#7-de-sabine-formule)
8. [Diffractie-bonus (+12%)](#8-diffractie-bonus-12)
9. [Bronnen & validatie](#9-bronnen--validatie)
10. [Versiegeschiedenis](#10-versiegeschiedenis)
11. [Bekende beperkingen & verbeterpunten](#11-bekende-beperkingen--verbeterpunten)
12. [Onderhoudsinstructies](#12-onderhoudsinstructies)
13. [Alle formules (Excel-syntax)](#13-alle-formules-excel-syntax)

---

## 1. Hoe het werkt

### In het kort

De calculator berekent hoeveel nagalm (echo) een ruimte heeft, en laat zien hoeveel die nagalm afneemt als je Lumenear akoestische lampen toevoegt. Het werkt in vier stappen:

1. **Ruimteafmetingen** — lengte, breedte, hoogte → berekent volume en oppervlaktes
2. **Materialen selecteren** — vloer, wanden, plafond, inrichting, overige akoestiek → berekent totale absorptie van de ruimte
3. **Lumenear producten kiezen** — producten + aantallen → berekent extra absorptie
4. **Resultaat** — nagalmtijd zonder en met Lumenear, procentuele verbetering, beoordeling

### De kernformule

```
RT60 = 0.161 × Volume / Totale absorptie
```

Dit is de Sabine-formule. RT60 = de tijd in seconden voordat geluid 60 dB is afgenomen. Hoe lager, hoe beter de spraakverstaanbaarheid.

### Spraakgemiddelde

Alle berekeningen gebruiken het **spraakgemiddelde**: het gemiddelde van de absorptiecoëfficiënten bij 500 Hz, 1000 Hz en 2000 Hz. Dit zijn de frequenties die het meest relevant zijn voor spraakverstaanbaarheid in kantoren, scholen en horeca.

```
Spraak α = (α_500 + α_1000 + α_2000) / 3
```

---

## 2. Sheet-structuur

| Sheet | Kleur tab | Functie |
|-------|-----------|---------|
| **Calculator** | Oranje | Interface voor eindgebruiker. Invoervelden, formules, resultaat |
| **Materiaaldata** | Groen | Alle absorptiecoëfficiënten, inrichtingsfactoren, presets. Wordt gelookupd door Calculator |
| **Productdata** | Blauw | 89 Lumenear producten met αw, oppervlakte, Aeq per stuk. Wordt gelookupd door Calculator |
| **Peutz Testdata** | Donkerblauw | Originele EN-ISO 354 testresultaten van Peutz (rapport A 3432-1-RA, 17 mei 2018) |

### Data flow

```
Materiaaldata (absorptiewaarden)
       ↓ VLOOKUP
Calculator (invoer + formules) ← INDEX/MATCH → Productdata (89 producten)
       ↓
    Resultaat (RT60, rating)
```

---

## 3. Calculator — Cel-voor-cel uitleg

### ① RUIMTE (rij 4-8)

| Cel | Inhoud | Type |
|-----|--------|------|
| B5 | Lengte (m) | Invoer (blauw) — standaard 12 |
| B6 | Breedte (m) | Invoer (blauw) — standaard 8 |
| B7 | Hoogte (m) | Invoer (blauw) — standaard 3 |
| E5 | Volume = B5×B6×B7 | Formule |
| E6 | Vloeroppervlak = B5×B6 | Formule |
| E7 | Plafondoppervlak = B5×B6 | Formule |
| E8 | Wandoppervlak = 2×(B5×B7) + 2×(B6×B7) | Formule |

### ② RUIMTE & MATERIALEN (rij 9-18)

| Cel | Inhoud | Type |
|-----|--------|------|
| B10 | Type ruimte (preset) | Dropdown → Materiaaldata presets R71-R79 |
| C10 | Norm RT60 van gekozen preset | VLOOKUP kolom 7 |
| D10 | "← Richtlijn" als preset gekozen | Formule |
| B13 | Vloermateriaal | Dropdown → 6 opties (R6-R11) |
| B14 | Wandmateriaal | Dropdown → 12 opties (R15-R26) |
| B15 | Plafondmateriaal | Dropdown → 10 opties (R30-R39) |
| B16 | Inrichting | Dropdown → 10 opties (R43-R52) |
| B17 | Overige akoestiek | Dropdown → 12 opties (R56-R67) |
| C13-C17 | Absorptie in m² Aeq | Formule: VLOOKUP(spraak) × oppervlak |
| D13-D17 | Handmatige override (m²) | Invoer (optioneel) |
| E13-E17 | Aanbevolen materiaal uit preset | VLOOKUP |

**Hoe de absorptie berekend wordt (voorbeeld vloer):**

```
C13 = IF(D13<>"", D13, VLOOKUP(B13, Materiaaldata!A6:H11, 8, FALSE) × E6)
```

Logica: als er een handmatige waarde in D13 staat, gebruik die. Anders: zoek de spraak-α op in Materiaaldata en vermenigvuldig met het vloeroppervlak.

- Vloer (C13): spraak × vloeropp (E6)
- Wanden (C14): spraak × wandopp (E8)
- Plafond (C15): spraak × plafondopp (E7)
- Inrichting (C16): factor × vloeropp (E6)
- Overige (C17): factor × vloeropp (E6)

### ③ LUMENEAR PRODUCTEN (rij 19-26)

6 productrijen (R21-R26). Per rij:

| Kolom | Inhoud | Bron |
|-------|--------|------|
| A | Productnaam | Dropdown → Productdata A5:A93 |
| B | Aantal stuks | Invoer |
| C | m²/stuk (oppervlakte) | INDEX/MATCH → Productdata kolom D |
| D | αw (ISO 11654) | INDEX/MATCH → Productdata kolom C |
| E | Spraak α | INDEX/MATCH → Productdata kolom F |
| F | Aeq totaal = aantal × Aeq/stuk | Formule: B × INDEX(Productdata!H, MATCH) |

**Let op:** F-kolom gebruikt Aeq/stuk uit Productdata (kolom H), niet spraak × oppervlak. Aeq/stuk is al inclusief de diffractie-bonus.

### ④ RESULTAAT (rij 28-39)

| Cel | Inhoud | Formule |
|-----|--------|---------|
| B29 | Ruimte-absorptie totaal | = C13 + C14 + C15 + C16 + C17 |
| B30 | Lumenear absorptie totaal | = SUM(F21:F26) |
| B32 | **RT60 ZONDER Lumenear** | = 0.161 × Volume / B29 (max 6s) |
| B33 | **RT60 MET Lumenear** | = 0.161 × Volume / (B29+B30) (max 6s) |
| B34 | Verbetering in % | = 1 - B33/B32 |
| A35 | Tekstuele beoordeling | 6-level IF-formule met emoji's |
| A36 | Preset beschrijving | Gekozen preset + norm in tekst |

### Beoordelingssysteem (A35)

6 niveaus, relatief ten opzichte van de norm uit C10 (default 0.8s als geen preset gekozen):

| Drempel | Emoji | Tekst |
|---------|-------|-------|
| ≤ norm | ⭐ | Uitstekend - Perfecte spraakverstaanbaarheid |
| ≤ norm × 1.15 | ✔️ | Prima - Vaak werkbaar |
| ≤ norm × 1.30 | ⚠️ | Redelijk - Lichte nagalm, ruimte voor optimalisatie |
| ≤ norm × 1.60 | 🟠 | Matig - Norm overschreden, extra absorptie geadviseerd |
| ≤ norm × 2.00 | 🔴 | Onvoldoende - Storende nagalm, actie vereist |
| > norm × 2.00 | 🔴 | Zeer slecht - Akoestisch onwerkbaar |

**Voorwaardelijke opmaak op A35:** 6 regels met subtiele tekstkleuren (bold, geen achtergrond):

| Regel | Formule | Tekstkleur |
|-------|---------|------------|
| 1 (hoogste prioriteit) | `=EN(B33<>"n.v.t.";B33<=ALS(C10="";0,8;C10))` | #166534 donkergroen |
| 2 | `...<=...C10*1,15` | #22A06B groen |
| 3 | `...<=...C10*1,3` | #9A6700 amber |
| 4 | `...<=...C10*1,6` | #EA580C oranje |
| 5 | `...<=...C10*2` | #DC2626 rood |
| 6 | `...>...C10*2` | #991B1B donkerrood |

Alle regels met "Stoppen als WAAR" aan.

### Grafiek (D37)

Staafdiagram met twee balken: "Zonder" (rood #DC2626) en "Met Lumenear" (groen #059669). Data uit H2:I3. Labels tonen waarde als "X.Xs".

---

## 4. Materiaaldata — Alle absorptiewaarden

### VLOER (6 opties, rij 6-11)

| Materiaal | α 125 | α 250 | α 500 | α 1k | α 2k | α 4k | Spraak | Bron |
|-----------|-------|-------|-------|------|------|------|--------|------|
| Weet ik niet | 0.01 | 0.01 | 0.02 | 0.02 | 0.02 | 0.03 | **0.02** | Conservatief = harde vloer |
| Harde vloer (beton/tegels) | 0.01 | 0.01 | 0.02 | 0.02 | 0.02 | 0.03 | **0.02** | acoustic.ua: marble/terrazzo |
| Linoleum / vinyl / PVC | 0.02 | 0.02 | 0.03 | 0.04 | 0.04 | 0.05 | **0.04** | acoustic.ua: linoleum on concrete |
| Parquet / laminaat | 0.04 | 0.04 | 0.07 | 0.06 | 0.06 | 0.07 | **0.06** | acoustic.ua: parquet on concrete |
| Dun tapijt | 0.02 | 0.06 | 0.14 | 0.37 | 0.60 | 0.65 | **0.37** | acoustic.ua: carpet on concrete |
| Dik tapijt (+ ondervloer) | 0.08 | 0.24 | 0.57 | 0.69 | 0.71 | 0.73 | **0.66** | acoustic.ua: carpet on foam |

### WANDEN (12 opties, rij 15-26)

| Materiaal | α 125 | α 250 | α 500 | α 1k | α 2k | α 4k | Spraak | Bron |
|-----------|-------|-------|-------|------|------|------|--------|------|
| Beton / steen | 0.01 | 0.01 | 0.02 | 0.02 | 0.02 | 0.03 | **0.02** | acoustic.ua: painted concrete |
| Tegels / natuursteen | 0.01 | 0.01 | 0.01 | 0.01 | 0.02 | 0.02 | **0.01** | acoustic.ua: marble/glazed tile |
| Stucwerk | 0.02 | 0.02 | 0.03 | 0.04 | 0.04 | 0.04 | **0.04** | acoustic.ua: lime cement plaster |
| Gipsplaat (standaard) | 0.29 | 0.10 | 0.05 | 0.04 | 0.07 | 0.09 | **0.05** | acoustic.ua + sengpiel: sheetrock on studs |
| Gipsplaat + isolatie | 0.30 | 0.12 | 0.08 | 0.06 | 0.06 | 0.05 | **0.07** | acoustic.ua: plasterboard + mineral wool |
| Houten panelen | 0.15 | 0.20 | 0.10 | 0.10 | 0.05 | 0.05 | **0.08** | acoustic.ua: wood boards on battens |
| Gips + weinig glas (~25%) | 0.24 | 0.09 | 0.05 | 0.04 | 0.06 | 0.07 | **0.05** | Mix: 25% glas 6mm + 75% gipsplaat |
| Gips + veel glas (~50%) | 0.20 | 0.08 | 0.05 | 0.04 | 0.05 | 0.06 | **0.05** | Mix: 50% glas 6mm + 50% gipsplaat |
| Overwegend glas (~75%) | 0.15 | 0.07 | 0.04 | 0.03 | 0.03 | 0.04 | **0.03** | Mix: 75% glas 6mm + 25% gipsplaat |
| Glazen systeemwand | 0.10 | 0.06 | 0.04 | 0.03 | 0.02 | 0.02 | **0.03** | acoustic.ua: 6mm plate glass (100%) |
| Zachte wandbekleding | 0.05 | 0.15 | 0.25 | 0.35 | 0.30 | 0.25 | **0.30** | acoustic.ua: fabric on wall |
| Akoestische wandpanelen | 0.10 | 0.20 | 0.40 | 0.50 | 0.45 | 0.40 | **0.45** | PET-vilt / Rockwool panelen |

**Over de glas-opties:**
Glas absorbeert bij spraakfrequenties bijna niks (α 0.03). De hoge waarden bij 125 Hz komen door membraanresonantie van het dunne glas. De mix-formules berekenen een gewogen gemiddelde op basis van de verhouding glas/gipsplaat. Bijvoorbeeld "Overwegend glas (~75%)":

```
α_spraak = 0.75 × 0.03 (glas) + 0.25 × 0.05 (gipsplaat) = 0.035 → afgerond 0.03
```

**Over gipsplaat 125 Hz = 0.29:**
Dit lijkt hoog maar is correct. Gipsplaat op stijlen (studs) met luchtspouw werkt als membraanabsorber bij lage frequenties. Zonder stijlen (direct op metselwerk) zou het 0.05 zijn. In moderne kantoren zit gipsplaat altijd op stijlen.

### PLAFOND (10 opties, rij 30-39)

| Materiaal | α 125 | α 250 | α 500 | α 1k | α 2k | α 4k | Spraak | Bron |
|-----------|-------|-------|-------|------|------|------|--------|------|
| Weet ik niet | 0.01 | 0.01 | 0.02 | 0.02 | 0.02 | 0.03 | **0.02** | Conservatief |
| Betonplafond | 0.01 | 0.01 | 0.02 | 0.02 | 0.02 | 0.03 | **0.02** | acoustic.ua |
| Gipsplafond (dicht) | 0.15 | 0.10 | 0.06 | 0.04 | 0.04 | 0.05 | **0.05** | acoustic.ua: plasterboard ceiling |
| Houten plafond | 0.15 | 0.20 | 0.10 | 0.10 | 0.05 | 0.05 | **0.08** | acoustic.ua: wood boards |
| Metalen plafond (dicht) | 0.15 | 0.10 | 0.08 | 0.06 | 0.05 | 0.04 | **0.06** | Geschat: metalen cassetteplafond |
| Metalen plafond (geperforeerd) | 0.15 | 0.25 | 0.40 | 0.55 | 0.50 | 0.45 | **0.48** | acoustic.ua: perforated metal + rockwool |
| Open plafond (installaties) | 0.10 | 0.10 | 0.08 | 0.06 | 0.05 | 0.05 | **0.06** | Geschat: leidingen, installaties |
| Systeemplafond (oud/dun) | 0.05 | 0.15 | 0.30 | 0.45 | 0.50 | 0.45 | **0.42** | Sengpiel Audio: basic acoustic tiles |
| Systeemplafond (standaard) | 0.10 | 0.25 | 0.55 | 0.70 | 0.70 | 0.65 | **0.65** | Rockfon standaard 20mm |
| Systeemplafond (hoog absorberend) | 0.30 | 0.65 | 0.90 | 0.95 | 0.90 | 0.85 | **0.92** | Ecophon Focus A |

### INRICHTING (10 opties, rij 43-52)

Factor per m² vloeroppervlak. Wordt vermenigvuldigd met E6 (vloeropp).

| Omschrijving | Factor | Bij 96 m² | Toelichting |
|-------------|--------|-----------|-------------|
| Weet ik niet | 0.005 | 0.5 m² | Worst-case |
| Leeg / weinig meubels | 0.005 | 0.5 m² | Kale ruimte |
| Kantoor - bureaus+stoelen | 0.08 | 7.7 m² | ~0.50 per werkplek (acoustic.ua) |
| Kantoor - volledig ingericht | 0.10 | 9.6 m² | + kasten, tapijtstukken |
| Vergaderruimte | 0.06 | 5.8 m² | Tafel + stoelen |
| Restaurant / horeca | 0.05 | 4.8 m² | Wisselende bezetting |
| Lounge / gestoffeerd | 0.12 | 11.5 m² | Banken, fauteuils, kussens |
| Retail / winkel | 0.03 | 2.9 m² | Harde rekken, weinig absorptie |
| Onderwijs / school | 0.06 | 5.8 m² | Tafels + plastic stoelen |
| Zorg / medisch | 0.04 | 3.8 m² | Mix hard en zacht |

### OVERIGE AKOESTIEK (12 opties, rij 56-67)

Extra akoestische maatregelen bovenop inrichting. Geen overlap met inrichtingsopties. Factor per m² vloeroppervlak.

| Omschrijving | Factor | Bij 96 m² | Bij 200 m² |
|-------------|--------|-----------|------------|
| 1. Niks extra | 0.00 | 0.0 m² | 0.0 m² |
| 2. Alleen planten | 0.01 | 1.0 m² | 2.0 m² |
| 3. Dunne gordijnen | 0.02 | 1.9 m² | 4.0 m² |
| 4. Losse tapijten | 0.03 | 2.9 m² | 6.0 m² |
| 5. Raamdecoratie | 0.04 | 3.8 m² | 8.0 m² |
| 6. Zware gordijnen | 0.05 | 4.8 m² | 10.0 m² |
| 7. Bureauschermen | 0.06 | 5.8 m² | 12.0 m² |
| 8. Gordijnen + tapijten | 0.07 | 6.7 m² | 14.0 m² |
| 9. Schermen + gordijnen | 0.09 | 8.6 m² | 18.0 m² |
| 10. Schermen + panelen | 0.11 | 10.6 m² | 22.0 m² |
| 11. Roomdividers + schermen | 0.14 | 13.4 m² | 28.0 m² |
| 12. Compleet pakket | 0.20 | 19.2 m² | 40.0 m² |

### PRESETS (9 opties, rij 71-79)

| Ruimtetype | Vloer | Wanden | Plafond | Inrichting | Overige | Norm |
|------------|-------|--------|---------|------------|---------|------|
| (zelf invullen) | — | — | — | — | — | 0.8s |
| Kantoor (open plan) | Linoleum/vinyl/PVC | Gipsplaat + isolatie | Systeemplafond (standaard) | Bureaus+stoelen | 7. Bureauschermen | 0.6s |
| Kantoor (celkantoor) | Dun tapijt | Gipsplaat + isolatie | Systeemplafond (standaard) | Bureaus+stoelen | 2. Alleen planten | 0.8s |
| Vergaderruimte | Dun tapijt | Gipsplaat + isolatie | Gipsplafond (dicht) | Vergaderruimte | 4. Losse tapijten | 0.6s |
| Restaurant / cafe | Harde vloer | Stucwerk | Open plafond | Horeca | 1. Niks extra | 1.0s |
| Lobby / receptie | Harde vloer | Overwegend glas (~75%) | Betonplafond | Lounge | 2. Alleen planten | 1.0s |
| Klaslokaal | Linoleum/vinyl/PVC | Gipsplaat (standaard) | Systeemplafond (oud/dun) | School | 1. Niks extra | 0.8s |
| Zorginstelling | Linoleum/vinyl/PVC | Gipsplaat + isolatie | Systeemplafond (standaard) | Zorg/medisch | 3. Dunne gordijnen | 0.8s |
| Retail / winkel | Harde vloer | Glazen systeemwand | Open plafond | Retail | 1. Niks extra | 1.0s |

**Over de vergaderruimte-preset:** Bewust gekozen met gipsplafond (dicht) i.p.v. systeemplafond. De meeste vergaderruimtes die Lumenear nodig hebben, zijn juist die zonder goed akoestisch plafond. Met systeemplafond (standaard) haal je de norm vaak al zonder producten.

---

## 5. Productdata — 89 producten

### Families en akoestische groepen

| Groep | αw | Spraak α | Aantal | Families |
|-------|-----|----------|--------|----------|
| Basis PET-vilt | 0.45 | 0.49 | 57 | Nova, Toad, Blaze, Halo, Breeze, Orbit, Column, Wing, Cloud, Sliced, Twist, Blooom, Drop, Cage, Podge, Spott, Pyknic |
| Float light | 0.55 | 0.79 | 9 | Float downlight, Float ringlight, Float Rectangle/Oval light |
| Macaron wall | 0.60 | 0.90 | 6 | Macaron light/acoustic wall |
| Cone | 0.65 | 0.75 | 2 | Cone 750, Cone 1000 |
| Macaron pendant + Edge | 0.85 | 0.90 | 8 | Macaron light/acoustic pendant, Edge acoustic |
| Float acoustic | 0.90 | 0.98 | 7 | Float acoustic round/Oval/Rectangle |
| Klasse A | 1.00 | 0.99 | 7 | Line, Bold, JoJo |

### Aeq per stuk formule

```
Aeq/stuk = Akoestisch oppervlak (m²) × Spraak α × Diffractie-factor
```

- Diffractie = 1.12 voor pendant (hangend)
- Diffractie = 1.00 voor wall, floor standing, ceiling baffle

### Oppervlakteberekening

Producten gemarkeerd met "★ Berekend" hebben geen oppervlak in de catalogus. Het oppervlak is berekend op basis van afmetingen:

| Vorm | Formule | Voorbeeld |
|------|---------|-----------|
| Cirkel (pendant) | 2 × π × r² | Float round 1200: 2 × π × 0.6² = 2.26 m² |
| Ovaal (pendant) | 2 × π × a × b | Float Oval 2000: 2 × π × 0.5 × 1.0 = 3.14 m² |
| Rechthoek (pendant) | 2 × L × B | Float Rectangle 1200×2400: 2 × 1.2 × 2.4 = 5.76 m² |
| Line (pendant) | 2 × 0.15 × L | Line 2520: 2 × 0.15 × 2.52 = 0.76 m² |
| Cone (pendant) | π × r × √(r² + h²) | Cone 1000: π × 0.5 × √(0.5² + 0.35²) = 0.93 m² |
| Macaron pendant | 0.6 × 4πr² | 60% van boloppervlak |
| Macaron wall | πr² | Plat cirkeloppervlak |
| Edge | 2 × L × B | Edge: 2 × 0.4 × 0.8 = 0.64 m² |

### Peutz-referenties per productgroep

| Product | Peutz variant | Opbouw | αw |
|---------|--------------|--------|-----|
| Float acoustic | V5: 9mm + 40mm Mélopée | 9mm PET-vilt + 40mm akoestische wol | 1.00 (klasse A) |
| Float light | Tussen V1 en V4 | 9mm PET-vilt + 60mm luchtspouw + vilten kap | 0.55 |
| Basis (0.45) producten | V2: 2×9mm | Standaard PET-vilt body | 0.45 (klasse D) |
| Line, Bold, JoJo | V5 | Dikker materiaal / meerdere lagen | 1.00 (klasse A) |

### Alle 89 producten (gesorteerd op Aeq)

| Product | Aeq/stuk | αw | Opp (m²) | Mount |
|---------|----------|-----|----------|-------|
| Nova acoustic 2800 | 7.90 | 0.45 | 14.40 | Pendant |
| Float acoustic Rectangle 1200x2400 | 6.32 | 0.90 | 5.76 | Pendant |
| Cloud acoustic round XL 2400 | 5.95 | 0.45 | 10.85 | Pendant |
| Blaze 1200 / Toad 1500 | 4.85 | 0.45 | 8.84 | Pendant |
| Halo acoustic 1400 | 3.45 | 0.45 | 6.28 | Pendant |
| Float acoustic Oval 2000 | 3.45 | 0.90 | 3.14 | Pendant |
| Float acoustic Rectangle 1200x1200 | 3.16 | 0.90 | 2.88 | Pendant |
| Bold acoustic 1200x1200 | 2.85 | 1.00 | 2.88 | Baffle |
| Pyknic floor | 2.78 | 0.45 | 5.67 | Floor |
| Float Oval downlight 2000 | 2.78 | 0.55 | 3.14 | Pendant |
| ... | ... | ... | ... | ... |
| Macaron wall 450 | 0.14 | 0.60 | 0.16 | Wall |

---

## 6. Peutz Testdata

Originele meetresultaten uit EN-ISO 354:2003 test door Peutz (rapport A 3432-1-RA, 17 mei 2018).

### Vlakke absorbers (eenzijdig)

| Hz | V1: 1×9mm | V2: 2×9mm | V3: 3×9mm | V4: 9mm+20Mét | V5: 9mm+40Mét |
|----|-----------|-----------|-----------|---------------|---------------|
| 125 | 0.02 | 0.04 | 0.09 | 0.09 | 0.26 |
| 250 | 0.03 | 0.12 | 0.31 | 0.28 | 0.73 |
| 500 | 0.12 | 0.40 | 0.71 | 0.69 | 0.99 |
| 1000 | 0.33 | 0.71 | 0.97 | 0.98 | 0.99 |
| 2000 | 0.62 | 0.87 | 0.94 | 0.99 | 0.99 |
| 4000 | 0.81 | 0.86 | 0.81 | 0.97 | 0.99 |
| **αw** | **0.20(H)** | **0.45(L)** | **0.70** | **0.65** | **1.00** |
| **Klasse** | **E** | **D** | **C** | **C** | **A** |

### Room-dividers (tweezijdig)

| Hz | V6: 1×9mm | V7: 3×9mm 1el | V8: 3×9mm 2el | V9: 2×9+20Mét | V10: 2×9+40Mét |
|----|-----------|---------------|---------------|---------------|-----------------|
| 125 | 0.19 | 0.19 | 0.17 | 0.24 | 0.25 |
| 250 | 0.25 | 0.40 | 0.41 | 0.52 | 0.65 |
| 500 | 0.42 | 0.83 | 0.86 | 0.99 | 0.99 |
| 1000 | 0.71 | 0.93 | 0.91 | 0.99 | 0.99 |
| 2000 | 0.86 | 0.88 | 0.87 | 0.94 | 0.97 |
| 4000 | 0.86 | 0.82 | 0.79 | 0.89 | 0.93 |
| **αw** | **0.45(L)** | **0.70** | **0.70** | **0.85** | **0.90** |
| **Klasse** | **D** | **C** | **C** | **B** | **A** |

### Mélopée

"Mét" in de Peutz-tabel = Mélopée, een hoogwaardige akoestische wol. Dit is het materiaal dat in de Float acoustic zit (9mm PET-vilt + 40mm Mélopée = V5 constructie).

---

## 7. De Sabine-formule

```
RT60 = 0.161 × V / A
```

Waarbij:
- RT60 = nagalmtijd in seconden (tijd tot 60 dB afname)
- V = volume in m³
- A = totale equivalente absorptie in m² Sabine
- 0.161 = constante (afgeleid van geluidssnelheid en natuurlijk logaritme)

### Wanneer klopt Sabine?

De Sabine-formule is een vereenvoudiging die het beste werkt bij:
- Homogeen verdeelde absorptie (niet al het absorptiemateriaal op één plek)
- Diffuus geluidsveld (geluid komt van alle kanten)
- Ruimtes die niet extreem lang/smal zijn

De calculator begrenst RT60 op maximaal 6 seconden (MIN-functie) om onrealistische waarden bij zeer weinig absorptie te voorkomen.

### Alternatief: Eyring

Voor ruimtes met veel absorptie (gemiddelde α > 0.3) is de Eyring-formule nauwkeuriger. De calculator gebruikt bewust Sabine omdat het conservatiever is (geeft hogere RT60) en eenvoudiger uit te leggen.

---

## 8. Diffractie-bonus (+12%)

Hangende (pendant) akoestische producten krijgen een bonus van 12% op hun effectieve absorptie. Dit komt door drie fysische effecten:

1. **Randdiffractie** — geluid buigt om de randen van een hangend object, waardoor meer oppervlak effectief wordt bestreken
2. **Bronpositie** — een hangend product bevindt zich dichter bij de geluidsbron (sprekers) en in het diffuse veld
3. **Open vormen** — veel Lumenear producten hebben open, 3D-vormen die geluid van meerdere kanten opvangen

De factor 1.12 is conservatief. Sommige bronnen noemen 15-20% voor vrij hangende objecten. 12% is verdedigbaar richting akoestisch adviseurs.

**Wanneer GEEN diffractie:**
- Wall-mounted producten (Macaron wall, Column Wall): factor 1.00
- Floor standing (Pyknic, Twist Floor): factor 1.00
- Ceiling baffles (Bold): factor 1.00

---

## 9. Bronnen & validatie

### Primaire bronnen voor absorptiecoëfficiënten

| Bron | URL | Gebruik |
|------|-----|---------|
| **Acoustic.ua** | acoustic.ua/st/web_absorption_data_eng.pdf | Meest uitgebreide referentietabel. Gebruikt voor vrijwel alle materiaalwaarden |
| **Sengpiel Audio** | sengpielaudio.com/calculator-RT60.htm | Cross-validatie, extra datapoints. Bevestigt gipsplaat, glas, tapijt waarden |
| **Commercial Acoustics** | commercial-acoustics.com/absorption-coefficients | Derde bron voor kruisvalidatie |
| **Peutz** | Rapport A 3432-1-RA (17 mei 2018) | EN-ISO 354 testresultaten voor PET-vilt |
| **Lumenear catalogus 2026** | lumenear_2026_acoustic_data.csv | Productafmetingen, αw waarden, mounting types |

### Validatieproces (V3.4)

Elke α-waarde is gechecked tegen minimaal 2 van de 3 bronnen. De glas-mix waarden zijn berekend met gewogen gemiddelden op basis van de verhouding glas/gipsplaat. De Peutz-data is direct overgenomen uit het originele testrapport.

---

## 10. Versiegeschiedenis

| Versie | Datum | Belangrijkste wijzigingen |
|--------|-------|--------------------------|
| V1.0 | — | Eerste opzet, basis Sabine calculator |
| V2.0 | — | Productdata sheet, dropdown menus |
| V3.0 | — | 3 preset ruimtetypes, verbeterde layout |
| V3.1 | — | Compact layout, conservative defaults, 8 productrijen |
| V3.2 | — | +12% pendant diffractie-bonus, 7-level rating systeem |
| V3.3 | — | 10 plafond-opties, 10 wanden met glas-gradaties, 8 overige akoestiek niveaus |
| V3.4 | feb 2026 | Kritieke glas-correctie (spraak 0.08-0.09 → 0.03-0.05), parquet rename, brongebaseerde audit |
| V3.5 | feb 2026 | Cel-fixes (A14, A19), overige akoestiek teksten zonder meubel-overlap |
| **V4.0** | **feb 2026** | **12 wanden (gordijnen → overige, glazen systeemwand, akoestische wandpanelen), 12 overige akoestiek herkenbare situaties, D10 "← Richtlijn", 9 presets** |

### V4.0 changelog detail

**Wanden 10 → 12:**
- Verwijderd: "Weet ik niet" (is worst-case, gebruik "Beton/steen"), "Gordijnen (zwaar)" → verhuisd naar overige akoestiek
- Toegevoegd: "Tegels / natuursteen" (horeca, zorg), "Glazen systeemwand" (100% glas), "Zachte wandbekleding" (stof, α 0.30), "Akoestische wandpanelen" (PET-vilt/Rockwool, α 0.45)
- Hernoemd: glas-opties naar herkenbare kantoor-beschrijvingen

**Overige akoestiek 8 → 12:**
- Gordijnen zitten nu hier (dunne gordijnen, zware gordijnen, gordijnen + tapijten)
- Elk niveau beschrijft een herkenbare situatie
- Geen overlap met inrichting
- Max factor verhoogd van 0.15 naar 0.20

**Overig:**
- D10: "← Richtlijn" i.p.v. uitgeschreven preset-tekst
- Preset Retail: wanden = "Glazen systeemwand"
- Rating: 6 niveaus met tekstkleur conditional formatting

---

## 11. Bekende beperkingen & verbeterpunten

### Beperkingen van de methode

1. **Sabine is een vereenvoudiging** — werkt het beste bij homogeen verdeelde absorptie. In een ruimte met al het absorptiemateriaal aan één kant, kan de werkelijke nagalm anders zijn.
2. **Eén frequentie (spraakgemiddelde)** — de berekening toont alleen het gemiddelde bij 500/1k/2k Hz. Lage frequenties (bass, ventilatie) worden niet meegenomen.
3. **Oppervlaktes met ★ zijn geschat** — sommige productoppervlaktes zijn berekend op basis van geometrische afmetingen, niet uit de catalogus.
4. **Geen geometrische effecten** — flutter echo's, focussering door gebogen plafonds, of de positie van absorbers in de ruimte worden niet meegenomen.
5. **Luchtabsorptie niet meegenomen** — bij grote volumes (>500 m³) wordt luchtabsorptie relevant bij hoge frequenties.

### Mogelijke toekomstige verbeteringen

1. **Meer presets** — Bioscoop, theater, sporthal, kantine, studio
2. **Eyring-formule als optie** — voor ruimtes met veel absorptie (gemiddelde α > 0.3)
3. **Frequentie-analyse** — volledige 6-band berekening (125-4000 Hz) naast spraakgemiddelde
4. **Personen als absorptie** — bezetting toevoegen (0.5-0.8 m² Aeq per persoon)
5. **Visualisatie** — taartdiagram van absorptieverdeling (vloer/wand/plafond/Lumenear)
6. **PDF-export** — akoestisch rapport genereren

---

## 12. Onderhoudsinstructies

### Materiaal toevoegen of wijzigen

Alle materiaaldata zit in het sheet "Materiaaldata". Om een waarde te wijzigen:
1. Ga naar het juiste blok (Vloer, Wanden, Plafond, Inrichting, Overige)
2. Wijzig de α-waarden of factor
3. De spraak gem. kolom (H) moet handmatig herberekend worden: = (α500 + α1000 + α2000) / 3
4. De Calculator pikt de nieuwe waarden automatisch op via VLOOKUP

**Let op:** De dropdowns verwijzen naar vaste rijbereiken. Als je rijen toevoegt, moeten de Data Validation bereiken handmatig worden aangepast.

### Product toevoegen

1. Ga naar sheet "Productdata"
2. Voeg een rij toe onderaan (vóór de laatste rij in het bereik)
3. Vul in: Product naam, Familie, αw, Oppervlak, Bron, Spraak α, Diffractie (1.12 of 1.00), Aeq/stuk, Mounting
4. **Aeq/stuk = Oppervlak × Spraak α × Diffractie**
5. Pas de Data Validation range in Calculator aan als het bereik groter is geworden

### Preset toevoegen

1. Ga naar blok "RUIMTETYPE PRESETS" in Materiaaldata
2. Voeg een rij toe met exact dezelfde namen als in de dropdown-opties
3. Pas de Data Validation range van B10 in Calculator aan

### Dropdown-limieten

Excel Data Validation heeft een limiet van 255 tekens voor de bronlijst als je een komma-gescheiden lijst gebruikt. De huidige opties zitten dicht tegen die limiet:
- Wanden: 238 tekens ✓
- Overige: 230 tekens ✓
- Plafond: 229 tekens ✓

Bij het toevoegen van opties, houd namen kort.

---

## 13. Alle formules (Excel-syntax)

### Ruimte

```
E5 = B5 * B6 * B7                          (volume)
E6 = B5 * B6                                (vloeropp)
E7 = B5 * B6                                (plafondopp)
E8 = 2*(B5*B7) + 2*(B6*B7)                  (wandopp)
```

### Preset & norm

```
C10 = IF(B10="(zelf invullen)", "", VLOOKUP(B10, Materiaaldata!A71:G79, 7, FALSE))
D10 = IF(B10="(zelf invullen)", "", "← Richtlijn")
```

### Materiaal absorptie

```
C13 = IF(D13<>"", D13, VLOOKUP(B13, Materiaaldata!A6:H11, 8, FALSE) * E6)
C14 = IF(D14<>"", D14, VLOOKUP(B14, Materiaaldata!A15:H26, 8, FALSE) * E8)
C15 = IF(D15<>"", D15, VLOOKUP(B15, Materiaaldata!A30:H39, 8, FALSE) * E7)
C16 = IF(D16<>"", D16, VLOOKUP(B16, Materiaaldata!A43:B52, 2, FALSE) * E6)
C17 = IF(D17<>"", D17, VLOOKUP(B17, Materiaaldata!A56:B67, 2, FALSE) * E6)
```

### Aanbevolen (uit preset)

```
E13 = IF(B10="(zelf invullen)", "", VLOOKUP(B10, Materiaaldata!A71:G79, 2, FALSE))
E14 = IF(B10="(zelf invullen)", "", VLOOKUP(B10, Materiaaldata!A71:G79, 3, FALSE))
E15 = IF(B10="(zelf invullen)", "", VLOOKUP(B10, Materiaaldata!A71:G79, 4, FALSE))
E16 = IF(B10="(zelf invullen)", "", VLOOKUP(B10, Materiaaldata!A71:G79, 5, FALSE))
E17 = IF(B10="(zelf invullen)", "", VLOOKUP(B10, Materiaaldata!A71:G79, 6, FALSE))
```

### Product lookups (rij 21-26, hier voorbeeld rij 21)

```
C21 = IF(A21="", "", INDEX(Productdata!D5:D93, MATCH(A21, Productdata!A5:A93, 0)))
D21 = IF(A21="", "", INDEX(Productdata!C5:C93, MATCH(A21, Productdata!A5:A93, 0)))
E21 = IF(A21="", "", INDEX(Productdata!F5:F93, MATCH(A21, Productdata!A5:A93, 0)))
F21 = IF(OR(A21="", B21=""), 0, B21 * INDEX(Productdata!H5:H93, MATCH(A21, Productdata!A5:A93, 0)))
```

### Resultaat

```
B29 = C13 + C14 + C15 + C16 + C17
B30 = SUM(F21:F26)
B32 = IF(B29<=0, "n.v.t.", MIN(0.161*E5/B29, 6))
B33 = IF((B29+B30)<=0, "n.v.t.", MIN(0.161*E5/(B29+B30), 6))
B34 = IF(OR(B32="n.v.t.", B33="n.v.t."), "", 1 - B33/B32)
```

### Rating

```
A35 = IF(B33="n.v.t.", "",
  IF(B33 <= IF(C10="",0.8,C10),
    "⭐ Uitstekend - Perfecte spraakverstaanbaarheid",
  IF(B33 <= IF(C10="",0.8,C10)*1.15,
    "✔️ Prima - Vaak werkbaar",
  IF(B33 <= IF(C10="",0.8,C10)*1.3,
    "⚠️ Redelijk - Lichte nagalm, ruimte voor optimalisatie",
  IF(B33 <= IF(C10="",0.8,C10)*1.6,
    "🟠 Matig - Norm overschreden, extra absorptie geadviseerd",
  IF(B33 <= IF(C10="",0.8,C10)*2,
    "🔴 Onvoldoende - Storende nagalm, actie vereist",
    "🔴 Zeer slecht - Akoestisch onwerkbaar"))))))
```

### Preset beschrijving

```
A36 = IF(B10="(zelf invullen)",
  "Gekozen: zelf invullen -> richtlijn norm = handmatig",
  "Gekozen: " & LOWER(B10) & " -> richtlijn norm = " & VLOOKUP(B10, Materiaaldata!A71:G79, 7, FALSE) & "s")
```

### Grafiek data

```
I2 = B32    (RT60 zonder)
I3 = B33    (RT60 met)
```

---

> **Laatste update:** februari 2026
> **Gebouwd met:** Python (openpyxl), gevalideerd tegen acoustic.ua, Sengpiel Audio, Peutz EN-ISO 354
> **Contact:** Falco @ Lumenear
