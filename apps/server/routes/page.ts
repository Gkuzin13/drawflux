import Router from 'express-promise-router';
import { loadRoute } from '../utils/string.js';
import * as db from '../db/index.js';
import { Schemas } from '../../../packages/shared/dist/index.js';
import { QueryResultBase } from 'pg';
import queries from '../db/queries/index.js';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute<QueryResultBase>(async (req) => {
    const { id } = req.params;
    const { rows } = await db.query(queries.getPage, [id]);
    return rows[0];
  }),
);

pageRouter.post(
  '/',
  loadRoute(async (req) => {
    const client = await db.getClient();

    try {
      const { page } = req.body;

      const { stageConfig, nodes } = JSON.parse(JSON.stringify(page));

      Schemas.Node.array().parse(nodes);

      const { rows } = await db.query(queries.sharePage, [
        JSON.stringify(stageConfig),
        JSON.stringify(nodes),
      ]);

      return rows[0];
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  }),
);

export { pageRouter };
