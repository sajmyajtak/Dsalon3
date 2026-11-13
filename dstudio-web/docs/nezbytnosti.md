# Fáze 6 – Nezbytné věci

## Cookies lišta (funkční)

Soubor `site/assets/js/souhlas.js`, okno je v HTML každé stránky.

| Požadavek | Řešení |
|---|---|
| Kategorie | Nezbytné (vždy zapnuté), Analytické, Externí obsah (mapa) |
| Výchozí stav | Nepovinné kategorie vypnuté |
| Tlačítka | „Přijmout vše" a „Odmítnout nepovinné" mají stejný vzhled i velikost; „Nastavení" rozbalí kategorie |
| Pamatování volby | `localStorage`, klíč `dstudio-souhlas`, platnost 180 dní, potom se okno zobrazí znovu |
| Načítání po souhlasu | Mapa Google se vloží až po povolení kategorie Externí obsah nebo po kliknutí na „Zobrazit mapu". Bez souhlasu web neposílá žádný požadavek mimo vlastní doménu. |
| Odvolání | Po odvolání souhlasu mapa ze stránky zmizí |
| Znovuotevření | Odkaz „Nastavení cookies" v patičce a tlačítko na stránce Cookies |
| Analytika | Nic nainstalováno. V `souhlas.js` je funkce `analytika()`, která se zavolá jen po souhlasu; do ní se později vloží načtení zvoleného nástroje. |
| Bez JavaScriptu | Okno se nezobrazí a nic nepovinného se nenačte |

Pro vývojáře: `window.dstudioSouhlas.ma('externi')`, `.otevri()`, `.priZmene(funkce)`.

## GDPR a Cookies

- `/gdpr/` – správce D. Y. Beauty s.r.o., IČO 17419221, Milady Horákové 398/30, 170 00 Praha 7 – Holešovice,
  tel. +420 773 706 196. Popisuje skutečné zpracování: provozní záznamy hostingu, uložení volby cookies, mapu po souhlasu,
  rezervaci přes Noona, telefon a zprávy, odkaz na Instagram, práva subjektů a stížnost u ÚOOÚ.
- `/cookies/` – přehled toho, co web opravdu ukládá (jediný záznam v `localStorage`), kategorie a jak změnit volbu.
- Web nemá kontaktní formulář a žádný kvůli GDPR nepřibyl.
- E-mail ani DIČ v textech nejsou (v podkladech chybí). Jako kontakt slouží telefon a adresa.
- Adresa je uvedena jako „Adresa", ne „sídlo": brand book ji uvádí na ceduli provozovny a sídlo jsem neověřoval v rejstříku.
- Texty jsou napsané podle skutečného stavu webu. **Před spuštěním je doporučuji nechat zkontrolovat právníkem**
  a doplnit název poskytovatele hostingu.

Obsah obou stránek je v `tools/obsah/` a podstránky se skládají skriptem `tools/podstranky.py`
(přebírá hlavičku, patičku a okno cookies z úvodní stránky).

## Security

- HTTPS a HSTS zajistí Netlify.
- Hlavičky jsou ve dvou souborech se stejným obsahem: `site/netlify.toml` a `site/_headers`.
  Soubor `_headers` Netlify čte i při nahrání složky přetažením, `netlify.toml` při nasazení přes Git nebo CLI.

| Hlavička | Hodnota |
|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; manifest-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | kamera, mikrofon, poloha, platby, USB a browsing-topics vypnuté |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| Cross-Origin-Opener-Policy | `same-origin` |

- CSP je bez `unsafe-inline` a bez `unsafe-eval`. Web nemá žádný inline skript ani inline styl.
  Jediná povolená cizí adresa je `https://www.google.com` pro rámec s mapou (po souhlasu).
- Žádné klíče, žádné trackery, žádné skripty ani písma z cizích serverů.
- Texty z datových souborů se do stránky vkládají jako text, ne jako HTML. Odkazy v otázkách mají povolená jen
  schémata `#`, `/`, `tel:` a `https://`.
- Externí odkazy mají `target="_blank"` a `rel="noopener"`.

## SEO

- `lang="cs"`, jedinečný `<title>` a meta description na každé stránce, kanonické odkazy.
- Open Graph a Twitter karta, OG obrázek 1200 × 630 (logo na krému).
- `robots.txt`, `sitemap.xml`.
- JSON-LD `BeautySalon` jen z ověřených údajů: název, provozovatel, IČO, adresa, telefon, otevírací doba Po–Pá,
  Instagram, odkaz na rezervaci. **Žádné hodnocení, žádné souřadnice, žádný cenový rozsah.**
- Stránka 404 má `noindex`.
- **Doména není známá.** Všude je zástupná adresa `https://dstudio.example`. Před spuštěním ji nahraďte ve všech
  souborech (viz REPORT, část Před spuštěním).

## Výkon

- Jedno CSS (12 kB po kompresi), dva vlastní skripty, knihovny pro parallax se načítají až po vykreslení
  a jen když návštěvník nemá zapnutý omezený pohyb.
- Písma: 4 soubory woff2, celkem 82 kB, dvě se přednačítají.
- Mezipaměť: písma a knihovny 1 rok, obrázky a SVG 7 dní, CSS a JS 1 hodina, data (ceník) se ověřují při každé návštěvě,
  aby se změna ceny projevila hned.
