from playwright.sync_api import sync_playwright
from pathlib import Path

HERE = Path(__file__).parent
HTML = HERE / "service-overview.html"

W, H = 816, 1056

source = HTML.read_text(encoding="utf-8")
mock_html = source.replace(
    'Prepared for: __________________',
    'Prepared for: <span style="color:#C9A84C;font-weight:700;letter-spacing:.06em;">Red Pine Bakery</span>',
)
tmp = HERE / ".__qa_mock.html"
tmp.write_text(mock_html, encoding="utf-8")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
    page.goto(tmp.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(500)
    sections = page.query_selector_all("section.page")
    for idx in range(len(sections)):
        sec = sections[idx]
        sec.screenshot(path=str(HERE / f"qa-mock-page-{idx+1:02d}.png"))
        print(f"mock page {idx+1}")
    browser.close()
tmp.unlink()
