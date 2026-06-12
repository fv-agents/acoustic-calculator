# Rekenvoorbeeld — Stap voor Stap

_Bijgewerkt: 2026-06-12 (materialenset v5.1)_

Ter illustratie: een concrete berekening zoals de calculator die uitvoert.

---

## Situatie: Vergaderruimte 8 × 6 × 2,8 m

**Stap 1: Oppervlakken**
```
Vloer   = 8 × 6 = 48 m²
Wanden  = 2×(8×2,8) + 2×(6×2,8) = 44,8 + 33,6 = 78,4 m²
Plafond = 48 m²
Volume  = 134,4 m³
```

**Stap 2: Absorptie per component** (preset "Vergaderruimte")

- Vloer: Tapijttegels (kantoor), α = 0,15
- Wanden: Gipsplaat + isolatie, α = 0,07
- Plafond: Gipsplafond (dicht), α = 0,05
- Meubilering: Normaal gemeubileerd met stoffering, factor = 0,08
- Extra akoestiek: geen

```
A_vloer   = 0,15 × 48   = 7,20 m²
A_wanden  = 0,07 × 78,4 = 5,49 m²
A_plafond = 0,05 × 48   = 2,40 m²
A_meubels = 0,08 × 48   = 3,84 m²
A_ruimte  = 18,93 m²  (onbezet)
```

**Stap 3: T60 zonder Lumenear (onbezet)**
```
T60 = 0,161 × 134,4 / 18,93 = 1,14 s
```

**Stap 4: Bezetting meenemen (optioneel)**

6 personen × 0,46 m² Sabine = 2,76 m² extra:
```
T60_bezet = 0,161 × 134,4 / 21,69 = 1,00 s
```
De calculator rekent met het opgegeven aantal personen; 0 = onbezet (worst-case).

**Stap 5: Lumenear toevoegen** — 4× Float acoustic Rectangle 1200×2400 (Aeq = 6,32 m²/stuk)
```
A_lumenear = 4 × 6,32 = 25,28 m²
A_totaal   = 18,93 + 25,28 = 44,21 m²   (onbezet)
T60_met    = 0,161 × 134,4 / 44,21 = 0,49 s
```

**Stap 6: Verbetering**
```
(1 − 0,49 / 1,14) × 100 = 57%
```

**Stap 7: Normtoetsing** (richtwaarde vergaderruimte = 0,6 s, indicatief)
```
0,49 / 0,60 = 0,82 → ≤ 1,0 → Rating: UITSTEKEND ✓
```

**Conclusie:** met 4 Float acoustic Rectangle armaturen daalt de nagalmtijd van 1,14 s naar 0,49 s — ruim onder de richtwaarde van 0,6 s. Bezet (6 personen) wordt dat 1,00 s → 0,46 s.
