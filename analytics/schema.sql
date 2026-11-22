-- Run once against the Cloudflare D1 database.
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL CHECK (event_type IN ('visit', 'install')),
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time
  ON analytics_events (event_type, created_at);
