/* AFSV VRC cookie notice. One first-party cookie records the choice; optional scripts wait for it.
   Optional script pattern: <script type="text/plain" data-afsv-consent="analytics" src="…"></script> */
(function () {
  var cfg = window.AFSV_COOKIES || { name: 'afsv_cookies', privacy: '/privacy/' };
  var box;

  function read() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + cfg.name + '=([^;]*)'));
    if (!m) return null;
    try { var v = JSON.parse(decodeURIComponent(m[1])); return v && typeof v === 'object' ? v : null; } catch (e) { return null; }
  }
  function save(optional) {
    var v = encodeURIComponent(JSON.stringify({ v: 1, optional: optional ? 1 : 0, t: Math.floor(Date.now() / 1000) }));
    document.cookie = cfg.name + '=' + v + '; Max-Age=' + (60 * 60 * 24 * 180) + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    if (optional) runOptional();
    try { document.dispatchEvent(new CustomEvent('afsv:cookies', { detail: { optional: !!optional } })); } catch (e) { /* old browser */ }
  }
  function runOptional() {
    Array.prototype.forEach.call(document.querySelectorAll('script[type="text/plain"][data-afsv-consent]'), function (s) {
      if (s.__done) return;
      s.__done = true;
      var n = document.createElement('script');
      Array.prototype.forEach.call(s.attributes, function (a) { if (a.name !== 'type') n.setAttribute(a.name, a.value); });
      n.text = s.text;
      s.parentNode.replaceChild(n, s);
    });
  }
  function close() { if (box) { box.hidden = true; } var l = document.querySelector('.afsv-ck-link'); if (l) l.focus(); }

  function build() {
    box = document.createElement('div');
    box.className = 'afsv-ck';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-labelledby', 'afsv-ck-h');
    box.hidden = true;
    box.innerHTML =
      '<h2 id="afsv-ck-h">Cookies on this site</h2>' +
      '<p>We use only the cookies needed to run this site and keep it secure, such as the security check on our forms. We do not use advertising cookies, and we do not use analytics at the moment. If we add optional tools later, we will ask you first. See our <a href="' + cfg.privacy + '">Privacy Policy</a>.</p>' +
      '<ul class="afsv-ck__panel" hidden>' +
      '<li><b>Essential (always on)</b>Needed for security, forms and to remember this choice.</li>' +
      '<li><label><input type="checkbox" id="afsv-ck-opt"><span><b>Optional (analytics, marketing)</b>None are used today. If you allow them now, they stay off until we add any.</span></label></li>' +
      '</ul>' +
      '<div class="afsv-ck__row">' +
      '<button type="button" class="afsv-ck__yes">Accept optional cookies</button>' +
      '<button type="button" class="afsv-ck__no">Essential only</button>' +
      '<button type="button" class="afsv-ck__set" aria-expanded="false">Cookie settings</button>' +
      '</div>';
    document.body.appendChild(box);
    var panel = box.querySelector('.afsv-ck__panel'), opt = box.querySelector('#afsv-ck-opt'), set = box.querySelector('.afsv-ck__set');
    box.querySelector('.afsv-ck__yes').addEventListener('click', function () { save(true); close(); });
    box.querySelector('.afsv-ck__no').addEventListener('click', function () { save(false); close(); });
    set.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      set.setAttribute('aria-expanded', String(open));
      set.textContent = open ? 'Save my choice' : 'Cookie settings';
      if (!open) { save(opt.checked); close(); }
    });
    box.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); } });
  }
  function show() {
    if (!box) build();
    var c = read();
    box.querySelector('#afsv-ck-opt').checked = !!(c && c.optional);
    box.hidden = false;
    var b = box.querySelector('.afsv-ck__yes');
    if (b) b.focus();
  }
  function footerLink() {
    var bar = document.querySelector('.site-footer__bar .wrap') || document.querySelector('.site-footer__bar');
    if (!bar || bar.querySelector('.afsv-ck-link')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'afsv-ck-link';
    b.textContent = 'Cookie settings';
    b.addEventListener('click', show);
    var p = bar.querySelector('p');
    (p || bar).appendChild(b);
  }
  function init() {
    footerLink();
    var c = read();
    if (c && c.optional) runOptional();
    if (!c) show();
    window.AFSVCookies = { open: show, allowed: function () { var x = read(); return !!(x && x.optional); } };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
