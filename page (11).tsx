"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { taka } from "@/lib/format";
export default function Checkout() {
  const { items, total, clear } = useCart(); const router = useRouter();
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  if (items.length === 0) return <main className="px-4 py-16 text-center"><p>Your cart is empty.</p><Link href="/shop" className="text-brand underline">Go to shop</Link></main>;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.get("name"), phone: f.get("phone"), address: f.get("address"), paymentMethod: "COD", items: items.map((i) => ({ productId: i.id, quantity: i.quantity })) }) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) return setErr(j.error || "Something went wrong");
    clear(); router.push(`/order/${j.orderNo}`);
  }
  const f = "mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-brand";
  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-sm font-medium">Full name<input name="name" required minLength={2} className={f} /></label>
        <label className="block text-sm font-medium">Phone number<input name="phone" required inputMode="tel" placeholder="01XXXXXXXXX" className={f} /></label>
        <label className="block text-sm font-medium">Delivery address<textarea name="address" required minLength={8} rows={3} placeholder="House, road, area, district" className={f} /></label>
        <div className="rounded-lg border p-3 text-sm"><p className="font-medium">Payment method</p><label className="mt-1 flex items-center gap-2"><input type="radio" checked readOnly /> Cash on Delivery</label></div>
        <div className="rounded-xl bg-brand-light p-4 text-sm">
          {items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.quantity}</span><span>{taka(i.price * i.quantity)}</span></div>)}
          <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>{taka(total)}</span></div>
        </div>
        {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-brand py-3 font-bold text-white disabled:opacity-60">{busy ? "Placing order…" : "Place Order"}</button>
      </form>
    </main>
  );
}
