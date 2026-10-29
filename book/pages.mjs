// book.afsvvrc.com pages. Reuses the main site's components (../src/lib.mjs, ../src/pages2.mjs).
import { html, raw, breadcrumb, previewForm, formSection, ctaBand, btn, pad2 } from '../src/lib.mjs';
import { xhero, head, kgrid } from '../src/pages2.mjs';
import { sxRow, mocks } from './blocks.mjs';

// One place to change when the 360 Player portal address is final (app.afsvvrc.com is provisional).
export const APP_URL = 'https://app.afsvvrc.com';
export const MAIN = 'https://afsvvrc.com';

const steps = (items) => html`
  <ol class="psteps" data-stagger>
    ${items.map(([t, b], i) => html`<li class="psteps__item"><span class="psteps__n">${pad2(i + 1)}</span><h3>${t}</h3><p>${b}</p></li>`)}
  </ol>`;

const faq = (items) => html`
  <div class="xfaq">
    ${items.map(([q, a], i) => html`<details class="xfaq__item"${i === 0 ? raw(' open') : ''}><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`)}
  </div>`;

export const LISTING_TYPES = [
  ['facility', 'A facility or venue (field, court, dome, gym, studio…)'],
  ['program', 'A program or training provider'],
  ['academy', 'An academy'],
  ['team', 'A team or club'],
  ['school', 'A school or school board'],
  ['coach', 'A coach or trainer'],
  ['member', 'A member only (athlete, family, supporter, educator, coach)'],
  ['other', 'Something else'],
];

const SENT = 'Your registration has been received. Our team will review it and be in touch about setting up your listing.';

const registerForm = () => previewForm({
  fields: [
    { label: 'I want to be listed as', type: 'select', req: true, ph: 'Choose one', options: LISTING_TYPES, full: true },
    { label: 'Organization or facility name', hint: 'Members: leave blank.', auto: 'organization', full: true },
    { label: 'Your name', req: true, auto: 'name' },
    { label: 'Your role', auto: 'organization-title' },
    { label: 'Email', type: 'email', req: true, auto: 'email' },
    { label: 'Phone', type: 'tel', auto: 'tel' },
    { label: 'City and province / state', req: true, auto: 'address-level2' },
    { label: 'Website or social page', type: 'url', ph: 'https://' },
    { label: 'Sports or activities', ph: 'e.g. soccer, basketball, esports', full: true },
    { label: 'What would you like people to find and book?', type: 'textarea', full: true, ph: 'Spaces, programs, sessions, camps, tryouts, events…' },
  ],
  terms: true,
  topic: 'AFSV VRC booking, listings and membership',
  submit: 'Register my interest',
  status: SENT,
});

const hero = (o) => xhero({ badge: '', ...o });
const cta = () => ctaBand('Want to be listed when booking opens?', [
  { label: 'Sign up', route: '/register' },
  { label: 'Log in', route: APP_URL },
]);

const PERKS = [
  ['Star', 'Priority booking', 'Members get first access to book facilities and programs when booking opens.'],
  ['Tag', 'Member pricing', 'A member price on facilities and programs that offer one.'],
  ['Gift', 'AFSV VRC Marketplace', 'Official apparel and gear. Members hear about launches first.'],
  ['Community', 'FanZone™ and the community', 'Events, ambassadors and the Global Diaspora Network.'],
  ['Mentorship', 'Programs and development', 'Athlete development, education, life skills and GAISB AI education.'],
  ['Handshake', 'One login', 'One account for booking, listings and membership through the 360 Player portal.'],
];

