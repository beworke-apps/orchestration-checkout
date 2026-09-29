import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const apiVersion = '2026-09-25';

type PaymentRequest = {
  billingAddress: object;
  checkoutSessionId: string;
  customer: { email: string; firstName: string; lastName: string; phone: string };
  shippingAddress: object;
  token: string;
};

export async function POST(request: NextRequest) {
  try {
    const payment = (await request.json()) as PaymentRequest;
    const response = await fetch(`${required('BEMONY_ORCHESTRATOR_API_BASE_URL')}/v1/payments`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${required('BEMONY_ORCHESTRATOR_SECRET_KEY')}`,
        'content-type': 'application/json',
        'idempotency-key': crypto.randomUUID(),
        'x-bemony-api-version': apiVersion,
      },
      body: JSON.stringify({
        checkoutSessionId: payment.checkoutSessionId,
        paymentMethod: { type: 'CARD', token: payment.token },
        customer: {
          name: `${payment.customer.firstName} ${payment.customer.lastName}`.trim(),
          email: payment.customer.email,
          phone: payment.customer.phone,
        },
        billingAddress: payment.billingAddress,
        shippingAddress: payment.shippingAddress,
      }),
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Unable to create payment.');

    const result = (await response.json()) as { id: string; status: string };
    return NextResponse.json({ paymentId: result.id, status: result.status });
  } catch {
    return NextResponse.json({ error: 'PAYMENT_FAILED' }, { status: 502 });
  }
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}
