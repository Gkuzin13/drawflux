const getPage = `SELECT id, stage_config "stageConfig", nodes FROM pages WHERE id = $1;`;

const updatePage = 'UPDATE pages SET nodes = $2 WHERE id = $1 RETURNING id;';

const sharePage = `INSERT INTO pages (stage_config, nodes) VALUES ($1, $2) RETURNING id;`;

const createPageTable = `CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_config JSONB NOT NULL,
  nodes JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`;

const deletePages = `DELETE FROM pages WHERE created_at < now()-'24 hours'::interval RETURNING *;`;

export const queries = {
  getPage,
  updatePage,
  sharePage,
  createPageTable,
  deletePages,
};
