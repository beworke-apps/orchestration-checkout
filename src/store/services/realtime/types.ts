/**
 * Realtime architecture preparation (SSE / WebSocket / polling).
 * Not implemented yet — defines lifecycle contracts for future subscriptions.
 */

export type RealtimeChannel = 'dashboard' | 'analytics' | 'orders' | 'notifications';

export type RealtimeEvent<TPayload = unknown> = {
  channel: RealtimeChannel;
  type: string;
  payload: TPayload;
  timestamp: string;
};

export type RealtimeSubscriptionOptions = {
  channel: RealtimeChannel;
  /** Polling fallback interval in ms when SSE/WS unavailable */
  pollingIntervalMs?: number;
  /** Enable SSE stream when backend supports it */
  useSSE?: boolean;
  /** Enable WebSocket when backend supports it */
  useWebSocket?: boolean;
};

export type RealtimeSubscriptionLifecycle = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onEvent?: <TPayload>(event: RealtimeEvent<TPayload>) => void;
};

/**
 * Future: connect to SSE/WebSocket and dispatch cache updates via api.util.updateQueryData.
 * Example lifecycle hook signature for domain services.
 */
export type RealtimeCacheUpdater<TPayload> = (payload: TPayload) => void;
