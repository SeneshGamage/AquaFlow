export type Role = "ADMIN" | "OWNER" | "SUPPLIER" | "BUYER";

/** Matches the backend's ApiResponse<T> */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp?: string;
}

/** Matches the backend's AuthResponse */
export interface AuthData {
  token: string;
  email: string;
  name: string;
  role: Role;
  message: string;
}