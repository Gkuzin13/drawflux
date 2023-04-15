const getPage = `SELECT id, stage_config "stageConfig", nodes FROM pages WHERE id = $1;`;

const sharePage = `INSERT INTO pages (stage_config, nodes) VALUES ($1, $2) RETURNING *;`;

const createPageTable = `CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_config JSONB NOT NULL,
  nodes JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`;

const deletePages = `DELETE FROM pages WHERE created_at < now()-'24 hours'::interval RETURNING *;`;

export const queries = {
  getPage,
  sharePage,
  createPageTable,
  deletePages,
};
