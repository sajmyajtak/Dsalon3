# Fáze 5 – Generace podkladů

## Higgsfield: 0 generací ze 3

Higgsfield nebyl k dispozici. Účet je na bezplatném plánu s nulovým zůstatkem kreditů a první pokus o generaci
hlavního vizuálu skončil chybou „Requires basic plan or higher". Úloha se vůbec nespustila, takže se nespotřeboval
žádný ze tří povolených běhů. Bezplatné generace tento konektor nenabízí a nákup kreditů nebo plánu je finanční
rozhodnutí, které nedělám bez vás.

Podle zadání pro tento případ je celý web postavený na grafice kreslené kódem a na označených místech pro fotografie.

Připravený prompt pro hlavní vizuál (pro případ, že kredity doplníte) je uložený v `source-assets/prompt-hero.txt`.
Šlo by o zátiší bez lidí a bez rukou: matná omítka, složený len, keramika, jeden smaragdový akcent, měkké denní světlo.
Sloužilo by jen jako atmosféra, nikdy jako „naše práce" nebo „náš interiér".

## Co je místo toho nakresleno kódem

| Vizuál | Technika | Kde |
|---|---|---|
| Okno č. 1 (dvě tabule 390 × 980, matná fólie, služby, rezervace, QR) | HTML + CSS + SVG | úvod |
| QR kód na `https://noona.app/dstudio` | SVG, vygenerováno a zpětně dekódováno (`tools/qr-build.py`) | úvod |
| Linky z okenní fólie | ručně psané SVG křivky | úvod, filozofie, služby, galerie, obal ceníku, výzva, podstránky |
| Pět oken služeb s navazujícími linkami | CSS mřížka + jedno SVG rozdělené na pět výřezů | služby |
| Zrno matného papíru | SVG `feTurbulence` | krémové plochy |
| Schéma cesty do dvora | SVG, trasa se dokresluje | kontakt |
| Místa pro fotografie | CSS + SVG | galerie, kontakt |
| Favicon | písmeno D vyříznuté z vektoru loga | všude |
| OG obrázek 1200 × 630 | logo na krému, vyrenderováno z vektoru (`tools/render-assets.js`) | sdílení |

## Logo

Vytaženo z brand booku (strana 1) příkazem `pdftocairo -svg`, očištěno na jednu `<path>` bez pozadí a bez textových
objektů (`tools/logo-build.py`). Tvar křivek se nemění, jen se posouvá počátek souřadnic a zaokrouhluje na dvě desetinná
místa. Barva vychází přesně #2B1E1A, poměr stran 619,89 × 159,21 souhlasí s rozměrem znaku 620 × 159 mm na straně 19.

- `site/assets/svg/dstudio-logo-{chocolate,cream,white}.svg` – těsný výřez pro web
- `source-assets/logo/*-s-ochrannou-zonou.svg` – verze s ochrannou zónou (výška D) zapečenou do výřezu
- `source-assets/logo/dstudio-pismeno-D.svg` – písmeno D pro favicon

## Písma

Inter (400, 500, 600) a Cormorant Garamond (300) z npm balíčků s plnými soubory, oříznuté na latinku
a rozšířenou latinku A (`tools/fonts-build.sh`). Jeden soubor na řez, takže kerning funguje i mezi písmeny
s diakritikou a bez ní. Celkem 82 kB, hostováno lokálně, `font-display: swap`, záložní řezy mají srovnané metriky.
