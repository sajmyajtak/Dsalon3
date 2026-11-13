"""Sestaví kopii webu pro náhled v prohlížeči artefaktů (claude.ai).

Rozdíly proti složce site/: relativní cesty, písma vložená přímo do CSS, místo vložené mapy odkaz,
bez tlačítka pro tisk. Ostrý web se tím nemění.
Použití (ze složky dstudio-web):  python3 tools/nahled-artefakt.py [výstupní složka]
Hlavní stránka je <výstup>/index.html (bez obalu <html>, ten doplní prohlížeč artefaktů),
ostatní soubory se publikují jako přílohy se stejnými cestami.
"""
import base64
import pathlib
import re
import shutil
import sys

SITE = pathlib.Path(__file__).resolve().parent.parent / 'site'
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/dstudio-artefakt')

if OUT.exists():
    shutil.rmtree(OUT)
for d in ['assets/css', 'assets/js', 'assets/svg', 'assets/vendor', 'data', 'gdpr', 'cookies']:
    (OUT / d).mkdir(parents=True)

# ---- plain copies
for f in ['assets/svg/dstudio-logo-chocolate.svg', 'assets/svg/dstudio-logo-cream.svg', 'assets/svg/qr-noona.svg',
          'assets/svg/zrno.svg', 'assets/vendor/gsap.min.js', 'assets/vendor/ScrollTrigger.min.js',
          'assets/vendor/lenis.min.js', 'assets/vendor/LICENSE-lenis.txt',
          'data/cenik.json', 'data/galerie.json', 'data/tym.json', 'data/recenze.json', 'data/faq.json']:
    shutil.copy(SITE / f, OUT / f)

# ---- stylesheet: fonts inlined as data URIs
css = (SITE / 'assets/css/styl.css').read_text()


def inline_font(m):
    data = (SITE / 'assets/fonts' / m.group(1)).read_bytes()
    return 'url("data:font/woff2;base64,%s")' % base64.b64encode(data).decode()


css, n = re.subn(r'url\("\.\./fonts/([^"]+\.woff2)"\)', inline_font, css)
assert n == 4, n
(OUT / 'assets/css/styl.css').write_text(css)

(OUT / 'assets/css/artefakt.css').write_text('''/* Úpravy pro náhled v prohlížeči artefaktů */
.hlavicka { top: env(safe-area-inset-top, 0px); }
body::before {
  content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px);
  z-index: 70; background: var(--white);
}
.cenik__lista { top: calc(var(--hlavicka-v) + env(safe-area-inset-top, 0px)); }
.hlavicka.je-schovana ~ main .cenik__lista { top: env(safe-area-inset-top, 0px); }
/* Tisk a vložená mapa v náhledu nefungují */
[data-tisk] { display: none !important; }
.mapa__nahled { aspect-ratio: auto; padding: clamp(1.25rem, 3vw, 2rem); font-size: var(--vel-s); max-width: 46em; }
.mapa__nahled a { text-decoration: underline; text-decoration-color: var(--beige); }
''')

# ---- scripts
js = (SITE / 'assets/js/main.js').read_text()
a = "  var koren = d.documentElement;\n"
assert a in js
js = js.replace(a, a + "  /* Kořen webu odvozený z umístění tohoto skriptu, aby cesty fungovaly z libovolné složky. */\n"
                     "  var KOREN = new URL('../../', (d.currentScript || {}).src || location.href).href;\n"
                     "  koren.lang = 'cs';\n", 1)
n = js.count("nacti('/data/")
js = js.replace("nacti('/data/", "nacti(KOREN + 'data/")
assert n == 5, n
a = "var zaklad = '/assets/vendor/';"
assert a in js
js = js.replace(a, "var zaklad = KOREN + 'assets/vendor/';")
assert "'/assets" not in js and "'/data" not in js
(OUT / 'assets/js/main.js').write_text(js)

