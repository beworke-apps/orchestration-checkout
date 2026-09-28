/**
 * SSE subscription helper — lifecycle tied to AbortSignal (RTK onCacheEntryAdded).
 * @see docs/realtime.md
 */

export type SseSubscriptionOptions = {
  url: string;
  signal: AbortSignal;
  onEvent: (data: string) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
};

/**
 * Opens EventSource; closes when `signal` aborts.
 * Returns cleanup — call is optional if signal already handles teardown.
 */
export function createEventSourceSubscription({
  url,
  signal,
  onEvent,
  onError,
  onOpen,
}: SseSubscriptionOptions): () => void {
  if (typeof EventSource === 'undefined') {
    return () => {};
  }

  const source = new EventSource(url);

  const onMessage = (event: MessageEvent<string>) => {
    onEvent(event.data);
  };

  source.addEventListener('message', onMessage);
  source.addEventListener('open', () => onOpen?.());
  source.addEventListener('error', (event) => onError?.(event));

  const abort = () => {
    source.removeEventListener('message', onMessage);
    source.close();
  };

  signal.addEventListener('abort', abort, { once: true });

  return abort;
}
