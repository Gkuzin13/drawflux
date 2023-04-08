import Router from 'express-promise-router';
import { loadRoute } from '../utils/string.js';
import * as db from '../db/index.js';
import queries from '../db/queries/index.js';
import { QueryResult } from 'pg';
import { Schemas, SharePageParams } from '@shared/dist/index.js';
import { PageRowObject, SharePageArgs, GetPageArgs } from '../db/queries/types';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute(async (req) => {
    const client = await db.getClient();

    try {
      const { id } = req.params;
      const { rows }: QueryResult<PageRowObject> = await db.query<GetPageArgs>(
        queries.getPage,
        [id],
      );

      const { stage_config, nodes } = rows[0];

      return {
        stageConfig: stage_config,
        nodes,
      };
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  }),
);

pageRouter.post(
  '/',
  loadRoute(async (req) => {
    const client = await db.getClient();

    try {
      const { page }: SharePageParams = req.body;

      Schemas.Node.array().parse(page.nodes);

      const { rows }: QueryResult<PageRowObject> =
        await db.query<SharePageArgs>(queries.sharePage, [
          JSON.stringify(page.stageConfig),
          JSON.stringify(page.nodes),
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
