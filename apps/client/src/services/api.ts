import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetPageParams,
  SharePageParams,
  ServerResponse,
  SharedPage,
  SharePageResponse,
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
    getPage: builder.query<ServerResponse<SharedPage>, GetPageParams>({
      query(params) {
        return {
          url: `/p/${params.id}`,
        };
      },
    }),
    sharePage: builder.mutation<
      ServerResponse<SharePageResponse>,
      SharePageParams
    >({
      query(body) {
        return {
          url: '/p/',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const { useSharePageMutation, useGetPageQuery } = api;
