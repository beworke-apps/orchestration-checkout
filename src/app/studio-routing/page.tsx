import Checkout from '@/components/pages/checkout';
import { createCheckoutSession } from '@/lib/checkout-session.server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { id, sessionClientSecret } = await createCheckoutSession();

  return (
    <Checkout
      checkoutSessionId={id ?? ''}
      sessionClientSecret={sessionClientSecret ?? ''}
      sessionError={!sessionClientSecret}
    />
  );
}
