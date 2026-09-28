'use client';

import { SearchField as SearchFieldComponent } from '@heroui/react';

export type QuerySearchFieldProps = {
  className?: string;
  inputValue: string;
  name?: string;
  onClear: () => void;
  onInputChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

/**
 * Presentational search field — wire `inputValue` / `onInputChange` from `useSearchFilter`.
 * Input state is local; URL updates are debounced in the hook.
 */
export function QuerySearchField({
  className = 'w-full sm:w-[240px]',
  inputValue,
  name = 'search',
  onClear,
  onInputChange,
  onSubmit,
  placeholder = 'Search...',
}: QuerySearchFieldProps) {
  return (
    <SearchFieldComponent className={className} name={name} variant="secondary">
      <SearchFieldComponent.Group>
        <SearchFieldComponent.SearchIcon />
        <SearchFieldComponent.Input
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSubmit?.();
          }}
          placeholder={placeholder}
          value={inputValue}
        />
        <SearchFieldComponent.ClearButton onPress={onClear} />
      </SearchFieldComponent.Group>
    </SearchFieldComponent>
  );
}
