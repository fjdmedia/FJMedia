from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

NAVY   = colors.HexColor('#071520')
GOLD   = colors.HexColor('#c9a84c')
LIGHT  = colors.HexColor('#f5f7fa')
WHITE  = colors.white
MID    = colors.HexColor('#888888')
DARK   = colors.HexColor('#1a1a2e')

def base_styles():
    s = getSampleStyleSheet()
    return {
        'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=22,
                                textColor=NAVY, spaceAfter=6, alignment=TA_LEFT),
        'subtitle': ParagraphStyle('subtitle', fontName='Helvetica', fontSize=9,
                                   textColor=MID, spaceAfter=2, alignment=TA_LEFT),
        'price': ParagraphStyle('price', fontName='Helvetica-Bold', fontSize=14,
                                textColor=GOLD, spaceAfter=14, spaceBefore=6, alignment=TA_LEFT),
        'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=11,
                                  textColor=NAVY, spaceBefore=12, spaceAfter=6),
        'step_num': ParagraphStyle('step_num', fontName='Helvetica-Bold', fontSize=9,
                                   textColor=GOLD, spaceBefore=10, spaceAfter=1),
        'step_title': ParagraphStyle('step_title', fontName='Helvetica-Bold', fontSize=11,
                                     textColor=NAVY, spaceAfter=4),
        'step_body': ParagraphStyle('step_body', fontName='Helvetica', fontSize=10,
                                    textColor=colors.HexColor('#333333'), spaceAfter=2,
                                    leading=14, leftIndent=16),
        'note': ParagraphStyle('note', fontName='Helvetica-Oblique', fontSize=9,
                               textColor=MID, spaceAfter=6, leftIndent=0),
        'includes_item': ParagraphStyle('includes_item', fontName='Helvetica', fontSize=10,
                                        textColor=colors.HexColor('#333333'), spaceAfter=2,
                                        leftIndent=16, leading=14),
        'footer': ParagraphStyle('footer', fontName='Helvetica', fontSize=8,
                                 textColor=MID, alignment=TA_CENTER),
    }

def header_block(story, st, package_name, price, tagline, includes):
    # Title row
    story.append(Paragraph(f"FJMedia — Fulfillment Guide", st['subtitle']))
    story.append(Paragraph(package_name, st['title']))
    story.append(Paragraph(price, st['price']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=10))

    if tagline:
        story.append(Paragraph(tagline, st['note']))

    if includes:
        story.append(Paragraph("What's Included", st['section']))
        for item in includes:
            story.append(Paragraph(f"• {item}", st['includes_item']))
        story.append(Spacer(1, 8))

def step_block(story, st, number, title, details):
    block = []
    block.append(Paragraph(f"STEP {number}", st['step_num']))
    block.append(Paragraph(title, st['step_title']))
    for line in details:
        block.append(Paragraph(f"• {line}", st['step_body']))
    story.append(KeepTogether(block))

def footer_block(story, st):
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=MID, spaceAfter=6))
    story.append(Paragraph("FJMedia — Internal Use Only | diazfjamesc@gmail.com | © 2026", st['footer']))

def make_pdf(filename, package_name, price, tagline, includes, steps):
    path = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(path, pagesize=letter,
                            leftMargin=0.85*inch, rightMargin=0.85*inch,
                            topMargin=0.85*inch, bottomMargin=0.75*inch)
    st = base_styles()
    story = []
    header_block(story, st, package_name, price, tagline, includes)
    story.append(Paragraph("Fulfillment Steps", st['section']))
    for i, (title, details) in enumerate(steps, 1):
        step_block(story, st, i, title, details)
    footer_block(story, st)
    doc.build(story)
    print(f"Generated: {filename}")


