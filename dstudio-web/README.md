# DSTUDIO | Beauty Salon – web

Statický web salonu krásy DSTUDIO (Praha 7). HTML, CSS a vanilla JavaScript, bez frameworku a bez buildu.

```
dstudio-web/
  site/            vše, co se nasazuje (tuto složku nahrajte na hosting)
  docs/            dokumentace k návrhu a závěrečný REPORT.md (nenasazuje se)
  source-assets/   brand book, vektory loga, podklady (nenasazuje se)
  tools/           pomocné skripty pro správu (nenasazují se)
```

## Náhled na počítači

Web načítá data přes `fetch`, proto nejde otevřít dvojklikem na soubor. Stačí libovolný statický server:

```bash
node tools/nahled-server.js 8080
```

a potom otevřít `http://localhost:8080`. Tento server posílá i bezpečnostní hlavičky ze souboru `_headers`.

## Nejčastější úpravy

| Co chci změnit | Kde |
|---|---|
| Ceny | `site/data/cenik.json` |
| Fotky prací | `site/data/galerie.json` + soubory do `site/assets/img/galerie/` |
| Členky týmu | `site/data/tym.json` (přepnout `zobrazitClenky` na `true`) |
| Recenze | `site/data/recenze.json` |
| Časté otázky | `site/data/faq.json` |
| Texty sekcí | `site/index.html` |
| Texty GDPR a Cookies | `tools/obsah/*.html`, potom `python3 tools/podstranky.py` |
| Barvy, písma, mezery | proměnné na začátku `site/assets/css/styl.css` |

Každý datový soubor má na začátku klíč `_navod` s popisem formátu.

## Pomocné skripty

| Skript | K čemu je |
|---|---|
| `tools/nahled-server.js` | místní náhled |
| `tools/kontrola.js` | automatická kontrola (odkazy, šířky, cookies, přístupnost, obsah) |
| `tools/podstranky.py` | složí GDPR, Cookies a 404 se stejnou hlavičkou a patičkou jako úvod |
| `tools/logo-build.py`, `tools/fonts-build.sh`, `tools/qr-build.py`, `tools/render-assets.js` | jednorázová příprava loga, písem, QR kódu, favicony a OG obrázku |
| `tools/wireframy.py` | wireframy do `docs/wireframy/` |

## Před spuštěním

Viz `docs/REPORT.md`, část „Před spuštěním".
