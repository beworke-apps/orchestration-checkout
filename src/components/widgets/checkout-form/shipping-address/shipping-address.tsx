import { TextField } from '@/components/composites';

export function ShippingAddress() {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-3 text-lg font-bold">Address</legend>
      <TextField placeholder="Street" variant="secondary" />
      <div className="grid grid-cols-2 gap-2">
        <TextField placeholder="City" variant="secondary" />
        <TextField placeholder="State" variant="secondary" />
        <TextField placeholder="Zip" variant="secondary" />
        <TextField placeholder="Country" variant="secondary" />
      </div>
    </fieldset>
  );
}
