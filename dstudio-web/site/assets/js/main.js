/* DSTUDIO | Beauty Salon – chování stránky
   Obsah: typografie, navigace, odhalování při scrollu, data (ceník, galerie, tým,
   recenze, otázky), okna služeb, lišta s rezervací, parallax vrstvy. */
(function () {
  'use strict';

  var d = document;
  var koren = d.documentElement;
  var NOONA = 'https://noona.app/dstudio';
  var mensiPohyb = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uzkyDisplej = window.matchMedia('(max-width: 59.99em)');

  function $(s, k) { return (k || d).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || d).querySelectorAll(s)); }

  /* Vytvoří prvek. Text se vkládá jako text, nikdy jako HTML. */
  function prvek(znacka, atributy, deti) {
    var p = d.createElement(znacka);
    Object.keys(atributy || {}).forEach(function (k) {
      if (atributy[k] === false || atributy[k] == null) return;
      p.setAttribute(k, atributy[k] === true ? '' : atributy[k]);
    });
    [].concat(deti == null ? [] : deti).forEach(function (dite) {
      if (dite == null) return;
      p.appendChild(typeof dite === 'string' ? d.createTextNode(dite) : dite);
    });
    return p;
  }

  function svg(trida, odkaz) {
    var NS = 'http://www.w3.org/2000/svg';
    var s = d.createElementNS(NS, 'svg');
    s.setAttribute('class', trida);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    var u = d.createElementNS(NS, 'use');
    u.setAttribute('href', odkaz);
    s.appendChild(u);
    return s;
  }

  /* ---------- Česká typografie pro texty z datových souborů ---------- */
  var NBSP = ' ';
  var UZKA = ' ';
  function typo(text) {
    var t = String(text);
    for (var i = 0; i < 2; i++) {
      t = t.replace(/(^|[\s („])([KkSsVvZzOoUuAaIi]) (?=\S)/g, '$1$2' + NBSP);
    }
    return t.replace(/(\d) (?=\d{3}\b)/g, '$1' + UZKA).replace(/(\d) (Kč)/g, '$1' + NBSP + '$2');
  }
  function cislo(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, UZKA);
  }
  function cenaText(c) {
    if (c == null) return null;
    return Array.isArray(c) ? cislo(c[0]) + '–' + cislo(c[1]) : cislo(c);
  }
  function nejnizsi(c) { return Array.isArray(c) ? c[0] : c; }

  /* ---------- Odhalování při scrollu ---------- */
  var pozorovatel = null;
  if (!mensiPohyb && 'IntersectionObserver' in window) {
    pozorovatel = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) {
        if (!z.isIntersecting) return;
        z.target.classList.remove('ceka');
        z.target.classList.add('kresli');
        pozorovatel.unobserve(z.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  }
  function sleduj(prvky) {
    if (!pozorovatel) return;
    [].concat(prvky).forEach(function (p) {
      if (!p || p.classList.contains('kresli')) return;
      /* Co je vidět už při načtení, zůstává bez animace (žádné probliknutí). */
      if (p.getBoundingClientRect().top < window.innerHeight * 0.95) return;
      p.classList.add('ceka');
      pozorovatel.observe(p);
    });
  }

  /* ---------- Hlavička a mobilní navigace ---------- */
  function hlavicka() {
    var hl = $('[data-hlavicka]');
    var tlacitko = $('[data-menu]');
    var nav = $('#navigace');
    if (!hl || !tlacitko || !nav) return;
    var napis = $('[data-menu-napis]', tlacitko);
    var ostatni = $$('main, footer, .lista-rezervace');
    tlacitko.hidden = false;

    function nastav(otevrit) {
      tlacitko.setAttribute('aria-expanded', String(otevrit));
      nav.classList.toggle('je-otevrena', otevrit);
      koren.classList.toggle('ma-menu', otevrit);
      if (napis) napis.textContent = otevrit ? 'Zavřít' : 'Menu';
      ostatni.forEach(function (o) { o.inert = otevrit; });
      d.body.style.overflow = otevrit ? 'hidden' : '';
      if (window.dstudioLenis) window.dstudioLenis[otevrit ? 'stop' : 'start']();
      if (otevrit) hl.classList.remove('je-schovana');
    }
    function jeOtevrena() { return tlacitko.getAttribute('aria-expanded') === 'true'; }

    tlacitko.addEventListener('click', function () { nastav(!jeOtevrena()); });
    nav.addEventListener('click', function (u) {
      if (u.target.closest('a') && jeOtevrena()) nastav(false);
    });
    d.addEventListener('keydown', function (u) {
      if (u.key === 'Escape' && jeOtevrena()) { nastav(false); tlacitko.focus(); }
    });
    /* Na úzkém displeji je navigace mimo obrazovku, dokud ji nikdo neotevře. */
    function dostupnost() { nav.inert = uzkyDisplej.matches && !jeOtevrena(); }
    uzkyDisplej.addEventListener('change', function () { if (!uzkyDisplej.matches) nastav(false); dostupnost(); });
    tlacitko.addEventListener('click', dostupnost);
    nav.addEventListener('click', function () { window.setTimeout(dostupnost, 0); });
    d.addEventListener('keydown', function (u) { if (u.key === 'Escape') dostupnost(); });
    dostupnost();

    /* Na mobilu se hlavička při scrollu dolů schová a při scrollu nahoru vrátí. */
    var minule = window.scrollY;
    var ceka = false;
    window.addEventListener('scroll', function () {
      if (ceka) return;
      ceka = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        if (uzkyDisplej.matches && !jeOtevrena()) {
          if (y > minule + 6 && y > 240) hl.classList.add('je-schovana');
          else if (y < minule - 6 || y < 240) hl.classList.remove('je-schovana');
        } else {
          hl.classList.remove('je-schovana');
        }
        minule = y;
        ceka = false;
      });
    }, { passive: true });

    /* Zvýraznění položky navigace podle sekce, která je právě v záběru. */
    if ('IntersectionObserver' in window) {
      var odkazy = {};
      $$('.navigace__seznam a').forEach(function (a) {
        var cil = (a.getAttribute('href') || '').split('#')[1];
        if (cil) odkazy[cil] = a;
      });
      var sekce = Object.keys(odkazy).map(function (id) { return d.getElementById(id); }).filter(Boolean);
      var io = new IntersectionObserver(function (zaznamy) {
        zaznamy.forEach(function (z) {
          var a = odkazy[z.target.id];
          if (!a) return;
          if (z.isIntersecting) {
            Object.keys(odkazy).forEach(function (k) { odkazy[k].removeAttribute('aria-current'); });
            a.setAttribute('aria-current', 'true');
          } else if (a.getAttribute('aria-current')) {
            a.removeAttribute('aria-current');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sekce.forEach(function (s) { io.observe(s); });
    }
  }

  /* ---------- Data ---------- */
  function nacti(cesta) {
    return fetch(cesta, { credentials: 'same-origin' }).then(function (o) {
      if (!o.ok) throw new Error(cesta + ': ' + o.status);
      return o.json();
    });
  }

  /* Ceník */
  function bunkaCeny(cena, znacka, atributy) {
    var b = prvek(znacka || 'td', atributy || {});
    var text = cenaText(cena);
    if (text == null) {
      b.appendChild(prvek('span', { 'aria-hidden': 'true' }, '—'));
      b.appendChild(prvek('span', { class: 'skryte' }, 'nenabízíme'));
    } else {
      b.appendChild(d.createTextNode(text));
      b.appendChild(prvek('span', { class: 'cena__mena' }, NBSP + 'Kč'));
    }
    return b;
  }

  function tabulkaCeniku(tab, urovne) {
    var t = prvek('table', { class: 'cenik-tabulka' + (tab.urovne ? '' : ' cenik-tabulka--jedna') });
    t.appendChild(prvek('caption', {}, typo(tab.nazev)));
    var telo = prvek('tbody');
    if (tab.urovne) {
      var radekHlavy = prvek('tr', {}, prvek('th', { scope: 'col' }, prvek('span', { class: 'skryte' }, 'Služba')));
      urovne.forEach(function (u) {
        var mimo = tab.urovne.indexOf(u.id) === -1;
        radekHlavy.appendChild(prvek('th', { scope: 'col', 'data-uroven': u.id, class: mimo ? 'mimo' : null }, u.nazev));
      });
      t.appendChild(prvek('thead', {}, radekHlavy));
      tab.polozky.forEach(function (p) {
        var r = prvek('tr', {}, prvek('th', { scope: 'row' }, typo(p.nazev)));
        urovne.forEach(function (u) {
          var mimo = tab.urovne.indexOf(u.id) === -1;
          r.appendChild(bunkaCeny(mimo ? null : p.ceny[u.id], 'td', { 'data-uroven': u.id, class: mimo ? 'mimo' : null }));
        });
        telo.appendChild(r);
      });
    } else {
      t.appendChild(prvek('thead', { class: 'skryte' }, prvek('tr', {}, [
        prvek('th', { scope: 'col' }, 'Služba'), prvek('th', { scope: 'col' }, 'Cena')
      ])));
      tab.polozky.forEach(function (p) {
        telo.appendChild(prvek('tr', {}, [prvek('th', { scope: 'row' }, typo(p.nazev)), bunkaCeny(p.cena)]));
      });
    }
    t.appendChild(telo);
    var obal = prvek('div', { class: 'cenik-tabulka__obal' }, t);
    if (tab.urovne && tab.urovne.length < urovne.length) {
      var chybi = urovne.filter(function (u) { return tab.urovne.indexOf(u.id) === -1; });
      var jsou = urovne.filter(function (u) { return tab.urovne.indexOf(u.id) !== -1; });
      obal.appendChild(prvek('p', {
        class: 'cenik-tabulka__poznamka',
        'data-chybi': chybi.map(function (u) { return u.id; }).join(' ')
      }, 'V této úrovni službu nenabízíme. Dostupné úrovně: ' + jsou.map(function (u) { return u.nazev; }).join(' a ') + '.'));
    }
    return obal;
  }

  function najdiPolozku(data, cesta) {
    var cast = cesta.split('/');
    var skupina = data.skupiny.filter(function (s) { return s.id === cast[0]; })[0];
    var tab = skupina && skupina.tabulky.filter(function (t) { return t.id === cast[1]; })[0];
    var pol = tab && tab.polozky.filter(function (p) { return p.nazev === cast[2]; })[0];
    return pol ? { tabulka: tab, polozka: pol } : null;
  }

  function cenik(data) {
    var strany = $('[data-cenik]');
    var listy = $('[data-cenik-listy]');
    if (!strany || !listy) return;
    listy.textContent = '';
    var skoky = $('[data-cenik-skoky]');

    data.skupiny.forEach(function (sk) {
      var id = 'cenik-' + sk.id;
      var list = prvek('section', { class: 'cenik-list', id: id, 'aria-labelledby': id + '-nazev' });
      list.appendChild(prvek('p', { class: 'cenik-list__stitek' }, sk.cislo + ' / ' + sk.stitek));
      list.appendChild(prvek('h3', { class: 'cenik-list__nazev', id: id + '-nazev' }, typo(sk.nazev)));
      if (sk.motto) list.appendChild(prvek('p', { class: 'cenik-list__motto' }, typo(sk.motto)));
      var tabulky = prvek('div', { class: 'cenik-list__tabulky' });
      sk.tabulky.forEach(function (tab) { tabulky.appendChild(tabulkaCeniku(tab, data.urovne)); });
      list.appendChild(tabulky);
      if (sk.zaver) {
        list.appendChild(prvek('div', { class: 'cenik-list__zaver' }, [
          prvek('p', { class: 'cenik-list__zaver-nadpis' }, typo(sk.zaver.nadpis)),
          prvek('p', {}, typo(sk.zaver.text))
        ]));
      }
      list.appendChild(prvek('p', { class: 'cenik-list__pata', 'aria-hidden': 'true' }, [
        prvek('span', {}, 'DSTUDIO / Ceny v' + NBSP + data.mena), prvek('span', {}, sk.cislo)
      ]));
      listy.appendChild(list);
      if (skoky) skoky.appendChild(prvek('a', { href: '#' + id }, sk.cislo + NBSP + sk.stitek));
    });

    var poznamky = $('[data-cenik-poznamky]');
    if (poznamky && data.poznamky) {
      ['mena', 'rozpeti', 'pomlcka'].forEach(function (k) {
        if (data.poznamky[k]) poznamky.appendChild(prvek('li', {}, typo(data.poznamky[k])));
      });
    }

    /* Přepínač úrovně: na mobilu jedna úroveň, na širším displeji všechny vedle sebe */
    var prepinac = $('[data-prepinac]');
    if (prepinac) {
      prepinac.hidden = false;
      var vychozi = window.matchMedia('(min-width: 47.5em)').matches ? 'vse' : data.urovne[0].id;
      var nastav = function (hodnota) { strany.setAttribute('data-uroven', hodnota); };
      $$('input[name="uroven"]', prepinac).forEach(function (vstup) {
        vstup.checked = vstup.value === vychozi;
        vstup.addEventListener('change', function () { if (vstup.checked) nastav(vstup.value); });
      });
      nastav(vychozi);
    }

    var tisk = $('[data-tisk]');
    if (tisk && window.print) {
      tisk.hidden = false;
      tisk.addEventListener('click', function () { window.print(); });
    }

    /* Ceny u služeb a příklad tří úrovní se berou ze stejných dat jako ceník. */
    $$('[data-cena-od]').forEach(function (p) {
      var nalez = najdiPolozku(data, p.getAttribute('data-cena-od'));
      if (!nalez) return;
      var popis = p.getAttribute('data-cena-popis') || nalez.polozka.nazev;
      var text;
      if (nalez.polozka.ceny) {
        var ceny = Object.keys(nalez.polozka.ceny).map(function (k) { return nalez.polozka.ceny[k]; })
          .filter(function (c) { return c != null; }).map(nejnizsi);
        text = 'od ' + cislo(Math.min.apply(null, ceny)) + NBSP + data.mena + ' podle úrovně specialistky';
      } else {
        text = cenaText(nalez.polozka.cena) + NBSP + data.mena;
      }
      p.textContent = '';
      p.appendChild(prvek('strong', {}, typo(popis)));
      p.appendChild(d.createTextNode(' ' + text));
      p.hidden = false;
    });
    $$('[data-urovne-priklad]').forEach(function (dl) {
      var nalez = najdiPolozku(data, dl.getAttribute('data-urovne-priklad'));
      if (!nalez || !nalez.polozka.ceny) return;
      $$('[data-uroven]', dl).forEach(function (dd) {
        var c = nalez.polozka.ceny[dd.getAttribute('data-uroven')];
        if (c != null) dd.textContent = cenaText(c) + NBSP + data.mena;
      });
    });
  }

  /* Galerie */
  function obrazek(zaklad, sirka, vyska, alt, trida) {
    var pic = prvek('picture');
    pic.appendChild(prvek('source', { srcset: zaklad + '.avif', type: 'image/avif' }));
    pic.appendChild(prvek('source', { srcset: zaklad + '.webp', type: 'image/webp' }));
    pic.appendChild(prvek('img', {
      class: trida, src: zaklad + '.jpg', width: sirka || 1200, height: vyska || 1500,
      alt: alt || '', loading: 'lazy', decoding: 'async'
    }));
    return pic;
  }
  function mistoProFoto(poradi, text, klic) {
    var ram = prvek('div', { class: 'foto-misto__ramecek' }, [
      svg('foto-misto__linky', '#linky-fasada'),
      prvek('span', { class: 'foto-misto__cislo' }, 'N°' + NBSP + (poradi < 10 ? '0' : '') + poradi),
      prvek('span', { class: 'foto-misto__text' }, text)
    ]);
    return prvek('figure', { class: 'foto-misto galerie__polozka', 'data-placeholder': klic }, ram);
  }
  function galerie(data) {
    var cil = $('[data-galerie]');
    if (!cil) return;
    cil.textContent = '';
    (data.polozky || []).forEach(function (p, i) {
      if (!p.soubor) { cil.appendChild(mistoProFoto(i + 1, 'Zde bude fotografie práce', 'galerie-foto')); return; }
      var f = prvek('figure', { class: 'galerie__polozka' }, obrazek(p.soubor, p.sirka, p.vyska, p.alt, 'galerie__foto'));
      if (p.popisek) f.appendChild(prvek('figcaption', { class: 'galerie__popisek' }, typo(p.popisek)));
      cil.appendChild(f);
    });
    /* Dokud v galerii nejsou fotografie, stačí úsporná řada míst. */
    var jenMista = (data.polozky || []).every(function (p) { return !p.soubor; });
    cil.classList.toggle('galerie--mista', jenMista);
    /* Sloupce mají různou hloubku parallaxu; linky v místech pro fotografie navazují přes hrany. */
    var siroky = window.innerWidth >= 900;
    var sloupcu = siroky ? (jenMista ? 6 : 3) : 2;
    var hloubky = siroky ? ['4', '2', '3'] : ['4', '3'];
    $$('.galerie__polozka', cil).forEach(function (p, i) {
      p.setAttribute('data-parallax-layer', hloubky[(i % sloupcu) % hloubky.length]);
      p.style.setProperty('--i2', i % 2);
      p.style.setProperty('--i3', i % 3);
      p.style.setProperty('--i6', i % 6);
    });
  }

  /* Tým: karty specialistek se zobrazí až po doplnění skutečných údajů */
  function tym(data) {
    var cil = $('[data-tym]');
    if (!cil || !data.zobrazitClenky || !(data.clenky || []).length) return;
    var nazvy = { middle: 'Middle', senior: 'Senior', top: 'Top' };
    data.clenky.forEach(function (c) {
      var karta = prvek('article', { class: 'clenka' });
      if (c.foto) karta.appendChild(obrazek(c.foto, 800, 1000, c.alt || c.jmeno, 'clenka__foto'));
      karta.appendChild(prvek('h3', { class: 'clenka__jmeno' }, c.jmeno));
      if (nazvy[c.uroven]) karta.appendChild(prvek('p', { class: 'clenka__uroven' }, nazvy[c.uroven]));
      if (c.zamereni) karta.appendChild(prvek('p', { class: 'clenka__zamereni' }, typo(c.zamereni)));
      cil.appendChild(karta);
    });
    cil.hidden = false;
  }

  /* Recenze */
  function recenze(data) {
    var cil = $('[data-recenze]');
    if (!cil) return;
    cil.textContent = '';
    (data.polozky || []).forEach(function (r) {
      var f;
      if (!r.text) {
        f = prvek('figure', { class: 'recenze__polozka', 'data-placeholder': 'recenze' }, [
          prvek('p', { class: 'recenze__stitek' }, 'Místo pro recenzi'),
          prvek('blockquote', { class: 'recenze__text' }, prvek('p', {}, 'Zde bude recenze klientky. Text dodá majitelka salonu.')),
          prvek('figcaption', { class: 'recenze__podpis' }, '— Jméno, služba')
        ]);
      } else {
        f = prvek('figure', { class: 'recenze__polozka' }, [
          prvek('blockquote', { class: 'recenze__text' }, prvek('p', {}, '„' + typo(r.text) + '“')),
          prvek('figcaption', { class: 'recenze__podpis' }, '— ' + [r.jmeno, r.sluzba].filter(Boolean).join(', '))
        ]);
      }
      cil.appendChild(f);
    });
    sleduj($$('.recenze__polozka', cil).map(function (p) { p.classList.add('odhal'); return p; }));
  }

  /* Časté otázky: odkaz se v datech zapisuje jako [text](adresa) */
  function odstavecSOdkazy(text) {
    var p = prvek('p');
    var vzor = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    var konec = 0;
    var m;
    while ((m = vzor.exec(text))) {
      if (m.index > konec) p.appendChild(d.createTextNode(typo(text.slice(konec, m.index))));
      var adresa = m[2];
      var povolena = /^(#|\/|tel:\+?[\d]+$|https:\/\/)/.test(adresa);
      if (povolena) {
        var externi = /^https:\/\//.test(adresa);
        var a = prvek('a', { href: adresa, target: externi ? '_blank' : null, rel: externi ? 'noopener' : null }, typo(m[1]));
        if (externi) a.appendChild(prvek('span', { class: 'skryte' }, ' (otevře se v novém okně)'));
        p.appendChild(a);
      } else {
        p.appendChild(d.createTextNode(typo(m[1])));
      }
      konec = m.index + m[0].length;
    }
    if (konec < text.length) p.appendChild(d.createTextNode(typo(text.slice(konec))));
    return p;
  }
  function otazky(data) {
    var cil = $('[data-faq]');
    if (!cil) return;
    cil.textContent = '';
    (data.polozky || []).forEach(function (o) {
      var det = prvek('details', { class: 'otazka' });
      det.appendChild(prvek('summary', {}, [
        prvek('h3', { class: 'otazka__nadpis' }, typo(o.otazka)),
        prvek('span', { class: 'otazka__znak', 'aria-hidden': 'true' })
      ]));
      var odp = prvek('div', { class: 'otazka__odpoved' });
      [].concat(o.odpoved).forEach(function (t) { odp.appendChild(odstavecSOdkazy(t)); });
      det.appendChild(odp);
      cil.appendChild(det);
    });
  }

  /* ---------- Okna služeb (záložky) ---------- */
  function okna() {
    var blok = $('[data-okna]');
    if (!blok) return function () {};
    var rada = $('[data-okna-rada]', blok);
    var tabule = $$('[data-okno]', blok);
    var panely = $$('[data-sluzba]', blok);
    rada.setAttribute('role', 'tablist');
    rada.setAttribute('aria-label', 'Služby');
    blok.classList.add('je-ziva');

    function vyber(klic, zamerit) {
      tabule.forEach(function (t) {
        var je = t.getAttribute('data-okno') === klic;
        t.setAttribute('aria-selected', String(je));
        t.setAttribute('tabindex', je ? '0' : '-1');
        t.classList.toggle('je-vybrana', je);
        if (je && zamerit) t.focus();
      });
      panely.forEach(function (p) {
        var je = p.getAttribute('data-sluzba') === klic;
        if (je && !p.classList.contains('je-vybrana') && !mensiPohyb) {
          p.classList.remove('kresli');
          void p.offsetWidth;
          p.classList.add('kresli');
        }
        p.classList.toggle('je-vybrana', je);
      });
    }

    tabule.forEach(function (t, i) {
      var klic = t.getAttribute('data-okno');
      var panel = panely.filter(function (p) { return p.getAttribute('data-sluzba') === klic; })[0];
      t.setAttribute('role', 'tab');
      t.id = 'okno-' + klic;
      if (panel) {
        t.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', t.id);
      }
      t.addEventListener('click', function (u) { u.preventDefault(); vyber(klic); });
      t.addEventListener('mouseenter', function () {
        if (window.matchMedia('(hover: hover)').matches) vyber(klic);
      });
      t.addEventListener('keydown', function (u) {
        var kam = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabule.length - 1 }[u.key];
        if (kam == null) {
          if (u.key === ' ' || u.key === 'Enter') { u.preventDefault(); vyber(klic); }
          return;
        }
        u.preventDefault();
        var dalsi = tabule[(kam + tabule.length) % tabule.length];
        vyber(dalsi.getAttribute('data-okno'), true);
      });
    });

    var zHashe = (location.hash.match(/^#sluzba-(.+)$/) || [])[1];
    vyber(tabule.some(function (t) { return t.getAttribute('data-okno') === zHashe; }) ? zHashe : tabule[0].getAttribute('data-okno'));

    /* Odkazy z okna v úvodu rovnou otevřou správnou službu. */
    $$('[data-okno-odkaz]').forEach(function (a) {
      a.addEventListener('click', function () { vyber(a.getAttribute('data-okno-odkaz')); });
    });
    return vyber;
  }

  /* ---------- Lišta s rezervací na mobilu ---------- */
  function lista() {
    var l = $('[data-lista-rezervace]');
    if (!l || !('IntersectionObserver' in window)) return;
    l.hidden = false;
    var zaUvodem = false;
    var uKonce = false;
    function prekresli() { l.classList.toggle('je-videt', zaUvodem && !uKonce); l.inert = !(zaUvodem && !uKonce); }
    var uvod = $('.uvod__tlacitka') || $('.zahlavi');
    if (uvod) {
      new IntersectionObserver(function (z) {
        zaUvodem = !z[0].isIntersecting && z[0].boundingClientRect.top < 0;
        prekresli();
      }).observe(uvod);
    } else { zaUvodem = true; }
    var konce = $$('#rezervace, #pata');
    var videt = {};
    var io = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) { videt[z.target.id] = z.isIntersecting; });
      uKonce = Object.keys(videt).some(function (k) { return videt[k]; });
      prekresli();
    });
    konce.forEach(function (k) { io.observe(k); });
    prekresli();
  }

  /* ---------- Parallax vrstvy (GSAP ScrollTrigger + Lenis) ----------
     Prvek s atributem data-parallax-layers je scéna, jeho potomci
     s data-parallax-layer="1"–"4" jsou vrstvy: 1 je nejdál, 4 nejblíž. */
  function nactiSkript(cesta) {
    return new Promise(function (hotovo, chyba) {
      var s = d.createElement('script');
      s.src = cesta; s.async = false;
      s.onload = hotovo; s.onerror = chyba;
      d.head.appendChild(s);
    });
  }

  function parallax() {
    if (mensiPohyb || !$('[data-parallax-layers]')) return Promise.resolve();
    var zaklad = '/assets/vendor/';
    return nactiSkript(zaklad + 'gsap.min.js')
      .then(function () { return nactiSkript(zaklad + 'ScrollTrigger.min.js'); })
      .then(function () { return nactiSkript(zaklad + 'lenis.min.js'); })
      .then(function () {
        var gsap = window.gsap;
        var ScrollTrigger = window.ScrollTrigger;
        if (!gsap || !ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger);

        function sila() { return window.innerWidth < 960 ? 0.3 : 1; }

        /* Úvod: vrstvy odjíždějí různou rychlostí, dokud scéna neopustí obrazovku. */
        var uvodni = [
          { layer: '1', yPercent: 70 },
          { layer: '2', yPercent: 55 },
          { layer: '3', yPercent: 40 },
          { layer: '4', yPercent: 10 }
        ];
        /* Ostatní sekce: jemný posun po celou dobu průchodu obrazovkou (podíl výšky okna). */
        var pruchozi = { '1': 0.15, '2': 0.085, '3': 0.04, '4': 0.02 };

        $$('[data-parallax-layers]').forEach(function (scena) {
          var jeUvod = scena.getAttribute('data-parallax-layers') === 'uvod';
          var tl = gsap.timeline({
            scrollTrigger: jeUvod
              ? { trigger: scena, start: 0, end: '100% 0%', scrub: 0, invalidateOnRefresh: true }
              : { trigger: scena, start: 'top bottom', end: 'bottom top', scrub: 0, invalidateOnRefresh: true }
          });
          if (jeUvod) {
            uvodni.forEach(function (v, i) {
              var vrstvy = $$('[data-parallax-layer="' + v.layer + '"]', scena);
              if (!vrstvy.length) return;
              tl.to(vrstvy, {
                y: function () { return scena.offsetHeight * (v.yPercent / 100) * sila(); },
                ease: 'none'
              }, i === 0 ? undefined : '<');
            });
          } else {
            Object.keys(pruchozi).forEach(function (n) {
              var vrstvy = $$('[data-parallax-layer="' + n + '"]', scena).filter(function (v) {
                return v.closest('[data-parallax-layers]') === scena;
              });
              if (!vrstvy.length) return;
              var posun = function () { return window.innerHeight * pruchozi[n] * (window.innerWidth < 960 ? 0.55 : 1); };
              tl.fromTo(vrstvy, { y: function () { return -posun(); } }, { y: posun, ease: 'none' }, 0);
            });
          }
        });

        /* Plynulé scrollování; na dotykových displejích zůstává nativní. */
        if (window.Lenis) {
          var lenis = new window.Lenis({
            anchors: { offset: -(($('[data-hlavicka]') || {}).offsetHeight || 0) - 12 }
          });
          lenis.on('scroll', ScrollTrigger.update);
          gsap.ticker.add(function (cas) { lenis.raf(cas * 1000); });
          gsap.ticker.lagSmoothing(0);
          window.dstudioLenis = lenis;
        }

        if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { ScrollTrigger.refresh(); });
        window.addEventListener('load', function () { ScrollTrigger.refresh(); });
      })
      .catch(function () { /* bez knihoven zůstane stránka statická */ });
  }

  /* ---------- Start ---------- */
  function start() {
    hlavicka();
    var vyberOkno = okna();
    lista();
    sleduj($$('.odhal, .linky, .stitek:not(.uvod__stitek), [data-kresli]'));

    var nacitani = [];
    if ($('[data-cenik]')) {
      nacitani.push(nacti('/data/cenik.json').then(cenik).catch(function () {
        var stav = $('[data-cenik-stav]');
        if (stav) {
          stav.textContent = 'Ceník se nepodařilo načíst. Aktuální ceny najdete v rezervačním systému ';
          stav.appendChild(prvek('a', { href: NOONA, target: '_blank', rel: 'noopener' }, 'Noona'));
          stav.appendChild(d.createTextNode('.'));
        }
      }));
    }
    if ($('[data-galerie]')) nacitani.push(nacti('/data/galerie.json').then(galerie).catch(function () {}));
    if ($('[data-tym]')) nacitani.push(nacti('/data/tym.json').then(tym).catch(function () {}));
    if ($('[data-recenze]')) nacitani.push(nacti('/data/recenze.json').then(recenze).catch(function () {}));
    if ($('[data-faq]')) nacitani.push(nacti('/data/faq.json').then(otazky).catch(function () {}));

    Promise.all(nacitani).then(function () {
      /* Po doplnění obsahu doskočit na kotvu z adresy a spustit parallax. */
      if (location.hash.length > 1) {
        var cil = d.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (cil) {
          var m = location.hash.match(/^#sluzba-(.+)$/);
          if (m) vyberOkno(m[1]);
          cil.scrollIntoView();
        }
      }
      return parallax();
    });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start);
  else start();
})();
