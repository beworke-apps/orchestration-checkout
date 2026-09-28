# CI/CD e qualidade local

## Comandos

| Comando              | Descrição                         |
| -------------------- | --------------------------------- |
| `pnpm dev`           | Dev server (porta 3003)           |
| `pnpm lint`          | ESLint                            |
| `pnpm lint:strict`   | ESLint sem warnings (CI)          |
| `pnpm lint:fix`      | ESLint com autofix                |
| `pnpm format`        | Prettier write                    |
| `pnpm format:check`  | Prettier check (CI)               |
| `pnpm typecheck`     | `tsc --noEmit`                    |
| `pnpm build`         | Build produção                    |
| `pnpm test`          | Vitest (watch)                    |
| `pnpm test:coverage` | Vitest + coverage                 |
| `pnpm test:e2e`      | Playwright                        |
| `pnpm analyze`       | Bundle analyzer (`ANALYZE=true`)  |
| `pnpm audit`         | Auditoria de dependências (high+) |
| `pnpm commit`        | Commitizen                        |

## Git hooks (Husky)

| Hook         | Ação                                             |
| ------------ | ------------------------------------------------ |
| `pre-commit` | `lint-staged` (ESLint fix + Prettier nos staged) |
| `pre-push`   | `typecheck` + `build`                            |
| `commit-msg` | Commitlint (Conventional Commits)                |

## GitHub Actions

### `ci.yml`

Em push/PR para `main` e `develop`:

1. `pnpm install --frozen-lockfile`
2. `pnpm format:check`
3. `pnpm lint:strict`
4. `pnpm typecheck`
5. `pnpm build`

Concurrency com `cancel-in-progress` para evitar runs duplicados.

### `security.yml`

- `pnpm audit --audit-level=high` em push para `main` e schedule semanal.
- `dependency-review-action` em pull requests.

## ESLint vs Prettier

- **Prettier**: formatação, ordem de imports, ordem de classes Tailwind.
- **ESLint**: qualidade (unused imports, duplicatas, sonarjs, regras Next/TS).
- `eslint-config-prettier` evita conflitos entre as duas ferramentas.

## Adicionar variável de ambiente

1. Documentar em `.env.example`.
2. Declarar schema em `src/env.ts` (server vs client).
3. Consumir via `import { env } from '@/env'`.
