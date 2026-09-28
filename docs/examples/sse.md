# Exemplo: SSE + RTK Query

Padrão preparado — implementação completa quando o BFF expuser SSE.

## Tipos

```6:23:src/store/services/realtime/types.ts
export type RealtimeChannel = 'dashboard' | 'analytics' | 'orders' | 'notifications';

export type RealtimeEvent<TPayload = unknown> = {
  channel: RealtimeChannel;
  type: string;
  payload: TPayload;
  timestamp: string;
};
```

## Padrão `onCacheEntryAdded` (referência)

Ver implementação documentada em:

`src/store/services/realtime/on-cache-entry-added.pattern.ts`

```ts
// Resumo do fluxo
async onCacheEntryAdded(arg, api) {
  const { updateCachedData, cacheEntryRemoved, dispatch } = api;
  const abort = new AbortController();

  subscribeDashboardSSE({
    signal: abort.signal,
    onEvent: (event) => {
      updateCachedData((draft) => mergeDashboardStats(draft, event.payload));
    },
  });

  await cacheEntryRemoved;
  abort.abort();
}
```

## Helpers SSE

`src/store/services/realtime/sse.ts` — `createEventSourceSubscription` com lifecycle `AbortSignal`.

## Quando SSE vs polling

| SSE                   | Polling RTK                               |
| --------------------- | ----------------------------------------- |
| Push frequente        | Updates raros                             |
| Um stream por recurso | Sem suporte backend                       |
| Métricas live         | Fallback em `RealtimeSubscriptionOptions` |

## BFF (futuro)

```txt
GET /api/dashboard/stream
Content-Type: text/event-stream
```

Route Handler em `src/app/api/dashboard/stream/route.ts` — não implementado; contrato reservado.
