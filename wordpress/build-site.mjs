// Builds the WordPress version of the site from the static build in site/ (run `node src/build.mjs` first):
//
//   node wordpress/build-site.mjs
//
// Output
//   afsv-vrc-core/content/page-*.json   one Elementor layout per page (each design section is an
//                                       Elementor HTML widget carrying the exact design markup)
//   afsv-vrc-theme/chrome/*.html        the site chrome (notice, header, floating menu, mobile menu,
//                                       footer) in three variants: overlay (home), default, market
//   afsv-vrc-theme/assets/              the design's CSS, JS, fonts, images and videos
//
// Links and asset paths become {{url:/…}} / {{asset:…}} placeholders that WordPress resolves.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = path.join(root, 'site');
const CORE = path.join(root, 'wordpress/afsv-vrc-core/content');
const THEME = path.join(root, 'wordpress/afsv-vrc-theme');
const id = () => crypto.randomBytes(4).toString('hex');

// The Collection and the product pages are WooCommerce: /shop/ and /product/<slug>/
// (rendered by the theme's woocommerce/ templates), so they are not imported as pages.
const WOO = (file) => file === 'shop' || file.startsWith('product-');
const MARKET = new Set(['marketplace', 'shop', 'become-a-vendor']);
const route = (file) => {
  if (file === 'index') return { slug: 'home', path: '/' };
  if (file === 'shop') return { slug: 'shop', path: '/shop/' };
  const m = /^product-(.+)$/.exec(file);
  if (m) return { slug: m[1], path: `/product/${m[1]}/` };
  return { slug: file, path: `/${file}/` };
};

// Static links and asset paths → placeholders.
function wpLinks(html) {
  return html
    .replace(/="assets\/([^"]+)"/g, (_, f) => `="{{asset:${f}}}"`)
    .replace(/url\((['"]?)assets\/([^)'"]+)\1\)/g, (_, q, f) => `url(${q}{{asset:${f}}}${q})`)
    .replace(/href="([a-z0-9-]+)\.html(\?[^"#]*)?(#[^"]*)?"/g, (_, f, q, h) => `href="{{url:${route(f).path}${q || ''}${h || ''}}}"`);
}

// Top-level elements of an HTML fragment.
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
function topLevel(html) {
  const out = []; let depth = 0; let start = -1;
  const re = /<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<\/?([a-zA-Z][\w-]*)(?:\s[^>]*?)?(\/?)>/g; let m;
  while ((m = re.exec(html))) {
    if (!m[1]) { if (depth === 0 && m[0].startsWith('<script')) out.push(m[0]); continue; }
    const tag = m[1].toLowerCase(); const closing = m[0][1] === '/'; const selfClose = m[2] === '/' || VOID.has(tag);
    if (closing) { depth--; if (depth === 0) { out.push(html.slice(start, re.lastIndex)); start = -1; } }
    else if (!selfClose) { if (depth === 0) start = m.index; depth++; }
    else if (depth === 0) out.push(m[0]);
  }
  return out.map((x) => x.trim()).filter(Boolean);
}

// One full-width, zero-padding Elementor container holding one HTML widget.
const htmlEl = (markup, title) => ({
  id: id(), elType: 'container', isInner: false,
  settings: {
    content_width: 'full', _title: title,
    padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: true },
    flex_gap: { unit: 'px', size: 0, column: '0', row: '0' },
  },
  elements: [{ id: id(), elType: 'widget', widgetType: 'html', settings: { html: markup }, elements: [] }],
});

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&rsquo;|&#8217;/g, '’');
const sectionTitle = (block, i) => {
  const el = (block.match(/data-el="([^"]+)"/) || [])[1];
  const h = (block.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/) || [])[1];
  return el || (h ? decode(h.replace(/<[^>]+>/g, '').trim()).slice(0, 60) : `Section ${i + 1}`);
};

// ───────── Pages ─────────
fs.rmSync(CORE, { recursive: true, force: true });
fs.mkdirSync(CORE, { recursive: true });
const files = fs.readdirSync(SITE).filter((f) => f.endsWith('.html') && f !== '404.html').map((f) => f.replace(/\.html$/, '')).filter((f) => !WOO(f));
const pages = [];
for (const file of files) {
  const html = fs.readFileSync(path.join(SITE, file + '.html'), 'utf8');
  const main = (html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/) || [])[1];
  if (!main) { console.warn('no <main> in', file); continue; }
  const r = route(file);
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || file).replace(/\s*\|\s*AFSV VRC.*$/, '').trim();
  const description = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const blocks = topLevel(main);
  const elements = blocks.map((b, i) => htmlEl(wpLinks(b), sectionTitle(b, i)));
  const chrome = html.includes('masthead--overlay') ? 'overlay' : (MARKET.has(file) || file.startsWith('product-')) ? 'market' : 'default';
  const page = { slug: r.slug, parent: r.parent || '', title: file === 'index' ? 'Home' : title, description, chrome, front: file === 'index', elements };
  fs.writeFileSync(path.join(CORE, `page-${r.parent ? r.parent + '--' : ''}${r.slug}.json`), JSON.stringify(page));
  pages.push(`${r.path}  (${blocks.length} sections, ${chrome})`);
}

// ───────── Chrome (everything around <main>) ─────────
fs.mkdirSync(path.join(THEME, 'chrome'), { recursive: true });
const neutral = (s) => s.replace(/ aria-current="page"/g, '').replace(/ is-current"/g, '"').replace(/class="nav-item has-dropdown is-current"/g, 'class="nav-item has-dropdown"');
for (const [variant, file] of [['overlay', 'index'], ['default', 'membership'], ['market', 'marketplace']]) {
  const html = fs.readFileSync(path.join(SITE, file + '.html'), 'utf8');
  const body = html.slice(html.indexOf('>', html.indexOf('<body')) + 1);
  const top = body.slice(0, body.indexOf('<main id="main"'));
  const bottom = body.slice(body.indexOf('</main>') + 7, body.lastIndexOf('<script'));
  const clean = (s) => neutral(wpLinks(s.replace(/<script\b[\s\S]*?<\/script>/g, (m) => (m.includes('src=') ? '' : m)))).trim();
  fs.writeFileSync(path.join(THEME, 'chrome', `${variant}-top.html`), clean(top) + '\n');
  fs.writeFileSync(path.join(THEME, 'chrome', `${variant}-bottom.html`), clean(bottom).replace(/<\/body>[\s\S]*$/, '') + '\n');
}

// Design sections the WooCommerce templates reuse.
{
  const shop = fs.readFileSync(path.join(SITE, 'shop.html'), 'utf8');
  const launch = topLevel((shop.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/) || [])[1]).find((b) => b.includes('id="buyer-form"'));
  fs.writeFileSync(path.join(THEME, 'chrome', 'part-launch-form.html'), wpLinks(launch) + '\n');
}

// ───────── Assets ─────────
fs.cpSync(path.join(SITE, 'assets'), path.join(THEME, 'assets'), { recursive: true });

console.log(`${pages.length} pages → wordpress/afsv-vrc-core/content`);
console.log(pages.join('\n'));
