import { describe, expect, it } from 'vitest';

import { mapUsersQueryToApi } from './map-users-query-to-api';
import type { UsersQueryParams } from './users-query.types';

describe('mapUsersQueryToApi Utility', () => {
  it('should assume system defaults for pagination parameters when properties are missing', () => {
    // Arrange
    const rawQuery: UsersQueryParams = {};

    // Act
    const result = mapUsersQueryToApi(rawQuery);

    // Assert
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
    });
  });

  it('should forward search and status attributes to API properties when specified', () => {
    // Arrange
    const rawQuery: UsersQueryParams = {
      page: 3,
      pageSize: 25,
      search: 'gustavo',
      status: 'active',
    };

    // Act
    const result = mapUsersQueryToApi(rawQuery);

    // Assert
    expect(result).toEqual({
      page: 3,
      pageSize: 25,
      filter: 'gustavo',
      status: 'active',
    });
  });

  it('should omit target parameters from the processed dictionary if conditional values are falsy', () => {
    // Arrange
    const rawQuery: UsersQueryParams = {
      page: 2,
      pageSize: 50,
      search: '',
    };

    // Act
    const result = mapUsersQueryToApi(rawQuery);

    // Assert
    expect(result).toEqual({
      page: 2,
      pageSize: 50,
    });
    expect(result.filter).toBeUndefined();
    expect(result.status).toBeUndefined();
  });
});
