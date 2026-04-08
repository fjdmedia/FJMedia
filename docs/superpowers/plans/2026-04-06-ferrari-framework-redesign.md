# Ferrari Framework — FJMedia Agency Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all copy, meta tags, pricing calculator, and contact form on the FJMedia agency site to reflect the Ferrari Framework — 48-hour delivery, hand-coded differentiator, no prices shown, simplified forms.

**Architecture:** Single-file edit. All changes are in `index.html` (HTML content + inline `<script>` + inline `<style>`). No new files created. Each task targets a specific section of the page. The founder section is deleted entirely.

**Tech Stack:** HTML, CSS (inline `<style>`), vanilla JavaScript (inline `<script>`), GSAP/ScrollTrigger, Web3Forms, Google Apps Script

**Spec:** `docs/superpowers/specs/2026-04-06-ferrari-framework-redesign.md`

---

## File Map

All changes target a single file:

- **Modify:** `index.html` — the entire agency site (HTML + CSS + JS, ~1815 lines)
  - Lines 6–36: Meta tags + schema
  - Lines 909–960: Hero section
  - Lines 962–993: Offer section
  - Lines 995–1029: Process section
  - Lines 1160–1212: Why Us cards
  - Lines 1226–1238: Founder section (DELETE)
  - Lines 1260–1354: Pricing/calculator HTML
  - Lines 1360–1408: Contact form HTML
  - Lines 1423–1470: GSAP animations (remove founder ref)
  - Lines 1483–1634: Calculator JavaScript
  - Lines 1646–1658: prefillAudit function (update for removed dropdown)
  - Lines 1770–1806: Contact form submit handler (update for new fields)
  - Lines 1811–1813: Mobile CTA bar

---

### Task 1: Meta / SEO Tags

**Files:**
- Modify: `index.html:6-36`

- [ ] **Step 1: Update `<title>` tag**

Replace line 6:
```html
<title>FJMedia — Web Design for Local Businesses in Winnipeg</title>
```
With:
```html
<title>Hand-Coded Web Design Winnipeg | Custom Sites in 48 Hours | FJMedia</title>
```

- [ ] **Step 2: Update meta description**

Replace line 7:
```html
<meta name="description" content="FJMedia builds websites for local businesses in Winnipeg. Built in 5 days — pay only if you love it. Full digital package live in 14 days." />
```
With:
```html
<meta name="description" content="100% hand-coded websites for Winnipeg businesses — no Wix, no Shopify, no templates. Designed in 48 hours, $0 upfront. Free to see it, pay if you're satisfied." />
```

- [ ] **Step 3: Update OG tags**

Replace lines 8-9:
```html
<meta property="og:title" content="FJMedia — Web Design for Local Businesses in Winnipeg" />
<meta property="og:description" content="We build your website for free. Built in 5 days — pay only if you love it. Serving Winnipeg, MB." />
```
With:
```html
<meta property="og:title" content="Hand-Coded Web Design Winnipeg | Custom Sites in 48 Hours | FJMedia" />
<meta property="og:description" content="No Wix. No Shopify. No templates. Every site is hand-coded and custom-built in 48 hours. Free to see it, pay if you're satisfied." />
```

- [ ] **Step 4: Update Twitter tags**

Replace lines 14-15:
```html
<meta name="twitter:title" content="FJMedia — Web Design for Local Businesses in Winnipeg" />
<meta name="twitter:description" content="We build your website for free. Built in 5 days — pay only if you love it. Serving Winnipeg, MB." />
```
With:
```html
<meta name="twitter:title" content="Hand-Coded Web Design Winnipeg | Custom Sites in 48 Hours | FJMedia" />
<meta name="twitter:description" content="No Wix. No Shopify. No templates. Every site is hand-coded and custom-built in 48 hours. Free to see it, pay if you're satisfied." />
```

- [ ] **Step 5: Update schema JSON-LD**

Replace lines 23 and 30:

Schema description (line 23):
```json
"description": "FJMedia builds websites for local businesses in Winnipeg. Built in 5 days — pay only if you love it.",
```
With:
```json
"description": "FJMedia hand-codes custom websites for Winnipeg businesses in 48 hours. No page builders, no templates — $0 upfront, pay only if you're satisfied.",
```

Schema serviceType (line 30):
```json
"serviceType": ["Web Design", "SEO", "Google Business Profile Setup", "Digital Marketing"],
```
With:
```json
"serviceType": ["Hand-Coded Websites", "Custom Web Development", "Web Design", "SEO", "Google Business Profile Setup", "Digital Marketing"],
```

- [ ] **Step 6: Verify in browser**

