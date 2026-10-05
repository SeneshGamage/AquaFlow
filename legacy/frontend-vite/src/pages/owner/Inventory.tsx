import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createFish, deleteFish, getAllFish, searchFish, updateFish, updateStock } from '@/api/inventory';
import type { Fish } from '@/types';

const fishSchema = z.object({
  commonName: z.string().min(1),
  scientificName: z.string().optional().or(z.literal('')),
  originCountry: z.string().min(1),
  description: z.string().optional().or(z.literal('')),
  quantityInStock: z.coerce.number().min(0),
  pricePerUnit: z.coerce.number().min(0.01),
  imageUrl: z.string().optional().or(z.literal('')),
});

type FishForm = z.infer<typeof fishSchema>;

export default function OwnerInventory() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [editing, setEditing] = useState<Fish | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const query = useQuery({
    queryKey: ['fish', debounced],
    queryFn: () => (debounced ? searchFish(debounced) : getAllFish()),
  });

  const form = useForm<FishForm>({ resolver: zodResolver(fishSchema) });

  const saveMut = useMutation({
    mutationFn: async (values: FishForm) => {
      const payload = {
        ...values,
        scientificName: values.scientificName || undefined,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
      };
      if (editing) return await updateFish(editing.id, payload);
      return await createFish(payload);
    },
    onSuccess: async () => {
      setShowForm(false);
      setEditing(null);
      form.reset();
      await qc.invalidateQueries({ queryKey: ['fish'] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => await deleteFish(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['fish'] });
    },
  });

  const stockMut = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => await updateStock(id, quantity),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['fish'] });
    },
  });

  const fish = query.data ?? [];

  const openCreate = () => {
    setEditing(null);
    form.reset({
      commonName: '',
      scientificName: '',
      originCountry: '',
      description: '',
      quantityInStock: 0,
      pricePerUnit: 1,
      imageUrl: '',
    });
    setShowForm(true);
  };

  const openEdit = (f: Fish) => {
    setEditing(f);
    form.reset({
      commonName: f.commonName,
      scientificName: f.scientificName ?? '',
      originCountry: f.originCountry,
      description: f.description ?? '',
      quantityInStock: f.quantityInStock,
      pricePerUnit: f.pricePerUnit,
      imageUrl: f.imageUrl ?? '',
    });
    setShowForm(true);
  };

  const rows = useMemo(() => fish, [fish]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Inventory</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search fish…"
            className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
          <button
            onClick={openCreate}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Fish
          </button>
        </div>
      </div>

      {query.isLoading ? (
        <div>Loading…</div>
      ) : query.error ? (
        <div className="text-red-700">Failed to load inventory.</div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Species</th>
                <th className="p-3">Scientific</th>
                <th className="p-3">Origin</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-600" colSpan={7}>
                    No fish found.
                  </td>
                </tr>
              ) : (
                rows.map((f) => (
                  <tr key={f.id} className="border-t border-slate-100">
                    <td className="p-3 font-medium text-slate-900">{f.commonName}</td>
                    <td className="p-3 text-slate-700">{f.scientificName}</td>
                    <td className="p-3 text-slate-700">{f.originCountry}</td>
                    <td className="p-3 text-slate-700">{f.quantityInStock}</td>
                    <td className="p-3 text-slate-700">${f.pricePerUnit}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          f.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {f.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          onClick={() => openEdit(f)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          onClick={() => {
                            const next = Number(prompt('Set stock quantity:', String(f.quantityInStock)));
                            if (!Number.isFinite(next)) return;
                            stockMut.mutate({ id: f.id, quantity: next });
                          }}
                        >
                          Update Stock
                        </button>
                        <button
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`Delete ${f.commonName}?`)) deleteMut.mutate(f.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow">
            <div className="text-lg font-semibold text-slate-900">
              {editing ? 'Edit Fish' : 'Add Fish'}
            </div>

            <form
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
              onSubmit={form.handleSubmit((v) => saveMut.mutate(v))}
            >
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Common name</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" {...form.register('commonName')} />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Scientific name</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" {...form.register('scientificName')} />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Origin</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" {...form.register('originCountry')} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Stock</label>
                <input type="number" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" {...form.register('quantityInStock')} />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Price</label>
                <input type="number" step="0.01" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" {...form.register('pricePerUnit')} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Image URL</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" {...form.register('imageUrl')} />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" {...form.register('description')} />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                  disabled={saveMut.isPending}
                >
                  {saveMut.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

