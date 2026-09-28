# Widgets

Widgets são **blocos visuais completos**: seções, cards, tabelas, toolbars e qualquer UI que faça sentido como unidade de composição nas pages.

## O que é um widget

- Entrega **valor visual** sozinho (ou com props mínimas).
- Pode ser Client ou Server Component conforme necessidade.
- **Não** conhece rotas Next.js nem `src/app`.
- Recebe dados via **props**, **RTK Query** (client), ou children — não orquestra fluxos de negócio inteiros.

## Estrutura

```txt
widgets/
  shared/       → reutilizável entre 2+ domínios
  dashboard/    → ownership dashboard
  orders/       → ownership pedidos
  employees/    → ownership equipe
  analytics/    → widgets só de analytics (criar quando necessário)
  auth/         → login / registro / social
```

## `widgets/shared/` vs domínio

| Critério       | `shared/`                          | `dashboard/`, `orders/`, … |
| -------------- | ---------------------------------- | -------------------------- |
| Uso            | 2+ áreas do produto                | Um fluxo ou módulo         |
| Copy / colunas | Genérico ou configurável por props | Específico do domínio      |
| Ações          | Neutras ou parametrizadas          | Ações de negócio do módulo |
| Ownership      | Plataforma / design system squad   | Squad do domínio           |

**Exemplos**

- `KpiRow`, `SalesPerformanceCard` → `shared/` (dashboard + analytics).
- `DashboardToolbar`, `OrdersRowActions` → pasta do domínio.

## Quando criar um widget

Crie widget quando:

1. O bloco é reutilizado em mais de uma page **ou** é grande o suficiente para merecer arquivo próprio.
2. Há ownership claro (domínio ou shared).
3. A page ficaria ilegível com JSX inline.

Não crie widget para:

- Um `div` com duas classes usado uma vez.
- Lógica que deveria estar em service/slice sem UI.

## Boundaries

| Permitido                                     | Proibido                                       |
| --------------------------------------------- | ---------------------------------------------- |
| `composites`, `base`, HeroUI                  | `import from '@/app/...'`                      |
| `@/store/services/<domain>` em client widgets | `useRouter` para navegação principal           |
| `@/config` estático                           | Fetch duplicado server + client sem estratégia |
| Props tipadas exportadas no barrel            | Export default sem nome em APIs públicas       |

## Barrel e imports

```ts
// Consumidor (page ou outro widget)
import { DashboardToolbar } from '@/widgets/dashboard';
import { KpiRow } from '@/widgets/shared';
```

Ver [export-strategy.md](./export-strategy.md).

## Checklist de novo widget

1. Pasta `widgets/<domain>/nome-do-widget.tsx` (ou subpasta com `index.ts`).
2. `export function NomeDoWidget` (export nomeado).
3. Adicionar export em `widgets/<domain>/index.ts`.
4. `"use client"` apenas se necessário.
5. Consumir a partir de `pages/`, nunca direto de `app/` além do `page.tsx` fino.

## Exemplo

```tsx
// widgets/orders/orders-summary.tsx
export function OrdersSummary({ total }: { total: number }) {
  return <section>...</section>;
}
```

```tsx
// pages/app/orders/index.tsx
import { OrdersSummary } from '@/widgets/orders';
```
