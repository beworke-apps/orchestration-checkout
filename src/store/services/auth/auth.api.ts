import { setSession } from '@/store/slices';

import { api } from '../api/base-api';
import type { Session, SignInDto, SignInResponse } from './auth.types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSession: builder.query<Session, { token: string }>({
      query: () => {
        return {
          url: '/auth/session',
          method: 'POST',
        };
      },
      providesTags: [{ type: 'Auth', id: 'SESSION' }],
    }),
    signIn: builder.mutation<SignInResponse, SignInDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.token) {
            dispatch(setSession({ user: data.user, token: data.token }));
            window.location.href = '/';
          }
        } catch {}
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetSessionQuery, useLazyGetSessionQuery, useSignInMutation } = authApi;
