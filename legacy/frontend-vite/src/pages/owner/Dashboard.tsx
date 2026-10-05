import { useQuery } from '@tanstack/react-query';
import { Clock, Fish, ShoppingCart, Truck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '@/api/dashboard';
import type { DashboardSummary } from '@/types';

export default function OwnerDashboard() {
  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: getDashboardSummary,
  });

  if (isLoading) {
    return <div className="p-6">Loading dashboard…</div>;
  }
  if (error) {
    return <div className="p-6 text-red-700">Failed to load dashboard.</div>;
  }

  if (!data) {
    return <div className="p-6 text-red-700">No dashboard data available.</div>;
  }

  const summary = data;
  const chartData = [
    { name: 'Pending', value: summary.pendingOrders },
    { name: 'Active Shipments', value: summary.activeShipments },
    { name: 'Fish Species', value: summary.totalFishSpecies },
  ];

  const cards = [
    { label: 'Total Orders', value: summary.totalOrders, icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Pending Orders', value: summary.pendingOrders, icon: Clock, color: 'text-amber-600' },
    { label: 'Active Shipments', value: summary.activeShipments, icon: Truck, color: 'text-indigo-600' },
    { label: 'Fish Species', value: summary.totalFishSpecies, icon: Fish, color: 'text-teal-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">{c.label}</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">{c.value}</div>
              </div>
              <c.icon className={`h-6 w-6 ${c.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
        <div className="text-sm font-medium text-slate-900">Overview</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-900">Low stock alerts</div>
          <Link className="text-sm font-medium text-slate-900 underline" to="/inventory">
            Go to Inventory
          </Link>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Species</th>
                <th className="py-2 pr-4">Stock</th>
              </tr>
            </thead>
            <tbody>
              {summary.lowStockFish.length === 0 ? (
                <tr>
                  <td className="py-3 text-slate-600" colSpan={2}>
                    All good — no low stock items.
                  </td>
                </tr>
              ) : (
                summary.lowStockFish.map((f: DashboardSummary['lowStockFish'][number]) => (
                  <tr key={f.id} className="border-t border-slate-100">
                    <td className="py-2 pr-4 text-slate-900">{f.commonName}</td>
                    <td className="py-2 pr-4 text-slate-900">{f.quantityInStock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

