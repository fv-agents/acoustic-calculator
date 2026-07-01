# Decisions — Acoustic Calculator

Gemaakte keuzes met redenering. Alleen echte keuzes — geen obvious dingen.

---

## 2026-07-01 — Merford ISO 354 objectmetingen verwerkt; Equivalent_Absorption_Aeq_m2-kolom weer actief (herziet besluit 2026-06-11)

**Aanleiding:** Merford (Gorinchem, niet-RvA-geaccrediteerd eigen lab) heeft op 2026-05-12 7 opstellingen van echte Lumenear-armaturen in een nagalmkamer gemeten volgens ISO 354 (i.p.v. het materiaal-niveau ISO 11654 dat de rest van de catalogus gebruikt): Toad 1500, Halo 1400, Nova 2800, Twist (7 diverse modellen gecombineerd), Cone (3×750+3×1000 combimeting), Column 1600, Float 800 (zonder verlichting, 158cm). Bronbestanden: `Akoestische testen/2026-05-12 Merford ISO354 meetrapport.pdf` + verwerkt overzicht (xlsx, lineaire/frequentie-schaling naar 23 varianten).

**Zelfcheck tegen de bestaande calculator-waarden (`app/data.js`) toonde:** voor Toad/Halo/Nova/Column/Twist consistent 12–25% té hoog (het bestaande materiaalmodel — oppervlak × αw × diffractie 1.12 — overschat de absorptie van gevouwen/3D-vormen t.o.v. een vlak paneel). Cone wijkt als enige de andere kant op (+16 à +30%, minst directe afleiding: combimeting + geometrische split naar losse maten).

**Besluit (herziet 2026-06-11 "Berekende Aeq is leidend"):** de kolom `Equivalent_Absorption_Aeq_m2` in de CSV — destijds bewust genegeerd omdat hij alleen een niet-onderbouwde losse waarde bevatte (Twist Floor light 2.5) — is nu gevuld voor 65 van de 89 producten en fungeert in `tools/check_sync.py` als **override boven de formule** wanneer niet leeg. Dit voorkomt dat de pendant-diffractiefactor (1.12) een tweede keer wordt toegepast op een waarde die al een echte 3D-object-meting is. Voor producten zonder waarde in die kolom blijft de formule (oppervlak × spraak-α × diffractie) gewoon leidend — dat deel van het besluit van 2026-06-11 staat nog.

**Scope van de 65 aangepaste rijen:**
- **Direct gemeten/geschaald (43 rijen, Falco akkoord):** alle Toad/Halo/Nova/Column/Twist/Cone/Float-varianten uit de Merford-xlsx. Float: op Falco's instructie geldt de gemeten waarde (getest zonder verlichting) voor alle constructies van die maat, óók de wol-gevulde "acoustic"-variant — dit is een aanname, geen aparte meting per constructie.
- **Extrapolatie (20 rijen, Falco akkoord — "meest realistische manier, gebaseerd op nieuwste info"):** producten met identieke constructie ("Single layer 9mm PET Felt (free hanging)", αw 0.45) maar zelf niet getest. Toad Oval 1750 kreeg Toad's eigen gemeten correctiefactor (×0.802); Breeze/Orbit/Wing/Cloud/Sliced/Blooom/Drop/Cage/Podge/Spott/Pyknic kregen het gemiddelde van de 5 wél-geteste families excl. Cone (×0.850, Cone uitgesloten omdat die tegengesteld afwijkt).
- **Bewust niet aangepast:** Blaze (deelde voorheen 1-op-1 Toad's cijfers als placeholder — Falco wil dit apart laten testen, niet automatisch meebewegen met Toad's correctie). Line, Bold, Macaron, Edge, JoJo (andere constructie/αw, geen geteste analoge basis — extrapolatie zou giswerk zijn).

