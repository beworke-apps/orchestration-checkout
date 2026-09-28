# Cache Strategy

RTK Query tag-based invalidation is the default cache strategy.

## Tag types

Defined in `src/store/services/api/base-api.ts`:

- `Auth`, `Users`, `Dashboard`, `DashboardStats`, `Analytics`, `Orders`

## Patterns

### Entity list

```ts
providesTags: (result) =>
  result
    ? [
        ...result.data.map(({ id }) => ({ type: 'Orders', id })),
        { type: 'Orders', id: 'LIST' },
      ]
    : [{ type: 'Orders', id: 'LIST' }],
```

### Single resource mutation

```ts
invalidatesTags: (_result, _error, { id }) => [
  { type: 'Orders', id },
  { type: 'Orders', id: 'LIST' },
],
```

### Dashboard aggregate

```ts
providesTags: [{ type: 'DashboardStats', id: 'LIST' }];

invalidatesTags: [
  { type: 'DashboardStats', id: 'LIST' },
  { type: 'Dashboard', id: 'SETTINGS' },
];
```

## Cache lifecycle defaults

| Setting                     | Value |
| --------------------------- | ----- |
| `keepUnusedDataFor`         | 60s   |
| `refetchOnMountOrArgChange` | 30s   |
| `refetchOnFocus`            | true  |
| `refetchOnReconnect`        | true  |

## Optimistic updates (prepared)

Use `onQueryStarted` in mutations for optimistic UI. See `orders.api.ts` comment.

## Realtime cache updates (prepared)

When SSE/WebSocket events arrive, use:

```ts
api.util.updateQueryData('getDashboardStats', undefined, (draft) => {
  // merge event payload
});
```

## When to invalidate vs update

- **invalidateTags** — after mutations that change server truth
- **updateQueryData** — for realtime streams and optimistic updates
- **prefetch** — for anticipated navigation (Server Component can seed, client prefetches)
