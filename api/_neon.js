// Shared Neon database client + CORS helper for the serverless API.
// Files beginning with "_" are NOT treated as routes by Vercel — they're helpers.
import { neon } from '@neondatabase/serverless';

// DATABASE_URL is your Neon connection string. NEVER hard-code it here — set it
// as an environment variable in your host (Vercel/Netlify) so it stays secret.
export const sql = neon(process.env.DATABASE_URL);

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
    })();
  }
  return _schemaReady;
}

// Allow the web page to call this API from any origin (fine for a classroom app).
export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
