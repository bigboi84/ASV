// Builds the WordPress content for the AFSV VRC site from src/data/site.json:
// Elementor page layouts (using the AFSV VRC Core widgets), the header/footer
// templates, Events and Leaders. Output: wordpress/afsv-vrc-core/content/*.json (shipped inside the plugin)
//
//   node wordpress/build-content.mjs
//
// The JSON is what gets written to WordPress (pages' _elementor_data, CPT posts).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as P from '../src/pages.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'wordpress/afsv-vrc-core/content');
const d = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));
const V = JSON.parse(fs.readFileSync(path.join(root, 'src/data/videos.json'), 'utf8'));
fs.mkdirSync(out, { recursive: true });

// Images are uploaded to the Media Library; this placeholder is swapped for the real URL at push time.
const IMG = (f) => ({ url: `{{img:${f}}}` });
const id = () => crypto.randomBytes(4).toString('hex');
const link = (url) => ({ url, is_external: '', nofollow: '' });
const items = (arr) => arr.map((x) => ({ _id: id().slice(0, 7), ...x }));

// One full-width, zero-padding container per AFSV widget.
const W = (widgetType, settings = {}) => ({
  id: id(), elType: 'container', isInner: false,
  settings: {
    content_width: 'full',
    padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: true },
    flex_gap: { unit: 'px', size: 0, column: '0', row: '0' },
  },
  elements: [{ id: id(), elType: 'widget', widgetType, settings, elements: [] }],
});

const pages = [];
const page = (slug, title, overlay, elements, extra = {}) => pages.push({ slug, title, overlay, elements, ...extra });

// ───────── Home ─────────
page('home', 'Home', true, [
  W('afsv-hero', { image: IMG('hero-fieldhouse.jpg'), video: '{{asset:video/hero-loop.mp4}}' }),
  W('afsv-ticker'),
  W('afsv-event-feature', { source: '0' }),
  W('afsv-panels', {
    panels: items(d.pillars.map((p, i) => ({
      num: p.num, title: p.title, desc: p.desc, link: link(p.href),
      image: IMG(['pillars-hall.jpg', 'ai-education-studio.jpg', 'accessible-entrance.jpg', 'about-team.jpg'][i]),
    }))),
  }),
  W('afsv-expand-feature', { image: IMG('whitby-aerial-concept.jpg'), video: V.whitbyAerial }),
  W('afsv-stats'),
  W('afsv-path-cards', {
    cards: items(d.pathways.map((w, i) => ({
      kicker: w.kicker, title: w.title, link: link(w.href),
      desc: ['Athlete pathways, coaching and multi-sport training.', 'Register interest in the five proposed membership pathways.', 'Apparel, training products and community-focused goods.', 'Sponsorship, education, technology and development routes.'][i],
      image: IMG(['news-courtside.jpg', 'membership-community.jpg', 'marketplace-kit.jpg', 'partners-boardroom.jpg'][i]),
    }))),
  }),
  W('afsv-esports'),
  W('afsv-split-feature', { image: IMG('sensory-support-space.jpg'), video: V.sensory }),
  W('afsv-ai-band'),
  W('afsv-interest-form'),
  W('afsv-cta-band'),
], { front: true });

// ───────── All other pages: the design build's sections, one Elementor element each ─────────
// Sections that map to a data-driven AFSV widget use it (Leadership, Events, CTA bands);
// the rest go in Elementor's HTML widget with the exact design markup, so they look
// identical and can be moved, duplicated or edited in Elementor.
P.setVideos(V);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

// Split body HTML into its top-level elements.
function topLevel(html) {
  const out = []; let depth = 0; let start = -1;
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][\w-]*)(?:\s[^>]*?)?(\/?)>/g; let m;
  while ((m = re.exec(html))) {
    if (!m[1]) continue;
    const tag = m[1].toLowerCase(); const closing = m[0][1] === '/'; const selfClose = m[2] === '/' || VOID.has(tag);
    if (closing) { depth--; if (depth === 0) { out.push(html.slice(start, re.lastIndex)); start = -1; } }
    else if (!selfClose) { if (depth === 0) start = m.index; depth++; }
    else if (depth === 0) out.push(m[0]);
  }
  return out.map((x) => x.trim()).filter(Boolean);
}

// Static links → placeholders resolved by WordPress at import time.
function wpLinks(html) {
  return html
    .replace(/(href|src|poster)="assets\/([^"]+)"/g, (_, a, f) => `${a}="{{asset:${f}}}"`)
    .replace(/href="index\.html(#[^"]*)?"/g, (_, h) => `href="{{url:/${h || ''}}}"`)
    .replace(/href="product-([a-z0-9-]+)\.html"/g, (_, s) => `href="{{url:/product/${s}}}"`)
    .replace(/href="([a-z0-9-]+)\.html(\?[^"#]*)?(#[^"]*)?"/g, (_, f, q, h) => `href="{{url:/${f}/${q || ''}${h || ''}}}"`);
}

const attr = (block, name) => (block.match(new RegExp(`${name}="([^"]*)"`)) || [])[1] || '';
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

