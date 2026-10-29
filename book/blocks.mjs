// Selling-page building blocks for book.afsvvrc.com: struggle → fix rows and concept mock-up screens.
// Every mock-up is original, uses example data and is labelled as a concept.
import { html, raw, btn } from '../src/lib.mjs';

const cap = (t = 'Concept screen. Example data.') => html`<figcaption class="mock__cap">${t}</figcaption>`;
const chip = (t, k = '') => html`<span class="mchip ${k}">${t}</span>`;

// ───────── Mock-up screens ─────────
export const mocks = {
  calendar: () => html`<figure class="mock"><div class="mock__bar"><b>Court 1</b><span>Week of Mar 9</span>${chip('Example', 'm-ex')}</div>
    <div class="cal">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, c) => html`<div class="cal__col"><i>${d}</i>${['6 pm', '7 pm', '8 pm', '9 pm'].map((t, r) => {
      const s = (c * 3 + r * 5) % 7; const st = s === 0 || s === 4 ? 'b' : s === 2 ? 'x' : 'o';
      return html`<span class="slot s-${st}">${t}<small>${st === 'b' ? 'Booked' : st === 'x' ? 'Blocked' : 'Open'}</small></span>`; })}</div>`)}</div>
    <div class="mock__legend">${chip('Open', 'm-ok')}${chip('Booked', 'm-bk')}${chip('Blocked', 'm-no')}</div>${cap()}</figure>`,
  facility: (f = {}) => { const { img = 'court', name = 'Indoor court', sports = 'Basketball · Volleyball · Training', hours = '6 am – 10 pm daily', next = 'Tue 6:00 pm', unit = 'Full court or half court' } = f;
    return html`<figure class="mock"><div class="fcard"><img src="assets/img/photos/${img}.jpg" alt="" width="640" height="427" loading="lazy">
    <div class="fcard__b"><div class="fcard__t"><b>${name}</b>${chip('Example', 'm-ex')}</div><p>${sports}</p>
    <ul><li><span>Hours</span>${hours}</li><li><span>Book</span>${unit}</li><li><span>Next open</span>${next}</li><li><span>Member price</span>Shown on the listing</li></ul><span class="fcard__btn">Book a time</span></div></div>${cap('Example listing. Not a real facility yet.')}</figure>`; },
  register: () => html`<figure class="mock"><div class="mock__bar"><b>Spring Tryouts</b>${chip('Open', 'm-ok')}</div>
    <ul class="plist"><li><b>U10 Recreation</b><span>Ages 8–10 · own questions</span></li><li><b>U14 Travel</b><span>Tryout, then team placement</span></li><li><b>Adult League</b><span>Open sign-up</span></li><li><b>Summer Camp</b><span>Capacity limit and waitlist</span></li></ul>
    <div class="mock__row"><span class="mbtn">Register</span><small>About three minutes on a phone</small></div>${cap()}</figure>`,
  payments: () => html`<figure class="mock"><div class="mock__bar"><b>Fees this month</b>${chip('Example', 'm-ex')}</div>
    <ul class="paylist">${[['Family A', 'Paid', 'm-ok'], ['Family B', 'Due Fri', 'm-wn'], ['Family C', 'Paid', 'm-ok'], ['Family D', 'Overdue', 'm-no'], ['Family E', 'Paid', 'm-ok']].map(([n, s, k]) => html`<li><span>${n}</span>${chip(s, k)}</li>`)}</ul>
    <div class="mock__tot"><span>Reminders</span><b>Sent automatically</b></div>${cap()}</figure>`,
  chat: () => html`<figure class="mock"><div class="mock__bar"><b>U12 coaches</b><span>6 members</span></div>
    <div class="chat"><p class="c-in">Do you still have last season's rondo drill?</p><p class="c-out">It is in the club library. Sending the link now.</p><p class="c-note">Posted to Team · Push and email sent</p></div>${cap()}</figure>`,
  website: () => html`<figure class="mock"><div class="mock__bar"><b>Club page</b>${chip('Example', 'm-ex')}</div>
    <div class="web"><div class="web__hero">Your club name</div><div class="web__cols"><span>Next events</span><span>Teams</span><span>Results</span><span>Register</span></div></div>${cap()}</figure>`,
  video: () => html`<figure class="mock"><div class="vid"><div class="vid__screen"><span>Pressing in the final third</span></div><div class="vid__tl"><i style="left:12%;width:18%"></i><i style="left:46%;width:10%"></i><i style="left:70%;width:14%"></i></div></div><div class="mock__legend">${chip('Clip', 'm-ex')}${chip('Annotate', 'm-ex')}${chip('Tag player', 'm-ex')}</div>${cap()}</figure>`,
  stats: () => html`<figure class="mock"><div class="mock__bar"><b>Training load</b><span>Last 4 weeks</span></div>
    <div class="bars">${[44, 62, 51, 78, 66, 90, 58].map((h) => html`<i style="height:${h}%"></i>`)}</div>
    <ul class="kv"><li><span>Attendance</span><b>Tracked</b></li><li><span>Minutes played</span><b>Per player</b></li></ul>${cap()}</figure>`,
  profile: () => html`<figure class="mock"><div class="mock__bar"><b>Player profile</b>${chip('Example', 'm-ex')}</div>
    <div class="prof"><span class="prof__av" aria-hidden="true"></span><div><b>Sample Player</b><small>U14 · Midfield</small></div></div>
    <ul class="goals">${[['Weaker foot passing', 70], ['Positioning', 45], ['Fitness', 85]].map(([g, p]) => html`<li><span>${g}</span><em><i style="width:${p}%"></i></em></li>`)}</ul>${cap()}</figure>`,
  library: () => html`<figure class="mock"><div class="mock__bar"><b>Training library</b><span>Shared with the club</span></div>
    <ul class="lib">${[['Rondo 4v2', 'Passing'], ['Pressing triggers', 'Defending'], ['Transition game', 'Small-sided'], ['Warm-up circuit', 'Fitness']].map(([t, g]) => html`<li><span class="lib__ico" aria-hidden="true"></span><b>${t}</b>${chip(g)}</li>`)}</ul>${cap()}</figure>`,
  league: () => html`<figure class="mock"><div class="mock__bar"><b>Spring league</b><span>Standings</span></div>
    <ol class="tbl">${[['Team A', 7], ['Team B', 6], ['Team C', 4], ['Team D', 1]].map(([t, p], i) => html`<li><span>${i + 1}</span><b>${t}</b><em>${p} pts</em></li>`)}</ol>${cap()}</figure>`,
  phone: () => html`<figure class="mock mock--phone"><div class="phone"><div class="phone__top"></div><div class="phone__body">
    <p class="ph-h">Today</p><div class="ph-card"><b>U12 training</b><small>6:00 pm · Court 1</small><span class="mbtn mbtn--s">I'm coming</span></div>
    <div class="ph-card"><b>Fees</b><small>Spring session</small>${chip('Paid', 'm-ok')}</div>
    <div class="ph-card ph-mem"><small>AFSV VRC member</small><b>Show my card</b></div></div></div>${cap()}</figure>`,
  member: () => html`<figure class="mock"><div class="mcard"><div class="mcard__top"><b>AFSV VRC</b><span>Member</span></div><div class="mcard__mid">Sample Member</div><div class="mcard__bot"><span>Priority booking · Member pricing</span><i class="mcard__qr" aria-hidden="true"></i></div></div>${cap('Concept card. Example data.')}</figure>`,
};

