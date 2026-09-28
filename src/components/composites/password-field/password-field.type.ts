import type { TextFieldProps } from '@heroui/react';

export type PasswordFieldProps = TextFieldProps & {
  label: string;
  placeholder?: string;
  errorMessage?: string | undefined;
};