function toElements(body, slug) {
  const els = []; let leadersDone = false;
  for (const block of topLevel(String(body))) {
    const el = attr(block, 'data-el');
    if (/class="cta-band/.test(block)) {
      const heading = text((block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
      const buttons = [...block.matchAll(/<a class="btn[^"]*" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, label]) => ({
        label: text(label.replace(/<span class="sr-only">[\s\S]*?<\/span>/, '')),
        link: link(href.startsWith('http') ? href : '/' + href.replace(/\.html/, '').replace(/^index$/, '')),
      }));
      els.push(W('afsv-cta-band', { heading, buttons: items(buttons) }));
    } else if (el === 'about.leadership') {
      els.push(W('afsv-leadership', { layout: 'cards' }));
    } else if (el === 'leadership.hero') {
      els.push(W('afsv-leadership', { layout: 'hero', heading: 'The team behind\nthe vision.', text: 'AFSVHCL™ is led by a dedicated team of entrepreneurs, community builders, and visionaries committed to transforming youth sports, education, and community development in Canada and beyond.' }));
    } else if (el === 'leadership.profile') {
      if (!leadersDone) els.push(W('afsv-leadership', { layout: 'profiles' }));
      leadersDone = true;
    } else if (el === 'events.list') {
      els.push(W('afsv-event-feature', { source: 'all', heading: '' }));
    } else {
      // Forms post to the AFSV VRC Core inbox.
      const html = wpLinks(block).replace(/<form class="form" data-preview-form>/g, `<form class="form" data-preview-form data-endpoint="{{form:${slug}}}">`);
      els.push(W('html', { html }));
    }
  }
  return els;
}

const designPages = [
  ['about', 'About Us', P.about(d)], ['leadership', 'Leadership', P.leadership(d)],
  ['strategic-pillars', 'Strategic Pillars', P.pillars(d)], ['whitby-smart-sports-village', 'Whitby Smart Sports Village', P.whitby(d)],
  ['facilities', 'Facilities', P.facilities(d)], ['membership', 'Membership', P.membership(d)],
  ['marketplace', 'Marketplace', P.marketplace(d)], ['vendors', 'Vendors', P.vendors(d)],
  ['contact', 'Contact Us', P.contact(d)], ['partners', 'Partners', P.partners(d)],
  ...Object.keys(d.content).map((r) => [r.slice(1), null, P.contentPage(d, r)]),
  ['events', 'Events', P.events(d)], ['news-impact', 'News, Stories & Impact', P.news(d)],
  ['accessibility-privacy', 'Accessibility, Privacy & Safeguarding', P.access(d)], ['legal', 'Legal & Policy Pages', P.legal(d)],
];
for (const [slug, title, pg] of designPages) page(slug, title || pg.title, !!pg.overlay, toElements(pg.body, slug), { description: pg.description });

// ───────── Header / footer templates ─────────
const templates = [
  { slug: 'afsv-site-header', title: 'AFSV Site Header', elements: [W('afsv-site-header', { logo_dark: IMG('logo.png'), logo_light: IMG('logo-reverse.png') })] },
  { slug: 'afsv-site-footer', title: 'AFSV Site Footer', elements: [W('afsv-site-footer', { logo: IMG('logo-reverse.png') })] },
];

// ───────── Events ─────────
const events = d.events.map((e) => ({
  slug: e.slug, title: e.name, excerpt: e.summary,
  meta: {
    afsv_start: e.start.slice(0, 16), afsv_timezone: e.start.slice(19),
    afsv_date_label: e.dateLabel, afsv_end_label: e.endLabel, afsv_venue: e.venue, afsv_city: e.city,
    afsv_url: e.url, afsv_brand: e.brand || '', afsv_headline: e.headline, afsv_subhead: e.subhead,
    afsv_themes: e.themes.join('\n'), afsv_facts: e.facts.map(([k, v]) => `${k} | ${v}`).join('\n'),
    afsv_cta_primary: e.ctaPrimary, afsv_cta_secondary: e.ctaSecondary, afsv_host: e.host,
  },
}));

// ───────── Leaders ─────────
const leaders = d.leadership.map((p, i) => ({
  slug: p.slug, title: p.name, order: i + 1,
  content: [...(p.story || []), ...(p.bio || [])].join('\n\n'),
  photo: p.img ? p.img.replace('assets/img/', '') : null,
  meta: {
    afsv_role: p.role, afsv_short: p.short || '', afsv_quote: p.quote || '', afsv_quote_by: p.quoteBy || '',
    afsv_focus: (p.focus || []).map((f) => `${f.t} | ${f.d}`).join('\n'), afsv_photo_alt: p.alt || '',
  },
}));

for (const p of pages) fs.writeFileSync(path.join(out, `page-${p.slug}.json`), JSON.stringify(p, null, 1));
for (const t of templates) fs.writeFileSync(path.join(out, `template-${t.slug}.json`), JSON.stringify(t, null, 1));
fs.writeFileSync(path.join(out, 'events.json'), JSON.stringify(events, null, 1));
fs.writeFileSync(path.join(out, 'leaders.json'), JSON.stringify(leaders, null, 1));
console.log(`Wrote ${pages.length} pages, ${templates.length} templates, ${events.length} events, ${leaders.length} leaders → wordpress/afsv-vrc-core/content/`);
