from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUTPUT = "website_service_pricing_guide.pdf"

NAVY   = colors.HexColor("#071520")
GOLD   = colors.HexColor("#c9a84c")
LIGHT  = colors.HexColor("#f5f5f5")
BORDER = colors.HexColor("#cccccc")
WHITE  = colors.white

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.75*inch,
    rightMargin=0.75*inch,
    topMargin=0.75*inch,
    bottomMargin=0.75*inch,
)

# ── Styles ───────────────────────────────────────────────────────────────
TITLE_S    = ParagraphStyle("title",    fontSize=20, fontName="Helvetica-Bold",
                             textColor=NAVY, alignment=TA_CENTER, spaceAfter=4)
SUBTITLE_S = ParagraphStyle("subtitle", fontSize=9,  fontName="Helvetica",
                             textColor=colors.HexColor("#555555"), alignment=TA_CENTER, spaceAfter=2)
AGENCY_S   = ParagraphStyle("agency",   fontSize=11, fontName="Helvetica-Bold",
                             textColor=GOLD, alignment=TA_CENTER, spaceAfter=2)
SECTION_S  = ParagraphStyle("section",  fontSize=13, fontName="Helvetica-Bold",
                             textColor=NAVY, spaceBefore=14, spaceAfter=6)
NOTE_S     = ParagraphStyle("note",     fontSize=9,  fontName="Helvetica",
                             textColor=colors.HexColor("#333333"), spaceAfter=3)
BOLD_NOTE_S= ParagraphStyle("bnote",    fontSize=9,  fontName="Helvetica-Bold",
                             textColor=NAVY, spaceAfter=4)

# Cell paragraph styles
CELL_S     = ParagraphStyle("cell",     fontSize=9,  fontName="Helvetica",
                             textColor=colors.HexColor("#222222"), leading=12)
CELL_HDR_S = ParagraphStyle("cellhdr",  fontSize=9,  fontName="Helvetica-Bold",
                             textColor=WHITE, leading=12)
CELL_FEAT_S= ParagraphStyle("cellfeat", fontSize=9,  fontName="Helvetica-Bold",
                             textColor=NAVY, leading=12)
CELL_PRICE_S=ParagraphStyle("cellprice",fontSize=9,  fontName="Helvetica-Bold",
                             textColor=GOLD, leading=12)

W = 7.0 * inch  # usable width

# ── Helpers ──────────────────────────────────────────────────────────────
def p(text, style=None):
    """Wrap text in a Paragraph so it wraps inside table cells."""
    return Paragraph(text, style or CELL_S)

def ph(text):
    return Paragraph(text, CELL_HDR_S)

def make_table(headers, rows, col_widths):
    """Two-column Service / Price table."""
    data = [[ph(h) for h in headers]]
    for row in rows:
        data.append([p(cell) for cell in row])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0),  NAVY),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, LIGHT]),
        ("GRID",          (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
    ]))
    return t

def make_package_table(col_widths):
    """Packages table with wrapped Paragraph cells."""
    headers = [ph("Package"), ph("Price"), ph("Includes")]

    rows = [
        [
            p("Get Found"),
            p("$600"),
            p("Custom 5–7 page website, hand-coded, mobile-optimized, contact form + email alerts, "
              "copy writing, on-page SEO (title, meta, OG tags), GitHub Pages hosting, 1 month free changes"),
        ],
        [
            p("Get Customers  \u2605 Most Popular", CELL_FEAT_S),
            p("$1,000", CELL_PRICE_S),
            p("Everything in Get Found + order/booking form with live pricing, Google Sheets CRM "
              "(every lead auto-logged), automated email notifications (GAS), GA4 analytics + click tracking, "
              "gallery/services section, social media links, 3 months free changes"),
        ],
        [
            p("Own the Market"),
            p("$1,600"),
            p("Everything in Get Customers + 2–3 custom design versions, auto-reply emails, "
              "reviews/testimonials section, custom domain + DNS setup, Local Business schema markup, "
              "Open Graph + social sharing optimization, 6 months managed maintenance"),
        ],
    ]

    data = [headers] + rows
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0),  NAVY),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, LIGHT]),
        ("BACKGROUND",    (0, 2), (-1, 2),  colors.HexColor("#fdf6e3")),
        ("GRID",          (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING",   (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
    ]))
    return t

