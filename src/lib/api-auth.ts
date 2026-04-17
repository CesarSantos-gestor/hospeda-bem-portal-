import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";
import { verifyToken, ADMIN_COOKIE_NAME } from "./auth";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function getAdminUser(req: NextRequest): Promise<AdminUser | null> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, role: true, active: true },
  });

  if (!user || !user.active || user.role !== "SUPER_ADMIN") return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function requireAdmin(req: NextRequest): Promise<{ user: AdminUser } | NextResponse> {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  return { user };
}
