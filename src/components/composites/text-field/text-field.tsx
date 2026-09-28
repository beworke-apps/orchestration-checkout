import { ErrorMessage, InputGroup, Label, TextField as TextFieldBase } from '@heroui/react';

import type { TextFieldProps } from './text-field.type';

export function TextField({
  label,
  startContent,
  endContent,
  placeholder,
  errorMessage,
  ...props
}: TextFieldProps) {
  return (
    <TextFieldBase {...props} isInvalid={!!errorMessage}>
      <Label>{label}</Label>
      <InputGroup>
        {startContent && <InputGroup.Prefix>{startContent}</InputGroup.Prefix>}
        <InputGroup.Input placeholder={placeholder ?? ''} />
        {endContent && <InputGroup.Suffix>{endContent}</InputGroup.Suffix>}
      </InputGroup>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </TextFieldBase>
  );
}
