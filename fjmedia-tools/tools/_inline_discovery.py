"""
One-shot: build a fully self-contained, offline-ready discovery.html.

Reads:  discovery.html  +  ../assets/style.css
Fetches: Google Fonts CSS + each woff2 file
Writes: discovery-offline.html  (single file, ~600-800KB, no internet needed)
"""
import base64
import re
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
SRC_HTML = HERE / "discovery.html"
SRC_CSS = HERE.parent / "assets" / "style.css"
OUT_HTML = HERE / "discovery-offline.html"

FONTS_CSS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Plus+Jakarta+Sans:wght@700;800"
    "&family=Space+Mono"
    "&family=DM+Sans:wght@200;300;400"
    "&display=swap"
)

# Google Fonts serves woff2 only when UA looks modern
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"


def fetch(url: str, binary: bool = False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
    return data if binary else data.decode("utf-8")


def inline_fonts(css: str) -> str:
    """Replace every url(https://...woff2) with a base64 data URI."""
    seen: dict[str, str] = {}

    def repl(match: re.Match) -> str:
        url = match.group(1)
        if url not in seen:
            print(f"  - downloading {url.rsplit('/', 1)[-1]}")
            woff2 = fetch(url, binary=True)
            b64 = base64.b64encode(woff2).decode("ascii")
            seen[url] = f"data:font/woff2;base64,{b64}"
        return f"url({seen[url]})"

    return re.sub(r"url\((https://[^)]+\.woff2)\)", repl, css)


def main() -> None:
    print("Reading source files...")
    html = SRC_HTML.read_text(encoding="utf-8")
    site_css = SRC_CSS.read_text(encoding="utf-8")

    print("Fetching Google Fonts CSS...")
    fonts_css = fetch(FONTS_CSS_URL)

    print("Inlining font binaries (this is the slow part)...")
    fonts_css_inlined = inline_fonts(fonts_css)

    # Strip the three Google Fonts <link> tags + the external stylesheet <link>
    # and replace with one inline <style> block containing both.
    combined_style = (
        "<style>\n/* === Google Fonts (inlined as base64) === */\n"
        + fonts_css_inlined
        + "\n/* === site stylesheet (inlined) === */\n"
        + site_css
        + "\n</style>"
    )

    # Remove the two preconnect lines, the Google Fonts stylesheet line,
    # and the local stylesheet line. Replace the local one with the combined block.
    html = re.sub(
        r'\s*<link rel="preconnect" href="https://fonts\.googleapis\.com"\s*/?>',
        "",
        html,
    )
    html = re.sub(
        r'\s*<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin\s*/?>',
        "",
        html,
    )
    html = re.sub(
        r'\s*<link href="https://fonts\.googleapis\.com/css2[^"]+" rel="stylesheet"\s*/?>',
        "",
        html,
    )
    html = re.sub(
        r'<link rel="stylesheet" href="\.\./assets/style\.css"\s*/?>',
        combined_style,
        html,
    )

    OUT_HTML.write_text(html, encoding="utf-8")
    size_kb = OUT_HTML.stat().st_size / 1024
    print(f"\nDone. Wrote {OUT_HTML.name} ({size_kb:,.1f} KB)")
    print("Open it offline -> Ctrl+P -> Save as PDF.")


if __name__ == "__main__":
    main()
