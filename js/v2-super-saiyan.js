/* ─────────────────────────────────────────────────────────────
   FJMedia v2 — Super Saiyan JS layer
   FAQ accordion height interpolation (cross-browser).
   ───────────────────────────────────────────────────────────── */
(function() {
  'use strict';

  function initFaqAnimations() {
    var faq = document.getElementById('faq');
    if (!faq) return;

    var details = faq.querySelectorAll('details');

    details.forEach(function(d) {
      var summary = d.querySelector('summary');
      var inner   = d.querySelector(':scope > div');
      if (!summary || !inner) return;

      // Set initial height based on open state
      function syncInitial() {
        if (d.open) {
          inner.style.height = inner.scrollHeight + 'px';
        } else {
          inner.style.height = '0px';
        }
      }
      syncInitial();

      summary.addEventListener('click', function(e) {
        e.preventDefault();

        if (d.open) {
          // CLOSE: lock current height, then transition to 0
          var startH = inner.scrollHeight;
          inner.style.height = startH + 'px';
          // Force reflow so the browser sees the explicit height
          // before we transition to 0.
          /* eslint-disable no-unused-expressions */
          inner.offsetHeight;
          /* eslint-enable no-unused-expressions */
          requestAnimationFrame(function() {
            inner.style.height = '0px';
          });

          var onEnd = function() {
            d.open = false;
            inner.removeEventListener('transitionend', onEnd);
          };
          inner.addEventListener('transitionend', onEnd, { once: true });
        } else {
          // OPEN: set open, measure, then animate from 0 to scrollHeight
          d.open = true;
          inner.style.height = '0px';
          /* eslint-disable no-unused-expressions */
          inner.offsetHeight;
          /* eslint-enable no-unused-expressions */
          var endH = inner.scrollHeight;
          requestAnimationFrame(function() {
            inner.style.height = endH + 'px';
          });

          var onOpen = function() {
            inner.style.height = 'auto';
            inner.removeEventListener('transitionend', onOpen);
          };
          inner.addEventListener('transitionend', onOpen, { once: true });
        }
      });

      // Optional: close other details when one opens (single-open accordion).
      // Comment this block if multi-open is preferred.
      summary.addEventListener('click', function() {
        if (!d.open) return; // we just closed it
        details.forEach(function(other) {
          if (other === d || !other.open) return;
          var oSummary = other.querySelector('summary');
          if (oSummary) oSummary.click();
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAnimations);
  } else {
    initFaqAnimations();
  }
})();
