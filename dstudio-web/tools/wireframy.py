"""Rychlé wireframy (fáze 4): struktura a rozvržení stránek pro desktop 1440 a mobil 390.
Použití (ze složky dstudio-web):  python3 tools/wireframy.py
Výstup: docs/wireframy/*.svg
"""
import pathlib

CIL = pathlib.Path(__file__).resolve().parent.parent / 'docs' / 'wireframy'
CIL.mkdir(parents=True, exist_ok=True)

W, K, C, B, E = '#FFFFFF', '#F4EFEA', '#2B1E1A', '#D7BC95', '#0F4C3A'


class Platno:
    def __init__(self, sirka, meritko):
        self.s, self.m, self.y, self.p = sirka, meritko, 0, []

    def obd(self, x, y, w, h, fill='none', stroke=C, dash=False):
        self.p.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" stroke="%s" stroke-width="1"%s/>' % (
            x * self.m, y * self.m, w * self.m, h * self.m, fill, stroke, ' stroke-dasharray="4 3"' if dash else ''))

    def text(self, x, y, t, vel=11, barva=C, tucne=False, kotva='start'):
        self.p.append('<text x="%.1f" y="%.1f" font-family="Inter, Arial, sans-serif" font-size="%d" fill="%s"%s text-anchor="%s">%s</text>' % (
            x * self.m, y * self.m, vel, barva, ' font-weight="600"' if tucne else '', kotva, t))

    def cara(self, x1, y1, x2, y2, barva=B):
        self.p.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" fill="none"/>' % (x1 * self.m, y1 * self.m, x2 * self.m, y2 * self.m, barva))

    def vlna(self, y, barva=B):
        s = self.s
        self.p.append('<path d="M0 %.1f C %.1f %.1f, %.1f %.1f, %.1f %.1f S %.1f %.1f, %.1f %.1f" stroke="%s" fill="none"/>' % (
            (y + 60) * self.m, s * .25 * self.m, (y + 20) * self.m, s * .4 * self.m, (y - 60) * self.m, s * .6 * self.m, (y - 30) * self.m,
            s * .85 * self.m, (y + 70) * self.m, s * self.m, (y - 10) * self.m, barva))

    def sekce(self, nazev, vyska, pozadi, obsah):
        y0 = self.y
        self.obd(0, y0, self.s, vyska, pozadi, B)
        tm = pozadi in (C, E)
        barva = K if tm else C
        self.text(16 / self.m, y0 + 22 / self.m, nazev, 11, B if tm else E, True)
        obsah(self, y0, vyska, barva)
        self.y += vyska

    def uloz(self, soubor, titulek):
        vyska = self.y * self.m + 34
        hlava = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -34 %d %d" width="%d"><rect x="0" y="-34" width="100%%" height="100%%" fill="#FFFFFF"/>' % (
            self.s * self.m, vyska, self.s * self.m)
        hlava += '<text x="0" y="-12" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="%s">%s</text>' % (C, titulek)
        (CIL / soubor).write_text(hlava + ''.join(self.p) + '</svg>\n', encoding='utf-8')
        print(soubor)


