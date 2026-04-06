# Pricing Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed 4-tier pricing section and "What We Build" services section on the FJMedia agency site with an interactive McDonald's-style service calculator that captures leads without showing prices.

**Architecture:** Single-file edit to `index.html`. The existing `#services` section (lines 1048-1113) is removed entirely. The existing `#pricing` section (lines 1369-1546) is gutted and replaced with the interactive calculator. All related CSS, mobile CSS, JS, and GSAP animations are swapped. A lead capture form POSTs to a GAS endpoint (URL TBD — James will deploy the GAS script separately). Nav links and contact form dropdown are updated to match.

**Tech Stack:** HTML/CSS/JS inline in index.html, GSAP + ScrollTrigger (already loaded), Google Apps Script (deployed separately)

**Reference files:**
- Design spec: `docs/superpowers/specs/2026-04-05-pricing-calculator-design.md`
- Approved mockup: `.superpowers/brainstorm/829-1775433301/content/service-menu-v3.html`
- Target file: `FJDMedia Website/index.html` (1956 lines)

---

### Task 1: Remove the #services "What We Build" section

The `#services` section is being replaced by the calculator's interactive service grid. Remove the HTML, CSS, GSAP animation, and nav links pointing to it.

**Files:**
- Modify: `FJDMedia Website/index.html`

- [ ] **Step 1: Remove #services HTML (lines 1048-1114)**

Delete the entire `<section id="services">` block including the blank line after it:

```html
<!-- DELETE from line 1048 through 1114 -->
  <section id="services">
    <div class="section-inner">
      ...everything inside...
    </div>
  </section>

  <!-- PROCESS -->
```

Keep the `<!-- PROCESS -->` comment — only delete from `<section id="services">` through `</section>` and the blank line after it.

- [ ] **Step 2: Remove #services CSS (lines 247-257)**

Delete these CSS rules:

```css
/* SERVICES */
#services { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.services-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 10px; overflow: hidden;
}
.service-card { background: var(--bg); padding: 2rem 1.8rem; transition: background 0.2s; }
.service-card:hover { background: var(--bg2); }
.service-name { font-size: 0.95rem; font-weight: 700; color: var(--heading); margin-bottom: 0.4rem; }
.service-desc { font-size: 0.83rem; color: var(--text-light); line-height: 1.65; }
```

Also delete the mobile rule inside `@media (max-width: 900px)`:

```css
/* Services / Why */
.services-grid, .why-grid { grid-template-columns: 1fr; }
```

Change it to:

```css
/* Why */
.why-grid { grid-template-columns: 1fr; }
```

- [ ] **Step 3: Remove GSAP animation for .service-card**

Delete this block from the `<script>` section:

```javascript
// Service cards — stagger in
gsap.from('.service-card', {
  scrollTrigger: { trigger: '.services-grid', start: 'top 78%', once: true },
  opacity: 0, y: 35, duration: 0.55, stagger: 0.07, ease: 'power2.out'
});
```

- [ ] **Step 4: Update nav links**

In the desktop nav (`<ul class="nav-links">`), remove the Services link:

```html
<!-- REMOVE this line -->
<li><a href="#services">Services</a></li>
```

Change the Pricing link text:

```html
<!-- CHANGE FROM -->
<li><a href="#pricing">Pricing</a></li>
<!-- CHANGE TO -->
<li><a href="#pricing">Get a Quote</a></li>
```

In the mobile nav overlay (`<div class="nav-overlay">`), remove the Services link:

```html
<!-- REMOVE this line -->
<a href="#services" onclick="toggleNav()">Services</a>
```

Change the Pricing link text:

```html
<!-- CHANGE FROM -->
<a href="#pricing"  onclick="toggleNav()">Pricing</a>
<!-- CHANGE TO -->
<a href="#pricing" onclick="toggleNav()">Get a Quote</a>
```

In the footer links, remove the Services link:

```html
<!-- REMOVE this line from footer-links -->
<a href="#services">Services</a>
```

- [ ] **Step 5: Verify in browser**

Open `index.html` in a browser. Confirm:
- No "What We Build" section visible
- Nav no longer has "Services" link
- Nav has "Get a Quote" instead of "Pricing"
- No console errors
- Page still scrolls correctly (no broken anchor jumps)

- [ ] **Step 6: Commit**

```bash
git add "FJDMedia Website/index.html"
git commit -m "feat: remove #services section — replaced by upcoming calculator"
```

---

### Task 2: Strip old #pricing section content

Gut the existing `#pricing` section HTML, keeping only the `<section>` wrapper. Also remove all old pricing-related CSS.

**Files:**
- Modify: `FJDMedia Website/index.html`

- [ ] **Step 1: Replace #pricing section HTML**

