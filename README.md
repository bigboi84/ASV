# AFSV VRC website

The AFSV VRC site, rebuilt from the Claude Design prototype as a standalone static website. It uses plain HTML, one shared stylesheet and a small script, and has no framework or build dependencies. It is the reference build for the later WordPress migration.

## View it

- **Quickest:** open `site/index.html` in a browser. Every link is relative, so it works straight from the folder.
- **Local server** (recommended, and closest to live):
  ```bash
  npm run serve        # http://localhost:8080
  ```

## Edit and rebuild

Edit the source files in `src/`, then regenerate `site/`:

```bash
npm run build        # node src/build.mjs. Needs Node 18+ and nothing else.
```

| Path | What it is |
|---|---|
| `src/data/site.json` | All copy, lists, form fields, products and vendors, extracted from the design file |
| `src/pages.mjs` | One function per page or template |
| `src/layout.mjs` | Shared head, announcement bar, header, mobile drawer, marketplace bar and footer |
| `src/lib.mjs` | Components (buttons, hero, forms, grids) and helpers |
| `src/assets/css/site.css` | The design system: tokens, layout, components |
| `src/assets/js/site.js` | Navigation, drawer, form validation, reveal motion and the commerce preview |
| `site/` | Generated output. Don't hand-edit; rebuild instead. |
| `design/AFSV-VRC-site.html` | The original Claude Design export, kept for reference |

## What changed from the design file

**Fixed**
- **Mobile navigation.** The header used to wrap into four rows of links on phones, and its dropdowns were hover-only. It now has a Menu button that opens an accessible slide-in drawer, with keyboard focus kept inside it, Escape to close, and expandable sections.
- **Invisible footer text.** The contact line and copyright bar were navy text on a navy background. They are now readable, and the bottom bar links to Legal, Accessibility and "Report an issue".
- **Stray `\n` characters** showed between the hero buttons on the News, Accessibility and Legal pages. Removed.
- **Six images missing from the export.** These pages now use the closest matching photo already in the set (see *Open items*):
  - Martin Lashley card: uses his founder portrait
  - GAISB
  - Neurodiversity
  - Business for Inclusion
  - Service Provider Network
  - Access Fund
- **Dropdown hover state.** It was navy-on-navy with no visible change. It's now a clear gold highlight.
- **Contact page** scrolled sideways on phones.

**Enhanced**
- **Performance.**
  - Self-hosted variable fonts.
  - Three 1.3 MB PNG hero images re-encoded to JPG at about 90–140 KB each.
  - Logos are about 35 KB, down from 130 KB.
  - Images below the fold load lazily.
  - The hero video pauses when scrolled off screen.
- **Accessibility (WCAG 2.2 AA target).**
  - Skip link and visible focus rings.
  - Pause/play control on the autoplaying hero video.
  - Full reduced-motion support.
  - Labelled required fields, plus inline error messages that are announced to screen readers and placed next to the field.
  - Keyboard-operable dropdowns using the arrow keys and Escape.
  - Tap targets of at least 44 px.
  - SVG icons instead of text arrows.
- **Home page.**
  - One dominant hero call-to-action. "Book. Train. Perform." is now a secondary text link.
  - The pathway cards each have a one-line description.
  - The "Copy pending approval" box on the Neurodiversity band is replaced with that program's own approved lead copy.
- **Marketplace.** The three empty "pending approval" product slots now show three sample products from the commerce preview.
- **Leadership.** Long biographies are collapsed behind "Read full biography". Missing portraits show a navy monogram card instead of a striped placeholder.
- **Forms.**
  - Inline validation with clear messages.
  - The partner and accessibility hero buttons preselect the matching inquiry type.
  - The Contact page has quick links to the specialised forms.
- **Commerce preview.**
  - The cart persists across pages (localStorage).
  - Shop filters are reflected in the URL, e.g. `shop.html?cat=Apparel`.
  - Working variant selection, quantity, coupon (`AFSV10`), checkout validation and order confirmation.
