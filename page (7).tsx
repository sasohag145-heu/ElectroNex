import Link from "next/link";
import { db } from "@/lib/db";
import { taka } from "@/lib/format";
export default async function Products() {
  const items = await db.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } } });
  return (
    <>
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Products</h1><Link href="/admin/products/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">+ Add</Link></div>
      <ul className="mt-3 space-y-2">{items.map((p) => (
        <li key={p.id}><Link href={`/admin/products/${p.id}`} className="flex gap-3 rounded-xl border bg-white p-3 text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]?.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          <div className="flex-1"><p className="font-semibold">{p.name}</p><p className="text-gray-500">{p.category.name} · {taka(p.price)}</p>
            <p className={p.stock > 0 ? "text-emerald-600" : "text-red-600"}>Stock: {p.stock}{!p.active && " · Hidden"}</p></div>
        </Link></li>))}
      </ul>
    </>
  );
}
