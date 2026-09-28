import cookies from 'js-cookie';

import { appConfig } from '@/config/app-config';

const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export function getAuthCookie(): string | undefined {
  return cookies.get(appConfig.token);
}

export function setAuthCookie(token: string): void {
  cookies.set(appConfig.token, token, { ...COOKIE_OPTIONS, sameSite: 'lax' });
}

export function removeAuthCookie(): void {
  cookies.remove(appConfig.token, { path: '/' });
}
