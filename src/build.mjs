// Static site build: `node src/build.mjs` → writes the finished site to /site.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './layout.mjs';
import * as P from './pages.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'site');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));
P.setVideos(JSON.parse(fs.readFileSync(path.join(root, 'src/data/videos.json'), 'utf8')));

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'src/assets'), path.join(out, 'assets'), { recursive: true });

// Catalogue for the client-side cart (products + shipping only).
const catalog = {
  products: data.products.map(({ slug, name, vendor, category, price, img, variants }) => ({ slug, name, vendor, category, price, img, variants })),
  ship: data.ship,
};
fs.writeFileSync(path.join(out, 'assets/js/catalog.js'), `window.AFSV_CATALOG = ${JSON.stringify(catalog)};\n`);
const catalogTag = '<script src="assets/js/catalog.js" defer></script>';

const pages = [
  ['/', P.home(data)],
  ['/about', P.about(data)],
  ['/leadership', P.leadership(data)],
  ['/strategic-pillars', P.pillars(data)],
  ['/whitby-smart-sports-village', P.whitby(data)],
  ['/facilities', P.facilities(data)],
  ['/membership', P.membership(data)],
  ['/marketplace', P.marketplace(data)],
  ['/contact', P.contact(data)],
  ['/partners', P.partners(data)],
  ...Object.keys(data.content).map((r) => [r, P.contentPage(data, r)]),
  ['/events', P.events(data)],
  ['/news-impact', P.news(data)],
  ['/accessibility-privacy', P.access(data)],
  ['/legal', P.legal(data)],
  ['/shop', P.shop(data)],
  ['/vendors', P.vendors(data)],
  ['/cart', P.cart(data), true],
  ['/checkout', P.checkout(data), true],
  ['/order-received', P.orderReceived(data), true],
  ...data.products.map((p) => [`/product/${p.slug}`, P.product(data, p), true]),
  ['/404', P.notFound(data)],
];

for (const [route, pg, needsCatalog] of pages) {
  const file = route === '/' ? 'index.html' : route.startsWith('/product/') ? `product-${route.slice(9)}.html` : `${route.slice(1)}.html`;
  const htmlOut = page({ data, route, title: pg.title, description: pg.description, ogImage: pg.ogImage, overlay: !!pg.overlay, fonts: pg.fonts || [], body: String(pg.body), scripts: needsCatalog ? catalogTag : '' });
  fs.writeFileSync(path.join(out, file), htmlOut);
}

// Sitemap for the eventual live domain.
const urls = pages.filter(([r]) => r !== '/404').map(([r]) => `  <url><loc>https://afsvvrc.com${r === '/' ? '/' : r}</loc></url>`).join('\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n# Development preview — remove the Disallow line at launch.\n');

console.log(`Built ${pages.length} pages → ${path.relative(root, out)}/`);
