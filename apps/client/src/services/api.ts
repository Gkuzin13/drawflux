import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  type GetPageParams,
  type SharePageParams,
  type ServerResponse,
  type SharedPage,
  type SharePageResponse,
} from '@shared';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7456/' }),
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