Open `index.html` in browser. Right-click → View Page Source. Confirm:
- Title shows "Hand-Coded Web Design Winnipeg | Custom Sites in 48 Hours | FJMedia"
- Meta description mentions 48 hours and hand-coded
- OG/Twitter tags updated
- Schema has new description and serviceType entries

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "seo: update meta tags for Ferrari Framework — 48hr delivery, hand-coded keywords"
```

---

### Task 2: Hero Section

**Files:**
- Modify: `index.html:909-960`

- [ ] **Step 1: Update hero label, H1, and subline**

Replace lines 913-915:
```html
<span class="hero-label">Web Design &amp; Digital Systems</span>
<h1 class="hero-title">We build your website<br /><em>for free.</em></h1>
<p class="hero-sub">Your website, built in 5 days. Pay only if you like it.</p>
```
With:
```html
<span class="hero-label">Hand-Coded Web Design · Winnipeg</span>
<h1 class="hero-title">We'll cook you up a website<br /><em>in 48 hours.</em></h1>
<p class="hero-sub">Free to see it. Pay if you're satisfied.</p>
```

- [ ] **Step 2: Add SEO line below hero buttons**

After the closing `</div>` of `.hero-btns` (after line 919), add:
```html
<p class="hero-seo" style="font-size:0.78rem;color:rgba(237,234,229,0.4);margin-top:1.2rem;max-width:440px;line-height:1.5;">Custom web design for Winnipeg businesses — no Wix, no Shopify, no templates. 100% hand-coded, every time.</p>
```

- [ ] **Step 3: Update stat cards**

Replace the 4 stat cards (lines 922-957) with:
```html
<div class="hero-stat-card">
  <div class="stat-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  </div>
  <div>
    <div class="stat-text-num">$0 Upfront</div>
    <div class="stat-text-label">Pay only if you're satisfied</div>
  </div>
</div>
<div class="hero-stat-card">
  <div class="stat-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  </div>
  <div>
    <div class="stat-text-num">48 Hours</div>
    <div class="stat-text-label">From call to custom design</div>
  </div>
</div>
<div class="hero-stat-card">
  <div class="stat-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  </div>
  <div>
    <div class="stat-text-num">No Builders</div>
    <div class="stat-text-label">No Wix. No Shopify. Hand-coded.</div>
  </div>
</div>
<div class="hero-stat-card">
  <div class="stat-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  </div>
  <div>
    <div class="stat-text-num">Full Backend</div>
    <div class="stat-text-label">Forms, CRM &amp; automation — when you need it</div>
  </div>
</div>
```

- [ ] **Step 4: Verify in browser**

Open in browser. Confirm:
- Hero label reads "Hand-Coded Web Design · Winnipeg"
- H1 reads "We'll cook you up a website in 48 hours."
- Sub reads "Free to see it. Pay if you're satisfied."
- SEO line appears in small text below buttons
- 4 stat cards show: $0 Upfront / 48 Hours / No Builders / Full Backend

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "hero: Ferrari Framework headline, 48hr delivery, hand-coded SEO line"
```

---

### Task 3: Offer Section

**Files:**
- Modify: `index.html:962-993`

- [ ] **Step 1: Update offer headline and subline**

Replace lines 966-967:
```html
<h2 class="offer-headline">Your website is already built.<br><em>You just haven't seen it yet.</em></h2>
<p class="offer-sub">We design and build your entire site before you spend a dollar. Show up to the call, and we'll walk you through it live.</p>
```
With:
```html
<h2 class="offer-headline">Your website is already done.<br><em>You just haven't seen it yet.</em></h2>
<p class="offer-sub">One call. 48 hours. You get a fully designed website — hand-coded from scratch, not dragged and dropped from some template. Don't like it? You don't pay. Simple.</p>
```

- [ ] **Step 2: Update "What you get free" box items**

Replace lines 970-974:
```html
<p style="font-size:0.95rem;line-height:2;color:var(--text);">
  <span style="color:var(--accent);">✓</span> Full custom design — your brand, your photos<br>
  <span style="color:var(--accent);">✓</span> Every page built and mobile-ready<br>
  <span style="color:var(--accent);">✓</span> Live preview link you can share<br>
  <span style="color:var(--accent);">✓</span> No contracts. No deposits. Walk away anytime.
</p>
```
With:
```html
<p style="font-size:0.95rem;line-height:2;color:var(--text);">
  <span style="color:var(--accent);">✓</span> A custom website — coded by hand, not built on Wix<br>
  <span style="color:var(--accent);">✓</span> Every page designed and mobile-ready<br>
  <span style="color:var(--accent);">✓</span> A live link you can show off before you spend a dime<br>
  <span style="color:var(--accent);">✓</span> No contracts. No deposits. Not feeling it? Walk away.
</p>
```

- [ ] **Step 3: Update pillars**

