import type { Express } from 'express';
import { pageRouter } from './page.js';

export const mountRoutes = (app: Express) => {
  app.use('/p', pageRouter);
};
