// Turns the static build in /site into a public REVIEW COPY (for Cloudflare Pages), the way gaisb.ai is served:
// plain pages, every crawler and AI assistant welcome, search engines asked not to index it.
// Run after `node src/build.mjs`:   node src/build.mjs && node scripts/make-preview.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const site = path.join(root, 'site');
if (!fs.existsSync(path.join(site, 'index.html'))) throw new Error('Run "node src/build.mjs" first.');

// 1. Welcome every crawler and AI assistant (the build's own robots.txt says Disallow: / for development).
fs.writeFileSync(
  path.join(site, 'robots.txt'),
  `# Review copy of the AFSV VRC website. Every crawler and AI assistant is welcome to read it.
# Search engines are asked not to index it (see the X-Robots-Tag header); the real site is https://afsvvrc.com
User-agent: *
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Agent
Allow: /

User-agent: Claude-User
Allow: /
`
);

// 2. Cloudflare Pages response headers: keep the copy out of search results.
fs.writeFileSync(path.join(site, '_headers'), `/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`);

// 3. Forms in the static design only pretend to send. On a public copy say so.
const js = path.join(site, 'assets/js/site.js');
const src = fs.readFileSync(js, 'utf8');
const from = "if (!window.AFSV_FORMS) { done(true); return; }";
if (!src.includes(from)) throw new Error('Form fallback line not found in site.js');
fs.writeFileSync(js, src.replace(from, "if (!window.AFSV_FORMS) { done(false, 'This is a review copy of the website, so the form does not send. Please email info@afsvvrc.com or use https://afsvvrc.com.'); return; }"));

// 4. The sitemap lists the live addresses; a review copy should not advertise them.
fs.rmSync(path.join(site, 'sitemap.xml'), { force: true });

console.log('Review copy ready in site/ (robots allow-all, noindex header, forms explained).');
