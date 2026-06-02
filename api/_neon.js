// Shared Neon database client + CORS helper for the serverless API.
// Files beginning with "_" are NOT treated as routes by Vercel — they're helpers.
import { neon } from '@neondatabase/serverless';

// Lazily create the Neon client. Doing this lazily (instead of at import time)
// means a missing DATABASE_URL never CRASHES the function — the request just
// returns a clean error that the app can handle. `sql` is a Proxy so existing
// call sites keep working:  sql`SELECT 1`   and   sql.query('CREATE ...').
let _client;
function client() {
  if (!_client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL environment variable is not set in Vercel.');
    _client = neon(url);
  }
  return _client;
}
export const sql = new Proxy(function () {}, {
  apply(_t, _this, args) { return client()(...args); },          // tagged-template usage
  get(_t, prop) { const c = client(); const v = c[prop]; return typeof v === 'function' ? v.bind(c) : v; },
});

// Allow the web page to call this API from any origin (fine for a classroom app).
export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Auto-create the tables the first time the API is used, so nobody ever has to
// touch the SQL editor. CREATE ... IF NOT EXISTS is safe to run repeatedly.
let _schemaReady;
export function ensureSchema() {
  if (!_schemaReady) {
    _schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS wall_posts (
        id BIGSERIAL PRIMARY KEY, room TEXT NOT NULL, name TEXT, avatar TEXT,
        tag TEXT, text TEXT NOT NULL, ts BIGINT NOT NULL)`;
      await sql`CREATE INDEX IF NOT EXISTS wall_room_ts_idx ON wall_posts (room, ts DESC)`;
      await sql`CREATE TABLE IF NOT EXISTS folders (
        code TEXT PRIMARY KEY, owner TEXT, cards JSONB NOT NULL, ts BIGINT NOT NULL)`;
    })().catch(e => { _schemaReady = null; throw e; });
  }
  return _schemaReady;
}
