import "server-only";
import { apiFetch } from "@/lib/api";
import type { Fish } from "@/lib/types";

/** Public catalog: active fish only (the backend filters). */
export const getFish = () => apiFetch<Fish[]>("/api/fish");