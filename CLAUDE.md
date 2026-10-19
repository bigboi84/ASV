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

## Live site and rules
- Staging and live site: https://afsv.198-105-177-163.sslip.io. WordPress, Elementor, WooCommerce, theme `afsv-vrc` (child of hello-elementor), plugin AFSV VRC Core.
- Registered company: **AFSV VRC Global Development Group Limited**. Keep Athletes & Fans Sports Village Holding Company Limited distinct; awaiting Martin's answers on where each name applies.
- Domain: **afsvvrc.com** everywhere visitors see it (not afsvhcl.com). Martin, 19 Oct 2026: "In reviewing it is the website is still afsvhcl.com. This is not correct. It is afsvvrc.com." His trigger was an automated email the site sent.
- Email: GoDaddy (Microsoft 365) has separate mailboxes on both afsvhcl.com and afsvvrc.com.
  - **info@afsvvrc.com** (Business Professional) is the public address and the account WordPress sends through. SMTP Authentication was switched on 19 Oct.
  - Post SMTP settings: `smtp.office365.com`, port 587, TLS, username info@afsvvrc.com. Martin enters the password.
  - No alias is needed.
- Products are display-only: no prices, no Add to cart.
- No unsupported claims: proposed and planned wording for the village and services; statistics only with their source.
- The legal text comes from counsel only and must not be paraphrased. The full Terms and Privacy DOCX files are still outstanding.
- Mix races in all imagery.
- No EA, FIFA or other third-party trademarks.
- Don't paste or store secrets.
- Audit status: `wordpress/AUDIT-REGISTER-2026-10.md`.
