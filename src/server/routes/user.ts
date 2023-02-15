import Router from 'express-promise-router';
import { getQuery } from '../utils/string.js';
import { query, loadRoute } from '../../server/db/index.js';

const queries = {
  getUsers: getQuery('get-users'),
  getUser: getQuery('get-user'),
  postUser: getQuery('post-user'),
};

const router = Router();

router.get(
  '/',
  loadRoute(async () => query(queries.getUsers, [])),
);

router.get(
  '/:id',
  loadRoute(async (req) => {
    const { id } = req.params;
    return query(queries.getUser, [id]);
  }),
);

router.post(
  '/',
  loadRoute(async (req) => {
    const { name, email } = req.body;

    return query(queries.postUser, [name, email]);
  }),
);

export { router };
