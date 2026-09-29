import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const apiVersion = '2026-09-25';

export async function POST(request: NextRequest) {
  if (process.env.LOCAL_SANDBOX_MODE !== '1') {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { sessionClientSecret?: string };
    if (!body.sessionClientSecret) {
      return NextResponse.json({ error: 'SESSION_REQUIRED' }, { status: 400 });
    }

    const runtime = required('BEMONY_ORCHESTRATOR_API_BASE_URL');
    const origin = required('NEXT_PUBLIC_APP_URL');
    const frameResponse = await fetch(`${runtime}/internal/v1/frame-sessions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin,
        'x-bemony-api-version': apiVersion,
      },
      body: JSON.stringify({ sessionClientSecret: body.sessionClientSecret }),
      cache: 'no-store',
    });
    const frame = (await frameResponse.json()) as { accessToken?: string };
    if (!frameResponse.ok || !frame.accessToken) {
      throw new Error('Unable to authorize local sandbox frame.');
    }

    const tokenResponse = await fetch(`${runtime}/v1/payment-tokens`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${frame.accessToken}`,
        'content-type': 'application/json',
        'idempotency-key': crypto.randomUUID(),
        origin,
        'x-bemony-api-version': apiVersion,
      },
      body: JSON.stringify({
        provider: 'local-sandbox',
        providerTokenReference: `local_card_${crypto.randomUUID()}_4242`,
      }),
      cache: 'no-store',
    });
    const token = (await tokenResponse.json()) as { token?: string };
    if (!tokenResponse.ok || !token.token) {
      throw new Error('Unable to create local sandbox token.');
    }
    return NextResponse.json({ token: token.token });
  } catch {
    return NextResponse.json({ error: 'LOCAL_TOKENIZATION_FAILED' }, { status: 502 });
  }
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}
