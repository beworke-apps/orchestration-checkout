/**
 * Reference pattern for RTK Query realtime (SSE / WebSocket).
 * Copy into domain *.api.ts when backend stream is available — not registered by default.
 *
 * @example
 * ```ts
 * getDashboardStats: builder.query<DashboardStats, void>({
 *   query: () => '/dashboard/stats',
 *   async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
 *     await cacheDataLoaded;
 *     const controller = new AbortController();
 *     createEventSourceSubscription({
 *       url: '/api/dashboard/stream',
 *       signal: controller.signal,
 *       onEvent: (raw) => {
 *         const event = JSON.parse(raw) as RealtimeEvent<Partial<DashboardStats>>;
 *         updateCachedData((draft) => ({ ...draft, ...event.payload }));
 *       },
 *     });
 *     await cacheEntryRemoved;
 *     controller.abort();
 *   },
 * }),
 * ```
 */

export type OnCacheEntryAddedPattern = 'await-cacheDataLoaded-then-subscribe';
