// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Environment Variables Setup Operations', () => {
  const originalEnv = { ...process.env };
  const MOCK_APP_URL = 'https://agenus.com.br';

  beforeEach(() => {
    vi.resetModules();

    Object.keys(process.env).forEach((key) => {
      const mutableEnv = process.env as Record<string, string | undefined>;
      delete mutableEnv[key];
    });
    Object.assign(process.env, originalEnv);
  });

  it('should initialize runtime parameters applying default values for core node contexts', async () => {
    // Arrange
    const mutableEnv = process.env as Record<string, string | undefined>;
    delete mutableEnv.NODE_ENV;

    mutableEnv.NEXT_PUBLIC_APP_URL = MOCK_APP_URL;
    mutableEnv.NEXT_PUBLIC_API_URL = 'https://api.agenus.com.br';

    mutableEnv.NEXT_RUNTIME = 'nodejs';

    // Act
    const { env } = await import('./env');

    // Assert
    expect(env.NODE_ENV).toBe('development');
    expect(env.NEXT_PUBLIC_APP_URL).toBe(MOCK_APP_URL);
    expect(env.NEXT_PUBLIC_API_URL).toBe('https://api.agenus.com.br');
  });

  it('should transform blank strings into undefined when empty string modifiers are active', async () => {
    // Arrange
    const mutableEnv = process.env as Record<string, string | undefined>;
    mutableEnv.NODE_ENV = 'test';
    mutableEnv.NEXT_PUBLIC_APP_URL = MOCK_APP_URL;
    mutableEnv.NEXT_PUBLIC_API_URL = '';

    mutableEnv.NEXT_RUNTIME = 'nodejs';

    // Act
    const { env } = await import('./env');

    // Assert
    expect(env.NODE_ENV).toBe('test');
    expect(env.NEXT_PUBLIC_APP_URL).toBe(MOCK_APP_URL);
    expect(env.NEXT_PUBLIC_API_URL).toBeUndefined();
  });
});
