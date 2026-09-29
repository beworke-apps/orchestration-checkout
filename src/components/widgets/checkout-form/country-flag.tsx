import type { Country } from './countries';

type CountryFlagProps = {
  className?: string;
  country: Country;
};

export function CountryFlag({ className = 'size-5', country }: CountryFlagProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${country.name} flag`}
      className={`${className} shrink-0 rounded-full object-cover`}
      height={20}
      src={`https://flagcdn.com/w40/${country.id.toLowerCase()}.png`}
      width={20}
    />
  );
}
