# Exemplo: Streaming + Suspense

Next.js 16 envia HTML incremental; React 19 Suspense delimita o que pode aparecer cedo.

## Route loading

```1:3:src/app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

Substituir por skeleton alinhado ao design system em produção.

## Suspense por seção (recomendado)

```tsx
// app/(app)/analytics/page.tsx — Server
import { Suspense } from 'react';

import { AnalyticsPage } from '@/pages/app/analytics';
import { AnalyticsChartsSkeleton } from '@/widgets/analytics';

export default function Page() {
  return (
    <AnalyticsPage
      charts={
        <Suspense fallback={<AnalyticsChartsSkeleton />}>
          <AnalyticsChartsAsync />
        </Suspense>
      }
    />
  );
}
```

## Streaming + RTK (client)

1. Server streama shell e KPIs estáticos.
2. Client boundary hidrata gráficos com RTK + polling/SSE.
3. Updates incrementais não re-renderizam o layout inteiro se widgets isolados.

## Boundaries

```txt
layout (server)
  ├─ AppShell (client)     ← não bloqueia stream de children se children forem server/async
  └─ page (server/async)
       ├─ Header (sync)
       └─ Suspense → Charts (async server fetch)
```

Ver [server-client-strategy.md](../server-client-strategy.md).
