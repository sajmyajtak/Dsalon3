"""QR kód s čistým odkazem na rezervaci (https://noona.app/dstudio) jako jedna SVG křivka.
Po vygenerování se kód dekóduje zpět a porovná s odkazem."""
import sys, segno, pathlib
URL = "https://noona.app/dstudio"
out = pathlib.Path(sys.argv[1])
qr = segno.make(URL, error="m", micro=False)
m = [list(r) for r in qr.matrix]
n = len(m)
d = []
for y, row in enumerate(m):
    x = 0
    while x < n:
        if row[x]:
            x0 = x
            while x < n and row[x]:
                x += 1
            d.append(f"M{x0} {y}h{x - x0}v1h-{x - x0}z")
        else:
            x += 1
q = 2  # klidová zóna v modulech
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-q} {-q} {n + 2*q} {n + 2*q}" shape-rendering="crispEdges">'
       f'<title>QR kód: online rezervace DSTUDIO v Noona</title>'
       f'<rect x="{-q}" y="{-q}" width="{n + 2*q}" height="{n + 2*q}" fill="#F4EFEA"/>'
       f'<path fill="#2B1E1A" d="{"".join(d)}"/></svg>\n')
out.write_text(svg)
print("moduly:", n, "verze:", qr.version, "bytes:", len(svg))
# Kontrola čitelnosti
import numpy as np, cv2
s = 12
img = np.full(((n + 2*q) * s, (n + 2*q) * s, 3), (234, 239, 244), np.uint8)
for y in range(n):
    for x in range(n):
        if m[y][x]:
            img[(y+q)*s:(y+q+1)*s, (x+q)*s:(x+q+1)*s] = (26, 30, 43)
val, pts, _ = cv2.QRCodeDetector().detectAndDecode(img)
print("dekódováno:", repr(val)); assert val == URL
