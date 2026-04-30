from playwright.sync_api import sync_playwright
from pathlib import Path

HERE = Path(__file__).parent
HTML = HERE / "service-packages.html"

RENDERS = [
    (None,                 "FJMedia-Packages.pdf"),          # blank template
    ("Red Pine Bakery",    "FJMedia-Packages-MOCK.pdf"),     # mock preview
]

source = HTML.read_text(encoding="utf-8")

def variant(source: str, client: str | None) -> str:
    if client is None:
        return source
    return source.replace(
        'Prepared for: __________________',
        f'Prepared for: <span style="color:#C9A84C;font-weight:700;letter-spacing:.06em;">{client}</span>',
    )

with sync_playwright() as p:
    browser = p.chromium.launch()
    for client, outname in RENDERS:
        html = variant(source, client)
        tmp = HERE / f".__render__{outname}.html"
        tmp.write_text(html, encoding="utf-8")
        page = browser.new_page()
        page.goto(tmp.as_uri(), wait_until="networkidle")
        page.wait_for_timeout(600)
        page.pdf(
            path=str(HERE / outname),
            format="Letter",
            print_background=True,
            margin={"top":"0","right":"0","bottom":"0","left":"0"},
            prefer_css_page_size=True,
        )
        page.close()
        tmp.unlink()
        print(f"rendered -> {outname}")
    browser.close()