- **Search and sharing.**
  - Unique page titles and descriptions.
  - Open Graph tags and canonical URLs.
  - `sitemap.xml`.
  - `robots.txt` blocks indexing while this is a preview; remove the Disallow line at launch.
- **Motion.** Subtle scroll-reveal with a staggered grid entrance. It is skipped automatically for reduced-motion users.

All legal and status safeguards from the brief are kept: disclaimers, "Proposed" and "Conceptual rendering" labels, investor and fund notices, and the "interest only" form framing.

## Motion and video

**Background videos.** There are 20 five-second loops, generated with Higgsfield (Kling 3.0 Pro, no sound) from each page's own photography, so the motion matches the stills. They are listed in `src/data/videos.json`.
- Each video loads only when its section scrolls near the screen.
- It fades in over the still image, which stays as the poster and fallback.
- It pauses when off screen and has its own pause button.
- It is never loaded for visitors who use reduced-motion or data-saver settings.

**Motion layer.** This is `src/assets/js/motion.js` plus the *Motion layer* section at the end of `site.css`.
- **Headlines.** Words rise in one by one, and a gold underline sweeps under the key word.
- **Home hero.** Gold running-track lanes draw in, with a pulse "runner" travelling along them, plus a scroll cue.
- **Program-area ticker.** A gold band scrolls continuously and pauses on hover.
- **"The model, in numbers".** Stat counters count up when they come into view. The 150,000 sq ft figure keeps its *Proposed* label.
- **Images.** They wipe in from the left, with a slow parallax drift while scrolling.
- **Section headings.** A gold rule draws in under each one.
- **Cards.** A gold spotlight follows the cursor, the pathway cards tilt in 3D, and grid cells grow a gold top bar.
- **Gold buttons.** A light sheen passes across them on hover, and the primary buttons drift slightly towards the cursor.
- **Scroll progress bar.** A gold bar along the top shows how far down the page you are.

All of this is switched off automatically under `prefers-reduced-motion`. Pointer effects only run on devices with a mouse.

## Open items (content the client needs to supply)

1. **Final photography.** The Neurodiversity, Business for Inclusion, Service Provider Network and Access Fund heroes now use the matching images found in the Higgsfield history. GAISB reuses the home-page AI studio image.
2. **Approved portraits** for Natalie Sutherland-Lashley, Michelle Lashley and Vinai Charran.
3. **Remote media.** The 20 background videos, the Programs, Education, Life Skills, Technology & Media, Neurodiversity, Business for Inclusion, Service Provider Network and Access Fund heroes, and all product and vendor images still load from the Higgsfield CDN (`d8j0ntlcm91z4.cloudfront.net`). Before launch, download them into `src/assets/` (or the WordPress media library) and update `src/data/videos.json` and `site.json`. Consider re-encoding the videos to roughly 1–2 MB each.
4. **Public mailbox** (`info@afsvvrc.com`) once routing is confirmed. Add it to the footer and the Contact page.
5. **Form routing.** All forms are previews and submit nowhere. In WordPress each one becomes its own Fluent Forms form, with its own owner and conversion event.
6. **Legal policies.** All 12 are listed as pending on `legal.html`.

## WordPress migration map

Every block in the HTML keeps the design's `data-el` and `data-el-build` attributes, so it can be matched to its WordPress build target:

| `data-el-build` | Build in WordPress as |
|---|---|
| `theme-builder` | Kadence or Blocksy header/footer builder (announcement bar, header, drawer, marketplace bar, footer, breadcrumb) |
| `elementor` | Elementor sections using the Basic widgets |
| `plugin` | Fluent Forms embeds, one form per section |
| `woo-template` | WooCommerce/Dokan templates styled with child-theme CSS. Keep them dormant until the commerce approvals are in. |
| `custom-widget` | Custom post types with a loop and filter (facilities, news, impact metrics, policy versions) |

`src/assets/css/site.css` can move almost unchanged into the child theme. Its tokens at the top of the file map directly to the Kadence/Elementor global colours and fonts.
