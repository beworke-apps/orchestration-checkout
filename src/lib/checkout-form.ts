import { z } from 'zod';

import { countries, getCountry } from '@/components/widgets/checkout-form/countries';
import type { AddressValues, CheckoutFormValues } from '@/components/widgets/checkout-form/types';

const countryIds = new Set(countries.map((country) => country.id));

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(120, `${label} is too long.`);

const addressDraftSchema = z.object({
  apartment: z.string(),
  city: z.string(),
  country: z.string(),
  state: z.string(),
  street: z.string(),
  zip: z.string(),
});

const addressSchema = addressDraftSchema.extend({
  apartment: z.string().max(120, 'Apartment is too long.'),
  city: requiredText('City'),
  country: z.string().refine((country) => countryIds.has(country), 'Select a valid country.'),
  state: requiredText('State / region'),
  street: requiredText('Street address'),
  zip: z
    .string()
    .refine((value) => normalizePostalCode(value).length >= 3, 'Enter a valid postal code.')
    .refine((value) => normalizePostalCode(value).length <= 12, 'Enter a valid postal code.'),
});

export const checkoutFormSchema = z
  .object({
    billing: addressDraftSchema,
    billingSameAsShipping: z.boolean(),
    email: z.string().trim().email('Enter a valid email address.'),
    firstName: requiredText('First name'),
    lastName: requiredText('Last name'),
    phone: z
      .string()
      .refine((value) => normalizePhone(value).length >= 8, 'Enter a valid phone number.')
      .refine((value) => normalizePhone(value).length <= 15, 'Enter a valid phone number.'),
    phoneCountry: z
      .string()
      .refine((country) => countryIds.has(country), 'Select a valid phone country.'),
    shipping: addressSchema,
    smsConsent: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.billingSameAsShipping) return;

    const validation = addressSchema.safeParse(values.billing);
    if (validation.success) return;

    for (const issue of validation.error.issues) {
      context.addIssue({
        ...issue,
        path: ['billing', ...issue.path],
      });
    }
  });

export type NormalizedAddress = AddressValues;

export type NormalizedCheckoutFormValues = {
  billing: NormalizedAddress;
  billingSameAsShipping: boolean;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: {
      country: string;
      dialCode: string;
      e164: string;
      number: string;
    };
    smsConsent: boolean;
  };
  shipping: NormalizedAddress;
};

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

export function normalizePostalCode(value: string) {
  return value.replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
}

function normalizeAddress(address: AddressValues): NormalizedAddress {
  return {
    apartment: normalizeText(address.apartment),
    city: normalizeText(address.city),
    country: address.country,
    state: normalizeText(address.state),
    street: normalizeText(address.street),
    zip: normalizePostalCode(address.zip),
  };
}

export function normalizeCheckoutForm(values: CheckoutFormValues): NormalizedCheckoutFormValues {
  const shipping = normalizeAddress(values.shipping);
  const billing = values.billingSameAsShipping ? { ...shipping } : normalizeAddress(values.billing);
  const phoneCountry = getCountry(values.phoneCountry);
  const phone = normalizePhone(values.phone);

  return {
    billing,
    billingSameAsShipping: values.billingSameAsShipping,
    customer: {
      email: values.email.trim().toLowerCase(),
      firstName: normalizeText(values.firstName),
      lastName: normalizeText(values.lastName),
      phone: {
        country: phoneCountry.id,
        dialCode: phoneCountry.dialCode,
        e164: `${phoneCountry.dialCode}${phone}`,
        number: phone,
      },
      smsConsent: values.smsConsent,
    },
    shipping,
  };
}
