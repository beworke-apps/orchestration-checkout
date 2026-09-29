'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { useState } from 'react';

import {
  Button,
  Checkbox,
  FieldError,
  InputGroup,
  Popover,
  TextField as TextFieldBase,
} from '@heroui/react';

import { TextField } from '@/components/composites';

import { countries, formatPhone, getCountry } from '../countries';
import { CountryFlag } from '../country-flag';
import type { CheckoutFormValues } from '../types';

function PhoneCountryPicker() {
  const { control, setValue } = useFormContext<CheckoutFormValues>();
  const phoneCountry = useWatch({ control, name: 'phoneCountry' }) ?? 'US';
  const [isOpen, setIsOpen] = useState(false);
  const selectedCountry = getCountry(phoneCountry);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger
        aria-label={`Select phone country: ${selectedCountry.name}`}
        className="hover:bg-default/70 flex size-8 cursor-pointer items-center justify-center rounded-lg p-1"
      >
        <span>
          <CountryFlag className="size-5" country={selectedCountry} />
        </span>
      </Popover.Trigger>
      <Popover.Content className="border-border bg-surface w-60 rounded-xl border p-1 shadow-xl">
        <Popover.Dialog className="p-1">
          <Popover.Heading className="px-2 py-1 text-sm font-semibold">
            Phone country
          </Popover.Heading>
          <div className="mt-1 grid gap-1">
            {countries.map((country) => (
              <Button
                className="justify-start gap-2"
                key={country.id}
                onPress={() => {
                  setValue('phoneCountry', country.id, { shouldDirty: true });
                  setIsOpen(false);
                }}
                variant="tertiary"
              >
                <CountryFlag country={country} />
                <span>{country.name}</span>
                <span className="text-muted ml-auto">{country.dialCode}</span>
              </Button>
            ))}
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

function PhoneNumberField() {
  const { control } = useFormContext<CheckoutFormValues>();
  const phoneCountry = useWatch({ control, name: 'phoneCountry' }) ?? 'US';

  return (
    <Controller
      control={control}
      name="phone"
      render={({ field, fieldState }) => (
        <TextFieldBase
          aria-label="Phone number"
          inputMode="tel"
          isInvalid={Boolean(fieldState.error)}
          onChange={(value) => field.onChange(formatPhone(value, phoneCountry))}
          type="tel"
          value={field.value}
        >
          <InputGroup variant="secondary">
            <InputGroup.Prefix className="pr-1">
              <PhoneCountryPicker />
            </InputGroup.Prefix>
            <InputGroup.Input placeholder={`Phone number · ${getCountry(phoneCountry).dialCode}`} />
          </InputGroup>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </TextFieldBase>
      )}
    />
  );
}

export function Customer() {
  const { control, setValue } = useFormContext<CheckoutFormValues>();
  const smsConsent = useWatch({ control, name: 'smsConsent' });

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-lg font-medium">Customer Information</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <TextField
              errorMessage={fieldState.error?.message}
              placeholder="First name"
              variant="secondary"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <TextField
              errorMessage={fieldState.error?.message}
              placeholder="Last name"
              variant="secondary"
              {...field}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <TextField
              errorMessage={fieldState.error?.message}
              placeholder="Email address"
              type="email"
              variant="secondary"
              {...field}
            />
            <p className="text-muted px-1 text-sm">We&apos;ll send your order confirmation here.</p>
          </div>
        )}
      />
      <PhoneNumberField />
      <Checkbox
        className="w-full"
        isSelected={smsConsent}
        onChange={(isSelected) => setValue('smsConsent', isSelected, { shouldDirty: true })}
        variant="secondary"
      >
        <Checkbox.Content className="flex-row items-start gap-3">
          <Checkbox.Control className="border-border data-[selected=true]:border-success data-[selected=true]:bg-success mt-0.5 size-5 shrink-0 rounded-md border before:rounded-[inherit]">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <span className="flex flex-col gap-0.5">
            <span>Get SMS alerts for order and shipping confirmations.</span>
            <span className="text-muted text-sm">Consent is not required for purchase.</span>
          </span>
        </Checkbox.Content>
      </Checkbox>
    </fieldset>
  );
}
