import {
  SITE, html, raw, href, btn, pmedia, splitWords, arrow, icon, breadcrumb, ctaBand, note, pendingInputs, pageHero,
  previewForm, fromDesignFields, formSection, numberedCells, numberedRows, pad2, money, initials,
} from './lib.mjs';

import { aboutExtra, whitbyOverview, whitbyRoadmap, membershipExtra, partnersExtra, contactExtra, EXTRAS } from './pages2.mjs';

const IMG = (f) => `assets/img/${f}`;
let V = {};
export const setVideos = (v) => { V = v; };
const TICK = ['Multi-sport development', 'Soccer', 'Cricket', 'Basketball', 'Track and sprint', 'Adaptive sport', 'Esports', 'AI education', 'Life skills', 'Mentorship', 'Inclusive education', 'Community'];
// Hand-drawn style line icons for the program strip under the home intro (24×24 grid, stroked).
const SKETCH = {
  'Multi-sport development': '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.2M17 6h2.5a2.5 2.5 0 0 1-2.6 3.2"/><path d="M12 13v4M8.5 20.5h7M9.5 17h5v3.5"/>',
  Soccer: '<circle cx="12" cy="12" r="8.6"/><path d="M12 8.2l3.2 2.3-1.2 3.8h-4l-1.2-3.8z"/><path d="M12 3.4v4.8M15.2 10.5l4.3-1.6M14 14.3l2.7 3.8M10 14.3l-2.7 3.8M8.8 10.5L4.5 8.9"/>',
  Cricket: '<path d="M14.6 3.6l2.4 2.4-8.2 8.2-2.4-2.4z"/><path d="M6.4 11.8l-2.6 2.6a1.4 1.4 0 0 0 0 2l.4.4a1.4 1.4 0 0 0 2 0l2.6-2.6"/><circle cx="17.2" cy="17.4" r="2.6"/><path d="M15.6 15.6c.9.4 2 1.6 2.4 2.6"/>',
  Basketball: '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4v17.2"/><path d="M6 5.8c2.6 2.8 2.6 9.6 0 12.4M18 5.8c-2.6 2.8-2.6 9.6 0 12.4"/>',
  'Track and sprint': '<circle cx="14.6" cy="4.6" r="1.8"/><path d="M8.2 9.6l3.4-2 3 1.8 2 3.2 2.6.6"/><path d="M11.6 7.6l-1.4 5.6 3.2 2.6-.8 5"/><path d="M10.2 13.2l-2.6 3.4-3.6-.4"/><path d="M2.6 21h6M15.6 21h5.8"/>',
  'Adaptive sport': '<circle cx="12.4" cy="4.4" r="1.8"/><path d="M12 7v5.6h4.6l2 5"/><path d="M12 9.6h4"/><circle cx="10" cy="16" r="4.8"/><path d="M5.4 21h3"/>',
  Esports: '<path d="M6.6 7.6h10.8a3.6 3.6 0 0 1 3.5 2.8l1 4.6a2.4 2.4 0 0 1-4 2.2l-2.1-2.2H8.2L6.1 17.2a2.4 2.4 0 0 1-4-2.2l1-4.6a3.6 3.6 0 0 1 3.5-2.8z"/><path d="M7.4 10.2v3M5.9 11.7h3"/><circle cx="15.6" cy="11" r=".9"/><circle cx="17.6" cy="12.8" r=".9"/>',
  'AI education': '<rect x="6.4" y="6.4" width="11.2" height="11.2" rx="2"/><path d="M9.6 3.2v3.2M14.4 3.2v3.2M9.6 17.6v3.2M14.4 17.6v3.2M3.2 9.6h3.2M3.2 14.4h3.2M17.6 9.6h3.2M17.6 14.4h3.2"/><path d="M9.6 14.6l1.4-5.2h2l1.4 5.2M10.2 12.8h3.6"/>',
  'Life skills': '<path d="M9 17.4h6M9.6 20.4h4.8"/><path d="M12 3.2a6 6 0 0 0-3.6 10.8c.6.5.9 1.1.9 1.9v1.5h5.4v-1.5c0-.8.3-1.4.9-1.9A6 6 0 0 0 12 3.2z"/><path d="M12 7.2v3.6l2-1.2"/>',
  Mentorship: '<circle cx="8.4" cy="6.2" r="2.6"/><circle cx="16.6" cy="9.4" r="2"/><path d="M3.6 20.4v-3.2a4.8 4.8 0 0 1 9.6 0v3.2"/><path d="M13 15.2a3.6 3.6 0 0 1 7.2 1.2v4"/><path d="M11.2 12.4l2.6.8"/>',
  'Inclusive education': '<path d="M12 6.6C9.8 5 6.6 4.6 3.4 5v13.4c3.2-.4 6.4 0 8.6 1.6 2.2-1.6 5.4-2 8.6-1.6V5c-3.2-.4-6.4 0-8.6 1.6z"/><path d="M12 6.6v13.4"/><path d="M15.8 10.4c.6-1 2.4-.8 2.4.6 0 1.2-2.4 2.6-2.4 2.6s-2.4-1.4-2.4-2.6c0-1.4 1.8-1.6 2.4-.6z"/>',
  Community: '<circle cx="12" cy="6.4" r="2.4"/><circle cx="5.4" cy="9.4" r="2"/><circle cx="18.6" cy="9.4" r="2"/><path d="M7.6 20.4v-2.6a4.4 4.4 0 0 1 8.8 0v2.6"/><path d="M2.2 18.4v-1a3.2 3.2 0 0 1 4.8-2.8M21.8 18.4v-1a3.2 3.2 0 0 0-4.8-2.8"/>',
};
Object.assign(SKETCH, {
  Dome: '<path d="M2.6 18.6h18.8"/><path d="M4 18.6C4 12 7.6 7.4 12 7.4S20 12 20 18.6"/><path d="M8.2 18.6c0-4.8 1.7-8.6 3.8-11.2M15.8 18.6c0-4.8-1.7-8.6-3.8-11.2"/><path d="M4.8 14.2h14.4"/><path d="M10.4 18.6v-2.8h3.2v2.8"/>',
  Growth: '<path d="M3.4 20.4h17.2"/><path d="M5.6 20.4v-4.6M10 20.4v-7.4M14.4 20.4v-5.6M18.8 20.4V9.4"/><path d="M4.6 11.6l5-4.4 4 2.8 6.2-5.6"/><path d="M16.4 4.4h3.4v3.4"/>',
  Mind: '<path d="M9.4 4.2a3.4 3.4 0 0 0-3.4 3.2 3.2 3.2 0 0 0-1.6 5.6 3.4 3.4 0 0 0 3 4.8 3 3 0 0 0 4.6 1.6V5.6a2.6 2.6 0 0 0-2.6-1.4z"/><path d="M14.6 4.2A3.4 3.4 0 0 1 18 7.4a3.2 3.2 0 0 1 1.6 5.6 3.4 3.4 0 0 1-3 4.8 3 3 0 0 1-4.6 1.6"/><path d="M9 10.2c1 .2 1.8.9 2.1 1.8M15 10.2c-1 .2-1.8.9-2.1 1.8"/>',
  Kit: '<path d="M8.6 3.6L4 6l1.6 4.2 2-.8V20.4h8.8V9.4l2 .8L20 6l-4.6-2.4a3.4 3.4 0 0 1-6.8 0z"/>',
  Handshake: '<path d="M2.6 12.4l3.6-4.2 3.6 1.4 2.4-1.4 3.2.4 3.8 3.6"/><path d="M2.6 12.4l3.4 3.2M21.4 12.2l-3.2 3.4"/><path d="M8.6 14.6l1.6 1.6a1.2 1.2 0 0 0 1.7 0l.2-.2M11 13.4l2.4 2.4a1.2 1.2 0 0 0 1.7 0l.6-.6-3.6-3.8"/>',
  Globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2"/><path d="M12 3.4c2.4 2.4 3.6 5.2 3.6 8.6s-1.2 6.2-3.6 8.6c-2.4-2.4-3.6-5.2-3.6-8.6s1.2-6.2 3.6-8.6z"/>',
});
export const sketchIcon = (name) => raw(`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${SKETCH[name]}</svg>`);
const PREVIEW = 'Development preview — this form is not connected yet.';


// Featured event block (home + events page). WordPress: Events CPT single-card template.
function eventFeature(e, el = 'home.event') {
  return html`
<article class="event${e.brand ? ' event--' + e.brand : ''}" data-el="${el}" data-el-build="custom-widget">
  <div class="event__date" aria-hidden="true">
    <span class="event__day">${e.day}</span>
    <span class="event__month">${e.month}</span>
    <span class="event__end">${e.endLabel}</span>
  </div>
  <div class="event__main">
    <p class="event__wordmark"><small>${e.city} · ${e.dateLabel}</small></p>
    <h3 class="event__title"><a href="${e.url}" target="_blank" rel="noopener noreferrer">${e.name}<span class="sr-only"> (opens the summit website in a new tab)</span></a></h3>
    <p class="event__headline"><span>${e.headline}</span> ${e.subhead}</p>
    <ul class="event__themes">${e.themes.map((t) => html`<li>${t}</li>`)}</ul>
    <p class="event__summary">${e.summary}</p>
    <p class="event__where"><strong>${e.dateLabel}</strong> · ${e.venue}, ${e.city}</p>
    <div class="btn-row btn-row--stack">
      <a class="btn btn--gold event__cta" href="${e.url}" target="_blank" rel="noopener noreferrer">${e.ctaPrimary}<span class="sr-only"> (opens the summit website in a new tab)</span>${icon('external')}</a>
      <a class="btn btn--line-light event__cta2" href="${e.url}" target="_blank" rel="noopener noreferrer">${e.ctaSecondary}<span class="sr-only"> (opens in a new tab)</span>${icon('external')}</a>
    </div>
    <p class="event__host">${e.host}</p>
  </div>
  <aside class="event__side">
    <p class="event__side-label">Summit opens in</p>
    <div class="countdown" data-countdown="${e.start}" role="timer" aria-label="Countdown to ${e.name}">
      ${[['days', 'Days'], ['hours', 'Hours'], ['mins', 'Minutes'], ['secs', 'Seconds']].map(([k, l]) => html`<div class="countdown__cell"><span class="countdown__num" data-unit="${k}">--</span><span class="countdown__label">${l}</span></div>`)}
    </div>
    <dl class="event__facts">${e.facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
  </aside>
</article>`;
}

function esportsBand() {
  return html`
<section class="esports" data-el="home.esports" data-el-build="elementor">
  <div class="esports__grid" aria-hidden="true"><div class="esports__floor"></div></div>
  <div class="esports__glow" aria-hidden="true"></div>
  <div class="wrap esports__inner">
    <div class="esports__copy reveal">
      <p class="esports__badge"><span class="esports__dot" aria-hidden="true"></span>Dedicated esports site launching soon</p>
      <p class="eyebrow">Esports, Technology, Media &amp; Innovation</p>
      <h2 class="esports__title"><span>Compete.</span> <span>Create.</span> <span>Broadcast.</span></h2>
      <p class="lead">Not every participant connects with traditional sport. AFSV VRC esports and media pathways are intended to build social connection, skills, confidence, storytelling and career exploration — from competition to the broadcast desk.</p>
      <div class="btn-row btn-row--stack">
        ${btn('Explore esports & media pathways', '/technology-media', 'gold')}
        ${btn('Get launch updates', '/technology-media#interest', 'line-light')}
      </div>
      <p class="esports__note">Competition, production and podcast spaces are conceptual and not yet operational.</p>
    </div>
    <ul class="esports__modes reveal" aria-label="Esports and media pathways">
      ${[['Esports', 'Team play, tournaments and coaching'], ['Content creation', 'Video, streaming and storytelling'], ['Broadcasting', 'Commentary, production and live coverage'], ['Podcasting', 'Participant and community voices'], ['Coding & STEM', 'Game design and technical skills']].map(([t, d], i) => html`<li style="--i:${i}"><span class="esports__key">${pad2(i + 1)}</span><span><b>${t}</b><small>${d}</small></span></li>`)}
    </ul>
  </div>
</section>`;
}

