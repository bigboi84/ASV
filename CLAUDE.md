# AFSV VRC website: working notes for Claude

## How changes go live (agreed with Kiel, 19 Oct 2026)
Kiel wants Claude to make changes **and push them live itself** wherever possible, not hand over steps.

1. Edit the static design in `src/`, run `node src/build.mjs` (48 pages into `site/`), then `node wordpress/build-site.mjs`.
   That writes the Elementor page JSON into `wordpress/afsv-vrc-core/content/` and copies the assets into the theme.
2. Bump versions:
   - theme: `wordpress/afsv-vrc-theme/style.css` and the `AFSV_THEME_VERSION` constant in `functions.php`;
   - plugin: the `Version:` header and the `AFSV_CORE_VERSION` constant in `wordpress/afsv-vrc-core/afsv-vrc-core.php`.
3. Zip into `wordpress/dist/` (gitignored). The folder names inside the zips must be `afsv-vrc` and `afsv-vrc-core`.
4. **Theme or plugin code changed?** Kiel uploads the zip(s) (Appearance → Themes / Plugins → Upload → Replace current).
   WordPress has no API for uploading zip files, so this step stays manual until a self-updater exists.
5. **Page content changed?** Claude runs the Build itself through the WordPress connector (Easy MCP: `wp_rest_write`):
   - `POST /afsv/v1/build`, body `{"status":"publish","front":true}`, admin-only (plugin 1.2.7+);
   - `GET /afsv/v1/status` returns the versions, each page's status and the last build time.
   - Existing pages always keep their status, so a build cannot take the site offline (on 19 Oct a drafts build did exactly that).
6. Verify live afterwards:
   - all 36 URLs return 200;
   - grep the live HTML for the change;
   - check `theme_version` and `plugin_version` from `/afsv/v1/status`.

Product data (WooCommerce) and site settings can be changed directly through the connector.

**Coming-soon gate (theme 1.2.8+, `inc/gate.php`):**
- Switched on in Settings → Coming soon. The public sees the landing page (`src/pages3.mjs` `comingSoon`, exported to `chrome/part-gate.html`; preview at `site/coming-soon.html`).
- Access: the preview code (30-day signed cookie), or being logged in as contributor or above.
- Never gated: REST API, wp-admin, wp-login.php, ajax, cron, robots.txt.
- While it's on, live page checks with curl see only the landing page. Ask Kiel for the code, POST it once (`afsv_access_code` and the form's nonce) and reuse the `afsv_preview` cookie. Never store the code in the repo.

## Live site and rules
- Staging and live site: https://afsv.198-105-177-163.sslip.io. WordPress, Elementor, WooCommerce, theme `afsv-vrc` (child of hello-elementor), plugin AFSV VRC Core.
- Registered company: **AFSV VRC Global Development Group Limited** (short form: "AFSV VRC"). Martin, 19 Oct 2026: use it everywhere, including the copyright, legal pages and trademark owner.
  - Exception: Natalie's and Michelle's bios keep Athletes & Fans Sports Village Holding Company Limited (AFSVHCL).
  - Martin's title: "Founder, Chairman & Interim CEO, AFSVHCL™ · Founder, AFSV VRC Global Development Group Limited". His quote attribution keeps "Founder, Chairman & Interim CEO, AFSVHCL™".
  - Vinai's title: "Deputy Chairman and Deputy CEO, AFSVHCL™ · Deputy Chairman and Deputy CEO, AFSV VRC Global Development Group Limited · Founder & CEO, Charran's Group of Companies".
  - Short titles for the Leadership top row live in the `chip` field.
  - Trademark names keep their names (e.g. AFSVHCL Marketplace™). Vinai's own quote is kept word for word.
- Menu:
  - "Esports" is a single tab linking to the EFN page.
  - "Membership & FanZone" has FanZone listed first.
- Domain: **afsvvrc.com** everywhere visitors see it (not afsvhcl.com). Martin, 19 Oct 2026: "In reviewing it is the website is still afsvhcl.com. This is not correct. It is afsvvrc.com." His trigger was an automated email the site sent.
- Email: GoDaddy (Microsoft 365) has separate mailboxes on both afsvhcl.com and afsvvrc.com.
  - **info@afsvvrc.com** (Business Professional) is the public address and the account WordPress sends through. SMTP Authentication was switched on 19 Oct.
  - Post SMTP settings: `smtp.office365.com`, port 587, TLS, username info@afsvvrc.com. Martin enters the password.
  - No alias is needed.
  - 20 Oct 2026: Post SMTP is set up and its test email arrived (From AFSVVRC <info@afsvvrc.com>). WooCommerce "From" address is info@afsvvrc.com. The WordPress admin email and form notifications stay with Kiel (admin), by his choice.
- Products are display-only: no prices, no Add to cart.
- No unsupported claims: proposed and planned wording for the village and services; statistics only with their source.
- The legal text comes from counsel only and must not be paraphrased. The full Terms and Privacy DOCX files are still outstanding.
- Mix races in all imagery.
- No EA, FIFA or other third-party trademarks.
- Don't paste or store secrets.
- Audit status: `wordpress/AUDIT-REGISTER-2026-10.md`.

## DNS and Cloudflare (set up 19-20 Oct 2026)
- afsvvrc.com DNS is on Cloudflare (nameservers `cass.ns.cloudflare.com`, `cullen.ns.cloudflare.com`); registrar stays GoDaddy.
- Records: A `@` → 198.105.177.163 (proxied), CNAME `www` → afsvvrc.com (proxied). All Microsoft 365 email records (3 MX, 3 TXT incl. `_dmarc`, 7 CNAMEs, 2 SRV) are DNS only. Never proxy or delete them.
- SSL/TLS mode: **Full** (not Flexible; not Full strict until the origin has a valid certificate). Always Use HTTPS and Automatic HTTPS Rewrites are on. No Cache Everything rules; Bot Fight Mode off (it can block the connector).
- DNSSEC is off at both GoDaddy and Cloudflare (Cloudflare's was turned on, then disabled again on 20 Oct 2026; no DS record was added at GoDaddy). Optional later: enable at Cloudflare and add the DS record at GoDaddy once the site and email are stable.
- Done 20 Oct 2026: Cloudflare Active, RunCloud domain added (afsvvrc.com primary, www redirects, sslip redirects), WordPress URLs are https://afsvvrc.com.
- Connector: Easy MCP uses the key-in-URL address (`/wp-json/easy-mcp-ai/v1/mcp/<key>`, no sign-in) because RunCloud's nginx returns 403 for `/.well-known/`, which breaks OAuth discovery. Optional fix: allow `^~ /.well-known/` in the app's NGINX Config. Never store the key in the repo.
