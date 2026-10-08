import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { withImages, listProducts } from "@/lib/products";
import { taka, discountPct } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";
const get = (slug: string) => db.product.findFirst({ where: { slug, active: true }, include: withImages });
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await get(params.slug); if (!p) return {};
  return { title: p.name, description: p.description.slice(0, 155), openGraph: { title: p.name, images: p.images[0] ? [p.images[0].url] : [] } };
}
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await get(params.slug); if (!p) notFound();
  const related = (await listProducts({ cat: p.category.slug, take: 5 })).filter((r) => r.id !== p.id).slice(0, 4);
  const d = discountPct(p.price, p.oldPrice); const specs = (p.specs as [string, string][]) || [];
  const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, image: p.images.map((i) => i.url), description: p.description, offers: { "@type": "Offer", priceCurrency: "BDT", price: p.price, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]?.url} alt={p.name} className="aspect-square w-full rounded-xl bg-brand-light object-cover" />
          <div className="mt-2 flex gap-2 overflow-x-auto">{p.images.slice(1).map((i) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={i.id} src={i.url} alt="" className="h-20 w-20 rounded-lg object-cover" />)}</div>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{p.category.name}</p>
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <div className="flex items-baseline gap-3"><span className="text-2xl font-extrabold text-brand">{taka(p.price)}</span>{p.oldPrice ? <span className="text-gray-400 line-through">{taka(p.oldPrice)}</span> : null}{d > 0 && <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">-{d}%</span>}</div>
          <p className={`text-sm font-medium ${p.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>{p.stock > 0 ? `In stock (${p.stock} left)` : "Out of stock"}</p>
          <AddToCart withQty p={{ id: p.id, slug: p.slug, name: p.name, price: p.price, stock: p.stock, image: p.images[0]?.url || "" }} />
          <p className="pt-2 text-sm leading-relaxed text-gray-700">{p.description}</p>
          {specs.length > 0 && <table className="w-full text-sm"><tbody>{specs.map(([k, v]) => <tr key={k} className="border-t"><td className="py-2 font-medium">{k}</td><td className="py-2 text-gray-600">{v}</td></tr>)}</tbody></table>}
        </div>
      </div>
      {related.length > 0 && <><h2 className="mb-3 mt-10 text-xl font-bold">Related products</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></>}
    </main>
  );
}
