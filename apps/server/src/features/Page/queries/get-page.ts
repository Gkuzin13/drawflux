import pg from 'pg';
import { BadRequestError, type NodeObject, type StageConfig } from 'shared';
import * as db from '@/database/index';

export type GetPageValues = [PageId: string];
export type GetPageReturn = {
  id: string;
  stageConfig: StageConfig;
  nodes: NodeObject[];
};

const query = `SELECT id, stage_config "stageConfig", nodes FROM pages WHERE id = $1;`;

export async function getPage(id: string) {
  const client = await db.getClient();

  try {
    const { rows } = await db.query<GetPageReturn, GetPageValues>(query, [id]);

    if (!rows.length) {
      throw new BadRequestError('Entry not found', 404);
    }

    return { page: rows[0] };
  } catch (error) {
    if (error instanceof pg.DatabaseError) {
      throw new BadRequestError('Entry not found', 404);
    }

    throw error;
  } finally {
    client.release();
  }
}
