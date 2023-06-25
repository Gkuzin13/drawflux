import Router from 'express-promise-router';
import pg from 'pg';
import { BadRequestError, Schemas } from 'shared';
import * as db from '../../db/index';
import { queries } from '../../db/queries/index';
import type {
  GetPageValues,
  SharePageReturn,
  GetPageReturn,
  SharePageValues,
  UpdatePageReturn,
  UpdatePageValues,
} from '../../db/queries/types';
import { zodParse } from '../../utils/parse/zod-parse';
import { loadRoute } from '../../utils/route/route';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute(async (req) => {
    const client = await db.getClient();

    try {
      const { rows } = await db.query<GetPageReturn, GetPageValues>(
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

pageRouter.patch(
  '/:id',
  loadRoute(async (req) => {
    const body = await zodParse(Schemas.UpdatePageBody, req.body);

    const client = await db.getClient();

    try {
      const { rows } = await db.query<UpdatePageReturn, UpdatePageValues>(
        queries.updatePage,
        [req.params.id, JSON.stringify(body.nodes)],
      );

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
  }),
);

pageRouter.post(
  '/',
  loadRoute(async (req) => {
    const body = await zodParse(Schemas.SharePageRequestBody, req.body);

    const client = await db.getClient();

    try {
      const { rows } = await db.query<SharePageReturn, SharePageValues>(
        queries.sharePage,
        [
          JSON.stringify(body.page.stageConfig),
          JSON.stringify(body.page.nodes),
        ],
      );

      return rows[0];
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
