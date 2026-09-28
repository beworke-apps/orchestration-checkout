import { NextResponse } from 'next/server';
import type { NextRequest, ProxyConfig } from 'next/server';

import { REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, publicRoutes } from '@/config/public-routes';

import { appConfig } from './config/app-config';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((item) => pathname.startsWith(item.path)) ?? null;
  const authToken = request.cookies.get(appConfig.token)?.value;

  let response: NextResponse;

  if (!authToken && publicRoute) {
    response = NextResponse.next();
  } else if (!authToken && !publicRoute) {
    return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url));
  } else if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = '/';

    response = NextResponse.redirect(redirectUrl);
  } else {
    response = NextResponse.next();
  }

  return response;
}

export const config: ProxyConfig = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
