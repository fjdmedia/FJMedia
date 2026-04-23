# © 2026 FJMedia. All rights reserved.
"""
render_slides.py — Day 12 Before/After Carousel
Renders all 4 slides to HQ PNG (device_scale_factor=4 → 2160x2160).
Usage: python render_slides.py
"""

from pathlib import Path
from playwright.sync_api import sync_playwright

SLIDES = [
    "slide_1.html",
    "slide_2.html",
    "slide_3.html",
    "slide_4.html",
]

def render_all():
    here = Path(__file__).parent

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 540, "height": 540},
            device_scale_factor=4,
        )

        for filename in SLIDES:
            html_path = here / filename
            if not html_path.exists():
                print(f"SKIP: {filename} not found")
                continue

            out_path = here / (html_path.stem + ".png")
            page.goto(html_path.resolve().as_uri())
            page.wait_for_load_state("networkidle")
            page.wait_for_function("document.fonts.ready")
            page.wait_for_timeout(1000)

            el = page.query_selector(".post")
            if not el:
                print(f"SKIP: no .post element in {filename}")
                continue

            el.screenshot(path=str(out_path))
            print(f"OK: {out_path.name} (2160x2160)")

        browser.close()
    print("Done.")

if __name__ == "__main__":
    render_all()