# ── Story ────────────────────────────────────────────────────────────────
story = []

# Header
story.append(Paragraph("FJMedia", AGENCY_S))
story.append(Paragraph("Web Design &amp; Digital Solutions — Winnipeg, MB", SUBTITLE_S))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD))
story.append(Spacer(1, 4))
story.append(Paragraph("Web Design &amp; Development Pricing Guide", TITLE_S))
story.append(Paragraph(
    "Internal reference — industry rate benchmarks + FJMedia package pricing. "
    "Use to scope projects and set client expectations.",
    SUBTITLE_S
))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
story.append(Spacer(1, 6))

# Model note box
model_t = Table(
    [[Paragraph("<b>Our model:</b> We build the site first. The client pays only after they see it and love it. "
                "No upfront cost, no contracts. Reveal pricing only after client approves the build.", NOTE_S)]],
    colWidths=[W]
)
model_t.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), colors.HexColor("#fdf6e3")),
    ("BOX",           (0,0), (-1,-1), 1, GOLD),
    ("LEFTPADDING",   (0,0), (-1,-1), 10),
    ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ("TOPPADDING",    (0,0), (-1,-1), 7),
    ("BOTTOMPADDING", (0,0), (-1,-1), 7),
]))
story.append(model_t)
story.append(Spacer(1, 10))

# Web Design
story.append(Paragraph("Web Design &amp; Development", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["Custom website (5–7 pages)",       "$2,000 – $8,000"],
        ["Landing page (single page)",        "$500 – $2,500"],
        ["E-commerce site",                   "$3,000 – $15,000+"],
        ["Mobile responsiveness",             "$300 – $800 (add-on)"],
        ["Website redesign",                  "$1,500 – $6,000"],
        ["Speed/performance optimization",    "$300 – $1,500"],
        ["Interactive animations (GSAP / scroll effects)", "$200 – $800 (add-on)"],
    ],
    [W * 0.62, W * 0.38]
))

# SEO
story.append(Paragraph("SEO Services", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["On-page SEO setup (title, meta, schema)",      "$500 – $2,000"],
        ["Local SEO package",                            "$300 – $1,500"],
        ["Google Business Profile setup & optimization", "$200 – $600"],
        ["Monthly SEO management",                       "$500 – $3,000/mo"],
        ["Keyword research",                             "$300 – $1,000"],
        ["Technical SEO audit",                          "$500 – $2,500"],
    ],
    [W * 0.62, W * 0.38]
))

# Backend
story.append(Paragraph("Backend / Forms / Integrations", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["Contact form setup (Web3Forms/basic)",  "$150 – $400"],
        ["Google Apps Script + Sheets logging",   "$300 – $800"],
        ["Email notification system",             "$200 – $600"],
        ["Auto-reply email setup",                "$150 – $400"],
        ["CRM integration (basic)",               "$500 – $2,000"],
        ["Booking/calendar integration",          "$400 – $1,500"],
        ["Payment gateway setup",                 "$500 – $2,000"],
    ],
    [W * 0.62, W * 0.38]
))

# Analytics
story.append(Paragraph("Analytics &amp; Tracking", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["Google Analytics setup",              "$150 – $500"],
        ["Google Tag Manager setup",            "$300 – $800"],
        ["Monthly analytics report",                    "$200 – $600/mo"],
        ["Monthly 1-on-1 client sit-down (data review)","$300 – $800/mo"],
        ["Conversion tracking setup",           "$300 – $1,000"],
    ],
    [W * 0.62, W * 0.38]
))

# Social Media
story.append(Paragraph("Social Media &amp; Content", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["Social media management (2 platforms)", "$500 – $2,500/mo"],
        ["Content creation (posts, graphics)",    "$300 – $1,500/mo"],
        ["Social media audit",                    "$300 – $800"],
        ["Profile setup & branding",              "$200 – $600"],
    ],
    [W * 0.62, W * 0.38]
))

# Paid Ads
story.append(Paragraph("Paid Advertising", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["Google Ads setup + management",  "$500 – $2,000/mo + 10–20% ad spend"],
        ["Meta Ads (Facebook/Instagram)",  "$500 – $2,000/mo + 10–20% ad spend"],
        ["Ad creative design",             "$300 – $1,000"],
        ["Retargeting campaign setup",     "$500 – $1,500"],
    ],
    [W * 0.52, W * 0.48]
))

