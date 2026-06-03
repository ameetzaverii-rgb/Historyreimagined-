/* ============================================================================
   Guide (Sage) — the living companion + AI study buddy.
   • Bobs in the corner, blinks, reacts and celebrates.
   • Tap to chat: grounded answers via Gemini (Ai.ask), with curated fallbacks.
   ========================================================================== */
const Guide = (() => {
  const $ = id => document.getElementById(id);
  let bubbleT, greeted = false, history = [];

  function init() {
    setTimeout(() => {
      if (greeted) return; greeted = true;
      say(`Hi ${(window.State && State.name) || 'there'}! I’m <b>Sage</b> 🦉 Tap me anytime — I can summarise a page, quiz you, or explain things simply.`, 6500);
    }, 1600);
  }

  /* ---- speech bubble ---- */
  function say(html, ms = 4200) {
    const b = $('guideBubble'); if (!b) return;
    b.innerHTML = html; b.classList.add('show');
    clearTimeout(bubbleT); bubbleT = setTimeout(() => b.classList.remove('show'), ms);
  }
  function celebrate(html) { say(html, 4200); confetti(); }
  function react(kind) {
    const lines = {
      scene: ['Nice — another page down! 📖', 'You’re really getting this. Keep going!', 'Love it. The story’s just getting good…'],
      quiz: ['Boom! That’s correct 🎯', 'Brilliant. You’ve got this!', 'Yes! History detective at work 🔍'],
      badge: ['New badge! You’re on a roll 🏅', 'Achievement unlocked — proud of you!'],
      finish: ['You finished the book! Incredible work 🌟'],
    };
    const arr = lines[kind] || ['Great work!'];
    celebrate(arr[Math.floor(Math.random() * arr.length)]);
  }

  /* ---- confetti ---- */
  function confetti() {
    const c = document.createElement('div'); c.className = 'confetti';
    const cols = ['#00D8B9', '#073393', '#FF934F', '#FFB2E6', '#A682FF'];
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = cols[i % cols.length];
      p.style.setProperty('--d', (1.6 + Math.random() * 1.4) + 's');
      p.style.animationDelay = (Math.random() * .3) + 's';
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3200);
  }

  /* ---- chat ---- */
  function toggle() { const el = $('guideChat'); el.classList.contains('open') ? close() : open(); }
  function open() {
    $('guideChat').classList.add('open');
    $('guideBubble').classList.remove('show');
    if (!history.length) {
      const where = window.readerContext && window.readerContext.title;
      addMsg('sage', where ? `We’re reading <b>${esc(where)}</b>. Ask me anything about it, or tap a shortcut above. ✨` : `Ask me anything about this module — or open the book and I’ll help as you read!`);
    }
  }
  function close() { $('guideChat').classList.remove('open'); }

  const CHIPS = {
    summary: { label: '✨ Summarise this', prompt: 'Summarise this page for me in 3 short, clear sentences a student can remember.' },
    quiz: { label: '🎯 Quiz me', prompt: 'Ask me ONE short quiz question about this page. Wait for my answer before telling me if I’m right.' },
    simple: { label: '🧒 Explain simply', prompt: 'Explain this page very simply, like I’m 10 years old, in a few friendly sentences.' },
    why: { label: '🌍 Why it matters', prompt: 'In 2 sentences, why does this page matter for the world today, especially for India?' },
  };
  function chip(kind) { const c = CHIPS[kind]; if (c) ask(c.prompt, c.label); }

  function onKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }
  function send() { const t = $('gcInput'); const v = t.value.trim(); if (!v) return; t.value = ''; ask(v); }

  async function ask(prompt, displayAs) {
    addMsg('me', esc(displayAs || prompt));
    const thinking = addMsg('sage', `<div class="gc-think"><span></span><span></span><span></span></div>`, true);
    $('guideOrb') && $('guideOrb').classList.add('think');
    let text = null;
    try { text = await Ai.ask(prompt); } catch {}
    if (!text) text = fallback(prompt);
    thinking.querySelector('.gc-bub').innerHTML = format(text);
    $('guideOrb') && $('guideOrb').classList.remove('think');
    $('gcMsgs').scrollTop = 99999;
    if (typeof gainXP === 'function') gainXP(4);
  }

  // curated fallback when the AI key isn't set / call fails
  function fallback(prompt) {
    const ctx = window.readerContext || {};
    const p = prompt.toLowerCase();
    if (p.includes('summar')) return ctx.text ? `Here’s the short version of <b>${esc(ctx.title)}</b>: ${esc(ctx.text.split('. ').slice(0, 2).join('. '))}.` : 'Open a chapter and tap “Summarise this” — I’ll pull out the key points for you.';
    if (p.includes('quiz')) return 'Quick one: <b>What single event in 1914 set off the First World War?</b> (Type your answer!)';
    if (p.includes('simply') || p.includes('10 years')) return ctx.title ? `In simple words: ${esc(ctx.title)} is about how big choices and events pushed the world toward war — and why that still matters today.` : 'Think of history as a chain of choices — pull one link and the next moves. That’s what we’re exploring!';
    if (p.includes('matter')) return 'It matters because the world you live in — the UN, human rights, even India’s freedom in 1947 — was shaped by exactly these events.';
    return 'Great question! Tip: add your Gemini key in Vercel and I’ll answer anything in depth. For now, try the shortcut buttons above me. 🦉';
  }

  function format(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }
  function addMsg(role, html, raw) {
    const m = $('gcMsgs'); const d = document.createElement('div'); d.className = 'gc-msg ' + (role === 'me' ? 'me' : 'sage');
    const av = role === 'me' ? `<div class="gc-mav" style="background:var(--bg3)">${(window.State && State.avatar) || '🧑'}</div>` : `<div class="gc-mav">${OWL}</div>`;
    d.innerHTML = `${av}<div class="gc-bub">${raw ? html : html}</div>`;
    m.appendChild(d); m.scrollTop = 99999; return d;
  }

  const OWL = `<svg class="owl" viewBox="0 0 64 64"><path d="M17 13l8 8-11 2z" fill="#06246b"/><path d="M47 13l-8 8 11 2z" fill="#06246b"/><ellipse cx="32" cy="37" rx="20" ry="22" fill="#0a47b8"/><ellipse cx="32" cy="41" rx="12.5" ry="15" fill="#0d57d8"/><circle cx="24" cy="31" r="9" fill="#fff"/><circle cx="40" cy="31" r="9" fill="#fff"/><circle class="pupil" cx="24" cy="32" r="4.2" fill="#16213a"/><circle class="pupil" cx="40" cy="32" r="4.2" fill="#16213a"/><circle cx="22.4" cy="30.4" r="1.5" fill="#fff"/><circle cx="38.4" cy="30.4" r="1.5" fill="#fff"/><path d="M32 35l4 5h-8z" fill="#FF934F"/></svg>`;
  function owl() { return OWL; }

  return { init, say, celebrate, react, toggle, open, close, chip, send, onKey, owl };
})();
