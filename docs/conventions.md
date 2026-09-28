# Convenções

Padrões oficiais para naming, pastas, imports e barrels. Objetivo: **previsibilidade** para humanos e ferramentas de codegen.

## Naming

| Artefato             | Convenção                              | Exemplo                                   |
| -------------------- | -------------------------------------- | ----------------------------------------- |
| Pastas               | `kebab-case`                           | `dashboard-toolbar`, `sign-in`            |
| Componentes React    | `PascalCase`                           | `DashboardToolbar`                        |
| Hooks                | `camelCase` com prefixo `use`          | `useAppDispatch`                          |
| Slices / APIs RTK    | `camelCase` + sufixo                   | `session.slice.ts`, `orders.api.ts`       |
| Types                | `PascalCase`                           | `DashboardStats`, `OrdersRowActionsProps` |
| Schemas Zod          | `camelCase` + `Schema`                 | `signInSchema`                            |
| Constantes de config | `SCREAMING_SNAKE` ou objeto `as const` | `PUBLIC_ROUTES`                           |

## Estrutura de pasta (componente)

```txt
widgets/orders/orders-row-actions/
  orders-row-actions.tsx       # implementação
  orders-row-actions.types.ts  # props (quando não couber no .tsx)
  index.ts                     # API pública
```

Componentes simples podem ficar flat no domínio (`widgets/dashboard/dashboard-toolbar.tsx`) com barrel em `widgets/dashboard/index.ts`.

## Aliases TypeScript

| Alias            | Caminho                      |
| ---------------- | ---------------------------- |
| `@/*`            | `src/*`                      |
| `@/components/*` | `src/components/*`           |
| `@/widgets/*`    | `src/components/widgets/*`   |
| `@/templates/*`  | `src/components/templates/*` |
| `@/pages/*`      | `src/components/pages/*`     |
| `@/hooks/*`      | `src/hooks/*`                |
| `@/store/*`      | `src/store/*`                |
| `@/lib/*`        | `src/libs/*`                 |
| `@/config/*`     | `src/config/*`               |

## Import conventions

1. **Ordem** — Prettier (`@trivago/prettier-plugin-sort-imports`).
2. **Type-only** — `import type { X }` (`consistent-type-imports`).
3. **Contexto explícito** — importar do barrel de domínio, não de mega-barrel:

```ts
// ✅
import { OrdersRowActions } from '@/components/widgets/orders';
import { useGetUsersQuery } from '@/store/services/users';

// ❌
import { OrdersRowActions } from '@/components';
```

4. **Profundidade** — evitar `../../../`; usar alias `@/widgets/...` ou barrel local.
5. **Side-effect de API** — registrar endpoints via import em `root-reducer.ts`:

```ts
import '@/store/services/orders';
```

## Barrel export rules

Ver [export-strategy.md](./export-strategy.md).

- `index.ts` com exports **nomeados explícitos**.
- Evitar `export * from './module'` em barrels de domínio.
- Internals (`*.test.tsx`, helpers privados) **não** entram no barrel.

## `use client`

| Usar `"use client"`           | Não usar (Server Component)         |
| ----------------------------- | ----------------------------------- |
| Event handlers, estado local  | Layout estático, metadata           |
| RTK Query hooks               | Fetch inicial SSR                   |
| HeroUI interativo obrigatório | Composição pura de children         |
| Browser APIs                  | Pass-through de props serializáveis |

Arquivo: primeira linha do módulo, antes de imports.

## Providers

- Vivem em `src/providers/`.
- `AppProviders` compõe store, theme, session — **um** ponto de entrada no `app/layout.tsx`.
- Providers específicos não importam widgets de negócio.
- Client-only: `'use client'` no provider que usa hooks.

## Hooks

| Local                 | Uso                                                        |
| --------------------- | ---------------------------------------------------------- |
| `src/hooks/redux/`    | `useAppDispatch`, `useAppSelector` tipados                 |
| `src/hooks/<domain>/` | hooks de feature quando compartilhados                     |
| Colocated             | hooks usados só em um widget podem ficar ao lado do widget |

Não duplicar selectors RTK Query em hooks finos sem valor — preferir hooks gerados pelo RTK.

## Formatação e qualidade

- Prettier: `singleQuote`, `semi`, `printWidth: 100`, `trailingComma: all`.
- Tailwind: `prettier-plugin-tailwindcss`.
- Validar: `pnpm format:check`, `pnpm lint:strict`, `pnpm typecheck`.

## Commits

Conventional Commits: `feat`, `fix`, `refactor`, `perf`, `docs`, `chore`, `ci`, `build`. Use `pnpm commit` (Commitizen).

## Variáveis de ambiente

`.env.local` (não commitar). Validar via `src/env.ts`. `NEXT_PUBLIC_*` apenas para valores expostos ao browser.
