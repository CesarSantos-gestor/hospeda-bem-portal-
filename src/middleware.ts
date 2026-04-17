import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hospedabem-secret-key-change-in-production"
);
const ADMIN_COOKIE_NAME = "hb_admin_token";

async function isAdminAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload as Record<string, unknown>).role === "SUPER_ADMIN";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin pages (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    const authed = await isAdminAuthenticated(request);
    if (!authed) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin-login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin APIs (except login)
  if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/auth/login") {
    const authed = await isAdminAuthenticated(request);
    if (!authed) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
