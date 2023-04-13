import {
  Schemas,
  type SharePageParams,
  BadRequestError,
  type SharePageResponse,
} from '@shared/dist/index.js';
import Router from 'express-promise-router';
import type { QueryResult } from 'pg';
import pg from 'pg';
import { ZodError } from 'zod';
import * as db from '../db/index.js';
import queries from '../db/queries/index.js';
import {
  type SharePageArgs,
  type GetPageArgs,
  type PageRowObject,
} from '../db/queries/types';
import { loadRoute } from '../utils/route.js';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute<SharePageParams>(async (req) => {
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

      const { stageConfig, nodes } = rows[0];

      return {
        page: {
          stageConfig: stageConfig,
          nodes,
        },
      };
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
