import { TextField } from '@/components/composites';

export function Customer() {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-3 text-lg font-bold">User Information</legend>
      <TextField placeholder="Name" variant="secondary" />
      <TextField placeholder="Email" variant="secondary" />
      <TextField placeholder="Phone" variant="secondary" />
    </fieldset>
  );
}
