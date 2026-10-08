import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireAdmin, COOKIE } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default async function Panel({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  async function logout() { "use server"; cookies().delete(COOKIE); redirect("/admin/login"); }
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-4 overflow-x-auto bg-ink px-4 py-3 text-sm text-white">
        <b>ElectroNex Admin</b><Link href="/admin/dashboard">Dashboard</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/products">Products</Link><Link href="/admin/categories">Categories</Link><Link href="/admin/password">Password</Link>
        <form action={logout} className="ml-auto"><button>Logout</button></form>
      </nav>
      <div className="mx-auto max-w-4xl p-4">{children}</div>
    </div>
  );
}
