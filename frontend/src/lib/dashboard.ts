import "server-only";
import { apiFetch } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";

/** Owner-only summary numbers. */
export const getDashboardSummary = () => apiFetch<DashboardSummary>("/api/dashboard/summary");