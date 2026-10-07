// Marketplace — the AFSV VRC concept collection (Martin's direction, Oct 2026):
// understated and premium, warm neutral backgrounds, small discreet crests,
// Executive (gold crest) and Everyday & Sport (colour crest) lines.
// Concept stage: no prices, sizes, checkout or stock claims.
import { html, raw, btn, breadcrumb, ctaBand, previewForm, arrow, splitWords } from './lib.mjs';

const M = (f) => `assets/img/merch/${f}`;
const OM = (f) => `assets/img/merch/on-model/${f}`; // the same piece worn by a model (shown on hover)
const OMV = (f) => `assets/video/on-model/${f.replace(/\.jpg$/, '')}`; // its 3s clip (extension picked in flow.js)
const LOOKS = [
  ['executive-leather-jacket', 'executive-leather-jacket-black.jpg', 'Executive Leather Jacket'],
  ['hoodie', 'regular-hoodie-navy.jpg', 'Hoodie · Navy'],
  ['parka', 'regular-parka-navy.jpg', 'Parka'],
  ['executive-polo', 'executive-polo-black.jpg', 'Executive Polo · Black'],
  ['athletic-shorts', 'regular-shorts-navy.jpg', 'Athletic Shorts'],
  ['executive-scarf', 'executive-scarf-black.jpg', 'Executive Scarf'],
  ['tee', 'regular-tee-navy.jpg', 'Tee · Navy'],
  ['backpack', 'regular-backpack-navy.jpg', 'Backpack'],
  ['executive-beanie', 'executive-beanie-black.jpg', 'Executive Beanie'],
  ['polo', 'regular-polo-white.jpg', 'Polo · White'],
];
const PREVIEW = 'Development preview — this form is not connected yet.';
const CONCEPT = 'Concept — pending approval';
const CONCEPT_NOTE = 'Concept visualisations for executive review. Final crest artwork, colours, sizing, pricing and product details are subject to approval.';

const collectionOf = (m, id) => m.collections.find((c) => c.id === id);
const productsIn = (m, id) => m.products.filter((p) => p.collection === id);
const lineOf = (m, p) => collectionOf(m, p.collection).line;

// Product card: studio image (second colour fades in on hover), name, colour dots.
export function merchCard(m, p, tag = 'h3') {
  const c = collectionOf(m, p.collection);
  const [a, b] = p.colours;
  return html`
<a class="merch-card merch-card--${c.line}" href="product-${p.slug}.html" data-collection="${p.collection}">
  <span class="merch-card__media">
    <img src="${M(a.img)}" alt="${p.name} in ${a.name.toLowerCase()} — concept image" width="960" height="1200" loading="lazy">
    <img class="merch-card__alt" src="${OM(a.img)}" alt="" width="960" height="1200" loading="lazy">
    <video class="merch-card__vid" muted loop playsinline preload="none" poster="${OM(a.img)}" data-vbase="${OMV(a.img)}" aria-hidden="true"></video>
    <span class="merch-card__hint" aria-hidden="true">On model</span>
    <span class="merch-card__tag">Concept</span>
  </span>
  <span class="merch-card__body">
    <span class="merch-card__line">${c.line === 'executive' ? 'Executive · Gold crest' : 'Everyday & Sport · Colour crest'}</span>
    ${raw(`<${tag} class="merch-card__name">`)}${p.name}${raw(`</${tag}>`)}
    <span class="merch-card__swatches" aria-label="Colours: ${p.colours.map((x) => x.name).join(', ')}">${p.colours.map((x) => html`<span class="swatch" style="--sw:${x.hex}" title="${x.name}"></span>`)}<span class="merch-card__count">${p.colours.length > 1 ? `${p.colours.length} colours` : p.colours[0].name}</span></span>
  </span>
</a>`;
}

function launchForm() {
  return html`
<section class="wrap section" id="buyer-form" data-el="marketplace.buyer-form" data-el-build="plugin">
  <div class="split split--form">
    <div class="form-intro reveal">
      <p class="eyebrow mb-s">Launch list</p>
      <h2 class="h2">Be first to the collection.</h2>
      <p class="body-lg">Tell us which pieces interest you. We will be in touch when the range is approved and the marketplace opens.</p>
      <p class="small muted">${CONCEPT_NOTE}</p>
    </div>
    ${previewForm({
      fields: [
        { label: 'Name', req: true, auto: 'name' },
        { label: 'Email', type: 'email', req: true, auto: 'email' },
        { label: 'Country', req: true, auto: 'country-name' },
        { label: 'Collection of interest', type: 'select', id: 'interest-collection', ph: 'Select a collection', options: ['Executive Apparel', 'Executive Accessories', 'Everyday & Sport Apparel', 'Everyday & Sport Accessories', 'All of the collection'] },
        { label: 'Pieces you are interested in', type: 'textarea', rows: 2, full: true },
      ],
      consent: 'I agree to receive marketplace launch updates from AFSV VRC.',
      submit: 'Join the Launch List',
      status: `${PREVIEW} Launch-list submissions will route once commerce approvals are complete.`,
    })}
  </div>
</section>`;
}

