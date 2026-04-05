"""
Regenerates Logo/main/Main.png at HD resolution (was 506x319).
"""
from playwright.sync_api import sync_playwright
import os

HTML = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/Logo/fjmedia_logo_v2.html"
OUT  = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/Logo/main/Main.png"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 600}, device_scale_factor=2)
    page.goto(f"file:///{HTML.replace(chr(92), '/')}")
    page.wait_for_timeout(1500)
    el = page.query_selector(".canvas-dark")
    el.screenshot(path=OUT)
    browser.close()

from PIL import Image
img = Image.open(OUT)
print(f"Main.png updated: {img.size[0]}x{img.size[1]}")
