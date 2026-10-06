import { SITE, html, raw, esc, href, extAttrs, isExternal, icon } from './lib.mjs';

const MARKET_ROUTES = ['/marketplace', '/shop', '/vendors', '/cart', '/checkout', '/order-received'];

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

function drawer(nav, current) {
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
      ${groups}
      <div class="drawer__ctas">
        <a class="btn btn--gold" href="${SITE.booking}" target="_blank" rel="noopener noreferrer">Book Now<span class="sr-only"> (opens in a new tab)</span>${icon('external')}</a>
        <a class="btn btn--line-light" href="contact.html">Contact</a>
      </div>
    </nav>
  </div>
</div>`;
}

function marketBar(current) {
  const tabs = [
    { label: 'Overview', route: '/marketplace' },
    { label: 'Shop All', route: '/shop' },
    { label: 'Vendors', route: '/vendors' },
    { label: 'Cart', route: '/cart' },
  ];
  return html`
<div class="market-bar" data-el="marketplace.bar" data-el-build="theme-builder">
  <div class="wrap market-bar__inner">
    <div class="market-bar__title">Marketplace</div>
    <nav aria-label="Marketplace">${tabs.map((t) => {
      const on = t.route === '/shop' ? current === '/shop' || current.startsWith('/product/') : current === t.route;
      return html`<a href="${href(t.route)}"${on ? raw(' aria-current="page"') : ''}>${t.label}</a>`;
    })}</nav>
    <div class="market-bar__actions">
      <a class="btn btn--line-light btn--sm market-bar__sell" href="marketplace.html#vendor-form">Sell with us</a>
      <a class="btn btn--gold btn--sm cart-link" href="cart.html" aria-label="View cart">Cart<span class="cart-count" data-cart-count>0</span></a>
    </div>
  </div>
</div>`;
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

function footer(cols) {
  return html`
<footer class="site-footer" data-el="site.footer" data-el-build="theme-builder">
  <div class="wrap site-footer__grid">
    <div class="site-footer__brand">
      <img src="assets/img/logo-reverse.png" alt="${SITE.legal}" width="600" height="160" loading="lazy">
      <p class="site-footer__tag">${SITE.tagline}</p>
      <div class="site-footer__contact">
        <p>A public inquiry mailbox will be published once routing is confirmed. Until then, the contact form reaches the right team.</p>
        <a class="text-link text-link--light" href="contact.html">Contact AFSV VRC ${raw('<span class="arrow" aria-hidden="true">')}${icon('arrow')}${raw('</span>')}</a>
      </div>
    </div>
    ${cols.map((col) => html`
    <div>
      <h2>${col.title}</h2>
      <ul>${col.links.map((l) => html`<li><a href="${href(l.href)}"${extAttrs(l.href)}>${l.label}${isExternal(l.href) ? raw('<span class="sr-only"> (opens in a new tab)</span>') : ''}</a></li>`)}</ul>
    </div>`)}
  </div>
  <div class="site-footer__bar">
    <div class="wrap">
      <p>© ${new Date().getFullYear()} ${SITE.legal} Proposed and planned items are future-state and not yet operational.</p>
      <nav aria-label="Legal"><a href="legal.html">Legal &amp; policies</a><a href="accessibility-privacy.html">Accessibility</a><a href="accessibility-privacy.html#support">Report an issue</a></nav>
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
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${overlay ? '<div class="masthead masthead--overlay">' : ''}
<div class="announce" role="region" aria-label="Site notice" data-el="site.announcement" data-el-build="theme-builder">
  <div class="wrap announce__inner">
    <p>AFSV VRC is in active development. Facilities, programs and partnerships shown as proposed or planned are future-state concepts and are not yet operational.</p>
    <button type="button" class="announce__close">Dismiss<span class="sr-only"> site notice</span></button>
  </div>
</div>
${header(data.nav, route, overlay)}
${overlay ? '</div>' : ''}
${dock(route)}
${inMarket ? marketBar(route) : ''}
${drawer(data.nav, route)}
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
