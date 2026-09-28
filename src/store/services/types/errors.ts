export type ApiErrorCode =
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export type ValidationFieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  code?: ApiErrorCode;
  message: string;
  errors?: ValidationFieldError[];
  requestId?: string;
  timestamp?: string;
};

export type StructuredApiLog = {
  endpoint?: string | undefined;
  status: number | string;
  message: string;
  timestamp: string;
  requestId?: string | undefined;
  code?: ApiErrorCode;
};
