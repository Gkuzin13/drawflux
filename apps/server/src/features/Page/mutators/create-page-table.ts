import * as db from '@/database/index';

const query = `CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_config JSONB NOT NULL,
  nodes JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`;

export async function createPagesTable() {
  const client = await db.getClient();

  try {
    await db.query(query);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
}
