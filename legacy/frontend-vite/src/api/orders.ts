import client from './client';
import type { Order, OrderStatus } from '@/types';

export async function getAllOrders(): Promise<Order[]> {
  return await client.get('/orders');
}

export async function getMyOrders(): Promise<Order[]> {
  return await client.get('/orders/my');
}

export async function getOrderById(id: number): Promise<Order> {
  return await client.get(`/orders/${id}`);
}

export async function placeOrder(fishId: number, quantity: number, notes?: string): Promise<Order> {
  return await client.post('/orders', { fishId, quantity, notes });
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  return await client.patch(`/orders/${id}/status`, null, { params: { status } });
}