js = (SITE / 'assets/js/souhlas.js').read_text()
i = js.index("      var ram = blok.querySelector('iframe');")
j = js.index("      } else if (!povoleno && ram) {")
js = js[:i] + '''      var ram = blok.querySelector('.mapa__ram');
      if (povoleno && !ram) {
        /* V náhledu nelze vkládat cizí stránky, místo mapy je odkaz. */
        ram = d.createElement('p');
        ram.className = 'mapa__ram mapa__nahled';
        ram.textContent = 'Souhlas je uložený. V tomto náhledu se vložená mapa nezobrazuje, na ostrém webu se zde načte mapa Google. ';
        var odkaz = d.createElement('a');
        odkaz.href = 'https://www.google.com/maps/search/?api=1&query=Milady+Hor%C3%A1kov%C3%A9+398%2F30%2C+170+00+Praha+7';
        odkaz.target = '_blank';
        odkaz.rel = 'noopener';
        odkaz.textContent = 'Otevřít v Mapách Google';
        ram.appendChild(odkaz);
        blok.appendChild(ram);
        if (vyzva) vyzva.hidden = true;
''' + js[j:]
(OUT / 'assets/js/souhlas.js').write_text(js)

# ---- main page: fragment without doctype/html/head/body
src = (SITE / 'index.html').read_text()
body = src[src.index('<body>') + len('<body>'):src.index('</body>')]
body = body.replace('src="/assets/', 'src="assets/')
body = body.replace('href="/gdpr/"', 'href="gdpr/index.html"').replace('href="/cookies/"', 'href="cookies/index.html"')
body = body.replace('href="/"', 'href="#uvod"')
assert 'href="/' not in body and 'src="/' not in body, re.findall(r'(?:href|src)="/[^"]*"', body)[:5]
page = '''<title>DSTUDIO Beauty Salon</title>
<link rel="stylesheet" href="assets/css/styl.css">
<link rel="stylesheet" href="assets/css/artefakt.css">
<script src="assets/js/main.js" defer></script>
<script src="assets/js/souhlas.js" defer></script>
''' + body
(OUT / 'index.html').write_text(page)

# ---- subpages: full documents with relative paths
for name in ['gdpr', 'cookies']:
    s = (SITE / name / 'index.html').read_text()
    s = re.sub(r'<link rel="canonical"[^>]*>\n', '', s)
    s = re.sub(r'<link rel="preload"[^>]*>\n', '', s)
    s = re.sub(r'<noscript><link[^>]*></noscript>\n', '', s)
    s = re.sub(r'<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*>\n', '', s)
    s = re.sub(r'<meta property="og:[^>]*>\n', '', s)
    s = re.sub(r'<meta name="twitter:card"[^>]*>\n', '', s)
    s = s.replace('content="width=device-width, initial-scale=1"', 'content="width=device-width, initial-scale=1, viewport-fit=cover"')
    s = s.replace('<link rel="stylesheet" href="/assets/css/styl.css">',
                  '<link rel="stylesheet" href="../assets/css/styl.css">\n<link rel="stylesheet" href="../assets/css/artefakt.css">')
    s = s.replace('src="/assets/', 'src="../assets/')
    s = s.replace('href="/#', 'href="../index.html#')
    s = s.replace('href="/gdpr/"', 'href="../gdpr/index.html"').replace('href="/cookies/"', 'href="../cookies/index.html"')
    s = s.replace('href="/"', 'href="../index.html"')
    left = re.findall(r'(?:href|src|content)="/[^"]*"', s)
    assert not left, left[:5]
    assert 'dstudio.example' not in s
    (OUT / name / 'index.html').write_text(s)

files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob('*') if p.is_file() and p.name not in ('index.html', 'test.html') or str(p.relative_to(OUT)) in ('gdpr/index.html', 'cookies/index.html'))
print(len(files), 'supporting files')
for f in files:
    print(' ', f, (OUT / f).stat().st_size)
print('page', (OUT / 'index.html').stat().st_size)
