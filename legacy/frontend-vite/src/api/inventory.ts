import client from './client';
import type { Fish } from '@/types';

export async function getAllFish(): Promise<Fish[]> {
  return await client.get('/fish');
}

export async function getFishById(id: number): Promise<Fish> {
  return await client.get(`/fish/${id}`);
}

export async function searchFish(name: string): Promise<Fish[]> {
  return await client.get('/fish/search', { params: { name } });
}

export async function createFish(data: Partial<Fish>): Promise<Fish> {
  return await client.post('/fish', data);
}

export async function updateFish(id: number, data: Partial<Fish>): Promise<Fish> {
  return await client.put(`/fish/${id}`, data);
}

export async function deleteFish(id: number): Promise<void> {
  await client.delete(`/fish/${id}`);
}

export async function updateStock(id: number, quantity: number): Promise<Fish> {
  return await client.patch(`/fish/${id}/stock`, null, { params: { quantity } });
}

