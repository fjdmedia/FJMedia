# © 2026 FJMedia. All rights reserved.
"""
render_slide.py — Day 14 Offer Post
Renders slide.html to 2160x2160 PNG (540x540 viewport x device_scale_factor 4).
Usage: python render_slide.py
"""

from pathlib import Path
from playwright.sync_api import sync_playwright


def render():
    here = Path(__file__).parent
    html_path = here / "slide.html"
    out_path = here / "slide.png"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 540, "height": 540},
            device_scale_factor=4,
        )
        page.goto(html_path.resolve().as_uri())
        page.wait_for_load_state("networkidle")
        page.wait_for_function("document.fonts.ready")
        page.wait_for_timeout(1000)

        el = page.query_selector(".post")
        if not el:
            print("SKIP: no .post element in slide.html")
            return
        el.screenshot(path=str(out_path))
        print(f"OK: {out_path.name} (2160x2160)")
        browser.close()


if __name__ == "__main__":
    render()
