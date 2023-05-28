import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  SharePageRequestBody,
  ServerResponse,
  GetPageResponse,
  SharePageResponse,
  QRCodeResponse,
  QRCodeRequestBody,
} from 'shared';
import { BASE_URL } from '@/constants/app';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? BASE_URL
        : 'http://localhost:7456/',
  }),
  endpoints: (builder) => ({
    getPage: builder.query<ServerResponse<GetPageResponse>, { id: string }>({
      query(params) {
        return {
          url: `/p/${params.id}`,
        };
      },
    }),
    sharePage: builder.mutation<
      ServerResponse<SharePageResponse>,
      SharePageRequestBody
    >({
      query(body) {
        return {
          url: '/p/',
          method: 'POST',
          body,
        };
      },
    }),
    getQRCode: builder.mutation<
      ServerResponse<QRCodeResponse>,
      QRCodeRequestBody
    >({
      query(body) {
        return {
          url: '/qrcode',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const { useSharePageMutation, useGetPageQuery, useGetQRCodeMutation } =
  api;
