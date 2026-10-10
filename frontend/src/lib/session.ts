import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt, NAME_COOKIE, SESSION_COOKIE } from "@/lib/jwt";
import type { Role } from "@/lib/types";
import { apiFetch, ApiError } from "@/lib/api";


export interface Session {
  email: string;
  name: string;
  role: Role;
}

/** Current user, verified by the backend (never trusts the cookie's contents). */
export const getSession = cache(async (): Promise<Session | null> => {
  const store = await cookies();
  if (!store.get(SESSION_COOKIE)?.value) return null;
  try {
    const me = await apiFetch<{ email: string; name: string; role: Role }>("/api/auth/me");
    return { email: me.email, name: me.name, role: me.role };
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null; // invalid / expired
    throw e; // backend down etc.: show the error page instead of pretending to be logged out
  }
});

/** Use at the top of every protected page/action: redirects instead of rendering. */
export async function requireRole(role: Role): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) redirect("/unauthorized");
  return session;
}