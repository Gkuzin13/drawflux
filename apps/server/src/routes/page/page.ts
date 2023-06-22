import Router from 'express-promise-router';
import type { QueryResult } from 'pg';
import pg from 'pg';
import type { GetPageResponse, SharePageResponse } from 'shared';
import { BadRequestError, Schemas } from 'shared';
import * as db from '../../db/index';
import { queries } from '../../db/queries/index';
import type {
  SharePageArgs,
  GetPageArgs,
  PageRowObject,
} from '../../db/queries/types';
import { zodParse } from '../../utils/parse/zod-parse';
import { loadRoute } from '../../utils/route/route';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute(async (req) => {
    const params = await zodParse(Schemas.SharePageResponse, req.params);

    const client = await db.getClient();

    try {
      const result: QueryResult<PageRowObject[]> = await db.query<GetPageArgs>(
        queries.getPage,
        [params.id],
      );

      if (!result.rows.length) {
        throw new BadRequestError('Entry not found', 404);
      }

      return { page: result.rows[0] };
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
    const body = await zodParse(Schemas.SharePageRequestBody, req.body);

    const client = await db.getClient();

    try {
      const result: QueryResult<SharePageResponse> =
        await db.query<SharePageArgs>(queries.sharePage, [
          JSON.stringify(body.page.stageConfig),
          JSON.stringify(body.page.nodes),
        ]);

      return { id: result.rows[0].id };
    } catch (error) {
      if (error instanceof pg.DatabaseError) {
        throw new BadRequestError('Invalid request body', 400);
      }
    } finally {
      client.release();
    }
  }),
);

export { pageRouter };
