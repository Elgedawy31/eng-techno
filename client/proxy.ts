import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // استثناء الصور وملفات static
  if (pathname.startsWith("/uploads") || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value || request.cookies.get("accessToken")?.value;

  // السماح لصفحة login
  if (pathname === "/dashboard/login") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // حماية باقي صفحات dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};


