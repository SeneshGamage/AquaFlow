export type Role = "ADMIN" | "OWNER" | "SUPPLIER" | "BUYER";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

/** Matches the backend's OrderResponse */
export interface Order {
  id: number;
  buyerId: number;
  buyerName: string;
  supplierId: number | null;
  supplierName: string | null;
  fishId: number;
  fishName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  notes: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Matches GET /api/dashboard/summary */
export interface DashboardSummary {
  totalOrders: number;
  pendingOrders: number;
  activeShipments: number;
  totalFishSpecies: number;
  totalSuppliers: number;
  totalBuyers: number;
  lowStockFish: { id: number; commonName: string; quantityInStock: number }[];
}

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