// ════════════════════════ HOME ════════════════════════
// Hero film: a 25-second concept flythrough of the proposed village (AI concept renderings,
// opening on the designer's Whitby dome). Chips follow the film's timeline and jump to each chapter.
const FILM = [
  { t: 0, label: 'The Village', line: 'The proposed Whitby Smart Sports Village: dome, fields, track and courts.' },
  { t: 4.17, label: 'Arrival', line: 'Through the main gate and up into the concourse.' },
  { t: 8.33, label: 'High Performance', line: 'Strength & conditioning, sports science and recovery.' },
  { t: 12.5, label: 'Esports Studio', line: 'Compete. Stream. Connect. The future is digital.' },
  { t: 16.67, label: 'Learning Centre', line: 'Classrooms, tutoring, mentorship and special needs support.' },
  { t: 20.83, label: 'Match Night', line: 'Through the tunnel and into the dome on match night.' },
];

// Home content carried over from the AFSVHCL (Sintra) home page.
const MISSION = [
  ['Multi-sport development', 'Sport Development', 'High-performance athlete development programs for youth and elite athletes across multiple sports.'],
  ['Dome', 'Innovative Infrastructure', 'Inflatable dome facilities designed for year-round training and competition.'],
  ['Community', 'Community Impact', 'Strengthening communities through sport, connecting diaspora networks and building lasting partnerships.'],
  ['Inclusive education', 'Education & Youth Excellence', 'Academic support, mentorship and life skills development integrated with athletic training.'],
  ['Mind', 'Special Needs & Neurodivergent Support', 'Inclusive programs for autism, ADHD, dyslexia and learning challenges through specialized mentorship and education support.'],
  ['Growth', 'Investment & Sustainable Growth', 'A scalable national infrastructure model with diversified revenue streams.'],
];
const ECO3 = [
  { tag: 'AFSV VRC', tone: 'gold', name: 'AFSV-VRC™ Development Group Ltd.', kicker: 'Infrastructure development', img: 'whitby/site-aerial.jpg', body: "Designing and building the infrastructure for Canada's Smart Sports Village network — planning, designing and delivering facilities across Canada.", route: '/whitby-smart-sports-village' },
  { tag: 'EDU', tone: 'red', name: 'Education & Inclusion Programming', kicker: 'MLMSR Mentorship · Special needs support', img: 'whitby/learn.jpg', body: 'Mentorship and education programs for youth and neurodivergent learners — leadership development, academic support and specialized programs.', route: '/education' },
  { tag: 'EFN', tone: 'slate', name: 'EFN – Esports & Fans Network', kicker: 'Digital & esports division', img: 'village/efn-arena.jpg', body: 'A digital platform connecting athletes and fans through esports tournaments, live streaming, athlete media and global fan engagement. Home of FanZone™.', route: '/technology-media' },
];
const EFN = [
  ['Esports tournaments', 'Competitive gaming events for amateur and professional players.'],
  ['Live streaming events', 'Broadcast-quality production for sports and esports content.'],
  ['Athlete media content', 'Podcast studio, interviews and athlete storytelling.'],
  ['Global fan engagement', 'Digital memberships, live stats and interactive experiences.'],
];
const EDU_CATS = [
  ['Autism spectrum support', 'Structured programs integrating physical activity with social skills development.', 'neuro/autism.jpg'],
  ['ADHD strategies', 'Focused training environments and mentorship approaches tailored for athletes with ADHD.', 'neuro/adhd.jpg'],
  ['Dyslexia programs', 'Academic support and alternative learning methods for athletes with reading challenges.', 'neuro/dyslexia.jpg'],
  ['Family support resources', 'Resources and counselling for families navigating neurodivergent challenges.', 'neuro/family.jpg'],
];
const TIERS = [
  { name: 'Individual', usd: '$250 USD', cad: '$350 CAD', items: ['Community platform access', '10–15% marketplace pricing', 'Education & wellness resources', 'Welcome package with branded hoodie'], fund: '$25 USD to the Neurodivergent Inclusion Fund' },
  { name: 'Business', usd: '$1,000 USD', cad: '$1,400 CAD', items: ['Marketplace directory listing', 'Business profile & spotlight features', 'Sponsorship opportunities', 'Inclusion Champion designation'], fund: '$100 USD to the Neurodivergent Inclusion Fund' },
];
const OPPS = [
  ['Multi-sport development', 'Athletes & Families', 'Register your interest for proposed year-round training programs and be among the first to know when programs launch.', 'Register interest', '#register'],
  ['Handshake', 'Partners & Sponsors', 'Corporate brands, institutions and community organizations aligned with our mission are welcome to express interest.', 'Express interest', 'partners.html'],
  ['Globe', 'Global Community', 'Express your interest in the proposed Global Diaspora Network — support youth sport and represent your heritage.', 'Learn more', 'about.html'],
];

