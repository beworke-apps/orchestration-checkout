import { NextResponse } from 'next/server';

import { CheckoutSessionError, createCheckoutSession } from '@/lib/checkout-session.server';

export async function POST() {
  try {
    const session = await createCheckoutSession();
    return NextResponse.json(session, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    const status = error instanceof CheckoutSessionError ? error.status : 502;
    const code = error instanceof CheckoutSessionError ? error.code : 'SESSION_CREATION_FAILED';
    return NextResponse.json({ error: code }, { status, headers: { 'cache-control': 'no-store' } });
  }
}
