import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt, requiredRoleForPath, ROLE_HOME, SESSION_COOKIE } from "@/lib/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const claims = token ? decodeJwt(token) : null;
  const required = requiredRoleForPath(pathname);

  // Signed out → login
  if (required && !claims) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Signed in, wrong area (e.g. a Buyer opening /owner/...) → unauthorized
  if (required && claims && claims.role !== required) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  // Signed in users don't need the login/register pages
  if (claims && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(ROLE_HOME[claims.role], request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/supplier/:path*", "/buyer/:path*", "/login", "/register"],
};