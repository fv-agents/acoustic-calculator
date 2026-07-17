# Decisions — Acoustic Calculator

Gemaakte keuzes met redenering. Alleen echte keuzes — geen obvious dingen.

---

## 2026-07-17 (2) — Eigen inlogscherm op Supabase Auth (vervangt Basic Auth Edge Function)

**Reden:** Falco wilde een "professioneel" inlogscherm met logo/huisstijl, wachtwoord-vergeten, onthoud-mij en toegang-aanvragen. HTTP Basic Auth (2026-07-17 (1)) gebruikt altijd de kale browser-popup — daar is niets aan te stylen, dus dat vereiste een architectuurwissel.

**Gekozen aanpak:** client-side gate op **Supabase Auth** (zelfde project als AIF), via directe REST-calls (`app/auth.js`) — bewust géén `@supabase/supabase-js` SDK vendored, om in lijn te blijven met de bestaande no-CDN/lightweight-dependency-filosofie van dit project. Login/forgot-password/request-access/set-new-password UI in `app/auth-components.jsx` + `app/auth-styles.css`, gestyled met dezelfde design tokens als de rest van de app (dark theme, DM Serif Display, Lumenear-logo). `calculator-app.jsx` rendert nu `<AuthGate><App/></AuthGate>` i.p.v. `<App/>` direct; logout-knop toegevoegd aan de header.

**Belangrijke security-tradeoff (bewust geaccepteerd, met Falco besproken vooraf):** de oude Edge Function blokkeerde de site volledig server-side. Dit is client-side — de statische bestanden zijn technisch downloadbaar zonder in te loggen (de browser moet de loginpagina zelf kunnen laden), al toont de app zonder geldige sessie alleen het inlogscherm, geen werkende calculator. Acceptabel voor een tijdelijke klant-gate zonder gevoelige data.

**"Toegang aanvragen"** = nieuw Netlify Forms-formulier `access-request` (zelfde patroon als de bestaande `quote`-form in quote-flow.jsx), hidden static form in index.html. **Vereist dezelfde Netlify-actie die al openstond voor de quote-form:** Forms → notificatie-mail instellen, nu voor twee formulieren.

**Login-logging:** hergebruikt de bestaande `calculator_access_log`-tabel (2026-07-17 (1)) — client-side call na succesvolle Supabase-login, zelfde insert-only anon-policy. Supabase Auth zelf toont ook een Users-overzicht (Authentication-tab) met last-sign-in — dat is nu het primaire "wie heeft toegang"-overzicht, de logtabel blijft voor gedetailleerde login-events.

**Getest:** volledige flow lokaal met een tijdelijk Supabase-testaccount (aangemaakt via het publieke signup-endpoint met de anon key, daarna `email_confirmed_at` gezet via SQL — bewust géén service_role key gebruikt/opgevraagd, om dat privilege niet onnodig aan te raken). Login, foutieve inlog (nette foutmelding), "onthoud mij" (sessie overleeft reload), en logout: allemaal bevestigd werkend. Testaccount + testlog-rij achteraf verwijderd.

**Belangrijke bevinding — Supabase's standaard e-mailservice is zwaar rate-limited** (429 `over_email_send_rate_limit` al na een paar verzoeken zonder eigen SMTP). De "wachtwoord vergeten"-functie werkt technisch correct, maar zal bij een handjevol testers af en toe falen totdat Falco eigen SMTP instelt in Supabase (Authentication → Settings → SMTP). Voor de eerste 4-5 accounts is dit waarschijnlijk oké (Falco kan handmatig een wachtwoord resetten via Supabase Studio als de mail niet aankomt), maar geen structurele oplossing.

**Oude Basic Auth Edge Function verwijderd** (`netlify/edge-functions/basic-auth.ts`, netlify.toml edge_functions-blok). De Netlify env var `AUTH_USERS` die Falco eerder instelde is nu ongebruikt — mag blijven staan (onschadelijk) of verwijderd worden, geen functionele impact meer.

