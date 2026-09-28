import type { PaginatedResponse, PaginationParams } from '../types';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  customer: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
};

export type OrdersListParams = PaginationParams & {
  status?: OrderStatus;
};

export type OrdersListResponse = PaginatedResponse<Order>;

export type UpdateOrderStatusDto = {
  id: string;
  status: OrderStatus;
};