function vendorForm() {
  return html`
<section class="wrap section section--flush-top" id="vendor-form" data-el="marketplace.vendor-form" data-el-build="plugin">
  <div class="panel panel--dark">
    <span class="pill mb-m">Interest only — not approval</span>
    <h2 class="h2 h2--sm mb-s">Become a marketplace vendor</h2>
    <p class="body-lg mb-l measure">Qualified brands, creators, service providers and community businesses can register interest. Final onboarding depends on commercial, brand, quality, insurance, payment, tax, fulfilment and policy approval. Submitting this form does not create a vendor account.</p>
    ${previewForm({
      fields: [
        { label: 'Legal or brand name', req: true, auto: 'organization' },
        { label: 'Contact name', req: true, auto: 'name' },
        { label: 'Email', type: 'email', req: true, auto: 'email' },
        { label: 'Phone', type: 'tel', auto: 'tel' },
        { label: 'Website', type: 'url', ph: 'https://', auto: 'url' },
        { label: 'Category', type: 'select', req: true, ph: 'Select a category', options: ['Apparel and fanwear', 'Training and performance', 'Education and life-skills resources', 'Partner and sponsor offers', 'Community and vendor products'] },
        { label: 'Regions served' },
        { label: 'Insurance status', type: 'select', ph: 'Select a status', options: ['Current cover in place', 'Application in progress', 'Not yet arranged'] },
        { label: 'Product or service description', type: 'textarea', req: true, rows: 3, full: true },
        { label: 'Fulfilment capability', type: 'textarea', rows: 2, full: true },
        { label: 'Comments', type: 'textarea', rows: 2, full: true },
      ],
      consent: 'I agree to be contacted about marketplace vendor opportunities and understand this submission is not an approval.',
      submit: 'Register vendor interest',
      status: `${PREVIEW} Vendor submissions will route to a manual review queue; no vendor account is created automatically.`,
    })}
  </div>
</section>`;
}

