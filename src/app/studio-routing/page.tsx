import Checkout from '@/components/pages/checkout';

type CheckoutSession = { id: string; sessionClientSecret: string };

export const dynamic = 'force-dynamic';

export default async function Page() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3003'}/api/session`,
    {
      method: 'POST',
      cache: 'no-store',
    },
  );
  const session = response.ok ? ((await response.json()) as CheckoutSession) : undefined;

  return <Checkout session={session} />;
}
