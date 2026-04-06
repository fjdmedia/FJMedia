"""
Day 5 — Offer Carousel (navy/gold — FJMedia brand)
Updated 2026-04-05: new service menu model, updated pricing, sharper Hormozi copy.
Slides: service menu hook → price compare → 3 differentiators → CTA
"""
from pathlib import Path

fonts = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>'

navy_base = """
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.post{width:540px;height:540px;background:#071520;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:44px 50px;}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px);background-size:40px 40px;}
.corner{position:absolute;width:60px;height:60px;border-color:#c9a84c;border-style:solid;opacity:0.4;}
.corner.tl{top:28px;left:28px;border-width:1px 0 0 1px;}
.corner.br{bottom:28px;right:28px;border-width:0 1px 1px 0;}
.inner{position:relative;z-index:2;display:flex;flex-direction:column;height:100%;}
.eyebrow{font-family:"DM Sans",sans-serif;font-weight:500;font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:#c9a84c;margin-bottom:10px;}
.heading{font-family:"Plus Jakarta Sans",sans-serif;font-weight:800;font-size:28px;color:#EDEAE5;line-height:1.15;margin-bottom:8px;}
.heading em{color:#c9a84c;font-style:normal;}
.sub{font-family:"DM Sans",sans-serif;font-size:11px;color:rgba(237,234,229,0.55);line-height:1.5;margin-bottom:14px;}
.divider{width:32px;height:1px;background:#c9a84c;opacity:0.4;margin-bottom:14px;}
.byline{position:absolute;bottom:22px;right:36px;font-family:"DM Sans",sans-serif;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:rgba(201,168,76,0.25);z-index:2;}
.slide-num{position:absolute;bottom:22px;left:36px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.1em;color:rgba(201,168,76,0.2);z-index:2;}
.hint{margin-top:20px;font-family:sans-serif;font-size:12px;color:#444;text-align:center;}
"""

