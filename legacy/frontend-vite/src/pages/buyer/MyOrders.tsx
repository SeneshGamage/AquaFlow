import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyOrders, updateOrderStatus } from '@/api/orders';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { useAuthStore } from '@/store/authStore';
import type { Order, OrderStatus } from '@/types';

const tabs: Array<{ label: string; value: OrderStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Packed', value: 'PACKED' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function MyOrders() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<(typeof tabs)[number]['value']>('ALL');

  const { data, isLoading, error } = useQuery({ queryKey: ['myOrders'], queryFn: getMyOrders });

  const confirmMut = useMutation({
    mutationFn: async (orderId: number) => await updateOrderStatus(orderId, 'CONFIRMED'),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });

  const orders = data ?? [];
  const filtered = useMemo(() => {
    if (tab === 'ALL') return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  if (isLoading) return <div className="p-6">Loading orders…</div>;
  if (error) return <div className="p-6 text-red-700">Failed to load orders.</div>;

  const role = user?.role;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">My Orders</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-3 py-1 text-sm ${
              tab === t.value ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 text-slate-600">
          No orders yet.
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Fish</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o: Order) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="p-3 text-slate-900">{o.fishName}</td>
                  <td className="p-3">{o.quantity}</td>
                  <td className="p-3">${o.totalPrice}</td>
                  <td className="p-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    {role === 'SUPPLIER' && o.status === 'PENDING' ? (
                      <button
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                        onClick={() => confirmMut.mutate(o.id)}
                        disabled={confirmMut.isPending}
                      >
                        Confirm
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