**Nog te doen (Falco, via Supabase dashboard):**
1. Authentication → Users → 4 accounts aanmaken (falco/rik/jelle/frank @in-zee.nl, wachtwoord Welkom2026!, "Auto Confirm User" aanvinken zodat ze direct kunnen inloggen zonder bevestigingsmail).
2. Authentication → URL Configuration → Site URL zetten op `https://calculator.lumenear.com` (of voorlopig de netlify.app-URL) + die URL toevoegen aan Redirect URLs — nodig voor de wachtwoord-reset-link.
3. Optioneel maar aanbevolen: eigen SMTP instellen voor betrouwbare reset-mails.

## 2026-07-17 — Tijdelijke Basic Auth-gate + Supabase login-log

**Reden:** Falco wil de calculator op `calculator.lumenear.com` zetten maar voorlopig achter een login, met individuele accounts per klant/tester (niet één gedeeld wachtwoord) zodat hij weet wie toegang heeft.

**Gekozen aanpak:** Netlify Edge Function (`netlify/edge-functions/basic-auth.ts`) gate't de hele site (`path:"/*"`) met HTTP Basic Auth. Credentials staan in de Netlify env var `AUTH_USERS` (`gebruiker:wachtwoord,gebruiker:wachtwoord`, geen database nodig voor het beheer). Geen credentials geconfigureerd = fail closed (site blijft dicht, niet per ongeluk open).

**Monitoring via Supabase** (zelfde project als AIF: `Agent` / `rcgwxafbgeexwujbclfh`): nieuwe tabel `calculator_access_log` (username, tijdstip, ip, user-agent) — los van de AIF-tabellen. Bewust **geen service_role key** in de edge function: die geeft volledige toegang tot alle AIF-data (leads, contacts, etc.) en zou bij een leak in de Netlify-config een groot risico zijn. In plaats daarvan de publieke anon/publishable key + een insert-only RLS policy (`anon can insert login events`) — die key kan alleen wegschrijven naar deze ene tabel, niets lezen. Logs bekijk je via Supabase Studio.

**Getest lokaal** met `netlify dev` (los van de live site — die staat op een ander Netlify-account dan de CLI-login, zie [[project-netlify-cli]]): geen auth → 401, verkeerd wachtwoord → 401, juiste inlog → 200 + rij in `calculator_access_log`. Testrij achteraf verwijderd.

**Vereist voor livegang (Falco-actie, kan niet via CLI omdat de site op een ander account staat):** in Netlify dashboard van de acoustic-calculator-site 3 env vars zetten: `AUTH_USERS`, `SUPABASE_URL` (`https://rcgwxafbgeexwujbclfh.supabase.co`), `SUPABASE_ANON_KEY` (de publishable key uit het Agent-project). Daarna opnieuw deployen.

**Bewust tijdelijk:** deze auth-laag moet eruit (of vervangen worden) zodra de calculator publiek/embedded gaat — Basic Auth-prompts werken onvoorspelbaar in iframes (embed-plan in status.md), dus dit is geen oplossing voor de embed-fase.

## 2026-07-06 (2) — Flora verborgen tot lancering; 19 geëxtrapoleerde producten teruggedraaid

**Flora verborgen:** nieuwe lamp, nog niet gelanceerd. Data blijft staan in CSV + `app/data.js` (voor toekomstig gebruik), maar een `hidden:true`-vlag op de 4 Flora-rijen sluit ze uit van `window.FAMILIES` en de fixture-catalogus (`app/calculator-app.jsx` regel ~132, `filtered`). `check_sync.py`'s parser negeert onbekende velden (niet-greedy regex), dus `hidden` breekt de sync-check niet. Zet `hidden:false` (of verwijder het veld) zodra Flora live gaat.

**19 Phase-B-extrapolaties (01-07) teruggedraaid:** Falco: "hou alles aan wat ik zojuist gestuurd heb, verwijder de oude info" — de familie-ratio-extrapolatie voor Breeze/Orbit/Wing/Cloud(×6)/Sliced/Blooom/Drop/Cage/Podge/Spott(×2)/Pyknic bleek na de herziening van 06-07 op losse schroeven te staan (zie besluit 2026-07-06 (1)). Override in `Equivalent_Absorption_Aeq_m2` verwijderd voor deze 19 rijen → vallen terug op de oorspronkelijke materiaalformule (oppervlak×spraak-α×diffractie), exact gelijk aan de waardes van vóór de Merford-verwerking. **Toad Oval 1750 bleef ongemoeid** — die heeft sinds 06-07 wél een eigen echte meetwaarde (geen extrapolatie meer).

