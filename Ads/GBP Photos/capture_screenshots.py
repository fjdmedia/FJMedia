"""
Captures screenshots for Google Business Profile upload.
"""
from playwright.sync_api import sync_playwright
import time, os

OUT = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/GBP Photos"

LOGO_HTML = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/Logo/fjmedia_logo_v2.html"

SHOTS = [
    {
        "name": "01_FJMedia_Logo.png",
        "url": f"file:///{LOGO_HTML.replace(chr(92), '/')}",
        "width": 800,
        "height": 800,
        "wait": 1500,
        "selector": ".logo-card:first-of-type",
    },
    {
        "name": "02_FJMedia_Agency_Site.png",
        "url": "https://fjdmedia.github.io/FJMedia/",
        "width": 1440,
        "height": 900,
        "wait": 3000,
        "clip": None,
    },
    {
        "name": "03_SugarAndShai_Client_Site.png",
        "url": "https://sugarandshaicookies.com",
        "width": 1440,
        "height": 900,
        "wait": 3000,
        "clip": None,
    },
    {
        "name": "04_RoyalKings_Client_Site.png",
        "url": "https://fjdmedia.github.io/royal-kings-auto-care/",
        "width": 1440,
        "height": 900,
        "wait": 3000,
        "clip": None,
    },
]

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for shot in SHOTS:
            print(f"Capturing {shot['name']}...")
            page = browser.new_page(viewport={"width": shot["width"], "height": shot["height"]})
            page.goto(shot["url"])
            page.wait_for_timeout(shot["wait"])
            path = os.path.join(OUT, shot["name"])
            page.screenshot(path=path, full_page=False)
            print(f"  Saved: {path}")
        browser.close()
    print("\nAll screenshots saved to GBP Photos folder.")

if __name__ == "__main__":
    capture()
