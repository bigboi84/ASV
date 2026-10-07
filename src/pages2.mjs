// New pages carried over from the AFSVHCL (Sintra) site, plus the extra sections added to
// existing pages. Everything here uses the rounded "x-" component set styled in site.css.
import {
  html, raw, href, btn, breadcrumb, ctaBand, splitWords, pad2, arrow, formSection, previewForm,
} from './lib.mjs';
import { sketchIcon, eventFeature } from './pages.mjs';

const IMG = (f) => `assets/img/${f}`;
const PREVIEW = 'Development preview — this form is not connected yet.';
// The EFN platform's own website. Set this once the URL is confirmed; '#efn-connect' until then.
export const EFN_URL = '#efn-connect';

// Extra sketch icons for the new pages (24×24, stroked; drawn by the shared #sketchy filter).
const MORE = {
  Mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.6 11.2a6.4 6.4 0 0 0 12.8 0M12 17.6v3.2M8.8 20.8h6.4"/>',
  Signal: '<circle cx="12" cy="12" r="1.8"/><path d="M8.2 15.8a5.4 5.4 0 0 1 0-7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.4 18.6a9.4 9.4 0 0 1 0-13.2M18.6 5.4a9.4 9.4 0 0 1 0 13.2"/>',
  Chart: '<path d="M3.6 20.4h16.8"/><rect x="5.2" y="12" width="3" height="6.4" rx=".6"/><rect x="10.6" y="7.6" width="3" height="10.8" rx=".6"/><rect x="16" y="4" width="3" height="14.4" rx=".6"/>',
  Shield: '<path d="M12 3.2l7 2.6v5.4c0 4.6-3 8.2-7 9.6-4-1.4-7-5-7-9.6V5.8z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
  Gift: '<rect x="3.6" y="9" width="16.8" height="4" rx="1"/><path d="M5 13v7.4h14V13M12 9v11.4"/><path d="M12 9c-1.4-3.6-5.6-4.4-5.6-1.6S10 9 12 9zM12 9c1.4-3.6 5.6-4.4 5.6-1.6S14 9 12 9z"/>',
  Tag: '<path d="M3.6 12.4V4.4a.8.8 0 0 1 .8-.8h8l8 8-8.8 8.8z"/><circle cx="8.2" cy="8.2" r="1.6"/>',
  Star: '<path d="M12 3.4l2.6 5.4 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  Cert: '<rect x="3.6" y="4" width="16.8" height="12" rx="1.4"/><path d="M7 8h10M7 11h6"/><circle cx="16" cy="16" r="2.6"/><path d="M14.6 18.2l-.8 3 2.2-1 2.2 1-.8-3"/>',
  Building: '<path d="M4 20.4h16"/><rect x="6" y="4" width="12" height="16.4" rx=".8"/><path d="M9 7.6h2M13 7.6h2M9 11h2M13 11h2M9 14.4h2M13 14.4h2M10.6 20.4v-3h2.8v3"/>',
  Megaphone: '<path d="M4 10v4a1 1 0 0 0 1 1h2.4l6.6 4V5L7.4 9H5a1 1 0 0 0-1 1z"/><path d="M17.2 9a4.4 4.4 0 0 1 0 6M7.6 15l1.2 5"/>',
  Phone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.2"/><path d="M10.6 18h2.8"/>',
  Eye: '<path d="M2.4 12s3.6-6.4 9.6-6.4 9.6 6.4 9.6 6.4-3.6 6.4-9.6 6.4S2.4 12 2.4 12z"/><circle cx="12" cy="12" r="2.8"/>',
  Ear: '<path d="M7 9.4a5 5 0 0 1 10 0c0 3-2.6 3.8-3.4 6.2-.6 1.8-1.4 3.6-3.6 3.6a2.6 2.6 0 0 1-2.6-2.6"/><path d="M9.8 9.6a2.2 2.2 0 0 1 4.4 0c0 1.2-1.4 1.6-1.4 2.8"/>',
  Hand: '<path d="M8.4 12.4V5.6a1.4 1.4 0 0 1 2.8 0v5.6M11.2 11V4.4a1.4 1.4 0 0 1 2.8 0V11M14 11.2V5.8a1.4 1.4 0 0 1 2.8 0v7.6c0 4-2.6 7-6.4 7-2.6 0-4-1.4-5.4-3.6l-2-3.2a1.4 1.4 0 0 1 2.4-1.4l1.6 2"/>',
  Scale: '<path d="M12 4v16.4M7.2 20.4h9.6M5 7.2h14"/><path d="M5 7.2L2.6 13a2.6 2.6 0 0 0 4.8 0zM19 7.2L16.6 13a2.6 2.6 0 0 0 4.8 0z"/>',
  Truck: '<path d="M2.8 6.4h11v9.6h-11zM13.8 9.6h3.8l3 3.4v3h-6.8z"/><circle cx="6.8" cy="17.4" r="1.8"/><circle cx="16.8" cy="17.4" r="1.8"/>',
  Refund: '<path d="M4.4 12a7.6 7.6 0 1 0 2.2-5.4M4.4 4v4h4"/><path d="M12 8.2v7.6M14.2 9.8c-.4-.8-1.2-1.2-2.2-1.2-1.2 0-2.2.6-2.2 1.6 0 2.2 4.4 1.2 4.4 3.4 0 1-1 1.6-2.2 1.6-1 0-1.8-.4-2.2-1.2"/>',
  Lock: '<rect x="5" y="10.4" width="14" height="10" rx="1.6"/><path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8M12 14.2v2.6"/>',
  Doc: '<path d="M6.4 2.8h7.8l4.4 4.4v14H6.4z"/><path d="M14.2 2.8v4.4h4.4M9.4 12h6M9.4 15.2h6M9.4 18.4h3.6"/>',
};
export const ico = (name) => (MORE[name] ? raw(`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${MORE[name]}</svg>`) : sketchIcon(name));

// ───────── Shared building blocks ─────────
export function xhero({ kicker, title, lead, img, alt, ctas = [], badge = 'Proposed concept — not an existing facility', dark = false }) {
  return html`
<section class="xhero${dark ? ' xhero--dark' : ''}" data-el="page.hero" data-el-build="elementor">
  <div class="wrap">
    <div class="xhero__frame">
      <img src="${img.startsWith('assets/') ? img : IMG(img)}" alt="${alt}" width="1600" height="900" fetchpriority="high">
      <span class="xhero__shade" aria-hidden="true"></span>
      <div class="xhero__copy">
        <p class="xhero__kick">${kicker}</p>
        <h1 class="xhero__title split-words" aria-label="${title}"><span aria-hidden="true">${splitWords(title)}</span></h1>
      </div>
      ${badge ? html`<span class="xhero__badge">${badge}</span>` : ''}
    </div>
    <div class="xhero__under">
      <p class="lead">${lead}</p>
      ${ctas.length ? html`<div class="btn-row">${ctas.map((c, i) => btn(c.label, c.href || c.route, i === 0 ? 'navy' : 'line-dark'))}</div>` : ''}
    </div>
  </div>
</section>`;
}

const head = (eyebrow, title, lead, cls = '') => html`
  <div class="section-head reveal ${cls}">
    <p class="eyebrow mb-s">${eyebrow}</p>
    <h2 class="h2">${title}</h2>
    ${lead ? html`<p class="body-lg muted">${lead}</p>` : ''}
  </div>`;

// Rounded icon cards. items: [icon, title, body, list?]
const kgrid = (items, { dark = false, cols = 3 } = {}) => html`
  <div class="kgrid kgrid--${cols}${dark ? ' kgrid--dark' : ''}" data-stagger>
    ${items.map(([ic, t, b, list]) => html`<article class="kcard">
      <span class="kcard__ico">${ico(ic)}</span>
      <h3>${t}</h3>
      ${b ? html`<p>${b}</p>` : ''}
      ${list ? html`<ul class="kcard__list">${list.map((l) => html`<li>${l}</li>`)}</ul>` : ''}
    </article>`)}
  </div>`;

// Big numbers; numeric values count up.
const stats = (items, note) => html`
  <div class="xstats" data-stagger>
    ${items.map(([n, unit, label, tag]) => html`<div class="xstat">
      <b>${/^\d+$/.test(n) ? html`<span data-count="${n}">${Number(n).toLocaleString('en-CA')}</span>` : n}${unit ? html`<small>${unit}</small>` : ''}</b>
      <span>${label}</span>
      ${tag ? html`<em class="pill pill--gold">${tag}</em>` : ''}
    </div>`)}
  </div>
  ${note ? html`<p class="xstats__note">${note}</p>` : ''}`;

const flag = (text) => html`<div class="xflag reveal" role="note"><span aria-hidden="true">!</span><p>${text}</p></div>`;

const faq = (items) => html`
  <div class="xfaq">
    ${items.map(([q, a], i) => html`<details class="xfaq__item"${i === 0 ? raw(' open') : ''}><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`)}
  </div>`;

