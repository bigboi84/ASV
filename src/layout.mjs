import fs from 'node:fs';
import { SITE, html, raw, esc, href, extAttrs, isExternal, icon } from './lib.mjs';

const MERCH = JSON.parse(fs.readFileSync(new URL('./data/merch.json', import.meta.url), 'utf8'));

const MARKET_ROUTES = ['/marketplace', '/shop'];

function isCurrent(route, current) {
  return route === current;
}

function header(nav, current, overlay = false) {
  const items = nav.map((it, i) => {
    if (!it.kids) {
      const cur = isCurrent(it.href, current);
      return html`<li class="nav-item"><a class="nav-link" href="${href(it.href)}"${cur ? raw(' aria-current="page"') : ''}>${it.label}</a></li>`;
    }
    const active = it.kids.some((k) => k.href === current);
    return html`
<li class="nav-item has-dropdown${active ? ' is-current' : ''}">
  <button type="button" class="nav-link" aria-expanded="false" aria-controls="menu-${i}">${it.label}<span class="caret" aria-hidden="true">▼</span></button>
  <ul class="dropdown" id="menu-${i}">${it.kids.map((k) => html`<li><a href="${href(k.href)}"${isCurrent(k.href, current) ? raw(' aria-current="page"') : ''}>${k.label}</a></li>`)}</ul>
</li>`;
  });
  return html`
<header class="site-header${overlay ? ' site-header--overlay' : ''}" data-el="site.header" data-el-build="theme-builder"${overlay ? raw(' data-overlay') : ''}>
  <div class="wrap site-header__inner">
    <a class="brand" href="index.html" aria-label="${SITE.name} home"><img class="brand__dark" src="assets/img/logo.png" alt="${SITE.legal}" width="600" height="160">${overlay ? raw('<img class="brand__light" src="assets/img/logo-reverse.png" alt="" width="600" height="160">') : ''}</a>
    <nav class="primary-nav" aria-label="Primary"><ul>${items}</ul></nav>
    <button type="button" class="menu-toggle" data-drawer-open aria-controls="site-drawer" aria-expanded="false">
      <span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>Menu
    </button>
  </div>
</header>`;
}

function drawer(nav, current, inMarket = false) {
  const groups = nav.map((it, i) => {
    if (!it.kids) {
      return html`<div class="drawer__group"><a class="drawer__link" href="${href(it.href)}"${isCurrent(it.href, current) ? raw(' aria-current="page"') : ''}>${it.label}</a></div>`;
    }
    const open = it.kids.some((k) => k.href === current);
    return html`
<div class="drawer__group">
  <button type="button" class="drawer__toggle" aria-expanded="${open ? 'true' : 'false'}" aria-controls="dsub-${i}">${it.label}<span class="plus" aria-hidden="true">+</span></button>
  <div class="drawer__sub" id="dsub-${i}"${open ? '' : raw(' hidden')}>${it.kids.map((k) => html`<a href="${href(k.href)}"${isCurrent(k.href, current) ? raw(' aria-current="page"') : ''}>${k.label}</a>`)}</div>
</div>`;
  });
  return html`
<div class="drawer" id="site-drawer" data-el="marketplace.drawer" data-el-build="theme-builder" hidden>
  <button type="button" class="drawer__scrim" data-drawer-close tabindex="-1" aria-label="Close menu"></button>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Site menu">
    <div class="drawer__head">
      <img src="assets/img/logo-reverse.png" alt="${SITE.legal}" width="600" height="160">
      <button type="button" class="drawer__close" data-drawer-close aria-label="Close menu">×</button>
    </div>
    <nav aria-label="Site">
      ${inMarket ? html`<p class="drawer__note">Explore the rest of AFSV VRC</p>` : ''}
      ${groups}
      <div class="drawer__ctas">
        ${inMarket ? html`<a class="btn btn--line-light" href="marketplace.html#buyer-form">Join the launch list</a><a class="btn btn--line-light" href="marketplace.html#vendor-form">Sell with us</a>` : ''}
        <a class="btn btn--gold" href="${SITE.booking}" target="_blank" rel="noopener noreferrer">Book Now<span class="sr-only"> (opens in a new tab)</span>${icon('external')}</a>
        <a class="btn btn--line-light" href="contact.html">Contact</a>
      </div>
    </nav>
  </div>
</div>`;
}