Replace everything from `<section id="pricing">` through `</section>` (before `<!-- CONTACT -->`) with this empty placeholder:

```html
  <section id="pricing">
    <div class="section-inner">
      <!-- Calculator will be added in Task 3 -->
    </div>
  </section>
```

This removes: ROI block, scarcity bar, guarantee line, 4 pricing cards, pricing dots, retainer add-on bar.

- [ ] **Step 2: Remove all old pricing CSS**

Delete from `/* PRICING */` through `.pricing-addon-sub` — the entire pricing CSS block. This is everything from:

```css
/* PRICING */
#pricing { background: var(--bg2); border-bottom: 1px solid var(--border); }
```

Through:

```css
.pricing-addon-sub { font-size: 0.8rem; color: var(--text-light); margin-left: auto; }
```

Keep the `/* ── MOBILE ── */` line that follows.

- [ ] **Step 3: Remove pricing mobile CSS**

Inside `@media (max-width: 900px)`, remove these blocks:

```css
/* ROI */
.roi-block { padding: 1.4rem 1.2rem; }
.roi-examples { grid-template-columns: 1fr; gap: 0.75rem; }
.roi-statement { font-size: 0.95rem; }

/* Scarcity */
.scarcity-bar { flex-wrap: wrap; font-size: 0.8rem; }

/* Pricing — horizontal swipe carousel */
.pricing-grid {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  gap: 0.8rem;
  padding: 1.4rem 7% 0.5rem;
  margin: 0 -5%;
}
.pricing-grid::-webkit-scrollbar { display: none; }
.pricing-card {
  flex-shrink: 0;
  width: calc(86% - 0.8rem);
  scroll-snap-align: center;
}
.pricing-featured { transform: none; }
.pricing-featured:hover { transform: none; }
.pricing-price { font-size: 2.2rem; }
.feat-val { display: none; }
.pricing-features li { justify-content: flex-start; }
.pricing-addon { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
.pricing-addon-sub { margin-left: 0; }

/* Dots */
.pricing-dots {
  display: flex; justify-content: center; gap: 6px;
  margin-top: 1.2rem;
}
.pdot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--border); transition: background 0.2s, transform 0.2s;
}
.pdot.active { background: var(--accent); transform: scale(1.3); }
```

Inside `@media (max-width: 600px)`, remove these lines:

```css
/* Sync pricing-grid margin with 4% section padding */
.pricing-grid { margin: 0 -4%; }
```

And:

```css
.pricing-card { padding: 1.6rem 1.4rem; }
.pricing-price { font-size: 2rem; }
.scarcity-bar { padding: 0.75rem 1rem; }
```

And:

```css
.pricing-btn { min-height: 44px; }
```

Inside `@media (max-width: 480px)`, remove:

```css
.pricing-price { font-size: 1.8rem; }
.pricing-card { padding: 1.4rem 1.2rem; }
```

- [ ] **Step 4: Remove pricing-related JS**

Remove the pricing carousel IIFE (the entire block starting with `// Pricing carousel — mobile only`):

```javascript
// Pricing carousel — mobile only
(function() {
  const grid  = document.querySelector('.pricing-grid');
  const dots  = document.querySelectorAll('#pricingDots .pdot');
  ...entire function...
  init();
})();
```

Remove the package pre-fill handler block:

```javascript
// Package pre-fill — pricing buttons → contact form
document.querySelectorAll('.pricing-btn[data-pkg]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    ...entire handler...
  });
});

function clearPkg() {
  document.getElementById('pkgBanner').style.display = 'none';
  document.querySelector('[name="service"]').value = '';
}
```

Remove old pricing GSAP animations:

```javascript
// ROI block
gsap.from('.roi-block', {
  scrollTrigger: { trigger: '.roi-block', start: 'top 82%', once: true },
  opacity: 0, y: 20, duration: 0.55, ease: 'power2.out'
});

// Scarcity bar
gsap.from('.scarcity-bar', {
  scrollTrigger: { trigger: '.scarcity-bar', start: 'top 88%', once: true },
  opacity: 0, y: 15, duration: 0.5, ease: 'power2.out'
});

// Pricing cards — stagger in
// Skip pricing card animation on mobile — y offset breaks carousel scroll position
if (window.innerWidth > 900) {
  gsap.from('.pricing-card', {
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 78%', once: true },
    opacity: 0, y: 40, duration: 0.6, stagger: 0.12, ease: 'power2.out'
  });
}
```

- [ ] **Step 5: Verify in browser**

Open `index.html`. Confirm:
- The #pricing section is now an empty placeholder
- No console errors (no references to missing elements)
- Page loads cleanly, all other sections still work
- Scrolling to "Get a Quote" in nav reaches the empty section

