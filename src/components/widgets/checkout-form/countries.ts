export type Country = {
  dialCode: string;
  flag: string;
  id: string;
  name: string;
};

export const countries: Country[] = [
  { id: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { id: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { id: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { id: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { id: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { id: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { id: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  { id: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
];

export function getCountry(countryId: string) {
  return countries.find((country) => country.id === countryId) ?? countries[0]!;
}

export function formatPhone(value: string, countryId: string) {
  const digits = value.replace(/\D/g, '');

  if (countryId === 'BR') {
    const number = digits.slice(0, 11);
    if (number.length <= 2) return number ? `(${number}` : '';
    if (number.length <= 7) return `(${number.slice(0, 2)}) ${number.slice(2)}`;
    return `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`;
  }

  const number = digits.slice(0, 10);
  if (number.length <= 3) return number ? `(${number}` : '';
  if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
}
