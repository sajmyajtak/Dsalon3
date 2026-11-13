# Fáze 1 – Research: inventář podkladů

Zdroje: zadání (prompt), brand book `DSTUDIO_Brandbook_2_0.pdf` (23 stran, ukrajinsky) a texty klienta ze zadání.
Nic dalšího nebylo použito. Nic nepochází z Instagramu, Googlu, stránek Noona ani z veřejných rejstříků.

Všech 23 stran je vyrenderovaných do PNG v `source-assets/brandbook-strany/`. Obrazové strany (ceníky, okna, cedule,
Stories) jsem prošel vizuálně, protože textová extrakce je na nich zdvojená.

## Co brand book říká (překlad a shrnutí po stranách)

| Str. | Obsah | Co z toho plyne pro web |
|---|---|---|
| 1 | Titul: Brand book, verze 2.0, „bílé hlavní pozadí" | Bílá je hlavní plocha, krémová doplňková. |
| 2 | Charakter značky: moderní salon krásy v Praze 7, teplá estetika, pozorný servis. Směry: manikúra, gel lak, zpevnění a prodloužení nehtů; pedikúra; úprava, barvení a laminace obočí; laminace a barvení řas; líčení. Přání a cenu domlouváme před procedurou, pomáháme vybrat službu i úroveň. Kurzy pro mistry jsou samostatný směr. Prodlužování řas v nabídce není. | Texty služeb, FAQ. Prodlužování řas nikde neslibovat. |
| 3 | Název a logo: jeden vektorový originál, DSTUDIO + BEAUTY SALON. V textech „DSTUDIO" nebo „DSTUDIO \| Beauty Salon". Logo se nesází písmem. „D Studio" a „D.Nails" se nepoužívá. | Logo jen jako vektor, název jen verzálkami. |
| 4 | Barevné verze loga: krémová na čokoládové, bílá na smaragdové; černá a bílá jen technicky. | V patičce krémové logo na čokoládě. |
| 5 | Ochranná zóna = výška písmene D ze všech stran. Barvy: Cream #F4EFEA, Chocolate #2B1E1A, Emerald #0F4C3A, White, Black. | Odsazení loga v hlavičce a patičce. |
| 6 | Paleta: White #FFFFFF (hlavní pozadí), Cream #F4EFEA (doplňkové pozadí), Chocolate #2B1E1A (text a inverze), Warm beige #D7BC95 (detaily a plochy), Emerald #0F4C3A (značkový akcent). Nové odstíny se nepřidávají. | Jen těchto pět barev, žádné průhlednosti ani přechody. |
| 7 | Kombinace: bílá + čokoládový text je základ. Béžová na detaily. Smaragd spojuje grafiku s interiérem a dárkovým balením. Drobné ceny a kontakty kontrastně. Béžový text na krému ne. Matné povrchy. | Smaragd pro rezervaci a štítky, béžová jen na linky a na tmavé plochy. |
| 8 | Písma: Inter (text, kontakty, ceny; Regular, Medium, Semibold), Cormorant Garamond (akcentní nadpisy, krátké, s prostorem). Čeština povinná. | Dva řezy, lokálně hostované. |
| 9 | Kompozice: jeden výrazný nadpis, srozumitelné oddíly, dostatek okrajů. Text ceníku vlevo, ceny do sloupců. Tenké linky a klidné plochy. Žádné koruny, řasy, stíny, přechody. Čitelnost má přednost před množstvím informací. | Ceník, obecná pravidla rozvržení. |
| 10 | Fotostyl: měkké rozptýlené světlo, teplá bilance bez žlutého filtru. Zachovat skutečný výsledek, nedomalovávat. Svislé 4:5. Střídat detaily prací, portréty, záběry salonu. | Galerie 4:5, žádné smyšlené fotky prací. |
| 11 | Vizitka 90 × 50 mm: Milady Horákové 398/30, Praha 7 · ve dvoře; +420 773 706 196, „Volání a messengery"; @dstudio_cz; QR na Noona. | Kontakty, QR kód v okně úvodu. |
| 12 | Dárkový poukaz 180 × 100 mm: „Dárkový poukaz", „Chvíle péče jen pro vás.", pole Pro / Hodnota / Platnost do. | Poukaz na webu zatím není (otevřená otázka). |
| 13 | Obálka poukazu: smaragdová, boční otevírání, světlé logo. | Smaragdová plocha závěrečné výzvy. |
| 14 | Čokoládový ceník, C-fold A3: obal „Ceník / SLUŽEB", krátká linka, „Krása začíná péčí."; zadní panel „Čas pro vás. S péčí a láskou.", QR, kontakty; vnitřní list 04 / BEAUTY. | Sekce Ceník: čokoládový obal a krémové strany. |
| 15 | Struktura ceníku: 01 / NAIL CARE, 02 / GEL NAILS, 03 / NAIL ART; „Váš styl. Vaše délka."; „Middle · Senior · Top – Tři úrovně specialistů. Vyberte si tu svou při rezervaci."; patičky „DSTUDIO / CENY V Kč" a číslo listu. | Datový soubor `data/cenik.json`, vzhled tabulek. |
| 16 | Okna: 5 okenních sestav, spodní tabule 390 × 980 mm, matná fólie s jemnými abstraktními linkami, které navazují na hranách. Okno 1 (vpravo): služby vlevo, online rezervace + QR + @dstudio_cz vpravo, nahoře logo. | Hlavní grafický motiv webu: tabule a linky. |
| 17 | Cedule na dveře: D. Y. Beauty s.r.o., IČO: 17419221, Milady Horákové 398/30, 170 00 Praha 7 – Holešovice; Otevírací doba Po–Pá 9:00–19:00, So–Ne pouze na objednání; Odpovědný vedoucí Diana Josypčuková; +420 773 706 196. | Kontaktní blok „cedule", patička, GDPR. |
| 18 | Výstrč 600 × 600 mm (matný mléčně béžový podklad, krátká tenká linka nad „VE DVOŘE") a navigační cedule „← VCHOD VLEVO / SALON VE DVOŘE". Jde o vizualizaci, ne o fotografii. | Štítek s krátkou linkou, schéma cesty, název konceptu. |
| 19 | Logo na recepci: plocha 980 × 400 mm, znak 620 × 159 mm. | Ověření proporcí vytaženého vektoru (620 : 159). |
| 20 | Instagram Stories: Ceník služeb, Manikúra, Obočí, Líčení; „Rezervace přes Noona", „Všechny ceny v Kč". | Druhé ověření cen. |
| 21 | Jazyk značky: přirozeně, zdvořile, konkrétně; bez nepotvrzených slibů a plošných slev. Vzor: „Dopřejte si chvíli péče v DSTUDIO. Vyberte si službu a termín online přes Noona." Odkaz https://noona.app/dstudio. | Tón doplněných textů, čistý odkaz na rezervaci. |
| 22 | Před výrobou: ověřit adresu 398/30, telefon, Instagram, aktuální služby a ceny. | Ceny v jednom souboru, snadná úprava. |
| 23 | Seznam souborů značky (mj. ceník česky, ukrajinsky, anglicky). | Otázka jazykových verzí. |

## Inventář

| Položka | Stav | Zdroj |
|---|---|---|
| Logo (vektor) | Vytaženo ze strany 1 jako jedna křivka, barva přesně #2B1E1A, poměr 619,89 × 159,21 (souhlasí s 620 × 159 na str. 19). Tři verze: čokoládová, krémová, bílá. | brand book str. 1, 3, 4 |
| Barvy | 5 barev, viz výše | str. 6 |
| Písma | Inter 400/500/600, Cormorant Garamond 300 (Light) | str. 8, vložená písma v PDF |
| Slogan | „Krása je v detailech. Péče v přístupu." | texty klienta |
| Mikrotexty | „Čas pro vás. S péčí a láskou.", „Krása začíná péčí.", „Chvíle péče jen pro vás.", „Váš styl. Vaše délka.", „Tři úrovně specialistů. Vyberte si tu svou při rezervaci.", „Rezervace přes Noona", „Všechny ceny v Kč" | str. 12, 14, 15, 20 |
| Texty webu | Úvod, O DSTUDIO, Filozofie, Proč DSTUDIO, Naše práce, Náš tým, Recenze, Kontakt, Závěrečná výzva | zadání, sekce 3 |
| Provozovatel | D. Y. Beauty s.r.o., IČO 17419221 | str. 17 |
| Adresa | Milady Horákové 398/30, 170 00 Praha 7 – Holešovice, ve dvoře, vchod vlevo | str. 11, 17, 18 |
| Telefon | +420 773 706 196 (volání a messengery) | str. 11, 17 |
| Instagram | @dstudio_cz | str. 11 |
| Rezervace | https://noona.app/dstudio | str. 16, 21 |
| Otevírací doba | Po–Pá 9:00–19:00, So–Ne pouze na objednání | str. 17 |
| Odpovědný vedoucí | Diana Josypčuková (jen v právní části) | str. 17 |
| Ceník | 4 skupiny, 8 tabulek, 55 položek | str. 14, 15, 20 |

## Ověření cen

Strany 14 a 15 jsem vyrenderoval ve 400 dpi a každou tabulku porovnal se zadáním, Stories na straně 20 posloužily jako
druhý zdroj. **Všechny ceny v zadání souhlasí s brand bookem, žádný rozdíl jsem nenašel.**
Jediná drobnost: u položky „Zkrácení nehtů" má tištěný ceník ve sloupcích Middle a Top prázdné místo (ne pomlčku)
a Stories ji uvádějí jako „Zkrácení nehtů · Senior 100 Kč". Na webu je u Middle a Top pomlčka s vysvětlivkou.

## Co v podkladech chybí

| Chybí | Jak je to na webu vyřešeno |
|---|---|
| Fotografie prací | Galerie napojená na `data/galerie.json`, 6 označených míst 4:5 |
| Jména, role a fotky specialistek | Sekce stojí na třech úrovních Middle · Senior · Top; karty členek jsou připravené a vypnuté |
| Recenze | 3 označená místa, žádný smyšlený text ani hvězdičky |
| Fotografie vstupu | Schéma cesty v SVG + označené místo pro fotku |
| E-mail, DIČ | Neuvedeno, otevřená otázka |
| Doména | Zástupná adresa `https://dstudio.example` |
| Storno podmínky, platební metody, délky procedur | Neuvedeno |
| Význam úrovní (praxe, kvalifikace) | Neuvedeno; web říká jen to, že se podle úrovně liší cena |
| Je cena designu za nehet, nebo za sadu? | Neuvedeno, otevřená otázka |
| Dárkový poukaz a kurzy pro mistry na webu | Nezobrazeno, otevřená otázka |