export function home(d) {
  const pillarImgs = [
    ['life/hall.jpg', 'Concept rendering: racially diverse youth athletes training basketball, sprints and futsal in a busy multi-sport hall at night, with coaches cheering them on.'],
    ['ai-education-studio.jpg', 'Adult learners at a long desk with large data displays while an instructor explains.'],
    ['life/entrance.jpg', 'Concept rendering: a step-free entrance at dusk where staff welcome a young athlete using a sports wheelchair and a visitor with a guide dog.'],
    ['life/plaza.jpg', 'Concept rendering: racially diverse families and teen athletes arriving at the village plaza at dusk, the dome glowing behind them.'],
  ];
  const pathways = [
    { ...d.pathways[0], desc: 'Athlete pathways, coaching and multi-sport training.', img: 'life/academy.jpg' },
    { ...d.pathways[1], desc: 'Register interest in the five proposed membership pathways.', img: 'life/lounge.jpg' },
    { ...d.pathways[2], desc: 'Executive and Everyday & Sport apparel and accessories.', img: 'merch/regular-varsity-jacket-navy.jpg' },
    { ...d.pathways[3], desc: 'Sponsorship, education, technology and development routes.', img: 'life/suite.jpg' },
  ];
  return {
    title: 'Home',
    overlay: true,
    description: 'AFSV VRC is creating a smarter, more inclusive sports and education ecosystem where athletes, families, educators, partners and communities can train, learn, connect and grow.',
    body: html`
<section class="hero hero--full hero--reel" data-el="home.hero" data-el-build="elementor" data-film>
  <div class="hero__media reel" aria-hidden="true">
    <img src="${IMG('village/film-poster.jpg')}" alt="" width="1920" height="1080" fetchpriority="high">
    <video data-film-video poster="${IMG('village/film-poster.jpg')}" muted loop playsinline preload="metadata" tabindex="-1"><source src="assets/video/village-flythrough.webm" type="video/webm"><source src="assets/video/village-flythrough.mp4" type="video/mp4"></video>
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="wrap hero__content hero__content--film">
    <p class="film__tag"><span class="pill pill--gold">Proposed</span> Whitby, Ontario</p>
    <h1 class="film__title split-words" aria-label="Canada's new year-round sports village"><span aria-hidden="true">${splitWords(["Canada's new year-round", 'sports village'])}</span></h1>
    <a class="film__cta" href="whitby-smart-sports-village.html">Explore the village</a>
  </div>
  <div class="reel__bar">
    <div class="wrap reel__bar-inner">
      <div class="reel__chips" role="group" aria-label="Explore the village">
        ${FILM.map((r, i) => html`<button type="button" class="reel__chip" data-reel-go="${i}" data-t="${r.t}" data-title="${r.label}" data-line="${r.line}" aria-pressed="${i === 0 ? 'true' : 'false'}"><span class="reel__num">${String(i + 1).padStart(2, '0')}</span>${r.label}<i class="reel__prog" aria-hidden="true"></i></button>`)}
      </div>
      <button type="button" class="reel__pause" aria-pressed="false" data-reel-pause>${icon('pause', 'ico-pause')}${icon('play', 'ico-play')}<span class="sr-only">Pause the background film</span></button>
    </div>
  </div>
</section>

<section class="home-intro" data-el="home.intro" data-el-build="elementor">
  <div class="wrap section home-intro__grid">
    <div class="reveal">
      <p class="eyebrow eyebrow-rule mb-s">AFSV VRC Global Development Group</p>
      <h2 class="home-intro__title">Building Athletes. Empowering Minds. <em>Strengthening Communities.</em></h2>
      <div class="sport-strip" aria-label="Program areas">
        <div class="sport-strip__track">
          <ul>${TICK.map((t) => html`<li>${sketchIcon(t)}<span>${t}</span></li>`)}</ul>
          <ul aria-hidden="true">${TICK.map((t) => html`<li>${sketchIcon(t)}<span>${t}</span></li>`)}</ul>
        </div>
      </div>
    </div>
    <div class="reveal">
      <p class="lead mb-m">One connected village for sport, high performance, esports, education, mentorship and inclusion — where athletes, families and communities can train, learn, connect and grow.</p>
      <div class="btn-row mb-l">
        ${btn('Explore the Smart Sports Village', '/whitby-smart-sports-village', 'navy')}
        ${btn('Join the Movement', '/membership', 'line-dark')}
      </div>
      <ul class="home-intro__facts">
        <li><span>Pilot</span><b>Whitby, Ontario</b></li>
        <li><span>Model</span><b>4 strategic pillars</b></li>
        <li><span>Reach</span><b>Canada · Caribbean · Global</b></li>
        <li><span>Book. Train. Perform.</span><a href="${SITE.booking}" target="_blank" rel="noopener noreferrer">Book a session ${icon('external')}<span class="sr-only"> (opens in a new tab)</span></a></li>
      </ul>
    </div>
  </div>
</section>

<section class="wrap section event-section" id="events" aria-labelledby="events-h">
  <div class="section-head reveal">
    <h2 class="h2" id="events-h">Upcoming event.</h2>
    <p class="body-lg muted">The first event on the AFSV VRC calendar. <a class="text-link" href="events.html">All events ${arrow()}</a></p>
  </div>
  ${eventFeature(d.events[0])}
</section>

<section class="section mission" data-el="home.mission" data-el-build="elementor">
  <div class="wrap section-head reveal">
    <p class="eyebrow mb-s">Our mission</p>
    <h2 class="h2">Creating opportunities through sport &amp; education.</h2>
    <p class="body-lg muted">Our ecosystem integrates athlete development, education and mentorship, special needs inclusion, esports engagement, corporate partnerships and global diaspora participation.</p>
  </div>
</div>
<div class="mslide" aria-label="Our mission pillars">
  <div class="mslide__track">
    ${[0, 1].map((dup) => html`<ul${dup ? raw(' aria-hidden="true"') : ''}>${MISSION.map(([ic, t, b], i) => html`<li class="mcard"><span class="mcard__num">${pad2(i + 1)}</span><span class="mcard__ico">${sketchIcon(ic)}</span><h3>${t}</h3><p>${b}</p></li>`)}</ul>`)}
  </div>
</div>
</section>

<section class="tri" data-el="home.ecosystem-3" data-el-build="elementor" data-tri>
  <div class="tri__pin">
    <span class="tri__shape" aria-hidden="true"></span>
    <div class="wrap tri__grid">
      <div class="tri__intro">
        <p class="eyebrow mb-s">AFSVHCL™ ecosystem</p>
        <h2 class="tri__title">Three pillars.<br><em>One vision.</em></h2>
        <ol class="tri__steps">
          ${ECO3.map((e, i) => html`<li${i === 0 ? raw(' class="is-on"') : ''}><span>${pad2(i + 1)}</span>${e.tag}</li>`)}
        </ol>
        <p class="tri__motto">Educate · Empower · Include · Inspire</p>
      </div>
      <div class="tri__stage">
        ${ECO3.map((e, i) => html`<a class="tri-card tri-card--${e.tone}" href="${href(e.route)}" style="--i:${i}">
          <span class="tri-card__top"><span class="tri-card__tag">${e.tag}</span><span class="tri-card__n">${pad2(i + 1)} / 03</span></span>
          <h3>${e.name}</h3>
          <small>${e.kicker}</small>
          <p>${e.body}</p>
          <span class="tri-card__img"><img src="${IMG(e.img)}" alt="" width="1200" height="800" loading="lazy"></span>
          <span class="tri-card__more">Learn more ${arrow()}</span>
        </a>`)}
      </div>
    </div>
  </div>
</section>

<section class="flow-stack" id="ecosystem" data-el="home.ecosystem" data-el-build="custom-widget">
  <div class="wrap">
    <div class="statement reveal">
      <p class="eyebrow">One connected ecosystem</p>
      <p class="statement__text"><strong>Sport is only the beginning.</strong> AFSV VRC brings together athlete development, academic success, neurodivergent support and inclusive education, life skills, technology, community programming and commercial opportunity in one connected platform.</p>
    </div>
    <div class="stack" data-stack>
      <nav class="stack__tabs" aria-label="Strategic pillars">
        ${d.pillars4.map((p, i) => html`<a href="#pillar-${p.num}"${i === 0 ? raw(' class="is-active" aria-current="true"') : ''}><span>${p.num}</span>${d.pillars[i].title}</a>`)}
      </nav>
      <div class="stack__list">
        ${d.pillars4.map((p, i) => html`
        <article class="stack-card" id="pillar-${p.num}" style="--i:${i}" aria-labelledby="pillar-${p.num}-t">
          <div class="stack-card__copy">
            <span class="stack-card__num">${p.num} <small>/ 0${d.pillars4.length}</small></span>
            <h3 class="stack-card__title" id="pillar-${p.num}-t">${p.title}</h3>
            <p class="stack-card__body">${p.body}</p>
            ${p.caveat ? html`<p class="stack-card__caveat">${p.caveat}</p>` : ''}
            ${btn('Explore ' + p.linkLabel, p.href, 'gold')}
          </div>
          <figure class="stack-card__media"><img src="${IMG(pillarImgs[i][0])}" alt="${pillarImgs[i][1]}" width="1344" height="752" loading="lazy"></figure>
        </article>`)}
      </div>
    </div>
  </div>
</section>

<section class="draw" data-draw data-el="home.whitby-intro" data-el-build="custom-widget">
  <div class="wrap draw__head reveal">
    <p class="eyebrow">Proposed pilot · Whitby, Ontario</p>
    <h2 class="draw__title" data-sweep>A year-round home for sport, learning and community.</h2>
  </div>
  <svg class="draw__art" viewBox="0 0 1200 360" role="img" aria-label="Line drawing of the proposed Whitby Smart Sports Village: a multi-sport dome beside low pavilions with solar canopies, a running track in front." focusable="false">
    <circle class="draw__line draw__line--gold" pathLength="1" cx="1060" cy="104" r="34"/>
    <path class="draw__line" pathLength="1" d="M0 300 H1200"/>
    <path class="draw__line" pathLength="1" d="M170 300 C 170 115, 770 115, 770 300"/>
    <path class="draw__line" pathLength="1" d="M250 300 C 255 165, 685 165, 690 300"/>
    <path class="draw__line" pathLength="1" d="M335 300 C 340 205, 600 205, 605 300"/>
    <path class="draw__line" pathLength="1" d="M470 161 V300 M370 182 L330 300 M570 182 L610 300 M290 225 L240 300 M650 225 L700 300"/>
    <path class="draw__line" pathLength="1" d="M420 300 V262 H520 V300"/>
    <path class="draw__line" pathLength="1" d="M810 300 V232 H990 V300 M840 300 V258 H880 V300 M920 258 H960"/>
    <path class="draw__line draw__line--gold" pathLength="1" d="M796 236 L1004 210 M820 233 V242 M900 223 V232 M980 213 V222"/>
    <path class="draw__line" pathLength="1" d="M1010 300 V252 H1130 V300"/>
    <path class="draw__line draw__line--gold" pathLength="1" d="M1002 256 L1138 238"/>
    <path class="draw__line" pathLength="1" d="M70 300 V262 M70 262 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0 M118 300 V272 M118 272 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0"/>
    <path class="draw__line" pathLength="1" d="M1172 300 V266 M1172 266 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0"/>
    <path class="draw__line draw__line--gold" pathLength="1" d="M120 330 H1080 M150 346 H1050"/>
    <path class="draw__line" pathLength="1" d="M760 300 V150 M752 150 H768 M1150 300 V170 M1142 170 H1158"/>
  </svg>
</section>

<section class="expand" data-el="home.whitby" data-el-build="elementor" data-expand>
  <div class="expand__frame" data-video-scope>
    ${pmedia({ img: IMG('whitby-dome.jpg'), alt: 'Conceptual rendering: a large white inflatable sports dome carrying the AFSV VRC crest, with a glass-fronted entrance pavilion, landscaped plaza, accessible parking and people arriving, and a lake on the horizon. Not an existing facility.', parallax: 0, w: 1600, h: 900 })}
    <span class="expand__shade" aria-hidden="true"></span>
    <div class="wrap expand__content">
      <div class="expand__card reveal">
        <span class="pill pill--gold">Proposed</span>
        <h2 class="h2">Whitby Smart Sports Village</h2>
        <p class="lead">Our proposed Whitby pilot is envisioned as a technology-enabled, multi-sport destination serving athletes, students, families, clubs, educators and community partners.</p>
        <ul class="expand__tags">${['Multi-sport dome', 'Performance & recovery', 'Learning & life skills', 'Sensory-aware spaces', 'Esports & broadcast'].map((t) => html`<li>${t}</li>`)}</ul>
        ${btn('Discover the Vision', '/whitby-smart-sports-village', 'gold')}
      </div>
    </div>
    <p class="caption-bar expand__caption">Conceptual Rendering — Not an Existing Facility</p>
  </div>
</section>

<section class="hscroll" data-hscroll data-el="home.stats" data-el-build="custom-widget" aria-labelledby="numbers-h">
  <div class="hscroll__pin">
    <div class="hscroll__glow" aria-hidden="true"></div>
    <div class="wrap hscroll__head">
      <p class="eyebrow">Planned scope</p>
      <h2 class="hscroll__title" id="numbers-h" data-sweep>The model, in numbers.</h2>
      <p class="body-lg">Planned scope for the first phase. Figures are proposals, not results, and stay labelled that way.</p>
    </div>
    <div class="hscroll__viewport">
      <ul class="hscroll__track">
        ${[
          ['4', '', 'Strategic pillars', 'Connecting sport, learning, inclusion and life skills', ''],
          ['10', '', 'Program categories', 'Planned for the first cycle', ''],
          ['150000', 'sq ft', 'Phase 1 floor area', 'Approximate, subject to site, design, approvals and financing', 'Proposed'],
          ['6', '', 'Facility zones', 'From the multi-sport dome to media and broadcast', ''],
          ['3', '', 'Regions', 'Canada, the Caribbean and global partnerships', 'Planned'],
        ].map(([n, unit, k, label, pill], i) => html`
        <li class="num-card" style="--i:${i}">
          <span class="num-card__value"><span data-count="${n}">${Number(n).toLocaleString('en-CA')}</span>${unit ? html`<small>${unit}</small>` : ''}</span>
          <span class="num-card__k">${k}</span>
          <span class="num-card__label">${label}</span>
          ${pill ? html`<span class="pill pill--gold">${pill}</span>` : ''}
        </li>`)}
      </ul>
    </div>
  </div>
</section>

<section class="float-paths" data-el="home.pathways" data-el-build="elementor">
  <div class="float-paths__glow" aria-hidden="true"></div>
  <div class="wrap section">
    <div class="section-head reveal">
      <h2 class="h2">Choose your pathway.</h2>
      <p class="body-lg muted">Four ways in. Each route reaches the team responsible for it.</p>
    </div>
    <div class="path-grid path-grid--float" data-stagger>
      ${pathways.map((w) => html`
      <a class="path-card" href="${href(w.href)}">
        <span class="path-card__img"><img src="${IMG(w.img)}" alt="" width="1344" height="752" loading="lazy"></span>
        <span class="path-card__body">
          <span class="eyebrow">${w.kicker}</span>
          <span class="path-card__title">${w.title}</span>
          <span class="path-card__desc">${w.desc}</span>
        </span>
        <span class="path-card__go" aria-hidden="true">${icon('arrow')}</span>
      </a>`)}
    </div>
  </div>
</section>

${esportsBand()}

<section class="band--cream" data-el="home.neurodiversity" data-el-build="elementor">
  <div class="wrap section split split--center">
    <figure class="figure figure--4x3 figure--motion wipe neuro-figure" data-video-scope data-swap-stage>${EDU_CATS.map((c, i) => html`<img class="swap-img" data-swap-img="${i}" src="${IMG(c[2])}" alt="" width="1200" height="900" loading="lazy">`)}${pmedia({ img: IMG('sensory-support-space.jpg'), alt: 'Two adults in relaxed conversation in a calm, sensory-considerate support space with soft acoustic wall panels, dimmable lighting and quiet soft seating.', video: V.sensory, w: 1168, h: 880 })}</figure>
    <div class="reveal">
      <p class="eyebrow mb-s">Neurodiversity Access &amp; Opportunity</p>
      <h2 class="h2 mb-m">Different Minds.<br>Equal Opportunity.</h2>
      <p class="lead mb-m">AFSV VRC is developing an inclusive ecosystem intended to expand access to sport, education, developmental support, life skills, technology and employment for neurodivergent people — reducing financial and accessibility barriers through qualified professionals, community organizations, businesses, sponsors and employers.</p>
      <ul class="check-list mb-l">${['Sensory-friendly environments', 'Qualified service provider network', 'Neurodiversity Access Fund', 'Neuroinclusive employers'].map((t) => html`<li>${t}</li>`)}</ul>
      ${btn('Explore Neurodiversity Access & Opportunity', '/neurodiversity', 'navy')}
    </div>
  </div>
  <div class="wrap edu-cats">
    <div class="edu-cats__stat reveal" tabindex="0" data-swap="-1"><b>1 in 5</b><span>children in Canada are neurodivergent — millions of families need these services.</span></div>
    ${EDU_CATS.map(([t, b], i) => html`<div class="edu-cats__card reveal" tabindex="0" data-swap="${i}"><h3>${t}</h3><p>${b}</p></div>`)}
  </div>
</section>

<section class="efn" data-el="home.efn" data-el-build="elementor">
  <div class="wrap section split split--center">
    <div class="reveal">
      <p class="eyebrow mb-s">EFN · Esports &amp; Fans Network</p>
      <h2 class="h2 mb-m">Where sports<br>meets digital.</h2>
      <p class="lead mb-m">EFN connects athletes and fans through digital competitions and interactive media — a proposed esports arena, broadcasting studio and digital media hub, integrated into the sports village ecosystem. Home of FanZone™.</p>
      <ul class="efn__list mb-l">${EFN.map(([t, b]) => html`<li><b>${t}</b><span>${b}</span></li>`)}</ul>
      ${btn('Explore the digital platform', '/technology-media', 'gold')}
    </div>
    <figure class="figure figure--4x3 figure--motion wipe efn-figure">${pmedia({ img: IMG('village/efn-arena.jpg'), alt: 'Conceptual rendering: a packed esports arena hosting a football video game tournament, with players on stage and giant screens showing soccer gameplay. Not an existing facility.', w: 1200, h: 800 })}
      <figcaption class="caption-bar">Conceptual Rendering — Not an Existing Facility</figcaption>
    </figure>
  </div>
</section>

<section class="band--navy ai-band" data-el="home.gaisb" data-el-build="elementor">
  <canvas class="ai-band__canvas" aria-hidden="true"></canvas>
  <div class="wrap section split split--center ai-band__inner">
    <div class="reveal">
      <p class="eyebrow mb-s">GAISB and responsible AI</p>
      <h2 class="h2 mb-m">Responsible innovation, taught properly.</h2>
      <p class="lead mb-l">Through its strategic relationship with the Global AI Standards Body, AFSV VRC is advancing AI education, certification, workforce readiness and responsible innovation across sport, education and community development in Canada and the Caribbean.</p>
      ${btn('Explore AI Education & Partnerships', '/gaisb-ai', 'gold')}
    </div>
    <ul class="ai-band__list reveal">
      ${['AI literacy', 'Professional certification', 'Sport technology', 'Responsible-AI governance', 'Workforce readiness'].map((t, i) => html`<li><span class="num">${pad2(i + 1)}</span>${t}</li>`)}
    </ul>
  </div>
</section>

<section class="wrap section" data-el="home.membership" data-el-build="elementor">
  <div class="section-head reveal">
    <p class="eyebrow mb-s">Join the community</p>
    <h2 class="h2">Become part of the AFSVHCL movement.</h2>
    <p class="body-lg muted">Memberships are proposed to unlock exclusive benefits while funding neurodivergent inclusion programs. Not yet available for purchase.</p>
  </div>
  <div class="tiers" data-stagger>
    ${TIERS.map((t) => html`<article class="tier">
      <div class="tier__top"><h3>${t.name}</h3><span class="pill pill--soft">Proposed</span></div>
      <p class="tier__price"><b>${t.usd}</b> / ${t.cad} <small>per year</small></p>
      <ul class="check-list">${t.items.map((x) => html`<li>${x}</li>`)}</ul>
      <p class="tier__fund">${t.fund}</p>
    </article>`)}
  </div>
  <div class="btn-row mt-l">${btn('Explore membership', '/membership', 'navy')}</div>
</section>

<section class="band--cream" data-el="home.opportunity" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal">
      <p class="eyebrow mb-s">Explore the opportunity</p>
      <h2 class="h2">The future of Canadian sport starts with you.</h2>
      <p class="body-lg muted">Whether you're an athlete, parent, potential partner or community leader, there may be a place for you in this ecosystem. We welcome exploratory conversations.</p>
    </div>
    <div class="opps" data-stagger>
      ${OPPS.map(([ic, t, b, l, u]) => html`<a class="opp" href="${u}">${sketchIcon(ic)}<h3>${t}</h3><p>${b}</p><span class="eco3__more">${l} ${arrow()}</span></a>`)}
    </div>
  </div>
</section>

${formSection({
  id: 'register', el: 'home.register-interest',
  title: 'Register your interest.',
  lead: 'Tell us which pathway matters to you and we will be in touch as programs, membership and facilities are confirmed.',
  note: 'We ask only for what we need to reply. Please do not include diagnoses, medical records or details about a child in this form.',
  form: previewForm({
    fields: [
      { label: 'Name', req: true, auto: 'name' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Interest pathway', type: 'select', req: true, ph: 'Select a pathway', full: true, options: ['Train and develop', 'Become a member', 'Shop the movement', 'Partner with us', 'Neurodiversity access and opportunity', 'Join the service provider network'] },
    ],
    consent: 'I agree to receive occasional updates from AFSV VRC. You can unsubscribe at any time.', consentReq: false,
    submit: 'Register interest',
    status: `${PREVIEW} Submissions will route once mailbox and CRM routing is confirmed.`,
  }),
})}

${ctaBand('Build the future with us.', [{ label: 'Partner with us', route: '/partners' }, { label: 'Contact us', route: '/contact' }], 'home.cta-band')}`,
  };
}


