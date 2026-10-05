export interface User {
  id: number;
  name: string;
  email: string;
  role: 'OWNER' | 'SUPPLIER' | 'BUYER';
}

export interface Fish {
  id: number;
  commonName: string;
  scientificName: string;
  originCountry: string;
  description: string;
  quantityInStock: number;
  pricePerUnit: number;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: number;
  buyerId: number;
  buyerName: string;
  supplierId?: number;
  supplierName?: string;
  fishId: number;
  fishName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: number;
  orderId: number;
  buyerName: string;
  fishName: string;
  carrierName: string;
  trackingNumber: string;
  originCountry: string;
  destinationCountry: string;
  status: 'PREPARING' | 'IN_TRANSIT' | 'CUSTOMS' | 'DELIVERED';
  complianceDocumentUrl?: string;
  healthCertificateUrl?: string;
  estimatedArrival: string;
  actualArrival?: string;
  notes?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface DashboardSummary {
  totalOrders: number;
  pendingOrders: number;
  activeShipments: number;
  totalFishSpecies: number;
  totalSuppliers: number;
  totalBuyers: number;
  lowStockFish: Array<{ id: number; commonName: string; quantityInStock: number }>;
}

