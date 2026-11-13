"""Sestaví podstránky (GDPR, Cookies, 404) se stejnou hlavičkou, patičkou a oknem cookies jako úvodní stránka.

Pomocný nástroj pro správu webu, web samotný žádný build nepotřebuje.
Použití (ze složky dstudio-web):  python3 tools/podstranky.py

Obsah podstránek je ve složce tools/obsah/. Po úpravě hlavičky nebo patičky v site/index.html
stačí skript spustit znovu a podstránky se srovnají.
"""
import pathlib
import re

KOREN = pathlib.Path(__file__).resolve().parent.parent
SITE = KOREN / 'site'
OBSAH = KOREN / 'tools' / 'obsah'
DOMENA = 'https://dstudio.example'

index = (SITE / 'index.html').read_text(encoding='utf-8')


def blok(zacatek, konec):
    a = index.index(zacatek)
    b = index.index(konec, a) + len(konec)
    return index[a:b]


def na_uvod(html):
    """Kotvy typu #sekce vedou z podstránek na úvodní stránku."""
    return re.sub(r'href="#(?!obsah)', 'href="/#', html)


zasobnik = blok('<svg class="zasobnik"', '</svg>')
hlavicka = na_uvod(blok('<header class="hlavicka"', '</header>'))
pata = na_uvod(blok('<footer class="pata', '</footer>'))
souhlas = blok('<!-- Souhlas s cookies a externím obsahem -->', '</section>')
lista = blok('<!-- Lišta s rezervací pro mobil -->', '</aside>')

SABLONA = '''<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulek}</title>
<meta name="description" content="{popis}">
{kanonicky}
<meta name="theme-color" content="#2B1E1A">

<link rel="preload" href="/assets/fonts/cormorant-garamond-300.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styl.css">
<noscript><link rel="stylesheet" href="/assets/css/bez-skriptu.css"></noscript>

<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<meta property="og:type" content="website">
<meta property="og:locale" content="cs_CZ">
<meta property="og:site_name" content="DSTUDIO | Beauty Salon">
<meta property="og:title" content="{titulek}">
<meta property="og:description" content="{popis}">
<meta property="og:image" content="{domena}/assets/img/og-dstudio.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logo DSTUDIO Beauty Salon na krémovém podkladu">
<meta name="twitter:card" content="summary_large_image">

<script src="/assets/js/main.js" defer></script>
<script src="/assets/js/souhlas.js" defer></script>
</head>
<body>

<a class="preskocit" href="#obsah">Přeskočit na obsah</a>

<!-- Sdílené kresby: linky z okenní fólie a šipka z cedule -->
{zasobnik}

{hlavicka}

<main id="obsah">
{obsah}
</main>

{pata}

{lista}

{souhlas}

</body>
</html>
'''

STRANKY = [
    {
        'soubor': 'gdpr/index.html',
        'obsah': 'gdpr.html',
        'titulek': 'Ochrana osobních údajů – DSTUDIO | Beauty Salon',
        'popis': 'Jak DSTUDIO | Beauty Salon (D. Y. Beauty s.r.o.) zpracovává osobní údaje návštěvníků webu a klientů salonu.',
        'kanonicky': '<link rel="canonical" href="%s/gdpr/">' % DOMENA,
    },
    {
        'soubor': 'cookies/index.html',
        'obsah': 'cookies.html',
        'titulek': 'Cookies – DSTUDIO | Beauty Salon',
        'popis': 'Přehled cookies a úložišť, která web DSTUDIO | Beauty Salon používá, a jak změnit svou volbu.',
        'kanonicky': '<link rel="canonical" href="%s/cookies/">' % DOMENA,
    },
    {
        'soubor': '404.html',
        'obsah': '404.html',
        'titulek': 'Stránka nenalezena – DSTUDIO | Beauty Salon',
        'popis': 'Tato stránka na webu DSTUDIO | Beauty Salon neexistuje.',
        'kanonicky': '<meta name="robots" content="noindex">',
    },
]

for st in STRANKY:
    html = SABLONA.format(
        titulek=st['titulek'], popis=st['popis'], kanonicky=st['kanonicky'], domena=DOMENA,
        zasobnik=zasobnik, hlavicka=hlavicka, pata=pata, lista=lista, souhlas=souhlas,
        obsah=(OBSAH / st['obsah']).read_text(encoding='utf-8').rstrip('\n'),
    )
    cil = SITE / st['soubor']
    cil.parent.mkdir(parents=True, exist_ok=True)
    cil.write_text(html, encoding='utf-8')
    print('zapsáno', st['soubor'], len(html))
