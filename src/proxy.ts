import type { NextRequest, ProxyConfig } from 'next/server';
import { NextResponse } from 'next/server';


export function proxy(request: NextRequest) {


  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
