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

/** Matches the backend's FishResponse */
export interface Fish {
  id: number;
  commonName: string;
  scientificName: string | null;
  originCountry: string;
  description: string | null;
  quantityInStock: number;
  pricePerUnit: number;
  imageUrl: string | null;
  active: boolean;
}

/** Matches the backend's OrderResponse (fields we use so far) */
export interface OrderResult {
  id: number;
  fishName: string;
  quantity: number;
  totalPrice: number;
  status: string;
}