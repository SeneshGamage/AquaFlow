import { create } from 'zustand';

type AuthUser = { name: string; email: string; role: string };

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
};

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getInitialState(): Pick<AuthState, 'token' | 'user' | 'isAuthenticated'> {
  const token = localStorage.getItem('token');
  if (!token) return { token: null, user: null, isAuthenticated: false };

  const payload = decodeJwtPayload(token);
  const name = payload?.name ?? payload?.sub ?? 'User';
  const role = payload?.role ?? payload?.authorities?.[0] ?? '';
  const email = payload?.sub ?? payload?.email ?? '';

  return {
    token,
    user: { name, email, role: typeof role === 'string' ? role.replace('ROLE_', '') : '' },
    isAuthenticated: true,
  };
}

const initial = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token,
  user: initial.user,
  isAuthenticated: initial.isAuthenticated,
  login: (token, userData) => {
    localStorage.setItem('token', token);
    set({ token, user: userData, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

