import type { Role } from "@/lib/types";

export const SESSION_COOKIE = "aquaflow_session";
export const NAME_COOKIE = "aquaflow_name";

export interface JwtClaims {
  email: string;
  role: Role;
  exp: number; // seconds since epoch
}

/**
 * Decodes a JWT payload. It does NOT verify the signature — Spring Boot does that on every API call.
 * We only need the claims to decide where to route the user and what to show.
 */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(b64));
    if (!claims.sub || !claims.role || !claims.exp) return null;
    if (claims.exp * 1000 < Date.now()) return null; // expired
    return { email: claims.sub, role: claims.role as Role, exp: claims.exp };
  } catch {
    return null;
  }
}

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin/users",
  OWNER: "/owner/dashboard",
  SUPPLIER: "/supplier/orders",
  BUYER: "/buyer/catalog",
};

const AREA_ROLE: Record<string, Role> = {
  admin: "ADMIN",
  owner: "OWNER",
  supplier: "SUPPLIER",
  buyer: "BUYER",
};

/** "/owner/orders" -> "OWNER"; public paths -> null */
export function requiredRoleForPath(pathname: string): Role | null {
  return AREA_ROLE[pathname.split("/")[1]] ?? null;
}