/**
 * FJChat — AI Chat Widget by FJMedia
 * Drop-in chat widget for client websites.
 *
 * Usage (GAS proxy — for client sites):
 *   <script src="https://fjmedia.ca/widget/fjchat.js"
 *     data-endpoint="https://script.google.com/macros/s/YOUR_ID/exec"
 *     data-accent="#c9a84c"
 *     data-greeting="Hi! Ask us anything."
 *     data-business="Tom's Detailing">
 *   </script>
 *
 * Usage (direct Anthropic — for demo/testing only):
 *   <script src="https://fjmedia.ca/widget/fjchat.js"
 *     data-api-key="sk-ant-..."
 *     data-business="FJMedia"
 *     data-context="FJMedia builds custom websites for Winnipeg businesses in 48 hours..."
 *     data-accent="#c9a84c">
 *   </script>
 */
(function () {
  'use strict';

  /* ── CONFIG ── */
  const script = document.currentScript;
  const CFG = {
    endpoint:  script.getAttribute('data-endpoint')  || '',
    apiKey:    script.getAttribute('data-api-key')    || '',
    business:  script.getAttribute('data-business')   || 'our team',
    initials:  script.getAttribute('data-initials')   || '',
    context:   script.getAttribute('data-context')    || '',
    greeting:  script.getAttribute('data-greeting')   || '',
    accent:    script.getAttribute('data-accent')     || '#c9a84c',
    position:  script.getAttribute('data-position')   || 'right',
    model:     script.getAttribute('data-model')      || 'claude-sonnet-4-6',
  };

  // Auto-generate initials from business name if not set
  if (!CFG.initials) {
    CFG.initials = CFG.business.split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  if (!CFG.greeting) {
    CFG.greeting = `Hey! I'm your guide to working with ${CFG.business}. What kind of business do you run?`;
  }

  /* ── STATE ── */
  let isOpen = false;
  let leadCaptured = false;
  let leadName = '';
  let leadEmail = '';
  let messages = [];
  let isTyping = false;

  /* ── INJECT CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #fjchat-widget, #fjchat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }

    /* Bubble */
    #fjchat-bubble {
      position: fixed;
      bottom: 28px;
      ${CFG.position === 'left' ? 'left: 28px;' : 'right: 28px;'}
      width: 60px; height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${CFG.accent}, #e8c96d);
      border: none;
      color: #0b1120;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(201,168,76,0.35), 0 0 48px rgba(201,168,76,0.12);
      transition: transform 0.2s, box-shadow 0.2s;
      z-index: 99998;
    }
    #fjchat-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(201,168,76,0.45), 0 0 56px rgba(201,168,76,0.18); }
    #fjchat-bubble svg { width: 26px; height: 26px; fill: #0b1120; }
    #fjchat-bubble.open svg.chat-icon { display: none; }
    #fjchat-bubble.open svg.close-icon { display: block; }
    #fjchat-bubble:not(.open) svg.close-icon { display: none; }

    /* Notification dot */
    #fjchat-dot {
      position: absolute; top: -2px; right: -2px;
      width: 18px; height: 18px;
      background: #ef4444; border-radius: 50%;
      border: 2px solid #0b1120;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; color: #fff;
    }
    #fjchat-bubble.open #fjchat-dot { display: none; }

    /* Window */
    #fjchat-window {
      position: fixed;
      bottom: 100px;
      ${CFG.position === 'left' ? 'left: 28px;' : 'right: 28px;'}
      width: min(400px, calc(100vw - 24px));
      height: 560px;
      max-height: calc(100vh - 140px);
      border-radius: 20px;
      background: #151d2e;
      border: 1px solid rgba(255,255,255,0.06);
      box-shadow: 0 25px 60px rgba(0,0,0,0.55);
      display: flex; flex-direction: column;
      overflow: hidden;
      z-index: 99999;
      opacity: 0; transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    #fjchat-window.open {
      opacity: 1; transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* ── FLUSH-LEFT SYSTEM: 12px universal left inset ── */

    /* Header */
    .fjchat-header {
      padding: 20px 12px !important;
      background: #0b1120;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex; align-items: center; justify-content: space-between;
    }
    .fjchat-header-left {
      display: flex; align-items: center; gap: 3px !important;
      margin-left: 0 !important;
    }
    .fjchat-header-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${CFG.accent}, #e8c96d);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #0b1120;
      flex-shrink: 0;
      margin: 0 !important;
    }
    .fjchat-header-info { margin-left: 8px; }
    .fjchat-header-info h3 {
      font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px;
    }
    .fjchat-header-info p {
      font-size: 12px; color: #6b7280;
    }
    .fjchat-online {
      display: inline-block; width: 7px; height: 7px;
      background: #22c55e; border-radius: 50%;
      margin-right: 4px; vertical-align: middle;
      animation: fjchat-pulse 2s infinite;
    }
    @keyframes fjchat-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .fjchat-close {
      background: none; border: none; cursor: pointer;
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, color 0.2s;
      margin-right: 0;
    }
    .fjchat-close svg { width: 16px; height: 16px; stroke: #6b7280; stroke-width: 2.5; stroke-linecap: round; fill: none; }
    .fjchat-close:hover { background: rgba(255,255,255,0.08); }
    .fjchat-close:hover svg { stroke: #fff; }

    /* Messages — flush left, generous vertical gaps */
    .fjchat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 18px 12px !important;
      display: flex; flex-direction: column; gap: 16px;
      scroll-behavior: smooth;
    }
    .fjchat-messages::-webkit-scrollbar { width: 3px; }
    .fjchat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    .fjchat-msg-row {
      display: flex; gap: 6px; max-width: 85%;
      margin-left: 0 !important; margin-right: 0 !important;
      animation: fjchat-fadeIn 0.2s ease;
    }
    @keyframes fjchat-fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
    .fjchat-msg-row.assistant { align-self: flex-start; }
    .fjchat-msg-row.user { align-self: flex-end; flex-direction: row-reverse; }

    .fjchat-msg-av {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${CFG.accent}, #e8c96d);
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 700; color: #0b1120;
      flex-shrink: 0; margin: 2px 0 0 0 !important;
    }
    .fjchat-msg-av.hidden { visibility: hidden; }

    /* Bubbles — rounded, padded, shadowed */
    .fjchat-bubble {
      padding: 12px 16px !important;
      font-size: 14px;
      line-height: 1.6;
      word-wrap: break-word;
      box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    }
    .fjchat-msg-row.assistant .fjchat-bubble {
      background: #1c2640; color: #e2e8f0;
      border-radius: 4px 16px 16px 16px !important;
    }
    .fjchat-msg-row.user .fjchat-bubble {
      background: ${CFG.accent};
      color: #fff; font-weight: 500;
      border-radius: 16px 4px 16px 16px !important;
    }

    /* Typing indicator */
    .fjchat-typing-row {
      display: flex; gap: 6px; align-self: flex-start;
      margin-left: 0 !important;
      animation: fjchat-fadeIn 0.2s ease;
    }
    .fjchat-typing-bubble {
      background: #1c2640;
      border-radius: 4px 14px 14px 14px;
      padding: 12px 16px;
      display: flex; gap: 5px; align-items: center;
    }
    .fjchat-dot {
      width: 6px; height: 6px;
      background: #6b7280; border-radius: 50%;
      animation: fjchat-fade 1.4s ease-in-out infinite;
    }
    .fjchat-dot:nth-child(2) { animation-delay: 0.2s; }
    .fjchat-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes fjchat-fade { 0%,100%{opacity:0.25} 50%{opacity:1} }

    /* Input area — flush */
    .fjchat-input-area {
      padding: 14px 12px !important;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; gap: 10px;
      background: #0b1120;
    }
    .fjchat-input {
      flex: 1;
      background: #1c2640;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 0 16px;
      height: 48px;
      line-height: 48px;
      color: #e2e8f0;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .fjchat-input:focus { border-color: ${CFG.accent}; box-shadow: 0 0 0 3px rgba(201,168,76,0.15); }
    .fjchat-input::placeholder { color: #4b5563; }
    .fjchat-send {
      width: 48px; height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, ${CFG.accent}, #e8c96d);
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s, transform 0.15s;
    }
    .fjchat-send:hover { opacity: 0.88; transform: scale(1.05); }
    .fjchat-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .fjchat-send svg { width: 16px; height: 16px; fill: #0b1120; margin-left: 2px; }

    /* Lead capture — flush */
    .fjchat-lead {
      padding: 18px 12px !important;
      background: #0b1120;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; flex-direction: column; gap: 12px;
    }
    .fjchat-lead p {
      font-size: 13px; color: #9ca3af; line-height: 1.5;
    }
    .fjchat-lead input {
      background: #1c2640;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      color: #e2e8f0;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .fjchat-lead input:focus { border-color: ${CFG.accent}; box-shadow: 0 0 0 3px rgba(201,168,76,0.15); }
    .fjchat-lead input::placeholder { color: #4b5563; }
    .fjchat-lead button {
      background: linear-gradient(135deg, ${CFG.accent}, #e8c96d);
      color: #0b1120;
      border: none;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .fjchat-lead button:hover { opacity: 0.88; }
    .fjchat-lead .fjchat-skip {
      background: none; color: #6b7280;
      font-size: 11px; padding: 4px;
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.2s;
    }
    .fjchat-lead .fjchat-skip:hover { color: #9ca3af; }

    /* Powered by */
    .fjchat-powered {
      text-align: center;
      padding: 7px 12px;
      font-size: 9px;
      color: #4b5563;
      background: #0b1120;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      letter-spacing: 0.2px;
    }
    .fjchat-powered svg { width: 10px; height: 10px; stroke: #4b5563; fill: none; stroke-width: 2; flex-shrink: 0; }
    .fjchat-powered a { color: #6b7280; text-decoration: none; transition: color 0.2s; }
    .fjchat-powered a:hover { color: ${CFG.accent}; }

    /* Mobile */
    @media (max-width: 480px) {
      #fjchat-window {
        width: calc(100vw - 24px);
        ${CFG.position === 'left' ? 'left: 12px;' : 'right: 12px;'}
        bottom: 96px;
        height: calc(100vh - 130px);
      }
      #fjchat-bubble {
        ${CFG.position === 'left' ? 'left: 16px;' : 'right: 16px;'}
        bottom: 24px;
      }
    }
  `;
  document.head.appendChild(style);

  /* ── BUILD DOM ── */
  const wrapper = document.createElement('div');
  wrapper.id = 'fjchat-widget';
  wrapper.innerHTML = `
    <!-- Bubble -->
    <div id="fjchat-bubble" aria-label="Open chat">
      <svg class="chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      <svg class="close-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      <div id="fjchat-dot">1</div>
    </div>

    <!-- Chat Window -->
    <div id="fjchat-window">
      <div class="fjchat-header">
        <div class="fjchat-header-left">
          <div class="fjchat-header-avatar">${CFG.initials}</div>
          <div class="fjchat-header-info">
            <h3>${CFG.business} AI</h3>
            <p><span class="fjchat-online"></span>Online now &middot; Typically replies instantly</p>
          </div>
        </div>
        <button class="fjchat-close" id="fjchat-close"><svg viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button>
      </div>
      <div class="fjchat-messages" id="fjchat-messages"></div>
      <div id="fjchat-lead-form" class="fjchat-lead" style="display:none;">
        <p>Quick intro so we can follow up:</p>
        <input type="text" id="fjchat-lead-name" placeholder="Your name" autocomplete="given-name" />
        <input type="email" id="fjchat-lead-email" placeholder="Your email" autocomplete="email" />
        <button id="fjchat-lead-submit">Start chatting</button>
        <button class="fjchat-skip" id="fjchat-lead-skip">Skip for now</button>
      </div>
      <div class="fjchat-input-area" id="fjchat-input-area" style="display:none;">
        <input class="fjchat-input" id="fjchat-input" type="text" placeholder="Ask me anything..." autocomplete="off" />
        <button class="fjchat-send" id="fjchat-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="fjchat-powered"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>Secure &amp; Private</span> &middot; Powered by <a href="https://fjmedia.ca" target="_blank" rel="noopener">FJMedia AI</a></div>
    </div>
  `;
  document.body.appendChild(wrapper);

  /* ── ELEMENTS ── */
  const bubble     = document.getElementById('fjchat-bubble');
  const chatWindow = document.getElementById('fjchat-window');
  const msgArea    = document.getElementById('fjchat-messages');
  const inputArea  = document.getElementById('fjchat-input-area');
  const leadForm   = document.getElementById('fjchat-lead-form');
  const chatInput  = document.getElementById('fjchat-input');
  const sendBtn    = document.getElementById('fjchat-send');
  const closeBtn   = document.getElementById('fjchat-close');

  /* ── TOGGLE ── */
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    bubble.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('open', isOpen);
    removeDot();

    if (isOpen && messages.length === 0) {
      // First open — show typing then greeting
      setTimeout(() => {
        addMessage('assistant', CFG.greeting);
        if (!leadCaptured) {
          leadForm.style.display = 'flex';
          inputArea.style.display = 'none';
        }
      }, 400);
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    bubble.classList.remove('open');
    chatWindow.classList.remove('open');
  });

  function removeDot() {
    const dot = document.getElementById('fjchat-dot');
    if (dot) dot.style.display = 'none';
  }

  /* ── LEAD CAPTURE ── */
  document.getElementById('fjchat-lead-submit').addEventListener('click', () => {
    const name  = document.getElementById('fjchat-lead-name').value.trim();
    const email = document.getElementById('fjchat-lead-email').value.trim();
    if (!name) { document.getElementById('fjchat-lead-name').focus(); return; }
    leadName = name;
    leadEmail = email;
    leadCaptured = true;
    leadForm.style.display = 'none';
    inputArea.style.display = 'flex';
    chatInput.focus();
    addMessage('assistant', `Nice to meet you, ${leadName}! How can I help you today?`);
    logLead(leadName, leadEmail, 'chat_started');
  });

  document.getElementById('fjchat-lead-skip').addEventListener('click', () => {
    leadCaptured = true;
    leadName = 'Anonymous';
    leadEmail = '';
    leadForm.style.display = 'none';
    inputArea.style.display = 'flex';
    chatInput.focus();
    addMessage('assistant', 'No problem! How can I help you today?');
  });

  /* ── SEND MESSAGE ── */
  function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isTyping) return;
    addMessage('user', text);
    chatInput.value = '';
    getAIResponse(text);
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  /* ── ADD MESSAGE TO UI ── */
  function addMessage(role, content) {
    messages.push({ role, content });
    const row = document.createElement('div');
    row.className = `fjchat-msg-row ${role}`;

    if (role === 'assistant') {
      // Only show avatar on first message in a sequence from the same sender
      const prev = msgArea.querySelector('.fjchat-msg-row:last-child');
      const showAvatar = !prev || !prev.classList.contains('assistant');
      row.innerHTML = `<div class="fjchat-msg-av${showAvatar ? '' : ' hidden'}">${CFG.initials}</div><div class="fjchat-bubble">${escHtml(content)}</div>`;
    } else {
      row.innerHTML = `<div class="fjchat-bubble">${escHtml(content)}</div>`;
    }

    msgArea.appendChild(row);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* ── TYPING INDICATOR ── */
  function showTyping() {
    isTyping = true;
    sendBtn.disabled = true;
    const row = document.createElement('div');
    row.className = 'fjchat-typing-row';
    row.id = 'fjchat-typing';
    row.innerHTML = `<div class="fjchat-msg-av">${CFG.initials}</div><div class="fjchat-typing-bubble"><div class="fjchat-dot"></div><div class="fjchat-dot"></div><div class="fjchat-dot"></div></div>`;
    msgArea.appendChild(row);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function hideTyping() {
    isTyping = false;
    sendBtn.disabled = false;
    const el = document.getElementById('fjchat-typing');
    if (el) el.remove();
  }

  /* ── AI RESPONSE ── */
  async function getAIResponse(userText) {
    showTyping();

    try {
      let reply;

      if (CFG.endpoint) {
        reply = await fetchGAS(userText);
      } else if (CFG.apiKey) {
        reply = await fetchDirect(userText);
      } else {
        reply = "I'm having trouble connecting right now. Please call us or try again later!";
      }

      hideTyping();
      addMessage('assistant', reply);
    } catch (err) {
      hideTyping();
      addMessage('assistant', "Sorry, I'm having trouble right now. Please call us or try again in a moment!");
      console.error('FJChat error:', err);
    }
  }

  /* ── GAS PROXY FETCH ── */
  async function fetchGAS(userText) {
    const res = await fetch(CFG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'chat',
        message: userText,
        history: messages.slice(0, -1),
        leadName: leadName,
        leadEmail: leadEmail
      })
    });

    if (!res.ok) throw new Error('GAS proxy error');
    const data = await res.json();
    return data.reply || "Sorry, I couldn't process that. Try again!";
  }

  /* ── DIRECT ANTHROPIC FETCH ── */
  async function fetchDirect(userText) {
    const systemPrompt = buildSystemPrompt();

    const apiMessages = messages
      .filter((m, i) => !(m.role === 'assistant' && i < 2))
      .map(m => ({ role: m.role, content: m.content }));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CFG.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: CFG.model,
        max_tokens: 300,
        system: systemPrompt,
        messages: apiMessages
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API error');
    }

    const data = await res.json();
    return data.content?.[0]?.text || "Sorry, I couldn't process that.";
  }

  /* ── SYSTEM PROMPT BUILDER ── */
  function buildSystemPrompt() {
    let prompt = `You are a friendly, helpful chat assistant for ${CFG.business}. `;
    prompt += `Keep responses SHORT (2-3 sentences max). Be warm and conversational. `;
    prompt += `If someone asks something you don't know, say you'll have the team follow up. `;
    prompt += `Never make up information that wasn't provided to you. `;
    prompt += `Always try to guide the conversation toward booking a call or visiting the business.\n\n`;

    if (CFG.context) {
      prompt += `Here is everything you know about the business:\n${CFG.context}\n\n`;
    }

    if (leadName && leadName !== 'Anonymous') {
      prompt += `The visitor's name is ${leadName}. Use it naturally (not every message).\n`;
    }

    prompt += `If asked about pricing, say something like "I'd recommend chatting with our team for an exact quote — want me to help you get in touch?"`;

    return prompt;
  }

  /* ── LOG LEAD ── */
  function logLead(name, email, event) {
    if (!CFG.endpoint) return;
    fetch(CFG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'log_lead',
        name: name,
        email: email,
        event: event,
        page: window.location.href,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});
  }

  // Show notification dot after 8s if user hasn't opened yet
  setTimeout(() => {
    if (!isOpen) {
      const dot = document.getElementById('fjchat-dot');
      if (dot) dot.style.display = 'flex';
    }
  }, 8000);

})();
