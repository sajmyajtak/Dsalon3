// Vyrenderuje rastrové verze favicony a OG obrázek z vektorového loga.
// Použití: node tools/render-assets.js  (spouští se ze složky dstudio-web)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const site = path.resolve(__dirname, '..', 'site');
const fav = fs.readFileSync(path.join(site, 'favicon.svg'), 'utf8');
const logo = fs.readFileSync(path.join(site, 'assets/svg/dstudio-logo-chocolate.svg'), 'utf8');
const inter = fs.readFileSync(path.join(site, 'assets/fonts/inter-500.woff2')).toString('base64');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  for (const [soubor, velikost] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    await page.setViewportSize({ width: velikost, height: velikost });
    await page.setContent(`<style>html,body{margin:0}svg{display:block;width:${velikost}px;height:${velikost}px}</style>${fav}`);
    await page.screenshot({ path: path.join(site, soubor) });
  }

  // OG obrázek 1200 × 630: logo na krému, ochranná zóna = výška D, pod ním krátká linka a služby
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`
    <style>
      @font-face { font-family: Inter; src: url(data:font/woff2;base64,${inter}) format('woff2'); font-weight: 500; }
      html, body { margin: 0; }
      body { width: 1200px; height: 630px; background: #F4EFEA; display: grid; place-items: center; }
      .v { display: grid; justify-items: center; }
      .v svg { width: 560px; height: auto; display: block; }
      .l { width: 56px; height: 1px; background: #2B1E1A; margin-top: 92px; }
      p { margin: 26px 0 0; font: 500 17px/1 Inter, sans-serif; letter-spacing: .26em; text-transform: uppercase; color: #2B1E1A; }
    </style>
    <div class="v">${logo}<div class="l"></div><p>Manikúra · Pedikúra · Obočí · Řasy · Líčení</p></div>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(site, 'assets/img/og-dstudio.png') });
  await browser.close();
})();
