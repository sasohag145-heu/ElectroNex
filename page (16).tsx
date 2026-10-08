import { db } from "@/lib/db";
import { listProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";
export const metadata = { title: "Shop", description: "Browse all ElectroNex electronics and accessories." };
type SP = { q?: string; cat?: string; min?: string; max?: string; sort?: string; stock?: string };
export default async function Shop({ searchParams: s }: { searchParams: SP }) {
  const [cats, items] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    listProducts({ q: s.q, cat: s.cat, min: Number(s.min) || undefined, max: Number(s.max) || undefined, sort: s.sort, inStock: s.stock === "1" }),
  ]);
  const f = "w-full rounded-lg border px-3 py-2 text-sm";
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Shop</h1>
      <form className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-6">
        <input name="q" defaultValue={s.q} placeholder="Search…" className={`${f} col-span-2`} />
        <select name="cat" defaultValue={s.cat || ""} className={f}><option value="">All categories</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
        <select name="sort" defaultValue={s.sort || "newest"} className={f}><option value="newest">Newest</option><option value="price-asc">Price: Low → High</option><option value="price-desc">Price: High → Low</option></select>
        <input name="min" type="number" defaultValue={s.min} placeholder="Min ৳" className={f} />
        <input name="max" type="number" defaultValue={s.max} placeholder="Max ৳" className={f} />
        <label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" name="stock" value="1" defaultChecked={s.stock === "1"} /> In stock only</label>
        <button className="col-span-2 rounded-lg bg-brand py-2 text-sm font-semibold text-white md:col-span-1">Apply</button>
      </form>
      <p className="mt-4 text-sm text-gray-500">{items.length} product(s)</p>
      {items.length === 0 ? <p className="mt-10 text-center text-gray-500">No products match your filters.</p> :
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </main>
  );
}