Replace lines 978-989:
```html
<div class="offer-pillar reveal">
  <div class="offer-pillar-num">5 Days</div>
  <div class="offer-pillar-label">Your site is ready</div>
</div>
<div class="offer-pillar reveal">
  <div class="offer-pillar-num">$0</div>
  <div class="offer-pillar-label">Until you say yes</div>
</div>
<div class="offer-pillar reveal">
  <div class="offer-pillar-num">0 Risk</div>
  <div class="offer-pillar-label">Don't love it? Walk away.</div>
</div>
```
With:
```html
<div class="offer-pillar reveal">
  <div class="offer-pillar-num">48 Hours</div>
  <div class="offer-pillar-label">Your design is ready</div>
</div>
<div class="offer-pillar reveal">
  <div class="offer-pillar-num">$0</div>
  <div class="offer-pillar-label">Until you're satisfied</div>
</div>
<div class="offer-pillar reveal">
  <div class="offer-pillar-num">0 Risk</div>
  <div class="offer-pillar-label">Not satisfied? Walk away.</div>
</div>
```

- [ ] **Step 4: Update offer CTA button**

Replace line 991:
```html
<a href="#contact" class="btn-primary" style="background:var(--accent);color:var(--bg);border-color:var(--accent);">Book a Call — See Your Site in 5 Days</a>
```
With:
```html
<a href="#contact" class="btn-primary" style="background:var(--accent);color:var(--bg);border-color:var(--accent);">Book a Call — See Your Site in 48 Hours</a>
```

- [ ] **Step 5: Verify in browser**

Scroll to offer section. Confirm:
- Headline says "done" not "built"
- Sub copy is the casual hand-coded version
- Box items mention "coded by hand, not built on Wix"
- Pillars: 48 Hours / $0 / 0 Risk
- CTA says "48 Hours"

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "offer: update copy for Ferrari Framework — 48hr, hand-coded messaging"
```

---

### Task 4: Process Section

**Files:**
- Modify: `index.html:995-1029`

- [ ] **Step 1: Replace all 4 process steps**

Replace lines 1002-1027 (the entire `.process-grid` contents):
```html
<div class="process-grid">
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">01 — Intro Call</div>
    <div class="step-title">We see if it's a fit</div>
    <div class="step-desc">A quick call to learn about your business and what you need. No commitment, no sales pitch — just an honest conversation to make sure we're the right team for you.</div>
  </div>
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">02 — We Build First</div>
    <div class="step-title">No payment. No contract.</div>
    <div class="step-desc">If we're a match, we get to work. We design and build your full site before you pay a single dollar. No invoices, no deposits — just results delivered upfront.</div>
  </div>
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">03 — You Decide</div>
    <div class="step-title">Approve it or walk away.</div>
    <div class="step-desc">We share a live preview link. If you love it, we move forward. If it's not right, we refine until it is — or part ways. No charge either way.</div>
  </div>
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">04 — Package &amp; Launch</div>
    <div class="step-title">Choose your plan. Go live.</div>
    <div class="step-desc">Once you're in, we walk you through package options based on exactly what we built together. Then we connect your domain and push your site live.</div>
  </div>
</div>
```
With:
```html
<div class="process-grid">
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">01 — Quick Call</div>
    <div class="step-title">15 minutes. That's it.</div>
    <div class="step-desc">A quick call to learn about your business and what you need. No pitch, no commitment — just seeing if we're the right fit.</div>
  </div>
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">02 — We Design It</div>
    <div class="step-title">48 hours. No payment. No contract.</div>
    <div class="step-desc">We get to work and hand-code your website from scratch. 48 hours later, you're looking at a live preview — before you've spent a cent.</div>
  </div>
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">03 — You Decide</div>
    <div class="step-title">Love it or leave it.</div>
    <div class="step-desc">We send you the link. Share it with whoever you want. If you're satisfied, we move forward. If not — walk away, no charge.</div>
  </div>
  <div class="process-step">
    <div class="step-line"></div>
    <div class="step-num">04 — Go Live</div>
    <div class="step-title">Your site. Your rules.</div>
    <div class="step-desc">Happy with the design? You're live. Need more — ordering forms, lead capture, SEO, the full backend? We walk you through packages built on top of what we already made together. Everything adds on. Nothing starts over.</div>
  </div>
</div>
```

- [ ] **Step 2: Verify in browser**

Scroll to Process section. Confirm:
- Step 01: "Quick Call" with "15 minutes. That's it."
- Step 02: "We Design It" with "48 hours" and "hand-code"
- Step 03: "You Decide" with "Love it or leave it."
- Step 04: "Go Live" with "Your site. Your rules." and engine upsell language

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "process: rewrite 4 steps for Ferrari Framework — 48hr, hand-coded flow"
```

---

### Task 5: Why Us Cards

**Files:**
- Modify: `index.html:1160-1212`

Cards 3, 4, 5 stay unchanged. Update cards 1, 2, and 6.

