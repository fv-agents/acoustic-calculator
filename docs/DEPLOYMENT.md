# Deployment — Lumenear Acoustic Calculator

_Bijgewerkt: 2026-06-11_

## Hoe het werkt (huidige opzet)

```
git push naar main (fv-agents/acoustic-calculator)
        ↓ automatisch
Netlify build (publish dir: app/)
        ↓ ±30 sec
https://lumenear-acoustic-calculator.netlify.app/
```

Geen handmatige drag-and-drop meer nodig: **pushen = deployen**. De configuratie staat in `netlify.toml` (repo-root).

## Headers & embedding

`netlify.toml` zet `Content-Security-Policy: frame-ancestors 'self' https://lumenear.com https://*.lumenear.com` — de calculator mag dus ge-embed worden op lumenear.com (en subdomeinen), nergens anders. Er is bewust géén `X-Frame-Options` (kent geen allowlist).

Extra embed-domein nodig? Voeg het toe aan de `frame-ancestors` regel in `netlify.toml`.

## Eigen domein (calculator.lumenear.com)

1. Netlify UI → Site settings → Domain management → Add custom domain → `calculator.lumenear.com`
2. Bij de DNS-provider een CNAME toevoegen: `calculator` → `lumenear-acoustic-calculator.netlify.app`
3. Netlify regelt automatisch HTTPS (Let's Encrypt)

> **Let op**: de Netlify-site draait onder een ander account dan de lokale CLI-login (falcovile@gmail.com). Domein- en site-instellingen via de Netlify UI van dat account.

## WordPress / lumenear.com inbedden

Maak een full-width pagina en plak in een Custom HTML-blok:

```html
<style>
  .calc-iframe-wrapper { margin: -20px -40px -40px; overflow: hidden; }
  .calc-iframe-wrapper iframe { display: block; width: 100%; height: calc(100vh - 70px); border: none; }
  .entry-title { display: none; }
</style>
<div class="calc-iframe-wrapper">
  <iframe
    src="https://lumenear-acoustic-calculator.netlify.app/"
    title="Lumenear Akoestische Calculator"
    loading="lazy"
    allow="fullscreen"></iframe>
</div>
```

Gebruik je een `sandbox`-attribuut op de iframe? Dan zijn minimaal nodig: `allow-scripts allow-same-origin allow-downloads allow-modals` (voor opslaan/openen en de printdialoog).

## Offline / lokaal gebruiken

Kopieer de map `app/` (index.html + vendor/ + fonts/) naar een laptop of USB-stick en open `index.html`. Werkt volledig zonder internet — alle libraries en het font zijn gevendored.

## Productdata bijwerken

1. Pas `data/lumenear_2026_acoustic_data.csv` aan
2. `python tools/check_sync.py --emit` → plak het PP-blok in `app/index.html`
3. `python tools/check_sync.py` → moet "OK" geven (CI controleert dit ook)
4. Commit + push → live
