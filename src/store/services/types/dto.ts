/** Raw API payloads before domain transformation. */
export type ApiResponseMeta = {
  requestId?: string;
  timestamp?: string;
};

export type ApiEnvelope<T> = {
  data: T;
  meta?: ApiResponseMeta;
};
