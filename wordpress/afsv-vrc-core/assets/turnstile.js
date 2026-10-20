/* Cloudflare Turnstile on the site's forms (AFSV VRC Core). Adds an invisible check to every
   form[data-preview-form]; the token travels with the form as "cf-turnstile-response". */
(function () {
  var cfg = window.AFSV_TURNSTILE;
  if (!cfg || !cfg.key) return;
  var tries = 0;

  function setup(form) {
    if (form.__afsvTs) return;
    form.__afsvTs = true;
    var holder = document.createElement('div');
    holder.className = 'afsv-turnstile';
    var btn = form.querySelector('button[type="submit"]');
    if (btn && btn.parentNode) btn.parentNode.insertBefore(holder, btn); else form.appendChild(holder);
    var token = '', waiting = false, id;

    function note(text) {
      var s = form.querySelector('.form-status');
      if (s) { s.textContent = text; s.hidden = false; }
    }
    id = window.turnstile.render(holder, {
      sitekey: cfg.key,
      appearance: 'interaction-only',
      callback: function (t) {
        token = t;
        if (waiting) { waiting = false; form.requestSubmit(); }
      },
      'expired-callback': function () { token = ''; },
      'error-callback': function () { token = ''; }
    });

    // Runs before the site's own handler: hold the submit until the check has finished, then send it.
    form.addEventListener('submit', function (e) {
      if (!token) {
        e.preventDefault();
        e.stopImmediatePropagation();
        waiting = true;
        note('Checking that you are human… one moment.');
      }
    }, true);

    // A token works once. After each send, get a fresh one ready (for a retry).
    form.addEventListener('submit', function () {
      setTimeout(function () { token = ''; try { window.turnstile.reset(id); } catch (err) { /* ignore */ } }, 0);
    });
  }

  function init() {
    if (!window.turnstile) {
      if (tries++ < 100) setTimeout(init, 100);
      return;
    }
    Array.prototype.forEach.call(document.querySelectorAll('form[data-preview-form]'), setup);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
