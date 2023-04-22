import Router from 'express-promise-router';
import type { QueryResult } from 'pg';
import pg from 'pg';
import type { SharePageParams, SharePageResponse } from 'shared';
import { BadRequestError, Schemas } from 'shared';
import { ZodError } from 'zod';
import * as db from '../../db/index.js';
import { queries } from '../../db/queries/index.js';
import type {
  SharePageArgs,
  GetPageArgs,
  PageRowObject,
} from '../../db/queries/types.js';
import { loadRoute } from '../../utils/route/route.js';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute(async (req) => {
    const client = await db.getClient();

    try {
      const { rows }: QueryResult<PageRowObject> = await db.query<GetPageArgs>(
        queries.getPage,
        [req.params.id],
      );

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
  }),
);

pageRouter.post(
  '/',
  loadRoute(async (req) => {
    const client = await db.getClient();

    try {
      const { page }: SharePageParams = req.body;

      await Schemas.StageConfig.parseAsync(page.stageConfig);
      await Schemas.Node.array().parseAsync(page.nodes);

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
