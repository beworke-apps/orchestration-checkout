const API_VERSION = '2026-09-25';

type CheckoutSessionResponse = Readonly<{
  sessionClientSecret: string;
}>;

/** Creates the short-lived secret consumed exclusively by the card iframe. */
export async function createCheckoutSession(): Promise<CheckoutSessionResponse> {
  const baseUrl = requiredEnvironment('BEMONY_ORCHESTRATOR_API_BASE_URL');
  const secretKey = requiredEnvironment('BEMONY_ORCHESTRATOR_SECRET_KEY');
  const domainId = requiredEnvironment('BEMONY_CHECKOUT_DOMAIN_ID');
  const checkoutConfigId = requiredEnvironment('BEMONY_CHECKOUT_CONFIG_ID');

  let response: Response;
  try {
    response = await fetch(new URL('/v1/checkout-sessions', normalizedOrigin(baseUrl)), {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secretKey}`,
        'content-type': 'application/json',
        'idempotency-key': crypto.randomUUID(),
        'x-bemony-api-version': API_VERSION
      },
      body: JSON.stringify({
        mode: 'CREATE',
        merchantOrderId: `orchestration-checkout_${crypto.randomUUID()}`,
        amount: 1_000,
        currency: 'BRL',
        country: 'BR',
        domainId,
        checkout: { checkoutConfigId },
        returnUrl: checkoutPublicOrigin()
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000)
    });
  } catch {
    throw new CheckoutSessionError('ORCHESTRATOR_UNAVAILABLE', 502);
  }

  const payload: unknown = await response.json().catch(() => undefined);
  if (!response.ok) throw new CheckoutSessionError(readErrorCode(payload), response.status);
  if (!isCheckoutSession(payload)) throw new CheckoutSessionError('INVALID_UPSTREAM_RESPONSE', 502);
  return { sessionClientSecret: payload.sessionClientSecret };
}

export class CheckoutSessionError extends Error {
  public constructor(
    public readonly code: string,
    public readonly status: number
  ) {
    super(code);
  }
}

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new CheckoutSessionError('SERVER_CONFIGURATION_ERROR', 500);
  }
  return value;
}

function normalizedOrigin(value: string): string {
  const url = new URL(value);
  if (
    (url.protocol !== 'http:' && url.protocol !== 'https:') ||
    url.origin === 'null' ||
    url.pathname !== '/' ||
    url.search !== '' ||
    url.hash !== ''
  ) {
    throw new CheckoutSessionError('SERVER_CONFIGURATION_ERROR', 500);
  }
  return url.origin;
}

function checkoutPublicOrigin(): string {
  return normalizedOrigin(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3003');
}

function isCheckoutSession(value: unknown): value is Readonly<{ sessionClientSecret: string }> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sessionClientSecret' in value &&
    typeof value.sessionClientSecret === 'string' &&
    value.sessionClientSecret.length >= 24
  );
}

function readErrorCode(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('error' in value)) return 'UPSTREAM_ERROR';
  const { error } = value;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return 'UPSTREAM_ERROR';
}
