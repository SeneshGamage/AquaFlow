import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, updateOrderStatus } from '@/api/orders';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import type { Order, OrderStatus } from '@/types';

const filters: Array<{ label: string; value: OrderStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Packed', value: 'PACKED' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function OwnerOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('ALL');

  const { data, isLoading, error } = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) =>
      await updateOrderStatus(id, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const orders = data ?? [];
  const filtered = useMemo(() => {
    if (filter === 'ALL') return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  if (isLoading) return <div className="p-6">Loading orders…</div>;
  if (error) return <div className="p-6 text-red-700">Failed to load orders.</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === f.value ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Fish</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-slate-600" colSpan={8}>
                  No orders.
                </td>
              </tr>
            ) : (
              filtered.map((o: Order) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="p-3 font-medium text-slate-900">#{o.id}</td>
                  <td className="p-3">{o.buyerName}</td>
                  <td className="p-3">{o.fishName}</td>
                  <td className="p-3">{o.quantity}</td>
                  <td className="p-3">${o.totalPrice}</td>
                  <td className="p-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    {nextStatuses[o.status].length === 0 ? (
                      <span className="text-xs text-slate-500">—</span>
                    ) : (
                      <select
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                        defaultValue=""
                        onChange={(e) => {
                          const v = e.target.value as OrderStatus;
                          if (!v) return;
                          statusMut.mutate({ id: o.id, status: v });
                          e.currentTarget.value = '';
                        }}
                        disabled={statusMut.isPending}
                      >
                        <option value="" disabled>
                          Update…
                        </option>
                        {nextStatuses[o.status].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

