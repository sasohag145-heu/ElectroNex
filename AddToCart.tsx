"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
type Props = { p: { id: string; slug: string; name: string; price: number; stock: number; image: string }; withQty?: boolean };
export default function AddToCart({ p, withQty }: Props) {
  const { add } = useCart(); const router = useRouter();
  const [q, setQ] = useState(1); const [done, setDone] = useState(false);
  if (p.stock <= 0) return <button disabled className="w-full rounded-lg bg-gray-200 py-2.5 text-sm font-semibold text-gray-500">Out of stock</button>;
  const item = { id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image, stock: p.stock };
  return (
    <div className="space-y-2">
      {withQty && (
        <div className="flex items-center gap-3">
          <button onClick={() => setQ(Math.max(1, q - 1))} className="h-10 w-10 rounded-lg border text-lg" aria-label="Decrease">−</button>
          <span className="w-8 text-center font-semibold">{q}</span>
          <button onClick={() => setQ(Math.min(p.stock, q + 1))} className="h-10 w-10 rounded-lg border text-lg" aria-label="Increase">+</button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => { add(item, q); setDone(true); setTimeout(() => setDone(false), 1200); }} className="rounded-lg border border-brand py-2.5 text-sm font-semibold text-brand">{done ? "Added ✓" : "Add to Cart"}</button>
        <button onClick={() => { add(item, q); router.push("/cart"); }} className="rounded-lg bg-brand py-2.5 text-sm font-semibold text-white">Buy Now</button>
      </div>
    </div>
  );
}
