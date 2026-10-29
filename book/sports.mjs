// book.afsvvrc.com — Sports & features: one selling page for the whole 360 Player platform.
// Each feature section summarises one 360 Player product page in our own words: the struggle first, then the fix.
// Product screens are 360 Player's (book/img/360, permission to be confirmed); photos are ours (book/img/photos).
import { html, raw, btn } from '../src/lib.mjs';
import { head } from '../src/pages2.mjs';
import { sxRow, shot, mocks } from './blocks.mjs';
import { cta } from './pages.mjs';

// The 11 sports 360 Player supports, plus the ones the AFSV VRC village is planned around.
const SPORTS = [
  ['soccer', 'Soccer', 'Academies, travel teams, camps and house leagues.'],
  ['basketball', 'Basketball', 'Court time, leagues, skills and tryouts.'],
  ['volleyball', 'Volleyball', 'Indoor clubs, beach programs and tournaments.'],
  ['football', 'Football', 'Youth and high school programs, flag and tackle.'],
  ['handball', 'Handball', 'Club teams, training and match days.'],
  ['tennis', 'Tennis', 'Lessons, junior programs and court booking.'],
  ['padel', 'Padel', 'Court booking, coaching and social play.'],
  ['ice-hockey', 'Ice hockey', 'Ice time, house leagues and rep teams.'],
  ['rugby', 'Rugby', 'Club rugby, sevens and youth sections.'],
  ['lacrosse', 'Lacrosse', 'Field and box programs, camps and teams.'],
  ['floorball', 'Floorball', 'Gym time, school programs and leagues.'],
  ['cricket', 'Cricket', 'Indoor nets, coaching and club cricket.'],
  ['track', 'Track & sprint', 'Speed, sprint and track programs.'],
  ['esports', 'Esports', 'Teams, training rooms and competition.'],
  ['performance', 'Performance & recovery', 'Strength, testing and rehab sessions.'],
];

const group = (id, eyebrow, title, lead) => html`
<section class="wrap section" id="${id}" data-el="book.group-${id}" data-el-build="elementor" style="padding-bottom:8px">
  <div class="sx-intro"><p class="eyebrow">${eyebrow}</p><h2 class="h2">${title}</h2><p class="body-lg muted">${lead}</p></div>
</section>`;

const faq = (items) => html`
  <div class="xfaq">
    ${items.map(([q, a], i) => html`<details class="xfaq__item"${i === 0 ? raw(' open') : ''}><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`)}
  </div>`;

