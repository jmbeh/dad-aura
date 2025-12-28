-- Dad Aura Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create aura_events table
CREATE TABLE IF NOT EXISTS aura_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emoji TEXT NOT NULL,
  points INTEGER NOT NULL,
  note TEXT,
  source TEXT NOT NULL CHECK (source IN ('sms', 'web', 'watch', 'shortcut')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient timestamp queries
CREATE INDEX IF NOT EXISTS idx_aura_events_timestamp ON aura_events(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE aura_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for MVP - no auth required)
-- In production, you'd want to add proper authentication
CREATE POLICY "Allow all operations on aura_events" ON aura_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE aura_events;

-- Create a view for daily totals (useful for trends)
-- View uses SECURITY INVOKER so it respects RLS policies of querying user
-- Explicitly set security_invoker to prevent SECURITY DEFINER property
DROP VIEW IF EXISTS daily_aura_totals CASCADE;
CREATE VIEW daily_aura_totals WITH (security_invoker = true) AS
SELECT 
  DATE(timestamp) as date,
  SUM(points) as daily_total,
  COUNT(*) as event_count,
  ARRAY_AGG(emoji ORDER BY timestamp) as emojis
FROM aura_events
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Diagnostic query to verify view security property (run separately if needed):
-- SELECT 
--   schemaname, 
--   viewname, 
--   viewowner,
--   definition
-- FROM pg_views 
-- WHERE viewname = 'daily_aura_totals';

-- Create a function to get current total aura
CREATE OR REPLACE FUNCTION get_current_aura_total()
RETURNS INTEGER 
LANGUAGE SQL 
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(SUM(points), 0)::INTEGER
  FROM aura_events;
$$;

-- Create a function to get aura total for a specific date range
CREATE OR REPLACE FUNCTION get_aura_total_for_range(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
RETURNS INTEGER 
LANGUAGE SQL 
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(SUM(points), 0)::INTEGER
  FROM aura_events
  WHERE timestamp >= start_date AND timestamp < end_date;
$$;

-- Create dad_flips table to track flip events
CREATE TABLE IF NOT EXISTS dad_flips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  previous_total INTEGER NOT NULL,
  flipped_total INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient date queries
CREATE INDEX IF NOT EXISTS idx_dad_flips_timestamp ON dad_flips(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE dad_flips ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on dad_flips" ON dad_flips
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE dad_flips;

-- Create flip_config table (single row configuration)
CREATE TABLE IF NOT EXISTS flip_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  max_flips_per_day INTEGER NOT NULL DEFAULT 2,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default configuration
INSERT INTO flip_config (id, max_flips_per_day) 
VALUES (1, 2)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE flip_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on flip_config" ON flip_config
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE flip_config;

-- Create a function to get today's flip count
CREATE OR REPLACE FUNCTION get_todays_flip_count()
RETURNS INTEGER 
LANGUAGE SQL 
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM dad_flips
  WHERE DATE(timestamp) = CURRENT_DATE;
$$;

-- Create a function to check if dad can flip today
CREATE OR REPLACE FUNCTION can_dad_flip_today()
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE
SET search_path = public
AS $$
  SELECT get_todays_flip_count() < (SELECT max_flips_per_day FROM flip_config WHERE id = 1);
$$;

-- Sample data for testing (optional - remove in production)
-- INSERT INTO aura_events (emoji, points, source, note) VALUES
--   ('🔥', 10, 'sms', 'Made amazing pancakes!'),
--   ('❤️', 5, 'sms', 'Love you dad'),
--   ('🎉', 15, 'web', 'Epic dad joke'),
--   ('💩', -5, 'sms', 'Forgot to pick me up'),
--   ('🌟', 8, 'sms', 'Helped with homework');

