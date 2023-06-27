import Router from 'express-promise-router';
import { loadRoute } from '../../../utils/route/route';
import queries from '../../queries/index';

const pageRouter = Router();

pageRouter.get(
  '/:id',
  loadRoute((req) => queries.getPage(req.params.id)),
);
pageRouter.patch('/:id', loadRoute(queries.updatePage));
pageRouter.post('/', loadRoute(queries.sharePage));

export { pageRouter };
