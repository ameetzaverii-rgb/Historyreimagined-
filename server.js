/* ============================================================================
   Local dev server — test the whole app + Neon API on your own machine with
   a single command:

        npm install
        node server.js

   then open  http://localhost:3000

   It serves the static site AND runs the same /api functions Vercel would,
   reading DATABASE_URL from your .env file. (For production, just deploy to
   Vercel — you don't need this file there.)
   ========================================================================== */
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';

// --- load .env (tiny parser, no dependency) BEFORE importing the API ---
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith('#') && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

// Import the API handlers AFTER env is loaded (they read DATABASE_URL on import).
const { default: wall } = await import('./api/wall.js');
const { default: folder } = await import('./api/folder.js');

// Convenience for the test phase: create the tables automatically on startup
// so you don't have to run db/schema.sql by hand. Safe to run repeatedly.
async function ensureSchema() {
  try {
    const { sql } = await import('./api/_neon.js');
    const schema = readFileSync('db/schema.sql', 'utf8');
    for (const stmt of schema.split(';')) {
      const s = stmt.trim();
      if (s && !s.startsWith('--')) await sql.query(s);
    }
    console.log('  ✓ database tables ready');
  } catch (e) {
    console.log('  ⚠ could not auto-create tables:', e.message);
    console.log('    (check DATABASE_URL in .env, then re-run — or paste db/schema.sql into the Neon SQL Editor)');
  }
}
await ensureSchema();

const PORT = process.env.PORT || 3000;
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

// Wrap Node's res in the small Vercel-style interface the handlers expect.
function vercelRes(nodeRes) {
  return {
    setHeader: (k, v) => nodeRes.setHeader(k, v),
    status(code) { nodeRes.statusCode = code; return this; },
    json(obj) { nodeRes.setHeader('Content-Type', 'application/json'); nodeRes.end(JSON.stringify(obj)); return this; },
    end() { nodeRes.end(); return this; },
  };
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);

  // ---- API routes ----
  if (u.pathname.startsWith('/api/')) {
    const query = Object.fromEntries(u.searchParams);
    let body = {};
    if (req.method === 'POST') {
      const chunks = []; for await (const c of req) chunks.push(c);
      try { body = JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch {}
    }
    const vreq = { method: req.method, query, body };
    const vres = vercelRes(res);
    try {
      if (u.pathname === '/api/wall') return await wall(vreq, vres);
      if (u.pathname === '/api/folder') return await folder(vreq, vres);
      return vres.status(404).json({ error: 'not found' });
    } catch (e) { return vres.status(500).json({ error: String(e) }); }
  }

  // ---- static files ----
  let p = u.pathname === '/' ? '/index.html' : u.pathname;
  const file = join(process.cwd(), decodeURIComponent(p).replace(/^\/+/, ''));
  if (existsSync(file) && !file.endsWith('.env')) {
    res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
    return res.end(readFileSync(file));
  }
  res.statusCode = 404; res.end('Not found');
});

server.listen(PORT, () => console.log(`\n  HistoryReimagined → http://localhost:${PORT}\n  (API + Neon active; press Ctrl+C to stop)\n`));