- [ ] **Step 1: Update Card 1 (Speed)**

Replace lines 1172-1173:
```html
<div class="why-title">Your site is ready before most agencies even send a proposal</div>
<div class="why-desc">First draft in 1–2 days. Full site live in under 5. No waiting weeks to see something.</div>
```
With:
```html
<div class="why-title">48 hours. Not 4-8 weeks.</div>
<div class="why-desc">It typically takes 4-8 weeks to get a website. We send you a finished design in 48 hours.</div>
```

- [ ] **Step 2: Update Card 2 (Risk reversal)**

Replace lines 1179-1180:
```html
<div class="why-title">You'll never pay for something you don't love</div>
<div class="why-desc">You don't pay until you see and approve the finished site. No contracts, no deposits upfront.</div>
```
With:
```html
<div class="why-title">$0 until you're satisfied.</div>
<div class="why-desc">We build it first. You see it first. You decide if it's worth paying for.</div>
```

- [ ] **Step 3: Update Card 6 (Hand-coded + hosting)**

Replace lines 1207-1208:
```html
<div class="why-title">No $50/month hosting bills. Ever.</div>
<div class="why-desc">Sites hosted on GitHub Pages — no $30&#8211;50/month bills. You only pay for your domain (~$15/yr).</div>
```
With:
```html
<div class="why-title">No Wix. No Shopify. No shortcuts.</div>
<div class="why-desc">Every site is hand-coded from scratch — no page builders, no templates, no monthly platform fees. Hosted free. You only pay for your domain.</div>
```

- [ ] **Step 4: Verify in browser**

Scroll to Why Us section. Confirm:
- Card 1: "48 hours. Not 4-8 weeks."
- Card 2: "$0 until you're satisfied."
- Cards 3-5: unchanged
- Card 6: "No Wix. No Shopify. No shortcuts."

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "why-us: update speed, risk, and hand-coded cards for Ferrari Framework"
```

---

### Task 6: Remove Founder Section

**Files:**
- Modify: `index.html:1226-1238` (HTML)
- Modify: `index.html:1457-1461` (GSAP animation)

- [ ] **Step 1: Delete founder HTML**

Delete the entire founder section (lines 1226-1238):
```html
<!-- MEET THE FOUNDER -->
<section id="founder">
  <div class="section-inner">
    <p class="section-label">Who's Behind FJMedia</p>
    <h2 class="section-title">One person. Start to finish.</h2>
    <div class="divider"></div>
    <div class="founder-content">
      <p class="founder-text">When you message FJMedia, you're talking to the person who designs, builds, and launches your site. No account managers. No handoffs. No "I'll pass that along."</p>
      <p class="founder-text">I'm James — a Winnipeg-based web designer who works directly with every client. You get fast replies, honest feedback, and a site built by someone who actually knows your project inside and out.</p>
      <p class="founder-highlight">You'll always know exactly who's working on your site — because it's the same person from the first message to launch day.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Remove founder GSAP animation**

Delete the founder GSAP block (lines 1457-1461):
```javascript
// Founder content — fade in
gsap.from('.founder-text, .founder-highlight', {
  scrollTrigger: { trigger: '.founder-content', start: 'top 82%', once: true },
  opacity: 0, y: 20, duration: 0.6, stagger: 0.12, ease: 'power2.out'
});
```

- [ ] **Step 3: Remove founder CSS (if any)**

Search for any `.founder-` CSS rules in the `<style>` block and delete them. (The founder section uses `.founder-content`, `.founder-text`, `.founder-highlight` classes.)

- [ ] **Step 4: Verify in browser**

