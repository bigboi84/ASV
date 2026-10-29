// book.afsvvrc.com static build: `node book/build.mjs` → writes the site to book/dist.
// Separate from the main site (src/), but reuses its CSS, fonts, images, scripts and components.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, raw, esc, href, extAttrs, isExternal, SITE } from '../src/lib.mjs';
import * as B from './pages.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const out = path.join(here, 'dist');
const URL_BASE = 'https://book.afsvvrc.com';
const MAIN = B.MAIN;

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Listings', href: '/what-you-can-list-and-book' },
  { label: 'Academies & schools', href: '/academies-teams-schools' },
  { label: 'Venues', href: '/venues-and-facilities' },
  { label: 'Membership', href: '/membership' },
  { label: 'FAQs', href: '/faq' },
];
const LEGAL = [['Privacy', 'privacy'], ['Terms', 'terms'], ['Refunds', 'refund-policy'], ['Accessibility', 'accessibility']];

const link = (it, cur, cls) => html`<a class="${cls}" href="${href(it.href)}"${it.href === cur ? raw(' aria-current="page"') : ''}>${it.label}</a>`;

function layout({ route, title, description, ogImage, body }) {
  const full = route === '/' ? `${title} | ${SITE.name} Booking` : `${title} | ${SITE.name} Booking`;
  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${URL_BASE}${route === '/' ? '/' : route}">
<meta name="theme-color" content="#091E36">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AFSV VRC Booking">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${URL_BASE}/${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
<style>.header-actions{display:flex;gap:10px;justify-self:end}@media(max-width:1099px){.header-actions{display:none}}</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header" data-el="book.header">
  <div class="wrap site-header__inner">
    <a class="brand" href="index.html" aria-label="AFSV VRC Booking home"><img class="brand__dark" src="assets/img/logo.png" alt="${SITE.legal}" width="600" height="160"></a>
    <nav class="primary-nav" aria-label="Primary"><ul>${NAV.map((n) => html`<li class="nav-item">${link(n, route, 'nav-link')}</li>`).join('')}</ul></nav>
    <div class="header-actions"><a class="btn btn--line-dark btn--sm header-cta" href="${B.APP_URL}">Log in</a><a class="btn btn--gold btn--sm header-cta" href="register.html">Sign up</a></div>
    <button type="button" class="menu-toggle" data-drawer-open aria-controls="site-drawer" aria-expanded="false"><span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>Menu</button>
  </div>
</header>
<div class="drawer" id="site-drawer" hidden>
  <button type="button" class="drawer__scrim" data-drawer-close tabindex="-1" aria-label="Close menu"></button>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Site menu">
    <div class="drawer__head"><img src="assets/img/logo-reverse.png" alt="${SITE.legal}" width="600" height="160"><button type="button" class="drawer__close" data-drawer-close aria-label="Close menu">×</button></div>
    <nav aria-label="Site">
      ${NAV.map((n) => html`<div class="drawer__group">${link(n, route, 'drawer__link')}</div>`).join('')}
      <div class="drawer__group"><a class="drawer__link" href="contact.html">Contact</a></div>
      <div class="drawer__ctas"><a class="btn btn--gold" href="register.html">Sign up</a><a class="btn btn--line-light" href="${B.APP_URL}">Log in</a><a class="btn btn--line-light" href="${MAIN}">afsvvrc.com</a></div>
    </nav>
  </div>
</div>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="wrap site-footer__grid">
    <div class="site-footer__brand">
      <img src="assets/img/logo-reverse.png" alt="${SITE.legal}" width="600" height="160" loading="lazy">
      <p class="site-footer__tag">AFSV VRC Booking. List it. Find it. Book it.</p>
      <ul class="site-footer__contact">
        <li><span>Email</span><a href="mailto:info@afsvvrc.com">info@afsvvrc.com</a></li>
        <li><span>Main site</span><a href="${MAIN}">afsvvrc.com</a></li>
      </ul>
      <div class="btn-row"><a class="btn btn--gold btn--sm" href="register.html">Sign up</a><a class="btn btn--line-light btn--sm" href="${B.APP_URL}">Log in</a></div>
    </div>
    <details class="fcol" open data-fcol><summary><h2>Booking</h2></summary><ul>${NAV.slice(1).map((n) => html`<li>${link(n, route, '')}</li>`).join('')}<li><a href="contact.html">Contact</a></li></ul></details>
    <details class="fcol" open data-fcol><summary><h2>AFSV VRC</h2></summary><ul>
      <li><a href="${MAIN}/marketplace">Marketplace</a></li><li><a href="${MAIN}/fanzone">FanZone™</a></li><li><a href="${MAIN}/programs">Programs</a></li><li><a href="${MAIN}/whitby-smart-sports-village">Whitby Sports Village</a></li></ul></details>
  </div>
  <div class="wrap site-footer__disclaimer"><p><b>Development-stage disclaimer.</b> AFSV VRC is a development-stage company. Public booking is not yet open, and facilities, programs and services described as proposed or planned are not yet operational.</p></div>
  <div class="site-footer__bar"><div class="wrap">
    <p>© ${new Date().getFullYear()} AFSV VRC Global Development Group Limited. All rights reserved.</p>
    <nav aria-label="Legal">${LEGAL.map(([l, s]) => html`<a href="${MAIN}/${s}">${l}</a>`).join('')}</nav>
  </div></div>
</footer>
<script>window.AFSV_FORMS='/api/form/';</script>
<script src="assets/js/site.js" defer></script>
<script src="assets/js/motion.js" defer></script>
</body>
</html>
`;
}

const pages = [
  ['/', B.home()],
  ['/what-you-can-list-and-book', B.whatsListed()],
  ['/academies-teams-schools', B.academies()],
  ['/venues-and-facilities', B.venues()],
  ['/membership', B.membership()],
  ['/register', B.register()],
  ['/login', B.login()],
  ['/faq', B.faqPage()],
  ['/contact', B.contact()],
  ['/404', B.notFound()],
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, 'src/assets'), path.join(out, 'assets'), { recursive: true });
fs.rmSync(path.join(out, 'assets/video'), { recursive: true, force: true }); // not used here

for (const [route, pg] of pages) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  let h = layout({ route, title: pg.title, description: pg.description, ogImage: pg.ogImage, body: String(pg.body) });
  // Policy links in shared form components point at the main site's legal pages.
  h = h.replace(/href="(privacy|terms)\.html"/g, `href="${MAIN}/$1"`);
  fs.writeFileSync(path.join(out, file), h);
}

const urls = pages.filter(([r]) => r !== '/404').map(([r]) => `  <url><loc>${URL_BASE}${r === '/' ? '/' : r}</loc></url>`).join('\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
// Development: keep out of search until launch (remove the Disallow line then).
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n# Development preview — remove the Disallow line at launch.\n');
fs.writeFileSync(path.join(out, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
console.log(`Built ${pages.length} pages → ${path.relative(root, out)}/`);
