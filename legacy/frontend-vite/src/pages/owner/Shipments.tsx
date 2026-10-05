import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createShipment, getAllShipments, updateShipmentStatus } from '@/api/shipments';
import type { Shipment } from '@/types';

const schema = z.object({
  orderId: z.coerce.number().int().positive(),
  carrierName: z.string().min(1),
  trackingNumber: z.string().min(1),
  originCountry: z.string().min(1),
  destinationCountry: z.string().min(1),
  estimatedArrival: z.string().min(1),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function OwnerShipments() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['shipments'], queryFn: getAllShipments });

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createMut = useMutation({
    mutationFn: async (values: FormValues) => await createShipment(values),
    onSuccess: async () => {
      form.reset();
      await qc.invalidateQueries({ queryKey: ['shipments'] });
    },
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) =>
      await updateShipmentStatus(id, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['shipments'] });
    },
  });

  if (isLoading) return <div className="p-6">Loading shipments…</div>;
  if (error) return <div className="p-6 text-red-700">Failed to load shipments.</div>;

  const shipments = data ?? [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Shipments</h1>

      <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
        <div className="text-sm font-medium text-slate-900">Create Shipment</div>
        <form className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={form.handleSubmit((v) => createMut.mutate(v))}>
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Order ID" {...form.register('orderId')} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Carrier name" {...form.register('carrierName')} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Tracking #" {...form.register('trackingNumber')} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Origin country" {...form.register('originCountry')} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Destination country" {...form.register('destinationCountry')} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Estimated arrival (YYYY-MM-DD)" {...form.register('estimatedArrival')} />
          <input className="md:col-span-3 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Notes (optional)" {...form.register('notes')} />
          <div className="md:col-span-3 flex justify-end">
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60" disabled={createMut.isPending}>
              {createMut.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Shipment</th>
              <th className="p-3">Order</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Fish</th>
              <th className="p-3">Carrier</th>
              <th className="p-3">Tracking</th>
              <th className="p-3">Route</th>
              <th className="p-3">Status</th>
              <th className="p-3">ETA</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr>
                <td className="p-4 text-slate-600" colSpan={10}>
                  No shipments.
                </td>
              </tr>
            ) : (
              shipments.map((s: Shipment) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="p-3 font-medium text-slate-900">#{s.id}</td>
                  <td className="p-3">#{s.orderId}</td>
                  <td className="p-3">{s.buyerName}</td>
                  <td className="p-3">{s.fishName}</td>
                  <td className="p-3">{s.carrierName}</td>
                  <td className="p-3">{s.trackingNumber}</td>
                  <td className="p-3">
                    {s.originCountry} → {s.destinationCountry}
                  </td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3">{new Date(s.estimatedArrival).toLocaleDateString()}</td>
                  <td className="p-3">
                    <select
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        statusMut.mutate({ id: s.id, status: v });
                        e.currentTarget.value = '';
                      }}
                      disabled={statusMut.isPending}
                    >
                      <option value="" disabled>
                        Update…
                      </option>
                      {['PREPARING', 'IN_TRANSIT', 'CUSTOMS', 'DELIVERED'].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
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