// ════════════════════════ HOME ════════════════════════
export function home() {
  return {
    title: 'Book and list sports facilities, programs and academies',
    description: 'AFSV VRC Booking is where academies, teams, schools, venues and programs get listed, found and booked, with member perks. Register to be listed or log in to 360 Player.',
    ogImage: 'assets/img/whitby/soccer.jpg',
    body: html`
${hero({
  kicker: 'AFSV VRC Booking · 360 Player',
  title: 'Get found. Get booked.',
  lead: 'A home for academies, teams, schools, venues and programs to list what they offer, so athletes, parents and organizations can find it and book it in one place. Members get more.',
  img: 'whitby/soccer.jpg',
  alt: 'Young soccer players of different backgrounds training together on an indoor field',
  ctas: [{ label: 'Sign up to be listed', route: '/register' }, { label: 'Log in', route: APP_URL }],
})}
<section class="wrap section" data-el="book.status" data-el-build="elementor">
  <div class="xflag" role="note"><span aria-hidden="true">!</span><p>Public booking is not open yet. We are signing up facilities, academies and programs now, so they are listed first when it opens. Registering costs nothing and does not commit you to anything.</p></div>
</section>
<section class="wrap section section--flush-top" data-el="book.why" data-el-build="elementor">
  ${head('Why it exists', 'Built to help the people who run sport.', 'Academies, schools and venues spend their time on athletes, not on admin. This takes the booking and the finding off their plate.')}
  ${kgrid([
    ['Handshake', 'Be easy to find', 'One public place where families, teams and organizations can see who you are and what you offer.'],
    ['Growth', 'Fill your calendar', 'Show your spaces, sessions and programs with availability, so people can see what is open.'],
    ['Community', 'Reach more athletes', 'Be listed beside other facilities and academies in your area, with the details you choose to share.'],
  ])}
</section>
<section class="wrap section" data-el="book.how" data-el-build="elementor">
  ${head('How it works', 'Four steps.')}
  ${steps([
    ['Sign up', 'Tell us who you are and what you would like to list. It takes a few minutes.'],
    ['We set up your listing', 'Our team reviews your registration and works with you on your page: photos, hours, rules and what you offer.'],
    ['People find and book you', 'When booking opens, your listing and calendar are public. Visitors pick a space or program and a time.'],
    ['Manage it in 360 Player', 'Log in to the 360 Player portal to keep your listing, schedule and bookings up to date.'],
  ])}
</section>
<section class="wrap section" data-el="book.who" data-el-build="elementor">
  ${head('Who it is for', 'List it. Book it.')}
  ${kgrid([
    ['Dome', 'Venues and facilities', 'Fields, courts, domes, studios and training spaces. List your spaces with hours and availability.', ['Spaces and hours', 'Availability calendar', 'Photos and rules']],
    ['Mentorship', 'Academies, teams and schools', 'Show your programs, tryouts, camps and training, and take enquiries in one place.', ['Programs and training', 'Tryouts and camps', 'Player pathways']],
    ['Globe', 'Athletes, parents and organizations', 'Find a facility or program near you and see what is on offer before you book.', ['Browse facilities', 'See availability', 'Book when it opens']],
  ])}
  <div class="btn-row" style="margin-top:32px">${btn('For academies, teams and schools', '/academies-teams-schools', 'navy')}${btn('For venues and facilities', '/venues-and-facilities', 'line-dark')}</div>
</section>
<section class="band--cream" data-el="book.members" data-el-build="elementor">
  <div class="wrap section">
    ${head('Membership', 'Booking is the start. Members get more.', 'Listed or not, AFSV VRC members get member perks across booking and the wider AFSV VRC community.')}
    ${kgrid(PERKS.slice(0, 3))}
    <div class="btn-row" style="margin-top:32px">${btn('See membership and perks', '/membership', 'navy')}</div>
  </div>
</section>
${cta()}`,
  };
}

// ════════════════════════ SPORTS & FEATURES (one page) ════════════════════════
const SPORTS = [
  ['soccer', 'Soccer', 'Fields, academies, camps and tryouts.'],
  ['basketball', 'Basketball', 'Courts, leagues and skills training.'],
  ['cricket', 'Cricket', 'Nets, indoor pitches and coaching.'],
  ['track', 'Track & sprint', 'Speed, strength and track programs.'],
  ['esports', 'Esports', 'Teams, training and competition.'],
  ['hp', 'Performance & recovery', 'Testing, conditioning and rehab.'],
];

