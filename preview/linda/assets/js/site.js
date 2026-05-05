/* Linda Quach Photography — site.js
   Mobile nav · scroll reveals · gallery tabs · lightbox */
(function () {
  'use strict';

  // Opt-in to JS-only reveal styles. Default state is visible (set in CSS).
  // If this script never runs, content stays visible — no blank page.
  document.documentElement.classList.add('js-ready');

  // -------- Hero quote + slide rotator (home) --------
  // Quote N is paired with slide N (same index) — they cross-fade together.
  var quotes = document.querySelectorAll('.hero__quote');
  var slides = document.querySelectorAll('.hero__slide');
  var dots = document.querySelectorAll('.hero__dot');
  if (quotes.length > 1) {
    var qi = 0;
    function setHero(idx) {
      qi = (idx + quotes.length) % quotes.length;
      quotes.forEach(function (q, i) { q.classList.toggle('is-active', i === qi); });
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === qi); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === qi); });
    }
    setHero(0);
    var quoteTimer = window.setInterval(function () { setHero(qi + 1); }, 5500);
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        setHero(i);
        window.clearInterval(quoteTimer);
        quoteTimer = window.setInterval(function () { setHero(qi + 1); }, 5500);
      });
    });
  } else if (quotes.length === 1) {
    quotes[0].classList.add('is-active');
    if (slides.length === 1) slides[0].classList.add('is-active');
  }

  // -------- Mobile nav toggle --------
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth < 980 && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // -------- Reveal on scroll --------
  var reveals = document.querySelectorAll('.reveal, .figure--reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });

    // Safety net: anything still hidden after 1.6s gets force-revealed.
    // Catches: screenshots, prerenders, observers that never fire on tall pages.
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }, 1600);
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // -------- Gallery tabs --------
  var tabs = document.querySelectorAll('.gallery-tab');
  var panels = document.querySelectorAll('.gallery-panel');

  function activateTab(target) {
    tabs.forEach(function (t) { t.classList.toggle('is-active', t.dataset.target === target); });
    panels.forEach(function (p) { p.classList.toggle('is-active', p.id === target); });
    var panel = document.getElementById(target);
    if (panel) {
      panel.querySelectorAll('.figure--reveal').forEach(function (f) {
        f.classList.remove('is-visible');
        requestAnimationFrame(function () { f.classList.add('is-visible'); });
      });
    }
  }

  if (tabs.length && panels.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.target;
        activateTab(target);
        var tabsBar = document.querySelector('.gallery-tabs');
        if (tabsBar) {
          var top = tabsBar.getBoundingClientRect().top + window.pageYOffset - 90;
          if (window.pageYOffset > top + 200) window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });

    // Deep-link via #engagement / #couples / etc.
    var hash = (window.location.hash || '').replace('#', '');
    if (hash) {
      var match = document.querySelector('.gallery-tab[data-target="gallery-' + hash + '"]');
      if (match) activateTab('gallery-' + hash);
    }
  }

  // -------- Lightbox --------
  var lbTriggers = document.querySelectorAll('[data-lightbox]');
  if (lbTriggers.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Close gallery">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">←</button>' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Next image">→</button>' +
      '<figure class="lightbox__figure"><img alt=""/></figure>' +
      '<span class="lightbox__count"></span>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('img');
    var lbCount = lb.querySelector('.lightbox__count');
    var currentList = [];
    var currentIndex = 0;

    function open(list, idx) {
      currentList = list;
      currentIndex = idx;
      render();
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function render() {
      var t = currentList[currentIndex];
      if (!t) return;
      lbImg.src = t.getAttribute('href') || (t.querySelector('img') ? t.querySelector('img').src : '');
      lbImg.alt = t.querySelector('img') ? t.querySelector('img').alt : '';
      if (lbCount) lbCount.textContent = (currentIndex + 1) + ' / ' + currentList.length;
    }
    function next() { currentIndex = (currentIndex + 1) % currentList.length; render(); }
    function prev() { currentIndex = (currentIndex - 1 + currentList.length) % currentList.length; render(); }

    lbTriggers.forEach(function (trig) {
      trig.addEventListener('click', function (e) {
        e.preventDefault();
        var groupContainer = trig.closest('[data-lightbox-group]');
        var list = groupContainer
          ? Array.prototype.slice.call(groupContainer.querySelectorAll('[data-lightbox]'))
          : Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
        open(list, list.indexOf(trig));
      });
    });

    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', prev);
    lb.querySelector('.lightbox__nav--next').addEventListener('click', next);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }
})();
