import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { rtkQueryErrorMiddleware } from './middleware/rtk-query-error.middleware';
import { rootReducer } from './root-reducer';
import { api } from './services/api/base-api';

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['api/executeQuery/pending', 'api/executeQuery/fulfilled'],
        },
      })
        .concat(api.middleware)
        .concat(rtkQueryErrorMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export function setupStoreListeners(store: AppStore): void {
  setupListeners(store.dispatch);
}
