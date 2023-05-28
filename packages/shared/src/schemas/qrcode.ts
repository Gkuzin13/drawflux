import { z } from 'zod';

export const QRCodeRequestBody = z.object({
  url: z.string().url(),
});

export const QRCodeResponse = z.object({
  dataUrl: z.string(),
});
