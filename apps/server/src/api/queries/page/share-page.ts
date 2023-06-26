import type { Request } from 'express';
import pg from 'pg';
import { BadRequestError, Schemas } from 'shared';
import { zodParse } from '../../../utils/parse/zod-parse';
import * as db from '../../database/index';

export type SharePageValues = [StageConfig: string, Nodes: string];
export type SharePageReturn = {
  id: string;
};

const query = `INSERT INTO pages (stage_config, nodes) VALUES ($1, $2) RETURNING id;`;

export async function sharePage(req: Request) {
  const client = await db.getClient();

  try {
    const body = await zodParse(Schemas.SharePageRequestBody, req.body);

    const { rows } = await db.query<SharePageReturn, SharePageValues>(query, [
      JSON.stringify(body.page.stageConfig),
      JSON.stringify(body.page.nodes),
    ]);

    return rows[0];
  } catch (error) {
    if (error instanceof pg.DatabaseError) {
      throw new BadRequestError('Invalid request body', 400);
    }
  } finally {
    client.release();
  }
}