Scroll through the page. Confirm:
- No founder section visible between Proof Callout and Free Audit
- No console errors from missing GSAP targets
- Page flow is smooth (Proof Callout → Free Audit → Pricing)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "remove: cut founder section entirely per spec decision"
```

---

### Task 7: Pricing Section — HTML Overhaul

**Files:**
- Modify: `index.html:1260-1354` (pricing HTML)

- [ ] **Step 1: Update pricing headline and subline**

Replace lines 1263-1265:
```html
<p class="section-label">Packages</p>
<h2 class="section-title">Your site is built. <em>Now make it work.</em></h2>
<p class="section-sub">The free build gets you the design. Pick a package to turn it into a customer machine.</p>
```
With:
```html
<p class="section-label">Packages</p>
<h2 class="section-title">Your design is ready. <em>Now choose what happens next.</em></h2>
<p class="section-sub">Love the design? You can go live as-is, or add the backend that turns it into a customer machine.</p>
```

- [ ] **Step 2: Remove "Most agencies charge" anchor line**

Delete line 1268:
```html
<p class="calc-anchor" style="text-align:center;font-size:0.95rem;color:rgba(237,234,229,0.55);margin-bottom:1.2rem;">Most agencies charge $3,000–$5,000 for what we include in every package.</p>
```

- [ ] **Step 3: Update scarcity bar**

Replace the scarcity bar text (line 1271-1274). Change the `<span>` content:
```html
<span>We take on a max of <strong>5 builds per month.</strong> <span id="calcSpotsText">3 spots left this month.</span></span>
```
To:
```html
<span>Design delivered in 48 hours. Full builds launch in under a week.</span>
```

Also remove the `calcSpotsText` span since it's no longer needed.

- [ ] **Step 4: Rename combo tabs**

Replace the combo tabs (lines 1277-1295):
```html
<div class="combo-tabs" id="comboTabs">
  <button class="combo-tab" data-combo="getOnline" onclick="selectCombo('getOnline')">
    <div class="combo-tab-name">Get Online</div>
    <div class="combo-tab-sub">Start here</div>
  </button>
  <button class="combo-tab" data-combo="getFound" onclick="selectCombo('getFound')">
    <div class="combo-tab-name">Get Found</div>
    <div class="combo-tab-sub">+ SEO</div>
  </button>
  <button class="combo-tab" data-combo="getCustomers" onclick="selectCombo('getCustomers')">
    <div class="combo-tab-name">Get Customers</div>
    <div class="combo-tab-sub">Most picked</div>
    <span class="combo-pop">POPULAR</span>
  </button>
  <button class="combo-tab" data-combo="ownTheMarket" onclick="selectCombo('ownTheMarket')">
    <div class="combo-tab-name">Own the Market</div>
    <div class="combo-tab-sub">Full system</div>
  </button>
</div>
```
With:
```html
<div class="combo-tabs" id="comboTabs">
  <button class="combo-tab" data-combo="goLive" onclick="selectCombo('goLive')">
    <div class="combo-tab-name">Go Live</div>
    <div class="combo-tab-sub">Design only</div>
  </button>
  <button class="combo-tab" data-combo="getFound" onclick="selectCombo('getFound')">
    <div class="combo-tab-name">Get Found</div>
    <div class="combo-tab-sub">+ SEO</div>
  </button>
  <button class="combo-tab" data-combo="getCustomers" onclick="selectCombo('getCustomers')">
    <div class="combo-tab-name">Get Customers</div>
    <div class="combo-tab-sub">+ Lead capture</div>
    <span class="combo-pop">POPULAR</span>
  </button>
  <button class="combo-tab" data-combo="ownTheMarket" onclick="selectCombo('ownTheMarket')">
    <div class="combo-tab-name">Own the Market</div>
    <div class="combo-tab-sub">Full system</div>
  </button>
</div>
```

- [ ] **Step 5: Update service grid cards — add descriptions per spec**

Replace the service grid (lines 1298-1334) with updated cards that match the spec's feature lists:
```html
<div class="svc-grid" id="svcGrid">
  <div class="svc-card locked selected" data-svc="website" onclick="toggleSvc('website')">
    <div class="svc-check"></div>
    <div class="svc-icon">🖥️</div>
    <div class="svc-name">Custom Website</div>
    <div class="svc-desc">Hand-coded, mobile-ready, live preview link, domain connection.</div>
  </div>
  <div class="svc-card" data-svc="seo" onclick="toggleSvc('seo')">
    <div class="svc-check"></div>
    <div class="svc-icon">📈</div>
    <div class="svc-name">SEO &amp; Google Setup</div>
    <div class="svc-desc">On-page SEO, Google Business Profile optimization, local search visibility.</div>
  </div>
  <div class="svc-card" data-svc="ordering" onclick="toggleSvc('ordering')">
    <div class="svc-check"></div>
    <div class="svc-icon">📋</div>
    <div class="svc-name">Ordering / Booking</div>
    <div class="svc-desc">Forms with live pricing, Google Sheets CRM, automated email notifications.</div>
  </div>
  <div class="svc-card" data-svc="analytics" onclick="toggleSvc('analytics')">
    <div class="svc-check"></div>
    <div class="svc-icon">📊</div>
    <div class="svc-name">Analytics &amp; Maintenance</div>
    <div class="svc-desc">Analytics setup, monthly reports, seasonal updates, managed maintenance, priority support.</div>
  </div>
  <div class="svc-card placeholder">
    <div class="svc-icon">💬</div>
    <div class="svc-name">Need something else?</div>
    <div class="svc-desc">Tell us in the form below — we'll figure it out.</div>
  </div>
