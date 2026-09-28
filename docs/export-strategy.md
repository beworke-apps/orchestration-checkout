# Export Strategy

Estratégia oficial de **barrel exports** para escala enterprise: API pública explícita por domínio, sem mega-barrel global.

## Princípios

| Regra                    | Descrição                                                     |
| ------------------------ | ------------------------------------------------------------- |
| **Barrels locais**       | Cada componente/feature expõe `index.ts` na pasta pública     |
| **Barrels de domínio**   | `widgets/orders/index.ts`, `pages/app/index.ts`, etc.         |
| **Exports explícitos**   | `export { X } from './x'` — evitar `export *` sem necessidade |
| **Sem barrel global**    | Proibido `src/index.ts` ou `@/components` agregando tudo      |
| **Imports com contexto** | O path do import deve revelar a camada e o domínio            |

## Proibido

```ts
// ❌ Mega barrel — esconde boundaries e piora tree-shaking previsível
export * from '@/components';

// ❌ Global root
// src/index.ts
```

## Correto

```ts
// ✅ Domínio explícito
import { IconButton } from '@/components/base/icon-button';
import { DashboardPage } from '@/components/pages/app/dashboard';
import { OrdersRowActions } from '@/components/widgets/orders';
import { useAppDispatch } from '@/hooks/redux';
import { useGetUsersQuery } from '@/store/services/users';
```

## Estrutura de barrel (componente)

```txt
widgets/dashboard/
  dashboard-toolbar.tsx
  index.ts                    ← barrel do domínio dashboard
```

```ts
// widgets/dashboard/index.ts
export { DashboardToolbar } from './dashboard-toolbar';
```

Quando o widget crescer (types, testes, subcomponentes):

```txt
widgets/dashboard/dashboard-toolbar/
  dashboard-toolbar.tsx
  dashboard-toolbar.types.ts
  index.ts
```

```ts
// widgets/dashboard/dashboard-toolbar/index.ts
export { DashboardToolbar } from './dashboard-toolbar';
export type { DashboardToolbarProps } from './dashboard-toolbar.types';
```

## Onde existem barrels

### `src/components/`

| Camada              | Barrel                                                    |
| ------------------- | --------------------------------------------------------- |
| `base/`             | `base/index.ts` + por componente (`icon-button/index.ts`) |
| `composites/`       | `composites/index.ts` + por composite                     |
| `widgets/<domain>/` | `widgets/<domain>/index.ts`                               |
| `templates/<name>/` | `templates/<name>/index.ts`                               |
| `pages/<area>/`     | `pages/app/index.ts`, `pages/auth/index.ts`, etc.         |

**Não** criar `components/widgets/index.ts` que reexporta todos os domínios.

### `src/store/services/`

Cada domínio possui `index.ts`:

```txt
services/
  auth/index.ts
  dashboard/index.ts
  orders/index.ts
  users/index.ts
  analytics/index.ts
  realtime/index.ts
```

`services/index.ts` permanece como **agregador da camada store** (RTK Query hooks e `api`), não substitui imports de domínio em código de feature.

### `src/hooks/`

```txt
hooks/redux/index.ts   → useAppDispatch, useAppSelector
```

## Aliases e paths

Preferir aliases que espelham a pasta física:

| Import                   | Resolve para                         |
| ------------------------ | ------------------------------------ |
| `@/widgets/dashboard`    | `src/components/widgets/dashboard`   |
| `@/pages/app/dashboard`  | `src/components/pages/app/dashboard` |
| `@/templates/app`        | `src/components/templates/app`       |
| `@/store/services/users` | `src/store/services/users`           |

`@/components/widgets/orders` e `@/widgets/orders` são equivalentes quando o alias `@/widgets/*` está configurado — preferir `@/widgets/*` em código de UI para brevidade com contexto.

## Refactor seguro

1. Adicionar `index.ts` com exports explícitos.
2. Atualizar imports consumidores para o barrel de domínio.
3. Manter arquivos internos (`*.types.ts`, `*.test.tsx`) **fora** do barrel quando não forem API pública.
4. Nunca reexportar implementação interna (helpers, mappers privados).

## Checklist de PR

- [ ] Novo módulo público tem `index.ts`
- [ ] Exports são nomeados e explícitos
- [ ] Nenhum import de `@/components` sem subpath de domínio
- [ ] Nenhum `export *` em barrel de domínio sem justificativa
- [ ] `pnpm typecheck` e `pnpm build` passam
