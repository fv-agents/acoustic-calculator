# Rekenvoorbeeld — Stap voor Stap

Ter illustratie: een concrete berekening doorlopen zoals de calculator dat doet.

---

## Situatie: Vergaderruimte 8×6×2.8m

**Ruimteparameters:**
- Lengte: 8m
- Breedte: 6m
- Hoogte: 2.8m

**Stap 1: Oppervlakken berekenen**
```
Vloer  = 8 × 6 = 48 m²
Wanden = 2×(8×2.8) + 2×(6×2.8) = 44.8 + 33.6 = 78.4 m²
Plafond = 8 × 6 = 48 m²
Volume = 8 × 6 × 2.8 = 134.4 m³
```

**Stap 2: Absorptie per component berekenen**

Met preset "Vergaderruimte":
- Vloer: Dun tapijt (αw = 0.37)
- Wanden: Gipsplaat + isolatie (αw = 0.07)
- Plafond: Gipsplafond dicht (αw = 0.05)
- Meubels: Vergaderruimte (factor = 0.06)
- Extra: Losse tapijten (factor = 0.03)

```
A_vloer   = 0.37 × 48  = 17.76 m²
A_wanden  = 0.07 × 78.4 = 5.49 m²
A_plafond = 0.05 × 48  = 2.40 m²
A_meubels = 0.06 × 48  = 2.88 m²
A_extra   = 0.03 × 48  = 1.44 m²

A_ruimte  = 17.76 + 5.49 + 2.40 + 2.88 + 1.44 = 29.97 m²
```

**Stap 3: T60 zonder Lumenear**
```
T60 = 0.161 × 134.4 / 29.97 = 21.64 / 29.97 = 0.72 seconden
```

**Stap 4: Lumenear producten toevoegen**

Stel: 4× Float acoustic Rectangle 1200×2400 (Aeq = 6.32 m²/stuk)

```
A_lumenear = 4 × 6.32 = 25.28 m²
A_totaal   = 29.97 + 25.28 = 55.25 m²
```

**Stap 5: T60 met Lumenear**
```
T60_met = 0.161 × 134.4 / 55.25 = 21.64 / 55.25 = 0.39 seconden
```

**Stap 6: Verbetering**
```
Verbetering = (1 - 0.39/0.72) × 100 = 45.8%
```

**Stap 7: Normtoetsing (doelwaarde vergaderruimte = 0.6s)**
```
Ratio = 0.39 / 0.60 = 0.65 → ≤ 1.0 → Rating: UITSTEKEND ✓
```

**Conclusie:**
Met 4 Float acoustic Rectangle armaturen daalt de nagalmtijd van 0.72s naar 0.39s — ruim onder de norm van 0.6s voor vergaderruimten. Verbetering: 46%.
