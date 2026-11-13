# Fáze 8 – Kontrola

Kontrola proběhla nad místním náhledem (`tools/nahled-server.js`), který posílá stejné bezpečnostní hlavičky
a kompresi jako ostrý hosting. Automatickou část lze kdykoli zopakovat: `node tools/kontrola.js`.

## Souhrn

| Oblast | Výsledek |
|---|---|
| Automatická kontrola (`tools/kontrola.js`) | **295 kontrol, 0 chyb** |
| Lighthouse – úvod, mobil | výkon **97**, přístupnost **100**, osvědčené postupy **100**, SEO **100** |
| Lighthouse – úvod, desktop | **100 / 100 / 100 / 100** |
| Lighthouse – GDPR a Cookies, mobil | **99 / 100 / 100 / 100** |
| axe-core (WCAG 2.2 AA + osvědčené postupy) | 0 porušení na všech stránkách, 390 i 1440 px |
| Vodorovný posuv | žádný na 320, 390, 768, 1024, 1440 px |
| Chyby v konzoli, porušení CSP | žádné |

Lighthouse měří simulovaný pomalý mobil: FCP 0,8 s, LCP 2,5 s, TBT 90 ms, CLS 0. Jediné, co nástroj vytýká,
je neminifikované CSS a JS (úspora asi 5 kB). Je to vědomé: web nemá build a kód má zůstat čitelný.

## Odkazy a tlačítka

- Všechna tlačítka „Rezervovat…", „Služby, ceník a rezervace" a „Vybrat specialistku v Noona" vedou přesně na
  `https://noona.app/dstudio`, otevírají nové okno a mají `rel="noopener"`.
- „Prohlédnout naše práce" vede na `#prace`, „Jak se k nám dostanete" na `#cesta`.
- Telefon je `tel:+420773706196`. Adresa vede do map. Instagram vede na `https://www.instagram.com/dstudio_cz/`.
- Všechny kotvy na stránce existují, kotvy z podstránek vedou na úvodní stránku, interní odkazy vrací 200.
- Kotvy s plynulým scrollem dojíždějí přesně pod hlavičku (ověřeno měřením u čtyř sekcí).
- Neexistující adresa vrací stránku 404.

Externí cíle: Noona, Instagram, Mapy.cz, Mapy Google, zásady Google (2×), ÚOOÚ. Ověřil jsem tvar odkazů,
ne dostupnost cizích serverů.

## Responsivita

Zkontrolováno ve screenshotech na 320, 390, 768, 1024 a 1440 px.
- 320 px: štítek úvodu na jeden řádek, lišta s rezervací jen s tlačítkem, ceny v jednom sloupci.
- 390 px: úvod, okno, služby jako pruh pěti tabulí, galerie ve dvou sloupcích, cedule pod sebou.
- 768 px: jeden sloupec, ceník se třemi cenovými sloupci.
- 1024 px: okno přes pět sloupců, menší nadpis, ceník ve dvou sloupcích, cedule ve třech.
- 1440 px: plné rozvržení ve dvanácti sloupcích.

## Údaje podle brand booku

Adresa, PSČ a čtvrť, telefon, IČO, provozovatel, otevírací doba, víkendový režim, Instagram a odpovědný vedoucí
se shodují s brand bookem (strany 11 a 17). Ceny jsou ověřené proti stranám 14, 15 a 20 (viz `podklady.md`).

## Branding

- V kódu je jen pět barev palety. Žádný přechod, stín, průhledná barva ani zaoblení (kontroluje skript).
- Logo je vektor z brand booku, nezměněný, ve třech schválených verzích. Ochranná zóna = výška D:
  v hlavičce 17 px při výšce loga 28 px a 20 px při 34 px, v patičce 33 px při 56 px.
- Název se píše jen jako DSTUDIO.
- Béžový text je pouze na čokoládě a na smaragdu, nikdy na krému ani na bílé.

## Kontrast (WCAG)

| Kombinace | Poměr | Použití |
|---|---|---|
| Čokoláda na bílé | 16,1 : 1 | text |
| Čokoláda na krému | 14,1 : 1 | text, ceny |
| Krém na čokoládě | 14,1 : 1 | text na tmavém |
| Smaragd na bílé / na krému | 9,9 : 1 / 8,7 : 1 | štítky |
| Bílá na smaragdu | 9,9 : 1 | hlavní tlačítko, závěrečná výzva |
| Béžová na čokoládě | 8,8 : 1 | štítky a hesla na tmavém |
| Béžová na smaragdu | 5,4 : 1 | jen linky |

Veškerý text splňuje AAA (7 : 1), nejmenší ceny a kontakty mají 14 : 1 a více.

## Přístupnost

