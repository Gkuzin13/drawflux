import type { Application } from 'express';
import { pageRouter } from './page/page';
import { qrCodeRouter } from './qrcode/qrcode';

export const mountRoutes = (app: Application) => {
  app.use('/p', pageRouter);
  app.use('/qrcode', qrCodeRouter);
};
