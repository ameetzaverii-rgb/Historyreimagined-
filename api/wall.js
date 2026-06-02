// API endpoint: the class collaboration wall.
//   GET  /api/wall?room=ROOM        -> newest 60 posts for that room
//   POST /api/wall  { room, name, avatar, tag, text }  -> add a post
import { sql, cors, ensureSchema } from './_neon.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureSchema();
    if (req.method === 'GET') {
      const room = String(req.query.room || 'class');
      const rows = await sql`
        SELECT name, avatar, tag, text, ts
        FROM wall_posts
        WHERE room = ${room}
        ORDER BY ts DESC
        LIMIT 60`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { room = 'class', name, avatar, tag, text } = req.body || {};
      if (!text || !String(text).trim()) return res.status(400).json({ error: 'text required' });
      const ts = Date.now();
      await sql`
        INSERT INTO wall_posts (room, name, avatar, tag, text, ts)
        VALUES (${room}, ${name || 'Student'}, ${avatar || '🧑'}, ${tag || 'Thought'}, ${String(text).slice(0, 800)}, ${ts})`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
}
