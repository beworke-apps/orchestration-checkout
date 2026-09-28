'use client';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { REDIRECT_SIGN_OUT_ROUTE, publicRoutes } from '@/config/public-routes';
import { getAuthCookie, removeAuthCookie } from '@/lib/auth/client-auth-cookie';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetStateAction } from '@/store/root-reducer';
import { api, useLazyGetSessionQuery } from '@/store/services';
import type { User } from '@/store/services';

interface SessionProviderProps {
  children: React.ReactNode;
}

type SessionContextType = {
  onSignOut: () => void;
  isLoading: boolean;
  user: User | null;
};

export const SessionContext = createContext<SessionContextType>({
  onSignOut: () => {},
  isLoading: false,
  user: null,
});

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.session);
  const token = getAuthCookie();
  const sessionInitStarted = useRef(false);

  const publicRoute = publicRoutes.find((item) => pathname.startsWith(item.path));

  const [getSession, { isLoading: getSessionLoading }] = useLazyGetSessionQuery();

  const onSignOut = useCallback(() => {
    removeAuthCookie();
    dispatch(resetStateAction());
    dispatch(api.util.resetApiState());
    window.location.href = REDIRECT_SIGN_OUT_ROUTE;
  }, [dispatch]);

  const initiateSession = useCallback(async () => {
    if (token) {
      if (publicRoute) {
        if (publicRoute.whenAuthenticated === 'redirect') {
          router.replace('/');
          return;
        }
        return;
      }

      const result = await getSession({ token });

      if ('error' in result) {
        const error = result.error as FetchBaseQueryError;
        const status = 'status' in error ? error.status : undefined;

        if (status === 401) {
          onSignOut();
        }
      }

      return;
    }

    if (publicRoute) {
      return;
    }
  }, [getSession, onSignOut, publicRoute, router, token]);

  useEffect(() => {
    if (sessionInitStarted.current) {
      return;
    }

    sessionInitStarted.current = true;
    void initiateSession();
  }, [initiateSession]);

  return (
    <SessionContext.Provider
      value={{
        onSignOut,
        isLoading: getSessionLoading,
        user,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within the Session provider');
  }

  return context;
};

export default SessionProvider;
