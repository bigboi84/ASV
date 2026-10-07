/* Home intro — the letters of AFSV VRC fill with renders of the village, become windows onto
   the hero film, then each letter bursts open into a tall panel of the film; the panels merge
   into the hero (concept after builtenvirons.com.au). One line on landscape screens, AFSV over
   VRC on portrait. Markup lives in pages.mjs; an inline script removes it for reduced motion
   and ?nointro. */
(function () {
  var root = document.querySelector('[data-intro]');
  if (!root) return;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var doc = document.documentElement;
  var svg = root.querySelector('svg');
  var texts = [].slice.call(root.querySelectorAll('[data-intro-text]'));
  var measure = root.querySelector('[data-intro-measure]');
  var imgs = [].slice.call(root.querySelectorAll('[data-intro-img]'));
  var cols = [].slice.call(root.querySelectorAll('[data-intro-col]'));
  var hole = root.querySelector('[data-intro-hole]');
  var holeText = root.querySelector('[data-intro-holetext]');
  var fill = root.querySelector('[data-intro-fill]');
  var meta = root.querySelector('[data-intro-meta]');
  var cap = root.querySelector('[data-intro-cap]');
  var track = root.querySelector('[data-intro-track]');
  var bar = root.querySelector('[data-intro-bar]');
  var veil = root.querySelector('.intro__veil');
  var done = false, revealed = false, t0 = 0, boxes = [], view = { x: 0, y: 0, w: 1600, h: 900 }, burst = [], barX = 650;

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var outCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  var inOutCubic = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var inOutQuart = function (t) { return t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a)); };

  // Lines of the word: [text, baselineY, textLength]
  function lines() {
    return window.innerWidth < window.innerHeight
      ? [['AFSV', 470, 1000], ['VRC', 880, 760]]
      : [['AFSV VRC', 580, 1420]];
  }
  function setText() {
    var L = lines();
    texts.forEach(function (t) {
      while (t.firstChild) t.removeChild(t.firstChild);
      L.forEach(function (l) {
        var s = document.createElementNS(SVGNS, 'tspan');
        s.setAttribute('x', 800); s.setAttribute('y', l[1]); s.setAttribute('text-anchor', 'middle');
        s.setAttribute('textLength', l[2]); s.setAttribute('lengthAdjust', 'spacing');
        s.textContent = l[0]; t.appendChild(s);
      });
    });
  }

  function layout() {
    setText();
    // one box per visible letter (skip spaces)
    var chars = lines().map(function (l) { return l[0]; }).join(''), idx = 0;
    boxes = [];
    for (var c = 0; c < chars.length; c++) {
      if (chars[c] === ' ') continue;
      var b;
      try { b = measure.getExtentOfChar(c); } catch (e) { b = { x: 120 + idx * 200, y: 300, width: 160, height: 280 }; }
      boxes.push({ x: b.x - 10, y: b.y - 10, w: b.width + 20, h: b.height + 20 });
      idx++;
    }
    imgs.forEach(function (img, i) {
      var b = boxes[i % boxes.length];
      img.setAttribute('x', b.x); img.setAttribute('y', b.y);
      img.setAttribute('width', b.w); img.setAttribute('height', b.h);
    });
    // frame the word: caption + loading bar under it, generous margins
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    boxes.forEach(function (b) { minX = Math.min(minX, b.x); minY = Math.min(minY, b.y); maxX = Math.max(maxX, b.x + b.w); maxY = Math.max(maxY, b.y + b.h); });
    var cx = (minX + maxX) / 2;
    cap.setAttribute('x', cx); cap.setAttribute('y', maxY + 70);
    barX = cx - 150; track.setAttribute('x', barX); track.setAttribute('y', maxY + 100);
    bar.setAttribute('x', barX); bar.setAttribute('y', maxY + 100);
    var portrait = window.innerWidth < window.innerHeight;
    var padX = (maxX - minX) * (portrait ? 0.06 : 0.16), padY = 140;
    svg.setAttribute('viewBox', [minX - padX, minY - padY, (maxX - minX) + padX * 2, (maxY + 120 + padY) - (minY - padY)].join(' '));
    // the part of user space actually on screen, so the exit panels reach every edge
    var m = svg.getScreenCTM();
    if (m) {
      var inv = m.inverse(), p = svg.createSVGPoint();
      p.x = 0; p.y = 0; var a = p.matrixTransform(inv);
      p.x = window.innerWidth; p.y = window.innerHeight; var z = p.matrixTransform(inv);
      view = { x: a.x, y: a.y, w: z.x - a.x, h: z.y - a.y };
    }
    // panels left→right; letters nearest the centre burst first
    var order = boxes.map(function (b, i) { return i; }).sort(function (i, j) { return (boxes[i].x - boxes[j].x); });
    var mid = (minX + maxX) / 2;
    burst = boxes.map(function (b, i) {
      var rank = boxes.map(function (bb, k) { return k; }).sort(function (p1, p2) {
        return Math.abs(boxes[p1].x + boxes[p1].w / 2 - mid) - Math.abs(boxes[p2].x + boxes[p2].w / 2 - mid);
      }).indexOf(i);
      return { col: order.indexOf(i), rank: rank };
    });
    cols.forEach(function (r, i) { r.style.display = i < boxes.length ? '' : 'none'; });
  }

  function reveal() {
    if (revealed) return; revealed = true;
    doc.classList.remove('intro-on'); doc.classList.add('intro-reveal');
    var v = document.querySelector('[data-film-video]');
    if (v) { try { v.currentTime = 0; } catch (e) {} var p = v.play && v.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function finish() {
    if (done) return; done = true; reveal();
    root.style.transition = 'opacity .45s ease'; root.style.opacity = '0';
    setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, 500);
  }

  function frame(now) {
    if (done) return;
    if (!t0) t0 = now;
    var t = now - t0, n = boxes.length;
    // 1 · each letter fills with a render rising up from below, slowly settling
    imgs.forEach(function (img, i) {
      if (i >= n) return;
      var b = boxes[i], start = 250 + i * 170;
      var rise = outCubic(seg(t, start, start + 850));
      var sc = 1.22 - 0.22 * outCubic(seg(t, start, start + 2300));
      var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      img.setAttribute('transform', 'translate(0 ' + ((1 - rise) * b.h).toFixed(1) + ') translate(' + cx + ' ' + cy + ') scale(' + sc.toFixed(4) + ') translate(' + (-cx) + ' ' + (-cy) + ')');
    });
    bar.setAttribute('width', (300 * inOutCubic(seg(t, 0, 2400))).toFixed(1));
    // 2 · letters turn into windows onto the hero film
    var h = inOutCubic(seg(t, 2450, 2850)), c = Math.round(255 * (1 - h));
    holeText.setAttribute('fill', 'rgb(' + c + ',' + c + ',' + c + ')');
    fill.style.opacity = 1 - h;
    meta.style.opacity = 1 - inOutCubic(seg(t, 2200, 2600));
    // 3 · each letter bursts open into a tall panel of the film; panels hold, then the seams close
    var cw = view.w / n;
    cols.forEach(function (r, i) {
      if (i >= n) return;
      var b = boxes[i], o = burst[i], st = 2850 + o.rank * 80;
      var g = inOutQuart(seg(t, st, st + 800));
      var k = inOutCubic(seg(t, 3750, 4150));
      var gap = 14 * (1 - k), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      var x1 = view.x + o.col * cw + gap / 2, w1 = cw - gap;
      r.setAttribute('x', (cx + (x1 - cx) * g).toFixed(1));
      r.setAttribute('width', Math.max(0, w1 * g).toFixed(1));
      r.setAttribute('y', (cy + (view.y - 4 - cy) * g).toFixed(1));
      r.setAttribute('height', ((view.h + 8) * g).toFixed(1));
      r.setAttribute('rx', (24 * (1 - k)).toFixed(1));
    });
    hole.style.opacity = 1 - seg(t, 3700, 3900);
    veil.style.opacity = 1 - inOutCubic(seg(t, 4050, 4300));
    if (t > 3650) reveal();
    if (t > 4350) { finish(); return; }
    requestAnimationFrame(frame);
  }

  root.addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  setTimeout(finish, 9000); // failsafe

  var ready = [document.fonts && document.fonts.load ? document.fonts.load('400 100px Anton') : Promise.resolve()];
  imgs.forEach(function (img) {
    ready.push(new Promise(function (res) { var i = new Image(); i.onload = i.onerror = res; i.src = img.getAttribute('href'); }));
  });
  Promise.race([Promise.all(ready), new Promise(function (r) { setTimeout(r, 1500); })]).then(function () {
    layout(); requestAnimationFrame(frame);
  });
})();
