# Pricing & Lead Magnet Rework — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Offer and Pricing sections on the FJMedia agency site to frame the free build as a lead magnet and apply Hormozi-style pricing with market rate anchors, outcome-focused copy, and per-card risk reversal.

**Architecture:** Pure HTML content changes in a single file (`index.html`). No new files, no new dependencies, no backend changes. Two sections modified: `#offer` (lines ~1032–1057) and `#pricing` (lines ~1364–1544). Existing CSS classes reused where possible, minimal new inline styles for 3 new elements.

**Tech Stack:** HTML, inline CSS, existing GSAP ScrollTrigger animations (untouched)

**Spec:** `docs/superpowers/specs/2026-04-05-pricing-lead-magnet-design.md`

---

### Task 1: Update The Offer Section — Headline + Subtitle

**Files:**
- Modify: `index.html:1035-1036` (offer headline and subtitle)

- [ ] **Step 1: Replace the offer headline**

Find this in `index.html`:
```html
<h2 class="offer-headline">We build your website for free.<br><em>You pay only after you approve.</em></h2>
```

Replace with:
```html
<h2 class="offer-headline">Your website is already built.<br><em>You just haven't seen it yet.</em></h2>
```

- [ ] **Step 2: Replace the offer subtitle**

Find this in `index.html`:
```html
<p class="offer-sub">No approval, no invoice. No contracts, no deposits, no risk — ever.</p>
```

Replace with:
```html
<p class="offer-sub">We design and build your entire site before you spend a dollar. Show up to the call, and we'll walk you through it live.</p>
```

- [ ] **Step 3: Open in browser and verify**

Open `index.html` in a browser. Scroll to "The Offer" section. Confirm:
- Headline reads "Your website is already built. You just haven't seen it yet."
- Subtitle reads the new copy
- No layout breakage on desktop or mobile (resize window to check)

---

### Task 2: Add Free Checklist Box to Offer Section

**Files:**
- Modify: `index.html` — insert new element between the subtitle (`offer-sub`) and the pillars (`offer-pillars`)

- [ ] **Step 1: Insert the free checklist box**

Find this in `index.html`:
```html
<p class="offer-sub">We design and build your entire site before you spend a dollar. Show up to the call, and we'll walk you through it live.</p>
      <div class="offer-pillars">
```

Replace with:
```html
<p class="offer-sub">We design and build your entire site before you spend a dollar. Show up to the call, and we'll walk you through it live.</p>
      <div style="max-width:520px;margin:1.5rem auto;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:1.4rem 1.8rem;text-align:left;">
        <p style="font-size:0.78rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);margin-bottom:0.6rem;font-weight:600;">What you get free:</p>
        <p style="font-size:0.95rem;line-height:2;color:var(--text);">
          <span style="color:var(--accent);">✓</span> Full custom design — your brand, your photos<br>
          <span style="color:var(--accent);">✓</span> Every page built and mobile-ready<br>
          <span style="color:var(--accent);">✓</span> Live preview link you can share<br>
          <span style="color:var(--accent);">✓</span> No contracts. No deposits. Walk away anytime.
        </p>
      </div>
      <div class="offer-pillars">
```

- [ ] **Step 2: Verify in browser**

Refresh `index.html`. Confirm:
- Gold-bordered box appears between subtitle and pillars
- 4 checkmarked lines with gold checkmarks
- Centered, max-width ~520px
- Check mobile (resize to ~375px) — box should fit within padding

---

### Task 3: Update Offer Pillars (4 → 3)

**Files:**
- Modify: `index.html:1037-1053` (offer pillars)

- [ ] **Step 1: Replace the 4 pillars with 3**

