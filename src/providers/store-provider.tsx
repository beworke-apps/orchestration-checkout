'use client';

import { Provider } from 'react-redux';

import { useEffect, useState } from 'react';

import type { AppStore } from '@/store';
import { makeStore, setupStoreListeners } from '@/store';

type StoreProviderProps = {
  children: React.ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    setupStoreListeners(store);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
