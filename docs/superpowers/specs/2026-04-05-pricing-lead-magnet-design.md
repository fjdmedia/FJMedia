# FJMedia Agency Site — Pricing & Lead Magnet Rework

**Date:** 2026-04-05
**File:** `index.html` (FJDMedia Website)
**Scope:** Two sections modified — "The Offer" (lead magnet upgrade) + "Pricing" (Hormozi rework)

---

## Strategy

FJMedia's free build model is the lead magnet. The site already builds first and charges after approval. This rework makes that explicit on the page:

1. **The Offer section** (early on the page) hooks visitors with the lead magnet — "your site is already built, book a call to see it"
2. **The Pricing section** (later on the page) closes the sale — tiers reframed as upgrades that turn the free design into a working customer machine

The free build is the showroom car. The tiers add the engine.

---

## Part 1: The Offer Section — Lead Magnet Upgrade

**Section ID:** `#offer` (existing, same position on page — right after hero)

### Headline
- **Old:** "We build your website for free. *You pay only after you approve.*"
- **New:** "Your website is already built. *You just haven't seen it yet.*"

### Subtitle
- **Old:** "No approval, no invoice. No contracts, no deposits, no risk — ever."
- **New:** "We design and build your entire site before you spend a dollar. Show up to the call, and we'll walk you through it live."

### Free Checklist (NEW element)
Gold-bordered box below the subtitle. Lists what the free build includes:
- Full custom design — your brand, your photos
- Every page built and mobile-ready
- Live preview link you can share
- No contracts. No deposits. Walk away anytime.

Style: `background: rgba(201,168,76,0.08)`, `border: 1px solid rgba(201,168,76,0.25)`, rounded corners, left-aligned checkmarks.

### Pillars
- **Old:** 4 pillars — 5 Days / 14 Days / $0 / 100%
- **New:** 3 pillars — 5 Days ("Your site is ready") / $0 ("Until you say yes") / 0 Risk ("Don't love it? Walk away.")

Remove the "14 Days / Full package live" pillar — that's a post-sale detail, not a hook.

### CTA Button
- **Old:** "Book a Free Intro Call" (standard button style)
- **New:** "Book a Call — See Your Site in 5 Days" (gold background `#c9a84c`, dark text `#071520`)

---

## Part 2: The Pricing Section — Hormozi Rework

**Section ID:** `#pricing` (existing, same position on page)

### 2a. Section Header

- **Old label:** "Packages"
- **New label:** "Packages" (unchanged)

- **Old headline:** "Pick your outcome. We handle everything else."
- **New headline:** "Your site is built. Now make it work."

- **Old subtitle:** "Every package is built to bring your business more customers — not just a prettier page. No templates, no shortcuts."
- **New subtitle:** "The free build gets you the design. Pick a package to turn it into a customer machine."

### 2b. Market Rate Anchor (NEW element)

Single line inserted **between the section header and the ROI block**:

> "Most agencies charge $3,000–$5,000 for what we include in every package."

Style: centered text, subtle — `opacity: 0.6`, slightly larger than body text, no special container. Just a quiet fact that reframes everything below it.

### 2c. ROI Block — NO CHANGES

Keep "The math" block exactly as-is. Already strong.

### 2d. Scarcity Bar + Guarantee — NO CHANGES

Keep "5 builds per month" and "Built in 5 days. Don't love it — owe nothing." exactly as-is.

### 2e. Tier Cards — Feature Copy Rewrite

**Prices unchanged:** $600 / $1,000 / $1,600
**Tier names unchanged:** Get Found / Get Customers / Own the Market
**Value column unchanged:** All `$XXX+` values stay the same
**Total value / "You save" lines unchanged**
**"Most Popular" badge on Get Customers unchanged**

#### Get Found ($600)

**Tagline:**
- Old: "Get found by customers already searching for you"
- New: "Customers searching for you will find a site that makes you look like the best option"

**Features (outcome-focused rewrites):**
| # | New Copy | Value |
|---|----------|-------|
| 1 | Look like the most credible option in your area | $600+ |
| 2 | 100% custom — no templates, no cookie-cutter | $200+ |
| 3 | Looks perfect on every phone and screen | $150+ |
| 4 | Visitors can reach you instantly | $150+ |
| 5 | Words written to convert, not just fill space | $250+ |
| 6 | Set up to show on Google from day one | $150+ |
| 7 | Hosted free — no monthly fees | $75+ |
| 8 | 1 month free changes after launch | $150+ |

#### Get Customers ($1,000)

**Tagline:**
- Old: "Attract leads and turn visitors into paying customers"
- New: "Your site doesn't just look good — it captures leads and tells you who's interested"

**Features:**
| # | New Copy | Value |
|---|----------|-------|
| 1 | Everything in Get Found | $1,725+ |
| 2 | Booking/order form that captures revenue | $300+ |
| 3 | Every lead logged automatically — free CRM | $250+ |
| 4 | Instant alert when someone reaches out | $200+ |
| 5 | See exactly what's driving customers to you | $200+ |
| 6 | Gallery section — show your work, upsell naturally | $150+ |
| 7 | Social links — turn visitors into followers | $75+ |
| 8 | 3 months free changes — your site stays sharp | $450+ |

#### Own the Market ($1,600)

**Tagline:**
- Old: "Dominate your local market — fully built, fully yours"
- New: "Full digital system — your brand dominates local search and runs on autopilot"

**Features:**
| # | New Copy | Value |
|---|----------|-------|
| 1 | Everything in Get Customers | $3,350+ |
| 2 | 2–3 designs to choose from — you pick the winner | $500+ |
| 3 | Auto-reply on every inquiry — you look fast, always | $150+ |
| 4 | Reviews section — happy customers sell for you | $150+ |
| 5 | Your own .ca or .com — fully set up | $200+ |
| 6 | Rank faster in local Google search | $150+ |
| 7 | Every share looks polished — auto-previews | $100+ |
| 8 | 6 months fully managed — hands off | $900+ |

### 2f. Risk Reversal Badge (NEW — per card)

Every tier card gets a small badge below the price/save line, above the CTA:

```
🛡 Don't love it? $0.
```

Style: centered, flex row with shield icon + text, `background: rgba(255,255,255,0.03)`, rounded, subtle.

### 2g. CTA Buttons

All 3 cards change from "Get Started" to **"Book a Call"**.

- Get Found: outline button (border only, `#EDEAE5`)
- Get Customers: solid gold button (`#c9a84c` bg, `#071520` text) — matches "Most Popular" emphasis
- Own the Market: outline button (border only, `#EDEAE5`)

All buttons still link to `#contact` with the `data-pkg` attribute for form pre-fill.

### 2h. Retainer Add-on Bar — NO CHANGES

### 2i. Event Site + Linktree Cards — NO CHANGES

---

## What Is NOT Changing

- Page structure / section order (except Offer section content swap)
- Nav links
- Services, Process, Work, Why Us, Free Audit, Contact sections
- GSAP animations (all existing ScrollTrigger animations stay)
- Mobile scroll behavior on pricing cards
- Pricing dot indicators
- Any backend or form functionality

---

## Files Modified

| File | Change |
|------|--------|
| `index.html` | Offer section content + Pricing section content |

No new files. No new dependencies. Pure content/copy changes within `index.html` + 3 new HTML elements added inside existing sections: free checklist box (in `#offer`), market rate anchor line (in `#pricing`), and risk reversal badges (one per tier card in `#pricing`).
