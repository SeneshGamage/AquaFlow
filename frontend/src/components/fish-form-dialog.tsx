"use client";

import { Pencil, Plus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { saveFishAction, type FishFormState, type FishFormValues } from "@/app/actions/fish";
import { Field } from "@/components/field";
import type { Fish } from "@/lib/types";

const EMPTY: FishFormValues = {
  commonName: "",
  scientificName: "",
  originCountry: "",
  description: "",
  quantityInStock: "0",
  pricePerUnit: "",
  imageUrl: "",
};

const fromFish = (f: Fish): FishFormValues => ({
  commonName: f.commonName,
  scientificName: f.scientificName ?? "",
  originCountry: f.originCountry,
  description: f.description ?? "",
  quantityInStock: String(f.quantityInStock),
  pricePerUnit: String(f.pricePerUnit),
  imageUrl: f.imageUrl ?? "",
});

/** "Add fish" button (no `fish` prop) or "Edit" button (with a `fish`) + the form dialog. */
export function FishFormDialog({ fish }: { fish?: Fish }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState<FishFormState, FormData>(saveFishAction, undefined);
  const editing = Boolean(fish);
  // After a failed save, keep what the user typed; otherwise start from the fish (or empty).
  const v = state?.values ?? (fish ? fromFish(fish) : EMPTY);

  useEffect(() => {
    if (state?.success) dialogRef.current?.close();
  }, [state]);

  return (
    <>
      {editing ? (
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ocean-200 px-3 py-2 text-sm hover:bg-ocean-50"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
      ) : (
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-800"
        >
          <Plus className="h-4 w-4" /> Add fish
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="m-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-0 shadow-2xl backdrop:bg-black/50"
      >
        <form action={action} className="space-y-4 p-6">
          <input type="hidden" name="id" value={fish?.id ?? ""} />
          <h2 className="text-lg font-bold text-ocean-900">{editing ? `Edit ${fish!.commonName}` : "Add a fish"}</h2>

          <Field label="Common name" name="commonName" required defaultValue={v.commonName} />
          <Field label="Scientific name" name="scientificName" defaultValue={v.scientificName} />
          <Field label="Origin country" name="originCountry" required defaultValue={v.originCountry} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Stock" name="quantityInStock" type="number" min={0} step={1} required defaultValue={v.quantityInStock} />
            <Field label="Price (USD)" name="pricePerUnit" type="number" min={0.01} step="0.01" required defaultValue={v.pricePerUnit} />
          </div>

          <Field label="Image URL" name="imageUrl" placeholder="/img/betta1.jpg or https://…" defaultValue={v.imageUrl} />

          <label className="block text-sm font-medium text-ocean-800">
            Description
            <textarea
              name="description"
              rows={3}
              defaultValue={v.description}
              className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-3 py-2 text-ocean-900 outline-none focus:border-brand focus:ring-2 focus:ring-accent/40"
            />
          </label>

          {state?.error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg border border-ocean-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={pending}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-800 disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}