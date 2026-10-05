import client from './client';
import type { DashboardSummary } from '@/types';

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return await client.get('/dashboard/summary');
}