**Gevolg:** CI groen (93/93 sync, 11/11 tests). Product-scope die nu op echte/directe Merford-data staat: Toad, Halo, Nova, Column, Twist, Cone, Float, Blaze, Line (in totaal 46 rijen). De rest van de catalogus (incl. de 19 teruggedraaide) staat weer op de langlopende materiaalformule, zoals vóór 01-07.

## 2026-07-06 — Herziene Merford-tabel verwerkt (vervangt deels 2026-07-01); Flora toegevoegd

**Aanleiding:** Falco leverde een herziene tabel met materiaal-oppervlak + spraakgewogen Aobj per product. De 7 zelf gemeten basismaten (Toad 1500, Halo 1400, Nova 2800, Twist ref/vloerlamp/klein, Column 1600/2000, Float round 800) kwamen exact overeen met wat op 01-07 verwerkt was — bevestigt dat de onderliggende meting hetzelfde is. Maar de geschaalde tussenmaten wijken nu structureel anders af, met name Nova 1800 (1,87→2,82, +51%) en de Float oval/rectangle-varianten (−26 tot −41%). Dit wijst erop dat de scaling-methode in deze versie afwijkt van de eerste xlsx (niet louter lineaire oppervlakteschaling). Falco gaf aan geen apart brondocument te hebben — alleen deze tabel, 1-op-1 overgenomen zoals geplakt.

**Gevolg (41 rijen bijgewerkt in CSV + data.js):** naast de Aeq-override is nu ook `Acoustic_Surface_m2` expliciet gezet voor alle 41 rijen (i.p.v. de eerdere `calc_area()`-formule), zodat materiaal-oppervlak en Aeq als bij elkaar horend paar vastliggen. Dit lost en passant de eerder gesignaleerde Float-oppervlak-discrepantie op (was ~2× te groot in data.js t.o.v. het Merford-rapport — nu 0,50 m² voor Float round 800, conform het rapport). Cone's materiaal-oppervlak is ook gecorrigeerd (0,60→0,46 en 0,93→0,81 m²) — Falco's tabel markeert deze met een * (blijft de minst directe afleiding: combimeting + geometrische split).

**Blaze en Line kregen voor het eerst eigen cijfers** (voorheen resp. bewust ongemoeid gelaten als Toad-placeholder, en niet aangepast wegens ontbrekende testbasis). Falco bevestigde: "het zijn kennelijk ook gemeten/berekende waarden" — dus nu op dezelfde manier verwerkt (override in Aeq + oppervlak).

**Flora toegevoegd als nieuwe productlijn** (4 varianten: 800/1200/1800/oval) — bestond nog niet in de catalogus. Categorie/montage/constructie (Technical, Pendant, single layer 9mm PET Felt free hanging, αw 0.45) door Falco bevestigd; exacte productbeschrijving/marketingtekst en de W×L-afmetingen van de ovale variant ontbreken nog (Notes-veld tijdelijk als "TBD"-achtig geformuleerd in de CSV, `d:null` voor oval in data.js).

**Onopgeloste kwestie — niet geblokkeerd, wel gevlagd:** de 20 producten die op 01-07 via een familie-specifieke correctieratio geëxtrapoleerd zijn (Breeze/Orbit/Wing/Cloud/Sliced/Blooom/Drop/Cage/Podge/Spott/Pyknic) zijn gebaseerd op een destijds vrij consistente Toad-ratio (~0,80 over alle 3 maten). Met de herziene cijfers is die ratio niet meer consistent (Toad 1500 0,80 / 1000 0,97 / 750 0,90) — de aanname "één stabiele familieratio" houdt dus minder goed stand dan gedacht. Deze 20 rijen zijn **nog niet opnieuw doorgerekend** met de herziene basis; moet met Falco besproken worden of dat nu alsnog moet, of wachten op verdere metingen.

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
