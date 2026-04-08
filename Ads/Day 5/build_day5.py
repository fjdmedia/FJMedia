"""
Day 5 — Offer Carousel (navy/gold — FJMedia brand)
Updated 2026-04-06: all slides rebuilt to match slide 4 (CTA) style — centered, clean, consistent.
"""
from pathlib import Path
import base64

shai_logo_b64 = base64.b64encode(
    open('C:/Users/diazc/OneDrive/Desktop/FJDMedia/Websites/Sugar and Shai Cookies/Logo.jpg','rb').read()
).decode()

fonts = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=Great+Vibes&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>'

navy_base = """
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.post{width:540px;height:540px;background:#071520;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:44px 50px;}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px);background-size:40px 40px;}
.corner{position:absolute;width:60px;height:60px;border-color:#c9a84c;border-style:solid;opacity:0.4;}
.corner.tl{top:28px;left:28px;border-width:1px 0 0 1px;}
.corner.br{bottom:28px;right:28px;border-width:0 1px 1px 0;}
.center{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;height:100%;justify-content:center;}
.logo-mark{font-family:"Space Mono",monospace;font-size:24px;color:#c9a84c;letter-spacing:-0.01em;margin-bottom:6px;}
.logo-word{font-family:"Syne",sans-serif;font-weight:800;font-size:11px;color:#EDEAE5;letter-spacing:.22em;text-transform:uppercase;margin-bottom:28px;}
.big-heading{font-family:"Plus Jakarta Sans",sans-serif;font-weight:800;font-size:27px;color:#EDEAE5;line-height:1.2;margin-bottom:6px;}
.big-heading em{color:#c9a84c;font-style:normal;}
.sub{font-family:"DM Sans",sans-serif;font-size:11px;color:rgba(237,234,229,0.5);letter-spacing:.08em;margin-bottom:24px;}
.divider{width:40px;height:1px;background:#c9a84c;opacity:0.4;margin-bottom:24px;}
.cta-box{border:1px solid rgba(201,168,76,0.3);padding:14px 40px;margin-bottom:12px;}
.cta-label{font-family:"DM Sans",sans-serif;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(237,234,229,0.45);margin-bottom:6px;}
.cta-word{font-family:"Space Mono",monospace;font-weight:700;font-size:18px;letter-spacing:.04em;color:#c9a84c;}
.cta-sub{font-family:"DM Sans",sans-serif;font-size:10.5px;color:rgba(237,234,229,0.4);}
.logo{position:absolute;bottom:28px;left:0;right:0;text-align:center;font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(201,168,76,0.25);z-index:2;}
.hint{margin-top:20px;font-family:sans-serif;font-size:12px;color:#444;text-align:center;}
"""