// ───────── Product screen (360 Player image) ─────────
// shots: [[file, alt], ...] from assets/img/360; the first is the main screen, a second one overlaps it.
export function shot(shots, cap = '360 Player product screen') {
  const [main, extra] = shots;
  return html`<figure class="shot${extra ? ' shot--duo' : ''}">
    <img class="shot__main" src="assets/img/360/${main[0]}" alt="${main[1]}" loading="lazy">
    ${extra ? html`<img class="shot__extra" src="assets/img/360/${extra[0]}" alt="${extra[1]}" loading="lazy">` : ''}
    <figcaption class="mock__cap">${cap}</figcaption></figure>`;
}

// ───────── Row: struggle → fix, with a product screen or a mock-up ─────────
// { id, label, title, intro, before, points, shots | mock, flip, link }
export function sxRow({ id, label, title, intro, before, points, mock, shots, flip = false, link }) {
  return html`
<section class="sx-row${flip ? ' sx-row--flip' : ''}" id="${id}" data-el="book.feature-${id}" data-el-build="elementor">
  <div class="wrap sx-row__grid">
    <div class="sx-row__text">
      <p class="eyebrow eyebrow-rule">${label}</p>
      <h2 class="h2">${title}</h2>
      ${intro ? html`<p class="body-lg sx-intro-line">${intro}</p>` : ''}
      <p class="sx-before"><span>The struggle</span>${before}</p>
      <ul class="sx-points">${points.map((p) => html`<li>${p}</li>`)}</ul>
      ${link ? html`<p>${btn(link[0], link[1], 'line-dark')}</p>` : ''}
    </div>
    <div class="sx-row__mock">${shots ? shot(shots) : mocks[mock]()}</div>
  </div>
</section>`;
}
