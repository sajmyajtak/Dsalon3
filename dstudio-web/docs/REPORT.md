# REPORT – web DSTUDIO | Beauty Salon

Stav: fáze 1–8 hotové. Složka `site/` je připravená k nasazení bez dalších úprav kódu,
po doplnění domény a obsahu od klienta (viz Před spuštěním).

Náhledy: `docs/nahledy/`. Místní spuštění: `node tools/nahled-server.js 8080`.

## 1. Koncept: „Vchod vlevo"

DSTUDIO je salon ve dvoře a cedule u průchodu říká „Vchod vlevo · Salon ve dvoře". Web je ta cesta: z ulice přes
čokoládový práh do dvora, k pěti oknům a ke dveřím s cedulí. Úvod je přepis skutečné výlohy: dvě matné tabule
v poměru 390 × 980, vlevo služby, vpravo rezervace s funkčním QR kódem. Pět služeb je pět oken, přes která navazují
linky z fólie, a vybrané okno „zprůhlední". Ceník je vysázený jako tištěný ceník značky s čokoládovým obalem,
krémovými stranami a patičkami `DSTUDIO / CENY V Kč`. Kontakt je cedule ze dveří se třemi sloupci a schéma cesty
průchodem do dvora.

Podrobně: `koncept.md`.

## 2. Struktura a pořadí sekcí

One-pager + GDPR + Cookies + 404. Pořadí sekcí je přesně podle zadání:

Úvod → O DSTUDIO → Naše filozofie → Proč DSTUDIO → Služby → Naše práce → Náš tým → Recenze → Ceník →
Časté otázky → Kontakt → Závěrečná výzva → Patička.

### Odchylky od zadání

| Odchylka | Důvod |
|---|---|
| **Parallax ve všech sekcích.** Zadání říkalo „žádné všudypřítomné paralaxy". | Váš pozdější pokyn během práce: použít parallax komponentu a použít ji všude, ne jen v úvodu. Text má jen malý posun, výrazně se hýbou linky a grafika. Při omezeném pohybu se efekt vypne. |
| **Komponenta není vložená jako React/shadcn/Tailwind.** | Zadání chce statický web bez frameworku a bez buildu. Přenesl jsem její mechanismus do vanilla JS se stejnými atributy `data-parallax-layers` / `data-parallax-layer` a se stejnými knihovnami (GSAP ScrollTrigger, Lenis), uloženými lokálně. |
| **Bez obrázků z CDN, Unsplash a ikon Lucide,** které zmiňoval návod ke komponentě. | Zadání zakazuje převzatý obsah a ikonové sady. Vrstvy jsou vlastní SVG a HTML. |
| **Balíček `lenis` místo `@studio-freight/lenis`.** | Starý balíček je přejmenovaný a označený jako zastaralý, jde o tutéž knihovnu. |
| **Žádný generovaný obrázek.** | Higgsfield nebyl dostupný (viz bod 6). |
| **Zrno papíru má asi 2,5 % místo 3–4 %.** | Při 4 % se krémová viditelně posouvala do šeda a přestávala odpovídat #F4EFEA. |
| **Navíc soubor `_headers`** vedle `netlify.toml`. | `netlify.toml` Netlify nečte při nahrání složky přetažením, `_headers` ano. |
| **Navíc `README.md` a složka `tools/`.** | Náhled, kontrola a skládání podstránek. Web je k provozu nepotřebuje. |
| **CSS a JS nejsou minifikované.** | Bez buildu a kvůli čitelnosti. Lighthouse to vytýká jako úsporu asi 5 kB. |

## 3. Placeholdery

Všechny mají atribut `data-placeholder`. Najdete je hledáním tohoto atributu v prohlížeči
(`document.querySelectorAll('[data-placeholder]')`), protože dva ze tří druhů vznikají z datových souborů.

