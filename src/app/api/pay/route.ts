import { z } from 'zod';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_VERSION = '2026-09-25';

const addressSchema = z.object({
  city: z.string().min(1),
  country: z.string().length(2),
  line1: z.string().min(1),
  line2: z.string(),
  postalCode: z.string().min(3),
  state: z.string().min(1),
});

const paymentRequestSchema = z.object({
  billingAddress: addressSchema,
  checkoutSessionId: z.string().regex(/^chs_/),
  customer: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().regex(/^\d{8,15}$/),
  }),
  shippingAddress: addressSchema,
  token: z.string().regex(/^bmtok_(test|live)_/),
});

export async function POST(request: NextRequest) {
  const idempotencyKey = request.headers.get('idempotency-key');
  const body: unknown = await request.json().catch(() => undefined);
  const parsed = paymentRequestSchema.safeParse(body);

  if (!idempotencyKey || !parsed.success) {
    return noStoreJson({ error: 'INVALID_PAYMENT_REQUEST' }, 400);
  }

  const values = parsed.data;
  try {
    const response = await fetch(
      new URL(
        '/v1/payments',
        normalizedOrigin(requiredEnvironment('BEMONY_ORCHESTRATOR_API_BASE_URL')),
      ),
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${requiredEnvironment('BEMONY_ORCHESTRATOR_SECRET_KEY')}`,
          'content-type': 'application/json',
          'idempotency-key': idempotencyKey,
          'x-bemony-api-version': API_VERSION,
        },
        body: JSON.stringify({
          checkoutSessionId: values.checkoutSessionId,
          paymentMethod: { type: 'CARD', token: values.token },
          customer: canonicalCustomer(values.customer),
          billingAddress: values.billingAddress,
          shippingAddress: values.shippingAddress,
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      },
    );
    const payload: unknown = await response.json().catch(() => undefined);

    if (!response.ok) {
      return noStoreJson({ error: readErrorCode(payload) }, response.status);
    }
    if (!isPaymentResponse(payload)) {
      return noStoreJson({ error: 'INVALID_UPSTREAM_RESPONSE' }, 502);
    }

    return noStoreJson(
      { paymentId: payload.id, status: payload.status },
      payload.status === 'PROCESSING' || payload.status === 'UNKNOWN' ? 202 : 200,
    );
  } catch {
    return noStoreJson({ error: 'ORCHESTRATOR_UNAVAILABLE' }, 502);
  }
}

function canonicalCustomer(customer: z.infer<typeof paymentRequestSchema>['customer']) {
  return {
    name: `${customer.firstName} ${customer.lastName}`.trim(),
    email: customer.email,
    phone: customer.phone,
  };
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function normalizedOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Invalid API origin.');
  return url.origin;
}

function isPaymentResponse(value: unknown): value is { id: string; status: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'status' in value &&
    typeof value.status === 'string'
  );
}

function readErrorCode(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('error' in value)) return 'PAYMENT_FAILED';
  const { error } = value;
  if (typeof error === 'string') return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }
  return 'PAYMENT_FAILED';
}

function noStoreJson(body: object, status: number) {
  return NextResponse.json(body, { status, headers: { 'cache-control': 'no-store' } });
}
