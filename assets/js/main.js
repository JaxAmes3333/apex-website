(function () {
  'use strict';

  // year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var mnav = document.getElementById('mobile-nav');
  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // testimonial carousel
  var root = document.querySelector('[data-carousel]');
  if (root) {
    var track = root.querySelector('[data-track]');
    var slides = track.children;
    var dotsWrap = root.querySelector('[data-dots]');
    var index = 0;

    function perView() { return window.innerWidth >= 1024 ? 2 : 1; }
    function pages() { return Math.max(1, slides.length - perView() + 1); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pages(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        b.addEventListener('click', (function (n) { return function () { go(n); }; })(i));
        dotsWrap.appendChild(b);
      }
    }

    function go(n) {
      var p = pages();
      index = ((n % p) + p) % p;
      var step = 100 / perView();
      track.style.transform = 'translateX(calc(-' + (index * step) + '% - ' + (index * (perView() > 1 ? 12 : 0)) + 'px))';
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.setAttribute('aria-current', String(i === index));
      });
    }

    root.querySelector('[data-prev]').addEventListener('click', function () { go(index - 1); });
    root.querySelector('[data-next]').addEventListener('click', function () { go(index + 1); });

    var lastPer = perView();
    window.addEventListener('resize', function () {
      if (perView() !== lastPer) { lastPer = perView(); buildDots(); go(0); }
    });

    buildDots();
    go(0);
  }

  // contact form
  var form = document.getElementById('enquiry');
  if (form) {
    var status = form.querySelector('[data-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      var ok = true;
      ['name', 'email', 'message'].forEach(function (id) {
        var f = form.elements[id];
        var bad = !f.value.trim() || (id === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) {
        status.className = 'form-status is-err';
        status.textContent = 'Please check the highlighted fields and try again.';
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('bad response');
        form.reset();
        status.className = 'form-status is-ok';
        status.textContent = 'Thanks, your enquiry is on its way. We will come back to you by email.';
      }).catch(function () {
        status.className = 'form-status is-err';
        status.innerHTML = 'Something went wrong. Please email <a href="mailto:admin@teamapex.com.au">admin@teamapex.com.au</a> directly.';
      }).then(function () {
        btn.disabled = false;
        btn.innerHTML = label;
      });
    });
  }
})();