export function sports() {
  return {
    title: 'Sports and features: run your club from one hub',
    description: 'One place for your sport: facility booking, registration, scheduling, payments, communication, coaching content and player development. List your club, academy or venue.',
    ogImage: 'assets/img/whitby/soccer.jpg',
    body: html`
<section class="sx-hero" data-el="book.sports-hero" data-el-build="elementor">
  <div class="wrap sx-hero__grid">
    <div>
      <span class="sx-hero__pill">The all-in-one platform · 360 Player</span>
      <h1>Run your entire club from one central hub</h1>
      <p class="lead">Transform your team with one app that brings facility booking, registration, payments, communication and player development together, all in one place. Never open another application again.</p>
      <div class="btn-row btn-row--stack" style="margin-top:28px">${btn('Sign up to be listed', '/register')}${btn('See what is inside', '#features', 'line-light')}</div>
      <p class="sx-note">Features shown are planned for 360 Player. Screens are concept mock-ups with example data.</p>
    </div>
    <div class="sx-hero__ui" aria-hidden="true">${mocks.calendar()}${mocks.payments()}</div>
  </div>
</section>
<section class="wrap sx-sports" id="sports" data-el="book.sports-cards" data-el-build="elementor">
  ${head('Sports', 'Built for your sport.', 'List a facility, academy, team or program in the sport you run. More sports are added as people join.')}
  <div class="sx-sports__grid" data-stagger>
    ${SPORTS.map(([img, name, blurb]) => html`<a class="sx-sport" href="register.html"><img src="assets/img/whitby/${img}.jpg" alt="" width="640" height="420" loading="lazy"><span class="sx-sport__t"><b>${name}</b><span>${blurb}</span></span></a>`)}
    <a class="sx-sport" href="register.html" style="background:var(--navy-3)"><span class="sx-sport__t"><b>Another sport?</b><span>Tell us what you run and we will add it.</span></span></a>
  </div>
</section>
<section class="wrap section" id="features" data-el="book.features-intro" data-el-build="elementor" style="padding-bottom:24px">
  <div class="sx-intro">
    <p class="eyebrow">Features</p>
    <h2 class="h2">Everything your club runs on, in one place.</h2>
    <p class="body-lg muted">Running a club usually means a dozen tools that do not talk to each other. Here is what changes when it is all in one hub.</p>
  </div>
</section>
${sxRow({ id: 'booking', label: 'Facility booking', title: 'Find the space. Book the time. Done.', before: 'Fields get booked by phone, text and favour, and someone always turns up to a locked gate.',
  points: ['Browse facilities with photos, hours, rules and a clear next open time.', 'A live calendar shows what is free, booked or blocked, so nobody double-books.', 'A booking is confirmed once payment goes through, with a reminder the day before.', 'Members get priority booking and member pricing.'], mock: 'calendar', link: ['Venues: list your space', '/venues-and-facilities'] })}
${sxRow({ id: 'registration', label: 'Registration', title: 'From sign-up to roster, without the spreadsheet.', before: 'A form here, a spreadsheet there, and an inbox full of the same five questions.',
  points: ['One registration for every program: recreational, travel, camps, adult leagues.', 'Each program has its own age rules, questions and fee.', 'Families register from a phone and returning families skip what we already know.', 'Run tryouts, place players on teams and keep a waitlist when a camp fills.'], mock: 'register', flip: true })}
${sxRow({ id: 'scheduling', label: 'Scheduling', title: 'A whole season on one calendar.', before: 'Sticky notes, clashing bookings and last-minute changes that have to be made in four places.',
  points: ['Add your fields, courts and rooms once, then plan teams into them.', 'Clashes show up before you save, not at the gate on Saturday.', 'Change an event once and everyone affected is told.', 'See who is coming without chasing replies.'], mock: 'calendar' })}
${sxRow({ id: 'payments', label: 'Payments', title: 'Get paid without the awkward follow-up.', before: 'Working out who has paid takes a spreadsheet nobody trusts and reminders nobody wants to send.',
  points: ['Set a fee once, for the season, the month, a camp or a kit order.', 'Reminders go out automatically and families pay online by card.', 'See paid, due and overdue at a glance.', 'Prices in USD with CAD shown, and member pricing where it applies.'], mock: 'payments', flip: true })}
${sxRow({ id: 'communication', label: 'Communication', title: 'Every message, in one place.', before: 'Group chats, personal texts and emails mean someone always says "I never got that".',
  points: ['Post once to a team, several groups or the whole club.', 'Notifications and email reach everyone, not just the people who check the chat.', 'Clear rules on who can message whom.', 'Safeguarding rules for chats involving young people, to be confirmed with our legal team.'], mock: 'chat' })}
${sxRow({ id: 'website', label: 'Your public page', title: 'A front page your club can be proud of.', before: 'An out-of-date website that nobody has time to update.',
  points: ['Your listing page shows your events, teams and sign-up links.', 'It updates itself from the schedule and registrations.', 'Photos, location, rules and contact details you choose to share.', 'People find you beside other clubs and facilities in the area.'], mock: 'website', flip: true })}
${sxRow({ id: 'coaching', label: 'Coaching content', title: 'Your coaching, kept where everyone can find it.', before: 'Drills in binders, PDFs and someone’s back pocket. When that coach leaves, the knowledge goes too.',
  points: ['One shared library for drills, exercises and session plans.', 'Draw a drill with a simple board, no design skills needed.', 'Share with one team or the whole club.', 'Drop a session plan straight into the calendar.'], mock: 'library' })}
${sxRow({ id: 'development', label: 'Player development', title: 'Every player seen. Every step tracked.', before: 'Progress lives in one coach’s head, and a new coach starts from nothing.',
  points: ['A profile for each player, with goals and reviews.', 'Review templates so every player gets the same attention.', 'Development pathways from first sign-up to the next level.', 'The record stays with the player when coaches change.'], mock: 'profile', flip: true })}
${sxRow({ id: 'stats', label: 'Stats and insights', title: 'The numbers your club needs, without the spreadsheets.', before: 'Attendance, minutes and effort kept on paper, if they are kept at all.',
  points: ['Attendance and minutes played tracked as you go.', 'Training load by player and team.', 'Stats that suit the sport, from goals and assists to serve and sprint times.', 'Turn the numbers into conversations with players and parents.'], mock: 'stats' })}
${sxRow({ id: 'video', label: 'Video', title: 'Turn footage into something coaches use.', before: 'Match video sits on a phone and never gets watched with the player.', 
  points: ['Bring your footage into one place from the sources you already use.', 'Clip, annotate and share the moments that matter.', 'Tag players so clips appear on their profile.', 'Build playlists across matches or sessions.'], mock: 'video', flip: true })}
${sxRow({ id: 'leagues', label: 'Leagues and tournaments', title: 'Run a league or a tournament weekend with one tool.', before: 'Fixtures in one file, results in a group chat and standings in somebody’s head.',
  points: ['Set up leagues and tournaments in the format you need.', 'Fixtures, results and standings update together.', 'Invite outside teams into the same draw.', 'Show live results to everyone watching.'], mock: 'league' })}
<section class="band--cream" id="app" data-el="book.app" data-el-build="elementor">
  <div class="wrap section sx-app">
    ${mocks.phone()}
    <div>
      <p class="eyebrow eyebrow-rule">Mobile app</p>
      <h2 class="h2">Your whole club in your pocket.</h2>
      <p class="body-lg muted">Most of the club happens away from a desk. 360 Player is designed to work on a phone.</p>
      <ul class="sx-points">
        <li><b>Parents</b> register, pay, see schedules and get updates in one place.</li>
        <li><b>Coaches</b> see their sessions, take attendance and message their team.</li>
        <li><b>Members</b> show a digital membership card at the door.</li>
        <li><b>Facility managers</b> see today's bookings and blocked times.</li>
      </ul>
      <p class="small muted">Concept screens. App availability and platforms to be confirmed.</p>
    </div>
  </div>
</section>
<section class="wrap section" id="facilities" data-el="book.facility-examples" data-el-build="elementor">
  ${head('Facilities', 'Find a space near you.', 'Every facility gets its own page. These are examples of how listings will look. No real facilities are listed yet.')}
  <div class="sx-fac">${mocks.facility()}${mocks.facility()}${mocks.facility()}</div>
</section>
<section class="band--cream" data-el="book.member-card" data-el-build="elementor">
  <div class="wrap section sx-app" style="grid-template-columns:1.1fr .9fr">
    <div>
      <p class="eyebrow eyebrow-rule">Membership</p>
      <h2 class="h2">Members book first and pay less.</h2>
      <p class="body-lg muted">AFSV VRC members get priority booking and member pricing, plus the Marketplace, FanZone™ and programs. Benefits and pricing are pending approval.</p>
      <p>${btn('See membership', '/membership', 'navy')}</p>
    </div>
    ${mocks.member()}
  </div>
</section>
${cta()}`,
  };
}