// Long-form legal page: sticky contents + rounded paper card.
function legalDoc({ kicker, title, intro, meta = [], sections, icon: ic = 'Doc', related = [] }) {
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return html`
<section class="xlegal-hero" data-el="legal.hero" data-el-build="elementor">
  <div class="wrap xlegal-hero__inner">
    <span class="xlegal-hero__ico">${ico(ic)}</span>
    <div>
      <p class="eyebrow mb-s">${kicker}</p>
      <h1 class="h1">${title}</h1>
      ${intro ? html`<p class="lead">${intro}</p>` : ''}
      ${meta.length ? html`<ul class="xlegal-hero__meta">${meta.map(([k, v]) => html`<li><span>${k}</span>${v}</li>`)}</ul>` : ''}
    </div>
  </div>
</section>
<section class="wrap section xlegal" data-el="legal.body" data-el-build="elementor">
  ${sections.length > 2 ? html`<nav class="xlegal__toc" aria-label="On this page"><p>On this page</p><ol>${sections.map((s) => html`<li><a href="#${slug(s.h)}">${s.h}</a></li>`)}</ol></nav>` : html`<div></div>`}
  <div class="xlegal__paper">
    ${sections.map((s) => html`<section id="${slug(s.h)}" class="xlegal__sec">
      <h2>${s.h}</h2>
      ${(s.p || []).map((t) => html`<p>${t}</p>`)}
      ${s.sub ? s.sub.map(([h, t]) => html`<h3>${h}</h3><p>${t}</p>`) : ''}
      ${s.list ? html`<ul class="xlegal__list">${s.list.map((l) => html`<li>${l}</li>`)}</ul>` : ''}
      ${s.pills ? html`<ul class="xlegal__pills">${s.pills.map((l) => html`<li>${l}</li>`)}</ul>` : ''}
      ${s.cards ? html`<div class="xlegal__cards">${s.cards.map(([i, h, t]) => html`<div><span>${ico(i)}</span><b>${h}</b><small>${t}</small></div>`)}</div>` : ''}
      ${s.after ? (s.after).map((t) => html`<p>${t}</p>`) : ''}
      ${s.mail ? html`<p class="xlegal__mail"><a href="mailto:${s.mail}">${s.mail}</a><span>Martin Lashley — Chairman &amp; CEO, AFSVHCL™</span></p>` : ''}
    </section>`)}
    ${related.length ? html`<div class="xlegal__related">${related.map(([l, r]) => html`<a href="${href(r)}">${l} ${arrow()}</a>`)}</div>` : ''}
  </div>
</section>`;
}

// ════════════════════════ IMPACT ════════════════════════
const IMPACT6 = [
  ['Mind', 'Neurodivergent Inclusion', 'Assessments, tutoring, employment readiness, assistive technology, family support and scholarships — funded by every membership.'],
  ['Multi-sport development', 'Youth Athlete Development', 'Year-round multi-sport training, sports science and performance development for youth athletes across Canada.'],
  ['Inclusive education', 'Education & Mentorship', 'Academic support, mentorship and life skills integrated with athletic training through MLMSR Mentorship LLC.'],
  ['Globe', 'Global Diaspora Community', "Connecting Canada's multicultural communities worldwide to support youth development and community empowerment."],
  ['Handshake', 'Community Partnerships', 'Public-private partnerships with municipalities, post-secondary institutions, school boards and corporate sponsors.'],
  ['Chart', 'Transparent Reporting', 'Annual Impact Reports measuring and publishing real outcomes — not just aspirations.'],
];
const FUND6 = [
  ['Mind', 'Assessments', 'Diagnostic assessments for neurodivergent youth and families.'],
  ['Inclusive education', 'Tutoring & Education', 'Specialized tutoring and academic support programs.'],
  ['Building', 'Employment Readiness', 'Job training and employment preparation for neurodivergent individuals.'],
  ['Phone', 'Assistive Technology', 'Technology tools and resources to support learning and development.'],
  ['Community', 'Family Support Services', 'Counselling, resources and community support for families.'],
  ['Cert', 'Scholarships', 'Educational scholarships for neurodivergent students and athletes.'],
];
const fundOrbit = () => html`
  <div class="orbit" data-stagger>
    <div class="orbit__core"><span class="eyebrow">Neurodivergent</span><b>Inclusion Fund</b><small>Measured &amp; reported annually</small></div>
    ${FUND6.map(([i, t, b], n) => html`<div class="orbit__tile" style="--n:${n}"><span>${ico(i)}</span><b>${t}</b><small>${b}</small></div>`)}
  </div>`;

export function impact() {
  return {
    title: 'Impact',
    description: 'AFSVHCL™ is committed to measurable, transparent community impact — from neurodivergent inclusion to youth athlete development, education and global diaspora empowerment.',
    ogImage: IMG('life/impact.jpg'),
    body: html`
${breadcrumb([{ label: 'About', route: '/about' }, { label: 'Impact' }])}
${xhero({ kicker: 'Community impact', title: 'Measuring what matters.', img: 'life/impact.jpg', alt: 'Concept rendering: a racially diverse crowd of youth and families cheering as a mentor presents a scholarship certificate to a teen wearing headphones, at golden hour outside the dome.', lead: 'AFSVHCL™ is committed to measurable, transparent community impact — from neurodivergent inclusion to youth athlete development, education and global diaspora empowerment.', badge: 'Development-stage targets — subject to financing & program launch', ctas: [{ label: 'Join the community', href: '/membership' }, { label: 'Partner with us', href: '/partners' }] })}
<section class="wrap section" data-el="impact.pillars" data-el-build="elementor">
  ${head('Impact framework', 'Six pillars of impact.')}
  ${kgrid(IMPACT6)}
</section>
<section class="band--navy fund" data-el="impact.fund" data-el-build="elementor">
  <div class="wrap section">
    <div class="fund__grid">
      <div class="reveal">
        <p class="eyebrow mb-s">Neurodivergent Inclusion Fund</p>
        <h2 class="h2 mb-m">Every membership changes a life.</h2>
        <p class="lead mb-l">AFSVHCL commits a fixed amount from every membership into a dedicated Neurodivergent Inclusion Fund — supporting real families, real youth and real outcomes.</p>
        <div class="coins">
          <div class="coin"><b>$25 <small>USD</small></b><span>per individual membership</span><em>$35 CAD</em></div>
          <div class="coin coin--gold"><b>$100 <small>USD</small></b><span>per business membership</span><em>$140 CAD</em></div>
        </div>
        <p class="fund__fine">Proposed commitments — subject to program launch and partner capacity.</p>
      </div>
      ${fundOrbit()}
    </div>
  </div>
</section>
<section class="wrap section" data-el="impact.targets" data-el-build="elementor">
  ${head('Five-year targets', 'Aspirational, and labelled that way.')}
  ${stats([['10000', '+', 'Neurodivergent youth supported', '5-year target'], ['25000', '+', 'Families supported', '5-year target']], 'Targets are aspirational and subject to financing, program launch, partner capacity and feasibility analysis. Actual results may differ materially.')}
</section>
<section class="band--cream" data-el="impact.reporting" data-el-build="elementor">
  <div class="wrap section">
    ${head('Transparency & accountability', 'Annual impact reporting.', 'AFSVHCL is committed to publishing an Annual Impact Report — measuring and disclosing the real-world outcomes of the Neurodivergent Inclusion Fund, community programs and ecosystem partnerships. Impact is not a marketing claim. It is a commitment.')}
    <ol class="steps3" data-stagger>
      <li><span>01</span>${ico('Chart')}<h3>Measured outcomes</h3><p>Quantified results across inclusion, education and community programs.</p></li>
      <li><span>02</span>${ico('Doc')}<h3>Published annually</h3><p>Transparent reporting shared with members, partners and the community.</p></li>
      <li><span>03</span>${ico('Shield')}<h3>Third-party verified</h3><p>Independent verification of impact claims and fund allocation <em>(proposed)</em>.</p></li>
    </ol>
  </div>
</section>
<section class="wrap section section--flush-top">${flag('AFSVHCL™ is in active development. All impact targets, fund commitments and program outcomes described are aspirational and subject to financing, program launch, partner capacity and feasibility analysis. No programs are currently active.')}</section>
${ctaBand('Be part of the impact.', [{ label: 'Explore membership', route: '/membership' }, { label: 'Contact us', route: '/contact' }])}`,
  };
}

// ════════════════════════ FANZONE ════════════════════════
const REGIONS = [
  ['Africa', 'From West and East Africa to North and Southern Africa — a diverse, dynamic and deeply rooted diaspora.', ['Nigeria', 'Ghana', 'Somalia', 'Ethiopia', 'Egypt', 'South Africa']],
  ['Asia', 'South, East, Southeast and Central Asia — communities that shape Canada’s economy, culture and innovation.', ['India', 'Pakistan', 'China', 'Philippines', 'Vietnam', 'Korea']],
  ['Caribbean', 'A proud Caribbean presence across Canada — culture, sport, entrepreneurship and community leadership.', ['Jamaica', 'Trinidad & Tobago', 'Barbados', 'Guyana', 'Haiti', 'Dominican Republic']],
  ['Europe', 'European communities helped build Canada’s foundation — and remain a major part of our multicultural identity.', ['United Kingdom', 'Ireland', 'Italy', 'Portugal', 'Poland', 'Ukraine']],
  ['Latin America', 'From Mexico to Central and South America — vibrant communities strengthening Canada’s cities and regions.', ['Mexico', 'Brazil', 'Colombia', 'Peru', 'Chile', 'El Salvador']],
  ['Middle East', 'Deep histories and strong family values — contributing across business, healthcare, education and public service.', ['Lebanon', 'Syria', 'Iran', 'Iraq', 'Jordan', 'UAE']],
  ['North America', 'Including Indigenous peoples, Francophone and Anglophone communities, and cross-border Canadian–US ties.', ['First Nations', 'Inuit', 'Métis', 'Canada', 'United States']],
  ['Pacific Islands', 'Pacific Islander communities bring unique cultural heritage, resilience and global connection.', ['Fiji', 'Samoa', 'Tonga', 'Hawaii', 'New Zealand']],
];
export const CITIES = [['🇨🇦', 'Toronto'], ['🇨🇦', 'Vancouver'], ['🇨🇦', 'Montreal'], ['🇨🇦', 'Calgary'], ['🇺🇸', 'New York'], ['🇺🇸', 'Miami'], ['🇺🇸', 'Orlando'], ['🇺🇸', 'Atlanta'], ['🇺🇸', 'Houston'], ['🇬🇧', 'London'], ['🇳🇬', 'Lagos'], ['🇮🇳', 'Mumbai'], ['🇵🇭', 'Manila'], ['🇧🇷', 'São Paulo'], ['🇯🇲', 'Kingston'], ['🇰🇪', 'Nairobi'], ['🇦🇪', 'Dubai'], ['🇬🇭', 'Accra'], ['🇨🇳', 'Beijing'], ['🇰🇷', 'Seoul'], ['🇲🇽', 'Mexico City']];
export const cityMarquee = () => html`
  <div class="cities" aria-label="Global Diaspora Network cities">
    ${[0, 1].map((row) => html`<div class="cities__row${row ? ' cities__row--rev' : ''}"${row ? raw(' aria-hidden="true"') : ''}><div class="cities__track">
      ${[0, 1].map((dup) => html`<ul${dup ? raw(' aria-hidden="true"') : ''}>${(row ? [...CITIES].reverse() : CITIES).map(([f, c]) => html`<li><span aria-hidden="true">${f}</span>${c}</li>`)}</ul>`)}
    </div></div>`)}
  </div>`;

