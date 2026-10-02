// Builds the WordPress content for the AFSV VRC site from src/data/site.json:
// Elementor page layouts (using the AFSV VRC Core widgets), the header/footer
// templates, Events and Leaders. Output: wordpress/content/*.json
//
//   node wordpress/build-content.mjs
//
// The JSON is what gets written to WordPress (pages' _elementor_data, CPT posts).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'wordpress/content');
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
console.log(`Wrote ${pages.length} pages, ${templates.length} templates, ${events.length} events, ${leaders.length} leaders → wordpress/content/`);