// ════════════════════════ MEMBERSHIP ════════════════════════
export function membership() {
  return {
    title: 'Membership and perks',
    description: 'AFSV VRC membership: priority booking, member pricing and access to the Marketplace, FanZone and programs. Register your interest.',
    ogImage: 'assets/img/life/lounge.jpg',
    body: html`
${breadcrumb([{ label: 'Membership and perks' }])}
${hero({
  kicker: 'Membership',
  title: 'Book first. Belong more.',
  lead: 'Membership connects athletes, families, supporters, educators and organizations to booking and the wider AFSV VRC community.',
  img: 'life/lounge.jpg',
  alt: 'Concept rendering: diverse members cheering together in a fan lounge overlooking a floodlit pitch',
  ctas: [{ label: 'Register my interest', route: '/register' }, { label: 'Membership on afsvvrc.com', route: `${MAIN}/membership` }],
})}
<section class="wrap section" data-el="book.perks" data-el-build="elementor">
  ${head('Perks', 'What members can look forward to.', 'Booking is the headline: priority access and member pricing. The rest comes with being part of AFSV VRC.')}
  ${kgrid(PERKS)}
  <p class="small muted" style="margin-top:24px;max-width:70ch">Membership is at registration-of-interest stage. Benefits, pricing and launch timing are shared as they are approved. Marketplace products are display-only for now.</p>
</section>
<section class="band--cream" data-el="book.pathways" data-el-build="elementor">
  <div class="wrap section">
    ${head('Pathways', 'Proposed membership pathways.')}
    ${kgrid([
      ['Soccer', 'Athlete', 'Priority booking and member pricing for training and facilities.'],
      ['Community', 'Family', 'Find and book programs and sessions for the whole family.'],
      ['Star', 'Supporter', 'Be part of the AFSV VRC community and FanZone™.'],
      ['Mentorship', 'Educator & Coach', 'List and book spaces and programs for your learners and teams.'],
      ['Building', 'Corporate & Community', 'For organizations. A membership category, not a sponsorship or partnership.'],
    ], { cols: 3 })}
    <p class="small muted" style="margin-top:24px">Benefits and pricing pending approval.</p>
  </div>
</section>
<section class="wrap section" data-el="book.more" data-el-build="elementor">
  ${head('More from AFSV VRC', 'Explore the rest.')}
  <div class="btn-row">${btn('Marketplace', `${MAIN}/marketplace`, 'navy')}${btn('FanZone™', `${MAIN}/fanzone`, 'line-dark')}${btn('Programs', `${MAIN}/programs`, 'line-dark')}${btn('Whitby Sports Village', `${MAIN}/whitby-smart-sports-village`, 'line-dark')}</div>
</section>
${cta()}`,
  };
}

