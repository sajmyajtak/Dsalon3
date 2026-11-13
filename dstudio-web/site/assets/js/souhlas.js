/* DSTUDIO | Beauty Salon – souhlas s cookies a externím obsahem
   Kategorie: nezbytné (vždy), analytické, externí obsah (mapa).
   Nepovinné kategorie jsou ve výchozím stavu vypnuté a jejich obsah se
   načítá teprve po souhlasu. Volba se pamatuje nejvýše 180 dní. */
(function () {
  'use strict';

  var d = document;
  var KLIC = 'dstudio-souhlas';
  var VERZE = 1;
  var PLATNOST = 180 * 24 * 60 * 60 * 1000;
  var KATEGORIE = ['analyticke', 'externi'];

  var okno = d.querySelector('[data-souhlas]');
  var pamet = null; /* náhradní úložiště, když prohlížeč localStorage nepovolí */
  var posluchaci = [];
  var navratFokusu = null;

  /* ---------- Úložiště ---------- */
  function precti() {
    var surove = null;
    try { surove = window.localStorage.getItem(KLIC); } catch (e) { surove = pamet; }
    if (!surove) return null;
    try {
      var s = JSON.parse(surove);
      if (s.v !== VERZE || typeof s.cas !== 'number' || Date.now() - s.cas > PLATNOST) {
        try { window.localStorage.removeItem(KLIC); } catch (e) { pamet = null; }
        return null;
      }
      return s;
    } catch (e) { return null; }
  }
  function uloz(volba) {
    var s = { v: VERZE, cas: Date.now() };
    KATEGORIE.forEach(function (k) { s[k] = !!volba[k]; });
    var text = JSON.stringify(s);
    try { window.localStorage.setItem(KLIC, text); } catch (e) { pamet = text; }
    pouzij(s);
    posluchaci.forEach(function (f) { f(s); });
    return s;
  }
  function ma(kategorie) {
    var s = precti();
    return !!(s && s[kategorie]);
  }

  /* ---------- Externí obsah: mapa ---------- */
  var MAPA_ADRESA = 'https://www.google.com/maps?q=Milady%20Hor%C3%A1kov%C3%A9%20398%2F30%2C%20170%2000%20Praha%207&hl=cs&z=16&output=embed';
  function mapa(povoleno) {
    Array.prototype.forEach.call(d.querySelectorAll('[data-mapa]'), function (blok) {
      var vyzva = blok.querySelector('[data-mapa-vyzva]');
      var ram = blok.querySelector('iframe');
      if (povoleno && !ram) {
        ram = d.createElement('iframe');
        ram.className = 'mapa__ram';
        ram.src = MAPA_ADRESA;
        ram.title = 'Mapa: DSTUDIO, Milady Horákové 398/30, Praha 7';
        ram.loading = 'lazy';
        ram.referrerPolicy = 'no-referrer';
        ram.setAttribute('allowfullscreen', '');
        blok.appendChild(ram);
        if (vyzva) vyzva.hidden = true;
      } else if (!povoleno && ram) {
        ram.remove();
        if (vyzva) vyzva.hidden = false;
      }
    });
  }

  /* ---------- Analytika: připravený háček, žádný nástroj není nasazen ----------
     Až bude měření návštěvnosti vybráno, vloží se jeho načtení sem.
     Funkce se volá jen tehdy, když návštěvník analytickou kategorii povolil. */
  var analytikaBezi = false;
  function analytika(povoleno) {
    if (!povoleno || analytikaBezi) return;
    analytikaBezi = true;
    d.dispatchEvent(new CustomEvent('dstudio:analytika-povolena'));
  }

  function pouzij(stav) {
    mapa(!!(stav && stav.externi));
    analytika(!!(stav && stav.analyticke));
  }

  /* ---------- Okno se souhlasem ---------- */
  function otevri(sNastavenim, spoustec) {
    if (!okno) return;
    var stav = precti() || {};
    KATEGORIE.forEach(function (k) {
      var pole = okno.querySelector('[name="' + k + '"]');
      if (pole) pole.checked = !!stav[k];
    });
    rozbal(!!sNastavenim);
    okno.hidden = false;
    d.body.classList.add('ma-souhlas-okno');
    navratFokusu = spoustec || null;
    if (spoustec) {
      var nadpis = okno.querySelector('.souhlas__nadpis');
      nadpis.setAttribute('tabindex', '-1');
      nadpis.focus();
    }
  }
  function zavri() {
    if (!okno) return;
    okno.hidden = true;
    d.body.classList.remove('ma-souhlas-okno');
    if (navratFokusu && navratFokusu.focus) navratFokusu.focus();
    navratFokusu = null;
  }
  function rozbal(ano) {
    var nastaveni = okno.querySelector('[data-souhlas-nastaveni]');
    var tlacitko = okno.querySelector('[data-souhlas-upravit]');
    if (nastaveni) nastaveni.hidden = !ano;
    if (tlacitko) {
      tlacitko.setAttribute('aria-expanded', String(ano));
      tlacitko.textContent = ano ? 'Skrýt nastavení' : 'Nastavení';
    }
  }

  function start() {
    Array.prototype.forEach.call(d.querySelectorAll('[data-souhlas-otevrit], [data-souhlas-povolit]'), function (t) {
      t.hidden = false;
    });

    if (okno) {
      okno.setAttribute('role', 'region');
      okno.querySelector('[data-souhlas-vse]').addEventListener('click', function () {
        uloz({ analyticke: true, externi: true }); zavri();
      });
      okno.querySelector('[data-souhlas-nic]').addEventListener('click', function () {
        uloz({ analyticke: false, externi: false }); zavri();
      });
      okno.querySelector('[data-souhlas-upravit]').addEventListener('click', function () {
        rozbal(okno.querySelector('[data-souhlas-nastaveni]').hidden);
      });
      okno.querySelector('[data-souhlas-nastaveni]').addEventListener('submit', function (u) {
        u.preventDefault();
        var volba = {};
        KATEGORIE.forEach(function (k) {
          var pole = okno.querySelector('[name="' + k + '"]');
          volba[k] = !!(pole && pole.checked);
        });
        uloz(volba); zavri();
      });
      d.addEventListener('keydown', function (u) {
        if (u.key === 'Escape' && !okno.hidden && precti()) zavri();
      });
    }

    d.addEventListener('click', function (u) {
      var otevrit = u.target.closest('[data-souhlas-otevrit]');
      if (otevrit) { otevri(true, otevrit); return; }
      var povolit = u.target.closest('[data-souhlas-povolit]');
      if (povolit) {
        var stav = precti() || {};
        var volba = { analyticke: !!stav.analyticke, externi: !!stav.externi };
        volba[povolit.getAttribute('data-souhlas-povolit')] = true;
        uloz(volba);
        if (okno && !okno.hidden) zavri();
      }
    });

    var stav = precti();
    if (stav) pouzij(stav);
    else otevri(false, null);
  }

  window.dstudioSouhlas = {
    ma: ma,
    otevri: function () { otevri(true, null); },
    priZmene: function (f) { if (typeof f === 'function') posluchaci.push(f); }
  };

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start);
  else start();
})();
