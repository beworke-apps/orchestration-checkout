# HeroUI Pro — Dashboard Template (Foundation Enterprise)

Template oficial do ecossistema: **Next.js 16**, **React 19**, **HeroUI 3**, **HeroUI Pro**, **Tailwind v4** e arquitetura em camadas (`base` → `widgets` → `templates` → `pages`).

## Quick start

```bash
pnpm install
pnpm dev
```

App em [http://localhost:3003](http://localhost:3003).

## Scripts

| Script             | Uso                    |
| ------------------ | ---------------------- |
| `pnpm dev`         | Desenvolvimento        |
| `pnpm build`       | Build produção         |
| `pnpm lint:strict` | ESLint (zero warnings) |
| `pnpm format`      | Prettier               |
| `pnpm typecheck`   | TypeScript             |
| `pnpm test`        | Vitest                 |
| `pnpm test:e2e`    | Playwright             |
| `pnpm analyze`     | Bundle analyzer        |
| `pnpm commit`      | Commitizen             |

## Rotas

| Rota         | Conteúdo                           |
| ------------ | ---------------------------------- |
| `/`          | Dashboard: KPIs, charts, employees |
| `/orders`    | Orders scaffold                    |
| `/tracker`   | Tracker scaffold                   |
| `/analytics` | Analytics scaffold                 |
| `/settings`  | Settings scaffold                  |
| `/help`      | Help scaffold                      |

## Estrutura

```txt
src/
  app/                    # App Router (rotas finas)
  components/
    base/                 # wrappers mínimos HeroUI
    composites/           # composições pequenas
    widgets/              # blocos de UI (shared + ownership)
    templates/            # app shell, sidebar, navbar
    pages/                # composição por rota
  config/                 # nav items, config estática
  data/                   # mocks (substituir por services)
  env.ts                  # env validado (Zod + t3-env)
docs/                     # arquitetura, convenções, CI/CD
```

Documentação detalhada: [`docs/architecture.md`](docs/architecture.md), [`docs/widgets.md`](docs/widgets.md), [`docs/ci-cd.md`](docs/ci-cd.md), [`docs/testing-strategy.md`](docs/testing-strategy.md).

## Qualidade

- **ESLint 9** flat config + Next core-web-vitals + plugins enterprise
- **Prettier** + sort imports + Tailwind class order
- **TypeScript strict** + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`
- **Husky**: pre-commit (lint-staged), pre-push (typecheck + build), commit-msg (commitlint)

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste. Validar via `src/env.ts`.

## Pré-requisitos

- Node 20+
- pnpm 10+ (`packageManager` no `package.json`)
- Acesso ao registry **HeroUI Pro** para `@heroui-pro/react`

## CI

GitHub Actions: `ci.yml` (format, lint, typecheck, build) e `security.yml` (audit + dependency review).
