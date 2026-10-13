"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { placeOrderAction, type OrderFormState } from "@/app/actions/orders";
import { formatPrice } from "@/lib/format";
import type { Fish } from "@/lib/types";

export function OrderDialog({ fish }: { fish: Fish }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [state, action, pending] = useActionState<OrderFormState, FormData>(
    placeOrderAction,
    undefined,
  );
  const soldOut = fish.quantityInStock <= 0;

  // Close the dialog a moment after a successful order.
  useEffect(() => {
    if (!state?.success) return;
    const timer = setTimeout(() => dialogRef.current?.close(), 1500);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <>
      <button
        type="button"
        disabled={soldOut}
        onClick={() => dialogRef.current?.showModal()}
        className="mt-4 w-full rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {soldOut ? "Out of stock" : "Place Order"}
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-black/50"
      >
        <form action={action} className="space-y-4 p-6">
          <input type="hidden" name="fishId" value={fish.id} />

          <div>
            <h2 className="text-lg font-bold text-ocean-900">{fish.commonName}</h2>
            <p className="text-sm text-ocean-600">
              {formatPrice(fish.pricePerUnit)} each · {fish.quantityInStock} available
            </p>
          </div>

          <label className="block text-sm font-medium text-ocean-800">
            Quantity
            <input
              name="quantity"
              type="number"
              min={1}
              max={fish.quantityInStock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <label className="block text-sm font-medium text-ocean-800">
            Notes (optional)
            <textarea
              name="notes"
              rows={2}
              className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <p className="text-sm font-semibold text-ocean-900">
            Total: {formatPrice(fish.pricePerUnit * (quantity || 0))}
            <p className="text-xs text-ocean-500">
              Your order is a request: stock is reserved when the supplier confirms it.
            </p>
          </p>

          {state?.error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
              {state.success}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg border border-ocean-200 px-4 py-2 text-sm"
            >
              Close
            </button>
            <button
              disabled={pending}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-800 disabled:opacity-60"
            >
              {pending ? "Placing…" : "Confirm order"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}