import { describe, expect, it } from 'vitest';

import { createPaymentPayload } from './payment-payload';

describe('createPaymentPayload', () => {
  it('uses the same BFF field names as the working embed checkout', () => {
    const country = 'US';
    const street = '1 Main Street';

    expect(
      createPaymentPayload('chs_test_123', 'bmtok_test_123', {
        billing: {
          apartment: 'Suite 4',
          city: 'Austin',
          country,
          state: 'TX',
          street,
          zip: '78701',
        },
        billingSameAsShipping: true,
        customer: {
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          phone: { country, dialCode: '+1', e164: '+12015550123', number: '2015550123' },
          smsConsent: true,
        },
        shipping: {
          apartment: '',
          city: 'Austin',
          country,
          state: 'TX',
          street,
          zip: '78701',
        },
      }),
    ).toEqual({
      billingAddress: {
        city: 'Austin',
        country,
        line1: street,
        line2: 'Suite 4',
        postalCode: '78701',
        state: 'TX',
      },
      checkoutSessionId: 'chs_test_123',
      customer: {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '2015550123',
      },
      shippingAddress: {
        city: 'Austin',
        country,
        line1: street,
        line2: '',
        postalCode: '78701',
        state: 'TX',
      },
      token: 'bmtok_test_123',
    });
  });
});