// ════════════════════════ EVENTS ════════════════════════
export function events(d) {
  return {
    title: 'Events',
    description: 'AFSV VRC events, summits and community gatherings — starting with the GAISB AI World Summit 2027 in Port of Spain.',
    body: html`
${breadcrumb([{ label: 'Events' }])}
<section class="wrap page-head" data-el="events.header" data-el-build="elementor">
  <p class="eyebrow">Events</p>
  <h1 class="h1 split-words" aria-label="Where the ecosystem meets."><span aria-hidden="true">${splitWords('Where the ecosystem meets.')}</span></h1>
  <p class="lead measure">Summits, showcases and community gatherings hosted or supported by AFSV VRC. Each event links to its own registration and agenda.</p>
</section>
<section class="wrap section section--flush-top" data-el="events.list" data-el-build="custom-widget">
  <div class="event-list">${d.events.map((e) => eventFeature(e, 'events.card'))}</div>
  <div class="pending mt-l"><span class="eyebrow">More events</span><p>Further events will be listed here as they are confirmed, including program showcases, partner sessions and Whitby Smart Sports Village milestones.</p></div>
</section>
${ctaBand('Want to host or sponsor an event with us?', [{ label: 'Talk to the partnerships team', route: '/partners' }, { label: 'Contact us', route: '/contact' }])}`,
  };
}

// ════════════════════════ ABOUT ════════════════════════
// Portrait or designed monogram for a leader (monogram until an approved portrait is supplied).
function portrait(p, cls = '') {
  return p.img
    ? html`<div class="portrait ${cls}"><img src="${p.img}" alt="${p.alt || 'Portrait of ' + p.name}" width="940" height="1224" loading="lazy"></div>`
    : html`<div class="portrait portrait--mono ${cls}" role="img" aria-label="${p.name} — approved portrait pending"><span class="portrait__initials" aria-hidden="true">${initials(p.name)}</span><span class="portrait__note">Portrait coming soon</span></div>`;
}

const MODEL_ICONS = [
  '<circle cx="12" cy="7" r="3.2"/><path d="M5 20c.6-3.8 3.4-6 7-6s6.4 2.2 7 6"/><path d="M12 14v3"/>',
  '<path d="M4 12h16M12 4v16"/><circle cx="12" cy="12" r="8.5"/>',
  '<path d="M3 20h18M6 20V9l6-5 6 5v11"/><path d="M10 20v-5h4v5"/>',
  '<circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/>',
  '<path d="M4 18l5-6 4 3 7-9"/><path d="M15 6h5v5"/>',
];

export function about(d) {
  const story = [
    { k: 'The belief', t: 'Sport can transform communities', b: 'when it is combined with education, technology and opportunity.' },
    { k: 'The ecosystem', t: 'AFSVHCL™', b: 'An integrated platform combining sports science, education programs, esports engagement and community participation.' },
    { k: 'The pilot', t: 'Whitby Smart Sports Village', b: 'A proposed year-round, technology-enabled destination in Whitby, Ontario.', tag: 'Proposed' },
    { k: 'The network', t: 'Canada, the Caribbean and beyond', b: 'A national network of multi-sport dome facilities and scalable initiatives in global markets.', tag: 'Planned' },
  ];
  return {
    title: 'About Us',
    overlay: true,
    description: 'AFSV VRC Global Development Group Ltd. develops a connected ecosystem that expands opportunity through sport, education, technology and inclusive community programming.',
    ogImage: IMG('life/plaza.jpg'),
    body: html`
<section class="about-hero" data-el="about.hero" data-el-build="elementor">
  <div class="wrap about-hero__grid">
    <div class="about-hero__copy">
      <p class="eyebrow eyebrow-rule">About AFSV VRC</p>
      <h1 class="h1 split-words" aria-label="A new model for sport, learning and community development."><span aria-hidden="true">${splitWords(['A new model for sport,', 'learning and community', 'development.'], ['development.'])}</span></h1>
      <p class="lead">AFSV VRC Global Development Group Ltd. was formed to develop and operate a connected ecosystem that expands opportunity through sport, education, technology and inclusive community programming. Our work begins with a proposed Smart Sports Village pilot in Whitby, Ontario, and extends to partnerships and scalable initiatives in Canada, the Caribbean and global markets.</p>
      <div class="btn-row btn-row--stack">${btn('Meet the leadership', '/leadership', 'gold')}${btn('Our strategic pillars', '/strategic-pillars', 'line-light')}</div>
    </div>
    <div class="collage" aria-hidden="true">
      <div class="collage__a"><div class="pmedia" data-parallax="0.05"><img src="${IMG('life/plaza.jpg')}" alt="" width="1344" height="752" fetchpriority="high"></div></div>
      <div class="collage__b"><div class="pmedia" data-parallax="0.12"><img src="${IMG('life/hall.jpg')}" alt="" width="1344" height="752"></div></div>
      <div class="collage__c"><div class="pmedia" data-parallax="0.18"><img src="${IMG('life/lounge.jpg')}" alt="" width="1344" height="752"></div></div>
      <span class="collage__ring"></span>
    </div>
  </div>
</section>

<section class="wrap section" data-el="about.mission-vision" data-el-build="elementor">
  <div class="mv">
    <article class="mv__card reveal">
      <span class="mv__label">Mission</span>
      <p class="mv__text">To create accessible, technology-enabled environments and pathways that develop athletes, strengthen academic and life outcomes, support diverse learners, and generate lasting value for families and communities.</p>
    </article>
    <article class="mv__card mv__card--dark reveal">
      <span class="mv__label">Vision</span>
      <p class="mv__text">A global network of smart sports villages and connected programs where talent is developed, learning is supported, inclusion is designed in, and communities share in the benefits of sport-led development.</p>
    </article>
  </div>
</section>

<section class="band--cream" data-el="about.story" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal"><h2 class="h2">From a belief to a network.</h2><p class="body-lg muted">How the AFSV VRC model grows, from its founding idea to the proposed Whitby pilot and the planned network beyond it.</p></div>
    <ol class="timeline" data-timeline>
      ${story.map((s, i) => html`
      <li class="timeline__step" style="--i:${i}">
        <span class="timeline__dot" aria-hidden="true"></span>
        <span class="timeline__k">${s.k}${s.tag ? html` <span class="pill">${s.tag}</span>` : ''}</span>
        <h3 class="timeline__t">${s.t}</h3>
        <p>${s.b}</p>
      </li>`)}
    </ol>
  </div>
</section>

<section class="wrap section" data-el="about.model" data-el-build="elementor">
  <h2 class="h2 mb-l reveal">What makes the model different.</h2>
  <div class="model" data-stagger>
    ${d.aboutModel.map((m, i) => html`
    <div class="model__item">
      <svg class="model__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${raw(MODEL_ICONS[i])}</svg>
      <span class="num">${m.num}</span>
      <h3>${m.label}</h3>
    </div>`)}
  </div>
</section>

${aboutExtra()}

<section class="founder" data-el="about.founder" data-el-build="elementor">
  <div class="wrap section founder__grid">
    <figure class="founder__photo wipe">
      <img src="${IMG('martin-lashley.jpg')}" alt="Martin Lashley standing on the turf inside an indoor sports dome." width="940" height="1224" loading="lazy">
      <figcaption><b>Martin Lashley</b>Founder, Chairman &amp; Interim CEO</figcaption>
    </figure>
    <div class="founder__copy reveal">
      <p class="eyebrow">Founder story</p>
      <blockquote class="founder__quote">“We are not building a sports facility. We are building an ecosystem — one that will change the trajectory of thousands of young lives and strengthen communities across Canada and the world.”</blockquote>
      <p class="body-lg">Recognizing the challenges athletes face in Canada's climate, Martin Lashley envisioned a network of high-performance indoor sports environments capable of supporting year-round training while delivering mentorship, academic support and career pathways for young people.</p>
      <p class="founder__sign">Building Today. Inspiring Tomorrow.</p>
      ${btn('Read the founder profile', '/leadership#martin-lashley', 'gold')}
    </div>
  </div>
</section>

<section class="wrap section" data-el="about.leadership" data-el-build="elementor">
  <div class="section-head reveal"><h2 class="h2">The leadership team.</h2><p class="body-lg muted">The people guiding governance, operations and investment across AFSVHCL. <a class="text-link" href="leadership.html">Full profiles ${arrow()}</a></p></div>
  <div class="team" data-stagger>
    ${d.leadership.map((p) => html`
    <a class="team-card" href="leadership.html#${p.slug}">
      ${portrait(p, 'team-card__photo')}
      <span class="team-card__body">
        <span class="team-card__role">${p.role}</span>
        <span class="team-card__name">${p.name}</span>
        <span class="team-card__short">${p.short}</span>
        <span class="team-card__go">View profile ${arrow()}</span>
      </span>
    </a>`)}
  </div>
</section>

${ctaBand('Connect with our team.', [{ label: 'Connect With Our Team', route: '/contact' }, { label: 'Partner with us', route: '/partners' }])}`,
  };
}

