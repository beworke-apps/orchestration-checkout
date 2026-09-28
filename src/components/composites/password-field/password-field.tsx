'use client';

import { Eye, EyeSlash } from '@gravity-ui/icons';

import { useState } from 'react';

import { Button, ErrorMessage, InputGroup, Label, TextField } from '@heroui/react';

import type { PasswordFieldProps } from './password-field.type';

export function PasswordField({
  onChange,
  value,
  label,
  placeholder,
  errorMessage,
  ...props
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField {...props} isInvalid={!!errorMessage}>
      <Label>{label}</Label>
      <InputGroup>
        <InputGroup.Input
          className="w-full"
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder ?? ''}
          type={isVisible ? 'text' : 'password'}
          value={value}
        />
        <InputGroup.Suffix className="">
          <Button
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            isIconOnly
            onPress={() => setIsVisible(!isVisible)}
            size="sm"
            variant="ghost"
          >
            {isVisible ? <Eye className="size-4" /> : <EyeSlash className="size-4" />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </TextField>
  );
}
