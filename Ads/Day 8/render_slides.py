"""
render_slides.py — Day 8 Sugar & Shai Carousel
Renders all 4 slides to 1080x1350 PNG (4:5 Instagram format).
Usage: python render_slides.py
"""

from pathlib import Path
from playwright.sync_api import sync_playwright

SLIDES = [
    "slide1_hook.html",
    "slide2_proof.html",
    "slide3_differentiator.html",
    "slide4_cta.html",
]

def render_all():
    here = Path(__file__).parent

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # device_scale_factor=2: CSS 540x675 -> 1080x1350 native pixels
        page = browser.new_page(
            viewport={"width": 1200, "height": 900},
            device_scale_factor=2,
        )

        for filename in SLIDES:
            html_path = here / filename
            if not html_path.exists():
                print(f"SKIP: {filename} not found")
                continue

            out_path = here / (html_path.stem + ".png")
            page.goto(html_path.resolve().as_uri())
            page.wait_for_timeout(2000)  # fonts + rendering

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
