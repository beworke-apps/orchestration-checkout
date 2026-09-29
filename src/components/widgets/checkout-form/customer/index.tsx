'use client';

import { TextField } from '@/components/composites';
import { Controller, useFormContext } from 'react-hook-form';

export function Customer() {
  const { control } = useFormContext();
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-3 text-lg font-bold">User Information</legend>
      <Controller
        control={control}
        name="name"
        render={({ field }) => <TextField placeholder="Name" variant="secondary" {...field} />}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => <TextField placeholder="Email" variant="secondary" {...field} />}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field }) => <TextField placeholder="Phone" variant="secondary" {...field} />}
      />
    </fieldset>
  );
}
