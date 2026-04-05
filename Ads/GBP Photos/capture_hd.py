"""
Regenerates all GBP photos at HD resolution (2x device scale factor).
Logo: 1600x800 clean centered card
Site screenshots: 2560x1600
"""
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import os

OUT  = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/GBP Photos"
HTML = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/Logo/fjmedia_logo_v2.html"

NAVY  = (7, 21, 32)
GOLD  = (201, 168, 76)
WHITE = (255, 255, 255)

def add_badge(img):
    w, h    = img.size
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw    = ImageDraw.Draw(overlay)

    text      = "Built by FJMedia"
    font_size = max(28, h // 50)
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", font_size)
    except:
        font = ImageFont.load_default()

    prefix    = "{FJ} "
    full_text = prefix + text
    full_bbox = draw.textbbox((0, 0), full_text, font=font)
    tw, th    = full_bbox[2] - full_bbox[0], full_bbox[3] - full_bbox[1]

    pad_x    = int(w * 0.012)
    pad_y    = int(h * 0.012)
    margin_r = int(w * 0.025)
    margin_b = int(h * 0.025)

    badge_w = tw + pad_x * 2
    badge_h = th + pad_y * 2
    bx = w - badge_w - margin_r
    by = h - badge_h - margin_b
    bw = bx + badge_w
    bh = by + badge_h
    radius = badge_h // 2

    draw.rounded_rectangle([bx, by, bw, bh], radius=radius, fill=(*NAVY, 220))

    prefix_bbox = draw.textbbox((0, 0), prefix, font=font)
    pw = prefix_bbox[2] - prefix_bbox[0]
    tx = bx + pad_x
    ty = by + pad_y

    draw.text((tx, ty),      prefix, font=font, fill=(*GOLD,  255))
    draw.text((tx + pw, ty), text,   font=font, fill=(*WHITE, 255))

    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ── 01 Logo — clean HD card ───────────────────────────────────────────────
    print("Capturing logo...")
    page = browser.new_page(viewport={"width": 1200, "height": 600}, device_scale_factor=2)
    page.goto(f"file:///{HTML.replace(chr(92), '/')}")
    page.wait_for_timeout(1500)
    el = page.query_selector(".canvas-dark")
    el.screenshot(path=os.path.join(OUT, "01_FJMedia_Logo.png"))
    print(f"  Logo saved.")

    # ── 02 Agency site ────────────────────────────────────────────────────────
    print("Capturing agency site...")
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
    page.goto("https://fjdmedia.github.io/FJMedia/")
    page.wait_for_timeout(3500)
    page.screenshot(path=os.path.join(OUT, "02_FJMedia_Agency_Site.png"), full_page=False)
    print(f"  Agency site saved.")

    # ── 03 Sugar and Shai ─────────────────────────────────────────────────────
    print("Capturing Sugar and Shai...")
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
    page.goto("https://sugarandshaicookies.com")
    page.wait_for_timeout(3500)
    raw = page.screenshot(full_page=False)
    img = Image.frombytes("RGB", page.viewport_size.values(), raw) if False else None
    page.screenshot(path=os.path.join(OUT, "_tmp_sugar.png"), full_page=False)
    img = Image.open(os.path.join(OUT, "_tmp_sugar.png")).convert("RGBA")
    img = add_badge(img)
    img.save(os.path.join(OUT, "03_SugarAndShai_Client_Site.png"))
    os.remove(os.path.join(OUT, "_tmp_sugar.png"))
    print(f"  Sugar and Shai saved.")

    # ── 04 Royal Kings ────────────────────────────────────────────────────────
    print("Capturing Royal Kings...")
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
    page.goto("https://fjdmedia.github.io/royal-kings-auto-care/")
    page.wait_for_timeout(3500)
    page.screenshot(path=os.path.join(OUT, "_tmp_rk.png"), full_page=False)
    img = Image.open(os.path.join(OUT, "_tmp_rk.png")).convert("RGBA")
    img = add_badge(img)
    img.save(os.path.join(OUT, "04_RoyalKings_Client_Site.png"))
    os.remove(os.path.join(OUT, "_tmp_rk.png"))
    print(f"  Royal Kings saved.")

    browser.close()

# Verify sizes
print("\n-- Final sizes --")
for f in sorted(os.listdir(OUT)):
    if f.endswith(".png") and not f.startswith("_"):
        img = Image.open(os.path.join(OUT, f))
        print(f"  {f}: {img.size[0]}x{img.size[1]}")
