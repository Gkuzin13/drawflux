import Router from 'express-promise-router';
import { loadRoute, getQuery } from '../utils/string.js';
import * as db from '../db/index.js';
import { Schemas } from '../../../packages/shared/dist/index.js';

const queries = {
  getPage: getQuery('get-page'),
  sharePage: getQuery('share-page'),
};

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute((req) => {
    const { id } = req.params;
    return db.query(queries.getPage, [id]);
  }),
);

pageRouter.post(
  '/',
  loadRoute(async (req) => {
    const { page } = req.body;

    try {
      const { stageConfig, nodes } = JSON.parse(JSON.stringify(page));

      Schemas.Node.array().parse(nodes);

      return db.query(queries.sharePage, [
        JSON.stringify(stageConfig),
        JSON.stringify(nodes),
      ]);
    } catch (error) {
      return new Promise((resolve) => {
        return resolve;
      });
    }
  }),
);

export { pageRouter };
