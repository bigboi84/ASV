# book.afsvvrc.com

Separate static site (not WordPress). Reuses the main site's CSS, fonts, images, scripts and components from `src/`.

Build: `node book/build.mjs` → `book/dist/` (10 pages).

## Deploy (Cloudflare Pages)
- Project root: repo root. Build command: `node book/build.mjs`. Output directory: `book/dist`. Functions directory: `book/functions`.
- Custom domain: `book.afsvvrc.com` (CNAME in the afsvvrc.com Cloudflare zone, proxied).
- Variables (Settings → Variables and Secrets): `RESEND_API_KEY` (secret), `MAIL_FROM`, `NOTIFY_TO` (defaults to info@afsvvrc.com). Never commit the key. Until set, the forms show "Forms are not switched on yet" and point to info@afsvvrc.com.
- `robots.txt` disallows everything for development; remove the Disallow line at launch.

## Config
- `book/pages.mjs` `APP_URL`: the 360 Player portal address (app.afsvvrc.com is provisional).
- Legal pages link to the main site (counsel supplies the text). Membership benefits are shown as "pending approval".
