import { Router } from 'express';
import { loadRoute } from '@/loaders/route/route';
import * as mutators from './mutators/index';

const qrCodeRouter = Router();

qrCodeRouter.post('/', loadRoute(mutators.generateQRCode));

export default qrCodeRouter;