export function fanzone() {
  const perks = [
    ['Tag', 'Member discounts', 'Proposed exclusive discounts on goods and services from businesses within the FanZone™ community.'],
    ['Star', 'Referral rewards', 'Proposed rewards for introducing others to the FanZone™ community — redeemable for merchandise, tickets and renewals.'],
    ['Cert', 'Official membership certificate', 'A formal certificate recognising your commitment to youth sports development and community empowerment.'],
    ['Kit', 'Heritage hoodie', 'A premium AFSVHCL hoodie featuring your diaspora heritage flag — representing your roots and your vision.'],
    ['Gift', 'Exclusive merchandise', 'Access to AFSVHCL merchandise available only to members of the FanZone™ community network.'],
    ['Community', 'Networking & community access', 'Connect with diaspora leaders, athletes, partners and supporters, with priority access to community events and athlete showcases.'],
  ];
  return {
    title: 'FanZone™ & Global Diaspora Network',
    description: 'FanZone™ is the proposed AFSVHCL community membership connecting Canada’s multicultural communities worldwide through youth development, inclusion and community empowerment.',
    ogImage: IMG('life/flags.jpg'),
    body: html`
${breadcrumb([{ label: 'Esports & Digital' }, { label: 'FanZone™' }])}
${xhero({ kicker: 'FanZone™ · Global Diaspora Network', title: 'Your roots. Our community.', img: 'life/flags.jpg', alt: 'Concept rendering: a racially and culturally diverse crowd waving flags from Jamaica, India, Nigeria, the Philippines, Brazil, Canada, Trinidad, Ghana and Mexico alongside navy and gold scarves at a match inside the dome.', lead: 'The proposed AFSVHCL FanZone™ membership connects Canada’s multicultural communities worldwide through shared purpose: youth development, inclusion and community empowerment.', badge: 'Proposed program — not yet available', ctas: [{ label: 'Register your interest', href: '/membership#membership-form' }, { label: 'See membership tiers', href: '/membership#tiers' }] })}
<section class="wrap section" data-el="fanzone.perks" data-el-build="elementor">
  ${head('Proposed member benefits', 'More than a membership — a community economy.', 'Designed to give back, with community discounts and rewards alongside the mission of supporting youth development.')}
  ${kgrid(perks)}
</section>
<section class="band--cream" data-el="fanzone.regions" data-el-build="elementor">
  <div class="wrap section">
    ${head('Canada’s multicultural diversity', 'Every culture. One FanZone™.', 'FanZone™ is designed to welcome all cultures and backgrounds — reflecting the full diversity of Canada and the global communities connected to it.')}
    <div class="regions" data-stagger>
      ${REGIONS.map(([r, b, ex], i) => html`<article class="region" style="--h:${i * 45}">
        <span class="region__n">${pad2(i + 1)}</span>
        <h3>${r}</h3>
        <p>${b}</p>
        <ul>${ex.map((e) => html`<li>${e}</li>`)}</ul>
      </article>`)}
    </div>
  </div>
</section>
<section class="band--navy diaspora" data-el="fanzone.diaspora" data-el-build="elementor">
  <div class="wrap section section--flush-bottom">
    <div class="section-head reveal">
      <p class="eyebrow mb-s">A truly global community</p>
      <h2 class="h2">Connecting the diaspora worldwide.</h2>
      <p class="body-lg">The AFSVHCL Global Diaspora Network welcomes communities from every corner of the world. Canada’s diversity is our greatest strength.</p>
    </div>
  </div>
  ${cityMarquee()}
  <div class="wrap section section--flush-top"><p class="diaspora__open">Open to all cultures and backgrounds — wherever your roots are, you are welcome.</p></div>
</section>
<section class="wrap section" data-el="fanzone.welcome" data-el-build="elementor">
  <div class="welcome-kit">
    <div class="reveal">
      <p class="eyebrow mb-s">Proposed welcome package</p>
      <h2 class="h2 mb-m">Wear your heritage.</h2>
      <ul class="check-list mb-l">${['Premium AFSVHCL branded hoodie with your heritage flag', 'Official membership certificate', 'Exclusive community merchandise', 'Networking opportunities & community initiatives'].map((t) => html`<li>${t}</li>`)}</ul>
      ${btn('Register your interest', '/membership#membership-form', 'navy')}
    </div>
    <figure class="welcome-kit__img reveal"><img src="${IMG('merch/regular-hoodie-navy.jpg')}" alt="Concept mockup of the navy AFSVHCL hoodie with the colour crest." width="960" height="1200" loading="lazy"><figcaption>Concept — subject to change</figcaption></figure>
  </div>
</section>
<section class="wrap section section--flush-top">${flag('The FanZone™ membership and Global Diaspora Network are proposed future programs. Discount structures, rewards and partner business network are in the concept and planning phase. No memberships are currently available for purchase and no funds are being solicited.')}</section>
${ctaBand('Represent your roots.', [{ label: 'Explore membership', route: '/membership' }, { label: 'Become an ambassador', route: '/ambassadors' }])}`,
  };
}

// ════════════════════════ AMBASSADORS ════════════════════════
export function ambassadors() {
  const types = [
    ['Megaphone', 'Brand Ambassadors', 'Represent AFSVHCL™ in your community, at events and across your networks.'],
    ['Phone', 'Social Media Influencers', 'Create content, share stories and amplify the mission across Instagram, TikTok, YouTube, LinkedIn and beyond.'],
    ['Multi-sport development', 'Athlete Ambassadors', 'Current and former athletes who champion youth development and inspire the next generation.'],
    ['Community', 'Community Champions', 'Local leaders, coaches, educators and mentors who connect AFSVHCL™ to grassroots communities across Canada.'],
  ];
  return {
    title: 'Ambassadors & Community Champions',
    description: 'Community leaders, athletes and creators can express interest in supporting the proposed AFSVHCL™ ecosystem.',
    ogImage: IMG('life/ambassadors.jpg'),
    body: html`
${breadcrumb([{ label: 'Membership', route: '/membership' }, { label: 'Ambassadors' }])}
${xhero({ kicker: 'Ambassadors & community champions', title: 'Be the voice of the movement.', img: 'life/ambassadors.jpg', alt: 'Concept rendering: racially diverse athlete ambassadors and a content creator signing autographs and taking selfies with excited kids outside the dome at dusk.', lead: 'AFSVHCL™ is building a proposed national ecosystem — and we’re inviting community leaders, athletes and creators to express interest in supporting the vision.', badge: 'Proposed program — not yet active', ctas: [{ label: 'Register interest', href: '#ambassador-form' }, { label: 'Explore membership', href: '/membership' }] })}
<section class="wrap section" data-el="ambassadors.types" data-el-build="elementor">
  ${head('Who this is for', 'Community-led growth, done responsibly.', 'The ambassador initiative builds awareness and community alignment. Any formal program will launch only after legal review, with clear terms, privacy notices and participation guidelines.')}
  <div class="amb" data-stagger>
    ${types.map(([i, t, b], n) => html`<article class="amb__card"><span class="amb__n">${pad2(n + 1)}</span><span class="kcard__ico">${ico(i)}</span><h3>${t}</h3><p>${b}</p></article>`)}
  </div>
</section>
<section class="band--cream" data-el="ambassadors.support" data-el-build="elementor">
  <div class="wrap section split split--center">
    <figure class="figure figure--4x3 wipe xround"><img src="${IMG('life/plaza.jpg')}" alt="Concept rendering: racially diverse families and teen athletes arriving at the village plaza at dusk." width="1600" height="900" loading="lazy"></figure>
    <div class="reveal">
      <p class="eyebrow mb-s">What ambassadors may support</p>
      <h2 class="h2 mb-m">Spread the word. Lift the community.</h2>
      <ul class="check-list">${['Community awareness and event support', 'Youth development storytelling', 'Content creation and responsible sharing', 'Introductions to aligned partners and sponsors', 'Volunteer participation in community initiatives'].map((t) => html`<li>${t}</li>`)}</ul>
    </div>
  </div>
</section>
<section class="wrap section section--flush-bottom">${flag('This page is for informational purposes only. It does not constitute an offer, solicitation or binding commitment. Any future ambassador program will be subject to legal review, documented terms and appropriate safeguards.')}</section>
${formSection({
  id: 'ambassador-form', el: 'ambassadors.form',
  title: 'Register your interest.',
  lead: 'Tell us how you’d like to support the movement and we’ll be in touch when the program is ready.',
  note: 'Ambassadors under 18 will need a parent or guardian to register on their behalf.',
  form: previewForm({
    fields: [
      { label: 'Name', req: true, auto: 'name' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Ambassador type', type: 'select', req: true, ph: 'Select a type', options: types.map((t) => t[1]) },
      { label: 'City', auto: 'address-level2' },
      { label: 'Social or portfolio link', type: 'url' },
      { label: 'Tell us about yourself', type: 'textarea', full: true },
    ],
    consent: 'I agree to be contacted about the AFSVHCL™ ambassador initiative.',
    submit: 'Register interest',
    status: `${PREVIEW} Submissions will route to the community team once confirmed.`,
  }),
})}`,
  };
}

