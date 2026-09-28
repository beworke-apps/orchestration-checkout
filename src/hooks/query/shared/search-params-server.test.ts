import { describe, expect, it } from 'vitest';

import { parseSearchParams } from './search-params-server';

describe('parseSearchParams Server Utility', () => {
  it('should parse flat URLSearchParams instances directly against the schema', async () => {
    // Arrange
    const input = new URLSearchParams('search=enterprise&limit=10');
    const schema = {
      search: {
        key: 'search',
        parse: (raw: string | null) => raw ?? undefined,
        defaultValue: 'default',
      },
      limit: {
        key: 'limit',
        parse: (raw: string | null) => (raw ? Number(raw) : undefined),
        defaultValue: 20,
      },
    };

    // Act
    const result = await parseSearchParams(input, schema);

    // Assert
    expect(result).toEqual({
      search: 'enterprise',
      limit: 10,
    });
  });

  it('should await and resolve asynchronous Promise dictionary inputs', async () => {
    // Arrange
    const inputDict = { search: 'gustavo' };
    const asyncInput = Promise.resolve(inputDict);
    const schema = {
      search: {
        key: 'search',
        parse: (raw: string | null) => raw ?? undefined,
        defaultValue: 'default',
      },
    };

    // Act
    const result = await parseSearchParams(asyncInput, schema);

    // Assert
    expect(result).toEqual({
      search: 'gustavo',
    });
  });

  it('should ignore values that match undefined within record loops', async () => {
    // Arrange
    const inputDict = {
      search: undefined,
      status: 'active',
    };
    const schema = {
      search: {
        key: 'search',
        parse: (raw: string | null) => raw ?? undefined,
        defaultValue: 'fallback_search',
      },
      status: {
        key: 'status',
        parse: (raw: string | null) => raw ?? undefined,
        defaultValue: 'fallback_status',
      },
    };

    // Act
    const result = await parseSearchParams(inputDict, schema);

    // Assert
    expect(result).toEqual({
      search: 'fallback_search',
      status: 'active',
    });
  });

  it('should iterate arrays and append multiple instances under the same parameter key', async () => {
    // Arrange
    const inputDict = {
      tags: ['react', 'next'],
    };
    const schema = {
      tags: {
        key: 'tags',
        parse: (_raw: string | null, params?: URLSearchParams) =>
          params ? params.getAll('tags') : undefined,
        defaultValue: [],
      },
    };

    // Act
    const result = await parseSearchParams(inputDict, schema);

    // Assert
    expect(result).toEqual({
      tags: ['react', 'next'],
    });
  });

  it('should enforce defaultValue when parser resolves to null', async () => {
    // Arrange
    const inputDict = { search: 'any' };
    const schema = {
      search: {
        key: 'search',
        parse: () => null,
        defaultValue: 'enforced_fallback_from_null',
      },
    };

    // Act
    const result = await parseSearchParams(inputDict, schema);

    // Assert
    expect(result).toEqual({
      search: 'enforced_fallback_from_null',
    });
  });
});
