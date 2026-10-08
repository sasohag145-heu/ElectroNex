import Link from "next/link";
import type { P } from "@/lib/products";
import { taka, discountPct } from "@/lib/format";
import AddToCart from "./AddToCart";
export default function ProductCard({ p }: { p: P }) {
  const d = discountPct(p.price, p.oldPrice); const image = p.images[0]?.url || "";
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <Link href={`/products/${p.slug}`} className="relative block aspect-square bg-brand-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
        {d > 0 && <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">-{d}%</span>}
        {p.isNew && <span className="absolute right-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">NEW</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs text-gray-500">{p.category.name}</span>
        <Link href={`/products/${p.slug}`} className="line-clamp-2 text-sm font-semibold">{p.name}</Link>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-brand">{taka(p.price)}</span>
          {p.oldPrice ? <span className="text-xs text-gray-400 line-through">{taka(p.oldPrice)}</span> : null}
        </div>
        <span className={`text-xs font-medium ${p.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>{p.stock > 0 ? "In stock" : "Out of stock"}</span>
        <div className="mt-2"><AddToCart p={{ id: p.id, slug: p.slug, name: p.name, price: p.price, stock: p.stock, image }} /></div>
        <Link href={`/products/${p.slug}`} className="mt-1 text-center text-xs text-gray-500 underline">View Details</Link>
      </div>
    </div>
  );
}
