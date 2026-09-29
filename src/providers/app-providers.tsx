'use client';

import { Toast } from '@heroui/react';

import StoreProvider from './store-provider';
import ThemeProvider from './theme-provider';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider>
        {children}
        <Toast.Provider placement="bottom" />
      </ThemeProvider>
    </StoreProvider>
  );
}

export default AppProviders;