Find this in `index.html`:
```html
      <div class="offer-pillars">
        <div class="offer-pillar reveal">
          <div class="offer-pillar-num">5 Days</div>
          <div class="offer-pillar-label">Website preview delivered</div>
        </div>
        <div class="offer-pillar reveal">
          <div class="offer-pillar-num">14 Days</div>
          <div class="offer-pillar-label">Full package live</div>
        </div>
        <div class="offer-pillar reveal">
          <div class="offer-pillar-num">$0</div>
          <div class="offer-pillar-label">Upfront cost to you</div>
        </div>
        <div class="offer-pillar reveal">
          <div class="offer-pillar-num">100%</div>
          <div class="offer-pillar-label">Free to walk away</div>
        </div>
      </div>
```

Replace with:
```html
      <div class="offer-pillars">
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
      </div>
```

- [ ] **Step 2: Verify in browser**

Refresh. Confirm:
- 3 pillars instead of 4
- Labels match new copy
- Pillars still centered and evenly spaced
- GSAP reveal animation still works (scroll away and back)

---

### Task 4: Update Offer CTA Button

**Files:**
- Modify: `index.html:1055` (offer CTA)

- [ ] **Step 1: Replace the CTA button**

Find this in `index.html`:
```html
      <a href="#contact" class="btn-primary">Book a Free Intro Call</a>
```

Replace with:
```html
      <a href="#contact" class="btn-primary" style="background:var(--accent);color:var(--bg);border-color:var(--accent);">Book a Call — See Your Site in 5 Days</a>
```

- [ ] **Step 2: Verify in browser**

Refresh. Confirm:
- Button is gold background with dark text
- Text reads "Book a Call — See Your Site in 5 Days"
- Button links to `#contact`
- Hover state still works (may darken slightly — acceptable)

- [ ] **Step 3: Commit Offer section changes**

```bash
cd "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website"
git add index.html
git commit -m "feat: upgrade Offer section to lead magnet — new headline, free checklist, 3 pillars, gold CTA"
```

---

### Task 5: Update Pricing Section Header

**Files:**
- Modify: `index.html:1367-1368` (pricing headline + subtitle)

- [ ] **Step 1: Replace the pricing headline**

Find this in `index.html`:
```html
      <h2 class="section-title">Pick your outcome.<br/>We handle everything else.</h2>
      <p class="section-sub">Every package is built to bring your business more customers — not just a prettier page. No templates, no shortcuts.</p>
```

Replace with:
```html
      <h2 class="section-title">Your site is built.<br/>Now make it work.</h2>
      <p class="section-sub">The free build gets you the design. Pick a package to turn it into a customer machine.</p>
```

- [ ] **Step 2: Verify in browser**

Refresh. Scroll to Pricing. Confirm new headline and subtitle.

---

### Task 6: Add Market Rate Anchor

**Files:**
- Modify: `index.html` — insert new element between the divider and the ROI block

- [ ] **Step 1: Insert the market rate anchor line**

Find this in `index.html`:
```html
      <div class="divider"></div>

      <div class="roi-block">
```

Replace with:
```html
      <div class="divider"></div>

      <p style="text-align:center;font-size:1.05rem;opacity:0.6;margin:1.5rem 0 0.5rem;font-style:italic;">Most agencies charge $3,000–$5,000 for what we include in every package.</p>

      <div class="roi-block">
```

- [ ] **Step 2: Verify in browser**

Refresh. Confirm:
- Italic line appears between the divider and ROI block
- Subtle opacity, centered
- Doesn't feel like a banner — just a quiet fact

---

### Task 7: Rewrite Get Found Card

**Files:**
- Modify: `index.html:1404-1428` (Get Found card)

- [ ] **Step 1: Replace the Get Found card content**

