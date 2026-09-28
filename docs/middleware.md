# Global Middleware

## RTK Query Error Middleware

Location: `src/store/middleware/rtk-query-error.middleware.ts`

Intercepts all RTK Query rejected actions globally via `isRejectedWithValue`.

### Handled cases

| Status / Code   | Behavior (current)     | Future                   |
| --------------- | ---------------------- | ------------------------ |
| `401`           | structured console log | refresh token + logout   |
| `403`           | structured console log | permission modal         |
| `422`           | structured console log | form validation feedback |
| `500`           | structured console log | incident reporting       |
| `FETCH_ERROR`   | structured console log | offline banner           |
| `TIMEOUT_ERROR` | structured console log | retry UI                 |

### Log format

```ts
console.error({
  endpoint,
  status,
  message,
  timestamp,
  requestId,
  code,
});
```

### Integration points (prepared)

- `pushFeedback` from `feedback.slice.ts` for global toasts
- Sentry / telemetry hooks in `handleStatusSideEffects`
- audit log pipeline

## Middleware chain order

```ts
getDefaultMiddleware()
  .concat(api.middleware) // RTK Query lifecycle
  .concat(rtkQueryErrorMiddleware); // global error handling
```

## Testing errors locally

Dashboard stats route supports simulation:

- `GET /api/dashboard/stats?error=500`
- `GET /api/dashboard/stats?error=401`

Errors appear in the browser console with structured metadata.
