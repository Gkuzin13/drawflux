import type { Application } from 'express';
import { pageRoutes } from '@/features/Page/index';
import { qrCodeRoutes } from '@/features/QRCode/index';

export const appRoutes = (app: Application) => {
  app.use('/p', pageRoutes);
  app.use('/qrcode', qrCodeRoutes);
};