- Jedno H1 na stránce, nadpisy bez přeskakování úrovní, landmarky, `lang="cs"`.
- Odkaz „Přeskočit na obsah" je první zastávkou klávesnice.
- Viditelný fokus: smaragdový na světlých plochách, krémový nebo bílý na tmavých.
- Mobilní menu: tlačítko s `aria-expanded`, zbytek stránky je při otevření neaktivní (`inert`), Escape zavírá.
- Okna služeb jsou záložky s ovládáním šipkami, Home a End.
- Přepínač úrovně v ceníku je skupina přepínačů s legendou. Tabulky mají popisky a záhlaví řádků i sloupců.
- Pomlčka v ceníku má pro čtečky text „nenabízíme".
- Dotykové cíle mají na mobilu nejméně 44 × 44 px.
- Všechny obrázky mají `alt`, `width` a `height`. Dekorativní kresby jsou před čtečkami skryté.
- `prefers-reduced-motion`: knihovny pro parallax se nenačtou, nic se nehýbe, žádný obsah nečeká na animaci.
- Bez JavaScriptu: navigace je vidět, všech pět služeb je rozbalených, ceník odkazuje do Noona.

## Česká typografie

Pevné mezery po jednopísmenných předložkách a spojkách, v telefonním čísle a v PSČ; ceny jako „1 190 Kč";
rozsahy s půlčtvrtčárkou („9:00–19:00", „30–250"); české uvozovky. Texty z datových souborů upravuje skript.
Dlouhá pomlčka „—" v textech klienta zůstala tak, jak ji klient napsal.

## Cookies

| Test | Výsledek |
|---|---|
| První návštěva: okno se zobrazí, nepovinné kategorie vypnuté | ano |
| Obě hlavní tlačítka mají stejnou velikost i vzhled | ano |
| Před volbou a po odmítnutí neodchází žádný požadavek mimo web | ano |
| Odmítnutí: okno se zavře, mapa se nenačte | ano |
| Volba přežije nové načtení stránky | ano |
| „Nastavení cookies" v patičce okno znovu otevře | ano |
| Povolení externího obsahu vloží mapu Google | ano |
| Odvolání souhlasu mapu odstraní | ano |
| Po 180 dnech volba vyprší | ano |
| „Zobrazit mapu" povolí jen externí obsah, analytika zůstane vypnutá | ano |

## Obsah

- Žádný vymyšlený údaj: recenze, jména, počty, slevy ani ocenění na webu nejsou.
- Na webu, v komentářích, v meta údajích, v alt textech ani v názvech souborů není zmínka o AI (kontroluje skript).
- Na webu není žádný generovaný obrázek. Všechny vizuály jsou kreslené kódem.
- Strukturovaná data neobsahují hodnocení.

## Designová revize podle načtených skillů

K dispozici byl skill `apple-design` (revize UI podle Apple Human Interface Guidelines a řemeslná kritika)
a `artifact-design` (základy návrhu stránek). Samostatný skill pro front-end design, typografii nebo přístupnost
v této session nebyl. U webu platí z HIG jen obecné zásady a základy, ne konvence platforem Apple.

**Hodnocení: dobré, bez kritických nálezů.** Teze návrhu: web jako cesta do dvora, zapamatovatelný je oknem
se službami a QR kódem v úvodu a pěti okny služeb.

Co obstálo:
- Kontrast a velikost ovládacích prvků. `accessibility.md › Vision`: „Strive to meet color contrast minimum
  standards." Nejnižší poměr u textu je 8,7 : 1. `accessibility.md › Mobility`: „Offer sufficiently sized controls."
  Všechny dotykové cíle mají nejméně 44 × 44 px.
- Značka ustupuje obsahu. `branding.md › Best practices`: „Resist the temptation to display your logo throughout
  your app or game unless it's essential for providing context." Logo je jen v hlavičce, v patičce a na tištěném ceníku. „Apply your app's accent color judiciously":
  smaragdová patří rezervaci a štítkům.
- Struktura nese informaci: čísla 01–04 jsou skutečné listy tištěného ceníku a kroky 1–4 skutečné pořadí cesty.
  Jinde číslování není.

Na co upozorňuji (střední závažnost):
- **Parallax ve všech sekcích je v napětí se zásadou střídmého pohybu.** `motion.md › Best practices`:
  „Add motion purposefully, supporting the experience without overshadowing it." Je to výslovné přání ze zadání
  v průběhu práce. Zmírnění: text se posouvá jen o několik procent výšky okna, výrazně se hýbou jen linky a grafika,
  a podle `motion.md`: „Make motion optional" se při omezeném pohybu nic nehýbe. Pokud by to na reálných zařízeních
  rušilo, stačí v `main.js` snížit hodnoty v objektu `pruchozi`.
- **Plynulé scrollování mění nativní chování kolečka myši.** Na dotykových displejích zůstává scroll nativní.
  Jde to vypnout odstraněním bloku `Lenis` v `main.js`, parallax bude fungovat dál.
- **Stránka je bez fotografií.** Drží díky typografii a kresbám, ale salon krásy prodávají hlavně skutečné výsledky.
  Po doplnění fotek prací se galerie sama přepne na velké rozvržení.

## Tisk

Tiskový styl vytiskne jen ceník: logo a kontakty v záhlaví, všechny tři úrovně vedle sebe, dvě strany A4.

## Co jsem neověřoval

- Skutečné nasazení na Netlify (hlavičky jsem testoval jen místně).
- Načtení QR kódu telefonem z obrazovky. Kód jsem po vygenerování strojově dekódoval zpět na správný odkaz.
- Skutečné prohlížeče Safari a Firefox. Testy běžely v Chromiu.
- Čtečku obrazovky naživo. Přístupnost ověřuje axe-core a ruční kontrola struktury.