// ════════════════════════ LEADERSHIP ════════════════════════
export function leadership(d) {
  return {
    title: 'Leadership',
    overlay: true,
    description: 'Meet the leadership of Athletes & Fans Sports Village Holding Company Limited (AFSVHCL) and AFSV VRC.',
    ogImage: IMG('martin-lashley.jpg'),
    body: html`
<section class="lead-hero" data-el="leadership.hero" data-el-build="elementor">
  <div class="wrap lead-hero__inner">
    <p class="eyebrow eyebrow-rule">Leadership team</p>
    <h1 class="h1 split-words" aria-label="The team behind the vision."><span aria-hidden="true">${splitWords(['The team behind', 'the vision.'], ['vision.'])}</span></h1>
    <p class="lead">AFSVHCL™ is led by a dedicated team of entrepreneurs, community builders, and visionaries committed to transforming youth sports, education, and community development in Canada and beyond.</p>
    <nav class="lead-chips" aria-label="Leaders">
      ${d.leadership.map((p) => html`<a href="#${p.slug}">${portrait(p, 'lead-chips__img')}<span><b>${p.name}</b><small>${p.role}</small></span></a>`)}
    </nav>
  </div>
</section>

${d.leadership.map((p, i) => html`
<section class="profile${i % 2 ? ' profile--alt' : ''}" id="${p.slug}" data-el="leadership.profile" data-el-build="elementor" aria-labelledby="${p.slug}-name">
  <div class="wrap section profile__grid">
    <div class="profile__aside${p.focus || p.venture || p.motto ? ' profile__aside--stack' : ''}">
      <div class="profile__sticky">
        ${portrait(p, 'profile__photo wipe')}
        <div class="profile__id">
          <span class="num">${pad2(i + 1)} / ${pad2(d.leadership.length)}</span>
          <h2 class="profile__name" id="${p.slug}-name">${p.name}</h2>
          <p class="profile__role">${p.role}</p>
        </div>
      </div>
      ${p.focus ? html`<div class="profile__focus" data-stagger>${p.focus.map((f) => html`<div><b>${f.t}</b><span>${f.d}</span></div>`)}</div>` : ''}
      ${p.venture || p.motto || p.mission ? html`
      <div class="profile__panel reveal">
        ${p.motto ? html`<div class="profile__motto"><b>${p.motto.t}</b><span>${p.motto.d}</span></div>` : ''}
        ${p.strengths ? html`<ul class="profile__strengths">${p.strengths.map((t) => html`<li><img src="${t.img}" alt="" width="400" height="600" loading="lazy"><span>${t.t}</span></li>`)}</ul>` : ''}
        ${p.venture ? html`<div class="profile__venture"><span class="profile__venture-mark" aria-hidden="true">${p.venture.name.charAt(0)}</span><div><small>${p.venture.kicker}</small><b>${p.venture.name}</b><span>${p.venture.desc}</span></div></div>` : ''}
        ${p.mission ? html`<div class="profile__mission"><small>Our mission</small><p>${p.mission}</p></div>` : ''}
        ${p.tagline ? html`<p class="profile__tagline">${p.tagline}</p>` : ''}
      </div>` : ''}
    </div>
    <div class="profile__main">
      <p class="profile__short reveal">${p.short}</p>
      ${p.quote ? html`<figure class="profile__quote reveal"><blockquote>${p.quote}</blockquote><figcaption>${p.quoteBy}</figcaption></figure>` : ''}
      <div class="profile__bio reveal">${(p.story || p.bio).map((para) => html`<p>${para}</p>`)}${p.story ? p.bio.map((para) => html`<p>${para}</p>`) : ''}</div>
    </div>
  </div>
</section>`)}

${ctaBand('Work with the team building AFSV VRC.', [{ label: 'Partner with us', route: '/partners' }, { label: 'Contact us', route: '/contact' }])}`,
  };
}

// ════════════════════════ STRATEGIC PILLARS ════════════════════════
export function pillars(d) {
  return {
    title: 'Strategic Pillars',
    description: 'Four pillars, one purpose: sports development, education and academic success, neurodivergent support and inclusive education, and life skills.',
    ogImage: IMG('life/hall.jpg'),
    body: html`
${breadcrumb([{ label: 'About', route: '/about' }, { label: 'Strategic Pillars' }])}
<section class="wrap page-head" data-el="pillars.hero" data-el-build="elementor">
  <p class="eyebrow">Strategic Pillars</p>
  <h1 class="h1 split-words" style="max-width:20ch;margin-bottom:44px" aria-label="Four pillars. One purpose: helping people thrive."><span aria-hidden="true">${splitWords('Four pillars. One purpose: helping people thrive.')}</span></h1>
  <figure class="figure figure--21x9 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('life/hall.jpg'), alt: 'Concept rendering: racially diverse youth athletes training basketball, sprints and futsal in a busy multi-sport hall at night, with coaches cheering them on.', w: 1344, h: 752 })}</figure>
</section>
<section class="wrap section section--flush-top" data-el="pillars.grid" data-el-build="elementor">
  <div class="hairline" style="--min:330px" data-stagger>
    ${d.pillars4.map((p) => html`
    <a class="cell cell--link" href="${href(p.href)}" style="padding:42px 36px 44px;gap:20px">
      <span class="num">${p.num}</span>
      <h2 style="font-weight:700;font-size:clamp(21px,1.8vw,26px);line-height:1.2">${p.title}</h2>
      <p style="font-size:15.5px">${p.body}</p>
      ${p.caveat ? html`<p class="note" style="padding:13px 15px;font-size:13.5px">${p.caveat}</p>` : ''}
      <span class="cell__foot">${p.linkLabel} ${arrow()}</span>
    </a>`)}
  </div>
</section>
<section class="band--navy" data-el="pillars.together" data-el-build="elementor">
  <div class="wrap section split split--center">
    <h2 class="h2 reveal">How they work together.</h2>
    <div class="reveal">
      <p class="lead mb-l">Every program should connect athletic participation with at least one broader development outcome.</p>
      ${btn('Explore Programs and Partnerships', '/programs', 'gold')}
    </div>
  </div>
</section>`,
  };
}

// ════════════════════════ WHITBY ════════════════════════
// Whitby facilities, from the AFSV VRC Whitby Smart Sports Village facility mockup.
const WH_FACILITIES = [
  { img: 'dome', name: 'Multi-Sport Inflatable Dome', line: 'A proposed 150,000 sq ft dome for year-round training under one roof.', items: ['Full-size, competition-quality soccer field', 'Indoor track', 'Cricket nets', 'Multi-sport courts'] },
  { img: 'soccer', name: 'Soccer Fields', line: 'Outdoor pitches for training and match play.', items: ['Outdoor training fields'] },
  { img: 'cricket', name: 'Cricket Facility', line: 'Dedicated nets and turf for the cricket pathway.', items: ['Practice nets', 'Turf training pitches'] },
  { img: 'track', name: 'Track & Field', line: 'A full athletics venue for sprint, jump and throw.', items: ['400m track', 'Sprint lanes', 'Long jump / triple jump', 'Shot put / discus'] },
  { img: 'basketball', name: 'Basketball Courts', line: 'Indoor and outdoor courts for play and development.', items: ['Indoor & outdoor courts', 'Skill development programs'] },
  { img: 'hp', name: 'High Performance Training Centre', line: 'Elite training for peak performance.', items: ['Strength & conditioning', 'Sports science lab', 'Recovery & rehab', 'Athlete development programs'] },
  { img: 'esports', name: 'Esports Competition Studio', line: 'Compete. Stream. Connect. The future is digital.', items: ['80–120 gaming stations (proposed)', 'Tournament stage', 'Streaming control centre', 'Content creation lab'] },
  { img: 'learn', name: 'Learning & Mentorship Centre', line: 'Education today. Leaders tomorrow.', items: ['Classrooms', 'Tutoring & mentorship', 'Special needs support programs', 'Life skills development'] },
  { img: 'media', name: 'Media & Broadcasting Studio', line: 'Where athlete stories are told.', items: ['Podcast & livestream studios', 'Sports Village Podcast Network', 'Athlete media content hub'] },
  { img: 'spectators', name: 'Spectator Seating & Events', line: 'A community venue for big nights.', items: ['Competitions & showcases', 'Public programming', 'Community events'] },
  { img: 'lounge', name: 'Community Lounge', line: 'A space for families, partners and communities.', items: ['Family & partner hospitality', 'Community gatherings'] },
];
const WH_HIGHLIGHTS = ['Year-round training', 'State-of-the-art infrastructure', 'Multi-sport development', 'Education & mentorship', 'Special needs inclusion', 'Esports & innovation', 'Community engagement', 'Sustainable & green design'];
const WH_FEATURES = ['Serving athletes of all ages', 'Inclusive programs for every ability', 'Pathways to scholarships & careers', 'Building stronger communities', 'Connecting the Caribbean diaspora', 'Creating a legacy for generations'];
const WH_ECOSYSTEM = [
  { name: 'AFSV VRC Development Group Ltd.', role: 'Infrastructure development' },
  { name: 'MLMSR Mentorship LLC', role: 'Education & special needs support' },
  { name: 'EFN — Esports & Fans Network', role: 'Digital & esports division' },
];