// ════════════════════════ EFN — ESPORTS & FANS NETWORK ════════════════════════
export function efn() {
  const core = [
    ['Esports', 'Esports tournaments', 'Competitive gaming events for amateur and professional players.'],
    ['Signal', 'Live streaming events', 'Broadcast-quality production for sports and esports content.'],
    ['Mic', 'Athlete media content', 'Podcast studio, interviews and athlete storytelling.'],
    ['Globe', 'Global fan engagement', 'Digital memberships, live stats and interactive experiences.'],
  ];
  const platform = [
    ['Esports', 'Esports Arena', '80–120 gaming stations, tournament stage and streaming control centre integrated into the Smart Sports Village.'],
    ['Signal', 'Live Streaming & Broadcasting', 'Broadcast-quality production for sports competitions, esports tournaments and athlete media content.'],
    ['Mic', 'Sports Village Podcast Network', 'Podcast studio and storytelling platform amplifying athletes, coaches and community leaders.'],
    ['Chart', 'Athlete Data & Analytics', 'A digital athlete management platform tracking performance, development and recruitment data.'],
    ['Phone', 'Fan Membership Platform', 'Digital memberships, live stats, interactive fan experiences and community engagement tools.'],
    ['Star', 'Esports Leagues & Tournaments', 'Competitive events for amateur and professional players across multiple game titles and platforms.'],
  ];
  return {
    title: 'EFN – Esports & Fans Network',
    description: 'EFN – Esports & Fans Network is the proposed digital and esports division of AFSVHCL™, connecting athletes and fans through competitive gaming, live streaming and interactive media.',
    ogImage: IMG('village/efn-arena.jpg'),
    body: html`
${breadcrumb([{ label: 'Esports & Digital' }, { label: 'EFN – Esports & Fans Network' }])}
${xhero({ dark: true, kicker: 'EFN · Esports & Fans Network', title: 'Where sports meets digital.', img: 'village/efn-arena.jpg', alt: 'Concept rendering: a packed esports arena hosting a football video game tournament, with players on stage and giant screens showing soccer gameplay.', lead: 'EFN is the proposed digital and esports division of AFSVHCL™ — connecting athletes and fans through competitive gaming, live streaming and interactive media. Home of FanZone™.', badge: '', ctas: [{ label: 'Get connected', href: EFN_URL }, { label: 'Explore FanZone™', href: '/fanzone' }] })}
<section class="efn efn--page" data-el="efn.core" data-el-build="elementor">
  <div class="wrap section">
    ${head('The network', 'Four ways EFN connects.')}
    <div class="efn-core" data-stagger>
      ${core.map(([i, t, b], n) => html`<article class="efn-core__card"><span class="efn-core__n">${pad2(n + 1)}</span><span class="kcard__ico">${ico(i)}</span><h3>${t}</h3><p>${b}</p></article>`)}
    </div>
  </div>
</section>
<section class="wrap section" data-el="efn.platform" data-el-build="elementor">
  ${head('EFN platform features', 'The digital ecosystem.', 'A world-class esports arena, broadcasting studio and digital media hub — all integrated into the sports village ecosystem.')}
  ${kgrid(platform)}
</section>
<section class="band--cream" data-el="efn.scale" data-el-build="elementor">
  <div class="wrap section">
    ${head('Platform scale', 'The digital opportunity.')}
    ${stats([['80–120', '', 'Gaming stations', ''], ['6', '', 'Social platforms', ''], ['5K–12K', '', 'Annual members per dome', '']])}
  </div>
</section>
<section class="wrap section" id="efn-connect" data-el="efn.connect" data-el-build="elementor">
  <a class="efn-site" href="${EFN_URL}">
    <div>
      <p class="eyebrow mb-s">EFN – Esports &amp; Fans Network</p>
      <h2 class="h2 mb-m">Get connected.</h2>
      <p class="lead">Tournaments, live streams, athlete media and the fan community — all on the EFN platform.</p>
    </div>
    <span class="efn-site__btn">Visit EFN ${arrow()}</span>
  </a>
</section>
${formSection({
  id: 'efn-form', el: 'efn.form',
  title: 'Interested in the EFN platform?',
  lead: 'We welcome conversations with technology partners, esports organizations, media companies and digital sponsors aligned with our vision.',
  form: previewForm({
    fields: [
      { label: 'Name', req: true, auto: 'name' },
      { label: 'Organisation', auto: 'organization' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Interest', type: 'select', req: true, ph: 'Select one', options: ['Technology partner', 'Esports organization', 'Media company', 'Digital sponsor', 'Player or creator', 'Other'] },
      { label: 'Message', type: 'textarea', full: true },
    ],
    consent: 'I agree to be contacted about the EFN platform.',
    submit: 'Get in touch',
    status: `${PREVIEW} Submissions will route to the EFN team once confirmed.`,
  }),
})}`,
  };
}

// ════════════════════════ LEGAL & POLICY PAGES ════════════════════════
const MARKS = ['AFSVHCL™', 'Athletes & Fans Sports Village™', 'AFSV VRC™', 'FanZone™', 'AFSVHCL Marketplace™', 'AFSVHCL Executive Collection™', 'AFSVHCL Founder Series™', 'AFSVHCL Legacy Collection™'];
const LEGAL_MAIL = 'afsvhcl@gmail.com';

export function compliance(d) {
  return {
    title: 'Compliance & Legal',
    description: 'Legal disclosures and compliance information for Athletes & Fans Sports Village Holding Company Limited (AFSVHCL™).',
    body: html`${legalDoc({
      kicker: 'Compliance & Legal', title: 'Legal disclosures & compliance', icon: 'Scale',
      intro: 'AFSVHCL™ is committed to transparency, legal compliance and responsible communication at every stage of our development.',
      sections: [
        { h: 'Development-stage concept notice', p: ['Athletes & Fans Sports Village Holding Company Limited (AFSVHCL™) is a development-stage company. The Smart Sports Village and all related facilities, programs, services and initiatives described on this website are proposed concepts only — they do not currently exist as operational facilities or active programs.', 'All concepts, timelines, projections, partnerships and proposed activities referenced on this website are for informational and exploratory discussion purposes only and remain subject to financing, regulatory approvals, due diligence, feasibility analysis, contractual negotiations, market conditions and execution capacity.', 'No memberships, programs or services are currently available for purchase. No funds are being solicited from the public at this time. No securities are being offered.'] },
        { h: 'No securities offering', p: ['Nothing on this website constitutes an offer to sell, a solicitation of an offer to buy, or a recommendation of any security or investment product. AFSVHCL™ is not currently registered as an issuer of securities in any jurisdiction.', 'Any future capital raise activities will be conducted in full compliance with applicable securities laws, including the Ontario Securities Act and any applicable federal regulations. Prospective investors will be provided with appropriate disclosure documents through proper legal channels.'] },
        { h: 'No membership sales currently active', p: ['Membership programs described on this website — including the Global Diaspora Network — are proposed future programs. No memberships are currently available for purchase. No payments are being accepted. Any pricing referenced is indicative only and subject to change.', 'When membership programs are formally launched, they will be accompanied by appropriate terms and conditions, privacy policies, refund policies and consumer protection disclosures in compliance with applicable law.'] },
        { h: 'Partnership & sponsorship disclosures', p: ['References to potential partnerships, sponsorships, institutional relationships and community collaborations on this website reflect exploratory discussions and aspirational goals only. No formal partnership or sponsorship agreements have been finalized unless explicitly stated otherwise.', 'Expressions of interest do not constitute binding commitments. Formal agreements will be executed through proper legal channels with appropriate documentation.'] },
        { h: 'Forward-looking statements', p: ['This website contains forward-looking statements, including projections, timelines, revenue estimates and expansion plans. These statements are based on current assumptions and expectations and are subject to significant risks, uncertainties and changes in circumstances.', 'Actual results may differ materially from those projected. AFSVHCL™ undertakes no obligation to update forward-looking statements to reflect new information, future events or changed circumstances.'] },
        { h: 'ESG commitment', p: ['AFSVHCL™ is committed to ESG (Environmental, Social and Governance) principles, integrating sustainability, community impact and ethical governance into all operations. Our mission to support youth development, education, inclusion and community empowerment reflects our core commitment to social responsibility and long-term value creation.', 'As we develop the Smart Sports Village ecosystem, we prioritize environmental sustainability, equitable access to programs and opportunities, transparent governance practices and measurable community impact.'] },
        { h: 'Privacy & personal information', p: ['AFSVHCL™ is committed to protecting the privacy of individuals who interact with this website. Any personal information submitted through this website will be handled in accordance with applicable privacy legislation, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy laws.', 'See our Privacy Policy and Terms of Use for details.'] },
        { h: 'Safeguarding', p: ['Programs involving children, youth and vulnerable people will operate under documented safeguarding policies, screened staff and volunteers, and clear reporting routes before any program launches. Please do not share diagnoses, medical records or details about a child through website forms.'] },
        { h: 'Trademark notices', p: ['The following are unregistered trademarks of Athletes & Fans Sports Village Holding Company Limited:'], pills: MARKS, after: ['Unauthorized use of these marks is prohibited. ™ indicates an unregistered trademark claim.'] },
        { h: 'Legal inquiries', p: ['For legal inquiries, compliance questions, or to report concerns about content on this website, please contact us directly:'], mail: LEGAL_MAIL, after: ['© 2026 Athletes & Fans Sports Village Holding Company Limited (AFSVHCL™). All Rights Reserved. Ontario, Canada. This website is for informational purposes only. Nothing herein constitutes legal, financial or investment advice.'] },
      ],
      related: [['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Accessibility', '/accessibility']],
    })}`,
  };
}

const META = [['Last modified', 'June 12, 2026'], ['Website owner', 'AFSV VRC Global Development Group Ltd.'], ['Website', 'www.afsvhcl.com']];

