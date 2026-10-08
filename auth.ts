import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
export const COOKIE = "electronex_admin";
const key = () => { const s = process.env.AUTH_SECRET; if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (32+ characters)"); return new TextEncoder().encode(s); };
export async function createSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
  cookies().set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
// Verifies the signed cookie AND that the admin still exists and the password wasn't changed after login.
export async function requireAdmin() {
  const t = cookies().get(COOKIE)?.value;
  try {
    if (t) {
      const { payload } = await jwtVerify(t, key());
      const a = await db.adminUser.findUnique({ where: { id: String(payload.sub) } });
      if (a && (payload.iat ?? 0) >= Math.floor(a.passwordChangedAt.getTime() / 1000)) return a.id;
    }
  } catch {}
  redirect("/admin/login");
}
