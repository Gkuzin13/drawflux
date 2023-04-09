import { pageRouter } from './page.js';
import type { Express } from 'express';

export const mountRoutes = (app: Express) => {
  app.use('/p', pageRouter);
};