export function whitby(d) {
  return {
    title: 'Whitby Smart Sports Village',
    description: 'A proposed year-round, technology-enabled destination in Whitby, Ontario bringing multi-sport participation, athlete development, education, inclusive supports, media and community under one roof.',
    ogImage: IMG('whitby-dome.jpg'),
    body: html`
${breadcrumb([{ label: 'Smart Sports Village' }, { label: 'Whitby Smart Sports Village' }])}
<section class="wrap page-head" data-el="whitby.hero" data-el-build="elementor" style="padding-bottom:0">
  <span class="pill mb-m">Proposed development</span>
  <h1 class="h1 split-words" style="max-width:22ch" aria-label="The Whitby Smart Sports Village: a connected place to train, learn and belong."><span aria-hidden="true">${splitWords('The Whitby Smart Sports Village: a connected place to train, learn and belong.')}</span></h1>
  <p class="lead measure mb-l">AFSV VRC is advancing a proposed Smart Sports Village pilot in Whitby, Ontario: a year-round, technology-enabled destination bringing multi-sport participation, athlete development, education, inclusive supports, media and community experiences under one roof.</p>
  <figure class="figure figure--16x9 figure--motion wipe">${pmedia({ img: IMG('whitby-dome.jpg'), alt: 'Conceptual rendering: a large white inflatable sports dome carrying the AFSV VRC crest, with a glass-fronted entrance pavilion, landscaped plaza, accessible parking and people arriving, and a lake on the horizon. Not an existing facility.', parallax: 0.05, eager: true, w: 1600, h: 900 })}
    <figcaption class="caption-bar">Conceptual Rendering — Not an Existing Facility</figcaption>
  </figure>
</section>
<section class="wrap section" data-el="whitby.concept" data-el-build="elementor">
  <h2 class="h2 mb-l reveal">Concept at a glance.</h2>
  <div class="hairline" style="--min:300px" data-stagger>
    ${d.whitbyConcept.map((c) => html`
    <div class="cell" style="min-height:190px">
      <div class="cell__top"><span class="eyebrow" style="font-size:11px;letter-spacing:.16em">${c.label}</span>${c.tag ? html`<span class="pill" style="font-size:9.5px;padding:4px 8px">${c.tag}</span>` : ''}</div>
      <p style="font-family:var(--font-display);font-weight:600;font-size:17px;line-height:1.44">${c.body}</p>
    </div>`)}
  </div>
</section>
${whitbyOverview()}
<section class="wh-plan" data-el="whitby.site-plan" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal">
      <p class="eyebrow mb-s">Site plan</p>
      <h2 class="h2">One village. Endless opportunities. A global impact.</h2>
      <p class="body-lg muted">Building the future of youth sports, education and community development in Whitby, Ontario.</p>
    </div>
    <figure class="figure figure--16x9 wh-plan__figure wipe">
      <img src="${IMG('whitby/site-aerial.jpg')}" alt="Conceptual night aerial of the proposed village: the white multi-sport dome with lit A, F, S, V roof panels, outdoor basketball courts, a cluster of training, esports and learning buildings around a plaza with a globe sculpture, floodlit soccer and cricket fields, a red running track and a pond with a fountain. Not an existing facility." width="1920" height="1080" loading="lazy">
      <figcaption class="caption-bar">Conceptual Rendering — Not an Existing Facility</figcaption>
    </figure>
    <ul class="wh-pillars" aria-label="Village focus">${['Sports excellence', 'Education & mentorship', 'Inclusion', 'Innovation', 'Global community'].map((t) => html`<li>${t}</li>`)}</ul>
  </div>
</section>
<section class="band--cream" data-el="whitby.facilities" data-el-build="custom-widget">
  <div class="wrap section">
    <div class="section-head reveal">
      <p class="eyebrow mb-s">Proposed facilities</p>
      <h2 class="h2">Everything an athlete, student and family needs.</h2>
    </div>
    <div class="wh-fac" data-stagger>
      ${WH_FACILITIES.map((f, i) => html`
      <article class="wh-fac__card">
        <figure><img src="${IMG(`whitby/${f.img}.jpg`)}" alt="Conceptual rendering of the proposed ${f.name.toLowerCase()}. Not an existing facility." width="1200" height="800" loading="lazy"></figure>
        <div class="wh-fac__body">
          <div class="wh-fac__top"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="pill pill--soft">Proposed</span></div>
          <h3 class="h3">${f.name}</h3>
          <p class="muted">${f.line}</p>
          <ul>${f.items.map((x) => html`<li>${x}</li>`)}</ul>
        </div>
      </article>`)}
    </div>
  </div>
</section>
${whitbyRoadmap()}
<section class="band--navy" data-el="whitby.highlights" data-el-build="elementor">
  <div class="wrap section wh-hl">
    <div class="reveal">
      <p class="eyebrow mb-s">Facility highlights</p>
      <h2 class="h2 mb-m">Built for every stage of the journey.</h2>
      <ul class="wh-ticks wh-ticks--grid">${WH_HIGHLIGHTS.map((t) => html`<li>${t}</li>`)}</ul>
    </div>
    <div class="wh-hl__card reveal">
      <p class="eyebrow mb-s">Key features</p>
      <ul class="wh-ticks">${WH_FEATURES.map((t) => html`<li>${t}</li>`)}</ul>
    </div>
  </div>
</section>
<section class="wrap section" data-el="whitby.ecosystem" data-el-build="elementor">
  <div class="wh-eco">
    <div class="reveal">
      <p class="eyebrow mb-s">AFSVHCL ecosystem</p>
      <h2 class="h2 mb-m">Three divisions, one village.</h2>
      <ol class="wh-eco__list">${WH_ECOSYSTEM.map((e) => html`<li><b>${e.name}</b><span>${e.role}</span></li>`)}</ol>
    </div>
    <blockquote class="wh-quote reveal">
      <p>Empowering youth. Strengthening communities. Building a legacy.</p>
      <footer><b>Martin Lashley</b><span>Founder &amp; Chairman, AFSV VRC</span></footer>
    </blockquote>
  </div>
</section>
<section class="band--navy" data-el="whitby.smart" data-el-build="elementor">
  <div class="wrap section split split--center">
    <div class="reveal">
      <p class="eyebrow mb-s">Smart by design</p>
      <h2 class="h2 mb-m">Technology as infrastructure, not decoration.</h2>
      <p class="lead">Digital access, secure connectivity, facility sensors, automation, data-informed programming, modern signage and emerging technology—subject to privacy, security, design and procurement.</p>
    </div>
    <figure class="figure figure--16x9 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('life/cutaway.jpg'), alt: 'Concept rendering: a cutaway of the proposed dome at blue hour showing the floodlit pitch, running track, courts, a learning mezzanine and an esports studio, with crowds inside. Not an existing facility.', w: 1344, h: 752 })}
      <figcaption class="caption-bar">Conceptual Rendering — Not an Existing Facility</figcaption>
    </figure>
  </div>
</section>
<section class="wrap section" data-el="whitby.partnerships" data-el-build="elementor">
  <div class="split">
    <div class="reveal">
      <h2 class="h2 mb-m">Partnership pathways.</h2>
      <p class="body-lg muted mb-m">Seven routes into the pilot, from municipal partners to retail and concessions.</p>
      <div class="btn-row btn-row--stack">
        ${btn('Become a Development Partner', '#whitby-partner-form', 'navy')}
        ${btn('Request the Project Brief', '#whitby-partner-form', 'line-dark')}
      </div>
    </div>
    ${numberedRows(d.whitbyPartners)}
  </div>
</section>
<section class="wrap" data-el="whitby.disclaimer" data-el-build="elementor">
  <div class="callout" role="note"><span class="eyebrow">Important</span><p style="font-size:15.5px;line-height:1.66">The Whitby Smart Sports Village is a proposed development. Images, dimensions, uses, timelines, partnerships and features shown are conceptual and subject to feasibility, approvals, financing, final design and operating agreements.</p></div>
</section>
${formSection({
  id: 'whitby-partner-form', el: 'whitby.partner-form',
  title: 'Request the project brief.',
  lead: 'Tell us how your organisation would work with the pilot and we will share the current project materials.',
  note: 'Development preview — no documents are distributed from this form until the project brief is approved for release.',
  form: previewForm({
    fields: [
      { label: 'Name', req: true, auto: 'name' },
      { label: 'Organisation', req: true, auto: 'organization' },
      { label: 'Role', req: true, auto: 'organization-title' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Phone', type: 'tel', auto: 'tel' },
      { label: 'Partnership type', type: 'select', req: true, ph: 'Select a type', options: d.whitbyPartners },
      { label: 'Message', type: 'textarea', req: true, full: true },
    ],
    consent: 'I agree to be contacted about partnership opportunities with AFSV VRC.',
    submit: 'Submit request',
    status: `${PREVIEW} Submissions will route to the partnerships inbox once confirmed.`,
  }),
})}`,
  };
}

// ════════════════════════ FACILITIES ════════════════════════
export function facilities(d) {
  const groups = ['sport', 'performance', 'learning', 'inclusive', 'media', 'retail'];
  const filterKeys = ['all', ...groups];
  return {
    title: 'Facilities',
    description: 'The proposed Smart Sports Village is being designed around adaptable spaces for sport, education, innovation, inclusion and community use.',
    ogImage: IMG('life/cutaway.jpg'),
    body: html`
${breadcrumb([{ label: 'Smart Sports Village', route: '/whitby-smart-sports-village' }, { label: 'Facilities' }])}
<section class="wrap page-head" data-el="facilities.header" data-el-build="elementor">
  <div class="split split--end">
    <div>
      <p class="eyebrow mb-s">Facilities</p>
      <h1 class="h1 mb-m split-words" aria-label="Flexible spaces for performance, learning and community."><span aria-hidden="true">${splitWords('Flexible spaces for performance, learning and community.')}</span></h1>
      <p class="lead measure">The proposed Smart Sports Village is being designed around adaptable spaces for sport, education, innovation, inclusion and community use. Final configuration is subject to design development, approvals and partner requirements.</p>
    </div>
    <figure class="figure figure--16x10 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('life/cutaway.jpg'), alt: 'Concept rendering: a cutaway of the proposed dome at blue hour showing the floodlit pitch, running track, courts, a learning mezzanine and an esports studio, with crowds inside. Not an existing facility.', w: 1344, h: 752 })}
      <figcaption class="caption-bar">Conceptual Rendering — Not an Existing Facility</figcaption>
    </figure>
  </div>
</section>
<section class="band--cream" data-el="facilities.cards" data-el-build="custom-widget">
  <div class="wrap section">
    <div class="filter-row" role="group" aria-label="Filter facilities">
      ${d.facilityFilters.map((f, i) => html`<button type="button" class="chip" data-fac-filter="${filterKeys[i]}" aria-pressed="${i === 0 ? 'true' : 'false'}">${f}</button>`)}
    </div>
    <p id="facility-count" class="sr-only" aria-live="polite"></p>
    <div class="cards" style="--min:320px;gap:24px" data-stagger>
      ${d.facilityCards.map((c, i) => html`
      <article class="cell facility-card" data-group="${groups[i]}" style="border:1px solid var(--line);min-height:250px">
        <div class="cell__top"><span class="num">${c.num}</span><span class="pill pill--soft">Availability coming soon</span></div>
        <h2 class="h3">${c.title}</h2>
        <p style="margin-bottom:auto">${c.body}</p>
        <p class="small muted">Capacity, amenities and accessibility details pending approval.</p>
      </article>`)}
    </div>
  </div>
</section>
${formSection({
  id: 'facility-updates', el: 'facilities.form',
  title: 'Register for facility updates.',
  lead: 'We will let you know as spaces, schedules and availability are confirmed.',
  note: 'Tell us only what helps us plan. Please do not include diagnoses, medical records or details about a child.',
  form: previewForm({
    fields: [
      { label: 'Name', req: true, auto: 'name' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Phone', type: 'tel', auto: 'tel' },
      { label: 'Organisation', auto: 'organization' },
      { label: 'Facility interest', type: 'select', req: true, ph: 'Select a facility', options: d.facilityCards.map((c) => c.title) },
      { label: 'Sport or intended use' },
      { label: 'Group size' },
      { label: 'Timeframe' },
      { label: 'Accessibility needs', type: 'textarea', rows: 3, full: true, hint: 'Tell us what would make a space work for you. No diagnosis or medical detail is needed.' },
    ],
    consent: 'I agree to receive facility updates from AFSV VRC. You can unsubscribe at any time.',
    submit: 'Register for Facility Updates',
    status: `${PREVIEW} Submissions will route once inventory and mailbox routing are confirmed.`,
  }),
})}`,
  };
}

