CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_config JSONB NOT NULL,
  nodes JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);