Find this in `index.html`:
```html
        <!-- Get Found -->
        <div class="pricing-card reveal">
          <div class="pricing-tier">Get Found</div>
          <div class="pricing-tagline">Get found by customers already searching for you</div>
          <div class="pricing-divider"></div>
          <ul class="pricing-features">
            <li><span class="feat-left"><span class="check">✓</span> Look like the most credible business in your area — from day one</span><span class="feat-val">$600+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> A site no competitor can copy — 100% built for your brand</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Capture the 60% of customers who search on their phone</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Never miss an inquiry — alerted the second someone reaches out</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Words that speak to your customers — written for you, not by you</span><span class="feat-val">$250+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Set up to be found on Google the moment you go live</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Live on the internet with zero monthly hosting fees</span><span class="feat-val">$75+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Risk-free first month — change anything, we handle it</span><span class="feat-val">$150+</span></li>
          </ul>
          <div class="pricing-total-row">
            <span class="pricing-total-label">Total value</span>
            <span class="pricing-total-val">$1,725+</span>
          </div>
          <div class="pricing-price-block">
            <div class="pricing-you-pay">You pay</div>
            <div class="pricing-price">$600</div>
            <span class="pricing-save">You save $1,125+</span>
          </div>
          <a href="#contact" class="btn-outline pricing-btn" data-pkg="Get Found — $600">Get Started</a>
        </div>
```

Replace with:
```html
        <!-- Get Found -->
        <div class="pricing-card reveal">
          <div class="pricing-tier">Get Found</div>
          <div class="pricing-tagline">Customers searching for you will find a site that makes you look like the best option</div>
          <div class="pricing-divider"></div>
          <ul class="pricing-features">
            <li><span class="feat-left"><span class="check">✓</span> Look like the most credible option in your area</span><span class="feat-val">$600+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 100% custom — no templates, no cookie-cutter</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Looks perfect on every phone and screen</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Visitors can reach you instantly</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Words written to convert, not just fill space</span><span class="feat-val">$250+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Set up to show on Google from day one</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Hosted free — no monthly fees</span><span class="feat-val">$75+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 1 month free changes after launch</span><span class="feat-val">$150+</span></li>
          </ul>
          <div class="pricing-total-row">
            <span class="pricing-total-label">Total value</span>
            <span class="pricing-total-val">$1,725+</span>
          </div>
          <div class="pricing-price-block">
            <div class="pricing-you-pay">You pay</div>
            <div class="pricing-price">$600</div>
            <span class="pricing-save">You save $1,125+</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin:0.5rem 0;padding:6px;background:rgba(255,255,255,0.03);border-radius:6px;">
            <span style="font-size:0.85rem;">&#128737;</span>
            <span style="font-size:0.78rem;opacity:0.5;">Don't love it? $0.</span>
          </div>
          <a href="#contact" class="btn-outline pricing-btn" data-pkg="Get Found — $600">Book a Call</a>
        </div>
```

- [ ] **Step 2: Verify in browser**

Refresh. Confirm:
- Tagline updated
- All 8 features show new outcome-focused copy with same dollar values
- Risk reversal badge ("Don't love it? $0.") appears between price and CTA
- CTA says "Book a Call"
- Card layout intact, no overflow

---

### Task 8: Rewrite Get Customers Card

**Files:**
- Modify: `index.html:1430-1456` (Get Customers card)

- [ ] **Step 1: Replace the Get Customers card content**

Find this in `index.html`:
```html
        <!-- Get Customers -->
        <div class="pricing-card pricing-featured reveal">
          <div class="pricing-badge">Most Popular</div>
          <div class="pricing-tier">Get Customers</div>
          <div class="pricing-tagline">Attract leads and turn visitors into paying customers</div>
          <div class="pricing-divider"></div>
          <ul class="pricing-features">
            <li><span class="feat-left"><span class="check">✓</span> Everything in Get Found — plus a lead capture system</span><span class="feat-val">$1,725+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Order/booking form — capture revenue automatically</span><span class="feat-val">$300+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Google Sheets CRM — every lead logged, free forever</span><span class="feat-val">$250+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Instant alert on every inquiry — respond first, win more</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> GA4 analytics — see exactly what's driving customers</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Gallery section — show your work, upsell naturally</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Social links — turn visitors into followers</span><span class="feat-val">$75+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 3 months free changes — your site stays sharp</span><span class="feat-val">$450+</span></li>
          </ul>
          <div class="pricing-total-row">
            <span class="pricing-total-label">Total value</span>
            <span class="pricing-total-val">$3,350+</span>
          </div>
          <div class="pricing-price-block">
            <div class="pricing-you-pay">You pay</div>
            <div class="pricing-price">$1,000</div>
            <span class="pricing-save">You save $2,350+</span>
          </div>
          <a href="#contact" class="btn-primary pricing-btn" data-pkg="Get Customers — $1,000">Get Started</a>
        </div>
```

