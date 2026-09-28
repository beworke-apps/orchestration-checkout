# Exemplo: Client Component

Boundary client **mínima** para interatividade, HeroUI e Redux.

## Referência: Dashboard page

```1:20:src/components/pages/app/dashboard/index.tsx
'use client';

import { KpiRow } from '@/widgets/shared';
import { SalesPerformanceCard } from '@/widgets/shared';
import { TrafficSourceCard } from '@/widgets/shared';
import { DashboardToolbar } from '@/widgets/dashboard';
import { EmployeesTable } from '@/widgets/employees';

export function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pt-4 pb-10">
      <DashboardToolbar />
      <KpiRow />
      ...
    </div>
  );
}
```

## Referência: Sign-in

```1:17:src/components/pages/auth/sign-in/index.tsx
'use client';

import { PasswordField } from '@/components/composites/password-field';
import { TextField } from '@/components/composites/text-field';
import { AlternativeSign } from '@/widgets/auth';
import { useSignInMutation } from '@/store/services/auth';
```

## Referência: App shell (template)

```1:8:src/components/templates/app/index.tsx
'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';

import { usePathname, useRouter } from 'next/navigation';
```

## Quando extrair client filho

Se a page tiver uma seção estática grande + um gráfico interativo:

```tsx
// page server
export function AnalyticsPage() {
  return (
    <>
      <AnalyticsHeader /> {/* server */}
      <SessionsChartClient /> {/* client boundary */}
    </>
  );
}
```

Evite marcar a page inteira como client só por um filho.