// ════════════════════════ MARKETPLACE OVERVIEW ════════════════════════
export function marketplace(d, m) {
  const exec = m.products.filter((p) => lineOf(m, p) === 'executive');
  const everyday = m.products.filter((p) => lineOf(m, p) === 'everyday');
  return {
    title: 'Marketplace',
    description: 'Wear the Movement. Build the Future. A first look at the AFSV VRC collection: Executive and Everyday & Sport apparel and accessories, in concept for executive review.',
    ogImage: M('executive-aviator-jacket-black.jpg'),
    body: html`
${breadcrumb([{ label: 'Marketplace' }])}
<section class="mk-hero" data-el="marketplace.hero" data-el-build="elementor">
  <div class="wrap mk-hero__grid">
    <div class="mk-hero__copy">
      <p class="eyebrow eyebrow-rule">The AFSV VRC Collection</p>
      <h1 class="mk-hero__title split-words" aria-label="Wear the Movement. Build the Future."><span aria-hidden="true">${splitWords(['Wear the Movement.', 'Build the Future.'])}</span></h1>
      <p class="lead">Understated pieces carrying a small, discreet crest — gold for the Executive line, colour for Everyday & Sport. Purchases are intended to strengthen the wider AFSV VRC ecosystem.</p>
      <div class="btn-row btn-row--stack">
        ${btn('Explore the collection', '#collections', 'navy')}
        ${btn('Join the Launch List', '#buyer-form', 'line-dark')}
      </div>
      <p class="mk-hero__note"><span class="pill">${CONCEPT}</span> Not yet on sale.</p>
    </div>
    <div class="mk-collage" aria-hidden="true">
      <figure class="mk-collage__film">
        <video autoplay muted loop playsinline preload="metadata" poster="assets/img/merch/campaign-poster.jpg">
          <source src="assets/video/marketplace-models.webm" type="video/webm">
          <source src="assets/video/marketplace-models.mp4" type="video/mp4">
        </video>
        <figcaption><span class="mk-collage__dot"></span> Campaign film · concept</figcaption>
      </figure>
      <figure class="mk-collage__t mk-collage__t--a"><img src="${OM('regular-tee-white.jpg')}" alt="" width="960" height="1200" fetchpriority="high"></figure>
      <figure class="mk-collage__t mk-collage__t--b"><img src="${OM('regular-cap-white.jpg')}" alt="" width="960" height="1200"></figure>
      <figure class="mk-collage__t mk-collage__t--c"><img src="${OM('executive-polo-white.jpg')}" alt="" width="960" height="1200"></figure>
      <figure class="mk-collage__t mk-collage__t--d"><img src="${OM('regular-varsity-jacket-navy.jpg')}" alt="" width="960" height="1200"></figure>
    </div>
  </div>
</section>

<section class="wrap section" id="collections" data-el="marketplace.collections" data-el-build="elementor">
  <div class="section-head reveal">
    <h2 class="h2">Four collections.</h2>
    <p class="body-lg muted">Two lines, each with apparel and accessories. Choose a collection to see every piece.</p>
  </div>
  <div class="mk-collections" data-stagger>
    ${m.collections.map((c) => html`
    <a class="mk-collection mk-collection--${c.line}" href="shop.html#${c.id}">
      <span class="mk-collection__img"><img src="${M(c.cover)}" alt="" width="960" height="1200" loading="lazy"></span>
      <span class="mk-collection__body">
        <span class="mk-collection__k">${c.line === 'executive' ? 'Gold crest' : 'Colour crest'} · ${productsIn(m, c.id).length} pieces</span>
        <span class="mk-collection__name">${c.name}</span>
        <span class="mk-collection__blurb">${c.blurb}</span>
        <span class="mk-collection__go">View collection ${arrow()}</span>
      </span>
    </a>`)}
  </div>
</section>

<section class="mk-look" data-el="marketplace.lookbook" data-el-build="elementor" aria-labelledby="look-h">
  <div class="wrap section">
    <div class="section-head reveal">
      <h2 class="h2" id="look-h">Worn across the village.</h2>
      <p class="body-lg muted">From the boardroom to the track and the snow outside the dome. Tap a look to see the piece.</p>
    </div>
  </div>
  <div class="mk-look__rail" data-stagger>
    ${LOOKS.map(([slug, img, label], i) => html`<a class="mk-look__item mk-look__item--${i % 3}" href="product-${slug}.html"><img src="${OM(img)}" alt="${label} worn by a model — concept image" width="960" height="1200" loading="lazy"><span>${label}</span></a>`)}
  </div>
</section>

<section class="mk-exec" data-el="marketplace.executive" data-el-build="elementor" aria-labelledby="exec-h">
  <div class="wrap section">
    <div class="mk-exec__head reveal">
      <p class="eyebrow">The Executive line</p>
      <h2 class="mk-exec__title" id="exec-h" data-sweep>Quiet gold.<br>Built to be worn well.</h2>
      <p class="body-lg">Black and white pieces with a small gold crest and gold-tipped details — designed for leadership, partners and occasions.</p>
      <a class="text-link text-link--light" href="shop.html#executive-apparel">See all Executive pieces ${arrow()}</a>
    </div>
    <div class="mk-rail" data-stagger>${exec.map((p) => merchCard(m, p))}</div>
  </div>
</section>

<section class="mk-everyday" data-el="marketplace.everyday" data-el-build="elementor" aria-labelledby="everyday-h">
  <div class="wrap section">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow mb-s">The Everyday &amp; Sport line</p>
        <h2 class="h2" id="everyday-h">Made for training days and match days.</h2>
      </div>
      <p class="body-lg muted">Navy and white essentials with the designer's colour crest, from tees and polos to winter layers, caps and bags.</p>
    </div>
    <div class="merch-grid" data-stagger>${everyday.map((p) => merchCard(m, p))}</div>
    <p class="mt-l"><a class="text-link" href="shop.html">Browse the full collection — ${m.products.length} pieces ${arrow()}</a></p>
  </div>
</section>

<section class="wrap section" data-el="marketplace.details" data-el-build="elementor">
  <div class="mk-details" data-stagger>
    <div><span class="num">01</span><h3>A smaller, discreet crest</h3><p>No wording beneath the mark. The crest sits quietly on the chest, cuff or front panel.</p></div>
    <div><span class="num">02</span><h3>Gold or colour</h3><p>Gold crests identify the Executive line; the designer's colour crest marks Everyday &amp; Sport.</p></div>
    <div><span class="num">03</span><h3>Part of the ecosystem</h3><p>Marketplace purchases are intended to support athlete development, education and inclusion programs.</p></div>
  </div>
</section>

<section class="wrap section" data-el="marketplace.proposed-collections" data-el-build="elementor">
  <div class="section-head reveal"><p class="eyebrow mb-s">Proposed collections</p><h2 class="h2">What's coming to the marketplace.</h2><p class="body-lg muted">The official e-commerce platform for AFSVHCL and AFSV VRC Development Group Ltd. Every purchase is intended to support neurodivergent inclusion programs.</p></div>
  <div class="pcols" data-stagger>
    ${[
      ['executive-aviator-jacket-black.jpg', 'AFSVHCL Executive Collection™', 'Premium branded apparel and accessories for corporate partners and leadership.'],
      ['executive-polo-black.jpg', 'AFSVHCL Founder Series™', 'Exclusive limited-edition merchandise for founding members and early supporters.'],
      ['regular-varsity-jacket-navy.jpg', 'AFSVHCL Legacy Collection™', 'Heritage-inspired apparel celebrating the AFSVHCL™ mission and community.'],
      ['regular-tee-navy.jpg', 'Athlete Performance Gear', 'Proposed branded training kits, apparel and equipment for AFSVHCL™ athletes.'],
      ['regular-cap-navy.jpg', 'FanZone™ Member Merchandise', 'Exclusive merchandise available to FanZone™ community members.'],
      ['regular-hoodie-navy.jpg', 'Diaspora Heritage Collection', 'Branded hoodies and apparel featuring cultural heritage flags for diaspora members.'],
    ].map(([img, t, b]) => html`<article class="pcol"><figure><img src="${M(img)}" alt="" width="960" height="1200" loading="lazy"></figure><div><h3>${t}</h3><p>${b}</p></div></article>`)}
  </div>
</section>
<section class="wrap section section--flush-top" data-el="marketplace.member-pricing" data-el-build="elementor">
  <div class="mprice reveal">
    <div><p class="eyebrow mb-s">Member exclusive pricing</p><h2 class="h2">Unlock 10–15% off every purchase.</h2><p class="lead">Proposed AFSVHCL Community Membership ($250 USD / $350 CAD per year) unlocks member pricing, early access to drops and member-only sales.</p></div>
    <div class="btn-row">${btn('See membership', '/membership#tiers', 'gold')}</div>
  </div>
</section>

<section class="band--cream" data-el="marketplace.categories" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal"><h2 class="h2">Launch categories.</h2><p class="body-lg muted">Beyond the AFSV VRC collection, the marketplace is planned to bring together partner and community offers.</p></div>
    <div class="hairline" style="--min:220px" data-stagger>
      ${d.marketCategories.map((c) => html`<div class="cell" style="min-height:160px"><div class="cell__top"><span class="num">${c.num}</span><span class="pill pill--soft">Coming soon</span></div><h3 class="h3" style="font-size:19px">${c.title}</h3></div>`)}
    </div>
  </div>
</section>

${launchForm()}
${vendorForm()}
${ctaBand('Represent the movement.', [{ label: 'Join the Launch List', route: '#buyer-form' }, { label: 'Partner with us', route: '/partners' }], 'marketplace.cta')}`,
  };
}

