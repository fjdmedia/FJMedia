import base64
from pathlib import Path

def b64(path):
    return base64.b64encode(Path(path).read_bytes()).decode()

ads = Path(__file__).parent
prizes_b64 = b64(ads / "temp_prizes.png")
mobile_b64 = b64(ads / "temp_mobile.png")

fonts = '<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>'

# ── SLIDE 2: Prize Showcase ──
s2 = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>__FONTS__
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.post{width:540px;height:540px;background:#F7F3EE;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;padding:0 36px 0 32px;}
.mockup-wrap{width:220px;flex-shrink:0;}
.mockup-card{width:210px;background:#fff;box-shadow:4px 6px 24px rgba(0,0,0,0.13);transform:rotate(-3deg);overflow:hidden;}
.browser-bar{background:#EBEBEB;padding:6px 8px;display:flex;align-items:center;gap:4px;}
.dot{width:6px;height:6px;border-radius:50%;}
.dot.r{background:#FF5F57;}.dot.y{background:#FEBC2E;}.dot.g{background:#28C840;}
.url-bar{flex:1;background:#fff;border-radius:3px;height:10px;margin-left:6px;}
.mockup-img{width:100%;display:block;height:250px;object-fit:cover;object-position:top center;}
.content{flex:1;padding-left:28px;display:flex;flex-direction:column;}
.eyebrow{font-family:"DM Sans",sans-serif;font-weight:500;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#6B2D1A;margin-bottom:10px;}
.heading{font-family:"Great Vibes",cursive;font-size:48px;color:#1A0F08;line-height:1;margin-bottom:6px;}
.sub{font-family:"DM Sans",sans-serif;font-weight:500;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#1A0F08;margin-bottom:16px;}
.divider{width:32px;height:1px;background:#6B2D1A;opacity:.4;margin-bottom:16px;}
.section-label{font-family:"DM Sans",sans-serif;font-weight:500;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:#7A6A5A;margin-bottom:10px;}
.prizes-list{list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:18px;}
.prizes-list li{font-family:"DM Sans",sans-serif;font-size:10px;color:#3D2B1A;display:flex;align-items:flex-start;gap:7px;line-height:1.4;}
.prizes-list li::before{content:"\\25AA";color:#6B2D1A;font-size:8px;margin-top:2px;flex-shrink:0;}
.highlight{font-family:"Cormorant Garamond",serif;font-size:13px;font-weight:600;color:#6B2D1A;letter-spacing:.04em;}
.byline{position:absolute;bottom:20px;right:28px;font-family:"DM Sans",sans-serif;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:rgba(107,45,26,0.35);}
.hint{margin-top:20px;font-family:sans-serif;font-size:12px;color:#444;text-align:center;}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="mockup-wrap"><div class="mockup-card">
    <div class="browser-bar"><div class="dot r"></div><div class="dot y"></div><div class="dot g"></div><div class="url-bar"></div></div>
    <img class="mockup-img" src="data:image/png;base64,__PRIZES__" alt="Prize gallery"/>
  </div></div>
  <div class="content">
    <div class="eyebrow">The Prizes</div>
    <div class="heading">35+ Prizes</div>
    <div class="sub">All displayed online</div>
    <div class="divider"></div>
    <div class="section-label">Prize Highlights</div>
    <ul class="prizes-list">
      <li>PS5, iPad, AirPods Pro</li>
      <li>Kayak, Scooter, Bikes</li>
      <li>Dyson, Ninja, Apple Watch</li>
      <li class="highlight">$1,000 WestJet Golden Ticket</li>
    </ul>
  </div>
  <div class="byline">By FJMedia</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

s2 = s2.replace("__FONTS__", fonts).replace("__PRIZES__", prizes_b64)
(ads / "ig_post_day3_slide2_prizes.html").write_text(s2, encoding="utf-8")
print("Slide 2 written")

# ── SLIDE 3: Mobile ──
s3 = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>__FONTS__
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.post{width:540px;height:540px;background:#F7F3EE;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;padding:0 36px 0 40px;}
.phone-wrap{flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.phone{width:156px;height:310px;background:#1A1A1A;border-radius:28px;padding:10px 8px;box-shadow:0 8px 32px rgba(0,0,0,0.25);position:relative;}
.phone::before{content:"";position:absolute;top:14px;left:50%;transform:translateX(-50%);width:40px;height:5px;background:#333;border-radius:3px;z-index:2;}
.phone-screen{width:100%;height:100%;border-radius:20px;overflow:hidden;}
.phone-screen img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block;}
.content{flex:1;padding-left:30px;display:flex;flex-direction:column;}
.eyebrow{font-family:"DM Sans",sans-serif;font-weight:500;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#6B2D1A;margin-bottom:10px;}
.heading{font-family:"Great Vibes",cursive;font-size:44px;color:#1A0F08;line-height:1.1;margin-bottom:6px;}
.sub{font-family:"DM Sans",sans-serif;font-weight:500;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#1A0F08;margin-bottom:16px;}
.divider{width:32px;height:1px;background:#6B2D1A;opacity:.4;margin-bottom:16px;}
.section-label{font-family:"DM Sans",sans-serif;font-weight:500;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:#7A6A5A;margin-bottom:10px;}
.bullets{list-style:none;display:flex;flex-direction:column;gap:7px;}
.bullets li{font-family:"DM Sans",sans-serif;font-size:10px;color:#3D2B1A;display:flex;align-items:flex-start;gap:7px;line-height:1.4;}
.bullets li::before{content:"\\25AA";color:#6B2D1A;font-size:8px;margin-top:2px;flex-shrink:0;}
.byline{position:absolute;bottom:20px;right:28px;font-family:"DM Sans",sans-serif;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:rgba(107,45,26,0.35);}
.hint{margin-top:20px;font-family:sans-serif;font-size:12px;color:#444;text-align:center;}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="phone-wrap"><div class="phone"><div class="phone-screen">
    <img src="data:image/png;base64,__MOBILE__" alt="Mobile view"/>
  </div></div></div>
  <div class="content">
    <div class="eyebrow">Mobile Ready</div>
    <div class="heading">Works on Every Device</div>
    <div class="sub">Built for guests</div>
    <div class="divider"></div>
    <div class="section-label">What guests can do</div>
    <ul class="bullets">
      <li>Browse all 35+ prizes</li>
      <li>View event details instantly</li>
      <li>Share the link with friends</li>
      <li>Get tickets via Facebook DM</li>
    </ul>
  </div>
  <div class="byline">By FJMedia</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

s3 = s3.replace("__FONTS__", fonts).replace("__MOBILE__", mobile_b64)
(ads / "ig_post_day3_slide3_mobile.html").write_text(s3, encoding="utf-8")
print("Slide 3 written")

# ── SLIDE 4: CTA ──
s4 = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>__FONTS__
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.post{width:540px;height:540px;background:#071520;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px;}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px);background-size:40px 40px;}
.corner{position:absolute;width:60px;height:60px;border-color:#c9a84c;border-style:solid;opacity:0.4;}
.corner.tl{top:28px;left:28px;border-width:1px 0 0 1px;}
.corner.br{bottom:28px;right:28px;border-width:0 1px 1px 0;}
.content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;}
.eyebrow{font-family:"DM Sans",sans-serif;font-weight:500;font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#c9a84c;margin-bottom:16px;}
.heading{font-family:"Great Vibes",cursive;font-size:62px;color:#EDEAE5;line-height:1;margin-bottom:8px;}
.sub{font-family:"DM Sans",sans-serif;font-size:10px;color:rgba(237,234,229,0.45);letter-spacing:.14em;text-transform:uppercase;margin-bottom:32px;}
.divider{width:40px;height:1px;background:#c9a84c;opacity:0.4;margin-bottom:32px;}
.cta-box{border:1px solid rgba(201,168,76,0.3);padding:14px 36px;margin-bottom:14px;}
.cta-label{font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(237,234,229,0.4);margin-bottom:6px;}
.cta-word{font-family:"DM Sans",sans-serif;font-weight:500;font-size:20px;letter-spacing:.06em;color:#c9a84c;}
.cta-sub{font-family:"DM Sans",sans-serif;font-size:10px;color:rgba(237,234,229,0.35);letter-spacing:.1em;}
.logo{position:absolute;bottom:28px;left:0;right:0;text-align:center;font-family:"DM Sans",sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(201,168,76,0.3);z-index:2;}
.hint{margin-top:20px;font-family:sans-serif;font-size:12px;color:#444;text-align:center;}
</style></head><body>
<div style="display:flex;flex-direction:column;align-items:center;">
<div class="post">
  <div class="grid"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>
  <div class="content">
    <div class="eyebrow">Planning an event?</div>
    <div class="heading">We got you.</div>
    <div class="sub">Built in 5 days &middot; Pay only if you love it</div>
    <div class="divider"></div>
    <div class="cta-box">
      <div class="cta-label">DM us the word</div>
      <div class="cta-word">"FREE Webby"</div>
    </div>
    <div class="cta-sub">Wedding socials &middot; Events &middot; Small business</div>
  </div>
  <div class="logo">fjmedia &middot; winnipeg</div>
</div>
<p class="hint">Rendered at 1080x1080 via Playwright</p>
</div></body></html>"""

s4 = s4.replace("__FONTS__", fonts)
(ads / "ig_post_day3_slide4_cta.html").write_text(s4, encoding="utf-8")
print("Slide 4 written")
print("All done.")
