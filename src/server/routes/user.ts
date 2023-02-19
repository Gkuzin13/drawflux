import Router from 'express-promise-router';
import { loadRoute, getQuery } from '../utils/string.js';
import * as db from '../../server/db/index.js';

const queries = {
  getUsers: getQuery('get-users'),
  getUser: getQuery('get-user'),
  postUser: getQuery('create-user'),
};

const userRouter = Router();

userRouter.get(
  '/',
  loadRoute(() => db.query(queries.getUsers, [])),
);

userRouter.get(
  '/:id',
  loadRoute((req) => {
    const { id } = req.params;
    return db.query(queries.getUser, [id]);
  }),
);

userRouter.post(
  '/',
  loadRoute((req) => {
    const { name, email } = req.body;

    return db.query(queries.postUser, [name, email]);
  }),
);

export { userRouter };
