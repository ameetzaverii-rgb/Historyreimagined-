/* ============================================================================
   Ai — thin client for the Gemini-backed /api/ai endpoint.
   Returns text, or null if the AI isn't available (so callers can fall back to
   curated content). Tracks the chapter the reader is currently in, so answers
   can be "grounded" like NotebookLM.
   ========================================================================== */
const Ai = (() => {
  const base = (typeof window.API_BASE === 'string') ? window.API_BASE : null;
  let _probed = null; // null=unknown, true/false once we've learned

  window.readerContext = { title: '', text: '' };

  async function ask(prompt, opts = {}) {
    if (base === null) return null; // running as a local file, no endpoint
    try {
      const r = await fetch(`${base}/api/ai`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          system: opts.system || `You are Sage, a warm, witty owl tutor for an Indian school student in Class ${(window.State && State.grade) || 9}. Be brief, vivid and encouraging.`,
          context: opts.context !== undefined ? opts.context : (window.readerContext.title ? `Chapter: ${window.readerContext.title}\n${window.readerContext.text}` : ''),
        }),
      });
      const d = await r.json();
      _probed = !d.fallback;
      return d && d.text ? d.text : null;
    } catch { _probed = false; return null; }
  }

  return { ask, get likelyOn() { return base !== null && _probed !== false; } };
})();
