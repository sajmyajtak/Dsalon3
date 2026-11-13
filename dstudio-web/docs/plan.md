# Fáze 2 – Plán

## Typ podniku a cíl

- **Služby, B2C.** Salon krásy pro klientky a klienty z Prahy 7 a okolí.
- **Převážně mobilní návštěvnost**, proto mobile-first a lepkavá lišta s rezervací.
- **Jediný cíl konverze: rezervace v Noona** (`https://noona.app/dstudio`). Tlačítko je v hlavičce, v úvodu,
  u služeb, v sekci Tým, v ceníku, v kontaktu, v závěrečné výzvě a v mobilní liště.
- Návštěvník má rychle zjistit **co, kde, kdy a kolik**: služby v úvodním okně, adresa a otevírací doba v pruhu pod úvodem,
  ceny u každé služby a v ceníku.

## Rozdělení podkladů

| Skupina | Co do ní patří |
|---|---|
| **Použitelné** | Vektorové logo, paleta pěti barev, písma Inter a Cormorant Garamond, slogan, texty klienta, ceník, kontakty a firemní údaje, tón komunikace, schválené mikrotexty, grafický jazyk tiskovin (linky, štítky, patičky), návrh oken |
| **Špatné / nahradit** | Nic. Žádný starší web neexistuje. V textech klienta se jen sjednocuje zápis „DStudio" na „DSTUDIO". |
| **Chybí úplně** | Fotky prací, členky týmu, recenze, fotografie vstupu, e-mail, DIČ, doména. Řešení je v `podklady.md` a v `REPORT.md`. |

## Struktura webu

**One-pager + 2 právní podstránky + 404.** Jiné řešení nedává smysl: obsahu je na jednu stránku, cíl je jediný a ceník
má být na dosah z každého místa.

```
/              úvodní stránka (vše podstatné)
/gdpr/         Ochrana osobních údajů
/cookies/      Cookies
/404.html      Stránka nenalezena
```

## Pořadí sekcí

Držím pořadí ze zadání beze změny:

1. **Úvod** – slogan, co salon dělá, rezervace
2. **O DSTUDIO** – Chvíle pro sebe
3. **Naše filozofie** – Naslouchat vám. Pečovat o detaily.
4. **Proč DSTUDIO** – čtyři důvody
5. **Služby** – pět směrů (nová sekce)
6. **Naše práce** – galerie
7. **Náš tým** – tři úrovně specialistek
8. **Recenze**
9. **Ceník** – interaktivní (nová sekce)
10. **Časté otázky** (nová sekce)
11. **Kontakt** – cedule, cesta, mapa
12. **Závěrečná výzva**
13. **Patička**

Navigace: O nás · Služby · Ceník · Práce · Tým · Kontakt + Rezervovat.

## Technika

Čistý statický web: HTML, jedno CSS, vanilla JS. Bez frameworku a bez buildu, složka `site/` se nasazuje tak, jak je.
Ceny, galerie, tým, recenze a otázky jsou v `site/data/*.json`.
