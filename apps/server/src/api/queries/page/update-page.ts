import type { Request } from 'express';
import pg from 'pg';
import { BadRequestError, Schemas } from 'shared';
import { zodParse } from 'src/utils/parse/zod-parse';
import * as db from '../../database/index';

export type UpdatePageValues = [PageId: string, Nodes: string];

export type UpdatePageReturn = {
  id: string;
};

const query = 'UPDATE pages SET nodes = $2 WHERE id = $1 RETURNING id;';

export async function updatePage(req: Request) {
  const body = await zodParse(Schemas.UpdatePageBody, req.body);

  const client = await db.getClient();

  try {
    const { rows } = await db.query<UpdatePageReturn, UpdatePageValues>(query, [
      req.params.id,
      JSON.stringify(body.nodes),
    ]);

    if (!rows.length) {
      throw new BadRequestError('Entry not found', 404);
    }

    return rows[0];
  } catch (error) {
    if (error instanceof pg.DatabaseError) {
      throw new BadRequestError('Entry not found', 404);
    }

    throw error;
  } finally {
    client.release();
  }
}
