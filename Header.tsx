"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-ink">Electro<span className="text-brand">Nex</span></Link>
        <form action="/shop" className="flex flex-1">
          <input name="q" placeholder="Search products…" className="w-full rounded-l-lg border px-3 py-2 text-sm outline-none focus:border-brand" />
          <button className="rounded-r-lg bg-brand px-3 text-sm font-semibold text-white">Search</button>
        </form>
        <Link href="/shop" className="hidden text-sm font-medium sm:block">Shop</Link>
        <Link href="/cart" className="relative rounded-lg border px-3 py-2 text-sm font-semibold">
          Cart{count > 0 && <span className="ml-1 rounded-full bg-brand px-1.5 text-xs text-white">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
