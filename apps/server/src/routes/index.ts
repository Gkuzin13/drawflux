import type { Application } from 'express';
import { pageRouter } from './page/page.js';
import { qrCodeRouter } from './qrcode/qrcode.js';

export const mountRoutes = (app: Application) => {
  app.use('/p', pageRouter);
  app.use('/qrcode', qrCodeRouter);
};