def desktop():
    p = Platno(1440, 0.5)
    g = lambda n: 72 + (n - 1) * 108  # levý okraj sloupce n z 12

    def hlavicka(p, y, h, c):
        p.text(72, y + 46, 'LOGO (vektor, čokoláda)', 10, c, True)
        p.text(790, y + 46, 'O nás · Služby · Ceník · Práce · Tým · Kontakt', 10, c)
        p.obd(1230, y + 16, 138, 44, E, E); p.text(1299, y + 46, 'Rezervovat', 10, W, True, 'middle')
    p.sekce('HLAVIČKA (sticky)', 76, W, hlavicka)

    def uvod(p, y, h, c):
        p.vlna(y + 560)
        p.text(72, y + 150, '— ŠTÍTEK: Salon krásy · Praha 7 · ve dvoře', 10, E)
        p.text(72, y + 250, 'H1 Krása je v detailech.', 26, c)
        p.text(180, y + 330, 'Péče v přístupu. (odsazená věta)', 26, c)
        p.text(72, y + 400, 'podtext, max 30 em', 10, c)
        p.obd(72, y + 440, 230, 54, E, E); p.text(187, y + 472, 'Rezervovat online', 10, W, True, 'middle')
        p.text(336, y + 472, 'Prohlédnout naše práce →', 10, c)
        p.obd(g(9), y + 290, 200, 470, K, B); p.obd(g(9) + 214, y + 290, 200, 470, K, B)
        p.text(g(9) + 100, y + 440, 'OKNO 1: služby', 10, c, False, 'middle')
        p.text(g(9) + 314, y + 440, 'Rezervace + QR', 10, c, False, 'middle')
        p.text(g(9) + 100, y + 470, 'tabule 390×980', 9, c, False, 'middle')
        p.obd(0, y + 756, 1440, 68, C, C); p.text(72, y + 796, 'PRÁH (popředí): Kde · Kdy · Telefon', 10, K)
        p.text(72, y + 90, 'parallax: 1 linky · 2 okno · 3 text · 4 práh', 10, E)
    p.sekce('01 ÚVOD (bílá) – vrstvy s parallaxem', 824, W, uvod)

    def o_nas(p, y, h, c):
        p.text(72, y + 150, 'H2 Chvíle pro sebe', 22, c)
        p.text(72, y + 330, 'heslo: Čas pro vás. S péčí a láskou.', 12, B)
        p.cara(650, y, 630, y + h); p.text(660, y + 60, 'linka ve žlabu', 9, B)
        p.text(g(7), y + 120, 'úvodní odstavec (Cormorant)', 12, c)
        p.text(g(7), y + 190, 'odstavec 2', 10, c); p.text(g(7), y + 250, 'odstavec 3', 10, c)
    p.sekce('02 O DSTUDIO (čokoláda)', 600, C, o_nas)

    def filozofie(p, y, h, c):
        p.vlna(y + 300)
        p.text(72, y + 230, 'Naslouchat vám.', 44, c)
        p.text(1368, y + 380, 'Pečovat o detaily.', 44, c, False, 'end')
        p.text(720, y + 500, 'věta filozofie (vpravo dole)', 11, c)
    p.sekce('03 NAŠE FILOZOFIE (bílá) – velký typografický okamžik', 620, W, filozofie)

    def proc(p, y, h, c):
        p.text(72, y + 150, 'H2 Péče, kterou pocítíte…', 20, c); p.text(72, y + 180, '(sticky nadpis)', 9, c)
        for i, t in enumerate(['Začínáme vašimi přáními', 'Na detailech záleží', 'Milý a otevřený přístup', 'Pohodlná rezervace + tlačítko']):
            p.cara(g(7), y + 100 + i * 150, 1368, y + 100 + i * 150); p.text(g(7), y + 150 + i * 150, t, 13, c)
    p.sekce('04 PROČ DSTUDIO (krém + zrno) – seznam s linkami, žádné karty', 760, K, proc)

    def sluzby(p, y, h, c):
        p.text(72, y + 130, 'H2 Pět oken, pět směrů péče', 20, c)
        for i, t in enumerate(['Manikúra', 'Pedikúra', 'Obočí', 'Řasy', 'Líčení']):
            p.obd(72 + i * 152, y + 230, 138, 347, C if i == 0 else K, B)
            p.text(72 + i * 152 + 69, y + 560, t, 9, K if i == 0 else c, False, 'middle')
        p.text(g(9), y + 330, 'DETAIL SLUŽBY', 14, c, True); p.text(g(9), y + 370, 'popis · cena od · Ceny → · Rezervovat →', 10, c)
        p.text(72, y + 610, 'záložky: vybrané okno „zprůhlední"; linky navazují přes hrany tabulí', 9, E)
    p.sekce('05 SLUŽBY (bílá) – pět oken', 700, W, sluzby)

    def prace(p, y, h, c):
        p.text(72, y + 130, 'H2 Detaily, které mluví za nás', 20, c)
        for i in range(6):
            p.obd(72 + i * 220, y + 220 + (i % 2) * 44, 196, 245, W, B, True)
            p.text(72 + i * 220 + 98, y + 350 + (i % 2) * 44, 'N° 0%d 4:5' % (i + 1), 9, c, False, 'middle')
        p.text(72, y + 560, 'data/galerie.json · odkaz na Instagram', 9, E)
    p.sekce('06 NAŠE PRÁCE (krém) – místa pro fotografie 4:5', 640, K, prace)

    def tym(p, y, h, c):
        p.text(72, y + 150, 'H2 Poznejte nás blíž', 20, c)
        p.text(g(7), y + 120, 'text + Middle · Senior · Top', 12, c)
        for i in range(3):
            p.obd(g(7) + i * 212, y + 220, 212, 110, 'none', B); p.text(g(7) + i * 212 + 16, y + 285, ['Middle', 'Senior', 'Top'][i] + ' – cena', 11, c)
        p.obd(g(7), y + 400, 300, 54, E, E); p.text(g(7) + 150, y + 432, 'Vybrat specialistku v Noona', 10, W, True, 'middle')
        p.text(72, y + 520, 'karty členek: data/tym.json, v demu vypnuté', 9, E)
    p.sekce('07 NÁŠ TÝM (bílá)', 580, W, tym)

    def recenze(p, y, h, c):
        p.text(72, y + 130, 'H2 Vaše zkušenosti s DSTUDIO', 20, c)
        for i in range(3):
            p.obd(72 + i * 432, y + 220, 432, 200, 'none', B, True); p.text(72 + i * 432 + 20, y + 300, 'místo pro recenzi', 10, c)
    p.sekce('08 RECENZE (krém) – tři označená místa', 500, K, recenze)

    def cenik_obal(p, y, h, c):
        p.vlna(y + 280)
        p.text(60, y + 400, 'Ceník', 110, c)
        p.text(g(9), y + 230, 'Krása začíná péčí. · text · Rezervovat online', 10, c)
    p.sekce('09 CENÍK – obal (čokoláda), obří titul s výřezem', 480, C, cenik_obal)

    def cenik(p, y, h, c):
        p.obd(0, y, 1440, 70, K, B); p.text(72, y + 42, 'PŘEPÍNAČ: Všechny | Middle | Senior | Top (sticky)      01 · 02 · 03 · 04', 10, c)
        p.obd(72, y + 110, 648, 900, 'none', B); p.text(92, y + 160, '01 / NAIL CARE – Manikúra &amp; pedikúra', 12, c)
        p.obd(720, y + 110, 648, 440, 'none', B); p.text(740, y + 160, '02 / GEL NAILS – Modeláž nehtů', 12, c)
        p.obd(720, y + 550, 648, 460, 'none', B); p.text(740, y + 600, '03 / NAIL ART – Design nehtů', 12, c)
        p.obd(72, y + 1010, 1296, 420, 'none', B); p.text(92, y + 1060, '04 / BEAUTY – Obočí · Řasy · Líčení (3 sloupce)', 12, c)
        p.text(72, y + 1480, 'poznámky · Vytisknout ceník · Rezervovat online', 10, c)
        p.text(92, y + 200, 'tabulky: názvy vlevo, ceny vpravo do sloupců, linka pod řádkem, patička „DSTUDIO / CENY V KČ – 01"', 9, E)
    p.sekce('09 CENÍK – vnitřní strany (krém) z data/cenik.json', 1560, K, cenik)

    def otazky(p, y, h, c):
        p.text(72, y + 150, 'H2 Než k nám přijdete', 20, c)
        for i in range(8):
            p.cara(g(7), y + 100 + i * 70, 1368, y + 100 + i * 70); p.text(g(7), y + 142 + i * 70, 'otázka %d  +' % (i + 1), 11, c)
    p.sekce('10 ČASTÉ OTÁZKY (bílá) – data/faq.json', 720, W, otazky)

    def kontakt(p, y, h, c):
        p.text(72, y + 150, 'H2 Těšíme se na vás v DSTUDIO', 20, c)
        p.text(g(8), y + 130, 'text · [Jak se k nám dostanete] [Rezervovat online]', 10, c)
        p.obd(72, y + 260, 1296, 220, W, B); p.text(110, y + 380, 'CEDULE NA DVEŘE: Adresa | Otevírací doba | Telefon a Instagram', 12, c)
        p.text(72, y + 580, 'kroky 1–4 + odkazy do map', 11, c)
        p.obd(g(5), y + 540, 524, 440, W, B); p.text(g(5) + 30, y + 760, 'SCHÉMA CESTY (SVG): ulice → průchod → dvůr → vchod vlevo', 10, c)
        p.obd(g(10), y + 540, 300, 375, W, B, True); p.text(g(10) + 20, y + 730, 'foto vstupu 4:5', 10, c)
        p.obd(72, y + 1040, 1296, 110, W, B); p.text(110, y + 1100, 'MAPA – načte se až po souhlasu', 11, c)
    p.sekce('11 KONTAKT (krém)', 1240, K, kontakt)

    def vyzva(p, y, h, c):
        p.vlna(y + 300)
        p.text(72, y + 250, 'Dopřejte si čas pro sebe.', 36, c); p.text(180, y + 340, 'O detaily se postaráme my.', 36, c)
        p.obd(1062, y + 400, 270, 54, K, K); p.text(1197, y + 432, 'Rezervovat v DSTUDIO', 10, C, True, 'middle')
    p.sekce('12 ZÁVĚREČNÁ VÝZVA (smaragd)', 620, E, vyzva)

    def pata(p, y, h, c):
        p.text(72, y + 110, 'LOGO (krémové)', 12, c, True); p.text(1368, y + 110, 'Čas pro vás. S péčí a láskou.', 12, B, False, 'end')
        p.text(72, y + 230, 'Salon | Otevírací doba | Provozovatel (IČO, odpovědný vedoucí) | GDPR · Cookies · Nastavení cookies', 10, c)
    p.sekce('PATIČKA (čokoláda)', 360, C, pata)
    p.uloz('index-1440.svg', 'DSTUDIO – úvodní stránka, desktop 1440 px (zmenšeno na 50 %)')


