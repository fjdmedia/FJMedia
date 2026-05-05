/* Linda Quach Photography — HERO V2 motion (additive layer)
   Loaded after site.js, on index.html only.
   - Splits each .hero__quote into per-letter spans for stagger reveal
   - Mirrors the V1 quote rotator into segmented progress bars
   - Updates the italic counter ("01 of 03")
*/
(function () {
  'use strict';

  // 1. Split hero quotes into character spans
  function splitQuote(p) {
    if (p.dataset.heroV2Split) return;
    p.dataset.heroV2Split = '1';
    var text = p.textContent;
    p.textContent = '';
    var words = text.split(/\s+/);
    var charDelay = 0;
    words.forEach(function (word, wi) {
      var wordSpan = document.createElement('span');
      wordSpan.className = 'v2-word';
      for (var i = 0; i < word.length; i++) {
        var charSpan = document.createElement('span');
        charSpan.className = 'v2-char';
        charSpan.textContent = word.charAt(i);
        charSpan.style.setProperty('--v2-d', charDelay + 'ms');
        wordSpan.appendChild(charSpan);
        charDelay += 28;
      }
      p.appendChild(wordSpan);
      if (wi < words.length - 1) p.appendChild(document.createTextNode(' '));
      charDelay += 60;
    });
  }
  document.querySelectorAll('.hero__quote').forEach(splitQuote);

  // 2. Sync segmented progress bars with V1's quote rotator
  var progressBars = document.querySelectorAll('.hero__progress-bar');
  var quotes = document.querySelectorAll('.hero__quote');
  var counterEl = document.querySelector('.hero__counter b');
  var counterTotal = document.querySelector('.hero__counter span');
  if (counterTotal) counterTotal.textContent = String(quotes.length).padStart(2, '0');

  function syncProgressFromActiveQuote() {
    var activeIdx = -1;
    quotes.forEach(function (q, i) { if (q.classList.contains('is-active')) activeIdx = i; });
    if (activeIdx < 0) return;
    progressBars.forEach(function (b, i) {
      b.classList.remove('is-active', 'is-played');
      if (i < activeIdx) b.classList.add('is-played');
      if (i === activeIdx) b.classList.add('is-active');
    });
    if (counterEl) counterEl.textContent = String(activeIdx + 1).padStart(2, '0');
  }

  // Click a progress bar = jump to that quote (delegate to V1 dot)
  progressBars.forEach(function (bar, i) {
    bar.addEventListener('click', function () {
      var dot = document.querySelectorAll('.hero__dot')[i];
      if (dot) dot.click();
    });
  });

  // Watch V1's class toggling on the quotes
  if (quotes.length) {
    var observer = new MutationObserver(syncProgressFromActiveQuote);
    quotes.forEach(function (q) {
      observer.observe(q, { attributes: true, attributeFilter: ['class'] });
    });
    syncProgressFromActiveQuote();
  }
})();
