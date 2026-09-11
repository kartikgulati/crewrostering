import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  // 1. Handle Unauthenticated users
  if (!token) {
    if (path.startsWith("/super-admin")) {
      // Don't redirect if already on the login page
      if (path === "/super-admin/login") return NextResponse.next();
      return NextResponse.redirect(new URL("/super-admin/login", req.url));
    }
    if (path.startsWith("/admin")) {
      // Don't redirect if already on the login page
      if (path === "/admin/login") return NextResponse.next();
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // 2. Authorization check for authenticated users
  if (path.startsWith("/super-admin")) {
    if (token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (path.startsWith("/admin")) {
    if (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*"],
};