def mobil():
    p = Platno(390, 1)

    def hlavicka(p, y, h, c):
        p.text(20, y + 46, 'LOGO', 10, c, True); p.text(370, y + 46, 'MENU ═', 10, c, False, 'end')
    p.sekce('HLAVIČKA', 64, W, hlavicka)

    def uvod(p, y, h, c):
        p.text(20, y + 100, 'H1 Krása je', 26, c); p.text(20, y + 136, 'v detailech.', 26, c); p.text(44, y + 172, 'Péče v přístupu.', 26, c)
        p.text(20, y + 220, 'podtext · řádek služeb', 10, c)
        p.obd(20, y + 280, 230, 54, E, E); p.text(135, y + 312, 'Rezervovat online', 10, W, True, 'middle')
        p.text(20, y + 366, 'Prohlédnout naše práce →', 10, c)
        p.vlna(y + 520)
        p.obd(20, y + 410, 170, 375, K, B); p.obd(200, y + 410, 170, 375, K, B)
        p.text(105, y + 590, 'služby', 10, c, False, 'middle'); p.text(285, y + 590, 'rezervace', 10, c, False, 'middle')
        p.obd(0, y + 760, 390, 110, C, C); p.text(20, y + 820, 'PRÁH: Kde · Kdy · Telefon', 10, K)
    p.sekce('01 ÚVOD', 870, W, uvod)

    for nazev, vyska, pozadi, radky in [
        ('02 O DSTUDIO', 560, C, ['H2 Chvíle pro sebe', 'tři odstavce', 'heslo: Čas pro vás.']),
        ('03 NAŠE FILOZOFIE', 380, W, ['Naslouchat vám.', 'Pečovat o detaily.', 'věta']),
        ('04 PROČ DSTUDIO', 900, K, ['H2', '4 body pod sebou s linkami', 'tlačítko Služby, ceník a rezervace']),
        ('05 SLUŽBY', 760, W, ['H2 + úvod', 'pruh pěti úzkých oken (záložky)', 'detail vybrané služby pod pruhem']),
        ('06 NAŠE PRÁCE', 1000, K, ['H2 + úvod', '6 míst 4:5 ve 2 sloupcích, střídavě posunutá']),
        ('07 NÁŠ TÝM', 720, W, ['H2 + text', 'Middle | Senior | Top', 'tlačítko do Noona']),
        ('08 RECENZE', 760, K, ['H2 + úvod', '3 místa pro recenzi pod sebou']),
        ('09 CENÍK – obal', 430, C, ['obří „Ceník"', 'Krása začíná péčí.', 'Rezervovat online']),
        ('09 CENÍK – strany', 3900, K, ['přepínač úrovně (sticky, výchozí Middle)', 'listy 01–04 pod sebou, jedna cena na řádek', 'poznámky · tisk · Rezervovat online']),
        ('10 ČASTÉ OTÁZKY', 760, W, ['H2', '8 rozbalovacích otázek']),
        ('11 KONTAKT', 2100, K, ['H2 + text + 2 tlačítka', 'cedule (3 bloky pod sebou)', 'kroky cesty', 'schéma', 'foto vstupu', 'mapa po souhlasu']),
        ('12 ZÁVĚREČNÁ VÝZVA', 400, E, ['Dopřejte si čas pro sebe…', 'Rezervovat v DSTUDIO']),
        ('PATIČKA', 900, C, ['logo · heslo', '4 bloky pod sebou', 'GDPR · Cookies · Nastavení']),
    ]:
        def obsah(p, y, h, c, radky=radky):
            for i, t in enumerate(radky):
                p.text(20, y + 60 + i * 26, t, 11, c)
        p.sekce(nazev, min(vyska, 420), pozadi, obsah)
        if vyska > 420:
            p.text(370, p.y - 10, '(skutečná výška ~%d px)' % vyska, 9, B, False, 'end')

    def lista(p, y, h, c):
        p.text(20, y + 38, 'PO–PÁ 9:00–19:00', 9, c); p.obd(190, y + 10, 180, 44, E, E); p.text(280, y + 37, 'Rezervovat online', 10, W, True, 'middle')
    p.sekce('LEPKAVÁ LIŠTA S REZERVACÍ (jen mobil)', 64, W, lista)
    p.uloz('index-390.svg', 'DSTUDIO – úvodní stránka, mobil 390 px (dlouhé sekce zkráceny)')


