/* ===================================================================
   M66 VENTURES — interactions
   =================================================================== */
(function () {
  'use strict';

  /* ----- Supabase config (contact form) -----
     Filled in once the M66 Supabase project + `leads` table exist.
     Until then the form degrades gracefully to a mailto fallback. */
  var SUPABASE_URL = '';
  var SUPABASE_KEY = '';
  var CONTACT_EMAIL = 'legal@m66ventures.com';

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };

  /* ---------- year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- nav scrolled state ---------- */
  var nav = $('#nav');
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- dropdown (click to toggle, accessible) ---------- */
  var dd = $('#dropdown');
  var ddBtn = $('#dropdownBtn');
  var openDropdown = function () {
    dd.classList.add('is-open');
    ddBtn.setAttribute('aria-expanded', 'true');
  };
  var closeDropdown = function () {
    dd.classList.remove('is-open');
    ddBtn.setAttribute('aria-expanded', 'false');
  };
  ddBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    dd.classList.contains('is-open') ? closeDropdown() : openDropdown();
  });
  document.addEventListener('click', function (e) {
    if (!dd.contains(e.target)) closeDropdown();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDropdown(); closeMobile(); }
  });
  // Hover-open on pointer devices for that effortless feel
  if (window.matchMedia('(hover: hover) and (min-width: 761px)').matches) {
    dd.addEventListener('mouseenter', openDropdown);
    dd.addEventListener('mouseleave', closeDropdown);
  }

  /* ---------- mobile menu ---------- */
  var toggle = $('#navToggle');
  var menu = $('.nav__menu');
  var closeMobile = function () {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Close mobile menu after tapping a real link
  menu.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) closeMobile();
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- legal placeholders ---------- */
  document.querySelectorAll('[data-legal]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      alert('A ' + (a.dataset.legal === 'privacy' ? 'Privacy Policy' : 'Terms of Service') +
            ' page will be linked here before launch.');
    });
  });

  /* ---------- contact form ---------- */
  var form = $('#contactForm');
  var statusEl = $('#formStatus');
  var submitBtn = $('#submitBtn');

  var setStatus = function (msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = 'form__status' + (kind ? ' is-' + kind : '');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('');

    var data = {
      name: $('#name').value.trim(),
      email: $('#email').value.trim(),
      company: $('#company').value.trim(),
      message: $('#message').value.trim()
    };

    if (!data.name || !data.email || !data.message) {
      setStatus('Please complete the required fields.', 'err');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setStatus('Please enter a valid email address.', 'err');
      return;
    }

    // Graceful fallback before the backend is wired: open the user's mail client.
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      var subject = encodeURIComponent('M66 Ventures inquiry — ' + data.name);
      var body = encodeURIComponent(
        data.message + '\n\n— ' + data.name +
        (data.company ? ', ' + data.company : '') + '\n' + data.email
      );
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
      setStatus('Opening your email app…', 'ok');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(SUPABASE_URL + '/rest/v1/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message,
        source: 'm66ventures.com'
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        form.reset();
        setStatus('Thank you — your message has been received. We’ll be in touch shortly.', 'ok');
      })
      .catch(function () {
        setStatus('Something went wrong. Please email ' + CONTACT_EMAIL + '.', 'err');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });
})();
