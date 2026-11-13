# Fáze 4 – Návrh (layout)

Rychlé wireframy řeší strukturu a rozvržení, ne detail. Jsou ve složce `wireframy/`:

| Soubor | Co ukazuje |
|---|---|
| `wireframy/index-1440.svg` | Úvodní stránka, desktop 1440 px |
| `wireframy/index-390.svg` | Úvodní stránka, mobil 390 px |
| `wireframy/podstranky-1440.svg` | GDPR, Cookies a 404 |

Wireframy generuje `tools/wireframy.py`, takže jdou po změně struktury snadno přegenerovat.

## Mřížka a okraje

- 12 sloupců, žlab 16–24 px, maximální šířka obsahu 1 320 px, boční okraj 20–72 px.
- Na mobilu jeden sloupec, od 900 px dvanáct sloupců.
- Obsah je zavěšený vlevo. Sekce s textem mají nadpis ve sloupcích 1–5 a text ve sloupcích 7–12;
  šestý sloupec zůstává volný a vede jím linka.

## Úmyslná porušení mřížky

- Druhá věta hlavního nadpisu je odsazená o šířku jednoho písmene M.
- Okno v úvodu je zapuštěné do čokoládového prahu a při scrollu se za něj zasouvá.
- Výrok filozofie: první řádek vlevo, druhý vpravo, přes celou šířku.
- Obří „Ceník" se ořezává o spodní hranu obalu.
- Tabule galerie jsou střídavě posunuté.

## Umístění brandingu

- Logo: hlavička vlevo (čokoládová verze, výška 28 / 34 px, ochranná zóna = výška D), patička (krémová verze na čokoládě),
  hlavička tištěného ceníku. Jinde se logo neopakuje.
- Štítek s krátkou linkou u každé sekce.
- Smaragdová: hlavní tlačítka, štítky, trasa ve schématu, plocha závěrečné výzvy.

## Místa pro vizuály

| Místo | Poměr | Poznámka |
|---|---|---|
| Okno v úvodu | 2 × 390:980 | Kresleno kódem (matná fólie, linky, služby, QR). Bez fotografie. |
| Galerie Naše práce | 4:5 | 6 označených míst, data v `galerie.json` |
| Fotografie vstupu | 4:5 | 1 označené místo v Kontaktu |
| Karty týmu | 4:5 | Připravené, v demu vypnuté |
| Schéma cesty | 640 × 520 | SVG kreslené kódem |
| OG obrázek | 1200 × 630 | Logo na krému |

## Rytmus ploch

bílá (úvod) → čokoláda (O DSTUDIO) → bílá (filozofie) → krém (Proč) → bílá (služby) → krém (práce) → bílá (tým)
→ krém (recenze) → čokoláda (obal ceníku) → krém (strany ceníku) → bílá (otázky) → krém (kontakt)
→ smaragd (výzva) → čokoláda (patička).
