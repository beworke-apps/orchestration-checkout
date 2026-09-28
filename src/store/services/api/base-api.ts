import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './base-query';

export const apiTagTypes = [
  'Auth',
  'Users',
  'Dashboard',
  'DashboardStats',
  'Analytics',
  'Orders',
] as const;

export type ApiTagType = (typeof apiTagTypes)[number];

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [...apiTagTypes],
  endpoints: () => ({}),
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});
