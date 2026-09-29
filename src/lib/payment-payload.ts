import type { NormalizedAddress, NormalizedCheckoutFormValues } from '@/lib/checkout-form';

type PaymentAddress = Readonly<{
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
}>;

export type PaymentPayload = Readonly<{
  billingAddress: PaymentAddress;
  checkoutSessionId: string;
  customer: Readonly<{
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  }>;
  shippingAddress: PaymentAddress;
  token: string;
}>;

function toPaymentAddress(address: NormalizedAddress): PaymentAddress {
  return {
    city: address.city,
    country: address.country,
    line1: address.street,
    line2: address.apartment,
    postalCode: address.zip,
    state: address.state,
  };
}

/**
 * Keeps the browser-to-BFF shape compatible with the checkout that already
 * completes payments in the sandbox. The BFF remains responsible for turning
 * first/last name into the orchestrator's canonical `name` field.
 */
export function createPaymentPayload(
  checkoutSessionId: string,
  token: string,
  checkout: NormalizedCheckoutFormValues,
): PaymentPayload {
  return {
    billingAddress: toPaymentAddress(checkout.billing),
    checkoutSessionId,
    customer: {
      email: checkout.customer.email,
      firstName: checkout.customer.firstName,
      lastName: checkout.customer.lastName,
      phone: checkout.customer.phone.number,
    },
    shippingAddress: toPaymentAddress(checkout.shipping),
    token,
  };
}