# ── SLIDE 1: Social proof ──────────────────────────────────────
s1 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.client-box{{padding:12px 24px;margin-bottom:10px;width:100%;}}
/* Sugar and Shai — warm cream, blush pink border, rose script */
.client-box.shai{{background:#FDF6EE;border:1px solid #F2C4CE;}}
.shai .client-name{{font-family:"Great Vibes",cursive;font-size:24px;color:#D4849A;margin-bottom:2px;line-height:1.2;}}
.shai .client-niche{{font-family:"DM Sans",sans-serif;font-size:9px;color:#8B5E52;letter-spacing:.12em;text-transform:uppercase;}}
/* Diego & Andrea — scrapbook cream, burgundy border, deep brown script */
.client-box.diego{{background:#F8F7F3;border:1px solid rgba(107,45,26,0.35);border-left:3px solid #6B2D1A;}}
.diego .client-name{{font-family:"Great Vibes",cursive;font-size:24px;color:#6B2D1A;margin-bottom:2px;line-height:1.2;}}
.diego .client-niche{{font-family:"Cormorant Garamond",serif;font-size:10px;color:rgba(26,15,8,0.5);letter-spacing:.14em;text-transform:uppercase;font-style:italic;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="center">
    <div class="logo-mark">{{FJ}}</div>
    <div class="logo-word">FJMedia</div>
    <div class="big-heading">Our first <em>2 clients</em><br>in Winnipeg.</div>
    <div class="sub">Both paid $0 upfront.</div>
    <div class="divider"></div>
    <div class="client-box shai" style="display:flex;align-items:center;gap:14px;">
      <img src="data:image/jpeg;base64,{shai_logo_b64}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0;"/>
      <div>
        <div class="client-name">Sugar and Shai Cookies</div>
        <div class="client-niche">Bakery &middot; sugarandshaicookies.com</div>
      </div>
    </div>
    <div class="client-box diego">
      <div class="client-name">Diego &amp; Andrea</div>
      <div class="client-niche">Wedding Social &middot; live site</div>
    </div>
    <div class="cta-sub" style="margin-top:16px;">More in the pipeline — yours could be next.</div>
  </div>
  <div class="logo">fjmedia &middot; winnipeg</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 2: Price comparison ──────────────────────────────────
s2 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.compare{{display:flex;gap:12px;width:100%;}}
.col{{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;}}
.col-label{{font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid;width:100%;}}
.col-label.them{{color:rgba(237,234,229,0.35);border-color:rgba(237,234,229,0.12);}}
.col-label.us{{color:#c9a84c;border-color:rgba(201,168,76,0.3);}}
.price-big{{font-family:"Syne",sans-serif;font-weight:800;font-size:46px;line-height:1;margin-bottom:4px;}}
.price-big.them{{color:rgba(237,234,229,0.25);text-decoration:line-through;text-decoration-color:rgba(237,234,229,0.12);}}
.price-big.us{{color:#c9a84c;}}
.price-sub{{font-family:"DM Sans",sans-serif;font-size:10px;line-height:1.5;margin-bottom:12px;}}
.price-sub.them{{color:rgba(237,234,229,0.4);}}
.price-sub.us{{color:rgba(201,168,76,0.65);}}
.pill{{font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;margin-bottom:10px;display:inline-block;}}
.pill.them{{border:1px solid rgba(237,234,229,0.15);color:rgba(237,234,229,0.35);}}
.pill.us{{border:1px solid rgba(201,168,76,0.3);color:#c9a84c;}}
.point{{font-family:"DM Sans",sans-serif;font-size:10px;margin-bottom:5px;}}
.point.them{{color:rgba(237,234,229,0.35);}}
.point.us{{color:rgba(237,234,229,0.7);}}
.vs-line{{width:1px;background:rgba(201,168,76,0.1);align-self:stretch;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="center">
    <div class="logo-mark">{{FJ}}</div>
    <div class="logo-word">FJMedia</div>
    <div class="big-heading">What they charge.<br><em>What we charge.</em></div>
    <div class="divider"></div>
    <div class="compare">
      <div class="col">
        <div class="col-label them">Other Agencies</div>
        <div class="price-big them">$5K+</div>
        <div class="price-sub them">Upfront.<br>Before you see a thing.</div>
        <div class="pill them">6–10 weeks</div>
        <div class="point them">Deposit to start</div>
        <div class="point them">Templates</div>
        <div class="point them">You wait. You pay.</div>
      </div>
      <div class="vs-line"></div>
      <div class="col">
        <div class="col-label us">FJMedia</div>
        <div class="price-big us">$0</div>
        <div class="price-sub us">Upfront.<br>Build first, pay after.</div>
        <div class="pill us">5 days</div>
        <div class="point us">No cost til you approve</div>
        <div class="point us">100% custom</div>
        <div class="point us">You see it. You decide.</div>
      </div>
    </div>
  </div>
  <div class="logo">fjmedia &middot; winnipeg</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 3: 3 differentiators ─────────────────────────────────
s3 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}
.stat-row{{display:flex;align-items:center;border:1px solid rgba(201,168,76,0.2);padding:12px 20px;margin-bottom:10px;width:100%;gap:16px;}}
.stat-num{{font-family:"Syne",sans-serif;font-weight:800;font-size:28px;color:#c9a84c;line-height:1;flex-shrink:0;width:70px;text-align:right;}}
.stat-divider{{width:1px;height:28px;background:rgba(201,168,76,0.2);flex-shrink:0;}}
.stat-body{{display:flex;flex-direction:column;gap:2px;text-align:left;}}
.stat-label{{font-family:"DM Sans",sans-serif;font-weight:700;font-size:12px;color:#EDEAE5;}}
.stat-sub{{font-family:"DM Sans",sans-serif;font-size:10px;color:rgba(237,234,229,0.45);line-height:1.4;}}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="center">
    <div class="logo-mark">{{FJ}}</div>
    <div class="logo-word">FJMedia</div>
    <div class="big-heading">Three numbers.<br><em>That's the difference.</em></div>
    <div class="divider"></div>
    <div class="stat-row">
      <div class="stat-num">2</div>
      <div class="stat-divider"></div>
      <div class="stat-body"><div class="stat-label">Winnipeg clients live</div><div class="stat-sub">A cookie shop and a wedding social</div></div>
    </div>
    <div class="stat-row">
      <div class="stat-num">$0</div>
      <div class="stat-divider"></div>
      <div class="stat-body"><div class="stat-label">Upfront cost</div><div class="stat-sub">They paid after they loved it.</div></div>
    </div>
    <div class="stat-row">
      <div class="stat-num">5</div>
      <div class="stat-divider"></div>
      <div class="stat-body"><div class="stat-label">Days to go live</div><div class="stat-sub">First message to live site.</div></div>
    </div>
  </div>
  <div class="logo">fjmedia &middot; winnipeg</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

# ── SLIDE 4: CTA ───────────────────────────────────────────────
s4 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>{fonts}
<style>{navy_base}</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="center">
    <div class="logo-mark">{{FJ}}</div>
    <div class="logo-word">FJMedia</div>
    <div class="big-heading">Built in 5 days.<br><em>Yours, if you love it.</em></div>
    <div class="sub">5 spots per month &middot; 3 left this month</div>
    <div class="divider"></div>
    <div class="cta-box">
      <div class="cta-label">DM us the word</div>
      <div class="cta-word">"FREE Webby"</div>
    </div>
    <div class="cta-sub">Bakeries &middot; Detailing &middot; Photography &middot; Events</div>
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
