"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { taka } from "@/lib/format";
export default function CartPage() {
  const { items, setQty, remove, total } = useCart();
  if (items.length === 0) return <main className="mx-auto max-w-2xl px-4 py-16 text-center"><p className="text-lg font-semibold">Your cart is empty</p><Link href="/shop" className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white">Continue shopping</Link></main>;
  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <ul className="mt-4 divide-y">
        {items.map((i) => (
          <li key={i.id} className="flex gap-3 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.image} alt={i.name} className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <Link href={`/products/${i.slug}`} className="text-sm font-semibold">{i.name}</Link>
              <p className="text-sm text-brand">{taka(i.price)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => setQty(i.id, i.quantity - 1)} className="h-9 w-9 rounded-lg border" aria-label="Decrease">−</button>
                <span className="w-6 text-center">{i.quantity}</span>
                <button onClick={() => setQty(i.id, i.quantity + 1)} className="h-9 w-9 rounded-lg border" aria-label="Increase">+</button>
                <button onClick={() => remove(i.id)} className="ml-auto text-sm text-red-600">Remove</button>
              </div>
            </div>
            <p className="text-sm font-bold">{taka(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 rounded-xl bg-brand-light p-4">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{taka(total)}</span></div>
        <div className="mt-1 flex justify-between text-lg font-bold"><span>Total</span><span>{taka(total)}</span></div>
        <p className="mt-1 text-xs text-gray-500">Delivery charge is confirmed by phone.</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href="/shop" className="rounded-lg border py-3 text-center font-semibold">Continue shopping</Link>
        <Link href="/checkout" className="rounded-lg bg-brand py-3 text-center font-semibold text-white">Checkout</Link>
      </div>
    </main>
  );
}
