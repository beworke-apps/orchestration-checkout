import type { ReactNode } from 'react';

import type { TextFieldProps as TextFieldPropsBase } from '@heroui/react';

export type TextFieldProps = TextFieldPropsBase & {
  label: string;
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  errorMessage?: string | undefined;
};
