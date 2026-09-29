type CheckoutSession = {
  id: string;
  sessionClientSecret: string;
};

const apiVersion = '2026-09-25';

export async function createCheckoutSession(): Promise<CheckoutSession> {
  const response = await fetch(
    `${required('BEMONY_ORCHESTRATOR_API_BASE_URL')}/v1/checkout-sessions`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${required('BEMONY_ORCHESTRATOR_SECRET_KEY')}`,
        'content-type': 'application/json',
        'idempotency-key': crypto.randomUUID(),
        'x-bemony-api-version': apiVersion,
      },
      body: JSON.stringify({
        mode: 'CREATE',
        merchantOrderId: `checkout_${crypto.randomUUID()}`,
        amount: 18_294,
        currency: 'USD',
        country: 'US',
        domainId: required('BEMONY_CHECKOUT_DOMAIN_ID'),
        checkout: { checkoutConfigId: required('BEMONY_CHECKOUT_CONFIG_ID') },
        returnUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3003',
      }),
      cache: 'no-store',
    },
  );

  if (!response.ok) throw new Error('Unable to create checkout session.');
  return (await response.json()) as CheckoutSession;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}
