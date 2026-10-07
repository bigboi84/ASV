// Static site build: `node src/build.mjs` → writes the finished site to /site.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './layout.mjs';
import * as P from './pages.mjs';
import * as MK from './marketplace.mjs';
import * as P2 from './pages2.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'site');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));
P.setVideos(JSON.parse(fs.readFileSync(path.join(root, 'src/data/videos.json'), 'utf8')));
const merch = JSON.parse(fs.readFileSync(path.join(root, 'src/data/merch.json'), 'utf8'));

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'src/assets'), path.join(out, 'assets'), { recursive: true });

const pages = [
  ['/', P.home(data)],
  ['/about', P.about(data)],
  ['/leadership', P.leadership(data)],
  ['/strategic-pillars', P.pillars(data)],
  ['/whitby-smart-sports-village', P.whitby(data)],
  ['/facilities', P.facilities(data)],
  ['/membership', P.membership(data)],
  ['/marketplace', MK.marketplace(data, merch)],
  ['/contact', P2.contactPage(data)],
  ['/partners', P.partners(data)],
  ...Object.keys(data.content).map((r) => [r, r === '/technology-media' ? P2.efn(data) : P.contentPage(data, r)]),
  ['/impact', P2.impact(data)],
  ['/fanzone', P2.fanzone(data)],
  ['/ambassadors', P2.ambassadors(data)],
  ['/compliance', P2.compliance(data)],
  ['/privacy', P2.privacy(data)],
  ['/terms', P2.terms(data)],
  ['/refund-policy', P2.refund(data)],
  ['/shipping-policy', P2.shipping(data)],
  ['/accessibility', P2.accessibility(data)],
  ['/events', P.events(data)],
  ['/news-impact', P.news(data)],
  ['/shop', MK.shop(data, merch)],
  ...merch.products.map((p) => [`/product/${p.slug}`, MK.merchProduct(data, merch, p)]),
  ['/404', P.notFound(data)],
];

for (const [route, pg] of pages) {
  const file = route === '/' ? 'index.html' : route.startsWith('/product/') ? `product-${route.slice(9)}.html` : `${route.slice(1)}.html`;
  const htmlOut = page({ data, route, title: pg.title, description: pg.description, ogImage: pg.ogImage, overlay: !!pg.overlay, fonts: pg.fonts || [], body: String(pg.body) });
  fs.writeFileSync(path.join(out, file), htmlOut);
}

// Sitemap for the eventual live domain.
const urls = pages.filter(([r]) => r !== '/404').map(([r]) => `  <url><loc>https://afsvvrc.com${r === '/' ? '/' : r}</loc></url>`).join('\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n# Development preview — remove the Disallow line at launch.\n');

console.log(`Built ${pages.length} pages → ${path.relative(root, out)}/`);
