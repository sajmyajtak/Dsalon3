"""Sestaví čisté SVG soubory loga z vektoru v brand booku (strana 1).

Vstup:  JSON s dílčími křivkami a jejich rozměry (změřeno v prohlížeči).
Výstup: loga bez pozadí a bez textových objektů, jedna <path>, tři barevné verze.
Tvar křivek se nemění, pouze se posouvá počátek souřadnic a zaokrouhluje.
"""
import json, re, sys, pathlib

src, out_site, out_src = sys.argv[1:4]
data = json.load(open(src))
subs, boxes = data["subs"], data["boxes"]

# Degenerované zbytky (osamocené "M x y") zahodíme.
keep = [(s, b) for s, b in zip(subs, boxes) if b["w"] > 0 and b["h"] > 0]
minx = min(b["x"] for _, b in keep); miny = min(b["y"] for _, b in keep)
maxx = max(b["x"] + b["w"] for _, b in keep); maxy = max(b["y"] + b["h"] for _, b in keep)
W, H = maxx - minx, maxy - miny

def shift(d, dx, dy):
    out, i = [], 0
    for tok in re.findall(r"[MLCZ]|-?\d+\.?\d*", d):
        if tok in "MLCZ":
            out.append(tok); i = 0
        else:
            v = float(tok) - (dx if i % 2 == 0 else dy); i += 1
            out.append(("%.2f" % v).rstrip("0").rstrip("."))
    s = " ".join(out)
    return re.sub(r"\s*([MLCZ])\s*", r"\1", s)

def path(items, dx, dy):
    return "".join(shift(s, dx, dy) for s, _ in items)

COLORS = {"chocolate": "#2B1E1A", "cream": "#F4EFEA", "white": "#FFFFFF"}
d_full = path(keep, minx, miny)

# Písmeno D = nejlevější znak horního řádku; jeho výška určuje ochrannou zónu.
top = [(s, b) for s, b in keep if b["y"] + b["h"] < miny + H * 0.7]
d_left = min(b["x"] for _, b in top)
D = [(s, b) for s, b in top if b["x"] < d_left + 90]
dh = max(b["h"] for _, b in D); dw = max(b["w"] for _, b in D)
dx0 = min(b["x"] for _, b in D); dy0 = min(b["y"] for _, b in D)

def svg(vb, d, fill, title=None, extra=""):
    t = f"<title>{title}</title>" if title else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img">{t}{extra}'
            f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>\n')

site = pathlib.Path(out_site); srcdir = pathlib.Path(out_src)
for name, col in COLORS.items():
    # Web: těsný výřez, ochrannou zónu drží CSS (odsazení = výška D).
    (site / f"dstudio-logo-{name}.svg").write_text(
        svg(f"0 0 {W:.2f} {H:.2f}", d_full, col, "DSTUDIO | Beauty Salon"))
    # Zdroj: verze s ochrannou zónou zapečenou do výřezu.
    pad = dh
    (srcdir / f"dstudio-logo-{name}-s-ochrannou-zonou.svg").write_text(
        svg(f"{-pad:.2f} {-pad:.2f} {W + 2 * pad:.2f} {H + 2 * pad:.2f}", d_full, col,
            "DSTUDIO | Beauty Salon"))

# Favicon: písmeno D vystředěné ve čtverci.
d_D = path(D, dx0, dy0)
side = dh * 1.9
ox, oy = (side - dw) / 2, (side - dh) / 2
fav = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side:.2f} {side:.2f}">'
       f'<rect width="100%" height="100%" fill="#2B1E1A"/>'
       f'<path transform="translate({ox:.2f} {oy:.2f})" fill="#F4EFEA" fill-rule="evenodd" d="{d_D}"/></svg>\n')
(site / "favicon.svg").write_text(fav)
(srcdir / "dstudio-pismeno-D.svg").write_text(
    svg(f"0 0 {dw:.2f} {dh:.2f}", d_D, "#2B1E1A", "DSTUDIO – písmeno D"))

meta = {"sirka": round(W, 2), "vyska": round(H, 2), "vyska_D": round(dh, 2),
        "pomer_vyska_D_ku_vysce_loga": round(dh / H, 4), "pomer_stran": round(W / H, 4)}
(srcdir / "rozmery.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n")
print(meta, len(d_full))