</div>
```

Note: Removed the `domain` and `retainer` cards. Replaced with `analytics` card for "Own the Market" tier. The grid now has 4 functional cards + 1 placeholder (was 5 + 1).

- [ ] **Step 6: Update calculator form**

Replace the calc form (lines 1342-1351):
```html
<div class="calc-form" id="calcForm">
  <div class="calc-form-title">Get Your Custom Quote</div>
  <div class="calc-form-sub">Drop your name and Instagram or email — James gets back within 12 hours.</div>
  <div class="calc-form-fields">
    <input type="text" name="calc_name" placeholder="Your name" autocomplete="name" />
    <input type="text" name="calc_contact" placeholder="Instagram handle or email" autocomplete="off" />
  </div>
  <button class="calc-submit" id="calcSubmit" onclick="submitCalcForm()">Get My Custom Quote →</button>
  <p class="calc-risk">Don't love it — you owe nothing.</p>
</div>
```
With:
```html
<div class="calc-form" id="calcForm">
  <div class="calc-form-title">Get My Free Design</div>
  <div class="calc-form-sub">Drop your info — James gets back within 12 hours.</div>
  <div class="calc-form-fields">
    <input type="text" name="calc_name" placeholder="Your name" autocomplete="name" />
    <input type="text" name="calc_contact" placeholder="Instagram handle or email" autocomplete="off" />
    <textarea name="calc_about" placeholder="Tell us about your business (optional)" rows="3" style="resize:vertical;"></textarea>
  </div>
  <button class="calc-submit" id="calcSubmit" onclick="submitCalcForm()">Get My Free Design →</button>
  <p class="calc-risk">One call. 48 hours. Yours — before you spend a dime.</p>
</div>
```

- [ ] **Step 7: Update speed text**

Replace line 1269:
```html
<p class="calc-speed">Most sites launch in under a week.</p>
```
With:
```html
<p class="calc-speed">Design delivered in 48 hours. Full builds launch in under a week.</p>
```

(If the scarcity bar already covers this, delete this line instead to avoid duplication.)

- [ ] **Step 8: Verify in browser**

Scroll to pricing section. Confirm:
- Headline: "Your design is ready. Now choose what happens next."
- No "Most agencies charge" line
- Scarcity bar mentions 48 hours
- Tabs: Go Live / Get Found / Get Customers / Own the Market
- Service cards: 4 cards + placeholder (no domain/retainer cards)
- Form has 3 fields (name, IG/email, about your business)
- CTA: "Get My Free Design →"
- Supporting text: "One call. 48 hours. Yours — before you spend a dime."

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "pricing: rename tabs, remove prices, add third form field, update CTAs"
```

---

### Task 8: Pricing Section — JavaScript Overhaul

**Files:**
- Modify: `index.html:1483-1634` (calculator JS)

- [ ] **Step 1: Update comboMap**

Replace lines 1484-1489:
```javascript
const comboMap = {
  getOnline:    ['website'],
  getFound:     ['website', 'seo', 'domain'],
  getCustomers: ['website', 'ordering', 'seo', 'domain'],
  ownTheMarket: ['website', 'ordering', 'seo', 'domain', 'retainer']
};
```
With:
```javascript
const comboMap = {
  goLive:       ['website'],
  getFound:     ['website', 'seo'],
  getCustomers: ['website', 'seo', 'ordering'],
  ownTheMarket: ['website', 'seo', 'ordering', 'analytics']
};
```

- [ ] **Step 2: Update comboNames**

Replace lines 1490-1493:
```javascript
const comboNames = {
  getOnline: 'Get Online', getFound: 'Get Found',
  getCustomers: 'Get Customers', ownTheMarket: 'Own the Market'
};
```
With:
```javascript
const comboNames = {
  goLive: 'Go Live', getFound: 'Get Found',
  getCustomers: 'Get Customers', ownTheMarket: 'Own the Market'
};
```

- [ ] **Step 3: Update upsellMessages**

Replace lines 1494-1499:
```javascript
const upsellMessages = {
  getOnline:    'Add SEO &amp; Domain to get found on Google — upgrade to Get Found.',
  getFound:     'Add Ordering/Booking to start capturing revenue — upgrade to Get Customers.',
  getCustomers: 'Add a Monthly Retainer to keep growing — upgrade to Own the Market.',
  ownTheMarket: null
};
```
With:
```javascript
const upsellMessages = {
  goLive:       'Add SEO to get found on Google — upgrade to Get Found.',
  getFound:     'Add ordering forms &amp; CRM to start capturing leads — upgrade to Get Customers.',
  getCustomers: 'Add analytics &amp; managed maintenance — upgrade to Own the Market.',
  ownTheMarket: null
};
```

- [ ] **Step 4: Update svcDisplayNames**

Replace lines 1500-1503:
```javascript
const svcDisplayNames = {
  website: 'Custom Website', ordering: 'Ordering / Booking',
  seo: 'SEO &amp; Google Setup', domain: 'Domain Setup', retainer: 'Monthly Retainer'
};
```
With:
```javascript
const svcDisplayNames = {
  website: 'Custom Website', ordering: 'Ordering / Booking',
  seo: 'SEO &amp; Google Setup', analytics: 'Analytics &amp; Maintenance'
};
```

