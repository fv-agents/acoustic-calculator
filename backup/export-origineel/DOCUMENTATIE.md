# Lumenear Akoestische Calculator — Volledige Documentatie

> Versie: 4.4 (dashboard-editie)  
> Gemaakt door: Claude (Anthropic) in samenwerking met Falco Vile  
> Datum: juni 2026  
> Doel: Verkooptool voor architecten en projectontwikkelaars

---

## 1. Wat is dit?

De Lumenear Akoestische Calculator is een interactief webdashboard waarmee architecten, interieurontwerpers en verkoopmedewerkers snel en visueel kunnen berekenen wat Lumenear armaturen bijdragen aan de akoestiek van een ruimte.

Het is **één enkel HTML-bestand** — geen server, geen database, geen installatie. Open het in een browser en het werkt meteen. De gehele calculatie, interface en data zitten ingebakken in dat ene bestand.

### Doel in de praktijk

Een architect of aannemer vult in:
- Ruimteafmetingen en -type
- Welke materialen er in de ruimte zijn
- Welke Lumenear armaturen overwogen worden

De calculator toont dan live:
- De nagalmtijd **zonder** en **met** Lumenear
- Hoeveel procent verbetering dat oplevert
- Of de ruimte voldoet aan de akoestische norm
- De verwachte spraakverstaanbaarheid (STI)

---

## 2. De lay-out in detail

### 2.1 Globale structuur

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (zwart)                                    [Export][Import]│
├─────────────────────────────────────────────────────────────────┤
│  TOPBAR: [3D kamer]  RT60 zonder  RT60 met  Verbetering  Norm   ●│
├──────────────┬──────────────────────────────┬───────────────────┤
│  LINKER      │  MIDDEN PANEEL               │  RECHTER          │
│  PANEEL      │  Producten selecteren        │  PANEEL           │
│  (25%)       │  (45%)                       │  (30%)            │
│              │                              │                   │
│  Ruimte      │  [Familie-tabs]              │  Geselecteerde    │
│  - Type      │  ┌──────┐ ┌──────┐          │  producten        │
│  - L / B / H │  │ prod │ │ prod │          │                   │
│              │  └──────┘ └──────┘          │  RT60 vergelijk.  │
│  Materialen  │  ┌──────┐ ┌──────┐          │                   │
│  - Vloer     │  │ prod │ │ prod │          │  Absorptie-       │
│  - Wanden    │  └──────┘ └──────┘          │  verdeling +      │
│  - Plafond   │  ...                        │  technische       │
│              │                              │  parameters       │
│  Inrichting  │                              │                   │
│  - Meubels   │                              │  STI indicator    │
│  - Extra     │                              │                   │
└──────────────┴──────────────────────────────┴───────────────────┘
```

### 2.2 Header (zwarte balk, 52px hoog)

- **Links**: Logo "Lumenear" + subtitel "Acoustic Calculator"
- **Midden**: Projectnaam-invoerveld (bewerkbaar, inline)
- **Rechts**: Export-knop (teal) + Import-knop (grijs omlijnd)

### 2.3 Topbar (witte statusbalk, ~54px hoog)

Dit is de **primaire uitkomstbalk** — altijd zichtbaar, altijd actueel.

| Element | Inhoud |
|---|---|
| 3D kamer | Isometrische SVG-visualisatie van de ruimte met L/B/H labels |
| RT60 zonder | Nagalmtijd van de ruimte zonder Lumenear (grijs) |
| RT60 met Lumenear | Nagalmtijd na toevoeging van geselecteerde producten (teal) |
| Verbetering | Procentuele daling in nagalmtijd (groen) |
| Norm | Doelwaarde voor het geselecteerde ruimtetype |
| Rating pill | Gekleurde badge: Uitstekend / Prima / Redelijk / Matig / Onvoldoende / Zeer slecht |

### 2.4 Linkerpaneel (25% breedte)

Drie secties, gescheiden door dunne lijnen:

**Ruimte:**
- Dropdown "Type" → kiest een preset (vult materialen + norm automatisch in)
- Drie tekstinvulvelden L / B / H (in meters, decimaal met komma of punt)
- Info-regel: berekend volume m³, vloeroppervlak m², wandoppervlak m²

**Materialen:**
- Vloer (6 opties)
- Wanden (12 opties)
- Plafond (10 opties)

**Inrichting:**
- Meubilering (10 opties met absorptiefactor per m² vloer)
- Extra akoestiek (12 opties: van niks t/m compleet akoestisch pakket)

### 2.5 Middenpaneel (45% breedte)

Het grootste paneel, volledig scrolvbaar.

- **Koptekst**: "Producten selecteren" + teller (X producten, Y geselecteerd)
- **Familietabs**: filterknopjes per productfamilie (Nova, Float, Halo, Cloud, etc.)
- **Productgrid**: 2 kolommen, elke kaart bevat:
  - Productnaam + familiebadge
  - αw (gewogen absorptiecoëfficiënt), oppervlak in m², **Aeq** (equiv. absorptieoppervlak)
  - Hoeveelheidsregelaar [−] [n] [+]
  - Kaart krijgt teal achtergrond als er ≥1 stuk geselecteerd is

### 2.6 Rechterpaneel (30% breedte)

Van boven naar beneden:

1. **Geselecteerde producten** (alleen zichtbaar als er iets geselecteerd is)
   - Per product: naam, totale Aeq, [−][n][+][×]-knoppen voor aanpassen/verwijderen
   - Totaalregel in teal

2. **RT60 vergelijking** — staafdiagram met 3 staven: Zonder / Met Lumenear / Norm

3. **Absorptie verdeling** — taartdiagram per bijdragecategorie + 4 technische parameters:
   - Totale absorptie (m² Aeq)
   - Geluidsverval (dB/s)
   - Gem. absorptiecoëfficiënt (α)
   - V/A verhouding (m)

4. **Spraakverstaanbaarheid (STI)** — voortgangsbalk met kleurcodering + ISO-richtwaarden

5. **Technische voetnoot** — formule, normen, testmethodiek

---

## 3. De berekening achter de calculator

### 3.1 Sabine-formule

De kern van de hele berekening:

```
T₆₀ = 0.161 × V / A
```

Waarbij:
- `T₆₀` = nagalmtijd in seconden (tijd tot geluidsenergie 60 dB daalt)
- `V` = ruimtevolume in m³ (= L × B × H)
- `A` = totale equivalente absorptie in m² (sabins)
- `0.161` = constante afgeleid van geluidssnelheid in lucht bij kamertemperatuur

In code (met veiligheidsclamp op 6 seconden max):
```js
const T60 = Math.min(0.161 * V / Math.max(A, 0.01), 6)
```

### 3.2 Ruimteabsorptie berekenen (A_ruimte)

```
A_ruimte = (α_vloer × S_vloer)
         + (α_wand × S_wanden)
         + (α_plafond × S_plafond)
         + (factor_meubels × S_vloer)
         + (factor_extra × S_vloer)
