# Exemplo: Server Component

Rota fina no App Router — **sem** `'use client'`. Delega composição para `components/pages` ou compõe diretamente widgets server-safe.

## Referência no template

```1:5:src/app/(app)/page.tsx
import { DashboardPage } from '@/components/pages/app/dashboard';

export default function Page() {
  return <DashboardPage />;
}
```

```13:20:src/app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="bg-background text-foreground" lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
```

## Padrão recomendado (produção)

```tsx
// src/app/(app)/orders/page.tsx — Server Component
import { OrdersPage } from '@/pages/app/orders';
import { getOrdersInitial } from '@/server/orders/get-orders-initial';

export default async function Page() {
  const initialOrders = await getOrdersInitial();

  return <OrdersPage initialOrders={initialOrders} />;
}
```

```tsx
// src/components/pages/app/orders/orders-page-client.tsx
'use client';

import { OrdersTable } from '@/widgets/orders';

export function OrdersPageClient({ initialOrders }: { initialOrders: Order[] }) {
  // seed RTK ou render estático inicial + hydrate
  return <OrdersTable initialData={initialOrders} />;
}
```

## Regras

- `fetch` / DB / auth no server
- Props serializáveis atravessando boundary client
- Metadata e `generateStaticParams` no mesmo arquivo de rota quando aplicável