- [ ] **Step 6: Commit**

```bash
git add "FJDMedia Website/index.html"
git commit -m "feat: strip old pricing section — ready for calculator"
```

---

### Task 3: Add calculator CSS

Add all new styles for the calculator UI — combo tabs, service grid, status bar, lead form, scarcity, risk reversal, dependency toast.

**Files:**
- Modify: `FJDMedia Website/index.html`

- [ ] **Step 1: Add calculator CSS in the `<style>` block**

Insert these styles where the old `/* PRICING */` block was removed (before `/* ── MOBILE ── */`):

```css
/* CALCULATOR */
#pricing { background: var(--bg2); border-bottom: 1px solid var(--border); }

.calc-speed {
  text-align: center; font-size: 0.85rem; color: var(--text-light);
  margin-bottom: 1.5rem; font-weight: 500;
}

.calc-scarcity {
  display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  background: rgba(201,168,76,0.08);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 8px;
  padding: 0.75rem 1.2rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--heading);
  line-height: 1.5;
}
.calc-scarcity svg { color: var(--accent); flex-shrink: 0; width: 16px; height: 16px; }
.calc-scarcity strong { color: var(--accent); }

.combo-tabs {
  display: flex; gap: 4px;
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 10px; padding: 4px;
  margin-bottom: 1.5rem;
}
.combo-tab {
  flex: 1; background: transparent; border: none;
  border-radius: 8px; padding: 0.7rem 0.5rem;
  cursor: pointer; transition: all 0.25s ease;
  text-align: center; position: relative;
}
.combo-tab:hover { background: rgba(201,168,76,0.05); }
.combo-tab.active {
  background: rgba(201,168,76,0.1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.combo-tab-name {
  font-size: 0.78rem; font-weight: 700;
  color: var(--text-light); transition: color 0.2s;
}
.combo-tab.active .combo-tab-name { color: var(--accent); }
.combo-tab-sub {
  font-size: 0.62rem; color: var(--text-light); opacity: 0.5;
  margin-top: 2px; letter-spacing: 0.03em; transition: color 0.2s;
}
.combo-tab.active .combo-tab-sub { opacity: 0.8; }
.combo-pop {
  position: absolute; top: -6px; right: 6px;
  font-size: 0.52rem; font-weight: 800; letter-spacing: 0.1em;
  background: var(--accent); color: var(--bg);
  padding: 1px 5px; border-radius: 3px;
  font-family: var(--mono);
}

.svc-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem; margin-bottom: 1.2rem;
}
.svc-card {
  background: var(--bg3); border: 1.5px solid var(--border);
  border-radius: 10px; padding: 1.2rem 1rem;
  cursor: pointer; transition: all 0.2s ease;
  position: relative; text-align: center;
}
.svc-card:hover { border-color: rgba(201,168,76,0.3); }
.svc-card.selected {
  border-color: var(--accent);
  background: rgba(201,168,76,0.04);
}
.svc-card.selected .svc-chk { opacity: 1; transform: scale(1); }
.svc-chk {
  position: absolute; top: 8px; right: 8px;
  width: 20px; height: 20px;
  background: var(--accent); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--bg); font-size: 0.65rem; font-weight: 800;
  opacity: 0; transform: scale(0.5); transition: all 0.15s ease;
}
.svc-ico {
  width: 36px; height: 36px; margin: 0 auto 0.5rem;
  background: rgba(201,168,76,0.08); border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
}
.svc-card .svc-n {
  font-size: 0.85rem; font-weight: 700; color: var(--heading); margin-bottom: 0.2rem;
}
.svc-card .svc-d {
  font-size: 0.75rem; color: var(--text-light); line-height: 1.5;
}
.svc-card.talk {
  border-style: dashed; border-color: var(--border);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: default; opacity: 0.5;
}
.svc-card.talk:hover { border-color: rgba(201,168,76,0.3); opacity: 0.7; }
.svc-card.talk .svc-n { color: var(--text-light); font-size: 0.8rem; }

.status-bar {
  background: rgba(201,168,76,0.04);
  border: 1px solid rgba(201,168,76,0.15);
  border-radius: 8px; padding: 0.85rem 1.2rem;
  margin-bottom: 1.2rem;
  display: flex; align-items: center; gap: 0.85rem;
  min-height: 44px;
}
.status-match {
  font-size: 0.88rem; font-weight: 700; color: var(--accent);
  white-space: nowrap;
}
.status-sep { width: 1px; height: 16px; background: rgba(201,168,76,0.2); }
.status-msg { font-size: 0.78rem; color: var(--text-light); line-height: 1.4; }
.status-msg strong { color: var(--accent); font-weight: 600; }
.status-empty { font-size: 0.82rem; color: var(--text-light); text-align: center; width: 100%; }

.calc-form {
  max-width: 480px; margin: 0 auto;
  display: none; flex-direction: column; gap: 0.75rem;
  padding-top: 1rem;
}
.calc-form.visible { display: flex; }
.calc-form input {
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 8px; padding: 0.85rem 1rem;
  color: var(--heading); font-size: 0.88rem;
  font-family: inherit; outline: none; transition: border-color 0.2s;
}
.calc-form input:focus { border-color: var(--accent); }
.calc-form input::placeholder { color: var(--text-light); opacity: 0.5; }
.calc-submit {
  background: var(--accent); color: var(--bg);
  border: none; border-radius: 8px;
  padding: 0.85rem 1.5rem; font-size: 0.9rem;
  font-weight: 700; cursor: pointer;
  transition: opacity 0.2s; font-family: inherit;
}
.calc-submit:hover { opacity: 0.9; }
.calc-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.calc-confirm {
  text-align: center; font-size: 0.9rem;
  color: var(--accent); font-weight: 600;
  padding: 1rem 0;
}

.calc-risk {
  text-align: center; font-size: 0.95rem;
  color: var(--accent); font-weight: 600;
  margin-top: 2rem; line-height: 1.6;
}

.dep-toast {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  background: var(--accent); color: var(--bg);
  padding: 0.6rem 1.2rem; border-radius: 8px;
  font-size: 0.8rem; font-weight: 600;
  opacity: 0; transition: opacity 0.3s;
  pointer-events: none; z-index: 100;
}
.dep-toast.show { opacity: 1; }
```

