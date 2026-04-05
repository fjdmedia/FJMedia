"""
Day 5 — Process Carousel (navy/gold — FJMedia brand)
Revised structure: all 6 items on slide 1, price comparison slide 2, difference slide 3, CTA slide 4.
"""
from pathlib import Path

fonts = '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>'

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
.heading{font-family:"Syne",sans-serif;font-weight:800;font-size:28px;color:#EDEAE5;line-height:1.15;margin-bottom:8px;}
.heading em{color:#c9a84c;font-style:normal;}
.sub{font-family:"DM Sans",sans-serif;font-size:10px;color:rgba(237,234,229,0.4);line-height:1.5;margin-bottom:14px;}
.divider{width:32px;height:1px;background:#c9a84c;opacity:0.4;margin-bottom:14px;}
.byline{position:absolute;bottom:22px;right:36px;font-family:"DM Sans",sans-serif;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:rgba(201,168,76,0.25);z-index:2;}
.slide-num{position:absolute;bottom:22px;left:36px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.1em;color:rgba(201,168,76,0.2);z-index:2;}
.hint{margin-top:20px;font-family:sans-serif;font-size:12px;color:#444;text-align:center;}
"""

# ── SLIDE 1: All 6 items ───────────────────────────────────
s1 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.steps{{display:flex;flex-direction:column;gap:7px;}}
.step{{display:flex;align-items:center;gap:14px;padding:7px 12px;border-left:1px solid rgba(201,168,76,0.2);}}
.step-num{{font-family:"Space Mono",monospace;font-size:10px;color:#c9a84c;flex-shrink:0;width:20px;opacity:.7;}}
.step-label{{font-family:"DM Sans",sans-serif;font-weight:600;font-size:10.5px;color:#EDEAE5;flex-shrink:0;min-width:90px;}}
.step-desc{{font-family:"DM Sans",sans-serif;font-size:9.5px;color:rgba(237,234,229,0.4);line-height:1.4;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="inner">
    <div class="eyebrow">What You're Actually Paying For</div>
    <div class="heading">6 things go into<br>every <em>website.</em></div>
    <div class="sub">Most agencies bill you for all of this upfront. Here's what they charge for.</div>
    <div class="divider"></div>
    <div class="steps">
      <div class="step"><div class="step-num">01</div><div class="step-label">Strategy</div><div class="step-desc">Who you're targeting and what you want them to do</div></div>
      <div class="step"><div class="step-num">02</div><div class="step-label">Design</div><div class="step-desc">Layout, colours, fonts, and brand feel</div></div>
      <div class="step"><div class="step-num">03</div><div class="step-label">Copy</div><div class="step-desc">Every word on the page, written to convert</div></div>
      <div class="step"><div class="step-num">04</div><div class="step-label">Development</div><div class="step-desc">Fast, mobile-ready, works on every device</div></div>
      <div class="step"><div class="step-num">05</div><div class="step-label">SEO</div><div class="step-desc">Set up so Google can actually find you</div></div>
      <div class="step"><div class="step-num">06</div><div class="step-label">Backend</div><div class="step-desc">Forms, email notifications, booking logic</div></div>
    </div>
  </div>
  <div class="byline">By FJMedia</div>
  <div class="slide-num">1 / 4</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 2: Price comparison ──────────────────────────────
s2 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.compare{{display:flex;gap:16px;margin-top:4px;}}
.col{{flex:1;display:flex;flex-direction:column;gap:0;}}
.col-label{{font-family:"DM Sans",sans-serif;font-weight:500;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid;}}
.col-label.them{{color:rgba(237,234,229,0.3);border-color:rgba(237,234,229,0.1);}}
.col-label.us{{color:#c9a84c;border-color:rgba(201,168,76,0.3);}}
.price-big{{font-family:"Syne",sans-serif;font-weight:800;font-size:48px;line-height:1;margin-bottom:6px;}}
.price-big.them{{color:rgba(237,234,229,0.25);}}
.price-big.us{{color:#c9a84c;}}
.price-sub{{font-family:"DM Sans",sans-serif;font-size:9px;color:rgba(237,234,229,0.35);line-height:1.5;margin-bottom:14px;}}
.price-sub.us{{color:rgba(201,168,76,0.6);}}
.pill{{display:inline-block;font-family:"DM Sans",sans-serif;font-size:8px;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;}}
.pill.them{{border:1px solid rgba(237,234,229,0.1);color:rgba(237,234,229,0.25);}}
.pill.us{{border:1px solid rgba(201,168,76,0.3);color:#c9a84c;}}
.row-items{{display:flex;flex-direction:column;gap:5px;}}
.row-item{{font-family:"DM Sans",sans-serif;font-size:9px;line-height:1.4;display:flex;align-items:center;gap:6px;}}
.row-item.them{{color:rgba(237,234,229,0.25);}}
.row-item.us{{color:rgba(237,234,229,0.6);}}
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
    <div class="heading">What others charge.<br><em>What we charge.</em></div>
    <div class="divider"></div>
    <div class="compare">
      <div class="col">
        <div class="col-label them">Other Agencies</div>
        <div class="price-big them">$5K+</div>
        <div class="price-sub them">Paid upfront.<br>Before you see a single page.</div>
        <div class="pill them">2–3 month timeline</div>
        <br/>
        <div class="row-items">
          <div class="row-item them">Large retainer to start</div>
          <div class="row-item them">Multiple revisions billed</div>
          <div class="row-item them">You wait, then pay</div>
        </div>
      </div>
      <div class="vs"></div>
      <div class="col">
        <div class="col-label us">FJMedia</div>
        <div class="price-big us">$0</div>
        <div class="price-sub us">Upfront. We build first.<br>You pay after you love it.</div>
        <div class="pill us">5 day delivery</div>
        <br/>
        <div class="row-items">
          <div class="row-item us">No cost until approved</div>
          <div class="row-item us">All 6 components included</div>
          <div class="row-item us">You see it, then decide</div>
        </div>
      </div>
    </div>
  </div>
  <div class="byline">By FJMedia</div>
  <div class="slide-num">2 / 4</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 3: Built different ───────────────────────────────
s3 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.cards{{display:flex;flex-direction:column;gap:12px;}}
.card{{display:flex;align-items:center;gap:20px;padding:14px 16px;border:1px solid rgba(201,168,76,0.12);background:rgba(201,168,76,0.03);}}
.card-num{{font-family:"Space Mono",monospace;font-size:24px;font-weight:700;color:#c9a84c;line-height:1;flex-shrink:0;width:44px;}}
.card-label{{font-family:"DM Sans",sans-serif;font-weight:600;font-size:11px;color:#EDEAE5;margin-bottom:3px;}}
.card-sub{{font-family:"DM Sans",sans-serif;font-size:9.5px;color:rgba(237,234,229,0.4);line-height:1.4;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="inner">
    <div class="eyebrow">How FJMedia Does It</div>
    <div class="heading">Built different.<br><em>Charged different.</em></div>
    <div class="sub">Three things no other agency in Winnipeg offers together.</div>
    <div class="divider"></div>
    <div class="cards">
      <div class="card">
        <div class="card-num">5</div>
        <div><div class="card-label">Days to deliver</div><div class="card-sub">Strategy to live site in one week — not 2 months</div></div>
      </div>
      <div class="card">
        <div class="card-num">$0</div>
        <div><div class="card-label">Upfront cost</div><div class="card-sub">We build it first. You pay only when you love it.</div></div>
      </div>
      <div class="card">
        <div class="card-num">1</div>
        <div><div class="card-label">Point of contact</div><div class="card-sub">No agencies, no handoffs, no surprises</div></div>
      </div>
    </div>
  </div>
  <div class="byline">By FJMedia</div>
  <div class="slide-num">3 / 4</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 4: CTA ───────────────────────────────────────────
s4 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.center{{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;height:100%;justify-content:center;}}
.logo-mark{{font-family:"Space Mono",monospace;font-size:24px;color:#c9a84c;letter-spacing:-0.01em;margin-bottom:6px;}}
.logo-word{{font-family:"Syne",sans-serif;font-weight:800;font-size:11px;color:#EDEAE5;letter-spacing:.22em;text-transform:uppercase;margin-bottom:36px;}}
.big-heading{{font-family:"Syne",sans-serif;font-weight:800;font-size:28px;color:#EDEAE5;line-height:1.2;margin-bottom:8px;}}
.big-heading em{{color:#c9a84c;font-style:normal;}}
.sub{{font-family:"DM Sans",sans-serif;font-size:10px;color:rgba(237,234,229,0.4);letter-spacing:.14em;text-transform:uppercase;margin-bottom:32px;}}
.divider{{width:40px;height:1px;background:#c9a84c;opacity:0.4;margin-bottom:32px;}}
.cta-box{{border:1px solid rgba(201,168,76,0.3);padding:14px 40px;margin-bottom:14px;}}
.cta-label{{font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(237,234,229,0.35);margin-bottom:6px;}}
.cta-word{{font-family:"Space Mono",monospace;font-weight:700;font-size:18px;letter-spacing:.04em;color:#c9a84c;}}
.cta-sub{{font-family:"DM Sans",sans-serif;font-size:10px;color:rgba(237,234,229,0.3);letter-spacing:.1em;}}
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
    <div class="big-heading">You need all <em>6.</em><br>We handle them.</div>
    <div class="sub">Built in 5 days &middot; Pay only if you love it</div>
    <div class="divider"></div>
    <div class="cta-box">
      <div class="cta-label">DM us the word</div>
      <div class="cta-word">"FREE Webby"</div>
    </div>
    <div class="cta-sub">Restaurants &middot; Detailing &middot; Photography &middot; Events</div>
  </div>
  <div class="logo">fjmedia &middot; winnipeg</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

out = Path(__file__).parent
(out / "ig_post_day5_slide1_hook.html").write_text(s1, encoding="utf-8")
(out / "ig_post_day5_slide2_compare.html").write_text(s2, encoding="utf-8")
(out / "ig_post_day5_slide3_difference.html").write_text(s3, encoding="utf-8")
(out / "ig_post_day5_slide4_cta.html").write_text(s4, encoding="utf-8")
print("All 4 Day 5 HTML files written.")