export function privacy() {
  return {
    title: 'Privacy Policy',
    description: 'How AFSV VRC Global Development Group Ltd. collects, uses and protects personal information.',
    body: html`${legalDoc({
      kicker: 'Legal', title: 'Privacy Policy', icon: 'Lock', meta: META,
      sections: [
        { h: 'Overview', p: ['This is a customer- and website-user-facing privacy policy governed by Canadian privacy law as in effect in Ontario. The policy is, accordingly, framed around PIPEDA and provincial legislation but does not specifically address Quebec requirements (e.g., privacy officer designation, mandatory breach reporting, automated decision-making disclosures). Similarly, the policy does not specifically address GDPR or US-laws exposure at this time.'] },
        { h: 'Key business terms', sub: [
          ['Scope of data collection', 'The Company collects a broad range of data, including personal information that can reasonably be used to directly or indirectly identify the individual, such as name, mailing address, e-mail, telephone, and IP address, as well as business-related, technical, and non-personal/aggregated information. Collection may occur through direct interactions, user contributions, automated technologies, and third-party sources.'],
          ['Business contact information carve-out', 'The policy treats business contact information used to communicate with individuals in their business capacity as generally not personal information under PIPEDA and provincial legislation.'],
          ['Use and disclosure', 'Permitted uses include service delivery, billing, marketing, and advertising effectiveness. The Company may use information to market goods and services from itself or third parties, with an opt-out via unsubscribe link or email. Disclosure is permitted to affiliates, advertisers, service providers, in M&A/insolvency transactions, and to comply with legal process.'],
          ['Retention and anonymization', 'The Company reserves the right to anonymize personal information and use such anonymized and de-identified data for any legitimate business purpose without further notice or consent.'],
          ['Cross-border transfers', 'The Company may process, store, and transfer personal information in countries outside Canada where privacy laws may differ, and where local governments, courts, or regulators may access the information. Named destinations include the United States, the European Union, and other jurisdictions where service providers and affiliates operate.'],
          ['Individual rights', 'Individuals have the right to request access to and correct their personal information, with the Company committing to respond within 30 days, as per the current requirements under applicable law. Consent withdrawal and complaint avenues (Privacy Commissioner of Canada; Ontario IPC) are provided.'],
          ['Children', 'The Website is not intended for children under 16, the Company commits not to knowingly collect their information, and will delete information collected from a child under 16 without verified parental consent.'],
          ['Security', 'The Company disclaims responsibility for unauthorized third-party circumvention of privacy/security measures, provided it has implemented and maintained reasonable safeguards, and notes transmission of information is at the user’s own risk.'],
        ] },
        { h: 'Privacy inquiries & access requests', p: ['To exercise your rights under this Privacy Policy, including requests to access, correct, or delete your personal information, or to withdraw consent, please contact us:'], mail: LEGAL_MAIL, after: ['We will respond to all access requests within 30 days as required under applicable law. You may also file a complaint with the Office of the Privacy Commissioner of Canada or the Ontario Information and Privacy Commissioner (IPC).', 'This Privacy Policy was last modified on June 12, 2026.'] },
      ],
      related: [['Terms of Use', '/terms'], ['Compliance & Legal', '/compliance']],
    })}`,
  };
}

export function terms() {
  return {
    title: 'Terms of Use',
    description: 'The terms governing access to and use of the AFSVHCL™ website.',
    body: html`${legalDoc({
      kicker: 'Legal', title: 'Website Terms of Use', icon: 'Doc', meta: META,
      sections: [
        { h: 'Overview', p: ['These terms constitute a legal agreement entered into between the user and AFSV VRC Global Development Group Ltd., governing access to and use of the website, including any content, functionality, and services offered on or through it. Acceptance is by use, and the Privacy Policy is incorporated by reference.'] },
        { h: 'Key terms', sub: [
          ['Amendments', 'The Company may revise these Terms at its sole discretion, with all changes taking effect immediately upon posting and applying to continued use; users are expected to check periodically, and continued use constitutes acceptance.'],
          ['Account termination', 'The Company reserves the right at any time to disable or terminate any account, username, or password in its sole discretion for any or no reason.'],
          ['Intellectual property and limited use licence', 'Use is restricted to personal and non-commercial purposes, with broad prohibitions on reproducing, distributing, modifying, or transmitting site material except as narrowly carved out.'],
          ['User submissions', 'By providing any User Submission, the user grants a worldwide, royalty-free, perpetual, irrevocable, non-exclusive license to use, reproduce, modify, distribute, and disclose the material for any purpose without compensation, and waives moral rights under the Copyright Act (Canada).'],
          ['Disclaimer of warranties', 'The website and all content/services are provided on an "as is" and "as available" basis without warranties of any kind, subject to warranties that cannot be excluded under applicable law.'],
          ['Limitation of liability', 'The Company’s total aggregate liability for all claims is capped at the greater of ten Canadian dollars (CAD $10) or the amount paid to the Company in the twelve months preceding the claim, with broad exclusions for indirect, consequential, and punitive damages.'],
          ['Indemnity', 'Users agree to defend, indemnify, and hold harmless the Company and its affiliates from any claims arising out of breach of the Terms or use of the website.'],
          ['Enforcement actions', 'Users waive and hold harmless the Company from all claims resulting from any action taken by the Company, including investigations by the Company or law enforcement.'],
          ['Governing law and forum', 'The Terms are governed by the laws of Ontario and the federal laws of Canada applicable in Ontario, regardless of where the user resides or accesses the site, with conflict-of-law rules excluded. Any action must be brought in the courts of Ontario or the Federal Court of Canada, with exclusive jurisdiction and a waiver of venue objections.'],
          ['Geographic targeting', 'As the owner is based in Ontario, the website is provided primarily for use by persons located in Canada, and is not intended for use in jurisdictions where prohibited; users outside Canada bear their own risk and compliance burden.'],
          ['Privacy', 'The Privacy Policy is incorporated into these Terms of Use and is an integral part of them.'],
        ] },
        { h: 'Contact', p: ['Questions about these Terms can be sent to:'], mail: LEGAL_MAIL, after: ['These Terms of Use were last modified on June 12, 2026.'] },
      ],
      related: [['Privacy Policy', '/privacy'], ['Compliance & Legal', '/compliance']],
    })}`,
  };
}

const shortPolicy = (title, ic, h, body) => ({
  title,
  description: `${title} for AFSVHCL™.`,
  body: html`${legalDoc({ kicker: 'Legal', title, icon: ic, sections: [{ h, p: body }, { h: 'Questions?', p: ['Contact us at:'], mail: LEGAL_MAIL }], related: [['Compliance & Legal', '/compliance'], ['Contact us', '/contact']] })}`,
});
export const refund = () => shortPolicy('Refund Policy', 'Refund', 'No purchases currently active', ['AFSVHCL™ is a development-stage company. No memberships, programs, products or services are currently available for purchase. No payments are being accepted at this time.', 'A formal Refund Policy will be published prior to the launch of any products, memberships or services, in compliance with applicable consumer protection legislation including the Ontario Consumer Protection Act.']);
export const shipping = () => shortPolicy('Shipping Policy', 'Truck', 'No products currently available', ['AFSVHCL™ is a development-stage company. The AFSVHCL™ Marketplace is a proposed future platform. No products are currently available for purchase or shipment.', 'A formal Shipping Policy will be published prior to the launch of the marketplace, in compliance with applicable consumer protection legislation.']);

export function accessibility() {
  return {
    title: 'Accessibility Statement',
    description: 'AFSVHCL™ is committed to ensuring digital accessibility for people of all abilities.',
    body: html`${legalDoc({
      kicker: 'Accessibility', title: 'Accessibility Statement', icon: 'Hand',
      intro: 'AFSVHCL™ is committed to ensuring digital accessibility for people of all abilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.',
      meta: [['Last updated', 'June 7, 2026'], ['Standard', 'WCAG 2.1 Level AA']],
      sections: [
        { h: 'Our commitment', p: ['Athletes & Fans Sports Village Holding Company Limited (AFSVHCL™) believes that the internet should be accessible to all people, including those with disabilities. We are committed to providing a website that is accessible to the widest possible audience, regardless of technology or ability.', 'Inclusion is one of our core values — not just in our sports and education programs, but in every aspect of how we communicate and engage with the public. Our commitment to digital accessibility reflects our broader mission of creating equitable opportunities for all.'] },
        { h: 'Accessibility standards', p: ['We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible to people with a wide range of disabilities, including:'], cards: [['Eye', 'Visual impairments', 'Including blindness, low vision and colour blindness.'], ['Ear', 'Hearing impairments', 'Including deafness and hard of hearing.'], ['Mind', 'Cognitive disabilities', 'Including learning disabilities, attention deficit and memory limitations.'], ['Hand', 'Motor impairments', 'Including limited fine motor control and physical disabilities.']], after: ['We also aim to comply with the Accessibility for Ontarians with Disabilities Act (AODA) and the Accessible Canada Act, as applicable to our digital presence.'] },
        { h: 'Measures we are taking', list: ['Using semantic HTML to ensure proper document structure and navigation.', 'Providing descriptive alt text for all meaningful images.', 'Ensuring sufficient colour contrast between text and background elements.', 'Designing responsive layouts that work across devices and screen sizes.', 'Supporting keyboard navigation for all interactive elements.', 'Using clear, simple language and consistent navigation throughout the site.', 'Avoiding content that flashes or blinks in ways that could trigger seizures.', 'Providing clear form labels and error messages for all input fields.', 'Continuously reviewing and improving accessibility as the website evolves.'] },
        { h: 'Known limitations', p: ['While we strive to ensure that all pages and content on this website are fully accessible, some content may not yet be fully optimized. We are actively working to identify and resolve any accessibility gaps.', 'As AFSVHCL™ is a development-stage company, our website is continuously evolving. We are committed to addressing accessibility issues as they are identified and ensuring that future updates meet or exceed applicable accessibility standards.'] },
        { h: 'Assistive technologies', p: ['This website is designed to be compatible with the following assistive technologies:'], list: ['Screen readers (including JAWS, NVDA and VoiceOver)', 'Screen magnification software', 'Speech recognition software', 'Keyboard-only navigation', 'Browser accessibility extensions and tools'], after: ['We recommend using the latest version of your browser for the best experience.'] },
        { h: 'Third-party content', p: ['Some content on this website may be provided by third parties. While we encourage our partners and vendors to provide accessible content, we cannot guarantee the accessibility of third-party content or external websites linked from this site.'] },
        { h: 'Feedback & accessibility concerns', p: ['We welcome your feedback on the accessibility of the AFSVHCL™ website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:'], mail: LEGAL_MAIL, after: ['We aim to respond to accessibility feedback within 5 business days and to resolve reported issues as quickly as possible.'] },
        { h: 'Assessment & review', p: ['AFSVHCL™ will conduct periodic accessibility reviews of this website, including:'], list: ['Automated accessibility testing using industry-standard tools', 'Manual testing with assistive technologies', 'Review of user feedback and reported issues', 'Updates to this statement as improvements are made'] },
        { h: 'Applicable legislation', list: ['Accessibility for Ontarians with Disabilities Act (AODA), 2005 — Ontario, Canada', 'Accessible Canada Act (ACA), 2019 — Federal, Canada', 'Web Content Accessibility Guidelines (WCAG) 2.1 — W3C International Standard'], after: ['This accessibility statement was last updated on June 7, 2026.'] },
      ],
      related: [['Compliance & Legal', '/compliance'], ['Privacy Policy', '/privacy']],
    })}`,
  };
}

