import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SharePageParams } from '@shared';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7456/' }),
  endpoints: (builder) => ({
    sharePage: builder.mutation<SharePageParams['page'], SharePageParams>({
      query(body) {
        return {
          url: 'pages/',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const { useSharePageMutation } = api;