// ════════════════════════ MEMBERSHIP ════════════════════════
export function membership(d) {
  const paths = d.memberPathways.map((m) => m.label);
  return {
    title: 'Membership',
    description: 'Register your interest in AFSV VRC membership — athlete, family, supporter, educator & coach, and corporate & community partner pathways.',
    ogImage: IMG('life/lounge.jpg'),
    body: html`
${breadcrumb([{ label: 'Membership' }])}
<section class="wrap page-head" data-el="membership.hero" data-el-build="elementor">
  <div class="split split--center">
    <div>
      <span class="pill mb-m">Registration of interest only</span>
      <h1 class="h1 split-words" aria-label="Join the AFSV VRC community."><span aria-hidden="true">${splitWords('Join the AFSV VRC community.')}</span></h1>
      <p class="lead measure mb-l">Membership will connect athletes, families, supporters, educators, partners and community members to AFSV VRC programs, experiences and opportunities. Register your interest to receive approved launch updates and help shape the experience.</p>
      ${btn('Register Your Interest', '#membership-form', 'navy')}
    </div>
    <figure class="figure figure--4x3 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('life/lounge.jpg'), alt: 'Concept rendering: racially diverse members cheering together in a fan lounge overlooking a floodlit pitch inside the dome.', w: 1344, h: 752 })}</figure>
  </div>
</section>
<section class="band--cream" data-el="membership.pathways" data-el-build="elementor">
  <div class="wrap section">
    <h2 class="h2 mb-l reveal">Proposed pathways.</h2>
    <div class="hairline" style="--min:220px" data-stagger>
      ${d.memberPathways.map((m) => html`
      <div class="cell" style="min-height:196px">
        <div class="cell__top"><span class="num">${m.num}</span><span class="pill pill--soft">Proposed</span></div>
        <h3 class="h3" style="font-size:20px;margin-bottom:auto">${m.label}</h3>
        <p class="small muted">Benefits and pricing pending approval.</p>
      </div>`)}
    </div>
  </div>
</section>
${membershipExtra()}
${formSection({
  id: 'membership-form', el: 'membership.form',
  title: 'Register your interest.',
  lead: 'This is not a purchase. Membership details, benefits and launch timing will be shared as they are approved.',
  note: 'Accommodation requests are optional and free-text. Please do not include a diagnosis or medical records.',
  form: previewForm({
    fields: [
      { label: 'First name', req: true, auto: 'given-name' },
      { label: 'Last name', req: true, auto: 'family-name' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Mobile', type: 'tel', auto: 'tel' },
      { label: 'City or region', req: true, auto: 'address-level2' },
      { label: 'Country', req: true, auto: 'country-name' },
      { label: 'Membership pathway', type: 'select', req: true, ph: 'Select a pathway', options: paths },
      { label: 'Sports or interests' },
      { label: 'Age group', type: 'select', ph: 'Prefer not to say', options: ['Under 18', '18–24', '25–39', '40–59', '60+'] },
      { label: 'Preferred communication channel', type: 'select', req: true, ph: 'Select a channel', options: ['Email', 'Phone', 'Text message'] },
      { label: 'Accessibility or accommodation request', type: 'textarea', rows: 3, full: true },
    ],
    consent: 'I agree to receive membership updates from AFSV VRC. You can unsubscribe at any time.',
    submit: 'Register Your Interest',
    statusTitle: 'Thank you for joining the AFSV VRC interest list.',
    status: 'We will share membership details, benefits and launch timing as they are approved.',
  }),
})}`,
  };
}

// ════════════════════════ CONTACT ════════════════════════
export function contact(d) {
  return {
    title: 'Contact',
    description: 'Contact AFSV VRC — athletes, families, educators, coaches, sponsors, investors, vendors and community organizations.',
    body: html`
${breadcrumb([{ label: 'Contact' }])}
<section class="wrap page-head" data-el="contact.header" data-el-build="elementor">
  <p class="eyebrow">Contact</p>
  <h1 class="h1 split-words" aria-label="Let’s build what comes next."><span aria-hidden="true">${splitWords('Let’s build what comes next.')}</span></h1>
  <p class="lead" style="max-width:68ch">Whether you are an athlete, family, educator, coach, sponsor, investor, vendor or community organization, we welcome the opportunity to explore how you can take part.</p>
</section>
${contactExtra()}
<section class="wrap section section--flush-top" data-el="contact.form" data-el-build="plugin">
  <div class="split split--contact">
    ${previewForm({
      fields: [
        { label: 'Name', req: true, auto: 'name' },
        { label: 'Organisation', auto: 'organization' },
        { label: 'Email', type: 'email', req: true, auto: 'email' },
        { label: 'Phone', type: 'tel', auto: 'tel' },
        { label: 'City and country', req: true },
        { label: 'Preferred response method', type: 'select', req: true, ph: 'Select a method', options: ['Email', 'Phone call'] },
        { label: 'Inquiry category', type: 'select', req: true, ph: 'Select a category', full: true, options: d.contactCategories },
        { label: 'Message', type: 'textarea', req: true, rows: 5, full: true, hint: 'Please do not include health records or diagnoses. Sensitive information is handled through a separate approved secure process.' },
      ],
      consent: 'I agree to AFSV VRC contacting me about this inquiry.',
      submit: 'Contact AFSV VRC',
      statusTitle: 'Thank you for contacting AFSV VRC.',
      status: 'Your inquiry has been received and will be directed to the appropriate team member.',
    })}
    <aside class="callout" data-el="contact.org-info" data-el-build="elementor" style="border-color:var(--line)">
      <h2 class="eyebrow" style="font-size:11px;margin-bottom:18px">Organisation</h2>
      <p style="font-family:var(--font-display);font-weight:700;font-size:19px;line-height:1.3;margin-bottom:8px">${SITE.legal}</p>
      <p class="small mb-m">afsvvrc.com</p>
      <div style="border-top:1px solid var(--line);padding-top:22px">
        <span class="pill mb-s">Pending</span>
        <p class="small">A public inquiry mailbox will be published once routing is confirmed. Use the form and your inquiry will reach the right team.</p>
      </div>
      <div style="border-top:1px solid var(--line);padding-top:22px;margin-top:22px">
        <h3 class="eyebrow" style="font-size:11px;margin-bottom:12px">Looking for something specific?</h3>
        <ul class="dash-list small">
          <li><a href="partners.html#partner-form">Partnership, sponsorship or investor inquiry</a></li>
          <li><a href="marketplace.html#vendor-form">Become a marketplace vendor</a></li>
          <li><a href="service-provider-network.html#interest">Join the service provider network</a></li>
          <li><a href="accessibility.html">Accessibility or privacy request</a></li>
        </ul>
      </div>
    </aside>
  </div>
</section>`,
  };
}

// ════════════════════════ PARTNERS ════════════════════════
export function partners(d) {
  const types = d.partnerRoutes.map((r) => r.label);
  return {
    title: 'Partners, Sponsors & Investors',
    description: 'Build the future with AFSV VRC — partnership routes for municipalities, education, sport, inclusion, technology, corporate sponsorship, community development and capital.',
    ogImage: IMG('life/suite.jpg'),
    body: html`
${breadcrumb([{ label: 'Partners, Sponsors & Investors' }])}
<section class="wrap page-head" data-el="partners.hero" data-el-build="elementor">
  <p class="eyebrow">Partners, sponsors &amp; investors</p>
  <h1 class="h1 split-words" style="max-width:20ch" aria-label="Build the future with AFSV VRC."><span aria-hidden="true">${splitWords('Build the future with AFSV VRC.')}</span></h1>
  <p class="lead mb-l" style="max-width:66ch">AFSV VRC’s model depends on aligned partners across municipalities, education, sport, inclusion, technology, corporate sponsorship, community development and capital.</p>
  <div class="btn-row btn-row--stack mb-l">
    ${btn('Become a Partner', '#partner-form', 'navy')}
    ${btn('Request Sponsorship Information', '#partner-form', 'line-dark', 'data-preselect="partner-type=Corporate sponsor"')}
    ${btn('Request Project Brief', '#partner-form', 'line-dark', 'data-preselect="partner-type=Development and infrastructure"')}
    ${btn('Investor Inquiry', '#partner-form', 'line-dark', 'data-preselect="partner-type=Investor inquiry"')}
  </div>
  <figure class="figure figure--21x9 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('life/suite.jpg'), alt: 'Concept rendering: racially diverse partners shaking hands in a glass suite overlooking a packed pitch on match night.', w: 1344, h: 752 })}</figure>
</section>
<section class="wrap section section--flush-top" data-el="partners.sections" data-el-build="elementor">
  <div class="hairline" style="--min:300px" data-stagger>
    ${d.partnerSections.map((s) => html`<div class="cell"><span class="num">${s.num}</span><h2 class="h3">${s.title}</h2><p>${s.body}</p></div>`)}
  </div>
</section>
<section class="band--navy" data-el="partners.routes" data-el-build="elementor">
  <div class="wrap section split">
    <div class="reveal"><h2 class="h2 mb-m">Audience routes.</h2><p class="body-lg">Each route reaches a different team. Investor inquiries are handled by restricted recipients.</p></div>
    ${numberedRows(types)}
  </div>
</section>
${partnersExtra()}
<section class="wrap section" data-el="partners.directory" data-el-build="elementor">
  <h2 class="h2 mb-s reveal">Approved partners</h2>
  <p class="body-lg mb-l" style="max-width:70ch">No organisation is listed as a partner without written authorization. Further logos will appear here as permissions are confirmed.</p>
  <ul class="logo-wall" data-stagger>
    <li class="logo-wall__item logo-wall__item--dark"><a href="gaisb-ai.html"><img src="${IMG('partners/gaisb-ai-world-summit-2027.svg')}" alt="GAISB AI World Summit 2027" width="576" height="120" loading="lazy"></a></li>
    <li class="logo-wall__item logo-wall__item--pending"><span>More partners to be announced</span></li>
  </ul>
</section>
<section class="wrap" data-el="partners.disclaimer" data-el-build="elementor">
  <div class="callout" role="note"><span class="eyebrow">Investor information</span><p style="font-size:15.5px;line-height:1.66">All investment information is high level and informational. AFSV VRC does not publish returns, offering terms, securities availability, valuations or solicitations. Nothing on this page constitutes an offer to sell or a solicitation to buy securities in any jurisdiction.</p></div>
</section>
${formSection({
  id: 'partner-form', el: 'partners.form',
  title: 'Request materials.',
  lead: 'Tell us how your organisation would work with AFSV VRC and we will route your inquiry to the right team.',
  note: 'Investor inquiries are directed to restricted internal recipients. No offering documents are distributed from this form.',
  form: previewForm({
    fields: [
      { label: 'Name', req: true, auto: 'name' },
      { label: 'Organisation', req: true, auto: 'organization' },
      { label: 'Title', req: true, auto: 'organization-title' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Phone', type: 'tel', auto: 'tel' },
      { label: 'Country', req: true, auto: 'country-name' },
      { label: 'Inquiry type', type: 'select', req: true, ph: 'Select a type', options: types, id: 'partner-type' },
      { label: 'Sector' },
      { label: 'Budget range' },
      { label: 'Contribution or interest', type: 'textarea', req: true, rows: 2, full: true },
      { label: 'Message', type: 'textarea', req: true, full: true },
    ],
    consent: 'I agree to AFSV VRC contacting me about this inquiry.',
    submit: 'Submit inquiry',
    status: `${PREVIEW} Inquiries will route by type once owners and mailbox routing are confirmed; investor inquiries route to restricted recipients.`,
  }),
})}`,
  };
}

// ════════════════════════ TYPE A CONTENT PAGES ════════════════════════
export function contentPage(d, route) {
  const c = d.content[route];
  return {
    title: c.kicker,
    description: c.lead,
    ogImage: c.img,
    body: html`
${breadcrumb([{ label: c.group }, { label: c.kicker }])}
${pageHero({ kicker: c.kicker, h1: c.h1, lead: c.lead, ctas: c.ctas, img: c.img, alt: c.alt, video: V[c.video] })}
${c.note ? note(c.note) : ''}
<section class="wrap section" data-el="page.list-primary" data-el-build="elementor">
  <div class="section-head reveal" style="align-items:start"><h2 class="h2">${c.listTitle}</h2><p class="body-lg muted">${c.listLead}</p></div>
  ${numberedCells(c.list)}
</section>
${c.blocksTitle ? html`
<section class="band--cream" data-el="page.blocks" data-el-build="elementor">
  <div class="wrap section">
    <h2 class="h2 mb-l reveal" style="max-width:26ch">${c.blocksTitle}</h2>
    <div class="hairline" style="--min:260px" data-stagger>
      ${c.blocks.map((b) => html`<div class="cell" style="min-height:240px;padding:34px 28px 38px"><span class="num">${b.num}</span><h3 class="h3">${b.title}</h3><p style="font-size:15.5px">${b.body}</p></div>`)}
    </div>
  </div>
</section>` : ''}
${c.list2Title ? html`
<section class="band--navy" data-el="page.list-secondary" data-el-build="elementor">
  <div class="wrap section split">
    <div class="reveal"><h2 class="h2 mb-m">${c.list2Title}</h2><p class="body-lg" style="color:#E7E4DC;max-width:46ch">${c.list2Lead}</p></div>
    ${numberedRows(c.list2)}
  </div>
</section>` : ''}
${c.list3Title ? html`
<section class="wrap section section--flush-bottom" data-el="page.list-tertiary" data-el-build="elementor">
  <h2 class="h2 h2--sm mb-m reveal">${c.list3Title}</h2>
  <ul class="tags">${c.list3.map((l) => html`<li>${l}</li>`)}</ul>
</section>` : ''}
${EXTRAS[route] ? EXTRAS[route](d) : ''}
${formSection({
  id: 'interest', title: c.form.title, lead: c.form.lead, note: c.form.note,
  form: previewForm({
    fields: fromDesignFields(c.form.fields),
    consent: 'I agree to be contacted about this inquiry and to receive occasional updates from AFSV VRC. You can unsubscribe at any time.',
    submit: 'Submit inquiry',
    status: `${PREVIEW} On the live site it routes to a named owner and sends an automatic confirmation.`,
  }),
})}
${pendingInputs()}
${ctaBand(c.ctaHead, [{ label: c.ctaLabel, route: c.ctaHref }])}`,
  };
}