// ════════════════════════ EXTRA SECTIONS FOR EXISTING PAGES ════════════════════════
const AFFILIATE = [
  { name: 'Community Affiliate', price: '$150 CAD', per: 'per athlete / year', body: 'Dome access and basic programming.' },
  { name: 'Performance Affiliate', price: '$250 USD', per: 'per athlete / year', body: 'Full sports science, media and neurodivergent support.', hot: true },
  { name: 'Elite Academy Partner', price: 'Custom', per: 'partnership', body: 'Co-branded programs, recruitment and sponsorship.' },
];
export const affiliateNetwork = () => html`
<section class="band--navy" data-el="page.affiliate" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal">
      <p class="eyebrow mb-s">Affiliate Academy Network</p>
      <h2 class="h2">Partnering with existing clubs &amp; academies.</h2>
      <p class="body-lg">AFSVHCL™ is not a competitor to existing clubs — it is the infrastructure and services layer that makes every club, academy and institution better.</p>
    </div>
    <div class="aff" data-stagger>
      ${AFFILIATE.map((t) => html`<article class="aff__card${t.hot ? ' aff__card--hot' : ''}"><h3>${t.name}</h3><p class="aff__price"><b>${t.price}</b><small>${t.per}</small></p><p>${t.body}</p><span class="pill pill--soft">Proposed</span></article>`)}
    </div>
    <p class="aff__fine">Affiliate fees and tiers are proposed and subject to change. Expressions of interest do not constitute binding commitments.</p>
  </div>
</section>`;

export const EXTRAS = {
  '/gaisb-ai': (d) => html`
<section class="wrap section event-section" data-el="gaisb.event" data-el-build="custom-widget">
  <div class="section-head reveal"><p class="eyebrow mb-s">GAISB event</p><h2 class="h2">GAISB AI World Summit 2027.</h2><p class="body-lg muted">Hosted in Port of Spain by AFSV VRC with the Global AI Standards Body. <a class="text-link" href="events.html">All events ${arrow()}</a></p></div>
  ${eventFeature(d.events[0], 'gaisb.event-card')}
</section>`,
  '/programs': () => html`
<section class="wrap section" data-el="programs.areas" data-el-build="elementor">
  ${head('Proposed program areas', 'A multi-sport development ecosystem.')}
  ${kgrid([
    ['Soccer', 'Soccer Development Academy', 'Year-round technical training, tactical development and competitive programming for youth and elite players.'],
    ['Track and sprint', 'Track & Field Programs', 'Sprint, endurance and field event training with sports science support and performance monitoring.'],
    ['Cricket', 'Cricket Training Centre', 'Indoor cricket training for batting, bowling and fielding — rare in Canadian sports infrastructure.'],
    ['Basketball', 'Basketball Development', 'Skill development, team training and competitive programming for youth and adult players.'],
    ['Esports', 'Esports Performance', 'Competitive gaming training, team development and tournament preparation through the EFN platform.'],
    ['Growth', 'Sports Science & Recovery', 'Biomechanics, physiotherapy, nutrition guidance and recovery integrated into all athlete programs.'],
  ])}
</section>
<section class="wrap section section--flush-top" data-el="programs.kit" data-el-build="elementor">
  <div class="kitband reveal">
    <span class="kitband__ico">${ico('Kit')}</span>
    <div><p class="eyebrow mb-s">AFSVHCL athlete performance kit</p><h2 class="h3">Every athlete, fully kitted.</h2><p class="muted">Featuring AFSVHCL branding, the athlete’s national identity and corporate sponsor integration.</p></div>
    <ul>${['Training jersey', 'Training shorts', 'Tracksuit', 'Running shoes', 'Winter jacket', 'Sports bag'].map((t) => html`<li>${t}</li>`)}</ul>
    <span class="pill pill--gold">Planned</span>
  </div>
</section>
${affiliateNetwork()}`,
  '/education': () => html`
<section class="wrap section" data-el="education.mlmsr" data-el-build="elementor">
  ${head('MLMSR Mentorship LLC', 'Proposed education & support programs.', 'Through MLMSR Mentorship LLC, AFSVHCL™ integrates academic support, mentorship and neurodivergent programming into every aspect of the proposed village.')}
  ${kgrid([
    ['Mind', 'Autism Spectrum Support', 'Structured programs integrating physical activity with social skills development and sensory-friendly environments.'],
    ['Track and sprint', 'ADHD Strategies', 'Focused training environments and mentorship tailored for athletes with ADHD — channelling energy into achievement and growth.'],
    ['Inclusive education', 'Dyslexia & Learning Support', 'Academic support and alternative learning methods for athletes with reading challenges and learning differences.'],
    ['Community', 'Family Support Resources', 'Resources and counselling for families navigating neurodivergent challenges — supporting the whole family.'],
    ['Mentorship', 'Mentorship & Leadership', 'One-on-one and group mentorship connecting youth athletes with community leaders, coaches and role models.'],
    ['Life skills', 'Academic Integration', 'Proposed classroom and tutoring spaces within the dome — academic success alongside athletic development.'],
  ])}
</section>
<section class="band--navy" data-el="education.need" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal"><p class="eyebrow mb-s">The need is real</p><h2 class="h2">Why inclusion matters.</h2></div>
    <div class="need" data-stagger>
      <div><b>1 in 5</b><h3>Children in Canada are neurodivergent</h3><p>Autism, ADHD, dyslexia and other learning differences affect millions of Canadian families.</p></div>
      <div><b>Millions</b><h3>Families across Canada need support</h3><p>Neurodivergent youth and families in every province need accessible, integrated programming.</p></div>
      <div><b>Thousands</b><h3>Youth athletes underserved</h3><p>Young athletes who would benefit from integrated sports and education programming.</p></div>
    </div>
  </div>
</section>`,
};

// About — six pillars, core values, mission statement.
export const aboutExtra = () => html`
<section class="wrap section" data-el="about.six-pillars" data-el-build="elementor">
  ${head('Our ecosystem', 'Six pillars. One vision.', 'AFSVHCL™ is not another sports facility — it is the ecosystem that makes every sports club, academy and institution better.')}
  ${kgrid([
    ['Dome', 'Smart Sports Infrastructure', 'Proposed year-round multi-sport dome facilities designed to remove the seasonal limits that restrict Canadian athletes.'],
    ['Inclusive education', 'Education & Inclusion', 'Integrated academic support, mentorship and neurodivergent programming through MLMSR Mentorship LLC.'],
    ['Esports', 'Esports & Digital Media', 'A digital ecosystem connecting athletes and fans through esports, live streaming and interactive media via EFN.'],
    ['Globe', 'Global Diaspora Network', "Connecting Canada's multicultural communities worldwide to support youth development and community empowerment."],
    ['Handshake', 'Corporate & Institutional Partnerships', 'Public-private partnerships with municipalities, post-secondary institutions, school boards and corporate sponsors.'],
    ['Growth', 'Scalable National Model', 'The pilot is designed as the foundation for a national rollout — replicable across Canada and internationally.'],
  ])}
</section>
<section class="band--navy" data-el="about.values" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal"><p class="eyebrow mb-s">Our core values</p><h2 class="h2">What drives us.</h2></div>
    <div class="values" data-stagger>
      ${[['Athlete First', 'Every decision centres on the athlete’s development, wellbeing and future.'], ['Inclusion', 'Every child, regardless of ability, background or circumstance, deserves access to sport and education.'], ['Innovation', 'We build what doesn’t yet exist — infrastructure, programs and platforms that reimagine what’s possible.'], ['Community Impact', 'We measure success not just in revenue, but in lives changed and communities strengthened.']].map(([t, b], i) => html`<article class="value"><span>${pad2(i + 1)}</span><h3>${t}</h3><p>${b}</p></article>`)}
    </div>
  </div>
</section>
<section class="mission-band" data-el="about.mission-statement" data-el-build="elementor">
  <div class="wrap section">
    <p class="eyebrow mb-m">Our mission</p>
    <p class="mission-band__words" data-sweep>Educate. Empower. Include. Inspire.</p>
    <p class="lead">To establish a national sports ecosystem blending athlete development, education, esports and community impact through smart infrastructure — serving athletes, families and communities across Canada and beyond.</p>
  </div>
</section>`;

