/* AFSV VRC — motion layer.
   Everything here is progressive enhancement: the page is complete without it,
   and all of it is skipped for prefers-reduced-motion. Animations use only
   transform/opacity/clip-path so they stay on the compositor.

   · Background videos (lazy, in-view only, with pause controls)
   · Scroll progress bar
   · Parallax media
   · Count-up statistics
   · Pointer spotlight + tilt on cards
   · Magnetic primary buttons
   · Section rules, image wipes (driven by the shared .is-in observer in site.js) */
(function () {
  'use strict';

  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  /* ───────── Background videos ─────────
     Markup: <div class="pmedia" data-video="url.mp4"><img …></div>
     The still is the poster; the video fades in once it is actually playing. */
  var videoHosts = $$('[data-video]');
  var PAUSE_ICON = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/></svg>';
  var PLAY_ICON = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>';

  function mountVideo(host) {
    if (host._video) return host._video;
    var v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.setAttribute('tabindex', '-1'); v.preload = 'auto';
    v.className = 'pmedia__video';
    v.src = host.getAttribute('data-video');
    v.addEventListener('playing', function () { host.classList.add('is-playing'); });
    v.addEventListener('error', function () { host.classList.remove('is-playing'); });
    host.appendChild(v);

    // Pause control (WCAG 2.2.2: moving content must be pausable)
    var holder = host.closest('[data-video-scope]') || host;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'media-toggle media-toggle--sm';
    btn.innerHTML = PAUSE_ICON + '<span class="sr-only">Pause background video</span>';
    btn.addEventListener('click', function () {
      if (v.paused) { host._userPaused = false; v.play(); btn.innerHTML = PAUSE_ICON + '<span class="sr-only">Pause background video</span>'; }
      else { host._userPaused = true; v.pause(); btn.innerHTML = PLAY_ICON + '<span class="sr-only">Play background video</span>'; }
    });
    holder.appendChild(btn);
    host._video = v;
    return v;
  }

  if (!reduce.matches && !saveData && videoHosts.length && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var host = en.target;
        if (en.isIntersecting) {
          var v = mountVideo(host);
          if (!host._userPaused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (host._video) {
          host._video.pause();
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    videoHosts.forEach(function (h) { vio.observe(h); });
  }

  /* ───────── Whitby frame: inset → full bleed as it scrolls into view ───────── */
  var expands = $$('[data-expand] .expand__frame');
  function paintExpand() {
    var vh = window.innerHeight;
    expands.forEach(function (f) {
      var r = f.getBoundingClientRect();
      var p = reduce.matches ? 1 : Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));
      f.style.setProperty('--p', p.toFixed(3));
    });
  }
  if (expands.length) {
    paintExpand();
    if (!reduce.matches) {
      var exTick = false;
      window.addEventListener('scroll', function () { if (!exTick) { exTick = true; requestAnimationFrame(function () { exTick = false; paintExpand(); }); } }, { passive: true });
      window.addEventListener('resize', paintExpand);
    }
  }

  /* ───────── AI band: drifting constellation of connected nodes ───────── */
  $$('.ai-band__canvas').forEach(function (cv) {
    var ctx = cv.getContext('2d'); if (!ctx) return;
    var nodes = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), running = false, raf = 0;
    function size() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, (W * H) / 14000));
      nodes = [];
      for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.6 + .8, g: Math.random() < .18 });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var max = 150;
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < max) {
            ctx.strokeStyle = 'rgba(200,169,81,' + (0.28 * (1 - dist / max)).toFixed(3) + ')';
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle = n.g ? 'rgba(200,169,81,.95)' : 'rgba(245,243,238,.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.g ? n.r + 1 : n.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i]; n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
      }
      draw(); if (running) raf = requestAnimationFrame(step);
    }
    size(); draw();
    window.addEventListener('resize', function () { size(); draw(); });
    if (reduce.matches || !('IntersectionObserver' in window)) return; // static constellation
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(step); }
        else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
      });
    }).observe(cv);
  });

  if (reduce.matches) return; // everything below is decorative motion

  /* ───────── Scroll progress ───────── */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  /* ───────── Parallax ───────── */
  var para = $$('[data-parallax]').map(function (el) {
    return { el: el, k: parseFloat(el.getAttribute('data-parallax')) || 0.1 };
  });

  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    for (var i = 0; i < para.length; i++) {
      var r = para[i].el.parentNode.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      var offset = (r.top + r.height / 2 - vh / 2) * -para[i].k;
      para[i].el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ───────── Count-up ───────── */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dur = 1400, start = null;
    var fmt = function (n) { return Math.round(n).toLocaleString('en-CA'); };
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    counters.forEach(function (el) { el.textContent = '0'; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  if (!finePointer) return; // pointer effects are desktop-only

  /* ───────── Spotlight + tilt ───────── */
  $$('.card-link, .cell--link, .product-card, .leader').forEach(function (el) {
    var tilt = el.classList.contains('card-link');
    el.classList.add('has-spotlight');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      if (tilt) el.style.transform = 'perspective(800px) rotateX(' + ((0.5 - y) * 6).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 8).toFixed(2) + 'deg) translateY(-3px)';
    });
    el.addEventListener('pointerleave', function () { if (tilt) el.style.transform = ''; });
  });

  /* ───────── Magnetic primary buttons ───────── */
  $$('.hero .btn, .cta-band .btn, .feature .btn').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width / 2) / r.width;
      var dy = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = 'translate(' + (dx * 8).toFixed(1) + 'px,' + (dy * 6).toFixed(1) + 'px)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });
})();
