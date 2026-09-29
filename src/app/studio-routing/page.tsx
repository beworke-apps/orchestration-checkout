'use client';

import { Customer } from '@/components/widgets/checkout-form/customer';
import { ShippingAddress } from '@/components/widgets/checkout-form/shipping-address/shipping-address';
import { BemonyCardEmbed } from '@bemony/card-embed-react';
import type { BemonyCardEmbedHandle } from '@bemony/card-embed-react';
import { Button, Surface } from '@heroui/react';
import { useRef, useState } from 'react';

export default function Home() {
  const ref = useRef<BemonyCardEmbedHandle>(null);
  const [canPay, setCanPay] = useState(false);
  const sessionClientSecret = '';
  return (
    <div className="grid h-full min-h-screen w-full grid-cols-12">
      <div className="col-span-7" />
      <div className="col-span-5 flex flex-col items-center justify-center px-8">
        <Surface className="flex w-full flex-col gap-6 rounded-3xl p-6">
          <Customer />
          <ShippingAddress />

          <BemonyCardEmbed
            layout="combined"
            onStateChange={(state) => setCanPay(state.complete && state.valid)}
            ref={ref}
            sessionClientSecret={sessionClientSecret}
          />
          <Button>Pay Now</Button>
        </Surface>
      </div>
    </div>
  );
}
