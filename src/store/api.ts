import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loginSuccess } from './authSlice';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://v2991160.hosted-by-vdsina.ru/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    me: builder.query({
      query: () => '/auth/me',
      transformResponse: (response: any) => {
        // Сохраняем токен в localStorage при получении данных пользователя
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSuccess(data));
        } catch (error) {
          // Обработка ошибки
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    
    // Rounds endpoints
    getRounds: builder.query({
      query: () => '/rounds',
    }),
    createRound: builder.mutation({
      query: () => ({
        url: '/rounds',
        method: 'POST',
      }),
    }),
    getRoundById: builder.query({
      query: (id) => `/rounds/${id}`,
    }),
    tapRound: builder.mutation({
      query: (id) => ({
        url: `/rounds/${id}/tap`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useLogoutMutation,
  useGetRoundsQuery,
  useCreateRoundMutation,
  useGetRoundByIdQuery,
  useTapRoundMutation,
} = api;