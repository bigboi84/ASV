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
  var done = false, revealed = false, t0 = 0, boxes = [], origin = [800, 450];

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var outCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  var inOutCubic = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
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
    // Zoom into the stem of the F, so the opening grows to fill the screen
    var f = boxes[1] || { x: 750, y: 250, w: 100, h: 400 };
    origin = [f.x + f.w * 0.36, f.y + f.h * 0.42];
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
    // 3 · zoom through the letters into the hero
    var z = inOutCubic(seg(t, 2700, 4000)), s = Math.exp(Math.log(90) * z * z);
    hole.setAttribute('transform', 'translate(' + origin[0] + ' ' + origin[1] + ') scale(' + s.toFixed(4) + ') translate(' + (-origin[0]) + ' ' + (-origin[1]) + ')');
    veil.style.opacity = 1 - inOutCubic(seg(t, 3300, 3850));
    if (t > 3450) reveal();
    if (t > 4050) { finish(); return; }
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
