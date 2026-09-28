# Exemplo: WebSocket

Foundation em `src/store/services/realtime/websocket.ts` — sem conexão global ativa.

## Ownership

```txt
SessionProvider / auth slice
  ↓ token válido
WebSocket (1 por workspace) — owned por realtime/websocket.ts
  ↓ eventos normalizados RealtimeEvent
Handlers por domínio → updateQueryData / invalidateTags
```

## Reconnect (contrato)

```ts
// websocket.ts — createWebSocketSubscription
// - backoff exponencial com jitter
// - maxRetries configurável
// - onOpen / onClose / onError callbacks
```

## Normalização de eventos

```ts
function handleSocketMessage(raw: MessageEvent): void {
  const event = parseRealtimeEvent(raw.data);
  if (event.channel === 'orders') {
    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }]));
  }
}
```

## Não fazer

- Nova `WebSocket` por widget montado
- Parse ad-hoc sem `RealtimeEvent`
- Estado duplicado fora do cache RTK

## Integração com RTK

Mesmo lifecycle que SSE: abrir em `onCacheEntryAdded`, fechar em `cacheEntryRemoved`.

Ver [realtime.md](../realtime.md).
