-- ============================================================================
-- HistoryReimagined — database schema (Neon / Postgres)
-- Run this ONCE in the Neon SQL Editor to create the tables the app needs.
-- (Neon dashboard -> your project -> "SQL Editor" -> paste -> Run.)
-- ============================================================================

-- The class collaboration wall: short posts students share with each other.
CREATE TABLE IF NOT EXISTS wall_posts (
  id     BIGSERIAL PRIMARY KEY,
  room   TEXT  NOT NULL,            -- which class/room the post belongs to
  name   TEXT,                      -- author display name
  avatar TEXT,                      -- author emoji avatar
  tag    TEXT,                      -- e.g. "Did You Know", "Question"
  text   TEXT  NOT NULL,            -- the message
  ts     BIGINT NOT NULL            -- millisecond timestamp
);

-- Fast lookups of the newest posts in a room.
CREATE INDEX IF NOT EXISTS wall_room_ts_idx ON wall_posts (room, ts DESC);

-- Shared "walkthrough folders" a student publishes under a short code so a
-- friend can load them by typing the code.
CREATE TABLE IF NOT EXISTS folders (
  code  TEXT PRIMARY KEY,           -- the share code
  owner TEXT,                       -- who made it
  cards JSONB NOT NULL,             -- the folder cards (array of objects)
  ts    BIGINT NOT NULL
);
