import Checkout from '@/components/pages/checkout';
import { createCheckoutSession } from '@/lib/checkout-session.server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { sessionClientSecret } = await createCheckoutSession();
  return <Checkout sessionClientSecret={sessionClientSecret} sessionError={false} />;
}
