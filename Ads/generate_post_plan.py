"""
generate_post_plan.py
---------------------
Generates FJMedia 30-Day Instagram Post Plan PDF.
Run: python generate_post_plan.py
Output: IG_Post_Plan.pdf
"""

from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUT = Path(__file__).parent / "30 Day Plan" / "IG_Post_Plan.pdf"

# ── Colours ──────────────────────────────────────────────────────────────────
NAVY      = colors.HexColor("#071520")
NAVY2     = colors.HexColor("#0d1f3c")
GOLD      = colors.HexColor("#c9a84c")
CREAM     = colors.HexColor("#EDEAE5")
DIM       = colors.HexColor("#3a6080")
WHITE     = colors.white
LIGHT_ROW = colors.HexColor("#f5f3ef")

# ── Styles ────────────────────────────────────────────────────────────────────
TITLE = ParagraphStyle("title",
    fontName="Helvetica-Bold", fontSize=22, textColor=CREAM,
    alignment=TA_CENTER, spaceAfter=4)

SUBTITLE = ParagraphStyle("subtitle",
    fontName="Helvetica", fontSize=11, textColor=GOLD,
    alignment=TA_CENTER, spaceAfter=2)

DATE_STYLE = ParagraphStyle("date",
    fontName="Helvetica", fontSize=9, textColor=DIM,
    alignment=TA_CENTER, spaceAfter=16)

SECTION = ParagraphStyle("section",
    fontName="Helvetica-Bold", fontSize=12, textColor=GOLD,
    spaceBefore=18, spaceAfter=8)

BODY = ParagraphStyle("body",
    fontName="Helvetica", fontSize=9, textColor=NAVY,
    leading=14, spaceAfter=4)

BODY_BOLD = ParagraphStyle("body_bold",
    fontName="Helvetica-Bold", fontSize=9, textColor=NAVY,
    leading=14, spaceAfter=4)

CELL = ParagraphStyle("cell",
    fontName="Helvetica", fontSize=8.5, textColor=NAVY, leading=12)

CELL_BOLD = ParagraphStyle("cell_bold",
    fontName="Helvetica-Bold", fontSize=8.5, textColor=NAVY, leading=12)

CAPTION_STEP = ParagraphStyle("caption_step",
    fontName="Helvetica-Bold", fontSize=9, textColor=GOLD, leading=13)

CAPTION_DESC = ParagraphStyle("caption_desc",
    fontName="Helvetica", fontSize=9, textColor=NAVY, leading=13, spaceAfter=6)

# ── Data ─────────────────────────────────────────────────────────────────────
CALENDAR = [
    (1,  "Launch Post",        'GSO graphic -- "We build your website for free."',             "Navy GSO graphic (ig_post_launch.png)"),
    (3,  "Client Reveal",      "Sugar & Shai -- order system angle",                           "Sugar & Shai branded card (ig_post_day3_sugar_shai.png)"),
    (5,  "Process Carousel",   "What goes into a Winnipeg small business website",             "Carousel -- 5-7 slides"),
    (8,  "Client Reveal",      "Royal Kings Auto Care -- booking form angle",                  "Royal Kings branded card"),
    (10, "Value Post",         "Why your website isn't getting you customers",                 "Single graphic or carousel"),
    (12, "Social Proof",       "Real client approval screenshot",                              "Screenshot mockup graphic"),
    (15, "Client Reveal",      "Linda Quach -- visual/photography angle",                      "Linda Quach branded card"),
    (17, "Offer Post",         "Local business carousel -- who this is for",                   "Carousel -- target avatar"),
    (19, "Behind the Scenes",  "Screen record of a build -- show the process",                 "Video or GIF clip"),
    (22, "Client Reveal",      "Diego & Andrea -- event site / $300 package angle",            "Diego & Andrea branded card"),
    (24, "FAQ Post",           "How does the no-upfront-cost model work?",                     "Single graphic or carousel"),
    (26, "Wedding Social",     "Target event planners + engaged couples",                      "Carousel -- wedding social template"),
    (28, "Direct CTA",         "Scarcity + DM call-to-action",                                "Bold CTA graphic"),
    (30, "Month Recap",        "Month 1 wrap -- what was built, who was helped",               "Grid recap graphic"),
]

CAPTION_FORMULA = [
    ("1. Hook",    'First line -- the only thing they see before "more". Make them stop scrolling.'),
    ("2. Story",   "2-3 lines of proof, context, or a before/after. Real and specific."),
    ("3. CTA",     'One clear ask. "DM me [word]" or "Link in bio to book a call."'),
]

HASHTAGS = [
    "#winnipeg", "#winnipegbusiness", "#winnipegsmallbusiness",
    "#webdesign", "#localwinnipeg", "#smallbusiness",
    "#websitedesign", "#fjmedia",
]

CONTENT_TYPES = [
    ("Client Reveal",       "Show a real client's brand + what was built. Use their fonts/colors."),
    ("Value Post",          "Teach something useful. Positions you as the expert."),
    ("Process Carousel",    "Pull back the curtain. Show how a build works step by step."),
    ("Social Proof",        "Screenshots, approvals, DMs. Real beats polished every time."),
    ("Behind the Scenes",   "Screen recordings, WIP shots. Makes it feel human."),
    ("Offer Post",          "Lead with the GSO. Reinforce the no-upfront-cost model."),
    ("Direct CTA",          "Ask directly. DM me. Book a call. Scarcity if applicable."),
    ("Recap",               "Monthly wrap. Shows momentum. Builds trust over time."),
]

