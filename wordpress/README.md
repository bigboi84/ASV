# AFSV VRC on WordPress + Elementor

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
`node wordpress/build-content.mjs` turns `src/data/site.json` into `wordpress/content/*.json`: Elementor page layouts, the header/footer templates, Events and Leaders. `seed-local.php` loads them into a test WordPress (`wp eval-file`); the live site is filled the same way through the WordPress connector. Images use `{{img:file}}` placeholders resolved to the theme's `assets/img/` (or Media Library URLs).
