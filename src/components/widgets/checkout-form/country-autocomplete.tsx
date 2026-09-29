'use client';

import {
  Autocomplete,
  EmptyState,
  FieldError,
  ListBox,
  SearchField,
  useFilter,
} from '@heroui/react';

import { countries } from './countries';
import { CountryFlag } from './country-flag';

type CountryAutocompleteProps = {
  className?: string;
  errorMessage?: string | undefined;
  onChange: (countryId: string) => void;
  placeholder?: string;
  value: string;
};

export function CountryAutocomplete({
  className,
  errorMessage,
  onChange,
  placeholder = 'Select country',
  value,
}: CountryAutocompleteProps) {
  const { contains } = useFilter({ sensitivity: 'base' });

  return (
    <Autocomplete
      {...(className ? { className } : {})}
      fullWidth
      isInvalid={Boolean(errorMessage)}
      onChange={(key) => onChange(typeof key === 'string' ? key : '')}
      placeholder={placeholder}
      selectionMode="single"
      value={value}
      variant="secondary"
    >
      <Autocomplete.Trigger>
        <Autocomplete.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            const country = countries.find((item) => item.id === state.selectedItems[0]?.key);

            if (isPlaceholder || !country) return defaultChildren;

            return (
              <span className="flex items-center gap-2">
                <CountryFlag country={country} />
                <span>{country.name}</span>
                <span className="text-muted">{country.dialCode}</span>
              </span>
            );
          }}
        </Autocomplete.Value>
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField aria-label={placeholder} autoFocus name="country-search" variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search country..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>No countries found</EmptyState>}>
            {countries.map((country) => (
              <ListBox.Item
                id={country.id}
                key={country.id}
                textValue={`${country.name} ${country.dialCode}`}
              >
                <span className="flex items-center gap-2">
                  <CountryFlag country={country} />
                  <span>{country.name}</span>
                  <span className="text-muted">{country.dialCode}</span>
                </span>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Autocomplete>
  );
}