Replace with:
```html
        <!-- Get Customers -->
        <div class="pricing-card pricing-featured reveal">
          <div class="pricing-badge">Most Popular</div>
          <div class="pricing-tier">Get Customers</div>
          <div class="pricing-tagline">Your site doesn't just look good — it captures leads and tells you who's interested</div>
          <div class="pricing-divider"></div>
          <ul class="pricing-features">
            <li><span class="feat-left"><span class="check">✓</span> Everything in Get Found</span><span class="feat-val">$1,725+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Booking/order form that captures revenue</span><span class="feat-val">$300+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Every lead logged automatically — free CRM</span><span class="feat-val">$250+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Instant alert when someone reaches out</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> See exactly what's driving customers to you</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Gallery section — show your work, upsell naturally</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Social links — turn visitors into followers</span><span class="feat-val">$75+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 3 months free changes — your site stays sharp</span><span class="feat-val">$450+</span></li>
          </ul>
          <div class="pricing-total-row">
            <span class="pricing-total-label">Total value</span>
            <span class="pricing-total-val">$3,350+</span>
          </div>
          <div class="pricing-price-block">
            <div class="pricing-you-pay">You pay</div>
            <div class="pricing-price">$1,000</div>
            <span class="pricing-save">You save $2,350+</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin:0.5rem 0;padding:6px;background:rgba(255,255,255,0.03);border-radius:6px;">
            <span style="font-size:0.85rem;">&#128737;</span>
            <span style="font-size:0.78rem;opacity:0.5;">Don't love it? $0.</span>
          </div>
          <a href="#contact" class="btn-primary pricing-btn" style="background:var(--accent);color:var(--bg);border-color:var(--accent);" data-pkg="Get Customers — $1,000">Book a Call</a>
        </div>
```

- [ ] **Step 2: Verify in browser**

Refresh. Confirm:
- "Most Popular" badge still present
- Tagline updated
- Features show new copy, same values
- Risk reversal badge present
- CTA is gold "Book a Call"
- Gold border/highlight styling intact

---

### Task 9: Rewrite Own the Market Card

**Files:**
- Modify: `index.html:1458-1483` (Own the Market card)

- [ ] **Step 1: Replace the Own the Market card content**

Find this in `index.html`:
```html
        <!-- Own the Market -->
        <div class="pricing-card reveal">
          <div class="pricing-tier">Own the Market</div>
          <div class="pricing-tagline">Dominate your local market — fully built, fully yours</div>
          <div class="pricing-divider"></div>
          <ul class="pricing-features">
            <li><span class="feat-left"><span class="check">✓</span> Everything in Get Customers — plus full local dominance</span><span class="feat-val">$3,350+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 2–3 custom designs to choose from — you pick the winner</span><span class="feat-val">$500+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Auto-reply on every inquiry — you look fast, always</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Reviews section — let happy customers sell for you</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Custom domain + full DNS setup — your .ca or .com</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Schema markup — rank faster in local Google search</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Open Graph setup — every share looks polished</span><span class="feat-val">$100+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 6 months managed maintenance — fully hands-off</span><span class="feat-val">$900+</span></li>
          </ul>
          <div class="pricing-total-row">
            <span class="pricing-total-label">Total value</span>
            <span class="pricing-total-val">$5,500+</span>
          </div>
          <div class="pricing-price-block">
            <div class="pricing-you-pay">You pay</div>
            <div class="pricing-price">$1,600</div>
            <span class="pricing-save">You save $3,900+</span>
          </div>
          <a href="#contact" class="btn-outline pricing-btn" data-pkg="Own the Market — $1,600">Get Started</a>
        </div>
```