# Branding
story.append(Paragraph("Branding &amp; Design", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["Logo design",                          "$300 – $2,500"],
        ["Brand kit (colors, fonts, guidelines)","$500 – $3,000"],
        ["Business card design",                 "$100 – $400"],
        ["Flyer/graphic design",                 "$100 – $500 each"],
    ],
    [W * 0.62, W * 0.38]
))

# Maintenance
story.append(Paragraph("Maintenance &amp; Hosting", SECTION_S))
story.append(make_table(
    ["Service", "Industry Price"],
    [
        ["Monthly website maintenance", "$100 – $500/mo"],
        ["Hosting management",          "$50 – $300/mo"],
        ["Security & backups",          "$50 – $200/mo"],
        ["Domain management",           "$50 – $150/yr"],
        ["Custom domain connection + DNS setup", "$100 – $300 (one-time)"],
    ],
    [W * 0.62, W * 0.38]
))

# FJMedia Packages
story.append(Paragraph("FJMedia Service Packages", SECTION_S))
story.append(Paragraph(
    "Revealed to the client only after they approve the build. Always lead with Get Customers.",
    NOTE_S
))
story.append(Spacer(1, 4))
story.append(make_package_table([W * 0.20, W * 0.13, W * 0.67]))

# Event Sites
story.append(Paragraph("Event Sites", SECTION_S))
story.append(Paragraph(
    "Separate track from the business packages — for wedding socials, fundraisers, and ticketed events. "
    "One-time build, no ongoing retainer required.",
    NOTE_S
))
story.append(Spacer(1, 4))

event_headers = [ph("Package"), ph("Price"), ph("Includes")]
event_rows = [
    [
        p("Event Site"),
        p("$300"),
        p("Single-page event site, hand-coded + mobile-optimized, prize gallery with lightbox, "
          "event details (date, venue, ticket info, prizes), shareable link, "
          "GitHub Pages hosting for the duration of the event"),
    ],
]
event_data = [event_headers] + event_rows
event_t = Table(event_data, colWidths=[W * 0.20, W * 0.13, W * 0.67], repeatRows=1)
event_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0),  NAVY),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, LIGHT]),
    ("GRID",          (0, 0), (-1, -1), 0.5, BORDER),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING",    (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 7),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
]))
story.append(event_t)
story.append(Spacer(1, 4))
story.append(Paragraph(
    "Note: Event sites can be upgraded to Get Found ($600) post-event if the organizer wants "
    "to convert it into a permanent business or brand page.",
    NOTE_S
))

# Retainers
story.append(Paragraph("Monthly Retainers", SECTION_S))
story.append(make_table(
    ["Plan", "Price", "Includes"],
    [
        ["Maintain", "$150/mo", "Updates, form monitoring, GAS checks"],
        ["Grow",     "$300/mo", "Everything in Maintain + content updates + SEO monitoring + monthly 1-on-1 sit-down (review data, what's working, what's next — keeps the relationship strong)"],
    ],
    [W * 0.20, W * 0.15, W * 0.65]
))

# Notes
story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
story.append(Spacer(1, 6))
story.append(Paragraph("Notes", BOLD_NOTE_S))
for n in [
    "Customize final quotes per client scope and complexity.",
    "Never disclose pricing upfront \u2014 reveal only after the client sees and approves the build.",
    "Always point clients toward Get Customers ($1,000) \u2014 it\u2019s the closer.",
    "Retainers ($150\u2013$300/mo) are upsold after the included free-changes period expires.",
    "Industry price ranges above are benchmarks only \u2014 use to anchor perceived value in conversations.",
    "Next price raise: jump to $800/$1,400/$2,200 once first testimonial with hard conversion numbers lands.",
]:
    story.append(Paragraph(f"- {n}", NOTE_S))

story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=1, color=GOLD))
story.append(Spacer(1, 4))
story.append(Paragraph("FJMedia \u2014 Winnipeg, MB \u2014 fjdmedia.github.io/FJMedia", SUBTITLE_S))

doc.build(story)
print(f"Done: {OUTPUT}")
