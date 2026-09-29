export type CheckoutFormValues = {
  billing: AddressValues;
  billingSameAsShipping: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneCountry: string;
  shipping: AddressValues;
  smsConsent: boolean;
};

export type AddressValues = {
  apartment: string;
  city: string;
  country: string;
  state: string;
  street: string;
  zip: string;
};
