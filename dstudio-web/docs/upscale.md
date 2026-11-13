# Fáze 7 – Upscale (revize)

Po prvním kompletním průchodu jsem celý web prošel ve screenshotech (desktop 1440, tablet 768 a 1024, mobil 390)
a zásadnější nálezy neřešil záplatou, ale přehodnocením celého prvku.

## 1. Linky křížily běžný text

**Nález:** Linky z fólie vedly přes odstavce a na mobilu, kde se široká kresba smáčkne, byly skoro svislé.

**Přehodnocení celého systému linek** místo posouvání jednotlivých křivek:
- Linky smí být jen v grafice (okna, místa pro fotografie) a pod velkou typografií (úvod, filozofie, obal ceníku, výzva).
- V sekcích se dvěma sloupci vede jediná linka volným žlabem mezi nadpisem a textem. Je to zároveň „cesta" stránkou.
- Křivky opouštějí sekci horní nebo spodní hranou, nikdy nekončí uprostřed plochy.
- Na mobilu se kreslí jen v horní části sekce za nadpisem a v širším výřezu, aby zůstaly ploché.

## 2. Parallax ve všech sekcích (změna zadání v průběhu)

Během práce přišel pokyn použít parallax komponentu (GSAP ScrollTrigger + Lenis) a potom ji použít všude.
Místo přilepení efektu na hotový úvod jsem úvod přestavěl na scénu se čtyřmi vrstvami a stejný mechanismus
zavedl do všech sekcí i na podstránky.

- Komponenta je React/Tailwind/shadcn. Zadání ale chce statický web bez frameworku a bez buildu, proto jsem
  přenesl její mechanismus do vanilla JS (stejné atributy `data-parallax-layers` a `data-parallax-layer`,
  stejná časová osa se `scrub`, stejné napojení Lenis na `gsap.ticker`). Knihovny jsou uložené lokálně.
- Obrázky z cizího CDN, fotky z Unsplash a ikony Lucide jsem nepoužil, protože zadání převzatý obsah a ikonové sady
  zakazuje. Vrstvy jsou vlastní SVG a HTML.
- První verze měla vadu: čokoládový práh pod úvodem se při scrollu ořezával v půlce textu. Úvod teď má vlastní výřez
  a práh leží nad následující sekcí, takže zůstává celý.
- Plynulé scrollování rozbilo odkazy na kotvy (dojížděly o 200 px vedle, protože se sčítaly dva odstupy).
  Odstup má teď jediný zdroj (`scroll-padding-top`) a kotvy řídí vlastní obsluha.
- Původní zadání říkalo „žádné všudypřítomné paralaxy". Řídím se novějším pokynem; aby se text dal číst,
  mají textové bloky jen malý posun a výrazně se hýbou jen linky a grafika. Při omezeném pohybu se efekt vypne.

## 3. Galerie z prázdných rámečků

**Nález:** Šest velkých prázdných rámečků 4:5 zabíralo přes 1 300 px výšky a stránka působila nehotově.

**Řešení:** Galerie má dva režimy. Dokud v ní nejsou fotografie, zobrazí se úsporná řada šesti menších tabulí,
přes které navazuje jedna kresba linek. Jakmile do `galerie.json` přibude první fotka, přepne se na velké rozvržení
ve třech sloupcích. Nic se nemusí přenastavovat.

## 4. Ceník

- Titul „Ceník služeb" se překrýval s textem vpravo. Štítek teď nese celý název a obří slovo je jen „Ceník".
- Levý list byl o 480 px kratší než pravý sloupec. Prázdné místo vyplňuje závěrečný text
  „Middle · Senior · Top – Tři úrovně specialistů…", stejně jako v tištěném ceníku.
- Tisk se rozpadal na čtyři strany s prázdnou první. Tiskový styl je přepsaný na dva plynulé sloupce: dvě strany A4.
- Na mobilu zabíral přepínač úrovně dva řádky. Teď má jeden řádek přes celou šířku.

## 5. Věrnost brand booku

- Zrno posouvalo krémovou viditelně do šeda. Je slabší (kolem 2,5 %), aby krémová zůstala krémovou.
- Stránka 404 měla béžové číslice na krému, což brand book nedovoluje. Je na čokoládovém podkladu.
- Podtržení odkazů bylo udělané přes `linear-gradient`. I když šlo o plnou barvu, nahradil jsem ho pseudo-prvkem,
  aby v kódu nebyl jediný přechod.
- Ochrannou zónu loga v patičce rušil záporný okraj. Opraveno.

## 6. Přístupnost

- Panely služeb měly roli `tabpanel` na prvku `<article>`, což není povolená kombinace. Jsou to `<div>`.
- Tabulka na stránce Cookies se na mobilu posouvá do strany, proto je dostupná z klávesnice a má popisek.
- Mobilní lišta s rezervací nebyla v žádném landmarku. Je to `<aside>` s popiskem.
- Odkazy v patičce, v ceduli a v pruhu pod úvodem měly menší dotykovou plochu než 44 px. Zvětšeno.
- Tlačítka „Přijmout vše" a „Odmítnout nepovinné" měla na mobilu různou výšku. Jsou stejná.

## 7. Drobnosti

- Řádek služeb v úvodu se na mobilu lámal s osamocenou tečkou na začátku řádku. Má řízený zlom.
- Cedule na tabletu lámala „9:00–19:00". Tři sloupce jsou až od 900 px a časový rozsah se nezalamuje.
- Popisky ve schématu cesty byly na mobilu nečitelně malé a jeden překrýval trasu. Zvětšeno a přeskládáno.
