import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt, NAME_COOKIE, SESSION_COOKIE } from "@/lib/jwt";
import type { Role } from "@/lib/types";

export interface Session {
  email: string;
  name: string;
  role: Role;
}

/** Current user from the cookie, or null. `cache` = computed once per request. */
export const getSession = cache(async (): Promise<Session | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const claims = token ? decodeJwt(token) : null;
  if (!claims) return null;
  return {
    email: claims.email,
    role: claims.role,
    name: store.get(NAME_COOKIE)?.value ?? claims.email,
  };
});

/** Use at the top of every protected page/action: redirects instead of rendering. */
export async function requireRole(role: Role): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) redirect("/unauthorized");
  return session;
}