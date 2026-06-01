import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "eagle_bank_token";
const PUBLIC_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Already authenticated users shouldn't see the auth pages.
  if (isPublic) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Everything else is protected — bounce to login, preserving the target.
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)",
  ],
};
