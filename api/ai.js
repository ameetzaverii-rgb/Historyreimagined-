// API endpoint: the AI study buddy, powered by Google Gemini.
//   POST /api/ai  { prompt, system, context }  ->  { text } | { fallback:true }
//
// Needs the env var GEMINI_API_KEY (add it in Vercel → Settings → Environment
// Variables, just like DATABASE_URL). Get a free key at
// https://aistudio.google.com/app/apikey
//
// If the key is missing or the call fails, it returns { fallback:true } so the
// app can fall back to its built-in curated answers instead of erroring.
const MODEL = 'gemini-2.0-flash';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  // Health check: open /api/ai in a browser to see if the key is deployed.
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, geminiKeyConfigured: !!process.env.GEMINI_API_KEY, model: MODEL });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(200).json({ fallback: true, reason: 'no-key' });

  const { prompt = '', system = '', context = '' } = req.body || {};
  const sys = [
    system || 'You are Sage, a warm, witty owl who helps Indian school students learn history. Keep replies short, vivid, encouraging and age-appropriate.',
    context ? `\nUse ONLY this lesson content as your source of truth. If asked beyond it, gently relate back to it.\n--- LESSON ---\n${String(context).slice(0, 6000)}\n--- END ---` : '',
  ].join('');

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sys }] },
        contents: [{ role: 'user', parts: [{ text: String(prompt).slice(0, 2000) }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 700 },
      }),
    });
    const d = await r.json();
    const text = d?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || null;
    if (!text) return res.status(200).json({ fallback: true, reason: d?.error?.message || 'empty' });
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(200).json({ fallback: true, reason: String(e && e.message || e) });
  }
}
