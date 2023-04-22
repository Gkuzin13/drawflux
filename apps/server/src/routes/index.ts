import type { Application } from 'express';
import { pageRouter } from './page/page.js';

export const mountRoutes = (app: Application) => {
  app.use('/p', pageRouter);
};
