import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route không cần login
const publicRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value || null;
  const { pathname } = req.nextUrl;

  // === Nếu user chưa login ===
  if (!token) {
    // cho qua các trang public
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // === Nếu user đã login ===
  // Không cho vào trang /login nữa → redirect về /
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware cho toàn bộ routes trừ static
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
