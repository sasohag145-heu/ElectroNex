import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };
const DUMMY = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5hF9u5i8m8pQ0bVxq4w3Y0Z2d3k9mKy";
const WINDOW = 15 * 60 * 1000;
export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  async function login(f: FormData) {
    "use server";
    const email = String(f.get("email") || "").trim().toLowerCase().slice(0, 200); const pw = String(f.get("password") || "").slice(0, 200);
    const ip = (headers().get("x-forwarded-for") || "unknown").split(",")[0].trim();
    const since = new Date(Date.now() - WINDOW);
    const [byEmail, byIp] = await Promise.all([db.loginAttempt.count({ where: { key: `e:${email}`, createdAt: { gt: since } } }), db.loginAttempt.count({ where: { key: `i:${ip}`, createdAt: { gt: since } } })]);
    if (byEmail >= 5 || byIp >= 10) redirect("/admin/login?error=locked");
    const a = await db.adminUser.findUnique({ where: { email } });
    const ok = await bcrypt.compare(pw, a?.passwordHash || DUMMY);
    if (!a || !ok) {
      await db.loginAttempt.createMany({ data: [{ key: `e:${email}` }, { key: `i:${ip}` }] });
      await db.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 3600 * 1000) } } });
      redirect("/admin/login?error=1");
    }
    await db.loginAttempt.deleteMany({ where: { key: `e:${email}` } });
    await createSession(a.id); redirect("/admin/dashboard");
  }
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form action={login} className="mt-6 space-y-3">
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border px-3 py-2.5" />
        <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border px-3 py-2.5" />
        {searchParams.error === "locked" ? <p className="text-sm text-red-600">Too many attempts. Please wait 15 minutes and try again.</p> : searchParams.error && <p className="text-sm text-red-600">Wrong email or password.</p>}
        <button className="w-full rounded-lg bg-brand py-3 font-bold text-white">Log in</button>
      </form>
    </main>
  );
}