// Whitby — overview, roadmap.
const ROADMAP = [
  ['2026–2028', 'Pilot project', 'Secure financing, land and approvals, and construct the first Smart Sports Village dome in Ontario.'],
  ['2028–2029', 'Regional expansion', 'Expand across the region with additional facilities, programs and institutional partnerships.'],
  ['2029–2031', 'National network', 'A planned network of 10 domes across Canada.'],
  ['2031+', 'International', 'Caribbean and international expansion connecting diaspora communities through sport and education.'],
];
export const whitbyOverview = () => html`
<section class="wrap section" data-el="whitby.overview" data-el-build="elementor">
  <div class="overview">
    <div class="reveal">
      <p class="eyebrow mb-s">Project overview</p>
      <h2 class="h2 mb-m">The foundation for a national network.</h2>
      <p class="lead mb-m">The Smart Sports Village is the proposed flagship pilot of AFSVHCL™ — designed as the model for a national network of integrated sports and education campuses across Canada.</p>
      <p class="muted">The proposed dome would integrate elite athletic development, applied learning, neurodivergent support pathways, esports and digital media, and measurable community impact — all under one roof, year-round. It is proposed for a 12–15 acre Smart Sports &amp; Education Campus in partnership with municipal and post-secondary institutions, subject to financing, approvals and feasibility analysis.</p>
    </div>
    ${stats([['150', 'K sq ft', 'Proposed dome', 'Proposed'], ['12–15', ' acres', 'Sports & education campus', 'Proposed'], ['10', '', 'Domes — 5-year vision', 'Planned']])}
  </div>
</section>`;
export const whitbyRoadmap = () => html`
<section class="band--navy roadmap" data-el="whitby.roadmap" data-el-build="elementor" data-roadmap>
  <div class="wrap section">
    <div class="section-head reveal"><p class="eyebrow mb-s">Development roadmap</p><h2 class="h2">From pilot to national network.</h2><p class="body-lg">Timelines are targets, subject to financing, approvals and feasibility.</p></div>
    <ol class="roadmap__line">
      ${ROADMAP.map(([y, t, b], i) => html`<li class="roadmap__step" style="--i:${i}"><span class="roadmap__dot">${i + 1}</span><span class="roadmap__year">${y}</span><h3>${t}</h3><p>${b}</p></li>`)}
    </ol>
  </div>
</section>`;

// Membership — pillars, detailed tiers, premium benefits, fund, diaspora, targets, FAQ.
const TIER_DETAIL = [
  { name: 'Community Membership', usd: '$250', cad: '$350 CAD', for: 'For individuals', groups: [
    ['Community', ['Digital membership card + member badge (in-app)', 'Welcome certificate', 'Access to member community platform', 'Local chapter events (as available)', 'Volunteer and opportunity board']],
    ['Marketplace', ['10–15% member pricing on purchases', 'Early access to new merchandise drops', 'Exclusive limited edition access', 'Member-only flash sales']],
    ['Education & neurodivergent support', ['Family Learning Hub (virtual): resource library, parent webinars', 'Career readiness, financial literacy, entrepreneurship', 'Mental wellness resources', 'Virtual fitness & community challenges', 'Sports development & nutrition content', 'Youth athlete resources']],
    ['Impact & recognition', ['Annual member-facing Impact Report', 'Founding member recognition window (time-limited)']],
    ['Welcome package', ['Premium AFSVHCL branded hoodie', 'Digital membership card', 'Welcome certificate', 'Exclusive member badge in app']],
  ] },
  { name: 'Community Business Membership', usd: '$1,000', cad: '$1,400 CAD', for: 'For businesses, professional firms and community organizations', hot: true, groups: [
    ['Marketplace & distribution', ['Preferred listing in the AFSVHCL Marketplace Directory (web + app)', 'Member exposure across Canada, USA, the Caribbean and the global diaspora']],
    ['Marketing', ['Business profile page', 'Member spotlight features', 'Marketplace promotion opportunities']],
    ['Recruitment & inclusion', ['Access to neurodivergent employment initiatives', 'Internship opportunities', 'Student placement programs', 'Volunteer recruitment channel']],
    ['Impact & recognition', ['Community Impact Certificate', 'Annual recognition listing', 'Inclusion Champion designation', 'Awards program participation']],
    ['First access: sponsorship', ['Event sponsorships', 'Sports programs', 'Esports initiatives', 'Educational programs', 'Neurodivergent support programs']],
  ] },
];
export const membershipExtra = () => html`
<section class="wrap section" data-el="membership.pillars" data-el-build="elementor">
  ${head('The four pillars', 'A membership built on four pillars.', 'Every AFSVHCL membership is designed to deliver value across community, commerce, education and measurable social impact.')}
  ${kgrid([
    ['Community', 'Community', 'Belonging, local chapters, events, volunteer opportunities and a global network committed to youth development and inclusion.'],
    ['Tag', 'Marketplace', 'Member pricing, exclusive drops, partner offers and early access to premium AFSVHCL merchandise and athlete gear.'],
    ['Inclusive education', 'Education & neurodivergent support', 'A virtual learning hub, parent resources, career readiness and wellness content through AFSVHCL, MLMSR and vetted partners.'],
    ['Chart', 'Impact & recognition', 'Annual reporting, recognition designations and measurable outcomes showing the real-world impact of your membership.'],
  ], { cols: 4 })}
</section>
<section class="band--cream" id="tiers" data-el="membership.tiers" data-el-build="elementor">
  <div class="wrap section">
    ${head('Membership tiers', 'Choose your membership.', 'Proposed pricing — no memberships are currently available for purchase and no payments are accepted. Members would choose USD or CAD at checkout.')}
    <div class="tiers2" data-stagger>
      ${TIER_DETAIL.map((t) => html`<article class="tier2${t.hot ? ' tier2--hot' : ''}">
        <div class="tier2__top"><h3>${t.name}</h3><span class="pill pill--soft">Proposed</span></div>
        <p class="tier2__for">${t.for}</p>
        <p class="tier2__price"><b>${t.usd}</b> USD <span>/ ${t.cad} per year</span></p>
        ${t.groups.map(([g, items], i) => html`<details class="tier2__group"${i === 0 ? raw(' open') : ''}><summary>${g}<span aria-hidden="true">+</span></summary><ul class="check-list">${items.map((x) => html`<li>${x}</li>`)}</ul></details>`)}
        <a class="btn btn--${t.hot ? 'gold' : 'navy'}" href="#membership-form">Register interest</a>
      </article>`)}
    </div>
  </div>
</section>
<section class="wrap section" data-el="membership.premium" data-el-build="elementor">
  ${head('Benefits for all members', 'Premium community experiences.')}
  ${kgrid([
    ['Signal', 'Monthly virtual events', '', ['Business development sessions', 'Entrepreneurship workshops', 'Wellness & mental health', 'Education & neurodiversity awareness', 'Sports leadership talks']],
    ['Globe', 'Annual Global Summit', '', ['Reduced registration fees', 'Priority access to sessions', 'VIP networking opportunities', 'Meet community leaders & athletes', 'Exclusive summit merchandise']],
    ['Star', 'Community Rewards Program', 'Earn points for referrals, volunteering, purchases and event participation. Redeem for:', ['Merchandise & gear', 'Event tickets', 'Membership renewals', 'Partner discounts']],
  ])}
</section>
<section class="band--navy fund" data-el="membership.fund" data-el-build="elementor">
  <div class="wrap section">
    <div class="fund__grid">
      <div class="reveal">
        <p class="eyebrow mb-s">Neurodivergent Inclusion Fund</p>
        <h2 class="h2 mb-m">Every membership changes a life.</h2>
        <p class="lead mb-l">A fixed amount from every membership is proposed for a dedicated Neurodivergent Inclusion Fund — measured and reported annually.</p>
        <div class="coins">
          <div class="coin"><b>$25 <small>USD</small></b><span>per individual membership</span><em>$35 CAD</em></div>
          <div class="coin coin--gold"><b>$100 <small>USD</small></b><span>per business membership</span><em>$140 CAD</em></div>
        </div>
        <p class="fund__fine">Fund allocation will be published in the Annual Impact Report. <a href="impact.html">See our impact framework →</a></p>
      </div>
      ${fundOrbit()}
    </div>
  </div>
</section>
<section class="band--navy diaspora diaspora--tight" data-el="membership.diaspora" data-el-build="elementor">
  <div class="wrap"><p class="eyebrow">Global Diaspora Network · open to every culture</p></div>
  ${cityMarquee()}
</section>
<section class="wrap section" data-el="membership.targets" data-el-build="elementor">
  ${head('Five-year community targets', 'Aspirational growth goals.')}
  ${stats([['100000', '', 'Individual members'], ['10000', '', 'Business members'], ['30', '+', 'Countries represented'], ['25000', '+', 'Families supported'], ['10000', '+', 'Neurodivergent youth supported'], ['10000', '+', 'Businesses engaged']], 'Targets are aspirational and subject to partner capacity, funding and program rollout timelines. Actual results may differ materially.')}
</section>
<section class="band--cream" data-el="membership.faq" data-el-build="elementor">
  <div class="wrap section faqwrap">
    <div class="reveal"><p class="eyebrow mb-s">Frequently asked questions</p><h2 class="h2">Membership FAQ.</h2></div>
    ${faq([
      ['Why $250 USD / $350 CAD?', 'The proposed fee is structured to deliver real value — a premium welcome package, year-round community benefits, marketplace discounts, education resources and a direct contribution to the Neurodivergent Inclusion Fund. It is designed to be accessible while funding measurable impact.'],
      ['What happens to the Inclusion Fund?', 'AFSVHCL proposes to commit $25 USD / $35 CAD from every individual membership and $100 USD / $140 CAD from every business membership to a dedicated Neurodivergent Inclusion Fund supporting assessments, tutoring, employment readiness, assistive technology, family support services and scholarships. Allocation would be measured and reported annually.'],
      ['How do I redeem rewards?', 'The proposed Community Rewards Program lets members earn points for referrals, volunteering, purchases and event participation, redeemable for merchandise, event tickets, membership renewals and partner discounts. Full details will be shared at program launch.'],
      ['Can I upgrade from Individual to Business?', 'Yes. When the program launches, individual members will be able to upgrade to a business membership, with the price difference prorated over the remaining membership period.'],
      ['What if I’m outside Canada?', 'Membership is planned to be open to individuals and businesses worldwide. Digital benefits, the learning hub, virtual events and the community platform are accessible globally; physical benefits such as local chapter events and merchandise shipping may vary by location.'],
      ['Which currency should I choose?', 'Whichever works best for you. USD and CAD pricing are planned to be equivalent based on current exchange rates, and you would choose your currency at checkout.'],
    ])}
  </div>
</section>`;

