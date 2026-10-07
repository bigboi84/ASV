# AFSV VRC on WordPress + Elementor

## v1.2 (current design)
Build: `node src/build.mjs && node wordpress/build-site.mjs`, then zip `afsv-vrc-theme/` as `afsv-vrc/` and `afsv-vrc-core/`.
- **Pages**: 33 Elementor pages generated from the static build — each design section is an Elementor HTML widget with the exact markup.
- **Chrome**: the theme prints the notice bar, header, floating menu, mobile menu and footer from `afsv-vrc-theme/chrome/` (variants: overlay = Home/About/Leadership, market = Marketplace + WooCommerce, default).
- **Shop**: WooCommerce is The Collection. The theme's `woocommerce/` templates render the shop grid and product pages in the design (on-model hover photo + clip, colour swatches, no price, no Add to cart). Products carry an `afsv_colours` JSON meta; categories are the four collections.
- **Forms**: every form posts to `afsv/v1/forms/<form>`; submissions appear under Form submissions. Form submissions → Settings sets recipients (default and per form), the From name/address and auto-replies (placeholders {name}, {email}, {form}, {site}, {answers}), and can send a test email. `content/forms.json` lists the site's forms.

Update an existing install: Plugins/Themes → Upload → choose the zip → *Replace current with uploaded*, then Tools → AFSV VRC Setup → Build.


Two packages, built from this repo:

| Package | Folder | What it does |
|---|---|---|
| **AFSV VRC theme** (`dist/afsv-vrc-theme.zip`) | `afsv-vrc-theme/` | Child of Hello Elementor. The design system: tokens, self-hosted fonts, header, footer, mobile drawer, motion (`assets/css/site.css`, `assets/js/site.js`, `assets/js/motion.js`). |
| **AFSV VRC Core plugin** (`dist/afsv-vrc-core-plugin.zip`) | `afsv-vrc-core/` | Features: Events and Leadership content types, Elementor-built site header/footer, form inbox, and 20 Elementor widgets in an "AFSV VRC" category. |

Requires WordPress 6.5+, Elementor (free is enough) and the Hello Elementor parent theme.

## Install
1. Appearance → Themes → Add New → Upload → `afsv-vrc-theme.zip` → Install (Hello Elementor must be installed; it is the parent).
2. Plugins → Add New → Upload → `afsv-vrc-core-plugin.zip` → Install → Activate.
3. Activate the **AFSV VRC** theme.

## Build the site
Tools → **AFSV VRC Setup** → *Build the AFSV VRC site*. Creates all 24 pages as Elementor layouts (drafts or published), the header/footer templates, the Events and the Leadership profiles. Safe to re-run: items are matched by slug and updated.

## How it fits together
- **Header / footer**: Elementor templates with the slugs `afsv-site-header` and `afsv-site-footer` (Templates → Saved Templates) replace the theme's default header/footer on every page. Each holds the AFSV Site Header / Site Footer widget. Without them the theme prints the same design itself.
- **Navigation**: assign a menu to "Primary navigation" (Appearance → Menus); until then the design's default navigation is used. Footer columns use "Footer column 1–4"; the Events column lists upcoming Events automatically.
- **Header over the hero**: per page, tick "Float the header over the first section" (AFSV VRC header box) or set the `afsv_header_overlay` meta.
- **Events** (admin menu → Events): start date drives order and the countdown; brand "GAISB" switches the card to the summit's identity.
- **Leadership** (admin menu → Leadership): order with Page attributes → Order; featured image is the portrait (monogram until one is set).
- **Forms**: the AFSV Interest Form widget saves to admin menu → Form submissions and emails the site admin address.

## Widgets
Site Header, Site Footer, Hero (full screen), Page Hero, Ticker, Section Heading, Events, Pillar Panels, Expanding Feature, Stats, Pathway Cards, Esports Band, Split Feature, AI Band, Interest Form, Call-to-Action Band, Leadership, Card Grid, Numbered List, Text Section.

## Content
`node wordpress/build-content.mjs` turns `src/data/site.json` and the design build (`src/pages.mjs`) into `afsv-vrc-core/content/*.json`: Elementor page layouts, the header/footer templates, Events and Leaders. Home uses the AFSV widgets throughout; the other pages use the AFSV widgets for data-driven sections (Leadership, Events, CTA bands) and Elementor HTML widgets carrying the exact design markup for the rest. The importer resolves `{{img:}}`, `{{asset:}}`, `{{url:}}` and `{{form:}}` placeholders to the site's own URLs. `seed-local.php` runs the importer in a test WordPress (`wp eval-file`).
