import { Router } from 'express';
import { toDataURL } from 'qrcode';
import { BadRequestError, type GetQRCodeResponse } from 'shared';
import { loadRoute } from '../../utils/route/route';

const qrCodeRouter = Router();

qrCodeRouter.post(
  '/',
  loadRoute(async (req) => {
    const url = req.body?.url as string;

    try {
      const dataUrl = await toDataURL(url);

      return { dataUrl } as GetQRCodeResponse;
    } catch (error) {
      throw new BadRequestError(error as string, 400);
    }
  }),
);

export { qrCodeRouter };
