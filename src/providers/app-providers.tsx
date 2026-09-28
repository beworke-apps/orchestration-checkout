'use client';

import { Toast } from '@heroui/react';

import SessionProvider from './session-provider';
import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <SessionProvider>
          {children}
          <Toast.Provider placement="bottom" />
        </SessionProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default AppProviders;
