import { BASE_URL, BASE_URL_DEV, IS_PROD } from '@/constants/app';
import type {
  GetPageResponse,
  QRCodeRequestBody,
  QRCodeResponse,
  SharePageRequestBody,
  SharePageResponse,
  UpdatePageRequestBody,
  UpdatePageResponse,
} from 'shared';

const baseUrl = IS_PROD ? BASE_URL : BASE_URL_DEV;

class HTTPError extends Error {}

const createQuery = (
  baseUrl: RequestInfo | URL = '',
  baseInit?: RequestInit,
) => {
  return <T>(url: RequestInfo | URL, init?: RequestInit) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const result = fetch(`${baseUrl}${url}`, {
      ...baseInit,
      ...init,
      signal,
    }).then((res) => {
      if (!res.ok) {
        throw new HTTPError(res.statusText, { cause: res });
      }

      return res.json() as Promise<T>;
    });

    return [result, controller] as const;
  };
};

const query = createQuery(baseUrl, {
  headers: {
    'Content-Type': 'application/json',
  },
});

const makeRequest = (method: RequestInit['method']) => {
  return <TResponse = unknown, TBody = Record<string, unknown>>(
    url: RequestInfo | URL,
    body: TBody,
  ) => {
    return query<TResponse>(url, { method, body: JSON.stringify(body) });
  };
};

const api = {
  get: query,
  post: makeRequest('POST'),
  patch: makeRequest('PATCH'),
};

export default {
  getPage: (pageId: string) => {
    return api.get<GetPageResponse>(`/p/${pageId}`);
  },
  updatePage: (pageId: string, body: UpdatePageRequestBody) => {
    return api.patch<UpdatePageResponse>(`/p/${pageId}`, body);
  },
  sharePage: (body: SharePageRequestBody) => {
    return api.post<SharePageResponse>('/p', body);
  },
  makeQRCode: (body: QRCodeRequestBody) => {
    return api.post<QRCodeResponse>('/qrcode', body);
  },
};
