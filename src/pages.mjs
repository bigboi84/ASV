import {
  SITE, html, raw, href, btn, pmedia, splitWords, arrow, icon, breadcrumb, ctaBand, note, pendingInputs, pageHero,
  previewForm, fromDesignFields, formSection, numberedCells, numberedRows, pad2, money, initials,
} from './lib.mjs';

const IMG = (f) => `assets/img/${f}`;
let V = {};
export const setVideos = (v) => { V = v; };
const TICK = ['Multi-sport development', 'Soccer', 'Cricket', 'Basketball', 'Track and sprint', 'Adaptive sport', 'Esports', 'AI education', 'Life skills', 'Mentorship', 'Inclusive education', 'Community'];
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
export function home(d) {
  const pillarImgs = [
    ['pillars-hall.jpg', 'A coach demonstrating a movement to two athletes on an indoor court.'],
    ['ai-education-studio.jpg', 'Adult learners at a long desk with large data displays while an instructor explains.'],
    ['accessible-entrance.jpg', 'A step-free facility entrance where a staff member helps a visitor who uses a mobility aid.'],
    ['about-team.jpg', 'Four adults collaborating around a table with notebooks and a wall of notes.'],
  ];
  const pathways = [
    { ...d.pathways[0], desc: 'Athlete pathways, coaching and multi-sport training.', img: 'news-courtside.jpg' },
    { ...d.pathways[1], desc: 'Register interest in the five proposed membership pathways.', img: 'membership-community.jpg' },
    { ...d.pathways[2], desc: 'Apparel, training products and community-focused goods.', img: 'marketplace-kit.jpg' },
    { ...d.pathways[3], desc: 'Sponsorship, education, technology and development routes.', img: 'partners-boardroom.jpg' },
  ];
  return {
    title: 'Home',
    overlay: true,
    description: 'AFSV VRC is creating a smarter, more inclusive sports and education ecosystem where athletes, families, educators, partners and communities can train, learn, connect and grow.',
    body: html`
<section class="hero hero--full" data-el="home.hero" data-el-build="elementor">
  <div class="hero__media">
    <img src="${IMG('hero-fieldhouse.jpg')}" alt="" width="1344" height="752" fetchpriority="high">
    <video src="assets/video/hero-loop.mp4" poster="${IMG('hero-fieldhouse.jpg')}" muted loop playsinline autoplay preload="metadata" aria-hidden="true" tabindex="-1"></video>
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <svg class="hero__lanes" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M-40 690 C 380 610, 820 640, 1480 470"/>
    <path d="M-40 730 C 400 650, 860 690, 1480 520"/>
    <path d="M-40 770 C 420 690, 900 740, 1480 570"/>
    <path class="runner" d="M-40 730 C 400 650, 860 690, 1480 520"/>
  </svg>
  <div class="wrap hero__content">
    <div class="hero__copy">
      <p class="eyebrow eyebrow-rule">AFSV VRC Global Development Group</p>
      <h1 class="display split-words" aria-label="Building Athletes. Empowering Minds. Strengthening Communities."><span aria-hidden="true">${splitWords(['Building Athletes.', 'Empowering Minds.', 'Strengthening Communities.'], ['Communities.'])}</span></h1>
      <p class="lead">AFSV VRC is creating a smarter, more inclusive sports and education ecosystem where athletes, families, educators, partners and communities can train, learn, connect and grow.</p>
      <div class="btn-row btn-row--stack">
        ${btn('Explore the Smart Sports Village', '/whitby-smart-sports-village', 'gold')}
        ${btn('Join the Movement', '/membership', 'line-light')}
      </div>
    </div>
  </div>
  <div class="hero__facts">
    <div class="wrap hero__facts-inner">
      <a class="hero__fact" href="whitby-smart-sports-village.html"><span class="hero__fact-k">Pilot</span><span class="hero__fact-v">Whitby, Ontario</span><span class="pill pill--gold">Proposed</span></a>
      <a class="hero__fact" href="strategic-pillars.html"><span class="hero__fact-k">Model</span><span class="hero__fact-v">4 strategic pillars</span></a>
      <a class="hero__fact" href="about.html"><span class="hero__fact-k">Reach</span><span class="hero__fact-v">Canada · Caribbean · Global</span></a>
      <a class="hero__fact hero__fact--book" href="${SITE.booking}" target="_blank" rel="noopener noreferrer"><span class="hero__fact-k">Book. Train. Perform.</span><span class="hero__fact-v">Book a session ${icon('external')}</span><span class="sr-only"> (opens in a new tab)</span></a>
    </div>
  </div>
  <button type="button" class="media-toggle" aria-pressed="false">${icon('pause', 'ico-pause')}${icon('play', 'ico-play')}<span>Pause background video</span></button>
  <p class="sr-only">Background video: adult athletes training in a modern indoor fieldhouse — a sprinter on the track, an athlete adjusting a wheelchair racing frame, and two athletes talking courtside in low evening light.</p>
</section>

<div class="ticker" aria-label="Program areas">
  <div class="ticker__track">
    <ul>${TICK.map((t) => html`<li>${t}</li>`)}</ul>
    <ul aria-hidden="true">${TICK.map((t) => html`<li>${t}</li>`)}</ul>
  </div>
</div>

<section class="wrap section event-section" id="events" aria-labelledby="events-h">
  <div class="section-head reveal">
    <h2 class="h2" id="events-h">Upcoming event.</h2>
    <p class="body-lg muted">The first event on the AFSV VRC calendar. <a class="text-link" href="events.html">All events ${arrow()}</a></p>
  </div>
  ${eventFeature(d.events[0])}
</section>

<section class="wrap section" id="ecosystem" data-el="home.ecosystem" data-el-build="elementor">
  <div class="statement reveal">
    <p class="eyebrow">One connected ecosystem</p>
    <p class="statement__text"><strong>Sport is only the beginning.</strong> AFSV VRC brings together athlete development, academic success, neurodivergent support and inclusive education, life skills, technology, community programming and commercial opportunity in one connected platform.</p>
  </div>
  <div class="panels" data-panels>
    ${d.pillars.map((p, i) => html`
    <a class="panel-card${i === 0 ? ' is-active' : ''}" href="${href(p.href)}">
      <img src="${IMG(pillarImgs[i][0])}" alt="" width="1344" height="752" loading="lazy">
      <span class="panel-card__shade" aria-hidden="true"></span>
      <span class="panel-card__num">${p.num}</span>
      <span class="panel-card__body">
        <span class="panel-card__title">${p.title}</span>
        <span class="panel-card__desc">${p.desc}</span>
        <span class="panel-card__go">Explore ${arrow()}</span>
      </span>
    </a>`)}
  </div>
</section>

<section class="expand" data-el="home.whitby" data-el-build="elementor" data-expand>
  <div class="expand__frame" data-video-scope>
    ${pmedia({ img: IMG('whitby-aerial-concept.jpg'), alt: 'Conceptual rendering: aerial view of a proposed multi-sport village campus with linked low-rise pavilions, outdoor pitches, courts, solar canopies and tree-lined walkways. Not an existing facility.', video: V.whitbyAerial, parallax: 0 })}
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

<section class="band--navy" data-el="home.stats" data-el-build="elementor">
  <div class="wrap" style="padding-top:clamp(56px,7vw,88px);padding-bottom:clamp(56px,7vw,88px)">
    <div class="section-head reveal"><h2 class="h2">The model, in numbers.</h2><p class="body-lg" style="color:var(--on-navy-soft)">Planned scope for the first phase. Figures are proposals, not results, and stay labelled that way.</p></div>
    <div class="stats" data-stagger>
      <div class="stat"><span class="stat__value"><span data-count="4">4</span></span><span class="stat__label">Strategic pillars connecting sport, learning, inclusion and life skills</span></div>
      <div class="stat"><span class="stat__value"><span data-count="10">10</span></span><span class="stat__label">Program categories planned for the first cycle</span></div>
      <div class="stat"><span class="stat__value"><span data-count="150000">150,000</span><small>sq ft</small></span><span class="stat__label">Approximate Phase 1 floor area, subject to site, design, approvals and financing</span><span class="pill pill--gold">Proposed</span></div>
      <div class="stat"><span class="stat__value"><span data-count="6">6</span></span><span class="stat__label">Facility zones, from the multi-sport dome to media and broadcast</span></div>
    </div>
  </div>
</section>

<section class="wrap section" data-el="home.pathways" data-el-build="elementor">
  <div class="section-head reveal">
    <h2 class="h2">Choose your pathway.</h2>
    <p class="body-lg muted">Four ways in. Each route reaches the team responsible for it.</p>
  </div>
  <div class="path-grid" data-stagger>
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
</section>

${esportsBand()}

<section class="band--cream" data-el="home.neurodiversity" data-el-build="elementor">
  <div class="wrap section split split--center">
    <figure class="figure figure--4x3 figure--motion wipe neuro-figure" data-video-scope>${pmedia({ img: IMG('sensory-support-space.jpg'), alt: 'Two adults in relaxed conversation in a calm, sensory-considerate support space with soft acoustic wall panels, dimmable lighting and quiet soft seating.', video: V.sensory, w: 1168, h: 880 })}</figure>
    <div class="reveal">
      <p class="eyebrow mb-s">Neurodiversity Access &amp; Opportunity</p>
      <h2 class="h2 mb-m">Different Minds.<br>Equal Opportunity.</h2>
      <p class="lead mb-m">AFSV VRC is developing an inclusive ecosystem intended to expand access to sport, education, developmental support, life skills, technology and employment for neurodivergent people — reducing financial and accessibility barriers through qualified professionals, community organizations, businesses, sponsors and employers.</p>
      <ul class="check-list mb-l">${['Sensory-friendly environments', 'Qualified service provider network', 'Neurodiversity Access Fund', 'Neuroinclusive employers'].map((t) => html`<li>${t}</li>`)}</ul>
      ${btn('Explore Neurodiversity Access & Opportunity', '/neurodiversity', 'navy')}
    </div>
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
export function about(d) {
  const leaders = d.leadership.map((p) => html`
<article class="leader">
  ${p.img
    ? html`<div class="leader__photo"><img src="${p.img}" alt="${p.alt || p.name}" width="940" height="1224" loading="lazy"></div>`
    : html`<div class="leader__placeholder" role="img" aria-label="Portrait of ${p.name} pending approval"><span class="leader__initials" aria-hidden="true">${initials(p.name)}</span><small>Approved portrait pending</small></div>`}
  <div class="leader__body">
    <h3>${p.name}</h3>
    <p class="leader__role">${p.role}</p>
    <div class="leader__bio">${p.bio.map((para) => html`<p>${para}</p>`)}</div>
    ${p.bio.length > 1 ? html`<button type="button" class="leader__more" aria-expanded="false">Read full biography</button>` : ''}
    ${p.focus ? html`<div class="leader__focus">${p.focus.map((f) => html`<div><strong>${f.t}</strong>${f.d}</div>`)}</div>` : ''}
    ${p.quote ? html`<figure class="leader__quote"><blockquote>${p.quote}</blockquote><figcaption>${p.quoteBy}</figcaption></figure>` : ''}
  </div>
</article>`);
  return {
    title: 'About Us',
    description: 'AFSV VRC Global Development Group Ltd. develops a connected ecosystem that expands opportunity through sport, education, technology and inclusive community programming.',
    ogImage: IMG('about-team.jpg'),
    body: html`
${breadcrumb([{ label: 'About Us' }])}
<section class="wrap page-head" data-el="about.hero" data-el-build="elementor">
  <p class="eyebrow">About AFSV VRC</p>
  <h1 class="h1 split-words" style="max-width:17ch" aria-label="A new model for sport, learning and community development."><span aria-hidden="true">${splitWords('A new model for sport, learning and community development.')}</span></h1>
  <div class="split">
    <p class="lead">AFSV VRC Global Development Group Ltd. was formed to develop and operate a connected ecosystem that expands opportunity through sport, education, technology and inclusive community programming. Our work begins with a proposed Smart Sports Village pilot in Whitby, Ontario, and extends to partnerships and scalable initiatives in Canada, the Caribbean and global markets.</p>
    <figure class="figure figure--16x10 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('about-team.jpg'), alt: 'Four adults of varied ethnicities in discussion around a large table with notebooks and a wall of notes, in a bright meeting space adjoining a sports hall.', video: V.aboutTeam, w: 1344, h: 752 })}</figure>
  </div>
</section>

<section class="band--navy" data-el="about.mission-vision" data-el-build="elementor">
  <div class="wrap section">
    <div class="hairline" style="--min:320px">
      <div class="cell" style="padding:40px 40px 44px"><h2 class="eyebrow">Mission</h2><p style="font-family:var(--font-display);font-weight:600;font-size:clamp(19px,1.7vw,25px);line-height:1.42">To create accessible, technology-enabled environments and pathways that develop athletes, strengthen academic and life outcomes, support diverse learners, and generate lasting value for families and communities.</p></div>
      <div class="cell" style="padding:40px 40px 44px"><h2 class="eyebrow">Vision</h2><p style="font-family:var(--font-display);font-weight:600;font-size:clamp(19px,1.7vw,25px);line-height:1.42">A global network of smart sports villages and connected programs where talent is developed, learning is supported, inclusion is designed in, and communities share in the benefits of sport-led development.</p></div>
    </div>
  </div>
</section>

<section class="wrap section" data-el="about.model" data-el-build="elementor">
  <h2 class="h2 mb-l reveal">What makes the model different.</h2>
  ${numberedCells(d.aboutModel.map((m) => m.label), { min: 215 })}
</section>

<section class="band--cream" data-el="about.leadership" data-el-build="elementor">
  <div class="wrap section">
    <div class="split split--center" style="margin-bottom:clamp(64px,8vw,96px)">
      <figure class="figure wipe"><img src="${IMG('martin-lashley.jpg')}" alt="Martin Lashley standing on the turf inside an indoor sports dome." width="940" height="1224" loading="lazy" style="aspect-ratio:940/1224"></figure>
      <div class="stack reveal" style="--stack:20px">
        <p class="eyebrow">Founder Story</p>
        <h2 class="h2">Martin Lashley</h2>
        <p class="body-lg">Martin Lashley founded Athletes &amp; Fans Sports Village Holding Company Limited with a singular belief: sport can transform communities when combined with education, technology, and opportunity.</p>
        <p class="body-lg">Recognizing the challenges athletes face in Canada's climate, Lashley envisioned a network of high-performance indoor sports environments capable of supporting year-round training while simultaneously delivering mentorship, academic support, and career pathways for young people.</p>
        <p class="body-lg">That vision evolved into the AFSVHCL™ ecosystem, an integrated platform combining sports science, education programs, esports engagement, and community participation.</p>
        <p class="body-lg">The Whitby Smart Sports Village project represents the first step toward building a national network of multi-sport dome facilities designed to serve athletes, families, and communities across Canada.</p>
        <p style="font-family:var(--font-display);font-weight:800;font-size:20px;color:var(--gold-ink)">Building Today. Inspiring Tomorrow.</p>
      </div>
    </div>
    <figure class="quote-block reveal" style="margin-bottom:clamp(64px,8vw,96px)">
      <p class="eyebrow">In His Own Words</p>
      <blockquote>“We are not building a sports facility. We are building an ecosystem — one that will change the trajectory of thousands of young lives and strengthen communities across Canada and the world.”</blockquote>
      <figcaption>— Martin Lashley, Founder, Chairman &amp; Interim CEO, AFSVHCL™</figcaption>
      <div class="hairline band--navy" style="--min:180px;margin-top:12px">
        ${['High-Performance Training', 'Education & Mentorship', 'Sports Science & Technology', 'Community & Global Impact'].map((t, i) => html`<div class="cell" style="padding:22px 20px;gap:8px"><span class="num">${pad2(i + 1)}</span><span style="font-weight:600">${t}</span></div>`)}
      </div>
    </figure>
    <h2 class="h2 mb-l">Leadership</h2>
    <div class="cards" style="--min:300px;align-items:start" data-stagger>${leaders}</div>
  </div>
</section>

${ctaBand('Connect with our team.', [{ label: 'Connect With Our Team', route: '/contact' }])}`,
  };
}

// ════════════════════════ STRATEGIC PILLARS ════════════════════════
export function pillars(d) {
  return {
    title: 'Strategic Pillars',
    description: 'Four pillars, one purpose: sports development, education and academic success, neurodivergent support and inclusive education, and life skills.',
    ogImage: IMG('pillars-hall.jpg'),
    body: html`
${breadcrumb([{ label: 'About', route: '/about' }, { label: 'Strategic Pillars' }])}
<section class="wrap page-head" data-el="pillars.hero" data-el-build="elementor">
  <p class="eyebrow">Strategic Pillars</p>
  <h1 class="h1 split-words" style="max-width:20ch;margin-bottom:44px" aria-label="Four pillars. One purpose: helping people thrive."><span aria-hidden="true">${splitWords('Four pillars. One purpose: helping people thrive.')}</span></h1>
  <figure class="figure figure--21x9 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('pillars-hall.jpg'), alt: 'Wide interior of a multi-purpose sports and learning building: a coach demonstrating a movement to two adult athletes on a court, with adults studying at tables visible through a glass partition beyond.', video: V.pillars, w: 1344, h: 752 })}</figure>
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
export function whitby(d) {
  return {
    title: 'Whitby Smart Sports Village',
    description: 'A proposed year-round, technology-enabled destination in Whitby, Ontario bringing multi-sport participation, athlete development, education, inclusive supports, media and community under one roof.',
    ogImage: IMG('whitby-aerial-concept.jpg'),
    body: html`
${breadcrumb([{ label: 'Smart Sports Village' }, { label: 'Whitby Smart Sports Village' }])}
<section class="wrap page-head" data-el="whitby.hero" data-el-build="elementor" style="padding-bottom:0">
  <span class="pill mb-m">Proposed development</span>
  <h1 class="h1 split-words" style="max-width:22ch" aria-label="The Whitby Smart Sports Village: a connected place to train, learn and belong."><span aria-hidden="true">${splitWords('The Whitby Smart Sports Village: a connected place to train, learn and belong.')}</span></h1>
  <p class="lead measure mb-l">AFSV VRC is advancing a proposed Smart Sports Village pilot in Whitby, Ontario: a year-round, technology-enabled destination bringing multi-sport participation, athlete development, education, inclusive supports, media and community experiences under one roof.</p>
  <figure class="figure figure--16x9 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('whitby-clay-exterior.jpg'), alt: 'Conceptual clay-model rendering: ground-level view of a proposed sports dome with an adjoining low-rise pavilion, shown as an untextured white and grey massing study. Not an existing facility.', video: V.whitbyExterior, w: 1344, h: 752 })}
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
<section class="band--navy" data-el="whitby.smart" data-el-build="elementor">
  <div class="wrap section split split--center">
    <div class="reveal">
      <p class="eyebrow mb-s">Smart by design</p>
      <h2 class="h2 mb-m">Technology as infrastructure, not decoration.</h2>
      <p class="lead">Digital access, secure connectivity, facility sensors, automation, data-informed programming, modern signage and emerging technology—subject to privacy, security, design and procurement.</p>
    </div>
    <figure class="figure figure--16x9 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('whitby-clay-cutaway.jpg'), alt: 'Conceptual clay-model rendering: cutaway interior of a proposed sports dome showing a long-span arched roof, abstracted field zones, mezzanine learning rooms and a media studio volume as untextured masses. Not an existing facility.', video: V.whitbyCutaway, w: 1344, h: 752 })}
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
    ogImage: IMG('facilities-clay-hall.jpg'),
    body: html`
${breadcrumb([{ label: 'Smart Sports Village', route: '/whitby-smart-sports-village' }, { label: 'Facilities' }])}
<section class="wrap page-head" data-el="facilities.header" data-el-build="elementor">
  <div class="split split--end">
    <div>
      <p class="eyebrow mb-s">Facilities</p>
      <h1 class="h1 mb-m split-words" aria-label="Flexible spaces for performance, learning and community."><span aria-hidden="true">${splitWords('Flexible spaces for performance, learning and community.')}</span></h1>
      <p class="lead measure">The proposed Smart Sports Village is being designed around adaptable spaces for sport, education, innovation, inclusion and community use. Final configuration is subject to design development, approvals and partner requirements.</p>
    </div>
    <figure class="figure figure--16x10 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('facilities-clay-hall.jpg'), alt: 'Conceptual clay-model rendering: interior of a proposed flexible hall subdivided by movable partitions into a court zone, a workshop zone and a quiet sensory alcove, shown as untextured white and grey masses. Not an existing facility.', video: V.facilities, w: 1344, h: 752 })}
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
    ogImage: IMG('membership-community.jpg'),
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
    <figure class="figure figure--4x3 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('membership-community.jpg'), alt: 'A diverse group of adults talking together outside a sports facility entrance after a session, holding kit bags and water bottles in late afternoon light.', video: V.membership, w: 1344, h: 752 })}</figure>
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

// ════════════════════════ MARKETPLACE ════════════════════════
export function marketplace(d) {
  const featured = d.products.slice(0, 3);
  return {
    title: 'Marketplace',
    description: 'Wear the Movement. Build the Future. The AFSV VRC Marketplace will bring together branded apparel, sport and training products, education resources and community goods.',
    ogImage: IMG('marketplace-kit.jpg'),
    body: html`
${breadcrumb([{ label: 'Marketplace' }])}
<section class="band--navy" data-el="marketplace.hero" data-el-build="elementor" style="margin-top:22px">
  <div class="wrap section split split--center">
    <div>
      <p class="eyebrow mb-s">Marketplace</p>
      <h1 class="h1 mb-m split-words" aria-label="Wear the Movement. Build the Future."><span aria-hidden="true">${splitWords(['Wear the Movement.', 'Build the Future.'], ['Movement.', 'Future.'])}</span></h1>
      <p class="lead measure mb-l">The AFSV VRC Marketplace will bring together branded apparel, sport and training products, education resources, partner offers and community-focused goods and services. Purchases are intended to strengthen the wider ecosystem.</p>
      <div class="btn-row btn-row--stack">
        ${btn('Join the Launch List', '#buyer-form', 'gold')}
        ${btn('Become a Marketplace Vendor', '#vendor-form', 'line-light')}
      </div>
      <p class="mt-m"><a class="text-link text-link--light" href="shop.html">View the commerce preview ${arrow()}</a></p>
      <p class="small mt-m" style="color:var(--on-navy-muted)">The commerce preview is an internal build review of the catalogue, cart and checkout flow using sample data. It is not a live store.</p>
    </div>
    <figure class="figure figure--4x3 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('marketplace-kit.jpg'), alt: 'Folded plain unbranded training apparel, a towel, water bottle, resistance band and dark trainers arranged on a matte charcoal surface under soft directional light.', video: V.marketplace, w: 1344, h: 752 })}</figure>
  </div>
</section>
<section class="wrap section" data-el="marketplace.categories" data-el-build="elementor">
  <h2 class="h2 mb-l reveal">Launch categories.</h2>
  <div class="hairline" style="--min:220px" data-stagger>
    ${d.marketCategories.map((c) => html`<div class="cell" style="min-height:180px"><div class="cell__top"><span class="num">${c.num}</span><span class="pill pill--soft">Coming soon</span></div><h3 class="h3" style="font-size:19px">${c.title}</h3></div>`)}
  </div>
</section>
<section class="band--cream" data-el="marketplace.featured" data-el-build="elementor">
  <div class="wrap section">
    <div class="section-head reveal">
      <h2 class="h2">A first look at the range.</h2>
      <p class="body-lg muted">Sample listings from the commerce preview. Names, prices and imagery are for build review and are not on sale.</p>
    </div>
    <div class="product-grid" data-stagger>${featured.map((p) => productCard(p, 'h3'))}</div>
    <p class="mt-m"><a class="text-link" href="shop.html">Browse all ${d.products.length} sample products ${arrow()}</a></p>
  </div>
</section>
<section class="wrap section section--flush-bottom" data-el="marketplace.vendor-pathway" data-el-build="elementor">
  <div class="split reveal">
    <h2 class="h2">Vendor pathway.</h2>
    <p class="lead">Invite qualified brands, creators, service providers and community businesses to register interest. Final onboarding depends on commercial, brand, quality, insurance, payment, tax, fulfilment and policy approval.</p>
  </div>
</section>
<section class="wrap" id="buyer-form" data-el="marketplace.buyer-form" data-el-build="plugin" style="padding-top:64px">
  <div class="panel">
    <h2 class="h2 h2--sm mb-s">Join the launch list</h2>
    <p class="body-lg mb-l">For shoppers. We will let you know when the marketplace opens.</p>
    ${previewForm({
      fields: [
        { label: 'Name', req: true, auto: 'name' },
        { label: 'Email', type: 'email', req: true, auto: 'email' },
        { label: 'Country', req: true, auto: 'country-name' },
        { label: 'Interests' },
      ],
      consent: 'I agree to receive marketplace launch updates from AFSV VRC.',
      submit: 'Join the Launch List',
      status: `${PREVIEW} Launch-list submissions will route once commerce approvals are complete.`,
    })}
  </div>
</section>
<section class="wrap section section--flush-top" id="vendor-form" data-el="marketplace.vendor-form" data-el-build="plugin" style="padding-top:32px">
  <div class="panel panel--dark">
    <span class="pill mb-m">Interest only — not approval</span>
    <h2 class="h2 h2--sm mb-s">Become a marketplace vendor</h2>
    <p class="body-lg mb-l measure">Submitting this form registers your interest. It does not create a vendor account or constitute onboarding.</p>
    ${previewForm({
      fields: [
        { label: 'Legal or brand name', req: true, auto: 'organization' },
        { label: 'Contact name', req: true, auto: 'name' },
        { label: 'Email', type: 'email', req: true, auto: 'email' },
        { label: 'Phone', type: 'tel', auto: 'tel' },
        { label: 'Website', type: 'url', ph: 'https://', auto: 'url' },
        { label: 'Category', type: 'select', req: true, ph: 'Select a category', options: ['Apparel and fanwear', 'Training and performance', 'Education and life-skills resources', 'Partner and sponsor offers', 'Community and vendor products'] },
        { label: 'Regions served' },
        { label: 'Insurance status', type: 'select', ph: 'Select a status', options: ['Current cover in place', 'Application in progress', 'Not yet arranged'] },
        { label: 'Product or service description', type: 'textarea', req: true, rows: 3, full: true },
        { label: 'Fulfilment capability', type: 'textarea', rows: 2, full: true },
        { label: 'Comments', type: 'textarea', rows: 2, full: true },
      ],
      consent: 'I agree to be contacted about marketplace vendor opportunities and understand this submission is not an approval.',
      submit: 'Register vendor interest',
      status: `${PREVIEW} Vendor submissions will route to a manual review queue; no vendor account is created automatically.`,
    })}
  </div>
</section>`,
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
          <li><a href="accessibility-privacy.html#support">Accessibility or privacy request</a></li>
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
    ogImage: IMG('partners-boardroom.jpg'),
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
  <figure class="figure figure--21x9 figure--motion wipe" data-video-scope>${pmedia({ img: IMG('partners-boardroom.jpg'), alt: 'Five adults in business attire in discussion around a dark boardroom table with printed plans and a site model, a large window behind them.', video: V.partners, w: 1344, h: 752 })}</figure>
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
<section class="wrap section" data-el="partners.directory" data-el-build="elementor">
  <h2 class="h2 mb-s reveal">Approved partners</h2>
  <p class="body-lg mb-l" style="max-width:70ch">No organisation is listed as a partner without written authorization. Approved logos will appear here once permissions are confirmed.</p>
  <div class="slot" style="padding:56px 32px;background:var(--cream)"><span>Partner logo directory — awaiting written permissions</span></div>
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
    ogImage: IMG('news-courtside.jpg'),
    body: html`
${breadcrumb([{ label: 'About', route: '/about' }, { label: 'News, Stories & Impact' }])}
${pageHero({
  kicker: 'News, Stories & Impact', h1: 'Progress, People and Community Impact',
  lead: 'A controlled publishing framework for updates, stories, approved milestones and verified impact. Nothing is published without editorial approval, and nothing about a person is published without their documented consent.',
  ctas: [{ label: 'Read Updates', href: '#updates' }, { label: 'Share a Story', href: '#story' }, { label: 'Partner With Us', href: '/partners' }],
  video: V.news, img: IMG('news-courtside.jpg'), alt: 'A young adult athlete and an older family member sitting side by side on a bench at the edge of an indoor court, mid-conversation in warm late light.',
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
    ogImage: IMG('accessible-entrance.jpg'),
    body: html`
${breadcrumb([{ label: 'Accessibility, Privacy & Safeguarding' }])}
${pageHero({
  kicker: 'Accessibility, Privacy & Safeguarding', h1: 'Access, Privacy and Safety by Design',
  lead: 'What we commit to on accessibility, privacy and safeguarding, and how it is implemented. This is a commitment statement — the final legal policies are pending authorized approval.',
  ctas: [{ label: 'Request Accessibility Support', href: '#support', preselect: 'issue-type=Accessibility support request' }, { label: 'Report an Accessibility Issue', href: '#support', preselect: 'issue-type=Report an accessibility issue' }, { label: 'Privacy Inquiry', href: '#support', preselect: 'issue-type=Privacy inquiry' }],
  img: IMG('accessible-entrance.jpg'), alt: 'An accessible facility entrance with a step-free doorway and tactile floor strip, a member of staff at a low reception counter helping a visitor who uses a mobility aid.',
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

// ════════════════════════ COMMERCE PREVIEW ════════════════════════
function productCard(p, tag = 'h2') {
  return html`
<a class="product-card" href="product-${p.slug}.html" data-cat="${p.category}" data-vendor="${p.vendor}" data-price="${p.price}" data-name="${p.name}">
  <div class="product-card__img"><img src="${p.img}" alt="${p.shot}" width="800" height="800" loading="lazy">${p.badge ? html`<span class="badge">${p.badge}</span>` : ''}</div>
  <div class="product-card__body">
    <span class="product-card__vendor">${p.vendor}</span>
    ${raw(`<${tag}>`)}${p.name}${raw(`</${tag}>`)}
    <p>${p.blurb}</p>
    <div class="product-card__foot"><span class="price">${money(p.price)}</span><span class="cell__foot" style="padding:0">View ${arrow()}</span></div>
  </div>
</a>`;
}

const testNote = html`<div class="test-note" role="note"><b>TEST</b><p>This is a functional preview of the commerce flow — catalogue, product, cart, checkout and confirmation. Products, vendors, prices, tax and shipping are sample data. No payment is processed and no order is created.</p></div>`;

function commerceHead(h1, step) {
  const steps = ['Cart', 'Checkout', 'Confirmation'];
  return html`
<section class="wrap" data-el="cart.head" data-el-build="woo-template" style="padding-top:48px;padding-bottom:36px">
  <p class="eyebrow mb-s">Marketplace — development preview</p>
  <h1 class="h1 mb-l">${h1}</h1>
  <ol class="steps" aria-label="Checkout progress">${steps.map((s, i) => html`<li${i === step ? raw(' aria-current="step"') : ''}><span class="num">${pad2(i + 1)}</span>${s}</li>`)}</ol>
</section>`;
}

export function shop(d) {
  const cats = ['All', 'Apparel', 'Equipment', 'Inclusion', 'Nutrition', 'Programs'];
  const vends = ['All', ...d.vendors.map((v) => v.name)];
  return {
    title: 'Shop',
    description: 'AFSV VRC marketplace commerce preview — kit, equipment and inclusion products. Sample data for build review.',
    body: html`
${breadcrumb([{ label: 'Marketplace', route: '/marketplace' }, { label: 'Shop' }])}
<section class="wrap" data-el="shop.hero" data-el-build="elementor" style="padding-top:48px;padding-bottom:40px">
  <p class="eyebrow mb-s">Marketplace — development preview</p>
  <div class="split split--end"><h1 class="h1 split-words" aria-label="Shop the district."><span aria-hidden="true">${splitWords('Shop the district.')}</span></h1><p class="lead">Kit, equipment and inclusion products from AFSV VRC and its vendor partners. Every listing below is test data for build review.</p></div>
  ${testNote}
</section>
<section class="wrap" data-el="shop.controls" data-el-build="custom-widget" style="padding-bottom:32px">
  <div class="shop-controls">
    <div class="chip-row" role="group" aria-label="Filter by category">${cats.map((c, i) => html`<button type="button" class="chip" data-cat="${c}" aria-pressed="${i === 0 ? 'true' : 'false'}">${c}</button>`)}</div>
    <div class="shop-selects">
      <label for="shop-vendor">Vendor <select id="shop-vendor">${vends.map((v) => html`<option value="${v}">${v}</option>`)}</select></label>
      <label for="shop-sort">Sort <select id="shop-sort"><option value="featured">Featured</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option><option value="name">Name, A–Z</option></select></label>
    </div>
  </div>
  <p class="small mt-m" id="shop-count" aria-live="polite">Showing ${d.products.length} products</p>
</section>
<section class="wrap section section--flush-top" data-el="shop.archive" data-el-build="woo-template">
  <div class="product-grid" id="shop-grid">${d.products.map((p) => productCard(p))}</div>
  <div class="empty-state" id="shop-empty" hidden><p>No products match that combination.</p><button type="button" class="btn btn--navy" data-clear-filters>Clear filters</button></div>
</section>`,
  };
}

export function product(d, p) {
  const sku = 'AFSV-' + p.slug.toUpperCase().replace(/-/g, '').slice(0, 10);
  const related = (() => {
    let r = d.products.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 3);
    if (r.length < 3) r = d.products.filter((x) => x.slug !== p.slug).slice(0, 3);
    return r;
  })();
  const thumbs = [['Front', 'center'], ['Angle', 'left center'], ['Detail', 'center top'], ['Alternate', 'right center']];
  return {
    title: p.name,
    description: p.desc,
    ogImage: p.img,
    body: html`
<nav class="breadcrumb wrap" aria-label="Breadcrumb"><ol>
  <li><a href="index.html">Home</a></li><li aria-hidden="true">/</li>
  <li><a href="shop.html">Shop</a></li><li aria-hidden="true">/</li>
  <li><a href="shop.html?cat=${encodeURIComponent(p.category)}">${p.category}</a></li><li aria-hidden="true">/</li>
  <li aria-current="page">${p.name}</li>
</ol></nav>
<section class="wrap" data-product="${p.slug}" data-el="product.single" data-el-build="woo-template" style="padding-top:40px;padding-bottom:88px">
  <div class="product">
    <div class="gallery">
      <div class="gallery__main"><img src="${p.img}" alt="${p.shot}" width="800" height="800" fetchpriority="high"></div>
      <div class="gallery__thumbs" role="group" aria-label="Image views">${thumbs.map(([l, pos], i) => html`<button type="button" data-pos="${pos}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="${l} view"><img src="${p.img}" alt="" loading="lazy" style="object-position:${pos}"></button>`)}</div>
    </div>
    <div>
      <div class="product__meta-top"><a class="product-card__vendor" style="border-bottom:1px solid var(--gold);padding-bottom:2px" href="shop.html?vendor=${encodeURIComponent(p.vendor)}">${p.vendor}</a>${p.badge ? html`<span class="badge">${p.badge}</span>` : ''}</div>
      <h1 class="h1" style="font-size:clamp(28px,3.1vw,44px)">${p.name}</h1>
      <p class="price">${money(p.price)}</p>
      <p class="small muted mb-m">CAD, excluding HST. Tax is calculated at checkout.</p>
      <p class="body-lg measure">${p.desc}</p>
      ${p.variants && p.variants.length ? html`
      <div class="variant-group"><span class="field__label" id="vlabel">${p.variantLabel}</span>
        <div class="variants" role="group" aria-labelledby="vlabel">${p.variants.map((v, i) => html`<button type="button" data-variant="${v}" aria-pressed="${i === 0 ? 'true' : 'false'}">${v}</button>`)}</div>
      </div>` : html`<div style="height:28px"></div>`}
      <div class="buy-row">
        <div class="qty" role="group" aria-label="Quantity"><button type="button" data-qty-step="-1" aria-label="Decrease quantity">−</button><output data-qty aria-live="polite">1</output><button type="button" data-qty-step="1" aria-label="Increase quantity">+</button></div>
        <button type="button" class="btn btn--navy" data-add-to-cart>Add to cart</button>
      </div>
      <p class="form-status mb-m" id="added-status" role="status" tabindex="-1" hidden>Added to your cart. <a href="cart.html" style="font-weight:700;border-bottom:1px solid var(--gold)">View cart and check out</a>.</p>
      <dl class="spec-table">
        ${[['Vendor', p.vendor], ['Category', p.category], ['SKU', sku], ['Availability', 'Sample stock — preview only']].map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}
      </dl>
    </div>
  </div>
</section>
<section class="band--cream">
  <div class="wrap section" style="display:grid;gap:48px;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))">
    <div><h2 class="h2 h2--sm mb-m">Details</h2><p class="body-lg">${p.long}</p></div>
    <div><h3 class="eyebrow mb-m" style="color:var(--gold-mid)">Specification</h3><ul class="dash-list">${(p.specs || []).map((s) => html`<li>${s}</li>`)}</ul></div>
    <div><h3 class="eyebrow mb-m" style="color:var(--gold-mid)">Shipping &amp; returns</h3><p class="mb-s" style="font-size:15.5px">Shipped by the vendor from within Ontario. Standard courier 3–5 business days, or free pickup at the Whitby site once operational.</p><p class="small muted">Returns policy is per-vendor and is not yet finalised. Final wording is required before checkout goes live.</p></div>
  </div>
</section>
<section class="wrap section" data-el="product.related" data-el-build="woo-template">
  <h2 class="h2 h2--sm mb-l">Also from the marketplace</h2>
  <div class="product-grid">${related.map((r) => productCard(r, 'h3'))}</div>
</section>`,
  };
}

export function vendors(d) {
  return {
    title: 'Vendors',
    description: 'AFSV VRC marketplace vendors — sample storefronts for build review.',
    body: html`
${breadcrumb([{ label: 'Marketplace', route: '/marketplace' }, { label: 'Vendors' }])}
<section class="wrap" style="padding-top:48px;padding-bottom:44px">
  <p class="eyebrow mb-s">Marketplace — development preview</p>
  <div class="split split--end"><h1 class="h1 split-words" aria-label="Vendors."><span aria-hidden="true">${splitWords('Vendors.')}</span></h1><p class="lead">A multi-vendor marketplace: each vendor runs its own storefront, listings and fulfilment under AFSV VRC marketplace terms. All four below are sample vendors for build review.</p></div>
</section>
<section class="wrap section section--flush-top" data-el="vendors.archive" data-el-build="plugin">
  <div class="hairline" style="--min:280px" data-stagger>
    ${d.vendors.map((v) => html`
    <div class="cell" style="min-height:290px">
      <div style="display:flex;align-items:center;gap:14px"><div class="vendor-logo"><img src="${v.logo}" alt="${v.name} logo" width="96" height="96" loading="lazy"></div><span class="product-card__vendor">${v.kicker}</span></div>
      <h2 class="h3" style="font-size:20px">${v.name}</h2>
      <p>${v.blurb}</p>
      <dl class="vendor-dl"><div><dt>Region</dt><dd>${v.region}</dd></div><div><dt>Sells</dt><dd>${v.cats}</dd></div></dl>
      <div class="cell__foot" style="justify-content:space-between;padding-top:16px"><span style="font-family:var(--font-display);font-weight:800;font-size:14px;text-transform:none;letter-spacing:0">${v.count}</span><a class="text-link" href="shop.html?vendor=${encodeURIComponent(v.name)}">Visit store<span class="sr-only">: ${v.name}</span> ${arrow()}</a></div>
    </div>`)}
  </div>
  <div class="band--navy mt-l" style="padding:44px 36px;display:grid;gap:32px;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));align-items:center">
    <div><h2 class="h2 h2--sm mb-s">Sell with the district.</h2><p style="color:#E7E4DC;max-width:50ch">Vendor applications, commission terms, payouts and verification are configured before the marketplace opens. Nothing is live yet.</p></div>
    <div>${btn('Become a vendor', '/marketplace#vendor-form', 'gold')}</div>
  </div>
</section>`,
  };
}

export function cart() {
  return {
    title: 'Your cart',
    description: 'Your AFSV VRC marketplace preview cart.',
    body: html`
${commerceHead('Your cart.', 0)}
<section class="wrap section section--flush-top" id="cart-root" data-el="cart.body" data-el-build="woo-template">
  <div class="empty-state" id="cart-empty"><p>Your cart is empty.</p>${btn('Browse the shop', '/shop', 'navy')}</div>
  <div class="cart-layout" id="cart-filled" hidden>
    <div>
      <div class="cart-head" aria-hidden="true"><span>Product</span><span style="width:130px">Quantity</span><span style="width:90px;text-align:right">Total</span></div>
      <div id="cart-lines"></div>
      <div class="panel mt-l" data-el="cart.coupon" data-el-build="woo-template" style="padding:26px">
        <h2 class="field__label mb-s" style="font-size:11.5px">Coupon code</h2>
        <p class="small mb-m">Preview test code: AFSV10</p>
        <form id="coupon-form" class="btn-row"><label class="sr-only" for="coupon">Coupon code</label><input id="coupon" type="text" placeholder="Enter code" style="flex:1;min-width:180px;font:inherit;font-size:16px;padding:13px 15px;border:1px solid var(--field)"><button type="submit" class="btn btn--line-dark">Apply</button></form>
        <p class="small mt-m" id="coupon-msg" role="status"></p>
      </div>
    </div>
    <aside class="summary" aria-labelledby="sum-h">
      <h2 id="sum-h">Order summary</h2>
      <dl class="totals" id="cart-totals"></dl>
      <div class="grand"><span>Total</span><span id="cart-total"></span></div>
      <a class="btn btn--navy btn--block" href="checkout.html">Proceed to checkout ${arrow()}</a>
      <a class="btn btn--line-dark btn--block" href="shop.html">Continue shopping</a>
      <p class="small muted mt-m">Tax shown at Ontario HST 13% on sample data. Final tax configuration requires sign-off.</p>
    </aside>
  </div>
</section>`,
  };
}

export function checkout(d) {
  return {
    title: 'Checkout',
    description: 'AFSV VRC marketplace preview checkout — test mode, no payment taken.',
    body: html`
${commerceHead('Checkout.', 1)}
<section class="wrap section section--flush-top" id="checkout-root" data-el="checkout.body" data-el-build="woo-template">
  <div class="empty-state" id="co-empty" hidden><p>There is nothing to check out. Add a product first.</p>${btn('Browse the shop', '/shop', 'navy')}</div>
  <form id="co-form" class="cart-layout" hidden>
    <div style="display:flex;flex-direction:column;gap:48px">
      <fieldset><legend>01 — Contact and billing</legend>
        <div class="form__grid">${d.billingFields.map((f) => raw(fieldHTML(f)))}</div>
      </fieldset>
      <fieldset><legend>02 — Delivery method</legend>
        <div class="ship-options">${d.ship.map((s) => html`<label><input type="radio" name="shipping" value="${s.id}"${s.id === 'standard' ? raw(' checked') : ''}><span><b>${s.label}</b><small>${s.note}</small></span><span class="cost">${s.cost ? money(s.cost) : 'Free'}</span></label>`)}</div>
      </fieldset>
      <fieldset><legend>03 — Payment</legend>
        <div class="pay-box">
          <div class="pay-box__note"><b>TEST MODE</b><span>Stripe is not connected. Nothing is charged and no card details are transmitted or stored.</span></div>
          <div class="form__grid">${d.payFields.map((f, i) => html`<div class="field${f.span === '1 / -1' ? ' field--full' : ''}"><label class="field__label" for="pay${i}">${f.label} <span class="opt">(test only)</span></label><input id="pay${i}" type="text" placeholder="${f.ph}" autocomplete="off"></div>`)}</div>
        </div>
      </fieldset>
    </div>
    <aside class="summary" aria-labelledby="co-h">
      <h2 id="co-h">Your order</h2>
      <ul class="mini-lines" id="co-lines"></ul>
      <dl class="totals" id="co-totals"></dl>
      <div class="grand"><span>Total</span><span id="co-total"></span></div>
      <label class="check mb-m" for="agree"><input type="checkbox" id="agree" required aria-describedby="agree-err"><span>I understand this is a development preview, that no payment will be taken, and that no order will be fulfilled.<span class="field__error" id="agree-err"></span></span></label>
      <button type="submit" class="btn btn--gold btn--block">Place test order</button>
      <p class="center mt-m"><a class="text-link" href="cart.html">Back to cart</a></p>
    </aside>
  </form>
</section>`,
  };
}

function fieldHTML(f) {
  const id = 'b-' + f.auto;
  return `<div class="field${f.span === '1 / -1' ? ' field--full' : ''}"><label class="field__label" for="${id}">${f.label}${f.req ? '<span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(optional)</span>'}</label><input id="${id}" type="${f.type}" placeholder="${f.ph}" autocomplete="${f.auto}"${f.req ? ' required' : ''} aria-describedby="${id}-err"><span class="field__error" id="${id}-err"></span></div>`;
}

export function orderReceived() {
  return {
    title: 'Order received',
    description: 'AFSV VRC marketplace preview order confirmation.',
    body: html`
${commerceHead('Order received.', 2)}
<section class="wrap section section--flush-top" id="order-root" data-el="order.received" data-el-build="woo-template">
  <div class="empty-state" id="order-none"><p>No order to show. Run the flow from the shop to see a confirmation.</p>${btn('Browse the shop', '/shop', 'navy')}</div>
  <div class="cart-layout" id="order-has" hidden>
    <div>
      <div class="order-meta" id="order-meta"></div>
      <h2 class="h2 h2--sm" style="margin:44px 0 22px">Order details</h2>
      <ul class="mini-lines" id="order-lines"></ul>
      <div class="note mt-l" role="note"><p class="eyebrow mb-s" style="color:var(--gold-mid)">No payment taken</p><p>This confirmation is generated by the build preview to demonstrate the completed flow. No payment was processed, no confirmation email is sent, and nothing will be shipped.</p></div>
    </div>
    <aside class="summary"><h2>Totals</h2><dl class="totals" id="order-totals"></dl><div class="grand"><span>Paid</span><span id="order-total"></span></div>${btn('Back to the shop', '/shop', 'navy')}</aside>
  </div>
</section>`,
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
