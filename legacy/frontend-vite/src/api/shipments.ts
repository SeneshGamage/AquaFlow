import client from './client';
import type { Shipment } from '@/types';

export async function getAllShipments(): Promise<Shipment[]> {
  return await client.get('/shipments');
}

export async function getMyShipments(): Promise<Shipment[]> {
  return await client.get('/shipments/my');
}

export async function getShipmentById(id: number): Promise<Shipment> {
  return await client.get(`/shipments/${id}`);
}

export async function getShipmentByOrderId(orderId: number): Promise<Shipment> {
  return await client.get(`/shipments/order/${orderId}`);
}

export async function createShipment(data: {
  orderId: number;
  carrierName: string;
  trackingNumber: string;
  originCountry: string;
  destinationCountry: string;
  estimatedArrival: string;
  notes?: string;
}): Promise<Shipment> {
  return await client.post('/shipments', data);
}

export async function updateShipmentStatus(id: number, status: string): Promise<Shipment> {
  return await client.patch(`/shipments/${id}/status`, null, { params: { status } });
}