- [ ] **Step 5: Update findClosestCombo order**

Replace line 1519:
```javascript
const order = ['getOnline','getFound','getCustomers','ownTheMarket'];
```
With:
```javascript
const order = ['goLive','getFound','getCustomers','ownTheMarket'];
```

- [ ] **Step 6: Update calcForm visibility logic**

Replace lines 1531-1533:
```javascript
// Show/hide lead form: only if a non-locked (non-website-only) service is selected
const nonLocked = svcs.filter(s => s !== 'website');
calcForm.classList.toggle('visible', nonLocked.length > 0);
```
With:
```javascript
// Always show the lead form
calcForm.classList.add('visible');
```

This ensures the "Get My Free Design" form is always visible, since the whole pricing section is now about getting them to fill out the form, not calculating a price.

- [ ] **Step 7: Update submitCalcForm to include new "about" field**

Replace line 1597:
```javascript
if (!name || !contact) { showDepToast('Please fill in both fields.'); return; }
```
With:
```javascript
if (!name || !contact) { showDepToast('Please fill in your name and contact.'); return; }
```

Replace line 1605:
```javascript
const payload = { name, contact, services: svcs.join(', '), combo: comboNames[combo] };
```
With:
```javascript
const about = document.querySelector('[name="calc_about"]')?.value.trim() || '';
const payload = { name, contact, about, services: svcs.join(', '), combo: comboNames[combo] };
```

- [ ] **Step 8: Verify in browser**

Click each combo tab. Confirm:
- "Go Live" selects only Custom Website
- "Get Found" selects Website + SEO
- "Get Customers" selects Website + SEO + Ordering
- "Own the Market" selects all 4
- Status bar shows correct combo names and upsell messages
- Form is always visible
- Submit works (fills payload with name, contact, about, services, combo)

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "calculator js: rename combos, remove domain/retainer, always show form"
```

---

### Task 9: Contact Form

**Files:**
- Modify: `index.html:1360-1408` (contact HTML)
- Modify: `index.html:1770-1806` (contact form JS handler)

- [ ] **Step 1: Update contact info text**

Replace line 1365:
```html
<h2 class="section-title">Let's see if we're a fit.</h2>
```
With:
```html
<h2 class="section-title">Let's see if we're a fit.</h2>
```
(No change to heading — spec matches.)

Replace line 1367:
```html
<p>The first step is a quick, no-pressure conversation. Tell us about your business and what you're looking for — we'll take it from there.</p>
```
With:
```html
<p>Drop your name and how to reach you — James gets back within 12 hours.</p>
```

Replace line 1384:
```html
<span>Response within 24 hours</span>
```
With:
```html
<span>James gets back within 12 hours</span>
```

- [ ] **Step 2: Replace contact form fields**

Replace the form (lines 1387-1405):
```html
<form class="contact-form" id="contactForm">
  <input type="hidden" name="access_key" value="0c04279d-9084-4fdb-91ff-9820f7ca0a05" />
  <input type="hidden" name="subject" value="New Inquiry — FJMedia" />
  <input type="text"  name="name"     placeholder="Your Name"               required />
  <input type="email" name="email"    placeholder="Your Email"              required />
  <input type="text"  name="business" placeholder="Business Name (optional)" />
  <select name="service">
    <option value="" disabled selected>What are you looking for?</option>
    <option>Custom Website</option>
    <option>Website + SEO &amp; Google Setup</option>
    <option>Website + Ordering / Booking System</option>
    <option>Full Package (Website, SEO, Ordering, Domain)</option>
    <option>Monthly Retainer / Ongoing Support</option>
    <option>Not Sure Yet</option>
  </select>
  <textarea name="message" placeholder="Tell us about your business and what you need..."></textarea>
  <button type="submit" class="btn-primary" id="submitBtn">Book a Call</button>
  <p id="formMsg" style="font-size:0.85rem;color:var(--accent);display:none;text-align:center;">Message sent &#8212; we'll reach out within 24 hours to schedule your call.</p>
</form>
```
With:
```html
<form class="contact-form" id="contactForm">
  <input type="hidden" name="access_key" value="0c04279d-9084-4fdb-91ff-9820f7ca0a05" />
  <input type="hidden" name="subject" value="New Inquiry — FJMedia" />
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="text" name="contact" placeholder="Instagram handle or email" required />
  <textarea name="message" placeholder="Tell us about your business (optional)"></textarea>
  <button type="submit" class="btn-primary" id="submitBtn">Get My Free Design</button>
  <p id="formMsg" style="font-size:0.85rem;color:var(--accent);display:none;text-align:center;">Message sent &#8212; James will get back within 12 hours.</p>
