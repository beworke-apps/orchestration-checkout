'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Checkbox } from '@heroui/react';

import { TextField } from '@/components/composites';

import { CountryAutocomplete } from '../country-autocomplete';
import type { CheckoutFormValues } from '../types';

type AddressFieldsProps = {
  prefix: 'billing' | 'shipping';
  title?: string;
};

function AddressFields({ prefix, title }: AddressFieldsProps) {
  const { control } = useFormContext<CheckoutFormValues>();
  const fieldName = <Field extends keyof CheckoutFormValues['shipping']>(field: Field) =>
    `${prefix}.${field}` as const;

  return (
    <div className="flex flex-col gap-3">
      {title && <h3 className="text-base font-semibold">{title}</h3>}
      <Controller
        control={control}
        name={fieldName('country')}
        render={({ field, fieldState }) => (
          <CountryAutocomplete
            errorMessage={fieldState.error?.message}
            onChange={field.onChange}
            placeholder="Country"
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name={fieldName('street')}
        render={({ field, fieldState }) => (
          <TextField
            errorMessage={fieldState.error?.message}
            placeholder="Street address"
            variant="secondary"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={fieldName('apartment')}
        render={({ field, fieldState }) => (
          <TextField
            errorMessage={fieldState.error?.message}
            placeholder="Apt, suite, or other"
            variant="secondary"
            {...field}
          />
        )}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Controller
          control={control}
          name={fieldName('zip')}
          render={({ field, fieldState }) => (
            <TextField
              errorMessage={fieldState.error?.message}
              placeholder="Postal code"
              variant="secondary"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={fieldName('city')}
          render={({ field, fieldState }) => (
            <TextField
              errorMessage={fieldState.error?.message}
              placeholder="City"
              variant="secondary"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={fieldName('state')}
          render={({ field, fieldState }) => (
            <TextField
              errorMessage={fieldState.error?.message}
              placeholder="State / region"
              variant="secondary"
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
}

export function ShippingAddress() {
  const { control, setValue } = useFormContext<CheckoutFormValues>();
  const billingSameAsShipping = useWatch({ control, name: 'billingSameAsShipping' });

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 text-lg font-medium">Shipping Information</legend>
      <AddressFields prefix="shipping" />
      <Checkbox
        className="w-full"
        isSelected={billingSameAsShipping}
        onChange={(isSelected) =>
          setValue('billingSameAsShipping', isSelected, { shouldDirty: true })
        }
        variant="secondary"
      >
        <Checkbox.Content className="flex-row items-center gap-3">
          <Checkbox.Control className="border-border data-[selected=true]:border-success data-[selected=true]:bg-success size-5 shrink-0 rounded-md border before:rounded-[inherit]">
            <Checkbox.Indicator />
          </Checkbox.Control>
          Billing address is the same as shipping
        </Checkbox.Content>
      </Checkbox>
      {!billingSameAsShipping && <AddressFields prefix="billing" title="Billing Information" />}
    </fieldset>
  );
}
