# Deployment Handleiding — Lumenear Calculator

---

## Optie A: Netlify (aanbevolen — staat er al op)

### Bestaande site updaten

1. Ga naar [app.netlify.com](https://app.netlify.com) en log in
2. Open jouw project (bv. `lumenear-calculator`)
3. Klik op het tabblad **Deploys**
4. Sleep het bestand `lumenear-acoustic-dashboard.html` naar het drop-zone gebied
5. Netlify deployt automatisch — binnen 30 seconden live

### Eigen domein instellen (calculator.lumenear.com)

1. Ga naar **Site settings → Domain management → Add custom domain**
2. Vul in: `calculator.lumenear.com`
3. Netlify vraagt je een DNS-record aan te maken
4. Log in bij jouw DNS-provider (TransIP / Cloudflare / One.com / etc.)
5. Voeg een **CNAME-record** toe:
   ```
   Type:   CNAME
   Naam:   calculator
   Waarde: jouw-site-naam.netlify.app
   TTL:    3600 (of auto)
   ```
6. Wacht 5–60 minuten voor DNS-propagatie
7. Netlify activeert automatisch een **gratis HTTPS/SSL-certificaat** via Let's Encrypt

---

## Optie B: WordPress

### Vereisten
- WordPress-toegang (admin)
- Thema met full-width paginasjabloon (of gebruik van een page builder)

### Stap 1: Maak een nieuwe pagina aan

1. Log in op je WordPress-dashboard
2. Ga naar **Pagina's → Nieuwe pagina**
3. Geef als titel: `Akoestische Calculator` (of `Acoustic Calculator`)

### Stap 2: Kies full-width layout

Zoek rechts in het Gutenberg-paneel (of Elementor/Divi zijbalk) naar:
- **Paginasjabloon** → kies `Full Width` of `Geen sidebar`
- Zet **Titelbalk verbergen** aan indien aanwezig

### Stap 3: Voeg iframe in via Custom HTML blok

Klik op **+** → zoek `Aangepaste HTML` of `Custom HTML`.

Plak de volgende code (vervang de URL door jouw Netlify-adres):

```html
<style>
  .calc-iframe-wrapper {
    margin: -20px -40px -40px -40px;  /* Compenseert WordPress padding */
    overflow: hidden;
  }
  .calc-iframe-wrapper iframe {
    display: block;
    width: 100%;
    height: calc(100vh - 70px);  /* 70px = geschatte hoogte WordPress header */
    border: none;
  }
  /* Verberg WordPress page title */
  .entry-title { display: none; }
</style>
<div class="calc-iframe-wrapper">
  <iframe
    src="https://calculator.lumenear.com"
    title="Lumenear Akoestische Calculator"
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>
```

> **Let op**: De negatieve marges (`-40px`) zijn afhankelijk van je thema. Test en pas aan.
> Bij Elementor/Divi: gebruik een "spacer" instelling om padding te verwijderen.

### Stap 4: Stel permalink in

1. Ga naar **Instellingen → Permalinks** als dit de eerste keer is
2. Aanbevolen URL voor de pagina: `/calculator` of `/akoestiek`

### Stap 5: Publiceer

Klik **Publiceren**. De pagina is live.

---

## Optie C: Direct als HTML-bestand aanbieden (download/link)

Als je de calculator niet wilt inbedden maar beschikbaar wil stellen als downloadbaar bestand:

1. Upload `lumenear-acoustic-dashboard.html` naar je server (via FTP of Bestandsbeheer in cPanel)
2. Zet het in een publiek toegankelijke map, bv. `/public_html/tools/`
3. Deel de directe link: `https://lumenear.com/tools/lumenear-acoustic-dashboard.html`

Gebruikers kunnen dan:
- Het bestand openen in de browser (werkt direct)
- Het opslaan op hun eigen computer voor offline gebruik

---

## Optie D: Volledig offline HTML (no-CDN versie)

Wil je een versie die **zonder internetverbinding** werkt (geen Google Fonts, geen CDN)?

Dit vereist het inladen van React, Babel en Inter-font als lokale bestanden. Stappen:

1. Download de benodigde scripts:
   - `https://unpkg.com/react@18/umd/react.production.min.js` → sla op als `react.min.js`
   - `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js` → `react-dom.min.js`
   - `https://unpkg.com/@babel/standalone/babel.min.js` → `babel.min.js`
   - Inter font: download als WOFF2 via Google Fonts

2. Pas de `<script>` en `<link>` tags in het HTML-bestand aan naar lokale paden

3. Of: vraag Claude om een volledig self-contained versie te genereren (scripts inline als base64)

---

## Onderhoud & Updates

### Calculator updaten na aanpassingen

1. Open het HTML-bestand in Claude Code (of Cowork)
2. Pas gewenste zaken aan
3. Sla op en herdeployeer naar Netlify (drag-and-drop in dashboard)
4. Optioneel: vervang ook het lokale bestand op collega's computers

### Productdata bijwerken

De productdata (`PP` array) staat in het HTML-bestand rond **regel 140–178**. Zoek naar `const PP=[` om nieuwe producten toe te voegen of bestaande te wijzigen.

Per product: `{n:"Naam",f:"Familie",aw:0.45,a:2.00,eq:1.50}`
- `n` = productnaam (zoals op lumenear.com)
- `f` = familie
- `aw` = gewogen absorptiecoëfficiënt (uit ISO 354 rapport)
- `a` = fysiek oppervlak m²
- `eq` = Aeq (equivalentabsorptieoppervlak m², de sleutelwaarde)

---

## Veelgestelde vragen

**Q: Kan ik het bestand ook via e-mail sturen?**
A: Ja. Het is één HTML-bestand van ~50KB. Stuur als bijlage, ontvanger opent het in de browser.

**Q: Werkt het op iPad/telefoon?**
A: Het laadt, maar de layout is geoptimaliseerd voor desktop. Op iPad in landscape is het bruikbaar. Mobiele optimalisatie staat op de roadmap.

**Q: Kan ik meerdere versies naast elkaar draaien?**
A: Ja. Elke kopie van het HTML-bestand is volledig onafhankelijk. Maak aparte Netlify-sites aan voor bv. een test- en productieversie.

**Q: Zijn de berekeningen gecertificeerd?**
A: De Sabine-formule is wetenschappelijk gevalideerd en conform ISO 3382. De productdata is gebaseerd op Peutz-labmetingen (ISO 354). De tool is indicatief en bedoeld als verkoopinstrument, niet als vervanging voor een formeel akoestisch advies.
