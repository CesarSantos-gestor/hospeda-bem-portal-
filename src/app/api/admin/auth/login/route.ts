import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.active || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, role: user.role, tenantId: null });

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