- [ ] **Step 2: Add calculator mobile CSS**

Inside `@media (max-width: 900px)`, add:

```css
/* Calculator */
.combo-tabs { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.combo-tabs::-webkit-scrollbar { display: none; }
.combo-tab { flex-shrink: 0; min-width: 100px; }
.svc-grid { grid-template-columns: 1fr; }
.status-bar { flex-direction: column; text-align: center; }
.status-sep { display: none; }
```

Inside `@media (max-width: 600px)`, add:

```css
/* Calculator touch targets */
.calc-form input { font-size: 16px; }
.calc-submit { min-height: 44px; }
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. The #pricing section is still empty content, but confirm:
- No CSS errors in console
- No layout shifts in other sections
- Mobile responsive works on other sections

- [ ] **Step 4: Commit**

```bash
git add "FJDMedia Website/index.html"
git commit -m "feat: add calculator CSS — desktop and mobile styles"
```

---

### Task 4: Add calculator HTML

Build the full calculator section: heading, scarcity bar, combo tabs, service grid, status bar, lead form, risk reversal, and dependency toast.

**Files:**
- Modify: `FJDMedia Website/index.html`

- [ ] **Step 1: Replace the #pricing section placeholder with the full calculator HTML**

Replace the entire `<section id="pricing">...</section>` placeholder from Task 2 with:

```html
  <section id="pricing">
    <div class="section-inner">
      <p class="section-label">What Do You Need?</p>
      <h2 class="section-title">Build your perfect package.</h2>
      <p class="calc-speed">Most sites launch in under a week.</p>
      <div class="divider"></div>

      <div class="calc-scarcity">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span><strong>4 spots left this month</strong> — I take on 5 builds max so every client gets my full attention.</span>
      </div>

      <!-- Combo tabs -->
      <div class="combo-tabs" id="comboTabs">
        <button class="combo-tab" data-combo="online" onclick="selectCombo(this)" type="button">
          <div class="combo-tab-name">Get Online</div>
          <div class="combo-tab-sub">Just the site</div>
        </button>
        <button class="combo-tab" data-combo="found" onclick="selectCombo(this)" type="button">
          <div class="combo-tab-name">Get Found</div>
          <div class="combo-tab-sub">Site + SEO + Domain</div>
        </button>
        <button class="combo-tab" data-combo="customers" onclick="selectCombo(this)" type="button">
          <span class="combo-pop">POPULAR</span>
          <div class="combo-tab-name">Get Customers</div>
          <div class="combo-tab-sub">Full lead capture</div>
        </button>
        <button class="combo-tab" data-combo="market" onclick="selectCombo(this)" type="button">
          <div class="combo-tab-name">Own the Market</div>
          <div class="combo-tab-sub">Everything, managed</div>
        </button>
      </div>

      <!-- Service grid -->
      <div class="svc-grid" id="svcGrid">
        <div class="svc-card" data-svc="website" onclick="toggleSvc(this)">
          <div class="svc-chk">&#10003;</div>
          <div class="svc-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div class="svc-n">Custom Website</div>
          <div class="svc-d">Your brand, hand-coded, mobile-ready. Live in days.</div>
        </div>
        <div class="svc-card" data-svc="ordering" onclick="toggleSvc(this)">
          <div class="svc-chk">&#10003;</div>
          <div class="svc-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
          </div>
          <div class="svc-n">Online Ordering / Booking</div>
          <div class="svc-d">Smart forms, live pricing, instant notifications.</div>
        </div>
        <div class="svc-card" data-svc="seo" onclick="toggleSvc(this)">
          <div class="svc-chk">&#10003;</div>
          <div class="svc-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div class="svc-n">SEO &amp; Google Setup</div>
          <div class="svc-d">Show up when locals search for what you do.</div>
        </div>
        <div class="svc-card" data-svc="domain" onclick="toggleSvc(this)">
          <div class="svc-chk">&#10003;</div>
          <div class="svc-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div class="svc-n">Domain Setup</div>
          <div class="svc-d">Your own .ca or .com — fully connected.</div>
        </div>
        <div class="svc-card" data-svc="retainer" onclick="toggleSvc(this)">
          <div class="svc-chk">&#10003;</div>
          <div class="svc-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09"/></svg>
          </div>
          <div class="svc-n">Monthly Retainer</div>
          <div class="svc-d">Updates, monitoring, and growth — handled for you.</div>
        </div>
        <div class="svc-card talk">
          <div class="svc-ico" style="background:rgba(201,168,76,0.03);color:var(--text-light);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="svc-n">Need something else?</div>
          <div class="svc-d">Let's talk about what you need.</div>
        </div>
      </div>

      <!-- Status bar -->
      <div class="status-bar" id="statusBar">
        <span class="status-match" id="statusMatch"></span>
        <span class="status-sep"></span>
        <span class="status-msg" id="statusMsg"><span class="status-empty">Pick what you need — or choose a combo above.</span></span>
      </div>

      <!-- Lead capture form -->
      <form class="calc-form" id="calcForm">
        <input type="text" name="calc_name" placeholder="Your name" required />
        <input type="text" name="calc_contact" placeholder="Instagram handle or email" required />
        <input type="hidden" name="calc_services" id="calcServices" />
        <input type="hidden" name="calc_combo" id="calcCombo" />
        <button type="submit" class="calc-submit" id="calcSubmitBtn">Get My Custom Quote</button>
        <p class="calc-confirm" id="calcConfirm" style="display:none;">Got it! I'll reach out within 12 hours with your custom quote.</p>
      </form>

      <!-- Risk reversal -->
      <p class="calc-risk">Don't love it — you owe nothing. I build first. You decide after.</p>
    </div>
  </section>

  <!-- Dependency toast -->
  <div class="dep-toast" id="depToast"></div>
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. Confirm:
- Calculator section is visible with all elements
- Combo tabs display in a row
- Service cards in a 3-column grid
- Status bar shows default message
- Lead form is hidden (no services selected yet)
- Risk reversal text is visible at the bottom
- Scarcity bar is noticeable with gold accent
- No console errors

