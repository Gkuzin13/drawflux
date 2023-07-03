import type { Request } from 'express';
import * as QRCode from 'qrcode';
import { BadRequestError, Schemas } from 'shared';
import type { QRCodeResponse } from 'shared';
import { zodParse } from '@/utils/zod';

export async function generateQRCode(req: Request) {
  const body = await zodParse(Schemas.QRCodeRequestBody, req.body);

  try {
    const dataUrl = await QRCode.toDataURL(body.url);

    return { dataUrl } as QRCodeResponse;
  } catch (error) {
    throw new BadRequestError(JSON.stringify(error), 400);
  }
}