Replace with:
```html
        <!-- Own the Market -->
        <div class="pricing-card reveal">
          <div class="pricing-tier">Own the Market</div>
          <div class="pricing-tagline">Full digital system — your brand dominates local search and runs on autopilot</div>
          <div class="pricing-divider"></div>
          <ul class="pricing-features">
            <li><span class="feat-left"><span class="check">✓</span> Everything in Get Customers</span><span class="feat-val">$3,350+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 2–3 designs to choose from — you pick the winner</span><span class="feat-val">$500+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Auto-reply on every inquiry — you look fast, always</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Reviews section — happy customers sell for you</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Your own .ca or .com — fully set up</span><span class="feat-val">$200+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Rank faster in local Google search</span><span class="feat-val">$150+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> Every share looks polished — auto-previews</span><span class="feat-val">$100+</span></li>
            <li><span class="feat-left"><span class="check">✓</span> 6 months fully managed — hands off</span><span class="feat-val">$900+</span></li>
          </ul>
          <div class="pricing-total-row">
            <span class="pricing-total-label">Total value</span>
            <span class="pricing-total-val">$5,500+</span>
          </div>
          <div class="pricing-price-block">
            <div class="pricing-you-pay">You pay</div>
            <div class="pricing-price">$1,600</div>
            <span class="pricing-save">You save $3,900+</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin:0.5rem 0;padding:6px;background:rgba(255,255,255,0.03);border-radius:6px;">
            <span style="font-size:0.85rem;">&#128737;</span>
            <span style="font-size:0.78rem;opacity:0.5;">Don't love it? $0.</span>
          </div>
          <a href="#contact" class="btn-outline pricing-btn" data-pkg="Own the Market — $1,600">Book a Call</a>
        </div>
```

- [ ] **Step 2: Verify in browser**

Refresh. Confirm:
- Tagline updated
- Features show new copy, same values
- Risk reversal badge present
- CTA says "Book a Call" (outline style)

- [ ] **Step 3: Commit pricing section changes**

```bash
cd "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website"
git add index.html
git commit -m "feat: rework Pricing section — market rate anchor, outcome copy, risk reversal badges, Book a Call CTAs"
```

---

### Task 10: Full Page Smoke Test

**Files:**
- No modifications — verification only

- [ ] **Step 1: Desktop check**

Open `index.html` in browser at full width (~1200px+). Scroll through entire page and confirm:
- Offer section: new headline, checklist box, 3 pillars, gold CTA
- Pricing section: new header, market rate anchor line, ROI block (unchanged), scarcity bar (unchanged), guarantee (unchanged)
- All 3 tier cards: new taglines, new feature copy, risk reversal badges, "Book a Call" CTAs
- Event Site + Linktree cards: unchanged
- Retainer add-on bar: unchanged
- GSAP animations still trigger on scroll (pillars bounce in, cards stagger)
- All "Book a Call" buttons scroll to `#contact`

- [ ] **Step 2: Mobile check**

Resize browser to ~375px width. Confirm:
- Offer checklist box fits within screen padding
- 3 pillars stack or fit correctly
- Pricing cards scroll horizontally (existing behavior)
- Risk reversal badges don't overflow cards
- Market rate anchor line wraps cleanly
- No horizontal scroll on the page body

- [ ] **Step 3: Check form pre-fill**

Click each "Book a Call" button and confirm the `data-pkg` value pre-fills correctly in the contact form:
- Get Found — $600
- Get Customers — $1,000
- Own the Market — $1,600