// Marketplace header: replaces the site header (and the dock) on every shop page.
// Shop categories + The Collection up front; the rest of the site lives in the menu drawer and footer.
function shopHeader(current) {
  const onShop = current === '/shop' || current.startsWith('/product/');
  const lines = [
    { label: 'Executive', ids: MERCH.collections.filter((c) => c.line === 'executive') },
    { label: 'Everyday & Sport', ids: MERCH.collections.filter((c) => c.line === 'everyday') },
  ];
  const count = (id) => MERCH.products.filter((p) => p.collection === id).length;
  return html`
<header class="site-header shop-header" data-el="marketplace.header" data-el-build="theme-builder">
  <div class="wrap shop-header__inner">
    <a class="brand" href="index.html" aria-label="${SITE.name} home"><img src="assets/img/logo.png" alt="${SITE.legal}" width="600" height="160"></a>
    <a class="shop-header__label" href="marketplace.html"${current === '/marketplace' ? raw(' aria-current="page"') : ''}>Marketplace</a>
    <nav class="shop-nav" aria-label="Marketplace">
      <ul>
        <li class="nav-item has-dropdown">
          <button type="button" class="nav-link" aria-expanded="false" aria-controls="shop-menu">Shop<span class="caret" aria-hidden="true">▼</span></button>
          <div class="dropdown shop-menu" id="shop-menu">
            ${lines.map((l) => html`
            <div class="shop-menu__group">
              <p class="shop-menu__line">${l.label}</p>
              ${l.ids.map((c) => html`<a href="shop.html#${c.id}">${c.name.replace(/^Everyday & Sport /, '').replace(/^Executive /, '')}<span>${count(c.id)}</span></a>`)}
            </div>`)}
            <a class="shop-menu__all" href="shop.html">All pieces<span>${MERCH.products.length}</span></a>
          </div>
        </li>
        <li class="nav-item"><a class="nav-link" href="shop.html"${onShop ? raw(' aria-current="page"') : ''}>The Collection</a></li>
      </ul>
    </nav>
    <div class="shop-header__actions">
      <a class="btn btn--line-dark btn--sm shop-header__sell" href="marketplace.html#vendor-form">Sell with us</a>
      <a class="btn btn--gold btn--sm shop-header__join" href="marketplace.html#buyer-form">Join the launch list</a>
      <button type="button" class="menu-toggle shop-header__menu" data-drawer-open aria-controls="site-drawer" aria-expanded="false">
        <span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>Menu
      </button>
    </div>
  </div>
</header>`;
}

// Floating dock: replaces the top header once the visitor scrolls past the first screen.
const DOCK = [
  { label: 'About', route: '/about' },
  { label: 'Smart Sports Village', route: '/whitby-smart-sports-village' },
  { label: 'Programs', route: '/programs' },
  { label: 'Neurodiversity', route: '/neurodiversity' },
  { label: 'Membership', route: '/membership' },
  { label: 'Marketplace', route: '/marketplace' },
];
function dock(current) {
  return html`
<nav class="dock" aria-label="Quick navigation" data-dock data-el="site.dock" data-el-build="theme-builder">
  <a class="dock__top" href="#main" aria-label="Back to top">${icon('up')}</a>
  <ul class="dock__links">${DOCK.map((d) => html`<li><a href="${href(d.route)}"${d.route === current ? raw(' aria-current="page"') : ''}>${d.label}</a></li>`)}</ul>
  <button type="button" class="dock__menu" data-drawer-open aria-controls="site-drawer" aria-expanded="false"><span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>Menu</button>
  <a class="btn btn--gold btn--sm dock__cta" href="${SITE.booking}" target="_blank" rel="noopener noreferrer">Book Now<span class="sr-only"> (opens in a new tab)</span></a>
</nav>`;
}

const ECOSYSTEM = [
  ['AFSV VRC™ Development Group Ltd.', 'Infrastructure development'],
  ['MLMSR Mentorship LLC', 'Education & inclusion programming'],
  ['EFN – Esports & Fans Network', 'Digital & esports division'],
];
const MARKS = ['AFSVHCL™', 'Athletes & Fans Sports Village™', 'FanZone™', 'AFSV VRC™', 'AFSVHCL Marketplace™', 'AFSVHCL Executive Collection™', 'AFSVHCL Founder Series™', 'AFSVHCL Legacy Collection™'];

