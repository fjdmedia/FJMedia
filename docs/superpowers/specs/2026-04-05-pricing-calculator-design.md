# FJMedia Pricing Calculator — Design Spec

## Goal

Replace the fixed 4-tier pricing section on the FJMedia agency site with an interactive McDonald's-style service calculator that captures leads without showing prices. Clients pick services or combos, submit their name + contact, and James delivers the price on the sales call with the full Hormozi value stack.

## Architecture

Single-section replacement within the existing `index.html`. The current `#pricing` section (ROI block, scarcity bar, guarantee, 4 pricing cards, dots, retainer bar) is fully removed and replaced by the calculator. No new pages, no external dependencies beyond GSAP (already loaded) and the existing GAS backend pattern.

## Tech Stack

- HTML/CSS/JS inline in `index.html` (matches existing site pattern)
- GSAP for scroll animations (already loaded)
- Google Apps Script + Google Sheets for form submissions (same pattern as Sugar and Shai / Royal Kings)
- GAS handles both Google Sheets logging AND email notification (same pattern as client sites)

---

## Section 1: Calculator UI

### Section Heading

- **Section label:** "What Do You Need?"
- **Section title:** "Build your perfect package."
- **Speed callout** (below title): "Most sites launch in under a week." — muted but visible, reinforces FJMedia's turnaround advantage
- **Divider** (matches existing section pattern)

### Combo Tabs (segmented control)

A single horizontal strip with 4 tabs:

| Tab | Label |
|-----|-------|
| 1 | Get Online |
| 2 | Get Found |
| 3 | Get Customers |
| 4 | Own the Market |

- "POPULAR" badge on Get Customers tab
- Clicking a tab auto-selects the matching services in the grid below (two-way sync)
- Active tab uses gold highlight on navy background
- No tab selected by default — grid starts empty

### Service Card Grid (2x3)

5 service cards + 1 placeholder in a 2-column, 3-row grid:

| Card | Label | Description |
|------|-------|-------------|
| 1 | Custom Website | Your brand, hand-coded, mobile-ready. Live in days. |
| 2 | Online Ordering / Booking | Smart forms, live pricing, instant notifications. |
| 3 | SEO & Google Setup | Show up when locals search for what you do. |
| 4 | Domain Setup | Your own .ca or .com — fully connected. |
| 5 | Monthly Retainer | Updates, monitoring, and growth — handled for you. |
| 6 | Need something else? | Dashed border, muted — opens lead form with "other" flag. |

**Toggle behavior:**
- Cards toggle on/off with a visible selected state (gold border + checkmark)
- Custom Website is the foundation — auto-selects when any dependent service is toggled
- If user tries to deselect Website while other services are on, show a toast: "Everything starts with your website — it's the foundation." (auto-dismiss after 3 seconds)
- Selecting services updates the combo tabs above (two-way sync: if selected services match a combo exactly, that tab highlights)

**Dependency map:**
- Ordering/Booking → requires Website
- SEO & Google → requires Website
- Domain → requires Website
- Retainer → requires Website
- Website → standalone (no dependencies)

### Status Bar

Single bar below the grid showing:
- **Left:** Matched combo name (e.g., "That's our Get Customers combo") or "Custom Build" if no exact match
- **Right:** Upsell nudge (e.g., "Add SEO to complete Get Found — and save even more"). No dollar amounts in nudges — prices stay off the site entirely.

If no services selected, status bar shows: "Pick what you need — or choose a combo above."

### Closest Combo Matching

When selected services don't match a combo exactly, find the smallest combo that contains all selected services and suggest it. Example: Website + Domain selected → suggest Get Found ("Add SEO to complete Get Found — and save even more").

---

## Section 2: Lead Capture Form

### Trigger

Form is hidden by default. Slides in below the status bar when at least one service is toggled on.

### Fields

| Field | Type | Placeholder |
|-------|------|-------------|
| Name | text | Your name |
| Contact | text | Instagram handle or email |

Two fields only. No phone, no business name, no CAPTCHA.

### Submit Button

Label: **"Get My Custom Quote"**

### Confirmation

Inline success message replaces the form after submission:

> "Got it! I'll reach out within 12 hours with your custom quote."

