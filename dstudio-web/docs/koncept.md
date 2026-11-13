# Fáze 3 – Kreativita a branding

Logo, barvy a písma zůstávají přesně podle brand booku. Slogan „Krása je v detailech. Péče v přístupu." zůstává.
Kreativní práce je v designovém systému webu.

## Tři směry

### A. „Vchod vlevo" (cesta do dvora)
Salon není vidět z ulice. Cedule říká „Vchod vlevo · Salon ve dvoře". Web je ta cesta: z ulice průchodem do dvora
až ke dveřím. Stránka je zavěšená vlevo, obsahem vede tenká linka a úvod se při scrollu zasouvá za čokoládový práh.
- Pro: nezaměnitelné, vychází ze skutečného místa; dává rozvržení pravidlo (osa vlevo, žlab jako cesta).
- Proti: samotná metafora cesty by bez silného grafického motivu zůstala jen v textu.

### B. „Pět oken"
Výloha salonu má pět oken s matnou fólií a jemnými linkami. Pět oken = pět služeb. Okna jako hlavní navigační prvek.
- Pro: přesně podle brand booku (str. 16), okamžitě čitelné.
- Proti: jako jediný nosný prvek by okna unavila; do textových sekcí se nehodí.

### C. „Tiskovina"
Web jako dobře vysázený ceník: čokoládový obal, krémové vnitřní strany, štítky `01 / NAIL CARE`, patičky s číslem listu.
- Pro: ceník je nejpropracovanější tiskovina značky a nejdůležitější obsah webu.
- Proti: celý web v podobě brožury by byl suchý a zaměnitelný s jinými „editorial" weby.

## Vybraný koncept: „Vchod vlevo"

**Směr A nese celek, B a C jsou jeho kapitoly.** Cesta vede z ulice (úvod s oknem č. 1) přes čokoládový práh do dvora,
kde je pět oken (služby), a končí u tištěného ceníku a u cedule na dveřích (kontakt).

Hlavní myšlenka: *DSTUDIO je salon ve dvoře. Kdo ví, kudy jít, najde místo, kde se věnují detailům.*
Web proto nepůsobí jako výloha na hlavní třídě, ale jako klidný dvůr: hodně bílé, tenké linky, matné plochy.

### Proč to projde testem zaměnitelnosti
Po výměně loga a barev by stránka jinému salonu neseděla, protože stojí na věcech, které má jen DSTUDIO:
okno se službami a QR kódem je přepis skutečné výlohy, tabule mají poměr 390 × 980 z výrobního výkresu,
kontakt je cedule ze dveří, schéma vede průchodem do dvora a vlevo a ceník drží strukturu i patičky tištěného ceníku.

## Typografický systém

| Role | Písmo | Použití |
|---|---|---|
| Nadpisy | Cormorant Garamond Light | H1 až 108 px, H2 až 72 px, obří „Ceník" až 336 px; těsné řádkování, mírně stažené prostrkání, optické zarovnání levého okraje |
| Text | Inter Regular 17 px / 1,65 | odstavce, ceny, kontakty |
| Akcent | Inter Medium, Semibold | tlačítka, názvy v ceníku, popisky |
| Štítky | Inter Medium 11–12 px, verzálky, prostrkání 0,22 em | `O DSTUDIO`, `01 / NAIL CARE`, patičky |

- Dva velké typografické okamžiky: výrok filozofie přes celou šířku (dva řádky, druhý zarovnaný vpravo) a obří „Ceník"
  na čokoládovém obalu, jehož spodek se ořezává o hranu krémových stran.
- Ceny mají tabulkové číslice a jsou zarovnané vpravo do sloupců.
- Česká typografie: pevné mezery po jednopísmenných předložkách a spojkách, „1 190 Kč" s úzkou pevnou mezerou
  a pevnou mezerou před Kč, půlčtvrtčárka v rozsazích, české uvozovky.

## Grafické motivy

1. **Štítek s krátkou linkou** nad malým nápisem (z cedule „VE DVOŘE"). Označuje každou sekci.
2. **Linky z okenní fólie.** Ručně kreslené křivky v béžové. V oknech služeb a v místech pro fotografie navazují
   přes hrany tabulí ve stejné výšce, stejně jako na skutečných oknech. V textových sekcích vede jedna linka
   volným žlabem mezi sloupci (cesta dolů stránkou) a nikdy nekříží běžný text.
3. **Okenní tabule 390 × 980.** Okno v úvodu a pět oken služeb.
4. **Cedule na dveře.** Tři sloupce oddělené svislou linkou: adresa, otevírací doba, telefon.
5. **Tiskovina.** Čokoládový obal a krémové strany ceníku, patičky `DSTUDIO / CENY V Kč` s číslem listu.
6. **Zrno matného papíru** na krémových plochách (SVG šum, kolem 3 %).
7. **Šipka z cedule** u odkazů a na stránce 404.

Barevná pravidla: smaragdová patří rezervaci (hlavní tlačítko), štítkům a trase ve schématu; béžová jen linkám,
plochám a textu na tmavém podkladu. Žádné přechody, stíny ani zaoblení.

## Pohyb

- **Parallax vrstvy** (GSAP ScrollTrigger + Lenis) podle komponenty, kterou vybral klient: scéna
  `data-parallax-layers` a vrstvy `data-parallax-layer="1"–"4"`. V úvodu vrstvy odjíždějí o 70 / 55 / 40 / 10 %
  výšky scény (linky, okno, text, práh) a úvod se zasouvá za čokoládový práh. V ostatních sekcích stejný mechanismus
  s menším rozsahem, aby text zůstal čitelný.
- **Úvodní okamžik:** linka se dokreslí, věty nadpisu vyjedou, tabule okna se objeví.
- **Dokreslování linek** a jemné odhalení obsahu při příchodu do záběru. Trasa ve schématu se kreslí přes
  `stroke-dashoffset`.
- Při `prefers-reduced-motion` se knihovny vůbec nenačtou a stránka je statická.

## Co nedělám

- Žádné fotky lidí, rukou ani nehtů, které by nebyly skutečné. Žádné smyšlené recenze, jména ani čísla.
- Žádné ikonové sady, emoji, karty se stínem, přechody, sklo, zaoblené rohy.
- Žádný vycentrovaný hero se třemi kartami. Obsah je zavěšený vlevo, mřížka se porušuje úmyslně
  (odsazená druhá věta nadpisu, okno zapuštěné do prahu, posunuté tabule galerie).
- Logo nikdy nesázím písmem a nepřebarvuji mimo tři schválené verze.
- Žádný nový odstín mimo pět barev palety.
