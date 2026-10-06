/* AFSV VRC — flow layer (v2).
   Scroll-driven sections in the style of hitit.com, all progressive enhancement:
   · Floating dock that replaces the top header after the first screen
   · Pillar cards that stack (with a tab rail that follows along)
   · Whitby line drawing that draws itself
   · Numbers rail that pins and slides sideways
   · Floating pathway cards (gentle drift)
   · Gold sweep across big headings
   With prefers-reduced-motion everything is shown in its finished state. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var vh = function () { return window.innerHeight; };

  /* ───────── Dock ───────── */
  var dock = $('[data-dock]');
  var dockOn = false;
  function setDock(on) {
    if (!dock || on === dockOn) return;
    dockOn = on;
    dock.classList.toggle('is-on', on);
    document.documentElement.classList.toggle('dock-on', on);
    if (on) { dock.removeAttribute('inert'); dock.removeAttribute('aria-hidden'); }
    else { dock.setAttribute('inert', ''); dock.setAttribute('aria-hidden', 'true'); }
  }
  if (dock) {
    dock.setAttribute('inert', ''); dock.setAttribute('aria-hidden', 'true');
    var top = $('.dock__top', dock);
    if (top) top.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var main = document.getElementById('main'); if (main) main.focus({ preventScroll: true });
    });
  }
  function dockThreshold() {
    var hero = $('.hero, .page-hero, .about-hero, .lead-hero, .page-head');
    return hero ? Math.max(hero.offsetTop + hero.offsetHeight * 0.7, 360) : vh() * 0.8;
  }

  /* ───────── Stack: tabs follow the card in view; covered cards shrink ───────── */
  var stack = $('[data-stack]');
  var cards = stack ? $$('.stack-card', stack) : [];
  var tabs = stack ? $$('.stack__tabs a', stack) : [];
  function paintStack() {
    if (!cards.length) return;
    var active = 0;
    cards.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      if (r.top < vh() * 0.55) active = i;
      var next = cards[i + 1];
      if (!reduce && next) {
        // Shrink a card slightly as the next one slides over it.
        var nr = next.getBoundingClientRect();
        var cover = clamp(1 - (nr.top - r.top) / Math.max(1, r.height));
        c.style.setProperty('--s', (1 - cover * 0.06).toFixed(4));
      }
    });
    tabs.forEach(function (t, i) {
      var on = i === active;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function (e) {
      var card = cards[i]; if (!card) return;
      e.preventDefault();
      var y = card.parentNode.getBoundingClientRect().top + window.scrollY + card.offsetTop - 40 - i * 18;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ───────── Line drawing ───────── */
  var draw = $('[data-draw]');
  var lines = draw ? $$('.draw__line', draw) : [];
  function paintDraw() {
    if (!lines.length) return;
    var r = draw.getBoundingClientRect();
    var p = reduce ? 1 : clamp((vh() - r.top) / (r.height + vh() * 0.25));
    var n = lines.length;
    lines.forEach(function (l, i) {
      var start = (i / n) * 0.55;
      var local = clamp((p - start) / 0.45);
      l.style.setProperty('--d', (1 - local).toFixed(4));
    });
  }

  /* ───────── Numbers rail: pin and slide sideways ───────── */
  var hs = $('[data-hscroll]');
  var track = hs ? $('.hscroll__track', hs) : null;
  var hsPinned = false;
  var hsDist = 0;
  function layoutHscroll() {
    if (!hs || !track) return;
    var pin = !reduce && window.innerWidth > 720;
    hs.classList.toggle('is-pinned', pin);
    hsPinned = pin;
    if (!pin) { hs.style.height = ''; track.style.setProperty('--x', '0px'); return; }
    var vp = $('.hscroll__viewport', hs);
    var pad = parseFloat(getComputedStyle(vp).paddingLeft) || 0;
    hsDist = Math.max(0, track.scrollWidth - (window.innerWidth - pad));
    hs.style.height = (vh() * 1.25 + hsDist) + 'px'; // a little dwell at both ends
  }
  function paintHscroll() {
    if (!hsPinned) return;
    var r = hs.getBoundingClientRect();
    var p = clamp((-r.top - vh() * 0.1) / Math.max(1, r.height - vh() * 1.2));
    track.style.setProperty('--x', (-p * hsDist).toFixed(1) + 'px');
  }

  /* ───────── Floating pathway cards ───────── */
  var floats = reduce ? [] : $$('.path-grid--float .path-card');
  function paintFloats() {
    floats.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh() + 100) return;
      var mid = (r.top + r.height / 2 - vh() / 2) / vh();
      var k = [18, -14, 24, -10][i % 4];
      c.style.setProperty('--fy', (mid * k).toFixed(1) + 'px');
    });
  }

  /* ───────── Gold sweep on headings ───────── */
  var sweeps = $$('[data-sweep]');
  if (!reduce) {
    // Big section headings join in automatically.
    $$('main .section-head h2.h2, main .expand__card .h2, main .cta-band h2').forEach(function (h) {
      if (!h.hasAttribute('data-sweep')) { h.setAttribute('data-sweep', ''); sweeps.push(h); }
    });
  }
  function paintSweeps() {
    if (reduce) return;
    sweeps.forEach(function (h) {
      var r = h.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh()) return;
      var p = clamp((vh() * 0.92 - r.top) / (vh() * 0.6));
      h.style.setProperty('--sp', p.toFixed(3));
    });
  }

  /* ───────── Frame loop ───────── */
  var ticking = false;
  function frame() {
    ticking = false;
    setDock(window.scrollY > dockThreshold());
    paintStack(); paintDraw(); paintHscroll(); paintFloats(); paintSweeps();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layoutHscroll(); onScroll(); });
  window.addEventListener('load', function () { layoutHscroll(); onScroll(); });
  layoutHscroll();
  frame();
})();
