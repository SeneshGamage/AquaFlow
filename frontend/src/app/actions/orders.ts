"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/session";
import type { OrderResult } from "@/lib/types";

export type OrderFormState = { error?: string; success?: string } | undefined;

export async function placeOrderAction(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  // Server Actions are public endpoints: always re-check who is calling.
  await requireRole("BUYER");

  const fishId = Number(formData.get("fishId"));
  const quantity = Number(formData.get("quantity"));
  const notes = String(formData.get("notes") ?? "").trim();

  if (!Number.isInteger(fishId) || fishId < 1) return { error: "Unknown fish." };
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { error: "Quantity must be a whole number of at least 1." };
  }

  try {
    const order = await apiFetch<OrderResult>("/api/orders", {
      method: "POST",
      body: JSON.stringify({ fishId, quantity, notes: notes || null }),
    });
    revalidatePath("/buyer/catalog");
    return { success: `Order #${order.id} placed (${order.status}).` };
  } catch (e) {
    if (e instanceof ApiError && [400, 404, 409].includes(e.status)) return { error: e.message };
    return { error: "Something went wrong. Please try again." };
  }
}