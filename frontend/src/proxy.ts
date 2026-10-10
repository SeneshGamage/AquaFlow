import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt, requiredRoleForPath, SESSION_COOKIE } from "@/lib/jwt";

/**
 * Fast, optimistic routing only: the token's signature is NOT verified here.
 * The real check is getSession() (backend /api/auth/me) in layouts, pages and actions.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const claims = token ? decodeJwt(token) : null;
  const required = requiredRoleForPath(pathname);

  if (required && !claims) return NextResponse.redirect(new URL("/login", request.url));
  if (required && claims && claims.role !== required) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/supplier/:path*", "/buyer/:path*"],
};