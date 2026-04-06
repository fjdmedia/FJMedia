"""
FJMedia — Service Breakdown PDF
Generates a branded breakdown of every service, package, add-on, and retainer.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    KeepTogether, PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUT = "C:/Users/diazc/OneDrive/Desktop/FJDMedia/FJDMedia Website/Ads/FJMedia_Service_Breakdown.pdf"

# ── Brand colours ─────────────────────────────────────────────────────────────
NAVY       = colors.HexColor("#071520")
NAVY_MID   = colors.HexColor("#0d1f3c")
GOLD       = colors.HexColor("#C9A84C")
CREAM      = colors.HexColor("#EDEAE5")
GREY       = colors.HexColor("#A09C96")
WHITE      = colors.white

# ── Styles ────────────────────────────────────────────────────────────────────
def styles():
    return {
        "cover_title": ParagraphStyle("cover_title",
            fontName="Helvetica-Bold", fontSize=32, textColor=CREAM,
            alignment=TA_CENTER, spaceAfter=8),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Helvetica", fontSize=13, textColor=GOLD,
            alignment=TA_CENTER, spaceAfter=4),
        "cover_tag": ParagraphStyle("cover_tag",
            fontName="Helvetica", fontSize=10, textColor=GREY,
            alignment=TA_CENTER),
        "package_label": ParagraphStyle("package_label",
            fontName="Helvetica-Bold", fontSize=8, textColor=GOLD,
            spaceBefore=4, spaceAfter=4, letterSpacing=2),
        "package_title": ParagraphStyle("package_title",
            fontName="Helvetica-Bold", fontSize=18, textColor=CREAM,
            spaceBefore=2, spaceAfter=6),
        "package_price": ParagraphStyle("package_price",
            fontName="Helvetica", fontSize=10, textColor=GREY,
            spaceBefore=0, spaceAfter=6),
        "section_label": ParagraphStyle("section_label",
            fontName="Helvetica-Bold", fontSize=10, textColor=GOLD,
            spaceBefore=4, spaceAfter=4, letterSpacing=1),
        "service_name": ParagraphStyle("service_name",
            fontName="Helvetica-Bold", fontSize=12, textColor=GOLD,
            spaceBefore=10, spaceAfter=3),
        "label": ParagraphStyle("label",
            fontName="Helvetica-Bold", fontSize=8, textColor=GREY,
            spaceAfter=2, letterSpacing=1),
        "body": ParagraphStyle("body",
            fontName="Helvetica", fontSize=9.5, textColor=CREAM,
            spaceAfter=6, leading=14),
        "footer": ParagraphStyle("footer",
            fontName="Helvetica", fontSize=8, textColor=GREY,
            alignment=TA_CENTER),
    }

S = styles()

# ── Helper: navy background page ──────────────────────────────────────────────
def navy_canvas(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, letter[1] - 4, letter[0], 4, fill=1, stroke=0)
    canvas.setFillColor(GREY)
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(letter[0] / 2, 28, f"FJMedia  \u00b7  fjmedia.ca  \u00b7  Page {doc.page}")
    canvas.restoreState()

# ── Service block builder ──────────────────────────────────────────────────────
# Only KeepTogether the title + first section so it doesn't orphan.
# Remaining 3 sections flow naturally — prevents sparse pages from KeepTogether pushes.
def service_block(name, breakdown, analogy, why, how):
    items = []
    # Each label+body pair is KeepTogether so labels never orphan at page bottom
    items.append(KeepTogether([
        Paragraph(name, S["service_name"]),
        HRFlowable(width="100%", thickness=0.5, color=NAVY_MID, spaceAfter=6),
        Paragraph("WHAT IT IS", S["label"]),
        Paragraph(breakdown, S["body"]),
    ]))
    items.append(KeepTogether([
        Paragraph("THINK OF IT THIS WAY", S["label"]),
        Paragraph(analogy, S["body"]),
    ]))
    items.append(KeepTogether([
        Paragraph("WHY IT MATTERS", S["label"]),
        Paragraph(why, S["body"]),
    ]))
    items.append(KeepTogether([
        Paragraph("HOW WE SOLVE IT", S["label"]),
        Paragraph(how, S["body"]),
    ]))
    return items

# ── Package header (full-size — for the 3 main packages) ──────────────────────
def package_header(label, title, price, note=None):
    items = []
    items.append(Spacer(1, 0.2 * inch))
    header = [
        Paragraph(label, S["package_label"]),
        Paragraph(title, S["package_title"]),
        Paragraph(price, S["package_price"]),
    ]
    if note:
        header.append(Paragraph(note, S["body"]))
    header.append(HRFlowable(width="100%", thickness=1, color=GOLD, spaceAfter=4))
    items.append(KeepTogether(header))
    return items

# ── Section header (smaller — for Add-ons, Retainers) ─────────────────────────
def section_header(label, title, subtitle=None):
    items = []
    items.append(Spacer(1, 0.2 * inch))
    header = [
        Paragraph(label, S["package_label"]),
        Paragraph(title, S["section_label"]),
    ]
    if subtitle:
        header.append(Paragraph(subtitle, S["body"]))
    header.append(HRFlowable(width="100%", thickness=0.5, color=GOLD, spaceAfter=4))
    items.append(KeepTogether(header))
    return items

# ── Content ───────────────────────────────────────────────────────────────────
def build():
    doc = SimpleDocTemplate(
        OUT,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.65 * inch,
    )

    story = []

    # ── Cover ──────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 2.2 * inch))
    story.append(Paragraph("{FJ} Media", S["cover_title"]))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("Service Breakdown", S["cover_sub"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("Every service we offer — what it is, why it matters, and how we deliver it.", S["cover_tag"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(HRFlowable(width="40%", thickness=1, color=GOLD, hAlign="CENTER"))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("fjmedia.ca", S["cover_tag"]))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # PACKAGE 0 — GET ONLINE (entry ramp)
    # ══════════════════════════════════════════════════════════════════════════
    story += package_header("PACKAGE 01", "Get Online", "$300  ·  One-time",
        "Need to be online fast? A clean, custom page — live in days. Covers event sites, landing pages, linktrees, and simple one-page sites.")

    story.extend(service_block(
        "Custom One-Page Site",
        "A single, hand-coded page designed for one purpose — whether that's an event, a link hub, or a quick-launch landing page.",
        "Like a pop-up shop vs. a full storefront. Fast to set up, designed to do one thing well, and gets you online immediately.",
        "Not every business needs a 7-page site on day one. But every business needs to exist online. A clean one-page site beats no site every time.",
        "We build a focused, mobile-ready page with your branding, live in days. No templates, no drag-and-drop — hand-coded to look professional from the start."
    ))

    story.extend(service_block(
        "Mobile Optimization",
        "Your page is coded to look and work perfectly on phones, tablets, and desktops.",
        "Over 60% of web traffic comes from phones. If your page breaks on mobile, most of your audience never sees it properly.",
        "Google ranks mobile-friendly sites higher. A page that doesn't work on a phone loses the customer and the ranking.",
        "Every page we build is responsive from the first line of code — tested across screen sizes before it goes live."
    ))

    story.extend(service_block(
        "Free Hosting",
        "Your page hosted on GitHub Pages at no monthly cost — fast, reliable, and included in the price.",
        "Like free rent for your digital storefront. No $30–50/month hosting bills eating into your bottom line.",
        "Monthly hosting fees add up fast and create friction for small businesses. Eliminating that cost means the site pays for itself sooner.",
        "We deploy to GitHub Pages with SSL included. Fast load times, no downtime, no bills."
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # PACKAGE 2 — GET FOUND
    # ══════════════════════════════════════════════════════════════════════════
    story += package_header("PACKAGE 02", "Get Found", "$600  ·  One-time",
        "The foundation. A clean, professional website that makes your business look legitimate and findable online.")

    story.extend(service_block(
        "Custom Website (5–7 Pages)",
        "A professionally designed, multi-page website built by hand — not a template, not a drag-and-drop builder. Includes Home, About, Services, Gallery, and Contact pages.",
        "Think of it as your digital storefront. Just like a clean, well-lit shop front gets more walk-ins, a professional website gets more clicks — and more calls.",
        "81% of people research a business online before visiting or buying. If your online presence looks amateur, they move on to a competitor before you even know they existed.",
        "We build a custom site in under 14 days. You send us your logo and a few photos — we handle design, layout, and copy. No templates. No builders. Built to convert."
    ))

    story.extend(service_block(
        "Mobile Optimization",
        "Your website is coded to look and work perfectly on phones, tablets, and desktops — every screen size, without compromise.",
        "Over 60% of web traffic comes from phones. A site that isn't mobile-ready is like having a store with a door too small to walk through — most of your customers can't get in.",
        "Google ranks mobile-friendly sites higher in search results. If your site breaks or looks off on a phone, you lose the customer and the ranking at the same time.",
        "Every site we build is hand-coded with responsive design — tested across screen sizes before it goes live. Mobile isn't an afterthought, it's built in from the first line of code."
    ))

    story.extend(service_block(
        "Contact Form",
        "A form embedded on your website where customers can send their name, email, and message directly to you — without needing to find a phone number or copy an email address.",
        "It's your business's inbox, built into the website. A customer lands on your page at 11pm — they can't call you, but they can fill out a form and hit send. That lead shows up in your inbox by morning.",
        "Every barrier between a customer and a business costs you money. A contact form removes friction and captures leads 24 hours a day, 7 days a week — even when you're off the clock.",
        "We build and connect a contact form that sends every inquiry straight to your email. Instant delivery, every time — no setup required on your end."
    ))

    story.extend(service_block(
        "Domain Connection + Hosting",
        "Your custom web address (e.g., yourbusiness.com) connected and live on the internet so customers can actually find your site.",
        "Your domain is your street address. Without it, your website has no location — it exists, but nobody can reach it. A custom domain turns a website into a real business presence.",
        "A branded domain looks professional, is easier to remember, and builds trust the moment someone sees it. Generic links signal amateur. A real domain signals legitimacy.",
        "We handle the full setup — domain configuration, GitHub Pages hosting, and everything in between. You don't touch a single technical setting."
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # PACKAGE 3 — GET CUSTOMERS
    # ══════════════════════════════════════════════════════════════════════════
    story += package_header("PACKAGE 03", "Get Customers", "$1,000  ·  One-time  ·  Most Popular",
        "Everything in Get Found — plus the backend that turns your website into a lead machine. Forms that think, data that logs itself, and Google knowing your business exists.")

    story.extend(service_block(
        "Order / Booking Form with Live Pricing",
        "A smart form that shows customers pricing in real time as they select services or options — and lets them place an order or book directly from your site.",
        "Like a cashier that calculates your total while you shop, before you ever reach the counter. Customers see the price update as they pick their options — no back-and-forth, no guessing.",
        "Customers want to know what things cost before they commit. Showing pricing live removes the 'how much is this?' barrier and speeds up the decision. Ambiguity kills conversions.",
        "We build a custom form with dropdowns, checkboxes, or quantity selectors that update the total automatically. Works on every device. Every submission is clean and actionable."
    ))

    story.extend(service_block(
        "Google Sheets CRM",
        "Every form submission from your website gets automatically saved to a Google Sheet — organized by date, name, contact info, service selected, and message.",
        "Like having a receptionist who writes down every customer inquiry in an organized notebook — except it's automatic, timestamped, and always searchable.",
        "Without a log, leads get lost. An email gets buried, a tab gets closed — and that customer never hears from you again. Lost leads are lost revenue.",
        "We connect your site's forms to a Google Sheet using Google Apps Script. Every submission logs itself the moment it's sent. You open the sheet and your leads are all there, in order."
    ))

    story.extend(service_block(
        "Automated Email Notifications",
        "The moment someone fills out your form, you receive an email alert with their full details — name, contact info, and what they need.",
        "Like a doorbell for your business. Every time a new customer knocks, you hear it immediately — no matter where you are or what you're doing.",
        "Speed of response is a competitive edge. The business that replies first wins the customer. You can't reply fast if you don't know the inquiry came in.",
        "We set up a Google Apps Script that fires an email to you the instant any form is submitted. Name, contact, what they need — delivered to your inbox in seconds."
    ))

    story.extend(service_block(
        "Google Business Profile Setup",
        "Your business listed and optimized on Google Maps and Google Search — so when someone in Winnipeg searches for your service, your name shows up.",
        "Like being listed in the Yellow Pages — except the Yellow Pages that 8 billion people use every day, on every device, in every city.",
        "GBP listings appear above regular websites in local searches. Businesses with optimized profiles get more calls, more direction requests, and more trust — for free.",
        "We set up or optimize your GBP with your business name, category, service area, hours, description, and photos. You get verified and visible where local customers are searching."
    ))

    story.extend(service_block(
        "On-Page SEO",
        "The behind-the-scenes text and code that tells Google exactly what your business is, where it operates, and who it serves — built into every page of your site.",
        "Like labelling every item in a warehouse so the staff (Google) can find and deliver exactly the right product to the right customer. Without labels, nothing gets found.",
        "Without SEO, your site is invisible to search engines. You can have the best-looking website in Winnipeg and still not show up when someone searches for your service.",
        "We write and install your title tags, meta descriptions, local keywords, Open Graph tags, and Local Business schema markup — all built in from day one, not added as an afterthought."
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # PACKAGE 4 — OWN THE MARKET
    # ══════════════════════════════════════════════════════════════════════════
    story += package_header("PACKAGE 04", "Own the Market", "$1,600  ·  One-time",
        "Everything in Get Customers — plus the data layer that shows you exactly what's working, where customers are finding you, and how your site performs month over month.")

    story.extend(service_block(
        "Google Analytics Setup",
        "A tracking system installed on your site that records how many people visit, where they came from, which pages they viewed, and how long they stayed.",
        "Like security cameras for your website. You can see exactly who's coming in, what they're looking at, and when they leave — so you know what's drawing people in and what's pushing them away.",
        "Without data, you're guessing. With data, you know what's working and what's not — and you can make decisions that actually grow your business instead of hoping for the best.",
        "We install Google Analytics 4 on your site and connect it to your Google account. From day one, every visitor is tracked. You always have numbers to look at."
    ))

    story.extend(service_block(
        "Google Search Console",
        "A Google tool that shows you what search terms people are using to find your site, how often you appear in results, and whether Google can properly read your pages.",
        "Like a report card from Google. It tells you exactly where you stand in search results, what keywords bring people to your door, and what needs to improve.",
        "Search Console is the only direct line of communication between your site and Google. It surfaces crawl errors, ranking positions, and real keyword data you can't get anywhere else.",
        "We add your site to Search Console, verify ownership, and submit your sitemap so Google indexes your pages immediately — no waiting weeks for Google to find you on its own."
    ))

    story.extend(service_block(
        "Monthly Performance Snapshot",
        "A monthly summary of your website's key numbers — visitors, form submissions, top traffic sources, and search ranking positions — delivered to you in plain language.",
        "Like a monthly business report, but for your digital presence. You see exactly what your site did for you that month, in numbers you can actually understand.",
        "Data keeps you accountable and shows clients the value they're getting. Seeing results — even small ones — reinforces why the investment made sense and why they should keep the site live.",
        "We pull the data from Analytics and Search Console every month and deliver a clean summary. No jargon, no dashboards to log into — just the numbers that matter, explained clearly."
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # NOTE — Get Online is now the entry tier in the main ascension ladder
    # Event sites, landing pages, and linktrees all fall under Get Online ($300)
    # No separate add-ons section needed
    # ══════════════════════════════════════════════════════════════════════════

    # ══════════════════════════════════════════════════════════════════════════
    # RETAINERS
    # ══════════════════════════════════════════════════════════════════════════
    story += section_header("MONTHLY RETAINERS", "Keep It Growing", "After your included months expire")

    story.extend(service_block(
        "Maintain — $150/month",
        "Monthly check-ins on your site's forms, backend scripts, and content — plus a basic analytics report and any small updates you need made.",
        "Like a property manager for your website. You don't have to think about it — someone else makes sure everything keeps running, nothing breaks, and your information stays current.",
        "Websites break. Forms stop working. Prices change. Hosting configurations shift. Without ongoing maintenance, small problems become big ones — and customers hit dead ends you don't even know about.",
        "We monitor your forms, Google Apps Script automations, and site performance every month. Anything that needs fixing gets handled before you even notice it was broken."
    ))

    story.extend(service_block(
        "Grow — $300/month",
        "Everything in Maintain — plus ongoing content updates, local SEO monitoring, and a monthly one-on-one review of your site's data to plan next steps together.",
        "Like having a part-time digital marketing manager. Someone who keeps your site updated, watches your rankings, and sits down with you once a month to review what's working and what to do next.",
        "A site that never changes loses rankings and relevance. Google rewards sites that stay active. Growth requires consistent updates and someone actively watching your numbers — not just hoping things improve on their own.",
        "Monthly content updates (menus, pricing, photos, seasonal changes), local SEO monitoring via Search Console, and a monthly sit-down to review Analytics data and plan the next move. You stay in the loop, we do the work."
    ))

    # ── Build ──────────────────────────────────────────────────────────────────
    doc.build(story, onFirstPage=navy_canvas, onLaterPages=navy_canvas)
    print(f"PDF saved: {OUT}")

build()