// ════════════════════════ ACADEMIES, TEAMS, SCHOOLS ════════════════════════
export function academies() {
  return {
    title: 'For academies, teams and schools',
    description: 'List your academy, team or school on AFSV VRC Booking. Show programs, tryouts and training, and take enquiries in one place.',
    ogImage: 'assets/img/life/academy.jpg',
    body: html`
${breadcrumb([{ label: 'Academies, teams and schools' }])}
${hero({
  kicker: 'For academies, teams and schools',
  title: 'Less admin. More athletes.',
  lead: 'We are here to help you be found and booked, so you can spend your time developing players.',
  img: 'life/academy.jpg',
  alt: 'Concept rendering: a diverse group of students and coaches in an academy training hall',
  ctas: [{ label: 'Sign up to be listed', route: '/register' }, { label: 'Log in', route: APP_URL }],
})}
${sxRow({ id: 'a-register', label: 'Registration', title: 'Sign up players without the spreadsheet.', before: 'Tryout forms, spreadsheets and an inbox full of the same questions take weeks away from coaching.',
  points: ['One registration for every program, camp and tryout, each with its own rules and fee.', 'Families sign up from a phone and pay in the same step.', 'Place players on teams and keep a waitlist when a program fills.'], mock: 'register' })}
${sxRow({ id: 'a-coach', label: 'Coaching content', title: 'Keep your coaching where everyone can use it.', before: 'Drills in binders and PDFs disappear when a coach moves on.',
  points: ['One shared library of drills and session plans.', 'Share with a team or the whole academy.', 'Session plans go straight into the calendar.'], mock: 'library', flip: true })}
${sxRow({ id: 'a-dev', label: 'Player development', title: 'Show families how their player is growing.', before: 'Progress lives in a coach\u2019s head, so families only hear about it at the end of the season.',
  points: ['A profile for every player with goals and reviews.', 'Pathways from first sign-up to the next level.', 'The record stays with the player when coaches change.'], mock: 'profile' })}
<section class="wrap section" data-el="book.academy-more" data-el-build="elementor" style="padding-top:0">
  <p class="body-lg" style="max-width:70ch">Need the full picture? <a class="text-link" href="sports.html">See every feature on the Sports page</a>. Listed academies and their families also get access to <a class="text-link" href="membership.html">membership perks</a>.</p>
</section>
${formSection({
  id: 'register-academy', el: 'book.academy-form',
  title: 'Register your academy, team or school.',
  lead: 'Tell us about you and what you would like to list. We will be in touch to set up your page.',
  note: raw('Prefer to talk first? <a class="text-link" href="contact.html">Contact us</a>.'),
  form: registerForm(),
})}`,
  };
}