| Kde | `data-placeholder` | Počet | Co dodat | Kam |
|---|---|---|---|---|
| Naše práce | `galerie-foto` | 6 | skutečné fotky prací, svisle 4:5, ideálně 1200 × 1500 px, s popisem | `site/data/galerie.json` + `site/assets/img/galerie/` (.avif, .webp, .jpg) |
| Recenze | `recenze` | 3 | text recenze, jméno, služba; jen skutečné a se souhlasem | `site/data/recenze.json` |
| Kontakt, cesta | `foto-vstupu` | 1 | fotografie vstupu do salonu, svisle 4:5 | `site/index.html`, blok `cesta__foto` |

Další místa, která čekají na podklady, ale nejsou vidět jako placeholder:

| Co | Stav | Kam |
|---|---|---|
| Karty specialistek | vypnuté | `site/data/tym.json`, `zobrazitClenky: true` |
| Doména | zástupná `https://dstudio.example` | viz Před spuštěním |
| E-mail, DIČ | neuvedeno | GDPR, patička |

## 4. Předpoklady

1. **Favicon** je písmeno D vyříznuté z vektoru loga, krémové na čokoládovém čtverci.
2. **Název** je v textech klienta sjednocen na „DSTUDIO". Jinak jsou texty doslova, včetně dlouhých pomlček „—".
3. **Logo** je vytažené ze strany 1 brand booku jako vektor. Proporce 620 : 159 souhlasí se stranou 19.
4. **Smaragdová** slouží hlavním tlačítkům, štítkům sekcí (stejně jako v záhlaví stran brand booku) a trase ve schématu.
5. **Doplněné texty** (Služby, Časté otázky, nadpisy „Pět oken, pět směrů péče" a „Než k nám přijdete", stránka 404)
   jsem napsal jen z faktů v brand booku a v ceníku.
6. **Popisy služeb** vycházejí z položek ceníku. Cena „od" se u každé služby počítá z `cenik.json`.
7. **Úrovně Middle · Senior · Top:** web říká jen to, že se podle úrovně liší cena. Co je odlišuje, v podkladech není.
8. **QR kód** v úvodu jsem vygeneroval pro čistý odkaz `https://noona.app/dstudio` a strojově ověřil.
   Na mobilu se nezobrazuje, tam je místo něj odkaz.
9. **Instagram** vede na `https://www.instagram.com/dstudio_cz/` (odvozeno z @dstudio_cz).
10. **Mapa** je vložená mapa Google hledaná podle adresy, bez klíče, až po souhlasu. Odkazy vedou do Mapy.cz a Map Google.
    Souřadnice jsem nedohledával.
11. **Schéma cesty** je orientační: ulice → průchod → dvůr → vchod vlevo, podle formulace v zadání. Není v měřítku.
12. **Adresa v GDPR** je uvedena jako „Adresa", ne jako sídlo. Sídlo jsem v rejstříku neověřoval.
13. **Hosting** je v GDPR popsaný obecně jako „poskytovatel hostingu".
14. **Ceník:** na mobilu je výchozí úroveň Middle, od 760 px všechny tři vedle sebe. Ceny se píší „1 190 Kč".
15. **Galerie** se bez fotek zobrazuje jako úsporná řada šesti míst, s fotkami se sama přepne na velké rozvržení.
16. **Věta „Další fotografie najdete na Instagramu"** vychází z toho, že brand book popisuje feed s fotkami prací.
17. **Odpovědný vedoucí** je jen v patičce.
18. **Rok 2026** v patičce je napsaný napevno.
19. **Otázka o pánské manikúře a pedikúře** ve FAQ vychází z položek ceníku.
20. **Stránka Cookies** uvádí jediné úložiště (`dstudio-souhlas` v localStorage). Web sám žádné cookies nenastavuje.

## 5. Výsledky kontroly

| Oblast | Výsledek |
|---|---|
| Automatická kontrola | 295 kontrol, 0 chyb |
| Lighthouse, úvod, mobil | výkon 97 · přístupnost 100 · osvědčené postupy 100 · SEO 100 |
| Lighthouse, úvod, desktop | 100 · 100 · 100 · 100 |
| Lighthouse, GDPR a Cookies, mobil | 99 · 100 · 100 · 100 |
| axe-core (WCAG 2.2 AA) | 0 porušení |
| Responsivita | 320, 390, 768, 1024, 1440 px bez vodorovného posuvu |
| Odkazy | Noona, Instagram, telefon, mapy a všechny kotvy v pořádku |
| Cookies | 10 scénářů prošlo (odmítnutí nic nenačte, volba přežije reload, znovuotevření funguje) |
| Kontrast | veškerý text nejméně 8,7 : 1 |
| Zmínka o AI na webu | žádná |
| Barvy mimo paletu | žádné |

