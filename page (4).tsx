import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, requireAdmin } from "@/lib/auth";
export default function Password({ searchParams }: { searchParams: { err?: string; ok?: string } }) {
  async function change(f: FormData) {
    "use server";
    const id = await requireAdmin();
    const cur = String(f.get("current") || ""), next = String(f.get("next") || ""), again = String(f.get("again") || "");
    const bad = (m: string) => redirect(`/admin/password?err=${encodeURIComponent(m)}`);
    const a = await db.adminUser.findUnique({ where: { id } });
    if (!a || !(await bcrypt.compare(cur, a.passwordHash))) return bad("Current password is wrong");
    if (next.length < 10 || next.length > 100) return bad("New password must be 10–100 characters");
    if (next !== again) return bad("New passwords do not match");
    if (next === cur) return bad("New password must be different");
    await db.adminUser.update({ where: { id }, data: { passwordHash: await bcrypt.hash(next, 12), passwordChangedAt: new Date() } });
    await createSession(id); // other logged-in devices are signed out
    redirect("/admin/password?ok=1");
  }
  const i = "mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm";
  return (
    <>
      <h1 className="text-xl font-bold">Change password</h1>
      <form action={change} className="mt-3 max-w-sm space-y-3">
        <label className="block text-sm font-medium">Current password<input name="current" type="password" required className={i} /></label>
        <label className="block text-sm font-medium">New password (10+ characters)<input name="next" type="password" required minLength={10} className={i} /></label>
        <label className="block text-sm font-medium">Repeat new password<input name="again" type="password" required minLength={10} className={i} /></label>
        {searchParams.err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{searchParams.err}</p>}
        {searchParams.ok && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Password changed. Other devices were logged out.</p>}
        <button className="w-full rounded-lg bg-brand py-3 font-bold text-white">Change password</button>
      </form>
    </>
  );
}
