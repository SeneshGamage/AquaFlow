import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ApiResponse<unknown>;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as any).data;
    }
    return response.data;
  },
  (error: AxiosError<any>) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Unauthorized'));
    }

    const message =
      error?.response?.data?.message ?? error?.response?.data ?? error?.message ?? 'Request failed';
    return Promise.reject(new Error(String(message)));
  },
);

export default client;

