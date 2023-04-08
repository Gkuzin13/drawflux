CREATE TABLE IF NOT EXISTS page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_config JSONB NOT NULL,
  nodes JSONB NOT NULL
);