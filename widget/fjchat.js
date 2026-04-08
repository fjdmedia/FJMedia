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
    context:   script.getAttribute('data-context')    || '',
    greeting:  script.getAttribute('data-greeting')   || '',
    accent:    script.getAttribute('data-accent')     || '#c9a84c',
    position:  script.getAttribute('data-position')   || 'right',
    model:     script.getAttribute('data-model')      || 'claude-sonnet-4-6',
  };

  if (!CFG.greeting) {
    CFG.greeting = `Hi! I'm ${CFG.business}'s assistant. Ask me anything about our services.`;
  }

  /* ── STATE ── */
  let isOpen = false;
  let leadCaptured = false;
  let leadName = '';
  let leadEmail = '';
  let messages = [];        // { role: 'user'|'assistant', content: string }
  let isTyping = false;

  /* ── INJECT CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Reset inside widget */
    #fjchat-widget, #fjchat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }

    /* Bubble */
    #fjchat-bubble {
      position: fixed;
      bottom: 24px;
      ${CFG.position === 'left' ? 'left: 24px;' : 'right: 24px;'}
      width: 60px; height: 60px;
      border-radius: 50%;
      background: ${CFG.accent};
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      transition: transform 0.2s, box-shadow 0.2s;
      z-index: 99998;
    }
    #fjchat-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,0.35); }
    #fjchat-bubble svg { width: 28px; height: 28px; fill: #fff; }
    #fjchat-bubble.open svg.chat-icon { display: none; }
    #fjchat-bubble.open svg.close-icon { display: block; }
    #fjchat-bubble:not(.open) svg.close-icon { display: none; }

    /* Notification dot */
    #fjchat-dot {
      position: absolute; top: -2px; right: -2px;
      width: 14px; height: 14px;
      background: #EF4444; border-radius: 50%;
      border: 2px solid #fff;
      animation: fjchat-pulse 2s infinite;
    }
    #fjchat-bubble.open #fjchat-dot { display: none; }
    @keyframes fjchat-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }

    /* Window */
    #fjchat-window {
      position: fixed;
      bottom: 100px;
      ${CFG.position === 'left' ? 'left: 24px;' : 'right: 24px;'}
      width: 380px;
      max-height: 520px;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 12px 48px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      overflow: hidden;
      z-index: 99999;
      opacity: 0; transform: translateY(16px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.25s, transform 0.25s;
    }
    #fjchat-window.open {
      opacity: 1; transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* Header */
    .fjchat-header {
      background: ${CFG.accent};
      color: #fff;
      padding: 18px 20px;
      display: flex; align-items: center; gap: 12px;
    }
    .fjchat-header-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700;
      flex-shrink: 0;
    }
    .fjchat-header-info h3 {
      font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 2px;
    }
    .fjchat-header-info p {
      font-size: 12px; opacity: 0.85;
    }

    /* Messages */
    .fjchat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      min-height: 200px;
      max-height: 320px;
      background: #f8f8f8;
    }
    .fjchat-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      animation: fjchat-fadeIn 0.2s ease;
    }
    @keyframes fjchat-fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
    .fjchat-msg.assistant {
      background: #fff;
      color: #333;
      border: 1px solid #e8e8e8;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .fjchat-msg.user {
      background: ${CFG.accent};
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    /* Typing indicator */
    .fjchat-typing {
      display: flex; gap: 4px; align-items: center;
      padding: 10px 14px;
      background: #fff; border: 1px solid #e8e8e8;
      border-radius: 14px; border-bottom-left-radius: 4px;
      align-self: flex-start;
      max-width: 60px;
    }
    .fjchat-typing span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #aaa;
      animation: fjchat-bounce 1.4s infinite;
    }
    .fjchat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .fjchat-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes fjchat-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

    /* Input area */
    .fjchat-input-area {
      display: flex; align-items: center;
      padding: 12px 14px;
      border-top: 1px solid #eee;
      background: #fff;
      gap: 8px;
    }
    .fjchat-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      background: #f8f8f8;
      color: #333;
      transition: border-color 0.2s;
    }
    .fjchat-input:focus { border-color: ${CFG.accent}; }
    .fjchat-input::placeholder { color: #999; }
    .fjchat-send {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: ${CFG.accent};
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }
    .fjchat-send:hover { opacity: 0.85; }
    .fjchat-send:disabled { opacity: 0.4; cursor: default; }
    .fjchat-send svg { width: 18px; height: 18px; fill: #fff; }

    /* Lead capture */
    .fjchat-lead {
      padding: 20px;
      background: #fff;
      display: flex; flex-direction: column; gap: 10px;
    }
    .fjchat-lead p {
      font-size: 14px; color: #555; line-height: 1.5;
    }
    .fjchat-lead input {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      color: #333;
      background: #f8f8f8;
      transition: border-color 0.2s;
    }
    .fjchat-lead input:focus { border-color: ${CFG.accent}; }
    .fjchat-lead button {
      background: ${CFG.accent};
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 11px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .fjchat-lead button:hover { opacity: 0.88; }
    .fjchat-lead .fjchat-skip {
      background: none; color: #999;
      font-size: 12px; padding: 4px;
      text-decoration: underline;
    }

    /* Powered by */
    .fjchat-powered {
      text-align: center;
      padding: 6px;
      font-size: 11px;
      color: #bbb;
      background: #fff;
    }
    .fjchat-powered a { color: #999; text-decoration: none; }
    .fjchat-powered a:hover { color: ${CFG.accent}; }

    /* Mobile */
    @media (max-width: 480px) {
      #fjchat-window {
        width: calc(100vw - 24px);
        ${CFG.position === 'left' ? 'left: 12px;' : 'right: 12px;'}
        bottom: 90px;
        max-height: 70vh;
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
      <svg class="chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>
      <svg class="close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      <div id="fjchat-dot"></div>
    </div>

    <!-- Chat Window -->
    <div id="fjchat-window">
      <div class="fjchat-header">
        <div class="fjchat-header-avatar">${CFG.business.charAt(0).toUpperCase()}</div>
        <div class="fjchat-header-info">
          <h3>${CFG.business}</h3>
          <p>Usually replies instantly</p>
        </div>
      </div>
      <div class="fjchat-messages" id="fjchat-messages"></div>
      <div id="fjchat-lead-form" class="fjchat-lead" style="display:none;">
        <p>Before we chat, quick intro so we can follow up:</p>
        <input type="text" id="fjchat-lead-name" placeholder="Your name" autocomplete="given-name" />
        <input type="email" id="fjchat-lead-email" placeholder="Your email" autocomplete="email" />
        <button id="fjchat-lead-submit">Start chatting</button>
        <button class="fjchat-skip" id="fjchat-lead-skip">Skip for now</button>
      </div>
      <div class="fjchat-input-area" id="fjchat-input-area" style="display:none;">
        <input class="fjchat-input" id="fjchat-input" type="text" placeholder="Type a message..." autocomplete="off" />
        <button class="fjchat-send" id="fjchat-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="fjchat-powered">Powered by <a href="https://fjmedia.ca" target="_blank" rel="noopener">FJMedia</a></div>
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

  /* ── TOGGLE ── */
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    bubble.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('open', isOpen);

    if (isOpen && messages.length === 0) {
      // First open — show greeting + lead form
      addMessage('assistant', CFG.greeting);
      if (!leadCaptured) {
        leadForm.style.display = 'flex';
        inputArea.style.display = 'none';
      }
    }
  });

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
    // Log lead
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
    const div = document.createElement('div');
    div.className = `fjchat-msg ${role}`;
    div.textContent = content;
    msgArea.appendChild(div);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  /* ── TYPING INDICATOR ── */
  function showTyping() {
    isTyping = true;
    sendBtn.disabled = true;
    const div = document.createElement('div');
    div.className = 'fjchat-typing';
    div.id = 'fjchat-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgArea.appendChild(div);
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
        // GAS proxy mode (production — for client sites)
        reply = await fetchGAS(userText);
      } else if (CFG.apiKey) {
        // Direct Anthropic mode (demo/testing only)
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
        history: messages.slice(0, -1), // exclude the message we just added
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

    // Build conversation for API (skip greeting messages from assistant)
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
    // Fire-and-forget to GAS
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

})();
