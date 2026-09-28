'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { setAuthCookie } from '@/lib/auth/client-auth-cookie';

import { authApi } from '../services';
import type { User } from '../services';

export type SessionState = {
  user: User | null;
  token: string | null;
};

const initialState: SessionState = {
  user: null,
  token: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      if (action.payload.token) {
        setAuthCookie(action.payload.token);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      if (action.payload.token) {
        setAuthCookie(action.payload.token);
      }
    });
  },
});

export const { setSession } = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;

export const sessionSelectors = {
  selectSession: (state: { session: SessionState }) => state.session.user,
};