### Submission Data

Each submission captures:
- Name
- Contact (IG handle or email)
- Selected services (array)
- Matched combo name (or "Custom Build")
- Timestamp

Sent to Google Sheets via GAS POST endpoint + email notification to James.

---

## Section 3: Scarcity + Risk Reversal

### Scarcity Bar

**Position:** Directly above the calculator (below section title, above combo tabs).

**Copy:** "X spots left this month — I take on 5 builds max so every client gets my full attention."

James updates the number manually (or it resets monthly). Adds urgency (limited time) on top of scarcity (limited quantity).

**Style:** Clean but noticeable — not muted. Small icon or slightly bolder weight so it's felt, not whispered. Still fits the navy+gold brand.

### Risk Reversal

**Position:** Below the lead capture form — the last thing before the next section.

**Copy:** "Don't love it — you owe nothing. I build first. You decide after."

**Style:** Gold accent text, slightly larger — this is the closer.

---

## Section 4: "What We Build" Section

**Decision: Remove entirely.**

The calculator's service card grid now serves as the interactive services showcase. Keeping a separate "What We Build" section above would be redundant — clients would see services listed twice.

---

## Section 5: Mobile Behavior

| Element | Desktop | Mobile (< 768px) |
|---------|---------|-------------------|
| Combo tabs | 4 tabs in one row | Horizontal scroll strip (swipeable) |
| Service cards | 2x3 grid | Single column stack (full-width) |
| Status bar | Inline below grid | Sticky at bottom of viewport |
| Lead capture form | Below status bar | Full-width below sticky status bar |
| Scarcity bar | Centered text | Centered text, slightly smaller |
| Risk reversal | Centered text | Centered text |

---

## Section 6: GAS Backend

Same pattern as existing FJMedia client sites:

1. Google Sheet: "FJMedia — Calculator Submissions"
   - Columns: Timestamp | Name | Contact | Services | Combo Match
2. GAS web app (doPost):
   - Receives POST from calculator form
   - Appends row to sheet
   - Sends email notification to James
3. Form POSTs via fetch to GAS URL (no CORS issues — iframe pattern not needed for simple POST)

---

## Pricing (Internal Only — NOT on the site)

### A La Carte (anchor prices)

| Service | Price |
|---------|-------|
| Custom Website | $400 |
| Ordering / Booking | $300 |
| SEO & Google Setup | $250 |
| Domain Setup | $150 |
| Monthly Retainer (Maintain) | $150/mo |
| Monthly Retainer (Grow) | $300/mo |

### Combos

| Combo | A La Carte Total | Combo Price | Savings |
|-------|-----------------|-------------|---------|
| Get Online | $400 | $200 | $200 (50%) |
| Get Found | $800 | $550 | $250 (31%) |
| Get Customers | $1,100 | $750 | $350 (32%) |
| Own the Market | $1,550 | $1,100 | $450 (29%) |

None of these prices appear on the site. They exist in the Sales Call Guide for James to use on calls.

---

## Hormozi Elements Preserved

| Element | Where |
|---------|-------|
| Grand Slam Offer value stack | Sales call (internal — Sales Call Guide) |
| Risk reversal | On-page, below lead form |
| Scarcity | On-page, above calculator |
| ROI math | Sales call (internal — Sales Call Guide) |
| Combo savings psychology | Calculator interaction (combo vs a la carte match) |
| Ascension ladder | Upsell nudges in status bar + sales call tier suggestions |

---

## What Gets Removed

From the current `#pricing` section in `index.html`:
- ROI statistics block
- Scarcity bar (replaced by new one above calculator)
- Guarantee line (replaced by risk reversal below form)
- 4 pricing cards with public prices
- Pricing dots (mobile carousel navigation)
- Retainer add-on bar
- "What We Build" services section (above pricing)

---

## Related Files

- `FJDMedia Website/index.html` — Target file for implementation
- `FJDMedia Website/Sales Call Guide.md` — Internal pricing + sales playbook
- `.superpowers/brainstorm/829-1775433301/content/service-menu-v3.html` — Approved visual mockup
- `Memory/pricing_overhaul_brainstorm.md` — Brainstorm session decisions log
