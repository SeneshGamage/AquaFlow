"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/session";
import type { Fish } from "@/lib/types";

export interface FishFormValues {
  commonName: string;
  scientificName: string;
  originCountry: string;
  description: string;
  quantityInStock: string;
  pricePerUnit: string;
  imageUrl: string;
}

export type FishFormState = { error?: string; success?: boolean; values?: FishFormValues } | undefined;

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

function refresh() {
  revalidatePath("/owner/inventory");
  revalidatePath("/owner/dashboard");
  revalidatePath("/buyer/catalog");
}

/** Creates a fish (no `id` field) or updates one (`id` present). */
export async function saveFishAction(_prev: FishFormState, formData: FormData): Promise<FishFormState> {
  await requireRole("OWNER"); // Server Actions are public endpoints: always re-check who is calling

  const id = Number(formData.get("id")) || null;
  const values: FishFormValues = {
    commonName: text(formData, "commonName"),
    scientificName: text(formData, "scientificName"),
    originCountry: text(formData, "originCountry"),
    description: text(formData, "description"),
    quantityInStock: text(formData, "quantityInStock"),
    pricePerUnit: text(formData, "pricePerUnit"),
    imageUrl: text(formData, "imageUrl"),
  };

  const quantity = Number(values.quantityInStock);
  const price = Number(values.pricePerUnit);
  if (!values.commonName) return { error: "Name is required.", values };
  if (!values.originCountry) return { error: "Origin country is required.", values };
  if (values.quantityInStock === "" || !Number.isInteger(quantity) || quantity < 0) {
    return { error: "Stock must be a whole number, 0 or more.", values };
  }
  if (!(price >= 0.01)) return { error: "Price must be at least 0.01.", values };

  const body = {
    commonName: values.commonName,
    scientificName: values.scientificName || null,
    originCountry: values.originCountry,
    description: values.description || null,
    quantityInStock: quantity,
    pricePerUnit: price,
    imageUrl: values.imageUrl || null,
  };

  try {
    await apiFetch<Fish>(id ? `/api/fish/${id}` : "/api/fish", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(body),
    });
  } catch (e) {
    if (e instanceof ApiError && [400, 404, 409].includes(e.status)) return { error: e.message, values };
    return { error: "Something went wrong. Please try again.", values };
  }

  refresh();
  return { success: true };
}

/** Soft delete: the fish disappears from the catalog but keeps its order history. */
export async function deleteFishAction(formData: FormData): Promise<void> {
  await requireRole("OWNER");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;

  try {
    await apiFetch<null>(`/api/fish/${id}`, { method: "DELETE" });
  } catch (e) {
    if (!(e instanceof ApiError && e.status === 404)) throw e; // already gone is fine
  }
  refresh();
}