// ════════════════════════ THE COLLECTION (catalogue) ════════════════════════
export function shop(d, m) {
  return {
    title: 'The Collection',
    description: 'Every piece in the AFSV VRC concept collection: Executive and Everyday & Sport apparel and accessories.',
    ogImage: M('regular-varsity-jacket-navy.jpg'),
    body: html`
${breadcrumb([{ label: 'Marketplace', route: '/marketplace' }, { label: 'The Collection' }])}
<section class="wrap page-head" data-el="shop.header" data-el-build="elementor">
  <p class="eyebrow">The AFSV VRC Collection</p>
  <h1 class="h1 split-words" aria-label="The Collection."><span aria-hidden="true">${splitWords('The Collection.')}</span></h1>
  <p class="lead measure">${m.products.length} pieces across four collections. ${CONCEPT_NOTE}</p>
</section>
<section class="wrap section section--flush-top" data-el="shop.grid" data-el-build="plugin" data-merch>
  <div class="mk-filter" role="group" aria-label="Filter by collection">
    <button type="button" class="mk-chip" data-filter="all" aria-pressed="true">All <span>${m.products.length}</span></button>
    ${m.collections.map((c) => html`<button type="button" class="mk-chip" data-filter="${c.id}" aria-pressed="false">${c.name} <span>${productsIn(m, c.id).length}</span></button>`)}
  </div>
  <p class="sr-only" aria-live="polite" data-merch-status></p>
  <div class="merch-grid">${m.products.map((p) => merchCard(m, p, 'h2'))}</div>
</section>
${launchForm()}`,
  };
}