// ════════════════════════ VENUES AND FACILITIES ════════════════════════
export function venues() {
  return {
    title: 'For venues and facility partners',
    description: 'List your sports facility on AFSV VRC Booking. Show your spaces, hours and availability, and let people book.',
    ogImage: 'assets/img/whitby/dome.jpg',
    body: html`
${breadcrumb([{ label: 'Venues and facilities' }])}
${hero({
  kicker: 'For venues and facility partners',
  title: 'Put your space on the calendar.',
  lead: 'Fields, courts, domes, gyms and studios: list yours, set your hours and prices, and let people see what is open.',
  img: 'whitby/dome.jpg',
  alt: 'Concept rendering: a large indoor dome with a multi-sport field and spectators',
  ctas: [{ label: 'Sign up to be listed', route: '/register' }, { label: 'Log in', route: APP_URL }],
})}
${sxRow({ id: 'v-booking', label: 'Booking calendar', title: 'Put your space on the calendar and let it fill.', before: 'Bookings by phone and text leave gaps in the week, and a double booking costs you a customer.',
  points: ['Set your hours, slot length, blocked times and availability.', 'People see what is open and book it themselves.', 'A booking is confirmed only after payment, so no double bookings.'], mock: 'calendar' })}
${sxRow({ id: 'v-page', label: 'Your facility page', title: 'A page that shows your space at its best.', before: 'Your space is hard to find unless someone already knows it.',
  points: ['Photos, description, location, rules and capacity.', 'Price and member price, shown in USD with CAD alongside.', 'Listed beside other facilities in the area.'], mock: 'facility', flip: true })}
${sxRow({ id: 'v-pay', label: 'Payments and bookings', title: 'Get paid up front and see your bookings.', before: 'Chasing payment after the session and tracking who owes what.',
  points: ['Customers pay online when they book.', 'Facility managers see only their own facilities and bookings.', 'Cancel, reschedule or refund when plans change.'], mock: 'payments' })}
${formSection({
  id: 'register-venue', el: 'book.venue-form',
  title: 'Register your facility.',
  lead: 'Tell us about your space and what you would like to list. Our team will follow up to set up your page.',
  form: registerForm(),
})}`,
  };
}

// ════════════════════════ SIGN UP ════════════════════════
export function register() {
  return {
    title: 'Sign up to be listed',
    description: 'Register where you want to be listed on AFSV VRC Booking: facility, program, academy, team or school, or as a member.',
    ogImage: 'assets/img/whitby/soccer.jpg',
    body: html`
${breadcrumb([{ label: 'Sign up' }])}
<section class="wrap section" data-el="book.register-intro" data-el-build="elementor" style="padding-bottom:24px">
  <p class="eyebrow eyebrow-rule">Sign up</p>
  <h1 class="h1">Where do you want to be listed?</h1>
  <p class="lead measure">Tell us who you are and what you would like people to find and book. Our team reviews every registration and works with you to set up your listing. Already registered? <a class="text-link" href="${APP_URL}">Log in</a>.</p>
</section>
${formSection({
  id: 'register', el: 'book.register-form', cls: 'section--flush-top',
  title: 'Your details.',
  lead: 'Registering costs nothing and does not commit you to anything.',
  note: raw('Questions first? <a class="text-link" href="faq.html">Read the FAQs</a> or <a class="text-link" href="contact.html">contact us</a>.'),
  form: registerForm(),
})}`,
  };
}