// Partners — pathways, sponsorship opportunities, affiliate network.
export const partnersExtra = () => html`
<section class="wrap section" data-el="partners.pathways" data-el-build="elementor">
  ${head('Who we partner with', 'Partnership pathways.')}
  ${kgrid([
    ['Building', 'Municipal & Government', 'Public-private partnership opportunities with municipalities, school boards and government agencies across Canada.'],
    ['Inclusive education', 'Academic & Institutional', 'Colleges, universities and research institutions interested in sports science, education and community development.'],
    ['Handshake', 'Corporate Sponsors', 'Financial services, sports brands, technology, healthcare and food & beverage brands aligned with youth development.'],
    ['Soccer', 'Sports Clubs & Academies', 'Existing clubs, academies and sports organizations across Canada — through the Affiliate Academy Network.'],
    ['Phone', 'Technology Partners', 'Digital platform, athlete management, esports and sports technology companies interested in co-development.'],
    ['Globe', 'Community Organizations', 'Diaspora groups, cultural organizations and non-profits aligned with youth development and inclusion.'],
  ])}
</section>
<section class="band--cream" data-el="partners.sponsorship" data-el-build="elementor">
  <div class="wrap section">
    ${head('Corporate expressions of interest', 'Support youth development. Explore brand alignment.', 'Sponsorship packages are in development — early interest helps demonstrate ecosystem viability and community confidence.')}
    <div class="spons" data-stagger>
      ${[['Dome', 'Facility naming rights', 'Premium branding on proposed sports infrastructure — subject to development.'], ['Kit', 'Athlete kit branding', 'Your brand on athlete training apparel and gear as programs launch.'], ['Inclusive education', 'Education program support', 'Align ESG goals with proposed neurodivergent education and mentorship programs.'], ['Esports', 'Esports & digital visibility', 'Digital exposure across planned esports tournaments, streaming and fan engagement.'], ['Globe', 'Diaspora network alignment', 'Connect with a growing global diaspora community through shared values.'], ['Star', 'Title association', 'Explore alignment with a national sports development initiative at the ground level.']].map(([i, t, b], n) => html`<article class="spon"><span class="spon__n">${pad2(n + 1)}</span><span class="kcard__ico">${ico(i)}</span><h3>${t}</h3><p>${b}</p></article>`)}
    </div>
    <p class="aff__fine aff__fine--dark">Expressions of interest do not constitute a binding commitment. Formal sponsorship agreements will be finalized through proper legal channels. No funds are being solicited at this stage.</p>
  </div>
</section>
${affiliateNetwork()}`;

// Contact — details, expectations, inquiry types.
export const contactExtra = () => html`
<section class="wrap section" data-el="contact.details" data-el-build="elementor">
  <div class="cdetails" data-stagger>
    <article class="cdetail"><span class="kcard__ico">${ico('Doc')}</span><small>Email</small><a href="mailto:afsvhcl@gmail.com">afsvhcl@gmail.com</a></article>
    <article class="cdetail"><span class="kcard__ico">${ico('Dome')}</span><small>Location</small><b>Whitby, Ontario, Canada</b></article>
    <article class="cdetail"><span class="kcard__ico">${ico('Mentorship')}</span><small>Primary contact</small><b>Martin Lashley</b><span>Chairman &amp; CEO, AFSVHCL™</span></article>
  </div>
</section>
<section class="band--cream" data-el="contact.expect" data-el-build="elementor">
  <div class="wrap section expect">
    <div class="reveal">
      <p class="eyebrow mb-s">What to expect</p>
      <h2 class="h2 mb-m">Conversations, not sales.</h2>
      <ul class="check-list">${['We respond to all inquiries within 2–3 business days', 'Initial conversations are exploratory and non-binding', 'No sales pressure — we’re building relationships', 'All discussions are confidential'].map((t) => html`<li>${t}</li>`)}</ul>
    </div>
    <div class="itypes" data-stagger>
      ${[['Handshake', 'Partnership & sponsorship', 'Corporate partnerships and institutional collaborations.'], ['Building', 'Community & municipal stakeholders', 'Municipalities, school boards and community organizations.'], ['Soccer', 'Athlete & program interest', 'Register interest in proposed athlete programs.'], ['Globe', 'Diaspora network interest', 'The proposed Global Diaspora Network.'], ['Signal', 'Media & press', 'Information requests from media organizations.']].map(([i, t, b]) => html`<div class="itype"><span>${ico(i)}</span><div><b>${t}</b><small>${b}</small></div></div>`)}
    </div>
  </div>
</section>`;

// ════════════════════════ CONTACT ════════════════════════
export function contactPage(d) {
  return {
    title: 'Contact Us',
    description: 'Contact AFSVHCL™ — partners, sponsors, community stakeholders, athletes, families, media and supporters.',
    ogImage: IMG('life/welcome.jpg'),
    body: html`
${breadcrumb([{ label: 'Contact Us' }])}
${xhero({ kicker: 'Contact us', title: 'Let’s build what comes next.', img: 'life/welcome.jpg', alt: 'Concept rendering: a racially diverse welcome team greeting families, a teen athlete and a child in a wheelchair at the curved front desk of the village concourse at dusk.', lead: 'We welcome exploratory conversations with potential partners, sponsors, community stakeholders and supporters of the AFSVHCL™ vision.', badge: 'No memberships, programs or services are currently available for purchase', ctas: [{ label: 'Send a message', href: '#contact-form' }, { label: 'Email us', href: 'mailto:afsvhcl@gmail.com' }] })}
<section class="wrap section" id="contact-form" data-el="contact.form" data-el-build="plugin">
  <div class="cgrid">
    <div class="cgrid__form">
      <p class="eyebrow mb-s">Send us a message</p>
      <h2 class="h2 mb-s">We reply within 2–3 business days.</h2>
      <p class="muted mb-m">All inquiries are exploratory and non-binding.</p>
      ${previewForm({
        fields: [
          { label: 'Name', req: true, auto: 'name' },
          { label: 'Organisation', auto: 'organization' },
          { label: 'Email', type: 'email', req: true, auto: 'email' },
          { label: 'Phone', type: 'tel', auto: 'tel' },
          { label: 'City and country', req: true },
          { label: 'Preferred response method', type: 'select', req: true, ph: 'Select a method', options: ['Email', 'Phone call'] },
          { label: 'Inquiry category', type: 'select', req: true, ph: 'Select a category', full: true, options: d.contactCategories },
          { label: 'Message', type: 'textarea', req: true, rows: 5, full: true, hint: 'Please do not include health records or diagnoses.' },
        ],
        consent: 'I agree to AFSVHCL contacting me about this inquiry.',
        submit: 'Send message',
        statusTitle: 'Thank you for reaching out.',
        status: 'Your inquiry has been received and will be directed to the appropriate team member.',
      })}
    </div>
    <aside class="cgrid__side">
      <div class="cside">
        <p class="eyebrow">Contact information</p>
        <ul class="cside__list">
          <li><span>${ico('Doc')}</span><div><small>Email</small><a href="mailto:afsvhcl@gmail.com">afsvhcl@gmail.com</a></div></li>
          <li><span>${ico('Dome')}</span><div><small>Location</small><b>Whitby, Ontario, Canada</b></div></li>
          <li><span>${ico('Mentorship')}</span><div><small>Primary contact</small><b>Martin Lashley</b><em>Chairman &amp; CEO, AFSVHCL™</em></div></li>
        </ul>
        <p class="eyebrow">What to expect</p>
        <ul class="check-list">${['A reply within 2–3 business days', 'Exploratory, non-binding conversations', 'No sales pressure — we’re building relationships', 'All discussions are confidential'].map((t) => html`<li>${t}</li>`)}</ul>
      </div>
      <div class="cside cside--light">
        <p class="eyebrow">Looking for something specific?</p>
        <ul class="cside__links">
          <li><a href="partners.html#partner-form">Partnership &amp; sponsorship ${arrow()}</a></li>
          <li><a href="membership.html#membership-form">Membership interest ${arrow()}</a></li>
          <li><a href="marketplace.html#vendor-form">Become a marketplace vendor ${arrow()}</a></li>
          <li><a href="service-provider-network.html#interest">Service provider network ${arrow()}</a></li>
          <li><a href="ambassadors.html#ambassador-form">Ambassador program ${arrow()}</a></li>
          <li><a href="accessibility.html">Accessibility feedback ${arrow()}</a></li>
        </ul>
      </div>
    </aside>
  </div>
</section>
<section class="band--cream" data-el="contact.types" data-el-build="elementor">
  <div class="wrap section">
    ${head('Types of inquiries', 'Who we talk to.')}
    <div class="ctypes" data-stagger>
      ${[['Handshake', 'Partnership & sponsorship', 'Exploratory discussions about corporate partnerships and institutional collaborations.'], ['Building', 'Community & municipal stakeholders', 'Conversations with municipalities, school boards and community organizations.'], ['Soccer', 'Athlete & program interest', 'Register your interest in proposed future athlete development programs.'], ['Globe', 'Diaspora network interest', 'Express interest in the proposed Global Diaspora Network.'], ['Signal', 'Media & press', 'Media organizations seeking information about AFSVHCL™.']].map(([i, t, b], n) => html`<article class="ctype"><span class="ctype__n">${pad2(n + 1)}</span><span class="kcard__ico">${ico(i)}</span><h3>${t}</h3><p>${b}</p></article>`)}
    </div>
  </div>
</section>
<section class="wrap section">${flag('AFSVHCL™ is in active development. All concepts, timelines, projections, partnerships and proposed activities referenced on this website are for informational and exploratory discussion purposes only. No securities are being offered. No memberships or programs are currently available for purchase.')}</section>`,
  };
}
