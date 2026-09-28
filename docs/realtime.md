# Realtime Architecture

Foundation para **SSE**, **WebSocket**, **polling** e sincronização com **RTK Query** — sem implementação completa prematura.

## Objetivos

- Ownership e lifecycle claros por canal/domínio
- Integração previsível com `onCacheEntryAdded` e `updateQueryData`
- Escalar para enterprise sem event bus ou socket manager monolítico

## O que NÃO fazer (ainda)

- Socket manager global gigante
- Event bus genérico para todo o app
- Abstrações que escondem o canal (SSE vs WS) antes de haver 2+ consumidores reais

## O que SIM existe

| Artefato                   | Local                                                         |
| -------------------------- | ------------------------------------------------------------- |
| Tipos de canal/evento      | `src/store/services/realtime/types.ts`                        |
| Contratos SSE              | `src/store/services/realtime/sse.ts`                          |
| Contratos WebSocket        | `src/store/services/realtime/websocket.ts`                    |
| Padrão `onCacheEntryAdded` | `src/store/services/realtime/on-cache-entry-added.pattern.ts` |
| Barrel                     | `src/store/services/realtime/index.ts`                        |

## Canais oficiais

```ts
type RealtimeChannel = 'dashboard' | 'analytics' | 'orders' | 'notifications';
```

Novos canais exigem: tipo, documentação, owner squad, estratégia de cache (tag ou endpoint).

## SSE strategy

**Quando usar SSE**

- Feed unidirecional servidor → cliente (métricas, notificações, progress)
- HTTP-friendly (proxies, load balancers)
- Reconnect simples com `Last-Event-ID` (backend)

**Quando preferir polling**

- Baixa frequência de updates
- Backend sem SSE
- Fallback temporário (`pollingInterval` RTK)

**Integração RTK Query**

```ts
async onCacheEntryAdded(_arg, { updateCachedData, cacheEntryRemoved, dispatch }) {
  const controller = new AbortController();
  // subscribe SSE → normalize event → updateCachedData(draft => ...)
  await cacheEntryRemoved;
  controller.abort();
}
```

**Lifecycle**

1. Primeira subscription ao endpoint → abre SSE
2. Última unsubscribe / `cacheEntryRemoved` → fecha stream
3. Erro → `onError` + backoff (implementar por domínio)

Ver [examples/sse.md](./examples/sse.md).

## WebSocket strategy

**Quando usar WebSocket**

- Bidirecional (chat, colaboração, comandos)
- Alta frequência com payload pequeno
- Rooms por workspace/user

**Ownership**

- **Uma conexão por workspace** (ou por tab — documentar decisão de produto)
- Domínio registra handlers; não duplicar sockets por widget

**Connection management**

| Concern   | Abordagem                                 |
| --------- | ----------------------------------------- |
| Connect   | Após auth válida (token no slice/session) |
| Reconnect | Exponential backoff + jitter              |
| Heartbeat | Ping/pong ou server idle timeout          |
| Teardown  | `cacheEntryRemoved` + logout              |

**Event normalization**

```ts
type RealtimeEvent<T> = {
  channel: RealtimeChannel;
  type: string;
  payload: T;
  timestamp: string;
};
```

Mapear `type` → handler de cache por domínio (`dashboard` atualiza `DashboardStats`, etc.).

Ver [examples/websocket.md](./examples/websocket.md).

## Streaming strategy (React / Next)

| Tipo                     | Uso                                    |
| ------------------------ | -------------------------------------- |
| React Suspense streaming | Server envia UI parcial                |
| Partial rendering        | Seções independentes com boundaries    |
| Incremental              | KPIs rápidos primeiro, gráficos depois |

Combinar com Server Components para first paint; client widgets para updates finos.

Ver [examples/streaming.md](./examples/streaming.md).

## RTK Query realtime strategy

### Polling (hoje)

```ts
useGetDashboardStatsQuery(undefined, { pollingInterval: 30_000 });
```

### `onCacheEntryAdded` (preparado)

- Abre subscription quando cache entry é criada
- Fecha em `cacheEntryRemoved`
- Usa `updateCachedData` para merges incrementais
- Usa `invalidateTags` quando evento indica inconsistência total

### `updateQueryData` vs `invalidateTags`

| Método            | Quando                                |
| ----------------- | ------------------------------------- |
| `updateQueryData` | Eventos parciais, streams, optimistic |
| `invalidateTags`  | Mutations, resets, “unknown delta”    |

## Polling fallback

`RealtimeSubscriptionOptions.pollingIntervalMs` — quando SSE/WS indisponível, endpoint RTK usa `pollingInterval` equivalente.

## Roadmap de implementação

1. BFF expõe `/api/dashboard/stream` (SSE mock)
2. `dashboard.api.ts` implementa `onCacheEntryAdded` real
3. Métricas de conexão (opcional) por canal
4. WebSocket para notificações bidirecionais

## Documentação relacionada

- [cache-strategy.md](./cache-strategy.md)
- [server-client-strategy.md](./server-client-strategy.md)
- [examples/](./examples/README.md)
