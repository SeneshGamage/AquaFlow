import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/jwt";
import type { ApiResponse } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Calls Spring Boot from the server, attaching the user's token if they have one. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  let body: ApiResponse<T> | null = null;
  try {
    body = await res.json();
  } catch {
    /* response had no JSON body */
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(res.status, body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}