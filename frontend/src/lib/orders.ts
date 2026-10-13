import "server-only";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/lib/types";

/** Orders of the signed-in buyer (or supplier). */
export const getMyOrders = () => apiFetch<Order[]>("/api/orders/my");