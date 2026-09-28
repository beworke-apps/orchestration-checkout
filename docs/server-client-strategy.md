# Server / Client Strategy

Estratégia oficial de renderização e dados para **Next.js 16** + **React 19** + **RTK Query** em SaaS enterprise.

## Princípio central

> **Server Components por padrão.** Client Components e RTK Query apenas onde o problema exige.

```txt
Server Component (first paint, SEO, auth)
  ↓
Hydrate / seed cache (quando aplicável)
  ↓
RTK Query (cache, mutations, realtime)
```

## Server Components (default)

**Usar para:**

- SSR e first paint
- Resolução de sessão/auth no servidor
- SEO e metadata
- Dados iniciais de rota (`fetch` com cache Next)
- Composição estática de layouts

**Onde vivem:**

- `src/app/**/page.tsx`, `layout.tsx` (sem `'use client'`)
- Componentes em `components/` **sem** diretiva client
- Route Handlers `src/app/api/**`

## Client Components

**Usar somente quando necessário:**

| Necessidade         | Exemplo no template       |
| ------------------- | ------------------------- |
| Interatividade      | `DashboardToolbar`, forms |
| Hooks React / Redux | `SignInPage`, providers   |
| APIs de browser     | Cookies via libs client   |
| HeroUI interativo   | Tabs, Dropdown, Toast     |

**Proibido:** `'use client'` na raiz só para “facilitar” — empurrar a fronteira para o menor subtree possível.

## RTK Query (client)

**Usar para:**

- Cache cliente e deduplicação
- Mutations e invalidação por tags
- `refetchOnFocus`, polling, reconnect
- Atualizações **SSE / WebSocket** via `updateQueryData` / `onCacheEntryAdded`
- Dashboards interativos pós-hydration

**Não usar para:**

- First SSR load duplicando o mesmo endpoint sem estratégia de seed
- Estado de UI efêmero (modal, sidebar aberta)

Ver [rtk-query.md](./rtk-query.md), [cache-strategy.md](./cache-strategy.md).

## Matriz de decisão

| Cenário                 | Abordagem                             |
| ----------------------- | ------------------------------------- |
| Initial page load (SSR) | Server fetch → props ou seed cache    |
| Refresh manual / focus  | RTK `refetch`                         |
| Form submit             | RTK mutation + `invalidatesTags`      |
| Métricas ao vivo        | RTK + polling / SSE / WS              |
| Token refresh           | `baseQueryWithReauth` + slice session |
| Marketing estático      | Server only                           |

## Anti-patterns

- Fetch idêntico em Server Component **e** RTK Query no mount sem hydration
- Page inteira `'use client'` por um botão
- Redux para todo estado local
- RTK Query no root layout server

## Hydration pattern

1. Server Component busca dados iniciais (`fetch` / DB / BFF).
2. Serializa para Client boundary (`props` ou `api.util.upsertQueryData` em wrapper client).
3. RTK Query assume updates, mutations e realtime.

```tsx
// Futuro: HydrateDashboard.tsx (client)
// dispatch(api.util.upsertQueryData('getDashboardStats', undefined, initialStats));
```

## Suspense strategy

| Recurso                     | Uso                                                           |
| --------------------------- | ------------------------------------------------------------- |
| `loading.tsx`               | Fallback de rota (template atual: `src/app/loading.tsx`)      |
| `<Suspense fallback={...}>` | Boundaries por seção pesada                                   |
| Streaming                   | Server envia shell cedo; suspense boundaries delimitam chunks |

Preferir **múltiplos boundaries pequenos** a uma page monolítica que bloqueia tudo.

## Loading strategy

1. **Route-level** — `loading.tsx` ao lado do `layout`/`page`.
2. **Component-level** — skeletons em widgets (`isLoading` RTK ou `Suspense`).
3. **Mutation** — estados `isLoading` / optimistic UI na mutation.

## Streaming strategy

- Next.js 16 envia HTML incremental conforme Suspense resolve.
- Shell (layout + providers) estático primeiro; widgets lentos em Suspense filhos.
- Evitar client components acima de boundaries que deveriam streamar no server.

## Hydration boundaries

```txt
app/layout.tsx          → Server (providers client no filho)
  StoreProvider         → Client boundary #1
    (app)/layout        → AppShell client
      page              → Server ou Client conforme feature
        Widget (client) → Boundary mínima
```

Regra: **descer** `'use client'`, não subir.

## Cache strategy (resumo)

| Camada     | Ferramenta                              |
| ---------- | --------------------------------------- |
| Server     | `fetch` cache Next, revalidate tags     |
| Client API | RTK Query tags + `keepUnusedDataFor`    |
| Realtime   | `updateQueryData` / invalidate seletivo |

Detalhes: [cache-strategy.md](./cache-strategy.md).

## Exemplos no repositório

| Exemplo           | Arquivo                                        |
| ----------------- | ---------------------------------------------- |
| Server route fina | `src/app/(app)/page.tsx`                       |
| Client page       | `src/components/pages/app/dashboard/index.tsx` |
| RTK sign-in       | `src/components/pages/auth/sign-in/index.tsx`  |
| Loading global    | `src/app/loading.tsx`                          |

Mais: [examples/](./examples/README.md).
