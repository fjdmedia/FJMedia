export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { type, data } = req.body;

  if (!type || !data) return res.status(400).json({ error: 'Missing type or data' });

  // Package data for value stacking
  const packageDetails = {
    'Get Found': {
      price: 600, marketValue: 1725,
      features: [
        'Custom 4-page website (Home, About, Services, Contact) — $600+ if hired separately',
        'Hand-coded from scratch, no templates — $200+ if hired separately',
        'Mobile-optimized across all devices — $150+ if hired separately',
        'Contact form + instant email alert on every inquiry — $150+ if hired separately',
        'Professional copywriting (we write everything) — $250+ if hired separately',
        'On-page SEO setup (title, meta, OG tags) — $150+ if hired separately',
        'Free hosting setup (no monthly fees) — $75+ if hired separately',
        '1 month of free changes after launch — $150+ if hired separately',
      ]
    },
    'Get Customers': {
      price: 1000, marketValue: 3350,
      features: [
        'Everything in Get Found — $1,725+ if hired separately',
        'Order/booking form with live pricing logic — $300+ if hired separately',
        'Google Sheets CRM — every lead auto-logged forever — $250+ if hired separately',
        'Instant email alert on every customer inquiry — $200+ if hired separately',
        'GA4 analytics + CTA click tracking — $200+ if hired separately',
        'Photo gallery / services showcase section — $150+ if hired separately',
        'Social media link integration — $75+ if hired separately',
        '3 months of free changes after launch — $450+ if hired separately',
      ]
    },
    'Own the Market': {
      price: 1600, marketValue: 5500,
      features: [
        'Everything in Get Customers — $3,350+ if hired separately',
        '2–3 full custom design versions to choose from — $500+ if hired separately',
        'Auto-reply email on every customer inquiry — $150+ if hired separately',
        'Customer reviews + testimonials section — $150+ if hired separately',
        'Custom domain + full DNS setup — $200+ if hired separately',
        'Local Business schema markup (Google ranking signal) — $150+ if hired separately',
        'Open Graph + social sharing optimization — $100+ if hired separately',
        '6 months of managed maintenance included — $900+ if hired separately',
      ]
    },
    'Get Online': {
      price: 300, marketValue: 575,
      features: [
        'Clean, custom one-page site — hand-coded, no templates — $300+ if hired separately',
        'Mobile-optimized across all devices — $100+ if hired separately',
        'Hosted free on GitHub Pages — $100+ if hired separately',
        'Delivered in days, not weeks — rush rate value $75+',
      ]
    },
  };

  let prompt = '';

  if (type === 'quote') {
    const pkg = packageDetails[data.package] || {};

    prompt = `You are James from FJMedia, a web design agency in Winnipeg. Write a short, confident quote message to send to a prospect.

Client Info:
- Name: ${data.clientName}
- Business: ${data.businessName}
- Industry: ${data.industry}
- Package: ${data.package} ($${pkg.price || 'TBD'})
- Market value of package: $${pkg.marketValue || 'TBD'}+
- Notes: ${data.notes || 'None'}

Core principle (Alex Hormozi — $100M Offers): Lead with the OUTCOME, not the service. They don't want a website — they want more customers, more bookings, more revenue, and to look like the best option in their market.

Write a quote message that:
1. Opens by naming the specific outcome ${data.clientName}'s business will get — be specific to their industry (e.g. more detailing bookings, found when people Google barbers in Winnipeg, look more credible than competitors, etc.)
2. States the package + price, and shows the value vs. price contrast ($${pkg.marketValue || 'X'}+ in value, $${pkg.price || 'X'} is what they pay)
3. States the guarantee in one line: "We build it first. You see every detail. You only pay when you're ready to launch."
4. Ends with ONE clear next step — reply to confirm or book a quick call

Under 150 words. Warm, direct, confident — no corporate fluff. Sign off as James — FJMedia.`;

  } else if (type === 'proposal') {
    const pkg = packageDetails[data.package] || {};
    const savings = (pkg.marketValue && pkg.price) ? (pkg.marketValue - pkg.price) : null;

    prompt = `You are James from FJMedia, a web design agency in Winnipeg. Write a Grand Slam Proposal using Alex Hormozi's value-stacking method from $100M Offers.

Client Info:
- Name: ${data.clientName}
- Business: ${data.businessName}
- Industry: ${data.industry}
- Package: ${data.package}
- FJMedia price: $${pkg.price || 'TBD'}
- Total market value: $${pkg.marketValue || 'TBD'}+
- They save: $${savings || 'TBD'}+
- Notes: ${data.notes || 'None'}

Value stack (list these with their individual market values):
${pkg.features ? pkg.features.map(f => `• ${f}`).join('\n') : '• Custom website build'}

Write the proposal with these exact sections:

**The Outcome**
One powerful sentence naming the specific result ${data.clientName} will get — not the deliverables, the dream (e.g. "Royal Kings Auto Care will be the first detailer customers find when they search in Winnipeg — and the most credible one they see."). Make it specific to their business and industry.

**What You're Getting**
List every component as a bullet with its individual market value (use the value stack above). End with:
Total market value: $${pkg.marketValue || 'X'}+
You pay: $${pkg.price || 'X'}
You save: $${savings || 'X'}+

**The Guarantee**
Write 2 sentences: We build the full site before they pay a cent. They see every detail, request any changes, and only pay when they're 100% happy — or they walk away owing nothing.

**Timeline**
Realistic delivery: 5 days to first design, 14 days fully live (or a few days for Get Online). Tailor to their package.

**After Launch — Keep the Customers Coming**
3–4 sentences pitching the Monthly Maintenance Retainer ($150–$300/mo). Frame it as the system that keeps results coming in long-term. The site is the foundation — the retainer is what turns it into a customer machine. Without it, a site peaks and plateaus. With it, it keeps growing.

**Your Next Step**
One clear CTA. Reply to confirm, or book a quick 15-min call to go over details.

Professional, human, no filler. Under 400 words. Sign off as James — FJMedia.`;

  } else if (type === 'followup') {
    prompt = `You are James from FJMedia, a web design agency in Winnipeg. Write a 5-message follow-up sequence for a prospect who hasn't replied yet.

Client Info:
- Name: ${data.clientName}
- Business: ${data.businessName}
- Industry: ${data.industry || 'local business'}
- Last Contact: ${data.lastContact || 'a few days ago'}
- Context: ${data.notes || 'Had initial interest, no reply yet'}

Core principle (Alex Hormozi — $100M Leads): Most sales happen on follow-up 5–12. Each message must add value or shift the prospect's perspective — never just "checking in." Every message should feel personal, not copy-paste. Reference ${data.businessName} by name in every message.

Write exactly 5 follow-up messages:

**Follow-up 1 (Day 3):**
Gentle re-open. Reference their specific business. Ask one simple question to restart the conversation (e.g. "Still thinking about getting [business] online?" or "Did you have any questions about the proposal?"). 2–3 sentences. No pressure.

**Follow-up 2 (Day 7):**
Add value. Share one sharp insight about businesses in their industry that don't have a strong online presence — a missed opportunity, a competitor advantage, or a stat. Remind them the site gets built before they pay a single dollar. End with a soft CTA. 3–4 sentences.

**Follow-up 3 (Day 14):**
ROI math (Hormozi-style). Calculate how many extra customers it takes to cover the investment for their industry. Keep it simple: if the average sale in their industry is ~$X, then Y extra customers = the site pays for itself — everything after that is pure profit. Make it feel like the easiest decision they'll ever make. 3–4 sentences.

**Follow-up 4 (Day 21):**
Social proof + retainer pitch. Reference the type of result FJMedia has helped a local small business achieve (more bookings, first to show up on Google, inbox filling up). Mention that the clients who see the best long-term results are the ones who add the Monthly Maintenance Retainer ($150–$300/mo) after launch — because that's what keeps the customers coming in, not just a spike at launch. 3–4 sentences.

**Follow-up 5 (Day 30):**
The breakup message. No pressure, no guilt. Let them know you're wrapping up outreach, the door stays open whenever they're ready. Mention that you only take 5 builds a month and you'll hold their spot for a few more days before opening it up. Warm, respectful, final. 2–3 sentences.

Confident, never desperate. No corporate fluff. Sign off every message as James — FJMedia.`;

  } else {
    return res.status(400).json({ error: 'Invalid type. Use: quote, proposal, followup' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(500).json({ error: 'AI error' });
    }

    const result = await response.json();
    res.json({ output: result.content[0].text });

  } catch (err) {
    console.error('Ops error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
