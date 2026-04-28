"""Convert gold-on-black JPG logo to transparent-bg PNGs (full / icon / wordmark)."""
from PIL import Image, ImageEnhance
import numpy as np
import os

SRC = r"C:\Users\diazc\OneDrive\Desktop\FJDMedia\Websites\Gold Prime Renovations\assets\Images\Info&Context\Logo.jpg"
OUT_DIR = os.path.dirname(SRC)
LOW, HIGH, SCALE = 14, 76, 4


def remove_black_bg(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGB"), dtype=np.float32)
    brightness = arr.max(axis=2)
    alpha = np.clip((brightness - LOW) / (HIGH - LOW) * 255.0, 0, 255).astype(np.uint8)
    rgba = np.dstack([arr.astype(np.uint8), alpha])
    return Image.fromarray(rgba, mode="RGBA")


def trim_transparent(img: Image.Image, padding: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    l = max(0, l - padding); t = max(0, t - padding)
    r = min(img.width, r + padding); b = min(img.height, b + padding)
    return img.crop((l, t, r, b))


def boost(img: Image.Image, sat=1.18, bright=1.07) -> Image.Image:
    r, g, b, a = img.split()
    rgb = Image.merge("RGB", (r, g, b))
    rgb = ImageEnhance.Color(rgb).enhance(sat)
    rgb = ImageEnhance.Brightness(rgb).enhance(bright)
    r2, g2, b2 = rgb.split()
    return Image.merge("RGBA", (r2, g2, b2, a))


def main():
    src = Image.open(SRC)
    src = src.resize((src.width * SCALE, src.height * SCALE), Image.LANCZOS)

    full = remove_black_bg(src)
    full = boost(full)
    full = trim_transparent(full, padding=32)
    full.save(os.path.join(OUT_DIR, "Logo.png"), optimize=True)
    print("FULL :", full.size)

    w, h = full.size
    icon = trim_transparent(full.crop((0, 0, w, int(h * 0.46))), padding=20)
    icon.save(os.path.join(OUT_DIR, "Logo-icon.png"), optimize=True)
    print("ICON :", icon.size)

    wm = trim_transparent(full.crop((0, int(h * 0.44), w, h)), padding=20)
    wm.save(os.path.join(OUT_DIR, "Logo-wordmark.png"), optimize=True)
    print("WORD :", wm.size)


if __name__ == "__main__":
    main()
