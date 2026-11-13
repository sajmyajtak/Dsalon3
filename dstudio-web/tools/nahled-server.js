// Jednoduchý statický server pro náhled složky site/ (včetně hlaviček ze souboru _headers a stránky 404).
// Použití: node tools/nahled-server.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const koren = path.resolve(__dirname, '..', 'site');
const port = Number(process.argv[2]) || 8080;
const typy = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg'
};

// Hlavičky pro všechny cesty ("/*") ze souboru _headers
function hlavicky() {
  const soubor = path.join(koren, '_headers');
  const vysledek = {};
  if (!fs.existsSync(soubor)) return vysledek;
  let plati = false;
  for (const radek of fs.readFileSync(soubor, 'utf8').split('\n')) {
    if (!radek.trim() || radek.trim().startsWith('#')) continue;
    if (!/^\s/.test(radek)) { plati = radek.trim() === '/*'; continue; }
    if (!plati) continue;
    const i = radek.indexOf(':');
    vysledek[radek.slice(0, i).trim()] = radek.slice(i + 1).trim();
  }
  return vysledek;
}

http.createServer((req, res) => {
  let cesta = decodeURIComponent(req.url.split('?')[0]);
  if (cesta.endsWith('/')) cesta += 'index.html';
  let soubor = path.join(koren, cesta);
  let stav = 200;
  if (!soubor.startsWith(koren) || !fs.existsSync(soubor) || fs.statSync(soubor).isDirectory()) {
    if (fs.existsSync(soubor) && fs.statSync(soubor).isDirectory()) {
      res.writeHead(301, { Location: cesta + '/' }); res.end(); return;
    }
    soubor = path.join(koren, '404.html'); stav = 404;
  }
  const h = Object.assign({ 'Content-Type': typy[path.extname(soubor)] || 'application/octet-stream' }, hlavicky());
  // Textové soubory se posílají komprimované, stejně jako na ostrém hostingu.
  const textovy = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg)/.test(h['Content-Type']);
  if (textovy && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    h['Content-Encoding'] = 'gzip';
    h['Vary'] = 'Accept-Encoding';
    res.writeHead(stav, h);
    fs.createReadStream(soubor).pipe(zlib.createGzip()).pipe(res);
    return;
  }
  res.writeHead(stav, h);
  fs.createReadStream(soubor).pipe(res);
}).listen(port, () => console.log('Náhled běží na http://localhost:' + port));
