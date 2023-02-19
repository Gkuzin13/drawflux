import { userRouter } from './user.js';
import type { Express } from 'express';

export const mountRoutes = (app: Express) => {
  app.use('/users', userRouter);
};