# ── Build PDF ─────────────────────────────────────────────────────────────────
def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.65*inch,
        rightMargin=0.65*inch,
        topMargin=0.5*inch,
        bottomMargin=0.6*inch,
    )

    story = []

    # ── Header block ──────────────────────────────────────────────────────────
    header_data = [[
        Paragraph("FJMedia", TITLE),
        Paragraph("30-Day Instagram Post Plan", SUBTITLE),
        Paragraph("April 2026  ·  @fjmediawpg", DATE_STYLE),
    ]]
    header_table = Table(header_data, colWidths=[7.2*inch])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("TOPPADDING",    (0,0), (-1,-1), 16),
        ("BOTTOMPADDING", (0,0), (-1,-1), 16),
        ("LEFTPADDING",   (0,0), (-1,-1), 20),
        ("RIGHTPADDING",  (0,0), (-1,-1), 20),
        ("ROUNDEDCORNERS", [6]),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 16))

    # ── Grand Slam Offer reminder ─────────────────────────────────────────────
    gso_data = [[
        Paragraph('<b>Grand Slam Offer:</b>  "We build your website for free."', BODY_BOLD),
        Paragraph('"Your website, built in 5 days. Pay only if you like it."', BODY),
    ]]
    gso_table = Table(gso_data, colWidths=[3.55*inch, 3.55*inch])
    gso_table.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), LIGHT_ROW),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("LINEABOVE",     (0,0), (-1,0), 2, GOLD),
    ]))
    story.append(gso_table)
    story.append(Spacer(1, 18))

    # ── 30-Day Calendar ───────────────────────────────────────────────────────
    story.append(Paragraph("30-Day Content Calendar", SECTION))

    col_headers = [
        Paragraph("DAY",     CELL_BOLD),
        Paragraph("TYPE",    CELL_BOLD),
        Paragraph("CONTENT", CELL_BOLD),
        Paragraph("ASSET",   CELL_BOLD),
    ]
    rows = [col_headers]
    for i, (day, ptype, content, asset) in enumerate(CALENDAR):
        bg = LIGHT_ROW if i % 2 == 0 else WHITE
        rows.append([
            Paragraph(str(day), CELL_BOLD),
            Paragraph(ptype,    CELL_BOLD),
            Paragraph(content,  CELL),
            Paragraph(asset,    CELL),
        ])

    cal_table = Table(rows, colWidths=[0.45*inch, 1.1*inch, 3.1*inch, 2.45*inch],
                      repeatRows=1)
    cal_table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND",    (0,0), (-1,0), NAVY2),
        ("TEXTCOLOR",     (0,0), (-1,0), GOLD),
        ("FONTNAME",      (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE",      (0,0), (-1,0), 8),
        ("TOPPADDING",    (0,0), (-1,0), 8),
        ("BOTTOMPADDING", (0,0), (-1,0), 8),
        # Data rows
        ("TOPPADDING",    (0,1), (-1,-1), 7),
        ("BOTTOMPADDING", (0,1), (-1,-1), 7),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("ROWBACKGROUNDS",(0,1), (-1,-1), [LIGHT_ROW, WHITE]),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, colors.HexColor("#ddd8d0")),
        ("BOX",           (0,0), (-1,-1), 1, colors.HexColor("#ccc8c0")),
    ]))
    story.append(cal_table)
    story.append(Spacer(1, 20))

    # ── Caption Formula ───────────────────────────────────────────────────────
    story.append(Paragraph("Caption Formula", SECTION))

    for step, desc in CAPTION_FORMULA:
        story.append(Paragraph(step, CAPTION_STEP))
        story.append(Paragraph(desc, CAPTION_DESC))

    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Default hashtags:</b>  " + "  ".join(HASHTAGS), BODY))
    story.append(Spacer(1, 20))

    # ── Content Type Guide ────────────────────────────────────────────────────
    story.append(Paragraph("Content Type Guide", SECTION))

    ct_rows = []
    for ctype, desc in CONTENT_TYPES:
        ct_rows.append([
            Paragraph(ctype, CELL_BOLD),
            Paragraph(desc,  CELL),
        ])

    ct_table = Table(ct_rows, colWidths=[1.5*inch, 5.7*inch])
    ct_table.setStyle(TableStyle([
        ("TOPPADDING",    (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("ROWBACKGROUNDS",(0,0), (-1,-1), [LIGHT_ROW, WHITE]),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, colors.HexColor("#ddd8d0")),
        ("BOX",           (0,0), (-1,-1), 1, colors.HexColor("#ccc8c0")),
        ("TEXTCOLOR",     (0,0), (0,-1),  NAVY2),
    ]))
    story.append(ct_table)
    story.append(Spacer(1, 20))

    # ── Workflow reminder ─────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=GOLD, spaceAfter=12))
    story.append(Paragraph(
        "<b>Post Graphic Workflow:</b>  Build HTML in Ads/ → "
        "run <i>render_ig_post.py [filename.html]</i> → "
        "1080×1080 HD PNG ready to post.", BODY))

    doc.build(story)
    print(f"Saved: {OUT}")

if __name__ == "__main__":
    build()
