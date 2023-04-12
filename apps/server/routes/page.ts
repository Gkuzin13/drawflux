import Router from 'express-promise-router';
import pg, { QueryResult } from 'pg';
import { ZodError } from 'zod';
import { loadRoute } from '../utils/string.js';
import * as db from '../db/index.js';
import queries from '../db/queries/index.js';
import {
  Schemas,
  SharePageParams,
  BadRequestError,
  SharePageResponse,
  SharedPage,
} from '@shared/dist/index.js';
import { SharePageArgs, GetPageArgs, PageRowObject } from '../db/queries/types';

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

      if (!rows.length) {
        throw new BadRequestError('Entry not found', 404);
      }

      const { stage_config, nodes } = rows[0];

      return {
        page: {
          stageConfig: stage_config,
          nodes,
        },
      } as SharePageParams;
    } catch (error) {
      if (error instanceof pg.DatabaseError) {
        throw new BadRequestError('Entry not found', 404);
      }

      throw error;
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

      Schemas.StageConfig.parse(page.stageConfig);
      Schemas.Node.array().parse(page.nodes);

      const { rows }: QueryResult<SharePageResponse> =
        await db.query<SharePageArgs>(queries.sharePage, [
          JSON.stringify(page.stageConfig),
          JSON.stringify(page.nodes),
        ]);

      return { id: rows[0].id };
    } catch (error) {
      if (error instanceof pg.DatabaseError || error instanceof ZodError) {
        throw new BadRequestError('Invalid request body', 400);
      }
    } finally {
      client.release();
    }
  }),
);

export { pageRouter };
