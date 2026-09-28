import type { PaginatedResponse, PaginationParams } from '../types';

export type User = {
  id: string;
  code: string;
  name: string;
  email: string;
  document: string | null;
  documentType: string | null;
  isActive: boolean;
  emailVerified: boolean;
  platformRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  logins: number;
  lastLoginAt: string | null;
  language: 'PT_BR' | 'EN_US';
  phone: string;
  avatar: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UsersListParams = PaginationParams & {
  filter?: string;
  /** Mapped from URL `status` (e.g. active, inactive). */
  status?: string;
};

export type UsersListResponse = PaginatedResponse<User>;