// ════════════════════════ PRODUCT ════════════════════════
export function merchProduct(d, m, p) {
  const c = collectionOf(m, p.collection);
  const related = productsIn(m, p.collection).filter((x) => x.slug !== p.slug).concat(m.products.filter((x) => x.collection !== p.collection && lineOf(m, x) === c.line)).slice(0, 4);
  const first = p.colours[0];
  return {
    title: p.name,
    description: `${p.name} — ${p.desc} Concept piece from the AFSV VRC ${c.name} collection.`,
    ogImage: M(first.img),
    body: html`
${breadcrumb([{ label: 'Marketplace', route: '/marketplace' }, { label: 'The Collection', route: '/shop' }, { label: p.name }])}
<section class="wrap section section--flush-top mk-product" data-el="product.main" data-el-build="plugin" data-merch-product>
  <div class="mk-product__gallery">
    <figure class="mk-product__stage"><img src="${M(first.img)}" alt="${p.name} in ${first.name.toLowerCase()} — concept image" width="960" height="1200" fetchpriority="high" data-stage><img class="mk-product__model" src="${OM(first.img)}" alt="" width="960" height="1200" data-model-stage><video class="mk-product__model mk-product__vid" muted loop playsinline preload="none" poster="${OM(first.img)}" data-vbase="${OMV(first.img)}" data-model-video aria-hidden="true"></video><span class="merch-card__hint" aria-hidden="true">Hover to see it worn</span></figure>
    ${p.colours.length > 1 ? html`<div class="mk-product__thumbs" aria-hidden="true">${p.colours.map((x, i) => html`<span class="${i === 0 ? 'is-on' : ''}" data-thumb="${i}"><img src="${M(x.img)}" alt="" width="960" height="1200" loading="lazy"></span>`)}</div>` : ''}
  </div>
  <div class="mk-product__info">
    <p class="eyebrow">${c.name}</p>
    <h1 class="mk-product__name">${p.name}</h1>
    <p class="mk-product__status"><span class="pill pill--gold">${CONCEPT}</span></p>
    <p class="lead">${p.desc}</p>
    <fieldset class="mk-colours">
      <legend>Colour: <b data-colour-name>${first.name}</b></legend>
      <div class="mk-colours__row">${p.colours.map((x, i) => html`<button type="button" class="mk-colour" style="--sw:${x.hex}" aria-pressed="${i === 0 ? 'true' : 'false'}" data-colour="${i}" data-img="${M(x.img)}" data-model="${OM(x.img)}" data-vbase="${OMV(x.img)}" data-name="${x.name}" data-alt="${p.name} in ${x.name.toLowerCase()} — concept image"><span class="sr-only">${x.name}</span></button>`)}</div>
    </fieldset>
    <dl class="mk-specs">
      <div><dt>Crest</dt><dd>${c.line === 'executive' ? 'Small gold crest' : "Small colour crest (designer's artwork)"}</dd></div>
      <div><dt>Line</dt><dd>${c.line === 'executive' ? 'Executive' : 'Everyday & Sport'}</dd></div>
      <div><dt>Sizes</dt><dd>To be confirmed</dd></div>
      <div><dt>Pricing</dt><dd>To be confirmed</dd></div>
    </dl>
    <div class="btn-row btn-row--stack">
      ${btn('Register interest in this piece', '/marketplace#buyer-form', 'navy')}
      ${btn('Back to the collection', '/shop', 'line-dark')}
    </div>
    <p class="small muted mt-m">${CONCEPT_NOTE} Front and back views, detail shots and a product video will be added for each piece.</p>
  </div>
</section>
<section class="band--cream" data-el="product.related" data-el-build="plugin">
  <div class="wrap section">
    <div class="section-head reveal"><h2 class="h2">More from the ${c.line === 'executive' ? 'Executive' : 'Everyday & Sport'} line.</h2></div>
    <div class="merch-grid">${related.map((x) => merchCard(m, x))}</div>
  </div>
</section>`,
  };
}