// ════════════════════════ LOG IN ════════════════════════
export function login() {
  return {
    title: 'Log in',
    description: 'Log in to the 360 Player portal to manage your AFSV VRC listings, schedule and bookings.',
    ogImage: 'assets/img/whitby/soccer.jpg',
    body: html`
${breadcrumb([{ label: 'Log in' }])}
<section class="wrap section" data-el="book.login" data-el-build="elementor">
  <p class="eyebrow eyebrow-rule">Log in</p>
  <h1 class="h1">Welcome back.</h1>
  <p class="lead measure">Members and listed facilities, academies and programs sign in through the 360 Player portal to manage listings, schedules and bookings.</p>
  <div class="btn-row" style="margin-top:28px">${btn('Go to the 360 Player portal', APP_URL, 'gold')}${btn('New here? Sign up', '/register', 'line-dark')}</div>
  <p class="small muted" style="margin-top:20px">You will be taken to the portal to sign in. Trouble signing in? <a class="text-link" href="contact.html">Contact us</a>.</p>
</section>`,
  };
}

// ════════════════════════ FAQ ════════════════════════
export function faqPage() {
  return {
    title: 'FAQs',
    description: 'Answers about listing, booking and membership on AFSV VRC Booking: who can list, what it costs to register, and when booking opens.',
    ogImage: 'assets/img/whitby/soccer.jpg',
    body: html`
${breadcrumb([{ label: 'FAQs' }])}
<section class="wrap section" data-el="book.faq" data-el-build="elementor">
  <p class="eyebrow eyebrow-rule">FAQs</p>
  <h1 class="h1">Questions, answered.</h1>
  ${faq([
    ['What is AFSV VRC Booking?', 'A website where facilities, academies, teams, schools and programs can be listed, and where people can find them and, once booking opens, book them. It is connected to the 360 Player portal.'],
    ['Can I book today?', 'Not yet. Public booking is switched on at activation. Right now we are signing up the facilities and programs that will be listed first.'],
    ['What does it cost to register?', 'Registering your interest is free and does not commit you to anything. Any fees will be explained to you before you agree to anything.'],
    ['Who can be listed?', 'Facilities and venues, program and training providers, academies, teams and clubs, schools and coaches.'],
    ['What do members get?', 'Priority booking and member pricing on booking, plus the wider AFSV VRC community. Benefits and pricing are still being approved. See the membership page.'],
    ['What happens after I sign up?', 'Our team reviews your registration and contacts you to set up your listing: photos, hours, rules and what you offer.'],
    ['How do I log in?', 'Use the Log in button to go to the 360 Player portal.'],
    ['How do I get in touch?', 'Email info@afsvvrc.com or use the contact page.'],
  ])}
</section>
${cta()}`,
  };
}

// ════════════════════════ CONTACT ════════════════════════
export function contact() {
  return {
    title: 'Contact and support',
    description: 'Contact the AFSV VRC Booking team about listings, booking and support.',
    ogImage: 'assets/img/whitby/soccer.jpg',
    body: html`
${breadcrumb([{ label: 'Contact' }])}
${formSection({
  id: 'contact', el: 'book.contact-form',
  title: 'Get in touch.',
  lead: 'Questions about listing, booking or the 360 Player portal? Send us a message or email info@afsvvrc.com.',
  form: previewForm({
    fields: [
      { label: 'Your name', req: true, auto: 'name' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Organization', auto: 'organization', full: true },
      { label: 'How can we help?', type: 'textarea', req: true, full: true },
    ],
    topic: 'AFSV VRC booking, listings and membership',
    submit: 'Send message',
    status: 'Thanks. We have your message and will reply soon.',
  }),
})}`,
  };
}

export function notFound() {
  return {
    title: 'Page not found',
    description: 'That page could not be found.',
    ogImage: 'assets/img/whitby/soccer.jpg',
    body: html`<section class="wrap section"><h1 class="h1">Page not found.</h1><p class="lead">That page does not exist.</p><div class="btn-row">${btn('Back to home', '/', 'navy')}</div></section>`,
  };
}
