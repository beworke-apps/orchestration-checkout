# URL State Architecture

## Princípio

A **URL é a source of truth oficial** para:

- filtros
- paginação
- search
- sorting
- tabs
- table state (visível na URL)

Benefícios: URLs compartilháveis, SSR, histórico do browser, deep linking, persistência no refresh e compatibilidade com App Router.

## Estrutura

```txt
src/hooks/query/
  core/          # manipulação central da URL (único lugar com router.push/replace)
  filters/       # paginação, search, sort, date, multi-select, tabs
  features/      # regras por domínio (users, analytics, reports, dashboard)
  shared/        # normalização, cache keys, parsers server-side

src/types/query/ # tipos e schemas de query params
```

## Core

| Hook / módulo         | Responsabilidade                                        |
| --------------------- | ------------------------------------------------------- |
| `useQueryState`       | Lê `searchParams` e retorna estado tipado via schema    |
| `useQueryActions`     | `setQuery`, `removeQuery`, `mergeQuery`, `resetQuery`   |
| `useQueryParser`      | parse string, number, boolean, array, enum, date, range |
| `useQuerySerializer`  | serialização consistente para a URL                     |
| `useQueryTransaction` | updates atômicos + `resetPage` automático               |

### Transações

```ts
const { updateQuery } = useQueryTransaction();

updateQuery({ search: 'tadeu', status: 'active' }, { resetPage: true });
```

## Filters (sem router direto)

```ts
const { page, limit, setPage, nextPage, previousPage } = usePaginationFilter();
const { search, setSearch, clearSearch, inputValue } = useSearchFilter({ key: 'search' });
const { field, direction, setSortFromDescriptor } = useSortFilter();
```

## Features

Encapsulam schema + mapeamento para API/RTK:

```ts
const { queryParams } = useUsersFilters();
useGetUsersQuery(queryParams);
```

Server (RSC):

```ts
import { parseUsersApiParamsFromSearchParams } from '@/hooks/query/features/users';

export default async function Page({ searchParams }) {
  const params = await parseUsersApiParamsFromSearchParams(searchParams);
  // fetchUsersServer(params)
}
```

## RTK Query

- **URL** controla filtros/paginação/sort.
- **RTK** consome `queryParams`, cacheia e invalida.
- Use `stableQueryKey` / `serializeQueryArgs` para evitar cache duplicado.

## Quando usar cada estado

| Caso                       | Estado                             |
| -------------------------- | ---------------------------------- |
| Filtros, página, sort, tab | URL (`hooks/query`)                |
| Modal, hover, animação     | `useState` local                   |
| Sessão / auth global       | Redux slice                        |
| Dados remotos              | RTK Query (derivado da URL)        |
| Layout estático / SEO      | Server Components + `searchParams` |

## Quando NÃO usar URL state

- estado de modal/drawer (use query só se precisar deep link)
- animações e hover
- formulários em edição antes do submit

## SSR / App Router

1. Client: hooks em componentes com `'use client'`.
2. Envolva com `<Suspense>` páginas que usam `useSearchParams`.
3. Server: `parseSearchParams` / `parseUsersQueryFromSearchParams` sem hooks.

## Realtime (futuro)

A URL permanece estável; polling/SSE/WebSocket invalidam tags RTK sem substituir filtros na store.

## DX — checklist para nova feature

1. Definir `*QueryParams` em `features/<name>/`.
2. Criar `*QuerySchema` + `map*QueryToApi`.
3. Expor `use*Filters()` consumindo filter hooks.
4. Passar `queryParams` para RTK Query.
5. Documentar keys da URL neste arquivo se forem públicas.
