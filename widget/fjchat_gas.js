// ── FJChat GAS Backend for FJMedia ──
// Deploy as Web App: Execute as Me, Access Anyone

const ANTHROPIC_KEY = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_KEY');
const MODEL = 'claude-sonnet-4-6';
const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');

const SYSTEM_PROMPT = `You are a friendly, helpful chat assistant for FJMedia — a web design agency in Winnipeg, MB run by James Diaz.

Keep responses SHORT (2-3 sentences max). Be warm and conversational.
If someone asks something you don't know, say you'll have the team follow up.
Never make up information. Guide the conversation toward getting a free design or DMing on Instagram.

Business info:
- FJMedia hand-codes custom websites for Winnipeg small businesses in 48 hours
- No Wix, no Shopify, no templates — everything is built from scratch
- $0 upfront — the client sees their site before they pay a dollar
- Pricing: websites range from $200-$600 depending on the package
- Services: custom web design, SEO, Google Business Profile setup, ongoing growth retainers
- We work with barbers, detailers, bakeries, photographers, restaurants, and local shops
- Owner: James Diaz
- Location: Winnipeg, MB, Canada
- Instagram: @fjmedia.ca
- Website: fjmedia.ca
- To get started: visit fjmedia.ca and click "Get My Free Design" or DM on Instagram
- What makes FJMedia different: hand-coded (not drag-and-drop), delivered in 48 hours, zero risk (see it before you pay), fraction of what agencies charge ($200-$600 vs $3K-$10K)
- Growth retainer plans available: Keep It Running, Keep It Growing, Own Your Market

If asked about pricing specifics beyond the ranges, say "Every project is a bit different — DM us on Instagram or fill out the form on our site and James will get back to you with an exact quote."
If asked about timelines, say "Most sites are delivered within 48 hours of starting."
If asked about the process, say "James builds your site first, you see it, and only pay if you love it. Zero risk."`;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.action === 'log_lead') {
      logLead(body);
      return json({ ok: true });
    }

    if (body.action === 'chat') {
      const reply = callClaude(body.message, body.history || []);
      logChat(body);
      return json({ reply: reply });
    }

    return json({ error: 'Unknown action' });
  } catch (err) {
    return json({ error: err.message });
  }
}

function callClaude(message, history) {
  // Build messages array
  const msgs = [];
  history.forEach(function(m) {
    if (m.role === 'user' || m.role === 'assistant') {
      msgs.push({ role: m.role, content: m.content });
    }
  });
  msgs.push({ role: 'user', content: message });

  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: msgs
    }),
    muteHttpExceptions: true
  });

  const data = JSON.parse(res.getContentText());
  if (data.content && data.content[0]) {
    return data.content[0].text;
  }
  return "I'm having trouble right now. Please try again in a moment!";
}

function logLead(body) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Leads');
  if (!sheet) {
    sheet = ss.insertSheet('Leads');
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Event', 'Page']);
  }
  sheet.appendRow([
    body.timestamp || new Date().toISOString(),
    body.name || '',
    body.email || '',
    body.event || '',
    body.page || ''
  ]);
}

function logChat(body) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Chats');
  if (!sheet) {
    sheet = ss.insertSheet('Chats');
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
  }
  sheet.appendRow([
    new Date().toISOString(),
    body.leadName || '',
    body.leadEmail || '',
    body.message || ''
  ]);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return json({ status: 'FJChat backend running' });
}
