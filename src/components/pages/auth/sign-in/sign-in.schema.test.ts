import { describe, expect, it } from 'vitest';

import { signInSchema } from './sign-in.schema';

describe('signInSchema Validation Bounds', () => {
  it('should successfully pass validation when credentials match standard structural criteria', () => {
    // Arrange
    const validPayload = {
      email: 'dev@agenus.com.br',
      password: 'securePassword123',
    };

    // Act
    const result = signInSchema.safeParse(validPayload);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it('should reject malformed email structures with a explicit customized error message', () => {
    // Arrange
    const invalidPayload = {
      email: 'invalid-email-format',
      password: 'securePassword123',
    };

    // Act
    const result = signInSchema.safeParse(invalidPayload);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.format().email?._errors[0];
      expect(emailError).toBe('Email inválido');
    }
  });

  it('should enforce a strict lower bound character minimum constraint on password attributes', () => {
    // Arrange
    const invalidPayload = {
      email: 'dev@agenus.com.br',
      password: 'short',
    };

    // Act
    const result = signInSchema.safeParse(invalidPayload);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.format().password?._errors[0];
      expect(passwordError).toBe('Senha deve ter no mínimo 8 caracteres');
    }
  });
});
