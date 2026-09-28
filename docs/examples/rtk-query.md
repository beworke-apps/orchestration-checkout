# Exemplo: RTK Query

Toda HTTP client-side passa pelo slice central e endpoints injetados por domínio.

## Registro de endpoints

```1:11:src/store/root-reducer.ts
'use client';

import { combineReducers, createAction } from '@reduxjs/toolkit';

import './services/analytics/analytics.api';
import { api } from './services/api/base-api';
import './services/auth/auth.api';
import './services/dashboard/dashboard.api';
import './services/orders/orders.api';
import './services/users/users.api';
```

Preferir imports de barrel: `import '@/store/services/auth'`.

## Mutation com side-effect (auth)

```17:35:src/store/services/auth/auth.api.ts
    signIn: builder.mutation<SignInResponse, SignInDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.token) {
            dispatch(setSession({ user: data.user, token: data.token }));
            window.location.href = '/';
          }
        } catch {}
      },
    }),
```

## Consumo em componente

```tsx
import { useSignInMutation } from '@/store/services/auth';
import { useGetUsersQuery } from '@/store/services/users';

function Example() {
  const [signIn, { isLoading }] = useSignInMutation();
  const { data, refetch } = useGetUsersQuery({ page: 1 });

  return null;
}
```

## Tags e invalidação

Ver [cache-strategy.md](../cache-strategy.md) e `dashboard.api.ts` quando endpoints forem adicionados.

## Import correto

```ts
// ✅ domínio explícito
// ✅ agregador store (aceitável em infra/providers)
import { api } from '@/store/services';
import { useGetUsersQuery } from '@/store/services/users';
```
