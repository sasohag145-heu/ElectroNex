import Link from "next/link";
import { db } from "@/lib/db";
import { listProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";
const Section = ({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) => (
  <section className="mx-auto mt-10 max-w-6xl px-4">
    <div className="mb-4 flex items-end justify-between"><h2 className="text-xl font-bold">{title}</h2>{href && <Link href={href} className="text-sm font-semibold text-brand">View all →</Link>}</div>
    {children}
  </section>
);
const Grid = ({ items }: { items: Awaited<ReturnType<typeof listProducts>> }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
);
export default async function Home() {
  const [cats, featured, latest, offers] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    listProducts({ featured: true, take: 4 }),
    listProducts({ isNew: true, take: 4 }),
    listProducts({ discounted: true, take: 4 }),
  ]);
  return (
    <main>
      <section className="bg-gradient-to-br from-brand-dark to-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Bangladesh's gadget store</p>
          <h1 className="mt-2 max-w-xl text-3xl font-extrabold sm:text-5xl">Smart gadgets. Honest prices. Cash on delivery.</h1>
          <p className="mt-3 max-w-md text-blue-100">Earbuds, smart watches, chargers and more — delivered to your door.</p>
          <Link href="/shop" className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-bold text-brand">Shop Now</Link>
        </div>
      </section>
      <Section title="Shop by category">
        <div className="flex flex-wrap gap-2">{cats.map((c) => <Link key={c.id} href={`/shop?cat=${c.slug}`} className="rounded-full border bg-brand-light px-4 py-2 text-sm font-medium text-brand">{c.name}</Link>)}</div>
      </Section>
      <Section title="Featured products" href="/shop"><Grid items={featured} /></Section>
      <Section title="New arrivals" href="/shop?sort=newest"><Grid items={latest} /></Section>
      <Section title="Special offers" href="/shop"><Grid items={offers} /></Section>
      <Section title="Why choose ElectroNex">
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Genuine products","Quality-checked gadgets"],["Cash on delivery","Pay when you receive"],["Fast delivery","Across Bangladesh"]].map(([t, d]) => <div key={t} className="rounded-xl border p-4"><p className="font-semibold">{t}</p><p className="text-sm text-gray-600">{d}</p></div>)}
        </div>
      </Section>
      <Section title="Customer reviews">
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Rahim, Dhaka","Earbuds এসেছে দুই দিনে, sound খুব ভালো।"],["Nusrat, Chattogram","Packaging was great and the charger works perfectly."],["Sajid, Sylhet","COD made it easy to trust. Will order again."]].map(([n, t]) => <div key={n} className="rounded-xl border p-4"><p className="text-amber-500">★★★★★</p><p className="mt-1 text-sm">{t}</p><p className="mt-2 text-xs text-gray-500">— {n}</p></div>)}
        </div>
      </Section>
    </main>
  );
}