# ─────────────────────────────────────────────────────────────────────────────
# GET FOUND — $600
# ─────────────────────────────────────────────────────────────────────────────
make_pdf(
    "Fulfillment_GetFound_600.pdf",
    "Get Found — $600",
    "$600 One-Time",
    "A professional presence that works. Entry-level site for businesses that need to look legitimate online.",
    [
        "Custom 5–7 page website (Home, About, Services, Gallery, Contact)",
        "Mobile-optimized, hand-coded HTML/CSS/JS",
        "Contact/inquiry form (Web3Forms)",
        "GitHub Pages hosting (free URL for client approval)",
        "Custom domain connection after client approval",
        "1 month of free changes after launch",
    ],
    [
        ("Intake — Gather Everything Upfront", [
            "Ask for: logo, brand colors, fonts (if any)",
            "Ask for: real content — services list, pricing, contact info, about blurb",
            "Ask for: any photos or confirm you'll use stock",
            "Confirm business name, address, hours, phone, email",
            "Confirm preferred domain name (check availability on Namecheap)",
        ]),
        ("Build the Website", [
            "Create folder: FJDMedia/Websites/[Client Name]/",
            "Build single HTML file: Website.html",
            "Sections: Hero, About, Services, Gallery, Contact",
            "Wire contact form to Web3Forms using client's access key",
            "Mobile-first — test all breakpoints before preview",
            "No placeholder text, no placeholder images in final build",
        ]),
        ("Internal QA Before Preview", [
            "All buttons and links work",
            "Contact form submits and sends email confirmation",
            "No broken images",
            "Mobile nav opens and closes properly",
            "No overlapping elements or z-index issues",
            "All copy reviewed — no typos, correct business name throughout",
        ]),
        ("Deploy to GitHub Pages (Preview URL)", [
            "Create empty public repo on GitHub under fjdmedia account",
            "Push from project folder: git init → git add . → git commit → git push",
            "Enable GitHub Pages: Settings → Pages → Branch: master → root → Save",
            "Share preview URL with client: fjdmedia.github.io/[repo-name]",
            "Do NOT buy domain yet — wait for client approval",
        ]),
        ("Client Approval", [
            "Present preview URL on a call or screen share if possible",
            "Walk through each section — ask for feedback",
            "Make any requested changes (up to 2 revision rounds included)",
            "Get explicit written or verbal approval before going to domain step",
            "Collect payment via e-transfer before domain purchase",
        ]),
        ("Custom Domain Setup (after approval + payment)", [
            "Buy domain on Namecheap (~$10–15/yr)",
            "Add custom domain in GitHub Pages settings",
            "Update DNS records on Namecheap to point to GitHub Pages",
            "Wait for SSL to activate (GitHub handles this automatically — up to 24hrs)",
            "Confirm live domain works on mobile + desktop",
        ]),
        ("Handoff", [
            "Send client the live URL",
            "Remind them of their 1 month of free changes",
            "Let them know you're available for questions",
            "Pitch the Get Customers upgrade or Maintain retainer ($150/mo)",
            "Request a written testimonial within 30 days of launch",
        ]),
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# GET CUSTOMERS — $1,000
# ─────────────────────────────────────────────────────────────────────────────
make_pdf(
    "Fulfillment_GetCustomers_1000.pdf",
    "Get Customers — $1,000",
    "$1,000 One-Time",
    "Turn your site into a lead machine. Everything in Get Found plus backend, CRM, and Google presence.",
    [
        "Everything in Get Found ($600)",
        "Order/booking form with live pricing logic",
        "Google Sheets CRM — every inquiry auto-logged with timestamp",
        "Automated email notification on every inquiry (Google Apps Script)",
        "Google Business Profile optimization",
        "Basic on-page SEO (title, meta description, Open Graph tags, schema)",
        "3 months of free changes after launch",
    ],
    [
        ("Intake — Gather Everything Upfront", [
            "Same as Get Found intake (logo, colors, content, contact info)",
            "Ask for: services list with pricing (for booking form)",
            "Ask for: Google account login or confirm they have Google Business access",
            "Ask for: any Google Business photos they want uploaded",
            "Confirm their preferred notification email for form submissions",
        ]),
        ("Build the Website", [
            "Create folder: FJDMedia/Websites/[Client Name]/",
            "Build Website.html — all sections including order/booking form",
            "Wire contact form to Web3Forms (email backup)",
            "Add live pricing logic to booking form (JS — updates total on selection)",
            "Mobile-first — test all breakpoints",
        ]),
        ("Google Apps Script Backend (CRM)", [
            "Create a new Google Sheet in client's Google Drive (or James's Drive)",
            "Name the sheet: [Client Name] — Orders/Inquiries",
            "Paste appsscript.js into script.google.com → new project",
            "Update the script: set client email, sheet name, and column headers",
            "Deploy as Web App: Execute as Me, Access: Anyone",
            "Copy the deployment URL",
            "Paste GAS URL into Website.html (replace YOUR_APPS_SCRIPT_URL placeholder)",
            "Test form submission — confirm row appears in Sheets + email arrives",
        ]),
        ("On-Page SEO Setup", [
            "Set <title> tag: [Business Name] | [City] | [Primary Service]",
            "Write meta description (150–160 chars) — include city + service",
            "Add Open Graph tags (og:title, og:description, og:image, og:url)",
            "Add Local Business JSON-LD schema (name, address, phone, hours, url)",
            "Confirm all images have descriptive alt text",
        ]),
        ("Internal QA Before Preview", [
            "Form submits → email arrives → row logged in Google Sheet",
            "Pricing logic updates correctly on selection",
            "All SEO tags present and correct (view source to verify)",
            "Mobile nav, buttons, links all working",
            "No broken images, no placeholder content",
        ]),
        ("Deploy to GitHub Pages (Preview URL)", [
            "Create empty public repo on GitHub under fjdmedia account",
            "Push project: git init → git add . → git commit → git push",
            "Enable GitHub Pages: Settings → Pages → Branch: master → root → Save",
            "Share preview URL with client",
        ]),
        ("Google Business Profile Optimization", [
            "Log into Google Business Profile with client's Google account",
            "Verify all info is accurate: name, address, phone, hours, website URL",
            "Upload high-quality photos (exterior, interior, team, products/services)",
            "Write or update the business description (include city + primary keywords)",
            "Add all services with descriptions",
            "Confirm profile is verified (if not, initiate verification process)",
        ]),
        ("Client Approval", [
            "Present preview URL — walk through site + backend demo",
            "Show Google Sheet logging live with a test submission",
            "Collect revisions, make changes, get explicit approval",
            "Collect payment via e-transfer before domain purchase",
        ]),
        ("Custom Domain Setup (after approval + payment)", [
            "Buy domain on Namecheap (~$10–15/yr)",
            "Add custom domain in GitHub Pages settings",
            "Update DNS records on Namecheap",
            "Wait for SSL activation (up to 24hrs)",
            "Update sitemap and schema URL to reflect live domain",
        ]),
        ("Handoff", [
            "Send live URL + Google Business Profile link",
            "Walk client through Google Sheet so they understand their CRM",
            "Remind them of their 3 months of free changes",
            "Pitch the Grow retainer ($300/mo) — frame as: you built the machine, now let's run it",
            "Request a written testimonial within 30 days of launch",
            "Book a 30-day check-in call",
        ]),
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# OWN THE MARKET — $1,600
# ─────────────────────────────────────────────────────────────────────────────
make_pdf(
    "Fulfillment_OwnTheMarket_1600.pdf",
    "Own the Market — $1,600",
    "$1,600 One-Time",
    "A full digital system, done for you. Everything in Get Customers plus analytics, SEO, and 6 months managed.",
    [
        "Everything in Get Customers ($1,000)",
        "Google Analytics setup + monthly performance snapshot",
        "Seasonal content updates (menu changes, pricing, photos)",
        "Ongoing local SEO monitoring",
        "6 months of managed maintenance included",
        "Priority support — 24hr response time",
    ],
    [
        ("Intake — Gather Everything Upfront", [
            "Same as Get Customers intake",
            "Ask for: Google Analytics account (or create one for them)",
            "Ask for: content update cadence — how often do services/prices/photos change?",
            "Set expectations: you will handle updates for 6 months, then retainer pitch",
        ]),
        ("Build the Website + Backend", [
            "Follow all steps from Get Customers build",
            "Include all SEO tags and schema from the start",
        ]),
        ("Google Analytics Setup", [
            "Create or access client's Google Analytics 4 property",
            "Add GA4 tracking script to Website.html",
            "Set up Goals: form submission as a conversion event",
            "Link Google Analytics to Google Business Profile (if applicable)",
            "Verify data is flowing — check Real-Time report after deployment",
        ]),
        ("On-Page SEO + Local SEO", [
            "Complete all SEO steps from Get Customers",
            "Submit site URL to Google Search Console",
            "Request indexing in Search Console",
            "Set a 30-day baseline — screenshot rankings + traffic at launch",
        ]),
        ("Internal QA Before Preview", [
            "All Get Customers QA items pass",
            "GA4 tracking confirmed — events firing correctly",
            "Search Console connected and verified",
            "All content accurate and final",
        ]),
        ("Deploy + Domain Setup", [
            "Same as Get Customers deployment steps",
            "After domain is live, update GA4 and Search Console with final URL",
        ]),
        ("Google Business Profile Optimization", [
            "Same as Get Customers GBP steps",
            "Also: set up Q&A section with 3–5 common questions pre-answered",
            "Enable messaging if client is comfortable responding",
        ]),
        ("Client Approval", [
            "Full demo: site, backend CRM, GA4 dashboard, GBP profile",
            "Show them exactly what they're getting for 6 months",
            "Collect payment via e-transfer",
        ]),
        ("Custom Domain Setup", [
            "Same as Get Customers domain steps",
        ]),
        ("Monthly Maintenance (Months 1–6)", [
            "Month 1: Launch check — confirm all forms, analytics, GBP live",
            "Months 2–6: Process any content update requests within 48hrs",
            "Each month: pull GA4 report — note top pages, traffic sources, conversions",
            "Send client a 1-page monthly snapshot (traffic, inquiries, top source)",
            "Flag any drops in traffic or form errors immediately",
            "Month 5: Begin retainer pitch — 'Your 6 months is almost up — here's how we keep the momentum going'",
        ]),
        ("Handoff + Retainer Pitch at Month 6", [
            "Review 6-month performance snapshot with client",
            "Present Grow retainer ($300/mo) — frame it as maintaining the system you built",
            "Offer Maintain retainer ($150/mo) as the lighter option",
            "Request testimonial with real numbers (traffic, inquiries, revenue impact)",
            "Ask for referrals — 'Do you know any other business owners who could use this?'",
        ]),
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# EVENT SITE — $300
# ─────────────────────────────────────────────────────────────────────────────
make_pdf(
    "Fulfillment_EventSite_300.pdf",
    "Event Site — $300",
    "$300 One-Time",
    "Wedding socials, fundraisers, ticketed events. Single-page site with prize gallery + event details.",
    [
        "Single-page event website",
        "Prize gallery with lightbox (click to expand images)",
        "Event details section (date, venue, address, time)",
        "Shareable link via GitHub Pages",
        "Hosting for duration of the event",
        "Upsell path: Get Found ($600) after event for permanent business/brand page",
    ],
    [
        ("Intake — Gather Everything Upfront", [
            "Event name, date, venue name, full address, time (doors open, event start)",
            "Ticket price (if applicable)",
            "Prize list — names + photos of all prizes (regular + grand prizes)",
            "Brand colors or theme preference (dark/light, color scheme)",
            "Client's contact info for the site (optional)",
            "Any special sections needed: schedule, performers, sponsors",
        ]),
        ("Build the Site", [
            "Create folder: FJDMedia/Websites/[Client Name]/",
            "Build Website.html — single page",
            "Sections: Hero (event name + date), Event Details, Prize Gallery, Footer",
            "Prize gallery: polaroid-style cards with lightbox on click",
            "Separate prizes into tiers if applicable (regular prizes, grand prizes, golden ticket)",
            "Mobile-first — this site gets shared on Instagram, must look perfect on phone",
        ]),
        ("Prize Images", [
            "Process all prize images through Pillow if needed (resize, crop, optimize)",
            "Set object-position per image — faces must never be cut off",
            "Name files clearly: prize_1.jpg, prize_grand_1.jpg, etc.",
            "Place all images in assets/images/ subfolder",
        ]),
        ("Internal QA Before Preview", [
            "Lightbox opens and closes on all prizes",
            "Event details are accurate (date, time, venue, address)",
            "All prize images load correctly on mobile",
            "Sharing the link on mobile shows a proper preview (OG tags set)",
            "No broken images or placeholder content",
        ]),
        ("Deploy to GitHub Pages", [
            "Create empty public repo on GitHub under fjdmedia account",
            "Push project to master branch",
            "Enable GitHub Pages: Settings → Pages → Branch: master → root → Save",
            "Share preview URL with client for approval",
        ]),
        ("Client Approval + Payment", [
            "Send preview URL — give client 24hrs to review",
            "Make any last changes (prize updates, typo fixes)",
            "Collect payment via e-transfer before sharing the public link",
            "Confirm the link is shareable and correct before client posts it",
        ]),
        ("Post-Event Upsell", [
            "After the event, reach out: 'Hope it went great! If you ever want a permanent site for your business, I can build that for $600.'",
            "Reference the event site as proof of what you can do",
            "If they're interested, start the Get Found ($600) intake process",
        ]),
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# LINKTREE — $300
# ─────────────────────────────────────────────────────────────────────────────
make_pdf(
    "Fulfillment_Linktree_300.pdf",
    "Linktree — $300",
    "$300 One-Time",
    "Branded link-in-bio for realtors, creators, and small businesses. Replaces generic Linktree or Canva links.",
    [
        "Custom branded single-page link hub",
        "Client avatar + bio",
        "All real links: phone, email, socials, booking",
        "72-hour spec preview countdown (used as pitch mechanic for cold prospects)",
        "GitHub Pages hosting",
        "Upsell path: Get Found ($600) or Get Customers ($1,000) for a full site",
    ],
    [
        ("Prospect Research (Cold DM strategy)", [
            "Use FJMedia Prospector tool to find target businesses by niche + city",
            "Identify prospects with weak or no link-in-bio",
            "Gather: their Instagram handle, bio, website (if any), contact info from profile",
            "Note their niche, vibe, colors — build to match their brand before reaching out",
        ]),
        ("Build the Linktree Spec (before contacting)", [
            "Create folder: FJDMedia/Websites/[Client Name]/",
            "Build Website.html — single page, branded to their vibe",
            "Include: avatar/photo, name, tagline, all visible social links, phone, email, booking link",
            "Set a 72-hour countdown timer (expires after 72hrs from send time)",
            "Deploy to GitHub Pages immediately after build",
        ]),
        ("Cold DM Pitch", [
            "Use FJMedia DM Writer tool to generate the outreach message",
            "Short version first: mention you built something for them, include the live link",
            "72hr countdown creates urgency — they need to click to see it",
            "If no reply in 3–4 days, send follow-up: 'Just circling back — link's still up if you want to see it.'",
        ]),
        ("Client Approval + Payment", [
            "If they reply positively, offer to keep it live permanently for $300",
            "Collect payment via e-transfer",
            "Remove the countdown timer after payment",
            "Update any links they want changed",
        ]),
        ("Handoff", [
            "Confirm the live GitHub Pages link is their permanent link",
            "Remind them to update their Instagram bio link",
            "Pitch the upgrade: 'This is just the starting point — I can build you a full site for $600'",
            "Request a quick testimonial or screenshot to use as a case study",
        ]),
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# MAINTAIN RETAINER — $150/mo
# ─────────────────────────────────────────────────────────────────────────────
make_pdf(
    "Fulfillment_Retainer_Maintain_150.pdf",
    "Maintain Retainer — $150/mo",
    "$150 / Month",
    "Keep the site healthy and the backend running. For clients who want peace of mind without ongoing strategy.",
    [
        "Site updates on request (text, images, pricing, hours)",
        "Form + Google Apps Script monitoring",
        "Monthly analytics report",
        "All links and buttons checked monthly",
        "Response within 48 hours on all requests",
    ],
    [
        ("Retainer Kickoff (Month 1)", [
            "Confirm client's preferred contact method (IG DM, email, text)",
            "Set expectations: updates processed within 48hrs, monthly report delivered by the 5th",
            "Confirm Google Sheet access (check it's still logging correctly)",
            "Pull baseline analytics report for Month 1 comparison",
            "Confirm all forms and links are working at retainer start",
        ]),
        ("Monthly — Update Requests", [
            "Process any content updates the client sends (new photos, updated pricing, hours change)",
            "Make edits in the local HTML file, test locally, then push to GitHub",
            "Confirm changes are live and notify client",
            "Log the update in a simple notes doc (date, what changed) for your own records",
        ]),
        ("Monthly — Backend Check", [
            "Submit a test form — confirm email arrives AND Google Sheet logs the row",
            "Check GAS deployment is still live (script.google.com → Manage Deployments)",
            "If GAS is broken: redeploy, update URL in HTML, push to GitHub",
            "Check Web3Forms email backup is still receiving (send test, check inbox)",
        ]),
        ("Monthly — Analytics Report", [
            "Pull Google Analytics 4 data: sessions, users, top pages, traffic sources",
            "Note any significant changes vs. last month",
            "Write a 1-page plain-English summary: what's up, what's down, what it means",
            "Send to client by the 5th of each month",
        ]),
        ("Monthly — Site Health Check", [
            "Open site on mobile + desktop — confirm nothing looks broken",
            "Click all navigation links and CTA buttons",
            "Check all images load correctly",
            "Verify custom domain SSL is still active (padlock shows in browser)",
        ]),
        ("Retainer Renewal + Upsell (Every 3 Months)", [
            "Check in proactively: 'Hey, things are running smoothly — just wanted to see how business has been.'",
            "Share any notable analytics wins",
            "If they're growing, pitch upgrade to Grow ($300/mo): 'At this stage, we could be doing more — content updates, SEO monitoring, and a monthly strategy sit-down.'",
        ]),
    ]
)


# ─────────────────────────────────────────────────────────────────────────────
# GROW RETAINER — $300/mo
# ─────────────────────────────────────────────────────────────────────────────
make_pdf(
    "Fulfillment_Retainer_Grow_300.pdf",
    "Grow Retainer — $300/mo",
    "$300 / Month",
    "Maintain plus content, SEO, and a monthly 1-on-1. For clients who want to grow, not just maintain.",
    [
        "Everything in Maintain ($150/mo)",
        "Monthly content updates (new photos, seasonal copy, service additions)",
        "Local SEO monitoring (rankings, GBP activity, new reviews)",
        "Monthly 1-on-1 sit-down (review data, what's working, what's next)",
        "Priority support — 24hr response time",
        "Proactive recommendations — you flag opportunities before they ask",
    ],
    [
        ("Retainer Kickoff (Month 1)", [
            "Complete all Maintain kickoff steps",
            "Schedule recurring monthly 1-on-1 (30 min, video or in-person)",
            "Ask: what are your goals for the next 3 months? (more bookings, more reviews, more foot traffic?)",
            "Set a content update plan: what changes seasonally? what photos are they missing?",
            "Pull baseline analytics + GBP stats for Month 1 comparison",
        ]),
        ("Monthly — All Maintain Steps", [
            "Complete all steps from the Maintain retainer each month",
            "Process updates within 24hrs (priority support tier)",
        ]),
        ("Monthly — Content Update", [
            "Collect any new photos or content from client (DM or email)",
            "Update relevant sections: gallery, services, seasonal specials, team bios",
            "Push changes to GitHub — confirm live",
            "If no new content: proactively suggest something ('Summer is coming — want to update your hero photo?')",
        ]),
        ("Monthly — Local SEO Monitoring", [
            "Check Google Business Profile: any new reviews? Respond to each one",
            "Check GBP insights: search queries, profile views, direction requests",
            "Note any ranking changes for primary keywords (manual check or free tool)",
            "Flag any competitor activity worth responding to",
            "If client has no reviews yet: send them a Google review link and ask them to share it with recent customers",
        ]),
        ("Monthly 1-on-1 Sit-Down", [
            "Review the month's analytics: traffic, inquiries, conversions",
            "Review GBP performance: views, calls, direction clicks",
            "Discuss what's working and what to improve",
            "Agree on next month's priorities (new photos? updated pricing? new service?)",
            "This meeting is about the relationship as much as the data — show up, be present",
            "Document action items — follow through before next month's call",
        ]),
        ("Quarterly Review + Upsell Check", [
            "Every 3 months: pull a full performance report (traffic trend, conversion rate, GBP growth)",
            "Present wins — give them a reason to feel good about the investment",
            "If they're ready to go further: pitch a one-time project (new landing page, Google Ads setup, etc.)",
            "Ask for a referral: 'Do you know anyone else who could use something like this?'",
        ]),
    ]
)

print("\nAll fulfillment guides generated successfully.")