def podstranky():
    p = Platno(1440, 0.5)
    for nazev, obsah in [
        ('GDPR  /gdpr/', ['ZÁHLAVÍ (krém): štítek · H1 Ochrana osobních údajů · linky', 'TEXT (bílá): sloupec max 44 rem, H2 s krátkou linkou, seznamy s pomlčkou']),
        ('COOKIES  /cookies/', ['ZÁHLAVÍ (krém): štítek · H1 Cookies', 'TEXT (bílá): tabulka úložišť, kategorie, tlačítko Otevřít nastavení cookies']),
        ('404', ['KRÉM přes celou výšku: obří „404" v béžové, H1 Tudy cesta nevede', 'cedule „← Zpět na úvod", odkazy Ceník · Kontakt · Rezervovat online']),
    ]:
        def hlav(p, y, h, c):
            p.text(72, y + 46, 'hlavička stejná jako na úvodní stránce', 10, c)
        p.sekce(nazev + ' – hlavička', 76, W, hlav)

        def zah(p, y, h, c, obsah=obsah):
            p.vlna(y + 180); p.text(72, y + 150, obsah[0], 14, c)
        p.sekce(nazev, 300, K, zah)

        def tx(p, y, h, c, obsah=obsah):
            p.text(72, y + 120, obsah[1], 12, c)
        p.sekce(nazev + ' – obsah', 260, W, tx)

        def pat(p, y, h, c):
            p.text(72, y + 60, 'patička stejná jako na úvodní stránce', 10, c)
        p.sekce(nazev + ' – patička', 100, C, pat)
        p.y += 60
    p.uloz('podstranky-1440.svg', 'DSTUDIO – podstránky GDPR, Cookies a 404 (desktop, zmenšeno na 50 %)')


desktop()
mobil()
podstranky()
