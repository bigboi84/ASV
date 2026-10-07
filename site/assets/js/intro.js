/* Home intro — A F S V letters fill with renders of the village, then become
   windows onto the hero film and zoom through to reveal it (after builtenvirons.com.au).
   Markup lives in pages.mjs; an inline script removes it for reduced motion / ?nointro. */
(function () {
  var root = document.querySelector('[data-intro]');
  if (!root) return;
  var doc = document.documentElement;
  var measure = root.querySelector('[data-intro-measure]');
  var imgs = [].slice.call(root.querySelectorAll('[data-intro-img]'));
  var hole = root.querySelector('[data-intro-hole]');
  var holeText = root.querySelector('[data-intro-holetext]');
  var fill = root.querySelector('[data-intro-fill]');
  var meta = root.querySelector('[data-intro-meta]');
  var bar = root.querySelector('[data-intro-bar]');
  var veil = root.querySelector('.intro__veil');
  var cols = [].slice.call(root.querySelectorAll('[data-intro-col]'));
  var view = { x: 0, y: 0, w: 1600, h: 900 };
  var done = false, revealed = false, t0 = 0, boxes = [];

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var outCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  var inOutCubic = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var inOutQuart = function (t) { return t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a)); };

  function layout() {
    // Portrait screens: crop the stage to the word so the letters fill the width
    if (window.innerWidth < window.innerHeight) root.querySelector('svg').setAttribute('viewBox', '130 0 1340 900');
    boxes = imgs.map(function (img, i) {
      var b;
      try { b = measure.getExtentOfChar(i); } catch (e) { b = { x: 210 + i * 300, y: 230, width: 290, height: 390 }; }
      var pad = 12, box = { x: b.x - pad, y: b.y - pad, w: b.width + pad * 2, h: b.height + pad * 2 };
      img.setAttribute('x', box.x); img.setAttribute('y', box.y);
      img.setAttribute('width', box.w); img.setAttribute('height', box.h);
      return box;
    });
    // The part of user space actually on screen, so the exit columns reach every edge
    var svg = root.querySelector('svg'), m = svg.getScreenCTM();
    if (m) {
      var inv = m.inverse(), p = svg.createSVGPoint();
      p.x = 0; p.y = 0; var a = p.matrixTransform(inv);
      p.x = window.innerWidth; p.y = window.innerHeight; var b2 = p.matrixTransform(inv);
      view = { x: a.x, y: a.y, w: b2.x - a.x, h: b2.y - a.y };
    }
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
    var t = now - t0;
    // 1 · each letter fills with a render rising up from below, slowly settling
    imgs.forEach(function (img, i) {
      var b = boxes[i], start = 250 + i * 230;
      var rise = outCubic(seg(t, start, start + 850));
      var sc = 1.22 - 0.22 * outCubic(seg(t, start, start + 2300));
      var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      img.setAttribute('transform', 'translate(0 ' + ((1 - rise) * b.h).toFixed(1) + ') translate(' + cx + ' ' + cy + ') scale(' + sc.toFixed(4) + ') translate(' + (-cx) + ' ' + (-cy) + ')');
    });
    bar.setAttribute('width', (300 * inOutCubic(seg(t, 0, 2300))).toFixed(1));
    // 2 · letters turn into windows onto the hero film
    var h = inOutCubic(seg(t, 2350, 2750)), c = Math.round(255 * (1 - h));
    holeText.setAttribute('fill', 'rgb(' + c + ',' + c + ',' + c + ')');
    fill.style.opacity = 1 - h;
    meta.style.opacity = 1 - inOutCubic(seg(t, 2100, 2500));
    // 3 · each letter bursts open into a tall column of the film (centre letters first),
    //     the four columns hold as panels for a beat, then close their seams into one picture
    var cw = view.w / 4, order = [1, 2, 0, 3];
    cols.forEach(function (r, i) {
      var b = boxes[i], st = 2750 + order.indexOf(i) * 110;
      var g = inOutQuart(seg(t, st, st + 800));
      var k = inOutCubic(seg(t, 3600, 4000));
      var gap = 16 * (1 - k), cx = b.x + b.w / 2;
      var x0 = cx, x1 = view.x + i * cw + gap / 2, w1 = cw - gap;
      var y0 = b.y + b.h / 2, y1 = view.y - 4, h1 = view.h + 8;
      r.setAttribute('x', (x0 + (x1 - x0) * g).toFixed(1));
      r.setAttribute('width', Math.max(0, w1 * g).toFixed(1));
      r.setAttribute('y', (y0 + (y1 - y0) * g).toFixed(1));
      r.setAttribute('height', (h1 * g).toFixed(1));
      r.setAttribute('rx', (28 * (1 - k)).toFixed(1));
    });
    hole.style.opacity = 1 - seg(t, 3550, 3750);
    if (t > 3500) reveal();
    if (t > 4200) { finish(); return; }
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
