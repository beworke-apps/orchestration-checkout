'use client';
import { BemonyCardEmbed } from '@bemony/card-embed-react';
import type { BemonyCardEmbedHandle } from '@bemony/card-embed-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { useRef, useState } from 'react';

import { Button, Form, Surface } from '@heroui/react';

import { Customer } from '@/components/widgets/checkout-form/customer';
import { ShippingAddress } from '@/components/widgets/checkout-form/shipping-address/shipping-address';
import type { CheckoutFormValues } from '@/components/widgets/checkout-form/types';
import { checkoutFormSchema, normalizeCheckoutForm } from '@/lib/checkout-form';
import { createPaymentPayload } from '@/lib/payment-payload';

type CheckoutSession = { id: string; sessionClientSecret: string };

export default function Checkout({ session }: { session: CheckoutSession | undefined }) {
  const handlePay = async (data: CheckoutFormValues) => {
    const checkout = normalizeCheckoutForm(data);

    if (!canPay || !ref.current || !session) {
      setPaymentMessage('Complete the secure card details before continuing.');
      return;
    }

    setLoading(true);
    setPaymentMessage(undefined);

    try {
      const tokenized = await ref.current.tokenize();
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(createPaymentPayload(session.id, tokenized.token, checkout)),
      });
      const payment: unknown = await response.json().catch(() => undefined);

      if (!response.ok || !isPaymentResponse(payment)) {
        setPaymentMessage(`Payment could not be started (${readPaymentError(payment)}).`);
        return;
      }

      setPaymentMessage(paymentStatusMessage(payment.status, payment.paymentId));
    } catch {
      setPaymentMessage('Unable to process the payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ref = useRef<BemonyCardEmbedHandle>(null);
  const [loading, setLoading] = useState(false);
  const [canPay, setCanPay] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | undefined>();
  const form = useForm<CheckoutFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneCountry: 'US',
      phone: '',
      smsConsent: false,
      billingSameAsShipping: true,
      shipping: {
        country: 'US',
        street: '',
        apartment: '',
        zip: '',
        city: '',
        state: '',
      },
      billing: {
        country: 'US',
        street: '',
        apartment: '',
        zip: '',
        city: '',
        state: '',
      },
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(checkoutFormSchema),
  });

  return (
    <div className="grid h-full min-h-screen w-full grid-cols-12">
      <div className="col-span-7" />
      <div className="col-span-5 flex flex-col items-center justify-center p-8">
        <FormProvider {...form}>
          <Surface className="flex w-full max-w-2xl flex-col gap-6 rounded-3xl p-6">
            <Form
              aria-label="Checkout details"
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit(handlePay)();
              }}
              validationBehavior="aria"
            >
              <Customer />
              <ShippingAddress />

              {session ? (
                <BemonyCardEmbed
                  layout="combined"
                  onStateChange={(state) => setCanPay(state.complete && state.valid)}
                  ref={ref}
                  sessionClientSecret={session.sessionClientSecret}
                />
              ) : (
                <p role="alert">Unable to initialize secure card fields.</p>
              )}
              {paymentMessage && <p role="status">{paymentMessage}</p>}
              <Button fullWidth isDisabled={!session} isPending={loading} type="submit">
                Pay Now
              </Button>
            </Form>
          </Surface>
        </FormProvider>
      </div>
    </div>
  );
}

function isPaymentResponse(value: unknown): value is { paymentId: string; status: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'paymentId' in value &&
    typeof value.paymentId === 'string' &&
    'status' in value &&
    typeof value.status === 'string'
  );
}

function paymentStatusMessage(status: string, paymentId: string): string {
  if (status === 'AUTHORIZED' || status === 'CAPTURED') {
    return `Payment approved. Reference: ${paymentId}.`;
  }
  if (status === 'PROCESSING' || status === 'UNKNOWN') {
    return `Payment is being processed. Reference: ${paymentId}.`;
  }
  return `Payment status: ${status}. Reference: ${paymentId}.`;
}

function readPaymentError(value: unknown): string {
  if (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  ) {
    return value.error;
  }
  return 'PAYMENT_FAILED';
}
