import Router from 'express-promise-router';
import { loadRoute } from '@/loaders/route/route';
import * as mutators from './mutators/index';
import * as queries from './queries/index';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute((req) => queries.getPage(req.params.id)),
);
pageRouter.patch('/:id', loadRoute(mutators.updatePage));
pageRouter.post('/', loadRoute(mutators.sharePage));

export default pageRouter;
