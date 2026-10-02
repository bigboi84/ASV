/* AFSV VRC — site behaviour. Vanilla JS, no dependencies.
   Sections: utilities · header & navigation · drawer · banner · hero video ·
   reveal · forms · leadership · facilities filter · marketplace (cart, shop,
   product, cart page, checkout, order). */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var store = {
    get: function (k, fallback) {
      try { var v = window.localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set: function (k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    session: {
      get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
    }
  };

  function money(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Broken remote images: hide the broken-image glyph, keep the navy panel. */
  $$('img').forEach(function (img) {
    img.addEventListener('error', function () { img.classList.add('is-missing'); }, { once: true });
  });

  /* ───────── Header: shadow on scroll, measured height for sticky offsets ───────── */
  var header = $('.site-header');
  function setHeaderH() { if (header) doc.style.setProperty('--header-h', header.offsetHeight + 'px'); }
  setHeaderH();
  window.addEventListener('resize', setHeaderH);
  var toTop = $('.to-top');
  var overlayMast = header && header.hasAttribute('data-overlay') ? header.closest('.masthead') : null;
  function setMastH() { if (overlayMast) doc.style.setProperty('--mast-h', overlayMast.offsetHeight + 'px'); }
  setMastH(); window.addEventListener('resize', setMastH);
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    // Overlay header: once the transparent masthead has scrolled away, pin a solid bar.
    if (overlayMast) header.classList.toggle('is-stuck', y > overlayMast.offsetHeight + 60);
    if (toTop) toTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ───────── Desktop dropdowns: hover (CSS) + click + keyboard ───────── */
  var navItems = $$('.nav-item.has-dropdown');
  function closeAll(except) {
    navItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var b = $('.nav-link', item); if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  navItems.forEach(function (item) {
    var btn = $('.nav-link', item);
    var links = $$('.dropdown a', item);
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('mouseenter', function () { btn.setAttribute('aria-expanded', 'true'); });
    item.addEventListener('mouseleave', function () {
      if (!item.classList.contains('is-open')) btn.setAttribute('aria-expanded', 'false');
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); closeAll(item); item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(function () { if (links[0]) links[0].focus(); });
      }
    });
    item.addEventListener('keydown', function (e) {
      var i = links.indexOf(document.activeElement);
      if (e.key === 'Escape') { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
      if (i > -1 && e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (i > -1 && e.key === 'ArrowUp') { e.preventDefault(); (i === 0 ? btn : links[i - 1]).focus(); }
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeAll();
  });

  /* ───────── Drawer (mobile menu, also opened from the marketplace bar) ───────── */
  var drawer = $('#site-drawer');
  var lastFocus = null;
  function focusables(root) {
    return $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }
  function openDrawer(trigger) {
    if (!drawer) return;
    lastFocus = trigger || document.activeElement;
    drawer.hidden = false;
    // next frame so the transition runs
    document.body.classList.add('is-locked');
    $$('[data-drawer-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    requestAnimationFrame(function () {
      drawer.classList.add('is-open');
      requestAnimationFrame(function () { var close = $('.drawer__close', drawer); if (close) close.focus(); });
    });
  }
  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    $$('[data-drawer-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    setTimeout(function () { drawer.hidden = true; }, reduceMotion ? 0 : 320);
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-drawer-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b); }); });
  $$('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
  if (drawer) {
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(drawer); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    $$('.drawer__toggle', drawer).forEach(function (t) {
      t.addEventListener('click', function () {
        var open = t.getAttribute('aria-expanded') !== 'true';
        t.setAttribute('aria-expanded', String(open));
        var sub = document.getElementById(t.getAttribute('aria-controls'));
        if (sub) sub.hidden = !open;
      });
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { if (a.getAttribute('href').charAt(0) === '#') closeDrawer(); });
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1200 && !$('.market-bar')) closeDrawer(); });
  }

  /* ───────── Home pillar panels: hover/focus expands a panel ───────── */
  $$('[data-panels]').forEach(function (wrap) {
    var cards = $$('.panel-card', wrap);
    var activate = function (c) { cards.forEach(function (x) { x.classList.toggle('is-active', x === c); }); };
    cards.forEach(function (c) {
      c.addEventListener('mouseenter', function () { activate(c); });
      c.addEventListener('focus', function () { activate(c); });
    });
  });

  /* Hero facts height feeds the video toggle position */
  var facts = $('.hero__facts');
  if (facts) {
    var setFacts = function () { doc.style.setProperty('--facts-h', facts.offsetHeight + 'px'); };
    setFacts(); window.addEventListener('resize', setFacts);
  }

  /* ───────── Event countdowns ───────── */
  $$('[data-countdown]').forEach(function (el) {
    var target = Date.parse(el.getAttribute('data-countdown'));
    if (isNaN(target)) return;
    var cells = {};
    $$('[data-unit]', el).forEach(function (c) { cells[c.getAttribute('data-unit')] = c; });
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    var last = {};
    var update = function () {
      var ms = Math.max(0, target - Date.now());
      var v = { days: Math.floor(ms / 864e5), hours: Math.floor(ms / 36e5) % 24, mins: Math.floor(ms / 6e4) % 60, secs: Math.floor(ms / 1e3) % 60 };
      Object.keys(v).forEach(function (k) {
        if (!cells[k]) return;
        var txt = k === 'days' ? String(v[k]) : pad(v[k]);
        if (last[k] !== txt) {
          cells[k].textContent = txt;
          if (!reduceMotion && last[k] !== undefined) { cells[k].classList.remove('tick'); void cells[k].offsetWidth; cells[k].classList.add('tick'); }
          last[k] = txt;
        }
      });
    };
    update(); setInterval(update, 1000);
  });

  /* ───────── Announcement banner ───────── */
  var banner = $('.announce');
  if (banner) {
    if (store.session.get('afsv-banner') === 'closed') { banner.hidden = true; setMastH(); }
    var bClose = $('.announce__close', banner);
    if (bClose) bClose.addEventListener('click', function () {
      banner.hidden = true; store.session.set('afsv-banner', 'closed'); setHeaderH(); if (typeof setMastH === 'function') setMastH();
    });
  }

  /* ───────── Hero video: pause control + pause when off screen ───────── */
  var video = $('.hero video');
  var vBtn = $('.media-toggle');
  if (video) {
    var userPaused = false;
    var setLabel = function () {
      if (!vBtn) return;
      var paused = video.paused;
      vBtn.setAttribute('aria-pressed', String(paused));
      vBtn.querySelector('span').textContent = paused ? 'Play background video' : 'Pause background video';
      // SVG elements have no .hidden property, so toggle the attribute itself
      vBtn.querySelector('.ico-pause').toggleAttribute('hidden', paused);
      vBtn.querySelector('.ico-play').toggleAttribute('hidden', !paused);
    };
    if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); }
    else {
      var p = video.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ });
    }
    video.addEventListener('play', setLabel);
    video.addEventListener('pause', setLabel);
    if (vBtn) vBtn.addEventListener('click', function () {
      if (video.paused) { userPaused = false; video.play(); } else { userPaused = true; video.pause(); }
    });
    if ('IntersectionObserver' in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !userPaused) { var q = video.play(); if (q && q.catch) q.catch(function () {}); }
          else if (!en.isIntersecting) video.pause();
        });
      }, { threshold: 0.15 }).observe(video);
    }
    setLabel();
  }

  /* ───────── Scroll reveal with grid stagger ───────── */
  var revealEls = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    $$('[data-stagger]').forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = Math.min(i * 60, 420) + 'ms';
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('is-in'); io.unobserve(el);
        // drop the stagger delay once revealed so hover/tilt transitions stay instant
        if (el.style.transitionDelay) setTimeout(function () { el.style.transitionDelay = ''; }, 1300);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal, .wipe, h2.h2, [data-timeline]').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal, .wipe, h2.h2, [data-timeline]').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ───────── Forms: inline validation + preview confirmation ───────── */
  function fieldOf(el) { return el.closest('.field') || el.closest('.check'); }
  function messageFor(el) {
    if (el.validity.valueMissing) {
      if (el.type === 'checkbox') return 'Please tick this box to continue.';
      if (el.tagName === 'SELECT') return 'Please choose an option.';
      return 'This field is required.';
    }
    if (el.validity.typeMismatch && el.type === 'email') return 'Enter an email address like name@example.com.';
    if (el.validity.typeMismatch && el.type === 'url') return 'Enter a full web address starting with https://';
    return 'Please check this field.';
  }
  function showError(el) {
    var f = fieldOf(el); if (!f) return;
    f.classList.add('is-invalid');
    el.setAttribute('aria-invalid', 'true');
    var err = $('.field__error', f);
    if (err) err.textContent = messageFor(el);
  }
  function clearError(el) {
    var f = fieldOf(el); if (!f) return;
    f.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
  }
  $$('form[data-preview-form]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    var controls = $$('input, select, textarea', form);
    controls.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') { if (el.checkValidity()) clearError(el); else showError(el); } });
      el.addEventListener('input', function () { if (el.checkValidity()) clearError(el); });
      el.addEventListener('change', function () { if (el.checkValidity()) clearError(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      controls.forEach(function (el) {
        if (el.checkValidity()) clearError(el); else { showError(el); if (!firstBad) firstBad = el; }
      });
      var status = $('.form-status', form);
      if (firstBad) {
        if (status) status.hidden = true;
        firstBad.focus();
        return;
      }
      var btn = $('button[type="submit"]', form);
      function done() {
        if (status) { status.hidden = false; status.focus(); }
        if (btn) { btn.disabled = true; btn.textContent = 'Received'; }
      }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint || !window.fetch) { done(); return; }
      // WordPress: send to the AFSV VRC Core endpoint, which stores and emails it.
      if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
      fetch(endpoint, { method: 'POST', body: new FormData(form), credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
        .then(done)
        .catch(function () {
          if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); }
          var err = $('.form-error', form);
          if (err) { err.hidden = false; err.focus(); }
        });
    });
  });

  /* Preselect a value in a form select from a link (e.g. partners hero CTAs). */
  $$('[data-preselect]').forEach(function (a) {
    a.addEventListener('click', function () {
      var parts = a.getAttribute('data-preselect').split('=');
      var sel = document.getElementById(parts[0]);
      if (sel) { sel.value = parts[1]; sel.dispatchEvent(new Event('change')); }
    });
  });

  /* ───────── Leadership "read full bio" ───────── */
  $$('.leader__more').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = b.closest('.leader');
      var open = !card.classList.contains('is-expanded');
      card.classList.toggle('is-expanded', open);
      b.setAttribute('aria-expanded', String(open));
      b.textContent = open ? 'Show less' : 'Read full biography';
    });
  });

  /* ───────── Facilities filter ───────── */
  var facFilters = $$('[data-fac-filter]');
  if (facFilters.length) {
    var cards = $$('.facility-card');
    var live = $('#facility-count');
    facFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-fac-filter');
        facFilters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var n = 0;
        cards.forEach(function (c) {
          var show = key === 'all' || c.getAttribute('data-group') === key;
          c.hidden = !show; if (show) n++;
        });
        if (live) live.textContent = 'Showing ' + n + ' of ' + cards.length + ' facility groups';
      });
    });
  }

  /* ───────── Marketplace ───────── */
  var CATALOG = window.AFSV_CATALOG || null;
  var CART_KEY = 'afsv-cart-v1';
  var ORDER_KEY = 'afsv-last-order-v1';
  var COUPON_KEY = 'afsv-coupon-v1';
  var SHIP_KEY = 'afsv-ship-v1';

  function getCart() { return store.get(CART_KEY, []); }
  function setCart(c) { store.set(CART_KEY, c); paintCount(); }
  function findP(slug) {
    if (!CATALOG) return null;
    for (var i = 0; i < CATALOG.products.length; i++) if (CATALOG.products[i].slug === slug) return CATALOG.products[i];
    return null;
  }
  function paintCount() {
    var n = 0; getCart().forEach(function (l) { n += l.qty; });
    $$('[data-cart-count]').forEach(function (el) { el.textContent = String(n); });
    $$('.cart-link').forEach(function (a) { a.setAttribute('aria-label', 'View cart, ' + n + (n === 1 ? ' item' : ' items')); });
  }
  paintCount();

  function totals() {
    var lines = getCart().map(function (l) {
      var p = findP(l.slug) || { name: l.slug, price: 0 };
      return { key: l.key, slug: l.slug, variant: l.variant, qty: l.qty, p: p, line: p.price * l.qty };
    }).filter(function (l) { return l.p.price; });
    var sub = 0; lines.forEach(function (l) { sub += l.line; });
    var couponOn = !!store.get(COUPON_KEY, false);
    var disc = couponOn ? sub * 0.1 : 0;
    var shipId = store.get(SHIP_KEY, 'standard');
    var opt = (CATALOG.ship.filter(function (s) { return s.id === shipId; })[0]) || CATALOG.ship[0];
    var ship = lines.length ? opt.cost : 0;
    var tax = (sub - disc + ship) * 0.13;
    var rows = [{ k: 'Subtotal', v: money(sub) }];
    if (disc) rows.push({ k: 'Discount (AFSV10)', v: '−' + money(disc) });
    rows.push({ k: opt.label, v: opt.cost ? money(opt.cost) : 'Free' });
    rows.push({ k: 'HST 13% (ON)', v: money(tax) });
    return { lines: lines, rows: rows, total: sub - disc + ship + tax, ship: opt };
  }
  function rowsHTML(rows) {
    return rows.map(function (r) { return '<div><dt>' + esc(r.k) + '</dt><dd>' + esc(r.v) + '</dd></div>'; }).join('');
  }

  /* Shop: filters + sort, state mirrored in the URL so links like
     shop.html?cat=Apparel and back/forward work. */
  var shopGrid = $('#shop-grid');
  if (shopGrid) {
    var params = new URLSearchParams(window.location.search);
    var state = { cat: params.get('cat') || 'All', vendor: params.get('vendor') || 'All', sort: params.get('sort') || 'featured' };
    var chips = $$('[data-cat]');
    var vSel = $('#shop-vendor');
    var sSel = $('#shop-sort');
    var count = $('#shop-count');
    var empty = $('#shop-empty');
    var cardsArr = $$('.product-card', shopGrid);
    var original = cardsArr.slice();
    var apply = function (push) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-cat') === state.cat)); });
      if (vSel) vSel.value = state.vendor;
      if (sSel) sSel.value = state.sort;
      var visible = 0;
      var ordered = original.slice();
      if (state.sort === 'low') ordered.sort(function (a, b) { return +a.dataset.price - +b.dataset.price; });
      if (state.sort === 'high') ordered.sort(function (a, b) { return +b.dataset.price - +a.dataset.price; });
      if (state.sort === 'name') ordered.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); });
      ordered.forEach(function (card) {
        var show = (state.cat === 'All' || card.dataset.cat === state.cat) && (state.vendor === 'All' || card.dataset.vendor === state.vendor);
        card.hidden = !show; if (show) visible++;
        shopGrid.appendChild(card);
      });
      if (count) count.textContent = visible === 1 ? 'Showing 1 product' : 'Showing ' + visible + ' of ' + original.length + ' products';
      if (empty) empty.hidden = visible !== 0;
      if (push) {
        var q = new URLSearchParams();
        if (state.cat !== 'All') q.set('cat', state.cat);
        if (state.vendor !== 'All') q.set('vendor', state.vendor);
        if (state.sort !== 'featured') q.set('sort', state.sort);
        var qs = q.toString();
        history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
      }
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { state.cat = c.getAttribute('data-cat'); apply(true); }); });
    if (vSel) vSel.addEventListener('change', function () { state.vendor = vSel.value; apply(true); });
    if (sSel) sSel.addEventListener('change', function () { state.sort = sSel.value; apply(true); });
    $$('[data-clear-filters]').forEach(function (b) { b.addEventListener('click', function () { state = { cat: 'All', vendor: 'All', sort: 'featured' }; apply(true); }); });
    apply(false);
  }

  /* Product page */
  var prodEl = $('[data-product]');
  if (prodEl && CATALOG) {
    var slug = prodEl.getAttribute('data-product');
    var prod = findP(slug);
    var variant = prod && prod.variants ? prod.variants[0] : '';
    var qty = 1;
    var qOut = $('[data-qty]', prodEl);
    var added = $('#added-status');
    $$('[data-variant]', prodEl).forEach(function (b) {
      b.addEventListener('click', function () {
        variant = b.getAttribute('data-variant');
        $$('[data-variant]', prodEl).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        if (added) added.hidden = true;
      });
    });
    $$('[data-qty-step]', prodEl).forEach(function (b) {
      b.addEventListener('click', function () {
        qty = Math.max(1, Math.min(99, qty + (+b.getAttribute('data-qty-step'))));
        if (qOut) qOut.textContent = String(qty);
      });
    });
    var addBtn = $('[data-add-to-cart]', prodEl);
    if (addBtn) addBtn.addEventListener('click', function () {
      var key = slug + '|' + variant;
      var cart = getCart(); var found = false;
      cart.forEach(function (l) { if (l.key === key) { l.qty += qty; found = true; } });
      if (!found) cart.push({ key: key, slug: slug, variant: variant, qty: qty });
      setCart(cart);
      if (added) { added.hidden = false; added.focus(); }
    });
    // Gallery thumbs: swap focal point of the main image
    var main = $('.gallery__main img', prodEl);
    $$('.gallery__thumbs button', prodEl).forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.gallery__thumbs button', prodEl).forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
        if (main) main.style.objectPosition = t.getAttribute('data-pos');
      });
    });
  }

  /* Cart page */
  var cartRoot = $('#cart-root');
  if (cartRoot && CATALOG) {
    var renderCart = function () {
      var t = totals();
      $('#cart-empty').hidden = t.lines.length !== 0;
      $('#cart-filled').hidden = t.lines.length === 0;
      if (!t.lines.length) return;
      $('#cart-lines').innerHTML = t.lines.map(function (l) {
        return '<div class="cart-line">' +
          '<div class="cart-line__img"><img src="' + esc(l.p.img) + '" alt="" loading="lazy"></div>' +
          '<div><p class="product-card__vendor">' + esc(l.p.vendor) + '</p>' +
          '<h2><a href="product-' + esc(l.slug) + '.html">' + esc(l.p.name) + '</a></h2>' +
          '<p class="small">' + (l.variant ? esc(l.variant) + ' · ' : '') + money(l.p.price) + ' each</p>' +
          '<button type="button" class="link-btn mt-0" data-remove="' + esc(l.key) + '">Remove<span class="sr-only"> ' + esc(l.p.name) + '</span></button></div>' +
          '<div class="qty qty--sm" role="group" aria-label="Quantity for ' + esc(l.p.name) + '">' +
          '<button type="button" data-bump="' + esc(l.key) + '" data-d="-1" aria-label="Decrease quantity">−</button>' +
          '<span aria-live="polite">' + l.qty + '</span>' +
          '<button type="button" data-bump="' + esc(l.key) + '" data-d="1" aria-label="Increase quantity">+</button></div>' +
          '<span class="cart-line__total">' + money(l.line) + '</span></div>';
      }).join('');
      $('#cart-totals').innerHTML = rowsHTML(t.rows);
      $('#cart-total').textContent = money(t.total);
    };
    cartRoot.addEventListener('click', function (e) {
      var rm = e.target.closest('[data-remove]');
      var bump = e.target.closest('[data-bump]');
      if (rm) { setCart(getCart().filter(function (l) { return l.key !== rm.getAttribute('data-remove'); })); renderCart(); }
      if (bump) {
        var k = bump.getAttribute('data-bump'), d = +bump.getAttribute('data-d');
        setCart(getCart().map(function (l) { if (l.key === k) l.qty = Math.max(1, l.qty + d); return l; }));
        renderCart();
        var again = $('[data-bump="' + k + '"][data-d="' + d + '"]', cartRoot); if (again) again.focus();
      }
    });
    var cForm = $('#coupon-form');
    if (cForm) cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = $('#coupon', cForm).value.trim().toUpperCase() === 'AFSV10';
      store.set(COUPON_KEY, ok);
      $('#coupon-msg').textContent = ok ? 'Coupon AFSV10 applied — 10% off the subtotal.' : 'That code is not recognised. The preview test code is AFSV10.';
      renderCart();
    });
    renderCart();
  }

  /* Checkout */
  var coRoot = $('#checkout-root');
  if (coRoot && CATALOG) {
    var renderCo = function () {
      var t = totals();
      $('#co-empty').hidden = t.lines.length !== 0;
      $('#co-form').hidden = t.lines.length === 0;
      if (!t.lines.length) return;
      $('#co-lines').innerHTML = t.lines.map(function (l) {
        return '<li><span class="q">' + l.qty + '</span><span class="n">' + esc(l.p.name) +
          '<small>' + esc(l.p.vendor) + (l.variant ? ' · ' + esc(l.variant) : '') + '</small></span>' +
          '<span class="p">' + money(l.line) + '</span></li>';
      }).join('');
      $('#co-totals').innerHTML = rowsHTML(t.rows);
      $('#co-total').textContent = money(t.total);
    };
    var cur = store.get(SHIP_KEY, 'standard');
    $$('input[name="shipping"]', coRoot).forEach(function (r) {
      r.checked = r.value === cur;
      r.addEventListener('change', function () { store.set(SHIP_KEY, r.value); renderCo(); });
    });
    var coForm = $('#co-form');
    coForm.setAttribute('novalidate', '');
    coForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      $$('input[required]', coForm).forEach(function (el) {
        if (el.checkValidity()) clearError(el); else { showError(el); if (!bad) bad = el; }
      });
      if (bad) { bad.focus(); return; }
      var t = totals(); if (!t.lines.length) return;
      var d = new Date();
      store.set(ORDER_KEY, {
        num: 'AFSV-' + String(Date.now()).slice(-6),
        date: d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }),
        ship: t.ship.label,
        lines: t.lines.map(function (l) { return { name: l.p.name, vendor: l.p.vendor, variant: l.variant, qty: l.qty, line: l.line }; }),
        rows: t.rows, total: t.total
      });
      store.set(COUPON_KEY, false);
      setCart([]);
      window.location.href = 'order-received.html';
    });
    renderCo();
  }

  /* Order received */
  var orderRoot = $('#order-root');
  if (orderRoot) {
    var ord = store.get(ORDER_KEY, null);
    $('#order-none').hidden = !!ord;
    $('#order-has').hidden = !ord;
    if (ord) {
      $('#order-meta').innerHTML = [
        ['Order number', ord.num], ['Date', ord.date], ['Payment', 'Test mode — not charged'], ['Delivery', ord.ship]
      ].map(function (m) { return '<div><p>' + esc(m[0]) + '</p><p>' + esc(m[1]) + '</p></div>'; }).join('');
      $('#order-lines').innerHTML = ord.lines.map(function (l) {
        return '<li><span class="q">' + l.qty + '</span><span class="n">' + esc(l.name) +
          '<small>' + esc(l.vendor) + (l.variant ? ' · ' + esc(l.variant) : '') + '</small></span><span class="p">' + money(l.line) + '</span></li>';
      }).join('');
      $('#order-totals').innerHTML = rowsHTML(ord.rows);
      $('#order-total').textContent = money(ord.total);
    }
  }
})();