Podrobně včetně toho, co jsem neověřoval: `kontrola.md`.

**Neověřeno:** ostré nasazení na Netlify, Safari a Firefox, čtení QR kódu telefonem z obrazovky, čtečka obrazovky naživo.

## 6. Higgsfield

**0 generací ze 3.** Účet je na bezplatném plánu s nulovým kreditem. První pokus o hlavní vizuál skončil chybou
„Requires basic plan or higher" a úloha se nespustila. Nákup kreditů jsem bez vás nedělal.

Všechny vizuály jsou proto kreslené kódem: okno v úvodu s QR kódem, linky z fólie, pět oken služeb, zrno papíru,
schéma cesty, místa pro fotografie, favicon a OG obrázek. Prompt pro atmosférické zátiší je připravený
v `source-assets/prompt-hero.txt`, kdybyste ho chtěli po doplnění kreditů použít.

Podrobně: `generace.md`.

## 7. Otevřené otázky

**Právní a firemní**
1. E-mail a DIČ pro právní část a patičku.
2. Je Milady Horákové 398/30 sídlo společnosti, nebo jen provozovna?
3. Kdo bude poskytovatel hostingu (Netlify)? Doplním ho jménem do GDPR.
4. Texty GDPR a Cookies doporučuji nechat projít právníkem.

**Doména a jazyky**
5. Doména. Do té doby je všude `https://dstudio.example`.
6. Jazykové verze (CZ / UA / EN)? Brand book zmiňuje ukrajinský a anglický ceník.

**Ceník a služby**
7. Design nehtů: je cena za nehet, nebo za sadu? Podklady to neříkají.
8. Co odlišuje úrovně Middle, Senior a Top kromě ceny?
9. Má web ukazovat dárkový poukaz a kurzy pro mistry? Pokud ano, jak se objednávají?
10. Storno podmínky, platební metody a délky procedur (do častých otázek).

**Obsah od klienta**
11. Jména, úrovně, zaměření a fotky specialistek.
12. Skutečné fotky prací (4:5).
13. Recenze se souhlasem autorek.
14. Fotografie vstupu. A sedí schéma cesty (průchod, dvůr, vchod vlevo)? Je třeba něco doplnit, třeba zvonek nebo patro?

**Vzhled a chování**
15. Vyhovuje síla parallaxu a plynulé scrollování (Lenis), nebo je ubrat?
16. Má v úvodu zůstat QR kód?
17. Chcete atmosférický vizuál z Higgsfieldu (po doplnění kreditů), nebo zůstat u grafiky kreslené kódem?
18. Chcete měření návštěvnosti? Háček po souhlasu je připravený, nástroj není nasazený.
19. Mapa: stačí Google, nebo raději Mapy.cz?

## Před spuštěním

1. Nahradit `https://dstudio.example` skutečnou doménou v souborech `site/index.html` (canonical, og:url, og:image,
   JSON-LD), `site/robots.txt`, `site/sitemap.xml` a v `tools/podstranky.py` (proměnná `DOMENA`), potom spustit
   `python3 tools/podstranky.py`.
2. Doplnit obsah od klienta do datových souborů (bod 3).
3. Doplnit e-mail, DIČ a poskytovatele hostingu do `tools/obsah/gdpr.html` a přegenerovat podstránky.
4. Na ostré adrese ověřit hlavičky a vyzkoušet QR kód telefonem.
5. Aktualizovat datum v `sitemap.xml`.

## Čas

Odhad z úvodu byl 3–3,5 hodiny. Čistá práce trvala zhruba 1 hodinu 40 minut (asi 00:58–02:10 a 04:10–04:35 UTC).
Mezi tím session po restartu kolem dvou hodin stála. Rychlejší to bylo hlavně proto, že odpadla generace obrázků
a čekání na ni.
