import { router as users } from './user.js';
import type { Express } from 'express';

export const mountRoutes = (app: Express) => {
  app.use('/users', users);
};
