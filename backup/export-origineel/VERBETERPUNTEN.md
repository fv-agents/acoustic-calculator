# Verbeterpunten & Roadmap — Lumenear Calculator

> Prioriteit: ⭐ = Nice to have · ⭐⭐ = Waardevol · ⭐⭐⭐ = Hoge impact

---

## Functionaliteit

### ⭐⭐⭐ PDF-rapport genereren
**Idee**: Knop "Download Rapport" genereert een professionele PDF met:
- Projectgegevens (naam, datum, architect)
- Ruimtespecificaties
- Overzicht geselecteerde armaturen
- RT60 voor/na vergelijking
- Conclusie en aanbeveling
- Lumenear branding

**Impact**: Enorm waardevol als verkooptool — direct deelbaar met opdrachtgevers en architecten. Geeft het gevoel van een professioneel adviesrapport.

**Techniek**: `jsPDF` of `html2canvas` + print-stylesheet. Of server-side PDF via API.

---

### ⭐⭐⭐ Meerdere ruimten per project
**Idee**: Een project kan meerdere ruimten bevatten (verdieping 1: vergaderruimte, open kantoor, kantine). Totaaloverzicht per project met gecombineerde bestellijst.

**Impact**: Groot voor projectaanbiedingen. Architecten werken zelden met één ruimte.

---

### ⭐⭐⭐ NEN 18041 categoriebeoordeling
**Idee**: Naast de huidige generieke normwaarden, de volledige NEN 18041 (Nederlandse norm voor akoestiek in gebouwen) integreren met:
- Categorie A / B / C classificatie
- Bezettingsgraad invloed
- Certificaat-waardige output

**Impact**: Architecten en aannemers moeten aan NEN 18041 voldoen — dit maakt de tool officieel bruikbaar in specificaties.

---

### ⭐⭐⭐ Offline werken (self-contained)
**Idee**: React, Babel en Inter-font inbakken in het HTML-bestand zodat er geen CDN-verbinding nodig is. Het bestand wordt dan ~2MB maar werkt volledig offline.

**Impact**: Hoog voor gebruik op beurzen, in slecht-verbonden panden, of op laptops zonder wifi.

**Techniek**: Bundel React/ReactDOM/Babel als base64 of inline script. Inter-font als base64 `@font-face`.

---

### ⭐⭐ Frequentieband-analyse (125–4000 Hz)
**Idee**: In plaats van één spraakgemiddelde αw, per octaafband de absorptie berekenen en RT60 per band tonen. Grafieken per frequentie.

**Impact**: Technisch veel accurater. Relevant voor auditoria, muziekzalen, klaslokalen.

**Complexiteit**: Vereist uitgebreidere productdata (α per band) en extra UI-ruimte.

---

### ⭐⭐ Meerdere projecten opslaan (localStorage)
**Idee**: Browser onthouden meerdere opgeslagen projecten via `localStorage`. Projectlijst met namen en aanmaakdatum. Snel wisselen tussen projecten.

**Techniek**: `JSON.stringify` opslaan in `localStorage['lumenear_projects']`.

---

### ⭐⭐ Productafbeeldingen tonen
**Idee**: Per productkaart een miniatuur foto van het armatuur inladen (vanuit CDN of Lumenear website).

**Impact**: Visueel veel sterker, helpt verkopers en klanten bij herkenning.

**Techniek**: URL-mapping per productnaam, `<img>` tag in productkaart.

---

### ⭐⭐ Klant-facing "light mode" / presentatiemodus
**Idee**: Een vereenvoudigde weergave zonder technische details, alleen:
- 3D kamer groot
- RT60 voor/na groot
- Rating groot
- Productenlijst
- "Verstuur dit overzicht" knop

**Impact**: Bruikbaar om direct aan een klant in een vergadering te laten zien zonder verwarring over technische getallen.

---

### ⭐⭐ Ruimtevorm aanpassen (niet-rechthoekig)
**Idee**: Naast rechthoek ook L-vormige ruimten of ruimten met schuine wanden definiëren via oppervlak-invoer in plaats van L×B.

---

### ⭐ Spraakclarity C50 / D50 berekening
**Idee**: Naast STI ook de clarity-index C50 toevoegen. C50 = verhouding vroege (< 50ms) vs late geluidenergie. Relevant voor conferentiezalen en auditoriums.

