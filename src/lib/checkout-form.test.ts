import { describe, expect, it } from 'vitest';

import { checkoutFormSchema, normalizeCheckoutForm } from './checkout-form';

const validValues = {
  billing: {
    apartment: '',
    city: '',
    country: 'US',
    state: '',
    street: '',
    zip: '',
  },
  billingSameAsShipping: true,
  email: '  ADA@EXAMPLE.COM ',
  firstName: ' Ada ',
  lastName: ' Lovelace ',
  phone: '(201) 555-0123',
  phoneCountry: 'US',
  shipping: {
    apartment: ' Suite  10 ',
    city: ' New   York ',
    country: 'US',
    state: ' NY ',
    street: ' 123 Main Street ',
    zip: '10001-1234',
  },
  smsConsent: true,
};

describe('checkout form normalization', () => {
  it('uses shipping for billing and removes formatting characters from phone and postal code', () => {
    const result = normalizeCheckoutForm(validValues);

    expect(result.customer.email).toBe('ada@example.com');
    expect(result.customer.phone.number).toBe('2015550123');
    expect(result.customer.phone.e164).toBe('+12015550123');
    expect(result.shipping.zip).toBe('100011234');
    expect(result.billing).toEqual(result.shipping);
    expect(result.billing).not.toBe(result.shipping);
  });

  it('does not require billing fields while billing matches shipping', () => {
    expect(checkoutFormSchema.safeParse(validValues).success).toBe(true);
  });

  it('requires billing fields when billing differs from shipping', () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, billingSameAsShipping: false });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'billing')).toBe(true);
    }
  });
});
