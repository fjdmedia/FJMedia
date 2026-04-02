"""
render_ig_post.py
-----------------
Renders any FJMedia IG post HTML file to a 1080x1080 PNG.

Usage:
    python render_ig_post.py ig_post_launch.html
    python render_ig_post.py ig_post_day3_sugar_shai.html

Output: same filename with .png extension in the same folder.
"""

import sys
import os
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

def render(html_filename: str):
    ads_dir = Path(__file__).parent
    html_path = ads_dir / html_filename
    out_name = Path(html_filename).stem + ".png"
    out_path = ads_dir / "30 Day Plan" / out_name

    if not html_path.exists():
        print(f"File not found: {html_path}")
        sys.exit(1)

    file_url = html_path.resolve().as_uri()

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # device_scale_factor=2 renders at 2x — .post is 540px CSS → 1080px native pixels
        page = browser.new_page(viewport={"width": 1200, "height": 900}, device_scale_factor=2)
        page.goto(file_url)
        # Wait for fonts (Google Fonts)
        page.wait_for_timeout(1500)

        # Screenshot just the .post element — natively 1080x1080 at 2x scale
        element = page.query_selector(".post")
        if not element:
            print("No .post element found in HTML.")
            browser.close()
            sys.exit(1)

        element.screenshot(path=str(out_path))
        browser.close()

    print(f"Saved: {out_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python render_ig_post.py <filename.html>")
        sys.exit(1)
    render(sys.argv[1])
