/* Cloudflare Turnstile on the site's forms (AFSV VRC Core). Adds an invisible check to every
   form[data-preview-form]; the token travels with the form as "cf-turnstile-response". */
(function () {
  var cfg = window.AFSV_TURNSTILE;
  if (!cfg || !cfg.key) return;
  var tries = 0;
  // Turnstile only works on the domain it was created for. On any other address (such as the review address)
  // forms are switched off, with a pointer to the main site, instead of waiting for a check that cannot run.
  var wrongHost = cfg.host && location.hostname.toLowerCase() !== cfg.host;

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

  function blockForms() {
    Array.prototype.forEach.call(document.querySelectorAll('form[data-preview-form]'), function (form) {
      if (form.__afsvTs) return;
      form.__afsvTs = true;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var s = form.querySelector('.form-status');
        if (s) { s.textContent = 'Forms are switched off on this review address. Please use https://' + cfg.host + ' to send a message.'; s.hidden = false; }
      }, true);
    });
  }

  function init() {
    if (wrongHost) { blockForms(); return; }
    if (!window.turnstile) {
      if (tries++ < 100) setTimeout(init, 100);
      return;
    }
    Array.prototype.forEach.call(document.querySelectorAll('form[data-preview-form]'), setup);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
