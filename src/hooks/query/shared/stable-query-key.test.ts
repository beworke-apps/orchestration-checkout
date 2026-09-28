import { describe, expect, it } from 'vitest';

import { stableQueryKey } from './stable-query-key';

describe('stableQueryKey Utility', () => {
  it('should generate a stringified JSON key with sorted object parameters', () => {
    // Arrange
    const params = {
      status: 'active',
      page: 1,
      isActive: true,
    };

    // Act
    const result = stableQueryKey(params);

    // Assert
    expect(result).toBe('{"isActive":true,"page":1,"status":"active"}');
  });

  it('should ignore empty fields and produce a stable format matching filtered properties', () => {
    // Arrange
    const params = {
      search: '',
      filter: null,
      context: undefined,
      valid: 'passed',
    };

    // Act
    const result = stableQueryKey(params);

    // Assert
    expect(result).toBe('{"valid":"passed"}');
  });
});