# ── SLIDE 1: Service menu hook ─────────────────────────────────
s1 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.menu{{display:flex;flex-direction:column;gap:8px;}}
.menu-row{{display:flex;align-items:center;gap:12px;padding:9px 14px;border:1px solid rgba(201,168,76,0.14);background:rgba(201,168,76,0.03);border-radius:4px;}}
.check{{font-family:"Space Mono",monospace;font-size:10px;color:#c9a84c;flex-shrink:0;width:16px;}}
.menu-label{{font-family:"DM Sans",sans-serif;font-weight:600;font-size:12px;color:#EDEAE5;flex:1;}}
.menu-tag{{font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:rgba(201,168,76,0.55);white-space:nowrap;}}
.menu-row.plus{{border-color:rgba(201,168,76,0.08);background:transparent;}}
.menu-row.plus .check{{color:rgba(201,168,76,0.3);}}
.menu-row.plus .menu-label{{color:rgba(237,234,229,0.4);}}
.menu-row.plus .menu-tag{{color:rgba(201,168,76,0.3);}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="inner">
    <div class="eyebrow">Winnipeg Web Design · FJMedia</div>
    <div class="heading">Pick only what<br>you <em>actually need.</em></div>
    <div class="sub">Most agencies lock you into packages starting at $3,000. We don't.</div>
    <div class="divider"></div>
    <div class="menu">
      <div class="menu-row"><div class="check">✓</div><div class="menu-label">Custom Website</div><div class="menu-tag">Always included</div></div>
      <div class="menu-row"><div class="check">✓</div><div class="menu-label">SEO &amp; Google Setup</div><div class="menu-tag">Get found</div></div>
      <div class="menu-row"><div class="check">✓</div><div class="menu-label">Ordering &amp; Booking System</div><div class="menu-tag">Capture revenue</div></div>
      <div class="menu-row"><div class="check">✓</div><div class="menu-label">Domain Setup</div><div class="menu-tag">Bring yours or we grab one</div></div>
      <div class="menu-row plus"><div class="check">+</div><div class="menu-label">Monthly Retainer</div><div class="menu-tag">Keep growing</div></div>
    </div>
  </div>
  <div class="byline">By FJMedia</div>
  <div class="slide-num">1 / 4</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 2: Price comparison ──────────────────────────────────
s2 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.compare{{display:flex;gap:16px;margin-top:4px;}}
.col{{flex:1;display:flex;flex-direction:column;gap:0;}}
.col-label{{font-family:"DM Sans",sans-serif;font-weight:500;font-size:9px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid;}}
.col-label.them{{color:rgba(237,234,229,0.4);border-color:rgba(237,234,229,0.12);}}
.col-label.us{{color:#c9a84c;border-color:rgba(201,168,76,0.3);}}
.price-big{{font-family:"Syne",sans-serif;font-weight:800;font-size:42px;line-height:1;margin-bottom:6px;}}
.price-big.them{{color:rgba(237,234,229,0.3);text-decoration:line-through;text-decoration-color:rgba(237,234,229,0.15);}}
.price-big.us{{color:#c9a84c;}}
.price-sub{{font-family:"DM Sans",sans-serif;font-size:10px;color:rgba(237,234,229,0.5);line-height:1.5;margin-bottom:14px;}}
.price-sub.us{{color:rgba(201,168,76,0.7);}}
.pill{{display:inline-block;font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;}}
.pill.them{{border:1px solid rgba(237,234,229,0.15);color:rgba(237,234,229,0.35);}}
.pill.us{{border:1px solid rgba(201,168,76,0.3);color:#c9a84c;}}
.row-items{{display:flex;flex-direction:column;gap:7px;margin-top:12px;}}
.row-item{{font-family:"DM Sans",sans-serif;font-size:10.5px;line-height:1.4;display:flex;align-items:center;gap:6px;}}
.row-item.them{{color:rgba(237,234,229,0.35);}}
.row-item.us{{color:rgba(237,234,229,0.78);}}
.row-item::before{{content:"";width:4px;height:4px;border-radius:50%;flex-shrink:0;}}
.row-item.them::before{{background:rgba(237,234,229,0.15);}}
.row-item.us::before{{background:#c9a84c;}}
.vs{{width:1px;background:rgba(201,168,76,0.12);align-self:stretch;margin:0 4px;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="inner">
    <div class="eyebrow">The Honest Comparison</div>
    <div class="heading">What they charge.<br><em>What we charge.</em></div>
    <div class="divider"></div>
    <div class="compare">
      <div class="col">
        <div class="col-label them">Other Agencies</div>
        <div class="price-big them">$5K+</div>
        <div class="price-sub them">Paid upfront.<br>Before you see a thing.</div>
        <div class="pill them">6–10 week timeline</div>
        <div class="row-items">
          <div class="row-item them">Large deposit to start</div>
          <div class="row-item them">Cookie-cutter templates</div>
          <div class="row-item them">You wait. Then you pay.</div>
        </div>
      </div>
      <div class="vs"></div>
      <div class="col">
        <div class="col-label us">FJMedia</div>
        <div class="price-big us">$0</div>
        <div class="price-sub us">Upfront. We build first.<br>You pay after you love it.</div>
        <div class="pill us">5 day delivery</div>
        <div class="row-items">
          <div class="row-item us">No cost until you approve</div>
          <div class="row-item us">100% custom, hand-coded</div>
          <div class="row-item us">You see it. Then decide.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="byline">By FJMedia</div>
  <div class="slide-num">2 / 4</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 3: 3 differentiator numbers ─────────────────────────
s3 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.cards{{display:flex;flex-direction:column;gap:14px;}}
.card{{display:flex;align-items:center;gap:20px;padding:14px 18px;border:1px solid rgba(201,168,76,0.14);background:rgba(201,168,76,0.03);}}
.card-num{{font-family:"Syne",sans-serif;font-size:26px;font-weight:800;color:#c9a84c;line-height:1;flex-shrink:0;width:90px;}}
.card-body{{display:flex;flex-direction:column;gap:3px;}}
.card-label{{font-family:"DM Sans",sans-serif;font-weight:700;font-size:13px;color:#EDEAE5;}}
.card-sub{{font-family:"DM Sans",sans-serif;font-size:11px;color:rgba(237,234,229,0.5);line-height:1.4;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="inner">
    <div class="eyebrow">Why FJMedia · Winnipeg</div>
    <div class="heading">Three numbers.<br><em>That's the difference.</em></div>
    <div class="sub">No other agency in Winnipeg offers all three.</div>
    <div class="divider"></div>
    <div class="cards">
      <div class="card">
        <div class="card-num">5</div>
        <div class="card-body"><div class="card-label">Days to go live</div><div class="card-sub">First message to live site — not 6 weeks</div></div>
      </div>
      <div class="card">
        <div class="card-num">$0</div>
        <div class="card-body"><div class="card-label">Upfront cost</div><div class="card-sub">We build it first. You pay only if you love it.</div></div>
      </div>
      <div class="card">
        <div class="card-num">$200</div>
        <div class="card-body"><div class="card-label">Where we start</div><div class="card-sub">Not $3,000. Pick only what your business needs.</div></div>
      </div>
    </div>
  </div>
  <div class="byline">By FJMedia</div>
  <div class="slide-num">3 / 4</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 4: CTA ───────────────────────────────────────────────
s4 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.center{{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;height:100%;justify-content:center;}}
.logo-mark{{font-family:"Space Mono",monospace;font-size:24px;color:#c9a84c;letter-spacing:-0.01em;margin-bottom:6px;}}
.logo-word{{font-family:"Syne",sans-serif;font-weight:800;font-size:11px;color:#EDEAE5;letter-spacing:.22em;text-transform:uppercase;margin-bottom:28px;}}
.big-heading{{font-family:"Plus Jakarta Sans",sans-serif;font-weight:800;font-size:27px;color:#EDEAE5;line-height:1.2;margin-bottom:6px;}}
.big-heading em{{color:#c9a84c;font-style:normal;}}
.sub{{font-family:"DM Sans",sans-serif;font-size:11px;color:rgba(237,234,229,0.5);letter-spacing:.1em;margin-bottom:24px;}}
.divider{{width:40px;height:1px;background:#c9a84c;opacity:0.4;margin-bottom:24px;}}
.cta-box{{border:1px solid rgba(201,168,76,0.3);padding:14px 40px;margin-bottom:12px;}}
.cta-label{{font-family:"DM Sans",sans-serif;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(237,234,229,0.45);margin-bottom:6px;}}
.cta-word{{font-family:"Space Mono",monospace;font-weight:700;font-size:18px;letter-spacing:.04em;color:#c9a84c;}}
.cta-sub{{font-family:"DM Sans",sans-serif;font-size:10.5px;color:rgba(237,234,229,0.4);}}
.logo{{position:absolute;bottom:28px;left:0;right:0;text-align:center;font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(201,168,76,0.25);z-index:2;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="center">
    <div class="logo-mark">{{FJ}}</div>
    <div class="logo-word">FJMedia</div>
    <div class="big-heading">Built in 5 days.<br><em>Yours, if you love it.</em></div>
    <div class="sub">5 spots per month · 4 left this month</div>
    <div class="divider"></div>
    <div class="cta-box">
      <div class="cta-label">DM us the word</div>
      <div class="cta-word">"FREE Webby"</div>
    </div>
    <div class="cta-sub">Bakeries &middot; Detailing &middot; Photography &middot; Events</div>
  </div>
  <div class="logo">fjmedia · winnipeg</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

out = Path(__file__).parent
(out / "ig_post_day5_slide1_hook.html").write_text(s1, encoding="utf-8")
(out / "ig_post_day5_slide2_compare.html").write_text(s2, encoding="utf-8")
(out / "ig_post_day5_slide3_difference.html").write_text(s3, encoding="utf-8")
(out / "ig_post_day5_slide4_cta.html").write_text(s4, encoding="utf-8")
print("All 4 Day 5 HTML files written.")