- [ ] **Step 3: Commit**

```bash
git add "FJDMedia Website/index.html"
git commit -m "feat: add calculator HTML — combo tabs, service grid, form, scarcity, risk reversal"
```

---

### Task 5: Add calculator JavaScript

Add all interactive logic: combo tab selection, service card toggling, dependency enforcement, two-way sync, status bar updates, form visibility, lead form submission.

**Files:**
- Modify: `FJDMedia Website/index.html`

- [ ] **Step 1: Add calculator JS**

Insert this script block in the `<script>` section, after the existing GSAP animations and before the GAS_URL declaration:

```javascript
// ── CALCULATOR ──

const comboMap = {
  online:    ['website'],
  found:     ['website', 'seo', 'domain'],
  customers: ['website', 'ordering', 'seo', 'domain'],
  market:    ['website', 'ordering', 'seo', 'domain', 'retainer'],
};

const comboNames = {
  online: 'Get Online',
  found: 'Get Found',
  customers: 'Get Customers',
  market: 'Own the Market',
};

const upsellMessages = {
  online:    'Add <strong>SEO &amp; Domain</strong> to complete <strong>Get Found</strong> — and save even more.',
  found:     'Add <strong>Ordering</strong> to complete <strong>Get Customers</strong> — and save even more.',
  customers: 'Add <strong>Retainer</strong> to complete <strong>Own the Market</strong> — and save even more.',
  market:    'The complete package — everything your business needs online.',
};

const svcDisplayNames = {
  website: 'Website', ordering: 'Ordering', seo: 'SEO',
  domain: 'Domain', retainer: 'Retainer',
};

function getSelectedSvcs() {
  return Array.from(document.querySelectorAll('.svc-card.selected[data-svc]'))
    .map(el => el.dataset.svc).sort();
}

function arraysEqual(a, b) {
  return a.length === b.length && [...a].sort().every((v, i) => [...b].sort()[i] === v);
}

function findExactCombo(selected) {
  for (const [key, svcs] of Object.entries(comboMap)) {
    if (arraysEqual(selected, svcs)) return key;
  }
  return null;
}

function findClosestCombo(selected) {
  const sorted = Object.entries(comboMap).sort((a, b) => a[1].length - b[1].length);
  for (const [key, svcs] of sorted) {
    if (selected.every(s => svcs.includes(s)) && svcs.length > selected.length) {
      const missing = svcs.filter(s => !selected.includes(s));
      return { key, missing };
    }
  }
  return null;
}

function updateCalcUI() {
  const selected = getSelectedSvcs();
  const exactMatch = findExactCombo(selected);

  // Update combo tabs
  document.querySelectorAll('.combo-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.combo === exactMatch);
  });

  // Update status bar
  const matchEl = document.getElementById('statusMatch');
  const msgEl = document.getElementById('statusMsg');
  const sepEl = document.querySelector('.status-sep');

  if (selected.length === 0) {
    matchEl.textContent = '';
    sepEl.style.display = 'none';
    msgEl.innerHTML = '<span class="status-empty">Pick what you need — or choose a combo above.</span>';
  } else if (exactMatch) {
    matchEl.textContent = comboNames[exactMatch];
    sepEl.style.display = 'block';
    msgEl.innerHTML = upsellMessages[exactMatch];
  } else {
    matchEl.textContent = 'Custom Build';
    sepEl.style.display = 'block';
    const closest = findClosestCombo(selected);
    if (closest) {
      const names = closest.missing.map(s => svcDisplayNames[s]).join(' + ');
      msgEl.innerHTML = 'Add <strong>' + names + '</strong> to complete <strong>' + comboNames[closest.key] + '</strong> — and save even more.';
    } else {
      msgEl.innerHTML = "We'll put together a custom quote for this combination.";
    }
  }

  // Update hidden form fields
  document.getElementById('calcServices').value = selected.join(', ');
  document.getElementById('calcCombo').value = exactMatch ? comboNames[exactMatch] : 'Custom Build';

  // Show/hide lead form
  const calcForm = document.getElementById('calcForm');
  if (selected.length > 0) {
    calcForm.classList.add('visible');
  } else {
    calcForm.classList.remove('visible');
  }
}

function selectCombo(el) {
  const combo = el.dataset.combo;
  const svcs = comboMap[combo];
  document.querySelectorAll('.svc-card[data-svc]').forEach(card => {
    card.classList.toggle('selected', svcs.includes(card.dataset.svc));
  });
  updateCalcUI();
}

function showDepToast(message) {
  const toast = document.getElementById('depToast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function toggleSvc(el) {
  const svc = el.dataset.svc;
  if (!svc) return;

  // Prevent deselecting website when other services depend on it
  if (svc === 'website' && el.classList.contains('selected')) {
    const others = document.querySelectorAll('.svc-card.selected:not([data-svc="website"])');
    if (others.length > 0) {
      showDepToast('Everything starts with your website — it\u2019s the foundation.');
      return;
    }
  }

  el.classList.toggle('selected');

  // Auto-select website when any dependent service is toggled on
  if (el.classList.contains('selected') && svc !== 'website') {
    const ws = document.querySelector('[data-svc="website"]');
    if (!ws.classList.contains('selected')) {
      ws.classList.add('selected');
      showDepToast('Website added — it\u2019s the foundation for ' + el.querySelector('.svc-n').textContent);
    }
  }

  updateCalcUI();
}

// Calculator form submission
document.getElementById('calcForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('calcSubmitBtn');
  const confirmMsg = document.getElementById('calcConfirm');
  const nameVal = this.querySelector('[name="calc_name"]').value.trim();
  const contactVal = this.querySelector('[name="calc_contact"]').value.trim();
  const servicesVal = document.getElementById('calcServices').value;
  const comboVal = document.getElementById('calcCombo').value;

  submitBtn.textContent = 'Sending\u2026';
  submitBtn.disabled = true;

  const payload = {
    name: nameVal,
    contact: contactVal,
    services: servicesVal,
    combo: comboVal,
    timestamp: new Date().toISOString(),
    source: 'calculator',
  };

  // POST to GAS endpoint
  const CALC_GAS_URL = 'REPLACE_WITH_GAS_URL';

  fetch(CALC_GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  })
  .then(() => {
    submitBtn.style.display = 'none';
    this.querySelector('[name="calc_name"]').style.display = 'none';
    this.querySelector('[name="calc_contact"]').style.display = 'none';
    confirmMsg.style.display = 'block';
  })
  .catch(() => {
    submitBtn.textContent = 'Get My Custom Quote';
    submitBtn.disabled = false;
    alert('Something went wrong — please DM me on Instagram instead.');
  });
});

// Initialize calculator
updateCalcUI();
```

