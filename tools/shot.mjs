// node tools/shot.mjs [slug ...] — captures shots/<slug>-<desk|mob>[-closed].jpg from the local server (port 8770)
import { chromium } from 'playwright';
import { readdirSync, mkdirSync } from 'node:fs';
const root = new URL('..', import.meta.url);
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(new URL('v/', root));
mkdirSync(new URL('shots/', root), { recursive: true });
const browser = await chromium.launch();
for (const [tag, viewport] of [['desk', { width: 1440, height: 900 }], ['mob', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  for (const slug of slugs) for (const season of ['open', 'closed']) {
    await page.goto(`http://localhost:8770/v/${slug}/?s=${season}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3500); // let entrance motion settle
    const file = `shots/${slug}-${tag}${season === 'closed' ? '-closed' : ''}.jpg`;
    await page.screenshot({ path: new URL(file, root).pathname.slice(1), type: 'jpeg', quality: 78 });
    console.log(file);
  }
  await page.close();
}
await browser.close();
