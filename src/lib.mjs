// Shared helpers, layout and components for the static build.
// Every component returns an HTML string. Content is escaped by default;
// `raw()` marks trusted markup that should pass through untouched.

export const SITE = {
  name: 'AFSV VRC',
  legal: 'AFSV VRC Global Development Group Ltd.',
  tagline: 'Building Athletes. Empowering Minds. Strengthening Communities.',
  url: 'https://afsvvrc.com',
  booking: 'https://book.afsvvrc.com',
};

class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = (s) => new Raw(s);

export function esc(v) {
  if (v instanceof Raw) return v.s;
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Tagged template: interpolations are escaped unless Raw; arrays are joined.
export function html(strings, ...vals) {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < vals.length) {
      const v = vals[i];
      if (Array.isArray(v)) out += v.map((x) => (x instanceof Raw ? x.s : esc(x))).join('');
      else if (v === false || v === null || v === undefined) out += '';
      else out += v instanceof Raw ? v.s : esc(v);
    }
  });
  return raw(out);
}

// Route → file. Design routes are '/about', '/product/slug', '#anchor' or absolute URLs.
export function href(route) {
  if (!route) return 'index.html';
  if (/^(https?:|mailto:|tel:|#)/.test(route)) return route;
  if (route === '/') return 'index.html';
  const [path, hash] = route.split('#');
  const file = path.startsWith('/product/') ? `product-${path.slice(9)}.html` : `${path.replace(/^\//, '')}.html`;
  return hash ? `${file}#${hash}` : file;
}
export const isExternal = (route) => /^https?:/.test(route || '');
export const extAttrs = (route) => (isExternal(route) ? raw(' target="_blank" rel="noopener noreferrer"') : '');

export const slugify = (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
export const money = (n) => '$' + (Math.round(n * 100) / 100).toFixed(2);
export const initials = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

// ───────── Icons (inline SVG, decorative unless labelled) ─────────
const ICONS = {
  arrow: '<path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/>',
  pause: '<path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/>',
};
export const icon = (name, cls = '') =>
  raw(`<svg class="icon ${cls}" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`);
export const arrow = () => raw(`<span class="arrow" aria-hidden="true">${icon('arrow')}</span>`);

// ───────── Buttons ─────────
export function btn(label, route, variant = 'gold', extra = '') {
  const ext = isExternal(route);
  return html`<a class="btn btn--${variant}" href="${href(route)}"${extAttrs(route)}${raw(extra ? ' ' + extra : '')}>${label}${ext ? raw(`<span class="sr-only"> (opens in a new tab)</span>`) : ''}${ext ? icon('external') : arrow()}</a>`;
}

// ───────── Page furniture ─────────
export function breadcrumb(trail) {
  // trail: [{label, route?}] — last item is the current page
  const items = [{ label: 'Home', route: '/' }, ...trail];
  return html`<nav class="breadcrumb wrap" aria-label="Breadcrumb"><ol>${items.map((it, i) => {
    const last = i === items.length - 1;
    const sep = last ? '' : raw('<li aria-hidden="true">/</li>');
    if (last) return html`<li aria-current="page">${it.label}</li>`;
    return html`<li>${it.route ? html`<a href="${href(it.route)}">${it.label}</a>` : it.label}</li>${sep}`;
  })}</ol></nav>`;
}

export function ctaBand(heading, buttons, el = 'cta.band') {
  return html`
<section class="cta-band band--navy" data-el="${el}" data-el-build="elementor">
  <div class="wrap cta-band__inner">
    <h2 class="reveal">${heading}</h2>
    <div class="btn-row btn-row--stack">${buttons.map((b, i) => btn(b.label, b.route, b.variant || (i === 0 ? 'gold' : 'line-light')))}</div>
  </div>
</section>`;
}

export function note(text, el = 'status.mandatory-note') {
  return html`<section class="wrap" data-el="${el}" data-el-build="elementor" style="padding-top:56px"><p class="note" role="note">${text}</p></section>`;
}

export function pendingInputs() {
  return html`
<section class="wrap" data-el="status.pending-inputs" data-el-build="elementor" style="padding-bottom:88px">
  <div class="pending"><span class="eyebrow">Pending inputs</span>
    <p>Page copy follows the approved brief. Still outstanding: final photography, approved logos and partner permissions, mailbox routing, legal policies, operational program data, pricing, dates and a named content owner.</p>
  </div>
</section>`;
}

// Type A hero: text left, media bleeding off the right edge.
export function pageHero({ kicker, h1, lead, ctas = [], img, alt }) {
  return html`
<section class="page-hero" data-el="page.hero" data-el-build="elementor">
  <div class="wrap page-hero__grid">
    <div class="page-hero__text">
      <p class="eyebrow eyebrow-rule">${kicker}</p>
      <h1 class="h1">${h1}</h1>
      <p class="lead">${lead}</p>
      <div class="btn-row btn-row--stack">${ctas.map((c, i) => btn(c.label, c.href || c.route, i === 0 ? 'gold' : 'line-light', c.preselect ? `data-preselect="${c.preselect}"` : ''))}</div>
    </div>
    <div class="page-hero__media">${img ? html`<img src="${img}" alt="${alt || ''}" width="1344" height="752" fetchpriority="high">` : ''}</div>
  </div>
</section>`;
}

// ───────── Forms ─────────
// Field spec: { label, name, type: text|email|tel|url|select|textarea, req, options, ph, full, hint, id, auto }
let fieldSeq = 0;
export function field(f) {
  const id = f.id || `f${++fieldSeq}`;
  const name = f.name || slugify(f.label);
  const req = f.req ? raw(' required aria-required="true"') : '';
  const descIds = [f.hint ? `${id}-hint` : null, `${id}-err`].filter(Boolean).join(' ');
  const common = raw(` id="${id}" name="${esc(name)}"${f.auto ? ` autocomplete="${f.auto}"` : ''} aria-describedby="${descIds}"`);
  let control;
  if (f.type === 'select') {
    control = html`<select${common}${req}><option value="">${f.ph || 'Please select'}</option>${(f.options || []).map((o) => {
      const [v, l] = Array.isArray(o) ? o : [o, o];
      return html`<option value="${v}">${l}</option>`;
    })}</select>`;
  } else if (f.type === 'textarea') {
    control = html`<textarea${common}${req} rows="${f.rows || 4}" placeholder="${f.ph || ''}"></textarea>`;
  } else {
    control = html`<input type="${f.type || 'text'}"${common}${req}${f.ph ? raw(` placeholder="${esc(f.ph)}"`) : ''}>`;
  }
  return html`
<div class="field${f.full ? ' field--full' : ''}">
  <label class="field__label" for="${id}">${f.label}${f.req ? raw('<span class="req" aria-hidden="true">*</span>') : raw(' <span class="opt">(optional)</span>')}</label>
  ${control}
  ${f.hint ? html`<span class="field__hint" id="${id}-hint">${f.hint}</span>` : ''}
  <span class="field__error" id="${id}-err" aria-live="polite"></span>
</div>`;
}

export function previewForm({ fields, consent, consentReq = true, submit, status, statusTitle = 'Thank you.' }) {
  const cid = `f${++fieldSeq}`;
  return html`
<form class="form" data-preview-form>
  <p class="small muted">Fields marked <span aria-hidden="true" style="color:var(--danger)">*</span><span class="sr-only">with an asterisk</span> are required.</p>
  <div class="form__grid">${fields.map(field)}</div>
  ${consent ? html`<label class="check" for="${cid}"><input type="checkbox" id="${cid}" name="consent"${consentReq ? raw(' required aria-describedby="' + cid + '-err"') : ''}><span>${consent}<span class="field__error" id="${cid}-err"></span></span></label>` : ''}
  <div class="form-status" role="status" tabindex="-1" hidden><strong>${statusTitle}</strong>${status}</div>
  <div><button type="submit" class="btn btn--navy">${submit}${arrow()}</button></div>
</form>`;
}

// Normalise the design's compact field format {l,k,t,ph,req,o,span}.
export function fromDesignFields(arr) {
  return arr.map((f) => ({
    label: f.l, req: !!f.req, ph: f.ph,
    type: f.k === 's' ? 'select' : f.k === 'a' ? 'textarea' : (f.t || 'text'),
    options: f.o, full: f.span === '1 / -1',
  }));
}

export function formSection({ id, title, lead, note: n, form, el = 'page.interest-form', cls = '' }) {
  return html`
<section class="wrap section ${cls}" id="${id}" data-el="${el}" data-el-build="plugin">
  <div class="split split--form">
    <div class="form-intro reveal">
      <h2 class="h2">${title}</h2>
      <p class="body-lg">${lead}</p>
      ${n ? html`<p class="small muted">${n}</p>` : ''}
    </div>
    ${form}
  </div>
</section>`;
}

// ───────── Grids ─────────
export function numberedCells(items, { min = 255, el, cls = 'list-cells' } = {}) {
  return html`<div class="hairline ${cls}" style="--min:${min}px" data-stagger ${el ? raw(`data-el="${el}"`) : ''}>${items.map((label, i) => html`<div class="cell"><span class="num">${pad2(i + 1)}</span><span>${label}</span></div>`)}</div>`;
}

export function numberedRows(items) {
  return html`<ul class="rows" data-stagger>${items.map((label, i) => html`<li><span class="num">${pad2(i + 1)}</span><span>${label}</span></li>`)}</ul>`;
}