- [ ] **Step 2: Add GSAP animations for calculator elements**

Insert these after the existing `gsap.from('.founder-text, .founder-highlight', ...)` block:

```javascript
// Calculator — scarcity bar
gsap.from('.calc-scarcity', {
  scrollTrigger: { trigger: '.calc-scarcity', start: 'top 88%', once: true },
  opacity: 0, y: 15, duration: 0.5, ease: 'power2.out'
});

// Calculator — combo tabs
gsap.from('.combo-tabs', {
  scrollTrigger: { trigger: '.combo-tabs', start: 'top 85%', once: true },
  opacity: 0, y: 20, duration: 0.5, ease: 'power2.out'
});

// Calculator — service cards stagger
gsap.from('.svc-card', {
  scrollTrigger: { trigger: '.svc-grid', start: 'top 80%', once: true },
  opacity: 0, y: 30, duration: 0.5, stagger: 0.07, ease: 'power2.out'
});

// Calculator — status bar
gsap.from('.status-bar', {
  scrollTrigger: { trigger: '.status-bar', start: 'top 90%', once: true },
  opacity: 0, y: 15, duration: 0.4, ease: 'power2.out'
});

// Calculator — risk reversal
gsap.from('.calc-risk', {
  scrollTrigger: { trigger: '.calc-risk', start: 'top 90%', once: true },
  opacity: 0, y: 15, duration: 0.5, ease: 'power2.out'
});
```

