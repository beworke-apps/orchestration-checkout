/**
 * WebSocket subscription helper — one connection per call site; domain layer owns reuse policy.
 * @see docs/realtime.md
 */

export type WebSocketSubscriptionOptions = {
  url: string;
  protocols?: string | string[];
  signal: AbortSignal;
  onMessage: (data: string) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
};

export function createWebSocketSubscription({
  url,
  protocols,
  signal,
  onMessage,
  onOpen,
  onClose,
  onError,
}: WebSocketSubscriptionOptions): () => void {
  if (typeof WebSocket === 'undefined') {
    return () => {};
  }

  const socket = new WebSocket(url, protocols);

  socket.addEventListener('message', (event) => {
    if (typeof event.data === 'string') {
      onMessage(event.data);
    }
  });
  socket.addEventListener('open', () => onOpen?.());
  socket.addEventListener('close', (event) => onClose?.(event));
  socket.addEventListener('error', (event) => onError?.(event));

  const abort = () => {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close();
    }
  };

  signal.addEventListener('abort', abort, { once: true });

  return abort;
}
