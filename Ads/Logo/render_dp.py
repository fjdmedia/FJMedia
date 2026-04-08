from playwright.sync_api import sync_playwright
from pathlib import Path

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1200, 'height': 1200})
    html_path = Path(__file__).parent / 'ig_dp.html'
    page.goto('file:///' + str(html_path.resolve()).replace('\\', '/'))
    page.wait_for_timeout(1500)
    el = page.query_selector('#dp')
    el.screenshot(path=str(Path(__file__).parent / 'ig_dp_1080.png'))
    browser.close()
    print('Exported ig_dp_1080.png (1080x1080)')
