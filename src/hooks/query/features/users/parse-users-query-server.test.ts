import { beforeEach, describe, expect, it, vi } from 'vitest';

import { parseSearchParams } from '../../shared/search-params-server';
import { mapUsersQueryToApi } from './map-users-query-to-api';
import {
  parseUsersApiParamsFromSearchParams,
  parseUsersQueryFromSearchParams,
} from './parse-users-query-server';
import { usersQuerySchema } from './users-query.schema';

vi.mock('../../shared/search-params-server', () => ({
  parseSearchParams: vi.fn(),
}));

vi.mock('./map-users-query-to-api', () => ({
  mapUsersQueryToApi: vi.fn(),
}));

describe('parseUsersQueryFromSearchParams Integrations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should forward search inputs and schema references directly into parser execution', async () => {
    // Arrange
    const dummyInput = new URLSearchParams('page=2');
    const expectedOutput = { page: 2, pageSize: 10 };
    vi.mocked(parseSearchParams).mockResolvedValue(expectedOutput);

    // Act
    const result = await parseUsersQueryFromSearchParams(dummyInput);

    // Assert
    expect(parseSearchParams).toHaveBeenCalledWith(dummyInput, usersQuerySchema);
    expect(result).toEqual(expectedOutput);
  });

  it('should await parsed objects from URL and transfer records directly to the API mapper', async () => {
    // Arrange
    const dummyInput = { search: 'gustavo' };
    const mockParsedQuery = { page: 1, pageSize: 10, search: 'gustavo' };
    const mockMappedApiParams = { page: 1, pageSize: 10, filter: 'gustavo' };

    vi.mocked(parseSearchParams).mockResolvedValue(mockParsedQuery);
    vi.mocked(mapUsersQueryToApi).mockReturnValue(mockMappedApiParams);

    // Act
    const result = await parseUsersApiParamsFromSearchParams(dummyInput);

    // Assert
    expect(parseSearchParams).toHaveBeenCalledWith(dummyInput, usersQuerySchema);
    expect(mapUsersQueryToApi).toHaveBeenCalledWith(mockParsedQuery);
    expect(result).toEqual(mockMappedApiParams);
  });
});
