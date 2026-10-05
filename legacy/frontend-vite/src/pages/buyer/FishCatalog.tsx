import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Fish as FishIcon } from 'lucide-react';
import { getAllFish } from '@/api/inventory';
import { placeOrder } from '@/api/orders';
import type { Fish } from '@/types';

export default function FishCatalog() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Fish | null>(null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const { data, isLoading, error } = useQuery({ queryKey: ['fish'], queryFn: getAllFish });

  const orderMut = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error('No fish selected');
      return await placeOrder(selected.id, qty, notes || undefined);
    },
    onSuccess: async () => {
      setSelected(null);
      setQty(1);
      setNotes('');
      await qc.invalidateQueries({ queryKey: ['fish'] });
    },
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((f) => f.commonName.toLowerCase().includes(term));
  }, [data, q]);

  if (isLoading) return <div className="p-6">Loading fish…</div>;
  if (error) return <div className="p-6 text-red-700">Failed to load fish.</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Fish Catalog</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name…"
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => {
          const stock = f.quantityInStock;
          const stockLabel = stock <= 0 ? 'Out of stock' : stock < 10 ? 'Low stock' : 'In stock';
          const stockClass =
            stock <= 0
              ? 'bg-red-100 text-red-800'
              : stock < 10
                ? 'bg-amber-100 text-amber-800'
                : 'bg-green-100 text-green-800';

          return (
            <div key={f.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FishIcon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{f.commonName}</div>
                    <div className="text-xs text-slate-600">{f.scientificName}</div>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stockClass}`}>
                  {stockLabel}
                </span>
              </div>

              <div className="mt-3 text-sm text-slate-700">
                <div>
                  <span className="text-slate-500">Origin:</span> {f.originCountry}
                </div>
                <div>
                  <span className="text-slate-500">Price:</span> ${f.pricePerUnit}
                </div>
              </div>

              <button
                disabled={f.quantityInStock <= 0}
                className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                onClick={() => {
                  setSelected(f);
                  setQty(1);
                  setNotes('');
                }}
              >
                Place Order
              </button>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
            <div className="text-lg font-semibold text-slate-900">Place order</div>
            <div className="mt-1 text-sm text-slate-600">{selected.commonName}</div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={selected.quantityInStock}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </div>

            {orderMut.error && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {(orderMut.error as any).message ?? 'Failed to place order'}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
                onClick={() => setSelected(null)}
                disabled={orderMut.isPending}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={() => orderMut.mutate()}
                disabled={orderMut.isPending}
              >
                {orderMut.isPending ? 'Placing…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