**Onopgeloste kwesties, bewust niet dit besluit geblokkeerd:** Float-oppervlak in data.js (~2×) vs Merford-xlsx — vermoedelijk telt data.js beide zijden van het dubbele vilt; niet gecorrigeerd omdat de gebruikte Aeq-waarden rechtstreeks uit de meting komen (niet via het oppervlak herberekend), dus het speelt hier geen rol, maar is relevant als de `a`-kolom ooit elders gebruikt gaat worden. Lab niet RvA-geaccrediteerd — prima voor intern gebruik, geen extern certificaat. Geen zichtbare "gemeten vs geschat"-indicatie in de UI (Falco: bewust, cijfers hoeven alleen intern te kloppen). CSV-methodologiekolom blijft overal "ISO 354:2003" zeggen, ook voor de geëxtrapoleerde rijen (Falco: bewust laten staan).

**Gevolg:** `tools/check_sync.py` uitgebreid met override-logica (regel ~90-98). `data/lumenear_2026_acoustic_data.csv` en `app/data.js` bijgewerkt, CI groen (89/89 sync, 11/11 unit tests).

## 2026-06-12 — Aanname-waardes definitief na bronnenonderzoek (v5.2)
**Reden:** vier waardes stonden als aanname. Onderzoek: lattenpanelen ISO 354-rapporten tonen αw ≈0,30 direct op wand vs ≈0,62 op regels + isolatie — één waarde 0,55 was te optimistisch voor directe montage (de gangbare). Spuitpleister 25mm: spraak-α 0,72 (NRC 0,65–0,90) → 0,70 klopt. Tapijttegels: fabrikantrange αw 0,15–0,20 → 0,15 klopt. Personen: tweede bron (0,44/0,45/0,45) bevestigt 0,46.
**Gevolg:** lamellenwand gesplitst in twee opties (0,30 / 0,62) met legacy-mapping naar de spouwvariant; lamellenplafond 0,55→0,60 (plenum). Brontabel in docs/DOCUMENTATIE.md §4.

