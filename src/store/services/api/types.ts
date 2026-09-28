export type ApiExtraOptions = {
  skipAuth?: boolean;
  skipRetry?: boolean;
  workspaceId?: string;
};

export type RequestHeadersContext = {
  locale?: string;
  timezone?: string;
  workspaceId?: string;
};