```

Oppervlakken:
- Vloer = L × B
- Wanden = 2×(L×H) + 2×(B×H)
- Plafond = L × B (= vloer)

De meubel- en extra-factor wordt vermenigvuldigd met het vloeroppervlak, omdat die elementen verspreid over de ruimte staan en hun bijdrage daarmee evenredig is.

### 3.3 Lumenear productabsorptie berekenen (A_lumenear)

```
A_lumenear = Σ (aantal_i × Aeq_i)
```

Per geselecteerd product: hoeveelheid × equivalent absorptieoppervlak (Aeq) per armatuur.

**Aeq** is de sleutelwaarde per product. Deze is bepaald via laboratoriumtest conform **ISO 354** (geluidsmeting in nagalmkamer). De Aeq is doorgaans hoger dan het fysieke oppervlak van het armatuur, omdat de vorm en randeffecten de absorptie versterken.

### 3.4 Totale absorptie

```
A_totaal = A_ruimte + A_lumenear
T60_met = 0.161 × V / A_totaal
```

### 3.5 Verbetering berekenen

```
Verbetering (%) = (1 - T60_met / T60_zonder) × 100
```

### 3.6 Rating berekening (gekleurde pill)

Op basis van de verhouding `T60_met / T_norm`:

| Ratio | Oordeel |
|---|---|
| ≤ 1.0 | Uitstekend (groen) |
| ≤ 1.15 | Prima (licht groen) |
| ≤ 1.30 | Redelijk (amber) |
| ≤ 1.60 | Matig (oranje) |
| ≤ 2.00 | Onvoldoende (rood) |
| > 2.00 | Zeer slecht (donkerrood) |

### 3.7 STI-schatting (Speech Transmission Index)

De STI is een vereenvoudigde schatting op basis van de nagalmtijd. ISO 3382-3 richtwaarden:

| T₆₀ met Lumenear | STI klasse | Kleur |
|---|---|---|
| ≤ 0.4s | Uitstekend (> 0.75) | Groen |
| ≤ 0.6s | Goed (0.60–0.75) | Licht groen |
| ≤ 0.8s | Redelijk (0.45–0.60) | Amber |
| ≤ 1.2s | Matig (0.30–0.45) | Oranje |
| > 1.2s | Slecht (< 0.30) | Rood |

### 3.8 Technische parameters

| Parameter | Formule | Betekenis |
|---|---|---|
| Totale absorptie | A_ruimte + A_lumenear | Totaal equivalent absorptieoppervlak |
| Geluidsverval | 60 / T60 | Hoe snel daalt geluid in dB per seconde |
| Gem. absorptiecoëff. | A_totaal / (2×vloer + wanden) | Gemiddelde α over alle oppervlakken |
| V/A verhouding | Ruimtevolume / A_totaal | Hogere waarde = meer nagalmproblemen |

---

## 4. De data

### 4.1 Vloermaterialen (FLOOR)

| Materiaal | αw (500–2000 Hz) |
|---|---|
| Weet ik niet | 0.02 |
| Harde vloer (beton/tegels) | 0.02 |
| Linoleum / vinyl / PVC | 0.04 |
| Parquet / laminaat | 0.06 |
| Dun tapijt | 0.37 |
| Dik tapijt (+ ondervloer) | 0.66 |

### 4.2 Wandmaterialen (WALL)

| Materiaal | αw |
|---|---|
| Beton / steen | 0.02 |
| Tegels / natuursteen | 0.01 |
| Stucwerk | 0.04 |
| Gipsplaat (standaard) | 0.05 |
| Gipsplaat + isolatie | 0.07 |
| Houten panelen | 0.08 |
| Gips + weinig glas (~25%) | 0.05 |
| Gips + veel glas (~50%) | 0.05 |
| Overwegend glas (~75%) | 0.03 |
| Glazen systeemwand | 0.03 |
| Zachte wandbekleding | 0.30 |
| Akoestische wandpanelen | 0.45 |

### 4.3 Plafondmaterialen (CEIL)

| Materiaal | αw |
|---|---|
| Weet ik niet | 0.02 |
| Betonplafond | 0.02 |
| Gipsplafond (dicht) | 0.05 |
| Houten plafond | 0.08 |
| Metalen plafond (dicht) | 0.06 |
| Metalen plafond (geperforeerd) | 0.48 |
| Open plafond (installaties) | 0.06 |
| Systeemplafond (oud/dun) | 0.42 |
| Systeemplafond (standaard) | 0.65 |
| Systeemplafond (hoog absorberend) | 0.92 |

### 4.4 Meubilair absorptiefactoren (FURN — per m² vloer)

| Type | Factor |
|---|---|
| Weet ik niet | 0.005 |
| Leeg / weinig meubels | 0.005 |
| Kantoor - bureaus+stoelen | 0.08 |
| Kantoor - volledig ingericht | 0.10 |
| Vergaderruimte | 0.06 |
| Restaurant / horeca | 0.05 |
| Lounge / gestoffeerd | 0.12 |
| Retail / winkel | 0.03 |
| Onderwijs / school | 0.06 |
| Zorg / medisch | 0.04 |

### 4.5 Extra akoestische maatregelen (EX — per m² vloer)

| Optie | Factor |
|---|---|
| 1. Niks extra | 0 |
| 2. Alleen planten | 0.01 |
| 3. Dunne gordijnen | 0.02 |
| 4. Losse tapijten | 0.03 |
| 5. Raamdecoratie | 0.04 |
| 6. Zware gordijnen | 0.05 |
| 7. Bureauschermen | 0.06 |
| 8. Gordijnen + tapijten | 0.07 |
| 9. Schermen + gordijnen | 0.09 |
| 10. Schermen + panelen | 0.11 |
| 11. Roomdividers + schermen | 0.14 |
| 12. Compleet pakket | 0.20 |

### 4.6 Ruimtepresets (PR)

Elke preset stelt automatisch vloer, wand, plafond, meubels en extra akoestiek in, én de bijbehorende doelnorm voor T₆₀.

| Preset | Norm T₆₀ |
|---|---|
| (zelf invullen) | 0.8s |
| Kantoor (open plan) | 0.6s |
| Kantoor (celkantoor) | 0.8s |
| Vergaderruimte | 0.6s |
| Restaurant / cafe | 1.0s |
| Lobby / receptie | 1.0s |
| Klaslokaal | 0.8s |
| Zorginstelling | 0.8s |
| Retail / winkel | 1.0s |

### 4.7 Productdata (PP — 89 producten)

Elke productrecord bevat:

```js
{
  n: "Float acoustic Rectangle 1200x2400",  // Naam
  f: "Float",                                // Familie
  aw: 0.9,                                   // Gewogen absorptiecoëfficiënt
  a: 5.76,                                   // Fysiek oppervlak (m²)
  eq: 6.32                                   // Aeq (m²) — de sleutelwaarde
}
```

Productfamilies aanwezig: **Nova, Toad, Float, Blaze, Halo, Line, Breeze, Orbit, Column, Wing, Cloud, Cone, Sliced, Bold, Twist, Macaron, Blooom, Edge, JoJo, Drop, Cage, Podge, Spott, Pyknic**

Bron: Peutz laboratoriumtestdata (ISO 354, nagalmkamermeting).

---

## 5. Technische opbouw

### 5.1 Stack

| Onderdeel | Keuze | Reden |
|---|---|---|
| UI-framework | **React 18** (UMD CDN) | Reactieve state zonder buildstap |
| JSX transpiler | **Babel Standalone** (CDN) | In-browser compilatie, geen Node.js nodig |
| Styling | **Inline CSS** met CSS custom properties | Geen Tailwind/Bootstrap nodig, geen CDN-afhankelijkheid |
| Grafieken | **Custom SVG** (Bars + Pie componenten) | Recharts gaf CDN-problemen, eigen implementatie is lichter |
| Font | **Inter** via Google Fonts CDN | Professioneel, goed leesbaar |
| Opslag | **Browser FileReader API** | JSON export/import voor projectopslag |

### 5.2 React-componenten

```
App                    ← Hoofdcomponent, beheert alle state
├── IsoRoom            ← Isometrische 3D kamervisualisatie (SVG)
├── Bars               ← RT60 staafdiagram (custom SVG)
└── Pie                ← Absorptieverdeling taartdiagram (custom SVG)
```

### 5.3 State-variabelen in App

```js
pn        // Projectnaam (string)
l, w, h   // Afmetingen in meters (number)
ls, ws, hs // Weergavetekst voor afmetingsvelden (string, voor komma-ondersteuning)
rt        // Ruimtetype/preset (string)
fm        // Vloermateriaal (string)
wm        // Wandmateriaal (string)
cm        // Plafondmateriaal (string)
fu        // Meubilair type (string)
ex        // Extra akoestiek optie (string)
qty       // Object {productnaam: hoeveelheid} voor geselecteerde producten
fam       // Actieve productfamiliefilter (string)
```

### 5.4 useMemo berekening

Alle berekeningen zitten in één `useMemo`-blok dat herberekent zodra één van de inputs wijzigt. Output:

```js
{
  vol,          // Volume m³
  fA, wA, cA,  // Oppervlakken m²
  rAb,          // Ruimteabsorptie (sabins)
  lAb,          // Lumenear absorptie (sabins)
  r0,           // T60 zonder Lumenear
  r1,           // T60 met Lumenear
  imp,          // Verbetering %
  tgt,          // Doelwaarde T60
  bd            // Absorptie per categorie (voor taartdiagram)
}
```

### 5.5 IsoRoom — isometrische projectie

Gebruikt standaard 30° isometrische projectie:

```js
const proj = (px, py, pz) => [
  cx + (px - py) * cos30 * s,   // scherm-x
  cy - (px + py) * sin30 * s - pz * s  // scherm-y
]
```

8 hoekpunten van de rechthoekige ruimte worden geprojecteerd. Drie vlakken worden getekend (vloer, linkerwand, rechterwand) plus gestippelde plafondranden.

### 5.6 Export/Import (JSON)

Export-formaat:
```json
{
  "projectName": "Kantoor Amsterdam",
  "room": { "length": 12, "width": 8, "height": 3, "roomType": "Kantoor (open plan)" },
  "materials": { "fm": "Linoleum / vinyl / PVC", "wm": "Gipsplaat + isolatie", "cm": "Systeemplafond (standaard)", "fu": "Kantoor - bureaus+stoelen", "ex": "7. Bureauschermen" },
  "products": [
    { "name": "Float acoustic Rectangle 1200x2400", "qty": 5, "aeq": 6.32 }
  ],
  "results": { "rt60Without": 0.53, "rt60With": 0.38, "improvement": 28.3, "target": 0.6 }
}
```

---

## 6. Kleurenschema & design

### Primaire kleuren

```
Zwart:  #0a0a0a  — header achtergrond
Wit:    #ffffff  — paneel achtergronden
Teal:   #0d9488  — accentkleur, knoppen, teal data
Groen:  #16a34a  — positieve ratings
Amber:  #f59e0b  — waarschuwing / norm-indicator
Oranje: #f97316  — negatief (matig)
Rood:   #ef4444  — slecht
```

### Grijsschaal

```
--g50 t/m --g800  (8 tinten, van bijna-wit tot bijna-zwart)
```

### Design-principes

1. **Minimalistisch** — weinig visueel lawaai, alles heeft een doel
2. **Data first** — getallen zijn groot en prominent
3. **Live feedback** — alles herberekent instantaan
4. **Professioneel** — Inter font, subtiele schaduwen, consistent afgeronde hoeken
5. **Lumenear stijl** — teal als merkkleur, zwarte header

---

## 7. Gebruik van de calculator

### Stap 1: Ruimte definiëren
Kies een ruimtetype (preset) of vul handmatig L/B/H in. De materiaaldrops worden automatisch gevuld door de preset. Pas ze aan als de werkelijke situatie afwijkt.

### Stap 2: Materialen aanpassen
Controleer of vloer, wanden, plafond kloppen met de werkelijke situatie. Dit heeft de grootste invloed op de beginsituatie.

### Stap 3: Inrichting invullen
Kies meubilering en extra akoestische maatregelen die al aanwezig zijn (of gepland). Dit is de "nulsituatie" vóór Lumenear.

### Stap 4: Lumenear producten selecteren
Filter op familie, bekijk de Aeq-waarden en verhoog de hoeveelheid. De topbar update live. Je ziet direct wat het effect is.

### Stap 5: Resultaten beoordelen
- Rating pill: is de doelnorm gehaald?
- Verbetering %: hoe groot is de impact van Lumenear?
- STI: is de spraakverstaanbaarheid acceptabel?
- Technische parameters: voor onderbouwing naar klant/opdrachtgever

### Stap 6: Opslaan/delen
Gebruik Export om een JSON-bestand op te slaan. Dit is deelbaar met collega's die de calculator ook gebruiken (via Import).

---

## 8. Deployment

### Lokaal gebruiken
Dubbelklik op het HTML-bestand → opent in browser. Werkt offline (behalve Inter-font laad van Google).

### Netlify
Het bestand staat al op Netlify. Bij elke update:
1. Ga naar app.netlify.com → jouw site
2. Sleep het nieuwe HTML-bestand naar "Deploys"
3. Netlify vervangt de oude versie automatisch

### WordPress inbedden
Zie `DEPLOYMENT.md` voor volledige stap-voor-stap handleiding met iframe-code.

---

## 9. Bekende beperkingen

1. **Sabine is een benadering** — werkt goed voor gemiddeld absorberende ruimten. In zeer droge of zeer natte ruimten zijn uitgebreidere modellen (Eyring, Millington) nauwkeuriger.

2. **Geen frequentiebandsplitsing** — de berekening werkt op spraakgemiddelde (500–2000 Hz). In de praktijk verschilt gedrag sterk per frequentieband.

3. **Geen diffusie** — de positie van armaturen in de ruimte telt niet mee. Bij clustering van producten kan de werkelijke bijdrage lager zijn.

4. **Meubels als uniforme factor** — meubilering wordt als oppervlaktefactor behandeld, niet als individuele objecten.

5. **STI is een schatting** — de echte STI vereist ook het omgevingsgeluidsniveau (SNR) en spectrumanalyse. De weergegeven waarde is indicatief.

6. **Vereist internetverbinding** voor Inter-font en de React/Babel CDN-scripts. Volledig offline werken vereist de scripts lokaal inbedden (zie verbeterpunten).
