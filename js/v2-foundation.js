/* ==========================================================================
   FJMedia v2 — Foundation JS
   Single-purpose: toggle `nav.scrolled` past 60px using IntersectionObserver.
   Canonical pattern: ref-tag `scroll-aware-nav`.
   Zero scroll listeners, zero per-frame cost, zero layout thrash.
   ========================================================================== */
(function () {
  'use strict';

  // Respect reduced-motion: skip the effect entirely for users who opted out.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var nav = document.querySelector('nav');
  if (!nav) return;

  // Inject a 1px sentinel at the very top of the document.
  // When it scrolls out of the viewport (past 60px), nav gets .scrolled.
  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none;';
  document.body.insertBefore(sentinel, document.body.firstChild);

  if (!('IntersectionObserver' in window)) return; // graceful degrade

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // Sentinel visible = we're at the top. Sentinel hidden = we've scrolled.
      if (entry.isIntersecting) {
        nav.classList.remove('scrolled');
      } else {
        nav.classList.add('scrolled');
      }
    });
  }, { threshold: 0, rootMargin: '0px' });

  io.observe(sentinel);
})();
