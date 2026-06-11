# Decisions — Acoustic Calculator

Gemaakte keuzes met redenering. Alleen echte keuzes — geen obvious dingen.

---

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
