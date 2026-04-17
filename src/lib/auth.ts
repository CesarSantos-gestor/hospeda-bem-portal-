import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hospedabem-secret-key-change-in-production"
);

const COOKIE_NAME = "hb_token";
const ADMIN_COOKIE_NAME = "hb_admin_token";
const TOKEN_EXPIRY = "7d";

export { COOKIE_NAME, ADMIN_COOKIE_NAME };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: {
  userId: number;
  role: string;
  tenantId?: number | null;
}): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ userId: number; role: string; tenantId?: number | null } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as { userId: number; role: string; tenantId?: number | null };
  } catch {
    return null;
  }
}
