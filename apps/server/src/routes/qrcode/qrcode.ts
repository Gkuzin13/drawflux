import { Router } from 'express';
import * as QRCode from 'qrcode';
import { BadRequestError, Schemas, type QRCodeResponse } from 'shared';
import { zodParse } from '../../utils/parse/zod-parse';
import { loadRoute } from '../../utils/route/route';

const qrCodeRouter = Router();

qrCodeRouter.post(
  '/',
  loadRoute(async (req) => {
    const body = await zodParse(Schemas.QRCodeRequestBody, req.body);

    try {
      const dataUrl = await QRCode.toDataURL(body.url);

      return { dataUrl } as QRCodeResponse;
    } catch (error) {
      throw new BadRequestError(JSON.stringify(error), 400);
    }
  }),
);

export { qrCodeRouter };
