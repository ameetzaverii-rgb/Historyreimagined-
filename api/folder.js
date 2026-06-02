// API endpoint: share / load a walkthrough folder by code.
//   GET  /api/folder?code=CODE                -> { owner, cards } or null
//   POST /api/folder { code, owner, cards }    -> publish (upsert)
import { sql, cors } from './_neon.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const code = String(req.query.code || '').toLowerCase();
      if (!code) return res.status(400).json({ error: 'code required' });
      const rows = await sql`SELECT owner, cards FROM folders WHERE code = ${code}`;
      return res.status(200).json(rows[0] || null);
    }

    if (req.method === 'POST') {
      const { code, owner, cards } = req.body || {};
      if (!code || !Array.isArray(cards)) return res.status(400).json({ error: 'code and cards required' });
      const ts = Date.now();
      await sql`
        INSERT INTO folders (code, owner, cards, ts)
        VALUES (${String(code).toLowerCase()}, ${owner || 'A student'}, ${JSON.stringify(cards)}::jsonb, ${ts})
        ON CONFLICT (code) DO UPDATE
          SET owner = EXCLUDED.owner, cards = EXCLUDED.cards, ts = EXCLUDED.ts`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
}
