import type { OrderStatus } from "@/lib/types";

const LOW_STOCK_AT = 10;

export function StockBadge({ quantity }: { quantity: number }) {
  const [label, style] =
    quantity <= 0
      ? ["Out of stock", "bg-red-100 text-red-800"]
      : quantity < LOW_STOCK_AT
        ? ["Low stock", "bg-amber-100 text-amber-800"]
        : ["In stock", "bg-green-100 text-green-800"];

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow ${style}`}>{label}</span>
  );
}

const ORDER_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PACKED: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ORDER_STYLES[status] ?? "bg-ocean-100 text-ocean-800"}`}>
      {status}
    </span>
  );
}