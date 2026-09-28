# RTK Query — API Layer

RTK Query is the **official client-side API layer** for this template.

## Rules

- All client-side HTTP requests go through RTK Query
- Do not use raw `fetch`, axios, or ad-hoc data hooks in components
- Server Components handle SSR / initial data; RTK Query handles client cache

## Central API slice

```ts
// src/store/services/api/base-api.ts
export const api = createApi({ ... });
```

Domain modules inject endpoints:

```ts
// src/store/services/dashboard/dashboard.api.ts
export const dashboardApi = api.injectEndpoints({ ... });
```

## Creating a new domain API

1. Create `domain.types.ts` — DTOs and domain models
2. Create `domain.transformers.ts` — map API → domain (optional)
3. Create `domain.api.ts` — inject endpoints
4. Import `domain.api.ts` in `root-reducer.ts` (side-effect registration)

## Example (dashboard)

```ts
import { useGetDashboardStatsQuery, useUpdateDashboardSettingsMutation } from '@/store/services';

function Dashboard() {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const [updateSettings] = useUpdateDashboardSettingsMutation();
}
```

## Base query features

- automatic headers (`Authorization`, `X-Request-Id`, `X-Workspace-Id`, locale, timezone)
- timeout (30s)
- retry (max 3)
- prepared refresh-token hook on `401`

## Environment

```env
NEXT_PUBLIC_API_URL=https://api.example.com   # optional override
NEXT_PUBLIC_APP_URL=http://localhost:3003     # fallback for SSR base URL
```

When unset, client requests default to `{origin}/api`.

## Realtime (prepared)

See `src/store/services/realtime/types.ts` for SSE/WebSocket lifecycle contracts.

Polling is enabled per-endpoint via `pollingInterval` in query options.