**Formule (benadering)**: C50 ≈ 10 × log10(1/(0.04 × V/A) - 1) dB

---

### ⭐ Vergelijkingsmodus (twee configuraties naast elkaar)
**Idee**: Twee setups naast elkaar vergelijken. Links: optie A (Float acoustic), rechts: optie B (Halo acoustic). Kosten- en akoestiekvergelijking.

---

### ⭐ Aanbevolen producten (auto-suggest)
**Idee**: Op basis van ruimtegrootte en huidige RT60 automatisch de meest effectieve Lumenear producten suggereren om de doelnorm te halen. "Om uw vergaderruimte op 0.6s te brengen, heeft u minimaal nodig: 4× Float acoustic Rectangle 1200×2400."

---

### ⭐ Meerdere talen (EN/NL/DE)
**Idee**: Taalswitch bovenin voor internationaliserung. Engels is minimumvereiste voor internationale klanten.

---

## Design & UX

### ⭐⭐⭐ Mobiele weergave
**Idee**: Momenteel geoptimaliseerd voor desktop (1440px+). Een mobile-first variant of een responsive layout voor tablets.

**Impact**: Bruikbaar op iPad tijdens een site-bezoek.

---

### ⭐⭐ Animaties bij productselectie
**Idee**: Wanneer een product geselecteerd wordt, een subtiele animatie in de topbar tonen die de RT60 ziet dalen. Maakt de impact tastbaarder.

---

### ⭐⭐ Donkere modus (dark mode)
**Idee**: CSS variabelen zijn al voorbereid voor theming. Dark mode toevoegen voor presentatie in donkere ruimten.

---

### ⭐ Productkaart uitklappen
**Idee**: Klik op een productkaart voor een uitgebreide weergave: productfoto, volledige specificaties, downloadlink datasheet, link naar lumenear.com productpagina.

---

### ⭐ Tooltips bij technische termen
**Idee**: Hover over "αw", "Aeq", "STI", "T₆₀" → korte uitleg in tooltip. Maakt de tool toegankelijker voor niet-akoestisch geschoolde gebruikers.

---

## Integratie & Techniek

### ⭐⭐⭐ Live productkoppeling via API
**Idee**: Productdata live ophalen van Lumenear backend/CMS in plaats van hardcoded in het HTML-bestand. Nieuwe producten of gewijzigde Aeq-waarden zijn dan automatisch beschikbaar zonder nieuwe deploy.

**Techniek**: REST API of GraphQL. `useEffect` + `fetch` bij app-start.

---

### ⭐⭐ CRM/offerte-integratie
**Idee**: "Stuur naar CRM" of "Maak offerte" knop die de geselecteerde producten + hoeveelheden doorstuurt naar het verkoopsysteem (bv. Exact, HubSpot, Salesforce).

---

### ⭐⭐ Google Analytics / event tracking
**Idee**: Bijhouden welke producten het meest geselecteerd worden, welke ruimtetypen populair zijn, hoe lang gebruikers bezig zijn. Waardevolle sales-intelligence.

**Techniek**: GA4 event tracking op productselectie, export, sessieduur.

---

### ⭐ QR-code genereren
**Idee**: "Deel als QR" knop genereert een QR-code met de huidige configuratie als URL-parameters geëncodeerd. Klant kan QR scannen en ziet dezelfde berekening op zijn telefoon.

---

### ⭐ Versie-indicator + changelog
**Idee**: Versienummer zichtbaar in de footer met link naar changelog. Handig voor intern versiebeheer en ondersteuning.

---

## Prioriteitsmatrix

```
                    Hoge impact
                         │
    PDF-rapport ─────────┤──── NEN 18041
    Meerdere ruimten      │      Offline werken
                         │
Weinig werk ─────────────┼───────────────── Veel werk
                         │
    Productfoto's ────────┤──── Frequentiebanden
    Mobiel ──────────────┤──── API-koppeling
                         │
                    Lage impact
```

**Aanbevolen volgorde voor de eerste doorontwikkeling:**
1. PDF-rapport (hoogste verkoopwaarde)
2. Offline werken (verhoogt bruikbaarheid direct)
3. NEN 18041 (maakt tool officieel bruikbaar)
4. Productafbeeldingen (visuele kwaliteitssprong)
5. Mobiele weergave (bereik vergroten)
