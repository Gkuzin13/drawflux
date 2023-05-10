import { Router } from 'express';
import * as QRCode from 'qrcode';
import { BadRequestError, type GetQRCodeResponse } from 'shared';
import { loadRoute } from 'src/utils/route/route';

const qrCodeRouter = Router();

qrCodeRouter.post(
  '/',
  loadRoute(async (req) => {
    const url = req.body?.url as string;

    try {
      const dataUrl = await QRCode.toDataURL(url);

      return { dataUrl } as GetQRCodeResponse;
    } catch (error) {
      throw new BadRequestError(error as string, 400);
    }
  }),
);

export { qrCodeRouter };