- [ ] **Step 3: Verify interactive behavior in browser**

Open `index.html`. Test each interaction:

1. Click "Get Customers" combo tab → Website, Ordering, SEO, Domain cards should all highlight with gold borders + checkmarks. Tab should be active. Status bar should show "Get Customers" + upsell nudge.
2. Click the "Get Customers" tab again → Should deselect (all cards deselect? No — clicking an already-active combo tab should keep it selected. Only clicking a different tab or manually toggling cards changes state.)
3. Toggle "SEO & Google Setup" card on → Website should auto-select with a toast. Status bar should say "Custom Build" and suggest "Add Domain to complete Get Found".
4. Try to deselect Website while SEO is selected → Toast appears: "Everything starts with your website — it's the foundation." Card stays selected.
5. Select all 5 services manually → "Own the Market" tab should highlight, status bar shows it matched.
6. Deselect Retainer → Tab switches to "Get Customers", status bar shows upsell to add Retainer.
7. Deselect everything → Form hides, status bar shows default "Pick what you need" message.
8. Select any service → Form slides in with Name + Contact fields.
9. Fill in form and submit → Shows "Sending..." then confirmation message (will fail fetch since GAS URL is placeholder — that's expected, confirm the error alert appears).
10. No console errors throughout.

- [ ] **Step 4: Commit**

```bash
git add "FJDMedia Website/index.html"
git commit -m "feat: add calculator JS — combo sync, dependencies, lead form, GSAP animations"
```

---

### Task 6: Update contact form dropdown

The contact form's service dropdown still lists old packages with prices. Update it to match the new system.

**Files:**
- Modify: `FJDMedia Website/index.html`

- [ ] **Step 1: Update the service `<select>` options in the contact form**

Replace:

```html
<select name="service">
  <option value="" disabled selected>What are you looking for?</option>
  <option>Get Online — $300</option>
  <option>Get Found — $600</option>
  <option>Get Customers — $1,000</option>
  <option>Own the Market — $1,600</option>
  <option>Monthly Maintenance</option>
  <option>Not Sure Yet</option>
</select>
```

With:

```html
<select name="service">
  <option value="" disabled selected>What are you looking for?</option>
  <option>Custom Website</option>
  <option>Online Ordering / Booking</option>
  <option>SEO &amp; Google Setup</option>
  <option>Domain Setup</option>
  <option>Monthly Retainer</option>
  <option>Full Package</option>
  <option>Not Sure Yet — Let's Talk</option>
</select>
```

- [ ] **Step 2: Remove the pkgBanner from the contact form**

The `pkgBanner` div was used by the old pricing cards' "Book a Call" buttons. Those buttons no longer exist. Remove:

```html
<div id="pkgBanner" style="display:none; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); border-radius: 10px; padding: 12px 16px; margin-bottom: 4px; font-size: 13px; color: var(--accent); align-items: center; justify-content: space-between; gap: 10px;">
  <span>&#10003; Package selected: <strong id="pkgBannerName"></strong></span>
  <button type="button" onclick="clearPkg()" style="background:none;border:none;color:var(--text-mid);cursor:pointer;font-size:16px;line-height:1;padding:0;">&times;</button>
</div>
```

Also remove the `prefillAudit` function that references the old package names, if the Free Audit section still calls it. Check if `prefillAudit()` is still called — if so, update it to select "Not Sure Yet — Let's Talk" instead of looking for "not sure".

- [ ] **Step 3: Update the `prefillAudit()` function**

Change:

```javascript
function prefillAudit() {
  const select = document.querySelector('[name="service"]');
  if (select) {
    Array.from(select.options).forEach(opt => {
      if (opt.value.toLowerCase().includes('not sure')) {
        select.value = opt.value;
      }
    });
  }
```

This should still work since the new "Not Sure Yet — Let's Talk" option contains "not sure". Verify by clicking the Free Audit button and confirming the dropdown changes.

- [ ] **Step 4: Verify in browser**

Open `index.html`. Confirm:
- Contact form dropdown shows new service names with no prices
- No `pkgBanner` appears
- Free Audit button still pre-fills the dropdown correctly
- Contact form submits normally

- [ ] **Step 5: Commit**

```bash
git add "FJDMedia Website/index.html"
git commit -m "feat: update contact form — remove old package prices, add service-based options"
```

---

### Task 7: Final QA pass

Full browser test of the completed calculator implementation.

**Files:**
- No file changes — testing only

- [ ] **Step 1: Desktop QA**

Open `index.html` in browser at full width. Check:
- [ ] Nav has: Work | Process | Why Us | Get a Quote | Book a Call (no "Services")
- [ ] Scrolling to "Get a Quote" lands on the calculator section
- [ ] Section heading: "What Do You Need?" / "Build your perfect package."
- [ ] Speed callout visible: "Most sites launch in under a week."
- [ ] Scarcity bar is noticeable (not muted): "4 spots left this month..."
- [ ] Combo tabs display in one row, "POPULAR" badge on Get Customers
- [ ] Service cards in 3-column grid with icons
- [ ] "Need something else?" card has dashed border
- [ ] Status bar shows default message when nothing selected
- [ ] Two-way sync works (combo → services AND services → combo)
- [ ] Dependency toast appears when trying to deselect website
- [ ] Lead form slides in when first service selected
- [ ] Lead form has 2 fields: name + contact
- [ ] Risk reversal in gold at bottom
- [ ] GSAP scroll animations fire on all calculator elements
- [ ] No console errors
- [ ] Contact form dropdown has new options (no prices)

- [ ] **Step 2: Mobile QA (resize to ~375px)**

- [ ] Combo tabs scroll horizontally
- [ ] Service cards stack single column
- [ ] Status bar centers text
- [ ] Form inputs are full-width
- [ ] Touch targets are minimum 44px
- [ ] No horizontal overflow on the page
- [ ] No iOS zoom on form focus (inputs are 16px+)

- [ ] **Step 3: Commit final if any QA fixes were made**

```bash
git add "FJDMedia Website/index.html"
git commit -m "fix: QA fixes for calculator implementation"
```

Only commit if changes were made during QA. Skip if everything passed clean.

---

## GAS Backend (separate deployment)

The GAS script for calculator submissions needs to be created and deployed separately. This is NOT part of the index.html implementation — James will deploy it to Google Apps Script and replace the `REPLACE_WITH_GAS_URL` placeholder in the calculator JS.

**GAS Script (`Code.gs`):**

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.openById('SHEET_ID').getSheetByName('Calculator Submissions');
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.contact,
    data.services,
    data.combo,
  ]);

  // Email notification
  MailApp.sendEmail({
    to: 'james@fjmedia.ca',
    subject: 'New Calculator Submission — ' + data.name,
    body: 'Name: ' + data.name + '\n'
        + 'Contact: ' + data.contact + '\n'
        + 'Services: ' + data.services + '\n'
        + 'Combo: ' + data.combo + '\n'
        + 'Time: ' + data.timestamp,
  });

  return ContentService.createTextOutput('OK');
}
```

**Setup steps:**
1. Create Google Sheet "FJMedia — Calculator Submissions" with columns: Timestamp | Name | Contact | Services | Combo
2. Open Apps Script editor from the sheet
3. Paste the `doPost` function above
4. Replace `SHEET_ID` with the actual sheet ID
5. Deploy as Web App → Execute as: Me → Who has access: Anyone
6. Copy the deployment URL
7. Replace `REPLACE_WITH_GAS_URL` in `index.html` with the deployment URL
8. Test a submission end-to-end
