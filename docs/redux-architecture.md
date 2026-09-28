# Redux Architecture

Enterprise store foundation for orchestration, business coordination, and global workflow state.

## Structure

```txt
src/store/
  index.ts              # configureStore, types, setupListeners
  root-reducer.ts       # combineReducers + endpoint registration
  middleware/           # global cross-cutting concerns
  slices/               # orchestration state (NOT UI state)
  services/             # RTK Query API layer
  hooks/                # typed hook re-exports
```

## When to use Redux slice

Use a Redux slice when you need:

- cross-route workflow coordination
- global feedback queue orchestration
- auth/session refresh orchestration
- multi-step business processes shared across features

Do **not** use Redux for:

- modal open/close
- sidebar collapse
- form field state
- transient UI state

## Typed hooks

```ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
```

## Provider (App Router)

`StoreProvider` creates one store instance per client session using `useRef`, compatible with React 19 and Next.js App Router hydration.

```tsx
// src/providers/app-providers.tsx
<StoreProvider>
  <ThemeProvider>
    <SessionProvider>{children}</SessionProvider>
  </ThemeProvider>
</StoreProvider>
```

## Devtools

Redux DevTools are enabled automatically when `NODE_ENV !== 'production'`.

## Feedback slice (prepared)

Location: `src/store/slices/feedback.slice.ts`

Actions: `pushFeedback`, `removeFeedback`, `clearFeedback`

Types: `success | error | warning | loading`

Future integration:

1. Middleware dispatches `pushFeedback` on API errors
2. Mutations dispatch `pushFeedback` on success
3. `FeedbackListener` client component reads queue and renders HeroUI Toast

Do not wire UI yet — queue orchestration only.
