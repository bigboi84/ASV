// book.afsvvrc.com pages. Reuses the main site's components (../src/lib.mjs, ../src/pages2.mjs).
import { html, raw, breadcrumb, previewForm, formSection, ctaBand, btn, pad2 } from '../src/lib.mjs';
import { xhero, head, kgrid } from '../src/pages2.mjs';

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

// ════════════════════════ WHAT YOU CAN FIND ════════════════════════
export function whatsListed() {
  return {
    title: 'What you can list and book',
    description: 'Facilities, programs and training, player development and a live calendar: what will be listed and bookable on AFSV VRC Booking.',
    ogImage: 'assets/img/whitby/basketball.jpg',
    body: html`
${breadcrumb([{ label: 'What you can list and book' }])}
${hero({
  kicker: 'Listings',
  title: 'Everything in one place.',
  lead: 'This is what the public will be able to find here as facilities and programs join. Each listing shows what its owner wants people to know.',
  img: 'whitby/basketball.jpg',
  alt: 'Young basketball players of different backgrounds in an indoor training session',
  ctas: [{ label: 'Sign up to be listed', route: '/register' }],
})}
<section class="wrap section" data-el="book.types" data-el-build="elementor">
  ${head('Listings', 'What will be listed.', 'Booking opens when we activate it. Until then we are signing up the facilities and programs that will appear first.')}
  ${kgrid([
    ['Dome', 'Facilities', 'Fields, courts, domes, gyms and studios, each with a page: gallery, hours, rules and a Book button.', ['Operating days and hours', 'Pricing and member pricing', 'Rules and capacity']],
    ['Soccer', 'Calendar and availability', 'A calendar showing which slots are open, so people book a time that is actually free.', ['Open slots at a glance', 'Blocked times honoured', 'No double booking']],
    ['Mentorship', 'Programs and training', 'Camps, clinics, tryouts and regular training, each with a schedule and an enquiry button.', ['Schedule and price', 'Enquiry button', 'Run by the listing owner']],
    ['Growth', 'Player development', 'Pathways that show athletes and parents how to progress, with clear next steps.', ['Pathway content', 'Links to programs']],
    ['Star', 'Member benefits', 'Priority booking and member pricing for AFSV VRC members.', ['Priority booking', 'Member pricing']],
    ['Lock', 'One sign-in', 'One account for the 360 Player portal. Facility owners manage only their own listings.', ['Your listings only', 'Update any time']],
  ])}
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
<section class="wrap section" data-el="book.academy-benefits" data-el-build="elementor">
  ${head('What you get', 'A listing that works for you.')}
  ${kgrid([
    ['Megaphone', 'A public page', 'Your name, story, programs and contact details, published where families and organizations are looking.'],
    ['Soccer', 'Programs, tryouts and camps', 'List sessions with dates, ages, price and an enquiry button.'],
    ['Handshake', 'Book the facilities you need', 'Find and book venues for training and games alongside your own listing.'],
    ['Chart', 'Simple management', 'Update your listing and see enquiries and bookings in the 360 Player portal.'],
  ], { cols: 4 })}
  <p class="body-lg" style="margin-top:28px;max-width:70ch">Listed academies and their families also get access to membership perks. <a class="text-link" href="membership.html">See membership</a>.</p>
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
<section class="wrap section" data-el="book.venue-benefits" data-el-build="elementor">
  ${head('What you control', 'Your space, your rules.')}
  ${kgrid([
    ['Dome', 'Your facility page', 'Gallery, description, location, rules and capacity.'],
    ['Soccer', 'Hours and slots', 'Set operating days and hours, slot length, blocked times and availability.'],
    ['Tag', 'Pricing', 'Set a price and a member price. Prices show in USD with CAD alongside.'],
    ['Shield', 'Your bookings, your view', 'Facility managers see only their own facilities and bookings.'],
  ], { cols: 4 })}
</section>
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
