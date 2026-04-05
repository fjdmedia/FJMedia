from PIL import Image, ImageDraw, ImageFont
import os

OUT = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/GBP Photos"

FILES = [
    "03_SugarAndShai_Client_Site.png",
    "04_RoyalKings_Client_Site.png",
]

NAVY = (7, 21, 32)
GOLD = (201, 168, 76)
WHITE = (255, 255, 255)

def add_badge(filename):
    path = os.path.join(OUT, filename)
    img  = Image.open(path).convert("RGBA")
    w, h = img.size

    # Create overlay layer
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Badge dimensions
    text = "Built by FJMedia"
    font_size = max(14, h // 45)

    try:
        font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", font_size)
    except:
        font = ImageFont.load_default()

    bbox     = draw.textbbox((0, 0), text, font=font)
    tw, th   = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = 16, 10
    margin   = 18

    bx = w - tw - pad_x * 2 - margin
    by = h - th - pad_y * 2 - margin
    bw = w - margin
    bh = h - margin
    radius = (bh - by) // 2

    # Draw navy pill with slight transparency
    draw.rounded_rectangle([bx, by, bw, bh], radius=radius, fill=(*NAVY, 220))

    # Gold {FJ} prefix + white text
    prefix     = "{FJ} "
    prefix_bbox = draw.textbbox((0, 0), prefix, font=font)
    pw         = prefix_bbox[2] - prefix_bbox[0]

    tx = bx + pad_x
    ty = by + pad_y

    draw.text((tx, ty), prefix, font=font, fill=(*GOLD, 255))
    draw.text((tx + pw, ty), text.replace("{FJ} ", ""), font=font, fill=(*WHITE, 255))

    # Composite
    result = Image.alpha_composite(img, overlay).convert("RGB")
    result.save(path)
    print(f"Watermarked: {filename}")

for f in FILES:
    add_badge(f)

print("Done.")
