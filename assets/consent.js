/* Clinivo Media: cookie consent + Google Analytics 4 (loads only after the visitor accepts). */
(function () {
  // ▼ Paste your Google Analytics 4 Measurement ID between the quotes, e.g. 'G-ABC123XYZ'.
  //   Leave it empty and nothing is tracked. This ID is public by design, it is not a secret.
  var GA_ID = '';

  var KEY = 'clv-consent-v1';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Google Consent Mode v2: everything denied until the visitor says yes. No ads storage, ever.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'denied', security_storage: 'granted',
    wait_for_update: 500
  });

  var loaded = false;
  function loadGA() {
    if (loaded || !/^G-[A-Z0-9]+$/.test(GA_ID)) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  function clearGACookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^_ga/.test(name)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/' + d;
        });
      }
    });
  }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(v) {
    if (v === 'granted') { gtag('consent', 'update', { analytics_storage: 'granted' }); loadGA(); }
    else { gtag('consent', 'update', { analytics_storage: 'denied' }); clearGACookies(); }
  }

  var el = null;
  function close() { if (el) { el.remove(); el = null; } }
  function choose(v) {
    var before = read(); write(v); apply(v); close();
    if (before === 'granted' && v === 'denied' && loaded) location.reload(); // fully stop a running tracker
  }
  function banner() {
    if (el) return;
    el = document.createElement('section');
    el.className = 'cookie';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-labelledby', 'cookie-title');
    var h = document.createElement('h2'); h.id = 'cookie-title'; h.textContent = 'Cookies on this site';
    var p = document.createElement('p');
    p.append('We only use cookies to understand which pages help doctors most, through Google Analytics, and only if you agree. Essential storage remembers this choice. ');
    var a = document.createElement('a'); a.href = 'privacy.html#cookies'; a.textContent = 'Read the Privacy Policy'; p.append(a, '.');
    var row = document.createElement('div'); row.className = 'row';
    var no = document.createElement('button'); no.type = 'button'; no.className = 'reject'; no.textContent = 'Reject';
    var yes = document.createElement('button'); yes.type = 'button'; yes.className = 'accept'; yes.textContent = 'Accept analytics';
    no.addEventListener('click', function () { choose('denied'); });
    yes.addEventListener('click', function () { choose('granted'); });
    row.append(no, yes);
    el.append(h, p, row);
    document.body.appendChild(el);
  }

  var saved = read();
  if (saved) apply(saved);
  function boot() { if (!read()) banner(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (t) { e.preventDefault(); banner(); }
  });

  // Small helper the pages use for key events (only sends if the visitor accepted).
  window.clvTrack = function (name, params) { if (read() === 'granted' && loaded) gtag('event', name, params || {}); };

  // Mobile menu (shared by every page)
  function menu() {
    var btn = document.querySelector('.menu-btn'), list = document.getElementById('menu');
    if (!btn || !list) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open)); list.classList.toggle('open', open);
    });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); list.classList.remove('open'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && list.classList.contains('open')) { btn.setAttribute('aria-expanded', 'false'); list.classList.remove('open'); btn.focus(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', menu); else menu();
})();