// ════════════════════════ NEWS ════════════════════════
export function news(d) {
  return {
    title: 'News, Stories & Impact',
    description: 'A controlled publishing framework for AFSV VRC updates, stories, approved milestones and verified impact.',
    ogImage: IMG('life/academy.jpg'),
    body: html`
${breadcrumb([{ label: 'About', route: '/about' }, { label: 'News, Stories & Impact' }])}
${pageHero({
  kicker: 'News, Stories & Impact', h1: 'Progress, People and Community Impact',
  lead: 'A controlled publishing framework for updates, stories, approved milestones and verified impact. Nothing is published without editorial approval, and nothing about a person is published without their documented consent.',
  ctas: [{ label: 'Read Updates', href: '#updates' }, { label: 'Share a Story', href: '#story' }, { label: 'Partner With Us', href: '/partners' }],
  img: IMG('life/academy.jpg'), alt: 'Concept rendering: racially diverse boys and girls doing passing drills at night inside the dome while parents watch.',
})}
${note('Consent is mandatory for stories, photographs, testimonials and identifying information, with enhanced safeguards for minors and vulnerable people. Sharing a story below is an expression of interest and a consent to be contacted — it is not publication consent. Editorial approval and formal media releases happen separately.')}
<section class="wrap section" id="updates" data-el="news.types" data-el-build="custom-widget">
  <div class="section-head reveal" style="align-items:start"><h2 class="h2">Content types.</h2><p class="body-lg muted">Ten types, each with its own review path. The archive is empty until the first entry is approved — no sample stories are published here.</p></div>
  <div class="hairline list-cells" data-stagger>
    ${d.newsTypes.map((l) => html`<div class="cell"><div class="cell__top"><span class="num">${l.num}</span><span class="pill pill--soft">Draft</span></div><span>${l.label}</span></div>`)}
  </div>
</section>
<section class="band--cream" data-el="news.directory" data-el-build="custom-widget">
  <div class="wrap section split">
    <div class="reveal"><h2 class="h2 mb-m">Partner directory.</h2><p class="body-lg mb-s measure-sm">Architecture for approved partner profiles, organised by category. The directory stays empty until each profile is approved and its logo permission is on file.</p><p class="small muted">No profile is auto-published. No logo appears without written permission.</p></div>
    <div><h3 class="eyebrow mb-m" style="color:var(--gold-mid)">Fields per profile</h3><ul class="tags">${d.dirFields.map((l) => html`<li>${l.label}</li>`)}</ul></div>
  </div>
</section>
<section class="band--navy" data-el="news.impact" data-el-build="custom-widget">
  <div class="wrap section">
    <div class="section-head reveal"><h2 class="h2">Impact dashboard.</h2><p class="body-lg" style="color:#E7E4DC">Future architecture. Every figure below stays blank until it is verified, and projections will be labelled as projections rather than shown as results.</p></div>
    <div class="hairline" style="--min:240px" data-stagger>
      ${d.impactMetrics.map((m) => html`<div class="cell" style="min-height:150px;gap:12px"><span class="metric__value" aria-hidden="true">—</span><span class="metric__label">${m.label}<span class="sr-only">: not yet verified</span></span><span class="metric__state" aria-hidden="true">Not yet verified</span></div>`)}
    </div>
  </div>
</section>
${formSection({
  id: 'story', title: 'Share a story.',
  lead: 'If something worth telling has happened, tell us about it and we will come back to you about whether and how it could be published.',
  note: 'This is consent to be contacted, not consent to publish. Publication requires a separate signed media release, and stories involving minors require guardian consent and safeguarding review. Please do not include other people’s identifying details.',
  form: previewForm({
    fields: d.newsForm.map((f) => ({ label: f.label, req: f.req, ph: f.ph, type: f.isSelect ? 'select' : f.isArea ? 'textarea' : f.type, options: f.options.map((o) => o.label), full: f.span === '1 / -1' })),
    consent: 'I agree to be contacted about this story. I understand this is not publication consent.',
    submit: 'Send story interest',
    status: `${PREVIEW} On the live site it routes to a named owner and sends an automatic confirmation.`,
  }),
})}
${ctaBand('Partners and sponsors appear here only once approved.', [{ label: 'Partner with us', route: '/partners' }])}`,
  };
}

// ════════════════════════ ACCESSIBILITY ════════════════════════
export function access(d) {
  return {
    title: 'Accessibility, Privacy & Safeguarding',
    description: 'What AFSV VRC commits to on accessibility, privacy and safeguarding, and how to request support or report an issue.',
    ogImage: IMG('life/entrance.jpg'),
    body: html`
${breadcrumb([{ label: 'Accessibility, Privacy & Safeguarding' }])}
${pageHero({
  kicker: 'Accessibility, Privacy & Safeguarding', h1: 'Access, Privacy and Safety by Design',
  lead: 'What we commit to on accessibility, privacy and safeguarding, and how it is implemented. This is a commitment statement — the final legal policies are pending authorized approval.',
  ctas: [{ label: 'Request Accessibility Support', href: '#support', preselect: 'issue-type=Accessibility support request' }, { label: 'Report an Accessibility Issue', href: '#support', preselect: 'issue-type=Report an accessibility issue' }, { label: 'Privacy Inquiry', href: '#support', preselect: 'issue-type=Privacy inquiry' }],
  img: IMG('life/entrance.jpg'), alt: 'Concept rendering: a step-free entrance at dusk where staff welcome a young athlete using a sports wheelchair and a visitor with a guide dog.',
})}
${note('Publication state: this page carries a commitment statement. The full Privacy Policy and Accessibility Statement require counsel and authorized approval before publication, and are listed as pending on the Legal and Policy page. General forms never ask for diagnoses or medical records.')}
<section class="wrap section" data-el="access.commitments" data-el-build="elementor">
  <div class="hairline" style="--min:290px" data-stagger>
    ${d.accessLists.map((g) => html`<div class="cell" style="padding:40px 32px 44px;gap:18px"><span class="num">${g.num}</span><h2 style="font-weight:800;font-size:clamp(22px,2vw,28px)">${g.title}</h2><p style="font-size:15.5px">${g.lead}</p><ul class="dash-list">${g.items.map((l) => html`<li>${l.label}</li>`)}</ul></div>`)}
  </div>
</section>
${formSection({
  id: 'support', title: 'Accessibility and privacy contact.',
  lead: 'Tell us what you ran into and how you would like us to reply. We treat accessibility reports as defects, not feedback.',
  note: 'We do not ask for proof of disability or any medical documentation. Safeguarding concerns are routed to a named owner and are not handled by general support.',
  form: previewForm({
    fields: d.accessForm.map((f) => ({ label: f.label, req: f.req, ph: f.ph, type: f.isSelect ? 'select' : f.isArea ? 'textarea' : f.type, options: f.options.map((o) => o.label), full: f.span === '1 / -1', id: f.label === 'Issue type' ? 'issue-type' : undefined })),
    consent: 'I agree to be contacted about this inquiry.',
    submit: 'Send inquiry',
    status: `${PREVIEW} On the live site it routes to a named owner and sends an automatic confirmation.`,
  }),
})}
${ctaBand('Policies are listed with their approval status.', [{ label: 'Legal and policy pages', route: '/legal' }])}`,
  };
}

// ════════════════════════ LEGAL ════════════════════════
export function legal(d) {
  return {
    title: 'Legal & Policy',
    description: 'Every policy the AFSV VRC website needs, listed with its current approval status.',
    ogImage: IMG('quiet-room.jpg'),
    body: html`
${breadcrumb([{ label: 'Legal & Policy' }])}
${pageHero({
  kicker: 'Legal & Policy', h1: 'Website Policies and Legal Notices',
  lead: 'Every policy this site needs, listed with its current approval status. All policy copy is pending authorized legal and executive approval, and none of it is drafted here.',
  ctas: [{ label: 'Contact Us About These Policies', href: '/contact' }, { label: 'Accessibility Support', href: '/accessibility-privacy' }],
  img: IMG('quiet-room.jpg'), alt: 'A calm, sensory-considered quiet room with acoustic wall panelling, dimmed warm lighting and a low bench with over-ear defenders resting on it.',
})}
${note('All policy copy is pending authorized legal and executive approval. No legal language has been drafted or inferred. Booking, membership purchase, marketplace checkout, payment and sensitive-data workflows stay switched off until the applicable approved policy is linked and its acceptance capture has been tested.')}
<section class="wrap section" data-el="legal.slots" data-el-build="elementor">
  <h2 class="h2 mb-l reveal">Required policies.</h2>
  <div class="policy-table" role="table" aria-label="Required policies and status">
    <div class="policy-table__row" role="row"><span role="columnheader">No.</span><span role="columnheader">Policy</span><span role="columnheader">Scope</span><span role="columnheader">Status</span></div>
    ${d.policySlots.map((p) => html`<div class="policy-table__row" role="row"><span class="num" role="cell">${p.num}</span><span class="policy-table__name" role="cell">${p.label}</span><span class="small" role="cell">${p.scope}</span><span role="cell"><span class="pill pill--soft">Pending approval</span></span></div>`)}
  </div>
</section>
<section class="band--cream" data-el="legal.versioning" data-el-build="custom-widget">
  <div class="wrap section split">
    <div class="reveal"><h2 class="h2 mb-m">Versioning.</h2><p class="body-lg mb-s measure-sm">Each policy carries a version record, and the prior version is archived rather than overwritten.</p><p class="small muted measure-sm">Where consent is captured, the evidence records which policy and which version the person was shown. Cookie preferences must offer real choices and must not use deceptive defaults.</p></div>
    <div><h3 class="eyebrow mb-m" style="color:var(--gold-mid)">Fields per policy</h3><ul class="tags">${d.versionFields.map((l) => html`<li>${l.label}</li>`)}</ul></div>
  </div>
</section>
<section class="wrap section" data-el="legal.gates" data-el-build="elementor">
  <h2 class="h2 mb-l reveal" style="max-width:26ch">What each policy unlocks.</h2>
  <div class="hairline" style="--min:260px" data-stagger>
    ${d.gates.map((b) => html`<div class="cell" style="min-height:220px"><span class="num">${b.num}</span><h3 class="h3">${b.title}</h3><p style="font-size:15.5px">${b.body}</p></div>`)}
  </div>
</section>
${ctaBand('Questions about these policies go to a named owner.', [{ label: 'Contact us', route: '/contact' }])}`,
  };
}

export function notFound() {
  return {
    title: 'Page not found',
    description: 'The page you were looking for could not be found.',
    body: html`
<section class="wrap" style="padding:120px var(--gutter) 160px">
  <p class="eyebrow mb-s">404</p>
  <h1 class="h1 mb-m split-words" aria-label="We could not find that page."><span aria-hidden="true">${splitWords('We could not find that page.')}</span></h1>
  <p class="lead measure mb-l">It may have moved while the site is in development. Try one of these instead.</p>
  <div class="btn-row">${btn('Back to Home', '/', 'navy')}${btn('Contact us', '/contact', 'line-dark')}</div>
</section>`,
  };
}
