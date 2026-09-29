'use client';

import { Customer } from '@/components/widgets/checkout-form/customer';
import { ShippingAddress } from '@/components/widgets/checkout-form/shipping-address/shipping-address';
import { BemonyCardEmbed } from '@bemony/card-embed-react';
import type { BemonyCardEmbedHandle } from '@bemony/card-embed-react';
import { Button, Surface } from '@heroui/react';
import { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function Checkout({
  sessionClientSecret,
  sessionError,
}: {
  sessionClientSecret: string | undefined;
  sessionError: boolean;
}) {
  const handlePay = () => {
    setLoading(true);
    if (ref.current) {
      ref.current
        .tokenize()
        .then((token) => {
          console.log(token);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const ref = useRef<BemonyCardEmbedHandle>(null);
  const [loading, setLoading] = useState(false);
  const [canPay, setCanPay] = useState(false);
  const form = useForm();

  return (
    <div className="grid h-full min-h-screen w-full grid-cols-12">
      <div className="col-span-7" />
      <div className="col-span-5 flex flex-col items-center justify-center px-8">
        <FormProvider {...form}>
          <Surface className="flex w-full flex-col gap-6 rounded-3xl p-6">
            <Customer />
            <ShippingAddress />

            <BemonyCardEmbed
              layout="combined"
              onStateChange={(state) => setCanPay(state.complete && state.valid)}
              ref={ref}
              sessionClientSecret={sessionClientSecret ?? ''}
            />
            <Button fullWidth isDisabled={!canPay} onPress={handlePay}>
              {loading ? 'Loading...' : 'Pay Now'}
            </Button>
          </Surface>
        </FormProvider>
      </div>
    </div>
  );
}
