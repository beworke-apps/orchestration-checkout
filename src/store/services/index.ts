export { api, apiTagTypes } from './api/base-api';
export type { ApiTagType } from './api/base-api';
export { baseQueryWithReauth, generateRequestId, resolveBaseUrl } from './api/base-query';
export type { ApiExtraOptions, RequestHeadersContext } from './api/types';

export { authApi, useGetSessionQuery, useLazyGetSessionQuery, useSignInMutation } from './auth';
export type { Session, SignInDto, SignInResponse } from './auth';

export { dashboardApi } from './dashboard';
export type { DashboardStats } from './dashboard';

export { analyticsApi } from './analytics';
export type { AnalyticsOverview } from './analytics';

export { ordersApi } from './orders';
export type { Order, OrderStatus } from './orders';

export { usersApi, useGetUsersQuery, useLazyGetUsersQuery } from './users';
export type { User, UsersListParams, UsersListResponse } from './users';

export { createEventSourceSubscription, createWebSocketSubscription } from './realtime';
export type {
  RealtimeChannel,
  RealtimeEvent,
  RealtimeSubscriptionOptions,
  SseSubscriptionOptions,
  WebSocketSubscriptionOptions,
} from './realtime';
