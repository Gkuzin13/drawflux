import { HttpResponse, http, delay } from 'msw';
import { v4 as uuid } from 'uuid';
import { nodesGenerator, stateGenerator } from '../data-generators';
import { BASE_URL_DEV } from '@/constants/app';
import type {
  GetPageResponse,
  QRCodeResponse,
  SharePageResponse,
} from 'shared';

const mockPageId = uuid();

export const mockGetPageResponse: GetPageResponse = {
  page: {
    nodes: nodesGenerator(5),
    stageConfig: stateGenerator({}).canvas.present.stageConfig,
    id: mockPageId,
  },
};

export const mockSharePageResponse: SharePageResponse = {
  id: mockPageId,
};

export const mockQRCodeResponse: QRCodeResponse = {
  dataUrl: 'data:image/png',
};

export const handlers = [
  http.get(`${BASE_URL_DEV}/p/*`, async () => {
    await delay(150);

    return HttpResponse.json(mockGetPageResponse);
  }),
  http.post(`${BASE_URL_DEV}/p`, async () => {
    await delay(150);

    return HttpResponse.json(mockSharePageResponse);
  }),
  http.post(`${BASE_URL_DEV}/qrcode`, async () => {
    await delay(150);

    return HttpResponse.json(mockQRCodeResponse);
  }),
];
