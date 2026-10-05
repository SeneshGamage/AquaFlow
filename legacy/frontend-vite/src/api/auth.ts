import client from './client';
import type { AuthResponse } from '@/types';

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return await client.post('/auth/login', { email, password });
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string,
): Promise<AuthResponse> {
  return await client.post('/auth/register', { name, email, password, role });
}

