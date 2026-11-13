// Automatická kontrola webu (fáze 8): odkazy, responsivita, cookies, přístupnost, parallax, obsah.
// Použití: nejdřív spustit náhled (node tools/nahled-server.js 8765), potom
//          node tools/kontrola.js [http://localhost:8765]
// Vyžaduje Playwright s prohlížečem Chromium.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ZAKLAD = process.argv[2] || 'http://localhost:8765';
const STRANKY = ['/', '/gdpr/', '/cookies/', '/tato-stranka-neexistuje'];
const SIRKY = [320, 390, 768, 1024, 1440];
const NOONA = 'https://noona.app/dstudio';
const vysledky = [];
let chyb = 0;

function zapis(ok, nazev, detail) {
  if (!ok) chyb++;
  vysledky.push((ok ? 'OK   ' : 'CHYBA') + ' ' + nazev + (detail ? ' — ' + detail : ''));
}

const souhlasOdmitnut = () => {
  try { localStorage.setItem('dstudio-souhlas', JSON.stringify({ v: 1, cas: Date.now(), analyticke: false, externi: false })); } catch (e) {}
};

(async () => {
  const browser = await chromium.launch();

  // 1) Konzole, CSP a přetečení do šířky na všech stránkách a šířkách
  for (const sirka of SIRKY) {
    const ctx = await browser.newContext({ viewport: { width: sirka, height: 800 } });
    await ctx.addInitScript(souhlasOdmitnut);
    for (const cesta of STRANKY) {
      const page = await ctx.newPage();
      const hlasky = [];
      page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') hlasky.push(m.text()); });
      page.on('pageerror', e => hlasky.push('pageerror: ' + e.message));
      const odpoved = await page.goto(ZAKLAD + cesta, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 700) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(40); }
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      const ocekavany = cesta.includes('neexistuje') ? 404 : 200;
      zapis(odpoved.status() === ocekavany, `stav ${cesta} @${sirka}`, String(odpoved.status()));
      zapis(m.sw <= m.cw, `bez vodorovného posuvu ${cesta} @${sirka}`, `${m.sw}/${m.cw}`);
      const relevantni = hlasky.filter(h => !(ocekavany === 404 && /404/.test(h)));
      zapis(relevantni.length === 0, `konzole bez chyb ${cesta} @${sirka}`, relevantni.join(' | ').slice(0, 300));
      await page.close();
    }
    await ctx.close();
  }

  // 2) Odkazy, nadpisy, obrázky
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(souhlasOdmitnut);
    const externi = new Set();
    for (const cesta of STRANKY) {
      const page = await ctx.newPage();
      await page.goto(ZAKLAD + cesta, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const data = await page.evaluate(() => {
        const odkazy = [...document.querySelectorAll('a[href]')].map(a => ({
          href: a.getAttribute('href'), target: a.target, rel: a.rel, text: a.textContent.trim().slice(0, 50)
        }));
        return {
          odkazy,
          h1: document.querySelectorAll('h1').length,
          nadpisy: [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]),
          obrazky: [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), alt: i.hasAttribute('alt'), w: i.hasAttribute('width'), h: i.hasAttribute('height') })),
          ids: [...document.querySelectorAll('[id]')].map(e => e.id),
          lang: document.documentElement.lang,
          title: document.title,
          popis: (document.querySelector('meta[name=description]') || {}).content || ''
        };
      });
      zapis(data.h1 === 1, `jedno H1 ${cesta}`, String(data.h1));
      let skok = false;
      data.nadpisy.forEach((n, i) => { if (i && n > data.nadpisy[i - 1] + 1) skok = true; });
      zapis(!skok, `pořadí nadpisů ${cesta}`, data.nadpisy.join(''));
      zapis(data.lang === 'cs', `lang=cs ${cesta}`);
      zapis(data.title.length > 10 && data.popis.length > 50, `title a description ${cesta}`, `${data.title.length}/${data.popis.length}`);
      zapis(data.obrazky.every(o => o.alt && o.w && o.h), `obrázky mají alt, width, height ${cesta}`, JSON.stringify(data.obrazky.filter(o => !(o.alt && o.w && o.h))));
      const duplicity = data.ids.filter((id, i) => data.ids.indexOf(id) !== i);
      zapis(duplicity.length === 0, `unikátní id ${cesta}`, duplicity.join(','));
      for (const o of data.odkazy) {
        const h = o.href;
        if (h.startsWith('#')) {
          zapis(data.ids.includes(h.slice(1)), `kotva ${h} na ${cesta}`);
        } else if (h.startsWith('/#')) {
          const p2 = await ctx.newPage();
          await p2.goto(ZAKLAD + '/', { waitUntil: 'networkidle' });
          await p2.waitForTimeout(400);
          const je = await p2.evaluate(id => !!document.getElementById(id), h.slice(2));
          zapis(je, `kotva ${h} z ${cesta}`);
          await p2.close();
        } else if (h.startsWith('/')) {
          const r = await ctx.request.get(ZAKLAD + h);
          zapis(r.status() === 200, `interní odkaz ${h} z ${cesta}`, String(r.status()));
        } else if (h.startsWith('tel:')) {
          zapis(h === 'tel:+420773706196', `telefon ${h}`);
        } else if (h.startsWith('http')) {
          externi.add(h);
          zapis(o.target === '_blank' && /noopener/.test(o.rel), `externí odkaz nové okno + noopener: ${h.slice(0, 60)}`);
          if (/noona/.test(h)) zapis(h === NOONA, `čistý odkaz Noona`, h);
        } else {
          zapis(false, `neznámý odkaz ${h}`);
        }
      }
      await page.close();
    }
    vysledky.push('INFO  externí cíle: ' + [...externi].join(', '));
    await ctx.close();
  }

  // 3) Cookies: výchozí stav, odmítnutí, přetrvání, znovuotevření, povolení mapy, vypršení
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const cizi = [];
    page.on('request', r => { if (!r.url().startsWith(ZAKLAD)) cizi.push(r.url()); });
    await page.goto(ZAKLAD + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const okno = page.locator('[data-souhlas]');
    zapis(await okno.isVisible(), 'cookies: okno se při první návštěvě zobrazí');
    zapis(await page.evaluate(() => !document.querySelector('[name=analyticke]').checked && !document.querySelector('[name=externi]').checked), 'cookies: nepovinné kategorie jsou výchozí vypnuté');
    const rozmery = await page.evaluate(() => ['[data-souhlas-vse]', '[data-souhlas-nic]'].map(s => { const b = document.querySelector(s).getBoundingClientRect(); const c = getComputedStyle(document.querySelector(s)); return [Math.round(b.width), Math.round(b.height), c.backgroundColor, c.color, c.borderColor].join('/'); }));
    zapis(rozmery[0] === rozmery[1], 'cookies: Přijmout vše a Odmítnout nepovinné vypadají stejně', rozmery.join('  vs  '));
    zapis(cizi.length === 0, 'cookies: před volbou žádný požadavek mimo web', cizi.join(', '));
    await page.locator('[data-souhlas-nic]').click();
    await page.waitForTimeout(300);
    zapis(!(await okno.isVisible()), 'cookies: po odmítnutí se okno zavře');
    zapis(await page.locator('iframe').count() === 0, 'cookies: po odmítnutí se mapa nenačte');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    zapis(!(await okno.isVisible()), 'cookies: volba přežije nové načtení');
    zapis(cizi.length === 0, 'cookies: po odmítnutí žádný požadavek mimo web', cizi.join(', '));
    await page.locator('#pata [data-souhlas-otevrit]').scrollIntoViewIfNeeded();
    await page.locator('#pata [data-souhlas-otevrit]').click();
    await page.waitForTimeout(300);
    zapis(await okno.isVisible() && await page.locator('[data-souhlas-nastaveni]').isVisible(), 'cookies: odkaz v patičce okno znovu otevře s nastavením');
    await page.locator('label[for=souhlas-externi]').click();
    await page.locator('[data-souhlas-nastaveni] button[type=submit]').click();
    await page.waitForTimeout(800);
    const ram = await page.evaluate(() => { const i = document.querySelector('[data-mapa] iframe'); return i ? i.src : null; });
    zapis(!!ram && ram.startsWith('https://www.google.com/maps'), 'cookies: po povolení externího obsahu se vloží mapa', String(ram).slice(0, 60));
    const ulozeno = await page.evaluate(() => JSON.parse(localStorage.getItem('dstudio-souhlas')));
    zapis(ulozeno.externi === true && ulozeno.analyticke === false, 'cookies: uložené kategorie odpovídají volbě', JSON.stringify(ulozeno));
    // odvolání
    await page.locator('#pata [data-souhlas-otevrit]').click();
    await page.locator('[data-souhlas-nic]').click();
    await page.waitForTimeout(300);
    zapis(await page.locator('[data-mapa] iframe').count() === 0, 'cookies: po odvolání souhlasu mapa zmizí');
    // vypršení po 180 dnech
    await page.evaluate(() => localStorage.setItem('dstudio-souhlas', JSON.stringify({ v: 1, cas: Date.now() - 181 * 864e5, analyticke: true, externi: true })));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    zapis(await okno.isVisible() && await page.locator('[data-mapa] iframe').count() === 0, 'cookies: po 180 dnech volba vyprší a okno se zobrazí znovu');
    // tlačítko „Zobrazit mapu" udělí souhlas jen pro mapu
    await page.locator('[data-souhlas-povolit=externi]').scrollIntoViewIfNeeded();
    await page.locator('[data-souhlas-povolit=externi]').click();
    await page.waitForTimeout(500);
    const po = await page.evaluate(() => JSON.parse(localStorage.getItem('dstudio-souhlas')));
    zapis(po.externi === true && po.analyticke === false && await page.locator('[data-mapa] iframe').count() === 1, 'cookies: „Zobrazit mapu" povolí jen externí obsah');
    await ctx.close();
  }

  // 4) Dotykové cíle na mobilu (min. 44 × 44 px) a kontrast textu vůči pozadí
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(souhlasOdmitnut);
    for (const cesta of STRANKY.slice(0, 3)) {
      const page = await ctx.newPage();
      await page.goto(ZAKLAD + cesta, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const male = await page.evaluate(() => {
        const vysl = [];
        document.querySelectorAll('a, button, summary, input, label.volba, .prepinac__volba').forEach(e => {
          if (e.closest('[hidden]') || e.closest('[inert]')) return;
          const r = e.getBoundingClientRect();
          if (!r.width || !r.height) return;
          const st = getComputedStyle(e);
          if (st.visibility === 'hidden' || st.display === 'none') return;
          if (e.matches('input') && e.closest('.prepinac__volba, .volba')) return;
          // odkaz uvnitř odstavce se posuzuje jako text, ne jako samostatný cíl
          const vTextu = e.matches('a') && st.display === 'inline' && e.parentElement && e.parentElement.textContent.trim().length > e.textContent.trim().length + 12;
          if (vTextu) return;
          if (r.height < 43.5 || r.width < 43.5) vysl.push(`${e.tagName.toLowerCase()}.${(e.className || '').toString().split(' ')[0]} „${e.textContent.trim().slice(0, 24)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
        });
        return vysl;
      });
      zapis(male.length === 0, `dotykové cíle ≥ 44 px ${cesta}`, male.join(' ; '));
      await page.close();
    }
    await ctx.close();
  }

  // 5) Parallax: vrstvy se při scrollu posouvají; při omezeném pohybu se knihovny vůbec nenačtou
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(souhlasOdmitnut);
    const page = await ctx.newPage();
    await page.goto(ZAKLAD + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const pred = await page.evaluate(() => [...document.querySelectorAll('#uvod [data-parallax-layer]')].map(e => e.style.transform || ''));
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(900);
    const po = await page.evaluate(() => [...document.querySelectorAll('#uvod [data-parallax-layer]')].map(e => [e.getAttribute('data-parallax-layer'), new DOMMatrix(getComputedStyle(e).transform).m42.toFixed(0)].join(':')));
    zapis(po.every(x => +x.split(':')[1] > 0), 'parallax: vrstvy úvodu se při scrollu posouvají', po.join(' '));
    const poradi = {}; po.forEach(x => { const [k, v] = x.split(':'); poradi[k] = +v; });
    zapis(poradi['1'] > poradi['2'] && poradi['2'] > poradi['3'] && poradi['3'] > poradi['4'], 'parallax: vzdálenější vrstva se posouvá víc (1 > 2 > 3 > 4)');
    zapis(await page.evaluate(() => !!window.gsap && !!window.ScrollTrigger && !!window.dstudioLenis), 'parallax: GSAP, ScrollTrigger a Lenis jsou načtené lokálně');
    const pocet = await page.evaluate(() => window.ScrollTrigger.getAll().length);
    zapis(pocet >= 10, 'parallax: scény ve všech sekcích', String(pocet));
    await ctx.close();

    const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await ctx2.addInitScript(souhlasOdmitnut);
    const p2 = await ctx2.newPage();
    const skripty = [];
    p2.on('request', r => { if (/vendor/.test(r.url())) skripty.push(r.url()); });
    await p2.goto(ZAKLAD + '/', { waitUntil: 'networkidle' });
    await p2.evaluate(() => window.scrollTo(0, 500));
    await p2.waitForTimeout(600);
    const posun = await p2.evaluate(() => [...document.querySelectorAll('[data-parallax-layer]')].some(e => getComputedStyle(e).transform !== 'none'));
    zapis(skripty.length === 0 && !posun, 'omezený pohyb: žádný parallax, knihovny se nenačítají');
    const skryte = await p2.evaluate(() => document.querySelectorAll('.ceka').length);
    zapis(skryte === 0, 'omezený pohyb: žádný obsah nečeká na animaci', String(skryte));
    await ctx2.close();
  }

  // 6) Bez JavaScriptu: obsah i navigace jsou dostupné
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(ZAKLAD + '/', { waitUntil: 'networkidle' });
    const stav = await page.evaluate(() => ({
      nav: getComputedStyle(document.querySelector('#navigace')).visibility === 'visible' && document.querySelector('.navigace__seznam a').getBoundingClientRect().height > 0,
      sluzby: [...document.querySelectorAll('.sluzba')].every(s => s.getBoundingClientRect().height > 0),
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      okno: document.querySelector('[data-souhlas]').hidden
    }));
    zapis(stav.nav, 'bez JS: navigace je vidět');
    zapis(stav.sluzby, 'bez JS: všech pět služeb je rozbalených');
    zapis(stav.sw <= stav.cw, 'bez JS: bez vodorovného posuvu', `${stav.sw}/${stav.cw}`);
    await ctx.close();
  }

  // 7) Obsah: údaje podle brand booku, zakázané výrazy, barvy mimo paletu
  {
    const koren = path.resolve(__dirname, '..', 'site');
    const soubory = [];
    (function projdi(d) {
      for (const f of fs.readdirSync(d)) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) { if (!/vendor/.test(p)) projdi(p); }
        else if (/\.(html|css|js|json|svg|txt|xml|toml|webmanifest)$/.test(f) || f === '_headers') soubory.push(p);
      }
    })(koren);
    const texty = soubory.map(f => [path.relative(koren, f), fs.readFileSync(f, 'utf8')]);
    const zakazane = /\b(AI|A\.I\.|umělá inteligence|umělou inteligencí|artificial intelligence|GPT|ChatGPT|Claude|Anthropic|OpenAI|Higgsfield|Midjourney|lorem ipsum|vygenerov|generated by)\b/i;
    const nalezy = texty.filter(([, t]) => zakazane.test(t)).map(([f, t]) => f + ': ' + t.match(zakazane)[0]);
    zapis(nalezy.length === 0, 'obsah: žádná zmínka o AI ani výplňový text', nalezy.join(' ; '));
    const spatnyNazev = texty.filter(([f, t]) => /\.(html|json)$/.test(f) && /D Studio|DStudio|D\.Nails|Dstudio(?!_)/.test(t)).map(([f]) => f);
    zapis(spatnyNazev.length === 0, 'obsah: název jen jako DSTUDIO', spatnyNazev.join(','));
    const paleta = ['#FFFFFF', '#F4EFEA', '#2B1E1A', '#D7BC95', '#0F4C3A'];
    const barvy = new Set();
    texty.filter(([f]) => /\.(css|svg|html)$/.test(f)).forEach(([, t]) => (t.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []).forEach(b => barvy.add(b.toUpperCase())));
    const cizi = [...barvy].filter(b => !paleta.includes(b) && b !== '#FFF');
    zapis(cizi.length === 0, 'barvy: jen pět barev palety', cizi.join(','));
    const css = texty.filter(([f]) => /\.css$/.test(f)).map(([, t]) => t).join('\n');
    zapis(!/gradient\(|box-shadow|text-shadow|drop-shadow|backdrop-filter|rgba?\(|hsla?\(/.test(css), 'styl: žádné přechody, stíny ani průhledné barvy');
    const index = fs.readFileSync(path.join(koren, 'index.html'), 'utf8');
    for (const [nazev, vzor] of [
      ['adresa', /Milady Horákové 398\/30/], ['PSČ a čtvrť', /170(&nbsp;| )00 Praha(&nbsp;| )7(&nbsp;| )– Holešovice/], ['telefon', /\+420(&nbsp;| )773(&nbsp;| )706(&nbsp;| )196/],
      ['IČO', /IČO: 17419221/], ['provozovatel', /D\.(&nbsp;| )Y\.(&nbsp;| )Beauty s\.r\.o\./], ['otevírací doba', /Po–Pá(&nbsp;| )+9:00–19:00/],
      ['víkend', /So–Ne pouze na objednání/], ['Instagram', /instagram\.com\/dstudio_cz/], ['odpovědný vedoucí', /Diana Josypčuková/]
    ]) zapis(vzor.test(index), `údaj podle brand booku: ${nazev}`);
    zapis(!/aggregateRating|ratingValue|reviewCount/.test(index), 'SEO: žádné hodnocení ve strukturovaných datech');
    const placeholdery = (index.match(/data-placeholder="[^"]+"/g) || []).length;
    vysledky.push('INFO  placeholdery v index.html (statické): ' + placeholdery + ' + dynamické z galerie.json a recenze.json');
  }

  await browser.close();
  console.log(vysledky.join('\n'));
  console.log(`\nCelkem kontrol: ${vysledky.filter(v => !v.startsWith('INFO')).length}, chyb: ${chyb}`);
  process.exit(chyb ? 1 : 0);
})();
