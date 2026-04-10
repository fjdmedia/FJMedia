"""
render_slides.py — Sugar & Shai Client Reveal
Renders all 5 slides to 1080x1350 PNG (4:5 Instagram portrait).
Screenshot at 1x — CSS is already 1080x1350, no scale factor needed.
Usage: python render_slides.py
"""

from pathlib import Path
from playwright.sync_api import sync_playwright

SLIDES = [
    "slide-1.html",
    "slide-2.html",
    "slide-3.html",
    "slide-4.html",
    "slide-5.html",
]

def render_all():
    here = Path(__file__).parent

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1200, "height": 1500},
            device_scale_factor=1,
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
            page.wait_for_timeout(1000)  # extra buffer for font render

            el = page.query_selector(".post")
            if not el:
                print(f"SKIP: no .post element in {filename}")
                continue

            el.screenshot(path=str(out_path))
            print(f"OK: {out_path.name} (1080x1350)")

        browser.close()
    print("Done.")

if __name__ == "__main__":
    render_all()