function footer(cols) {
  return html`
<footer class="site-footer" data-el="site.footer" data-el-build="theme-builder">
  <div class="wrap site-footer__grid">
    <div class="site-footer__brand">
      <img src="assets/img/logo-reverse.png" alt="${SITE.legal}" width="600" height="160" loading="lazy">
      <p class="site-footer__tag">Building Futures. Inspiring Potential. Strengthening Communities. A Canadian vision with global impact.</p>
      <ul class="site-footer__contact">
        <li><span>Location</span>Whitby, Ontario, Canada</li>
        <li><span>Email</span><a href="mailto:afsvhcl@gmail.com">afsvhcl@gmail.com</a></li>
        <li><span>Leadership</span>Martin Lashley – Chairman &amp; CEO</li>
      </ul>
      <div class="btn-row"><a class="btn btn--gold btn--sm" href="membership.html">Community membership</a><a class="btn btn--line-light btn--sm" href="partners.html">Ecosystem partners</a></div>
    </div>
    ${cols.map((col) => html`
    <div>
      <h2>${col.title}</h2>
      <ul>${col.links.map((l) => html`<li><a href="${href(l.href)}"${extAttrs(l.href)}>${l.label}${isExternal(l.href) ? raw('<span class="sr-only"> (opens in a new tab)</span>') : ''}</a></li>`)}</ul>
    </div>`)}
  </div>
  <div class="wrap site-footer__eco">
    <div>
      <h2>AFSVHCL™ ecosystem</h2>
      <ul class="site-footer__entities">${ECOSYSTEM.map(([n, r]) => html`<li><b>${n}</b><span>${r}</span></li>`)}</ul>
    </div>
    <div>
      <h2>Trademark notices</h2>
      <ul class="site-footer__marks">${MARKS.map((m) => html`<li>${m}</li>`)}</ul>
      <p class="site-footer__fine">™ indicates an unregistered trademark.</p>
    </div>
  </div>
  <div class="wrap site-footer__disclaimer">
    <p><b>Development-stage disclaimer.</b> AFSVHCL™ is a development-stage company. The Smart Sports Village and all related facilities, programs, services and initiatives described on this website are proposed concepts only — they do not currently exist as operational facilities or active programs. All concepts, timelines, projections, partnerships and proposed activities are for informational and exploratory discussion purposes only and remain subject to financing, regulatory approvals, due diligence, feasibility analysis and execution capacity. No memberships, programs or services are currently available for purchase. No securities are being offered. See our <a href="compliance.html">Compliance &amp; Legal</a> page for full disclosures.</p>
  </div>
  <div class="site-footer__bar">
    <div class="wrap">
      <p>© ${new Date().getFullYear()} Athletes &amp; Fans Sports Village Holding Company Limited (AFSVHCL). All rights reserved.</p>
      <nav aria-label="Legal"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="refund-policy.html">Refunds</a><a href="shipping-policy.html">Shipping</a><a href="accessibility.html">Accessibility</a><a href="compliance.html">Compliance</a></nav>
    </div>
  </div>
</footer>`;
}

export function page({ data, route, title, description, body, scripts = '', ogImage, overlay = false, fonts = [] }) {
  const inMarket = MARKET_ROUTES.includes(route) || route.startsWith('/product/');
  const fullTitle = route === '/' ? `${SITE.tagline} | ${SITE.name}` : `${title} | ${SITE.name}`;
  const canonical = SITE.url + (route === '/' ? '/' : route);
  const og = ogImage || 'assets/img/hero-fieldhouse.jpg';
  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="theme-color" content="#091E36">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
${fonts.length ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts.map((f) => 'family=' + f.replace(/ /g, '+')).join('&')}&display=swap">` : ''}
</head>
<body${inMarket ? ' class="is-market"' : ''}>
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="sketchy" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0.9" xChannelSelector="R" yChannelSelector="G"/></filter></svg>
<a class="skip-link" href="#main">Skip to main content</a>
${overlay ? '<div class="masthead masthead--overlay">' : ''}
<div class="announce" role="region" aria-label="Site notice" data-el="site.announcement" data-el-build="theme-builder">
  <div class="wrap announce__inner">
    <p>AFSV VRC is in active development. Facilities, programs and partnerships shown as proposed or planned are future-state concepts and are not yet operational.</p>
    <button type="button" class="announce__close">Dismiss<span class="sr-only"> site notice</span></button>
  </div>
</div>
${inMarket ? shopHeader(route) : header(data.nav, route, overlay)}
${overlay ? '</div>' : ''}
${inMarket ? '' : dock(route)}
${drawer(data.nav, route, inMarket)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(data.footerCols)}
<button type="button" class="to-top" aria-label="Back to top">${icon('up')}</button>
${scripts}
<script src="assets/js/site.js" defer></script>
<script src="assets/js/motion.js" defer></script>
<script src="assets/js/flow.js" defer></script>
</body>
</html>
`;
}
