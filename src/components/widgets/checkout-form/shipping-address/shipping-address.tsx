'use client';

import { TextField } from '@/components/composites';
import { Controller, useFormContext } from 'react-hook-form';

export function ShippingAddress() {
  const { control } = useFormContext();
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-3 text-lg font-bold">Address</legend>
      <Controller
        control={control}
        name="street"
        render={({ field }) => <TextField placeholder="Street" variant="secondary" {...field} />}
      />
      <div className="grid grid-cols-2 gap-2">
        <Controller
          control={control}
          name="city"
          render={({ field }) => <TextField placeholder="City" variant="secondary" {...field} />}
        />
        <Controller
          control={control}
          name="state"
          render={({ field }) => <TextField placeholder="State" variant="secondary" {...field} />}
        />
        <Controller
          control={control}
          name="zip"
          render={({ field }) => <TextField placeholder="Zip" variant="secondary" {...field} />}
        />
        <Controller
          control={control}
          name="country"
          render={({ field }) => <TextField placeholder="Country" variant="secondary" {...field} />}
        />
      </div>
    </fieldset>
  );
}
