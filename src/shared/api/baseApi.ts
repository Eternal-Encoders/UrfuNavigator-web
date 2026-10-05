import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { runtimeConfig } from '@/shared/config';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: runtimeConfig.apiBaseUrl,
    }),
    endpoints: () => ({}),
});