</form>
```

- [ ] **Step 3: Update contact form JS handler**

The form submit handler (lines 1772-1806) sends data to Web3Forms and GAS. Update the GAS params to match new field names.

Replace lines 1787-1793:
```javascript
const params = new URLSearchParams({
  name:     formData.get('name')     || '',
  email:    formData.get('email')    || '',
  business: formData.get('business') || '',
  service:  formData.get('service')  || '',
  message:  formData.get('message')  || ''
});
```
With:
```javascript
const params = new URLSearchParams({
  name:    formData.get('name')    || '',
  contact: formData.get('contact') || '',
  message: formData.get('message') || ''
});
```

- [ ] **Step 4: Update prefillAudit function**

The `prefillAudit()` function (lines 1646-1658) references `[name="service"]` which no longer exists. Update it:

Replace lines 1646-1658:
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
  const msg = document.querySelector('[name="message"]');
  if (msg && !msg.value) msg.value = "I'd like a free website audit — here's my site: ";
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { const n = document.querySelector('.contact-form input[name="name"]'); if (n) n.focus(); }, 600);
}
```
With:
```javascript
function prefillAudit() {
  const msg = document.querySelector('[name="message"]');
  if (msg && !msg.value) msg.value = "I'd like a free website audit — here's my site: ";
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { const n = document.querySelector('.contact-form input[name="name"]'); if (n) n.focus(); }, 600);
}
```

- [ ] **Step 5: Verify in browser**

Scroll to contact section. Confirm:
- Sub text: "Drop your name and how to reach you — James gets back within 12 hours."
- Form has 3 fields: Name, Instagram handle or email, Tell us about your business
- No dropdown
- CTA button: "Get My Free Design"
- Success message: "James will get back within 12 hours"
- "Get My Free Audit" button from the audit section still works (scrolls to contact, prefills message)

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "contact: simplify to 3 fields, remove dropdown, update CTA and response time"
```

---

### Task 10: Final Cleanup

**Files:**
- Modify: `index.html` — nav, mobile CTA, misc

- [ ] **Step 1: Update mobile CTA bar**

Replace line 1812:
```html
<a href="#contact">Book a Call</a>
```
With:
```html
<a href="#contact">Get My Free Design</a>
```

- [ ] **Step 2: Remove founder CSS**

Search the `<style>` block for any `.founder-` CSS rules and delete them. These are dead CSS now that the section is removed.

- [ ] **Step 3: Remove `calc-speed` line if duplicated by scarcity bar**

Check if both the `calc-speed` paragraph and the scarcity bar now say the same thing about 48 hours. If so, delete the `calc-speed` line to avoid duplication.

- [ ] **Step 4: Full page walkthrough in browser**

Open `index.html` and scroll through the entire page top to bottom:
- [ ] Meta tags correct (View Source)
- [ ] Hero: new headline, stat cards, SEO line
- [ ] Offer: updated copy, 48 Hours pillar
- [ ] Process: 4 new steps
- [ ] Portfolio: unchanged
- [ ] Why Us: 3 cards updated
- [ ] Proof Callout: unchanged
- [ ] No founder section
- [ ] Free Audit: works, prefills correctly
- [ ] Pricing: Go Live tab, no prices, 3-field form, new CTA
- [ ] Contact: 3 fields, no dropdown, new CTA
- [ ] Mobile CTA bar: "Get My Free Design"
- [ ] No console errors
- [ ] Mobile responsive check (resize to 375px width)

- [ ] **Step 5: Final commit**

```bash
git add index.html
git commit -m "cleanup: mobile CTA, dead CSS, final Ferrari Framework polish"
```

- [ ] **Step 6: Push to remote**

```bash
git push origin master
```

Verify live at https://fjdmedia.github.io/FJMedia/ (may take 1-2 minutes for GitHub Pages to update).

---

## Summary

| Task | Section | Key Changes |
|------|---------|-------------|
| 1 | Meta/SEO | Title, description, OG, Twitter, Schema — 48hr + hand-coded keywords |
| 2 | Hero | New H1, sub, label, SEO line, stat cards |
| 3 | Offer | "done" not "built", hand-coded copy, 48hr pillars |
| 4 | Process | 4 rewritten steps — Quick Call, We Design It, You Decide, Go Live |
| 5 | Why Us | Cards 1, 2, 6 updated — speed, risk, hand-coded |
| 6 | Founder | Deleted entirely (HTML + GSAP + CSS) |
| 7 | Pricing HTML | Rename tabs, remove prices, new scarcity, 3-field form |
| 8 | Pricing JS | New comboMap, comboNames, upsell messages, always-visible form |
| 9 | Contact | 3 fields, no dropdown, "Get My Free Design" CTA, 12hr response |
| 10 | Cleanup | Mobile CTA, dead CSS, full walkthrough, push |
