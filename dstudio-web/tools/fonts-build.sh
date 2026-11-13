#!/usr/bin/env bash
# Subsety písem pro web: latinka + latinka rozšířená A (čeština), interpunkce, šipky.
# Jeden soubor na řez = kerning funguje i mezi znaky s diakritikou a bez ní.
# Použití: tools/fonts-build.sh <složka s TTF> <výstupní složka>
set -euo pipefail
SRC="$1"; OUT="$2"
UNI="U+0020-007E,U+00A0-00FF,U+0100-017F,U+2009,U+200A,U+202F,U+2010-2015,U+2018-201E,U+2022,U+2026,U+2032,U+2033,U+2039,U+203A,U+20AC,U+2116,U+2190-2193,U+2197,U+2212,U+00D7"
for W in 400Regular 500Medium 600SemiBold; do
  N=$(echo "$W" | cut -c1-3)
  pyftsubset "$SRC/inter/$W/Inter_$W.ttf" --unicodes="$UNI" --flavor=woff2 --no-hinting \
    --layout-features=kern,calt,ccmp,locl,mark,mkmk,tnum,case,cpsp,zero \
    --output-file="$OUT/inter-$N.woff2"
done
pyftsubset "$SRC/cormorant-garamond/300Light/CormorantGaramond_300Light.ttf" --unicodes="$UNI" --flavor=woff2 --no-hinting \
  --layout-features=kern,liga,calt,ccmp,locl,mark,mkmk,lnum,onum,tnum,case \
  --output-file="$OUT/cormorant-garamond-300.woff2"
ls -la "$OUT"
