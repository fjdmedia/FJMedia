from playwright.sync_api import sync_playwright
import os

OUT  = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/GBP Photos/01_FJMedia_Logo.png"
HTML = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/Logo/fjmedia_logo_v2.html"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 960, "height": 800})
    page.goto(f"file:///{HTML.replace(chr(92), '/')}")
    page.wait_for_timeout(1500)
    # Grab the first dark canvas — the primary stacked logo
    element = page.query_selector(".canvas-dark")
    element.screenshot(path=OUT)
    browser.close()

print(f"Saved: {OUT}")
