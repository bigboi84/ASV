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
export const cta = () => ctaBand('Want to be listed when booking opens?', [
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
    ogImage: 'assets/img/photos/hero.jpg',
    body: html`
${hero({
  kicker: 'AFSV VRC Booking · 360 Player',
  title: 'Get found. Get booked.',
  lead: 'A home for academies, teams, schools, venues and programs to list what they offer, so athletes, parents and organizations can find it and book it in one place. Members get more.',
  img: 'assets/img/photos/hero.jpg',
  alt: 'Youth athletes of different backgrounds training on a field and a court inside a lit sports dome',
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

// ════════════════════════ MEMBERSHIP ════════════════════════
export function membership() {
  return {
    title: 'Membership and perks',
    description: 'AFSV VRC membership: priority booking, member pricing and access to the Marketplace, FanZone and programs. Register your interest.',
    ogImage: 'assets/img/photos/lounge.jpg',
    body: html`
${breadcrumb([{ label: 'Membership and perks' }])}
${hero({
  kicker: 'Membership',
  title: 'Book first. Belong more.',
  lead: 'Membership connects athletes, families, supporters, educators and organizations to booking and the wider AFSV VRC community.',
  img: 'assets/img/photos/lounge.jpg',
  alt: 'Families and athletes relaxing in a members lounge overlooking an indoor field',
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
    ogImage: 'assets/img/photos/academy.jpg',
    body: html`
${breadcrumb([{ label: 'Academies, teams and schools' }])}
${hero({
  kicker: 'For academies, teams and schools',
  title: 'Less admin. More athletes.',
  lead: 'We are here to help you be found and booked, so you can spend your time developing players.',
  img: 'assets/img/photos/academy.jpg',
  alt: 'Coaches and a racially diverse group of young athletes in a team huddle',
  ctas: [{ label: 'Sign up to be listed', route: '/register' }, { label: 'Log in', route: APP_URL }],
})}
${sxRow({ id: 'a-register', label: 'Registration', title: 'Sign up players without the spreadsheet.', before: 'Tryout forms, spreadsheets and an inbox full of the same questions take weeks away from coaching.',
  points: ['One registration for every program, camp and tryout, each with its own rules and fee.', 'Families sign up from a phone and pay in the same step.', 'Place players on teams and keep a waitlist when a program fills.'], shots: [['registration-rostering.avif', 'Rostering players onto teams'], ['registration-camps.avif', 'Camp week with places filled']] })}
${sxRow({ id: 'a-coach', label: 'Coaching content', title: 'Keep your coaching where everyone can use it.', before: 'Drills in binders and PDFs disappear when a coach moves on.',
  points: ['One shared library of drills and session plans.', 'Share with a team or the whole academy.', 'Session plans go straight into the calendar.'], shots: [['training.avif', 'Exercise drawing tool and session library']], flip: true })}
${sxRow({ id: 'a-dev', label: 'Player development', title: 'Show families how their player is growing.', before: 'Progress lives in a coach\u2019s head, so families only hear about it at the end of the season.',
  points: ['A profile for every player with goals and reviews.', 'Pathways from first sign-up to the next level.', 'The record stays with the player when coaches change.'], shots: [['player-profile.avif', 'Player profile with statistics']] })}
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
    ogImage: 'assets/img/photos/dome-exterior.jpg',
    body: html`
${breadcrumb([{ label: 'Venues and facilities' }])}
${hero({
  kicker: 'For venues and facility partners',
  title: 'Put your space on the calendar.',
  lead: 'Fields, courts, domes, gyms and studios: list yours, set your hours and prices, and let people see what is open.',
  img: 'assets/img/photos/dome-exterior.jpg',
  alt: 'A white sports dome beside outdoor fields at dusk',
  ctas: [{ label: 'Sign up to be listed', route: '/register' }, { label: 'Log in', route: APP_URL }],
})}
${sxRow({ id: 'v-booking', label: 'Booking calendar', title: 'Put your space on the calendar and let it fill.', before: 'Bookings by phone and text leave gaps in the week, and a double booking costs you a customer.',
  points: ['Set your hours, slot length, blocked times and availability.', 'People see what is open and book it themselves.', 'A booking is confirmed only after payment, so no double bookings.'], shots: [['scheduling-booked.avif', 'Field map with available and booked areas'], ['scheduling-resources.avif', 'Facilities list with arena and dressing rooms']] })}
${sxRow({ id: 'v-page', label: 'Your facility page', title: 'A page that shows your space at its best.', before: 'Your space is hard to find unless someone already knows it.',
  points: ['Photos, description, location, rules and capacity.', 'Price and member price, shown in USD with CAD alongside.', 'Listed beside other facilities in the area.'], mock: 'facility', flip: true })}
${sxRow({ id: 'v-pay', label: 'Payments and bookings', title: 'Get paid up front and see your bookings.', before: 'Chasing payment after the session and tracking who owes what.',
  points: ['Customers pay online when they book.', 'Facility managers see only their own facilities and bookings.', 'Cancel, reschedule or refund when plans change.'], shots: [['payments-dashboard.avif', 'Payments dashboard'], ['payments-reminder.avif', 'New invoice notification']] })}
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
    ogImage: 'assets/img/photos/hero.jpg',
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
    ogImage: 'assets/img/photos/hero.jpg',
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
    ogImage: 'assets/img/photos/hero.jpg',
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
    ogImage: 'assets/img/photos/hero.jpg',
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
    ogImage: 'assets/img/photos/hero.jpg',
    body: html`<section class="wrap section"><h1 class="h1">Page not found.</h1><p class="lead">That page does not exist.</p><div class="btn-row">${btn('Back to home', '/', 'navy')}</div></section>`,
  };
}