export function sports() {
  return {
    title: 'Sports and features: run your club from one hub',
    description: 'Booking, registration, scheduling, payments, communication, coaching content, player development, stats, video and leagues in one hub, for 15 sports. List your club, academy or venue.',
    ogImage: 'assets/img/photos/hero.jpg',
    body: html`
<section class="sx-hero sx-hero--photo" data-el="book.sports-hero" data-el-build="elementor">
  <img src="assets/img/photos/hero.jpg" alt="" width="1600" height="900" fetchpriority="high">
  <div class="wrap sx-hero__grid">
    <div>
      <span class="sx-hero__pill">The all-in-one platform · 360 Player</span>
      <h1>Run your entire club from one central hub</h1>
      <p class="lead">Transform your team with one app that brings facility booking, registration, payments, communication and player development together, all in one place. Never open another application again.</p>
      <div class="btn-row btn-row--stack" style="margin-top:28px">${btn('Sign up to be listed', '/register')}${btn('See every feature', '#features', 'line-light')}</div>
      <p class="sx-note">Club tools run on the 360 Player platform. Public facility booking on book.afsvvrc.com opens at activation.</p>
    </div>
    <div class="sx-hero__ui">${shot([['scheduling-hero.avif', 'Bookings calendar showing practices and games across fields'], ['scheduling-booked.avif', 'Field map with available and booked areas']])}</div>
  </div>
</section>

<section class="wrap sx-sports" id="sports" data-el="book.sports-cards" data-el-build="elementor">
  ${head('Sports', 'Built for your sport.', 'Competitive or recreational, club or academy, field or court. List a facility, team or program in any of these sports.')}
  <div class="sx-sports__grid" data-stagger>
    ${SPORTS.map(([img, name, blurb]) => html`<a class="sx-sport" href="register.html"><img src="assets/img/photos/${img}.jpg" alt="" width="1200" height="800" loading="lazy"><span class="sx-sport__t"><b>${name}</b><span>${blurb}</span></span></a>`)}
    <a class="sx-sport sx-sport--more" href="register.html"><span class="sx-sport__t"><b>Another sport?</b><span>Tell us what you run and we will add it.</span></span></a>
  </div>
</section>

<section class="band--cream" data-el="book.struggle" data-el-build="elementor">
  <div class="wrap section sx-pain">
    <img src="assets/img/photos/struggle.jpg" alt="Before and after: a club volunteer overwhelmed by paper schedules, then calmly planning with one tool" width="1200" height="800" loading="lazy">
    <div>
      <p class="eyebrow eyebrow-rule">Sound familiar?</p>
      <h2 class="h2">Most clubs run on goodwill and ten different tools.</h2>
      <ul>
        <li>Fields booked by phone, text and favour, then double-booked on Saturday.</li>
        <li>Fees tracked in a spreadsheet nobody fully trusts.</li>
        <li>Registration in a form, a spreadsheet and an inbox full of the same questions.</li>
        <li>Updates lost across five group chats, and "I never got that".</li>
        <li>Drills in binders and PDFs that leave when the coach does.</li>
      </ul>
      <p class="sx-pain__fix">There is a better way: one hub for all of it.</p>
    </div>
  </div>
</section>

<section class="wrap section" id="features" data-el="book.pillars" data-el-build="elementor">
  ${head('Connect it all', 'Two sides of every club, in one place.', 'Run the club and develop the players with tools that share the same data, so nothing is typed twice.')}
  <div class="sx-tools" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
    <a class="sx-tool" href="#run" style="text-decoration:none;color:inherit"><img src="assets/img/360/management.avif" alt="Management tools: registrations, payments and website" style="width:100%;border-radius:14px;margin-bottom:14px" loading="lazy"><h3>Run the club</h3><p>Booking, registration, scheduling, payments, communication and your website.</p></a>
    <a class="sx-tool" href="#develop" style="text-decoration:none;color:inherit"><img src="assets/img/360/sports-development.avif" alt="Sports development tools: video, training library and stats" style="width:100%;border-radius:14px;margin-bottom:14px" loading="lazy"><h3>Develop the players</h3><p>Coaching content, player development, stats and insights, video, leagues and tournaments.</p></a>
  </div>
</section>

${group('run', 'Run the club', 'Less admin. More sport.', 'Everything behind the scenes, from the first booking to the last payment.')}
${sxRow({ id: 'booking', label: 'Facility booking', title: 'Find the space. Book the time. Done.',
  intro: 'Every field, court and room has its own calendar, so everyone can see what is free before they commit.',
  before: 'Fields get booked by phone, text and favour, and someone always turns up to find the pitch already taken.',
  points: ['Map each facility the way it is really used: split a full field into halves, or a gym into court time and the weight room.', 'Open, booked and blocked times show live, and a clash is flagged before anything is saved.', 'On book.afsvvrc.com the public picks a space and a time, and the booking is confirmed once payment goes through.', 'A reminder goes out the day before. Members book first and pay the member price.'],
  shots: [['scheduling-booked.avif', 'Field map showing available and booked halves'], ['scheduling-available.avif', 'Field map with every area available']], link: ['Venues: list your space', '/venues-and-facilities'] })}
${sxRow({ id: 'registration', label: 'Registration', title: 'From sign-up to roster, without the spreadsheet.', flip: true,
  intro: 'One registration covers every program you run: recreational, travel, camps and adult leagues.',
  before: 'A form here, a spreadsheet there, a payment app that connects to neither, and an inbox full of the same five questions.',
  points: ['Each program gets its own age rules, questions and price, and families only see what applies to them.', 'Parents register on their phone in minutes. Returning families find their details already filled in.', 'Run tryouts, then drag players onto teams. Camps cap their numbers and a waitlist takes over when they fill.', 'Every new player lands in the right team, chat group and payment list. One registration, nothing typed twice.'],
  shots: [['registration-hero.avif', 'Registration overview with packages and sign-ups'], ['registration-packages.avif', 'Spring tryouts registration with questions and packages']] })}
${sxRow({ id: 'scheduling', label: 'Scheduling', title: 'A whole season, planned in an afternoon.',
  intro: 'One person plans every team, every facility and every session, then publishes it all at once.',
  before: 'Sticky notes and spreadsheets for dozens of teams, coaches asking where they train, and every change made in four places.',
  points: ['Build a template: teams, days, times and session types, with clashes caught as you go.', 'Pick a date range, publish, and every team calendar fills in at once.', 'Move a session once and everyone affected is told automatically.', 'Attendance runs itself: players who do not confirm are marked absent, and admins see attendance across the club.'],
  shots: [['scheduling-planner.avif', 'Season planner with practices and matches by day'], ['scheduling-team-calendar.avif', 'Team calendar on a phone']] })}
${sxRow({ id: 'payments', label: 'Payments', title: 'Get paid without the awkward follow-up.', flip: true,
  intro: 'Season fees, monthly training, camps and kit orders, collected for you.',
  before: 'Working out who has paid means a spreadsheet nobody trusts, polite reminders nobody answers and bank transfers matched line by line on a Sunday night.',
  points: ['Set a fee up once, with instalments, early-bird prices and sibling discounts if you need them.', 'Requests and reminders go out automatically, so nobody has to chase.', 'Families pay from their phone by card or phone wallet, and see every payment for every child in one place.', 'A live dashboard shows paid, due and overdue, with filters and exports for the treasurer.'],
  shots: [['payments-dashboard.avif', 'Payments dashboard with invoices and totals'], ['payments-methods.png', 'Payment requests paid by card or phone wallet']] })}
${sxRow({ id: 'communication', label: 'Communication', title: 'Every message, in one place.',
  intro: 'Posts, notifications and chat for players, parents, coaches and staff.',
  before: 'Group chats, personal texts and emails mean updates get buried, new families miss out, and someone always says "I never got that".',
  points: ['Post once to a team, several groups or the whole club, with attachments or a scheduled time.', 'Push notifications and email reach everyone, even people who never open the app.', 'Chat with clear rules on who can message whom: a coach can reach every family on the team, a parent cannot message the director directly.', 'Monitor mode: when a young player chats with an adult, parents can see the conversation.'],
  shots: [['communication-notification.avif', 'Notification of a new post'], ['communication-chat.avif', 'Chat message with reactions']] })}
${sxRow({ id: 'website', label: 'Club website', title: 'A website that keeps itself up to date.', flip: true,
  intro: 'Pick a template, add your colours and crest, and connect it to the club.',
  before: 'An out-of-date website that one volunteer knows how to edit, and nobody has time to.',
  points: ['Events, team pages, results and registration links appear on the site automatically.', 'Every team gets its own page with its calendar, games and contacts.', 'Use your own domain, or a free address.', 'Your club is also listed on book.afsvvrc.com, beside other clubs and facilities in the area.'],
  shots: [['website.avif', 'Branded club website on desktop and phone'], ['app-website-mobile.avif', 'Club website on a phone']] })}

${group('develop', 'Develop the players', 'Every coach prepared. Every player seen.', 'The sporting side of the club, kept in one shared place.')}
${sxRow({ id: 'coaching', label: 'Coaching content', title: 'Your coaching, kept where everyone can find it.',
  intro: 'One shared library for your club’s way of coaching.',
  before: 'Drills in binders, PDFs shared on a messaging app two seasons ago, and a method that lives in one person’s head. When that coach leaves, it goes too.',
  points: ['Build exercises and session plans with a drawing and animation tool. No design skills needed.', 'Organise them by age group, topic or season, and share them with one team or the whole club.', 'Pull a session straight into a practice so coaches arrive with a plan.', 'Start from a ready-made library, then add your own.'],
  shots: [['training.avif', 'Exercise drawing tool and session library']] })}
${sxRow({ id: 'development', label: 'Player development', title: 'Every player seen. Every step tracked.', flip: true,
  intro: 'A profile for every player, with goals, reviews and their whole history in one place.',
  before: 'Progress lives in a coach’s notebook, so a new coach starts from nothing and families only hear about it at the end of the season.',
  points: ['Each profile brings together attendance, minutes played, goals and reviews.', 'Coaches set individual goals and run structured reviews with the same template for everyone.', 'Assess players against clear profiles for their position.', 'Directors see the whole picture, and the record stays with the player when coaches change.'],
  shots: [['player-profile.avif', 'Player profile with statistics']] })}
${sxRow({ id: 'stats', label: 'Stats and insights', title: 'Every number your club needs. None of the spreadsheets.',
  intro: 'Match stats, attendance and training load in one dashboard.',
  before: 'Stats in one app, attendance on paper and training load in somebody’s memory.',
  points: ['Attendance, training activity and physical load are recorded as you go.', 'Match stats that suit the sport: goals and assists, serve percentage, shot zones.', 'Break it down by player, team, match or season.', 'Turn the numbers into conversations with players and parents.'],
  shots: [['stats-dashboard.avif', 'Match statistics dashboard']] })}
${sxRow({ id: 'video', label: 'Video', title: 'Turn footage into something coaches actually use.', flip: true,
  intro: 'Bring match and training video into one place, then clip it, mark it up and share it.',
  before: 'Videos on one site, notes in a spreadsheet and the conversation in a third app, so footage rarely gets watched with the player.',
  points: ['Add video from the services you already use, no expensive software needed.', 'Clip key moments and draw on them to show what you mean.', 'Tag players so their clips appear on their profile.', 'Build playlists across matches or sessions, and players watch on their phone.'],
  shots: [['video.avif', 'Video analysis with clips and playlists'], ['app-video-mobile.avif', 'Video clips on a phone']] })}
${sxRow({ id: 'leagues', label: 'Leagues and tournaments', title: 'League play and tournament weekends, in one place.',
  intro: 'Set it up once and let the season run itself.',
  before: 'Fixtures in one file, standings in a spreadsheet and results sent around a group chat.',
  points: ['Choose the format: league, groups, knockout, or a mix.', 'Add your own teams, outside teams, or both, to the same draw.', 'Fixtures are generated straight into the calendar.', 'Results and standings update live for everyone, and admins lock in the scores.'],
  shots: [['leagues.avif', 'Tournament builder with group standings']] })}

<section class="band--cream" id="app" data-el="book.app" data-el-build="elementor">
  <div class="wrap section sx-app" style="grid-template-columns:1fr 1fr">
    <div class="sx-app__media">
      <img class="tall" src="assets/img/photos/parent-phone.jpg" alt="A parent checks the team schedule on a phone at the side of the field" width="1200" height="800" loading="lazy">
      <img src="assets/img/360/scheduling-team-calendar.avif" alt="Team calendar in the 360 Player app" loading="lazy">
      <img src="assets/img/360/membership-card.avif" alt="Digital membership card with QR code in the 360 Player app" loading="lazy">
    </div>
    <div>
      <p class="eyebrow eyebrow-rule">Mobile app</p>
      <h2 class="h2">Your whole club in your pocket.</h2>
      <p class="body-lg muted">Most of club life happens away from a desk. The 360 Player app is on the App Store and Google Play, and it also works in a web browser.</p>
      <ul class="sx-points">
        <li><b>Parents</b> register, pay, see the schedule, reply to events and follow their child’s updates.</li>
        <li><b>Players</b> see their sessions, their clips and their development goals.</li>
        <li><b>Coaches</b> plan sessions, take attendance and message their team.</li>
        <li><b>Members</b> show a digital membership card that staff scan with any phone.</li>
      </ul>
      <p class="small muted">Parents do not need the app to get messages or pay: notifications also go by email, and payment requests open in a browser.</p>
    </div>
  </div>
</section>

<section class="wrap section" id="facilities" data-el="book.facility-examples" data-el-build="elementor">
  ${head('Facilities', 'Find a space near you.', 'Every facility gets its own page with photos, hours, rules and a live calendar. These are examples of how listings will look.')}
  <div class="sx-fac">
    ${mocks.facility({ img: 'dome-field', name: 'Indoor dome field', sports: 'Soccer · Football · Rugby · Lacrosse', hours: '6 am – 11 pm daily', next: 'Wed 7:00 pm', unit: 'Full field or half field' })}
    ${mocks.facility({ img: 'court', name: 'Indoor court', sports: 'Basketball · Volleyball · Floorball', hours: '7 am – 10 pm daily', next: 'Tue 6:00 pm', unit: 'Full court or half court' })}
    ${mocks.facility({ img: 'nets', name: 'Indoor nets lane', sports: 'Cricket · Batting and bowling practice', hours: '8 am – 9 pm daily', next: 'Today 4:30 pm', unit: 'One lane, by the hour' })}
  </div>
</section>

<section class="band--cream" data-el="book.member-card" data-el-build="elementor">
  <div class="wrap section sx-app" style="grid-template-columns:1.1fr .9fr">
    <div>
      <p class="eyebrow eyebrow-rule">Membership</p>
      <h2 class="h2">Members book first and pay less.</h2>
      <p class="body-lg muted">AFSV VRC members get priority booking and member pricing, a digital membership card, and access to the Marketplace, FanZone™ and programs. Benefits and pricing are pending approval.</p>
      <p>${btn('See membership', '/membership', 'navy')}</p>
    </div>
    <figure class="sx-photo"><img src="assets/img/photos/lounge.jpg" alt="Families and athletes relaxing in a members' lounge overlooking an indoor field" width="1200" height="800" loading="lazy"></figure>
  </div>
</section>

<section class="wrap section" data-el="book.sports-faq" data-el-build="elementor">
  ${head('FAQ', 'Questions, answered.')}
  ${faq([
    ['Can people book a facility today?', 'Not yet. Public booking on book.afsvvrc.com opens at activation. We are signing up facilities, academies and programs now so they are listed first.'],
    ['Which sports can be listed?', 'Soccer, basketball, volleyball, football, handball, tennis, padel, ice hockey, rugby, lacrosse, floorball, cricket, track and sprint, esports, and performance and recovery. If your sport is missing, tell us.'],
    ['Do parents need to download an app?', 'No. The app is the easiest way in, but notifications also go by email and payment requests open in a web browser.'],
    ['What does it cost to be listed?', 'Registering your interest is free and does not commit you to anything. Any fees will be explained before you agree to anything.'],
  ])}
</section>
${cta()}`,
  };
}
