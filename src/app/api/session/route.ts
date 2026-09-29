import { NextResponse } from 'next/server';

import { createCheckoutSession } from '@/lib/checkout-session.server';

export async function POST() {
  try {
    const session = await createCheckoutSession();
    return NextResponse.json(session, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return NextResponse.json(
      { error: 'SESSION_CREATION_FAILED' },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    );
  }
}