## 2026-06-12 — Productafbeeldingen: niet hotlinken vanaf lumenear.com
**Reden:** site gebruikt lazy-loaded placeholders (URL's niet stabiel benaderbaar) en hotlinken breekt de offline-werking — een kernfeature.
**Gevolg:** wachten op 24 lokale familie-thumbnails in app/img/; dan inbouwen met fallback.

## 2026-06-12 — Materialenherziening na data-audit (v5.1)
**Reden:** Falco vond de keuzes "matig" en de audit bevestigde fouten: "Dun tapijt" gebruikte de tabelwaarden van *heavy carpet on concrete* (spraak-α 0,37) terwijl kantoortapijttegels αw 0,15–0,20 hebben; personen-absorptie ontbrak; meubileringslabels waren ruimtetypes i.p.v. dichtheid; de norm heette ten onrechte "NEN 18041" (= DIN, Duits).
**Gevolg:** nieuwe lijsten (o.a. Tapijttegels 0,15, lamellenwand/-plafond, PET-vilt wandopties op eigen Peutz-data 0,36/0,90), meubilering = 5 niveaus dichtheid × stoffering, extra akoestiek = additieve checkboxes, personen-invoer (0,46 m²/p.p., 0 = onbezet/worst-case), presets +kantine/callcenter/kinderopvang, celkantoor & klaslokaal 0,8→0,6 s. Aannames zonder datasheet gemarkeerd: tapijttegels 0,15 · lamellenwand 0,55 · lamellenplafond 0,55 · spuitpleister 0,70. Oude opgeslagen projecten worden via een legacy-mapping geconverteerd.

## 2026-06-12 — Excel-versie uitgefaseerd
**Reden:** Falco: web-app op GitHub/Netlify volstaat; de xlsx werd niet meer gebruikt. De CSV blijft wél de bron van waarheid (octaafbanden + Peutz-data, nodig voor toekomstige frequentieband-feature).
**Gevolg:** buildscript → backup/, excel/ → data/, PP-regeneratie via `tools/check_sync.py --emit` (pure Python, geen pandas), CI-job excel-build vervallen. Materiaaldata bestaat nu alleen nog in app/index.html.

## 2026-06-11 — v2-dashboard is de hoofdapp, v1 naar backup
**Reden:** Falco's v2 (React 3-paneel dashboard van de werk-PC) is functioneel en visueel superieur aan de v1 wizard; data bleek 89/89 in sync met de CSV.
**Gevolg:** app/index.html = v2 + fixes. v1 staat in backup/v1-index.html, origineel v2-export in backup/v2-dashboard-export-origineel.html.

## 2026-06-11 — Berekende Aeq is leidend, niet de catalogus-kolom
**Reden:** Falco's keuze (audit-vraag): de berekende waarde (Surface × spraak-α × diffractie) wint van de CSV-kolom Equivalent_Absorption_Aeq_m2. O.a. Twist Floor light = 2.71 (niet 2.5). Overige datacorrecties komen later.
**Gevolg:** check_sync.py en build-script negeren die kolom bewust.

## 2026-06-11 — Gevendorde React+htm i.p.v. Babel/CDN, font lokaal
**Reden:** v2 hing aan unpkg-CDN's + Babel-runtime (traag, offline = wit scherm, GDPR-risico Google Fonts). htm (1KB) geeft JSX-achtige syntax zonder build-stap.
**Gevolg:** app/ werkt volledig offline en blijft single-file-bewerkbaar; vendor-updates = bestand vervangen in app/vendor/.

## 2026-06-11 — PDF-rapport via print-stylesheet, geen jsPDF
**Reden:** window.print() + verborgen #report-div hergebruikt de bestaande SVG-componenten, werkt offline, geen dependency. Browser "Opslaan als PDF" = het rapport.
**Gevolg:** rapport-layout onderhouden in de @media print sectie van app/index.html.

## 2026-06-11 — Embed: CSP frame-ancestors i.p.v. X-Frame-Options
**Reden:** Falco wil de calculator op lumenear.com embedden; XFO kent geen allowlist.
**Gevolg:** netlify.toml: frame-ancestors 'self' + lumenear.com + *.lumenear.com. Extra domein = regel aanvullen.

## 2026-06-11 — v2-materiaaldata is leidend bij verschillen
**Reden:** EX-lijst verschilde (v1/Excel: "11. Roomdividers" + pakket 0.18; v2: "11. Roomdividers + schermen" + 0.20). v2 is Falco's nieuwste bewuste bewerking.
**Gevolg:** Excel-script aangepast naar v2-waarden. WALLS kreeg in beide een "Weet ik niet" (0.02, beton-niveau; bewust niet 0.01/tegels — dat is een exotisch randgeval).

## 2026-06-11 — RT60 zonder 6s-cap in de berekening
**Reden:** beide RT60's op 6s clampen maakte "Verbetering" 0% in extreem galmende ruimtes. Web topt alleen de weergave af (≥6,0); Excel-cap volledig verwijderd.
**Gevolg:** verbetering klopt altijd; extreme waarden zijn zichtbaar i.p.v. verstopt.

## 2026-06-11 — NEN 18041-toetsing bewust NIET gebouwd
**Reden:** "certificaat-waardige" output op een single-band Sabine-schatting is inhoudelijk niet waar te maken (aansprakelijkheid). Richtwaarden heten in de UI en het rapport expliciet "indicatief, geen NEN-toetsing".
**Gevolg:** pas heroverwegen mét frequentieband-berekening.

## 2026-06-11 — Repo-root = projectmap, geen Co-Authored-By
**Reden:** hele projectmap op GitHub (incl. memory-bestanden); Co-Authored-By brak eerder Netlify-deploys (nesting-calculator).
**Gevolg:** netlify.toml op root met publish = "app"; commits altijd zonder trailer.
