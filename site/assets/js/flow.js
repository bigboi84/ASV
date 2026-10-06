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

  /* ───────── Home hero film: chapters follow the flythrough's timeline ───────── */
  var film = $('[data-film]');
  var fv = film ? $('video[data-film-video]', film) : null;
  if (film && fv) {
    var chips = $$('[data-reel-go]', film);
    var starts = chips.map(function (c) { return parseFloat(c.getAttribute('data-t')) || 0; });
    var cap = $('[data-reel-caption]', film);
    var capTitle = $('[data-reel-title]', film);
    var capLine = $('[data-reel-line]', film);
    var pauseBtn = $('[data-reel-pause]', film);
    var cur = -1, userPaused = reduce, byUser = false;
    function chapterAt(t) { var i = 0; starts.forEach(function (s, j) { if (t >= s - 0.05) i = j; }); return i; }
    function paint() {
      var t = fv.currentTime || 0, dur = fv.duration || (starts[starts.length - 1] + 5);
      var i = chapterAt(t);
      if (i !== cur) {
        cur = i;
        chips.forEach(function (c, j) { c.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
        if (cap) {
          cap.setAttribute('aria-live', byUser ? 'polite' : 'off');
          cap.classList.remove('is-in'); void cap.offsetWidth; cap.classList.add('is-in');
          capTitle.textContent = chips[i].getAttribute('data-title'); capLine.textContent = chips[i].getAttribute('data-line');
        }
        var c = chips[i], rail = c.parentNode;
        if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: c.offsetLeft - rail.clientWidth / 2 + c.offsetWidth / 2, behavior: 'smooth' });
        byUser = false;
      }
      chips.forEach(function (c, j) {
        var s = starts[j], e = j + 1 < starts.length ? starts[j + 1] : dur;
        c.style.setProperty('--p', j < i ? 1 : j > i ? 0 : Math.min(1, Math.max(0, (t - s) / (e - s))).toFixed(3));
      });
    }
    function setPaused(p) {
      userPaused = p;
      film.classList.toggle('is-paused', p);
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', String(p));
        $('.sr-only', pauseBtn).textContent = p ? 'Play the background film' : 'Pause the background film';
        $('.ico-pause', pauseBtn).toggleAttribute('hidden', p);
        $('.ico-play', pauseBtn).toggleAttribute('hidden', !p);
      }
      if (p) fv.pause(); else { var q = fv.play(); if (q && q.catch) q.catch(function () {}); }
    }
    fv.addEventListener('timeupdate', paint);
    fv.addEventListener('seeked', paint);
    fv.addEventListener('loadedmetadata', paint);
    fv.addEventListener('playing', function () { film.classList.add('is-playing'); });
    chips.forEach(function (c, i) {
      c.addEventListener('click', function () {
        byUser = true; cur = -1;
        try { fv.currentTime = starts[i]; } catch (e) {}
        film.classList.add('is-playing'); // show the frame even while paused / reduced motion
        paint();
      });
    });
    if (pauseBtn) pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { if (!userPaused) { var q = fv.play(); if (q && q.catch) q.catch(function () {}); } }
        else fv.pause();
      }, { threshold: 0.2 }).observe(film);
    }
    if (reduce) fv.removeAttribute('autoplay');
    setPaused(userPaused);
    paint();
  }

  /* ───────── Marketplace: collection filter (with #hash) ───────── */
  var merch = $('[data-merch]');
  if (merch) {
    var chips = $$('[data-filter]', merch);
    var items = $$('[data-collection]', merch);
    var status = $('[data-merch-status]', merch);
    var applyFilter = function (id, announce) {
      if (!chips.some(function (c) { return c.getAttribute('data-filter') === id; })) id = 'all';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === id ? 'true' : 'false'); });
      var n = 0;
      items.forEach(function (it) {
        var show = id === 'all' || it.getAttribute('data-collection') === id;
        it.hidden = !show; if (show) n++;
      });
      if (announce && status) status.textContent = n + (n === 1 ? ' piece' : ' pieces') + ' shown';
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var id = c.getAttribute('data-filter');
        applyFilter(id, true);
        if (history.replaceState) history.replaceState(null, '', id === 'all' ? location.pathname : '#' + id);
      });
    });
    applyFilter((location.hash || '').slice(1) || 'all', false);
    window.addEventListener('hashchange', function () { applyFilter(location.hash.slice(1) || 'all', true); });
  }

  /* ───────── Product page: colour swap ───────── */
  var prod = $('[data-merch-product]');
  if (prod) {
    var stage = $('[data-stage]', prod);
    var cname = $('[data-colour-name]', prod);
    var thumbs = $$('[data-thumb]', prod);
    var swatches = $$('.mk-colour', prod);
    swatches.forEach(function (b, i) {
      b.addEventListener('click', function () {
        swatches.forEach(function (s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
        thumbs.forEach(function (t, j) { t.classList.toggle('is-on', j === i); });
        if (stage) { stage.src = b.getAttribute('data-img'); stage.alt = b.getAttribute('data-alt'); }
        if (cname) cname.textContent = b.getAttribute('data-name');
      });
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
